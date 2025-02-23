import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

import { createOpenApiHono } from "./hono";
import { userRoute } from "./route";

import type { ErrorResponse } from "./error-schema";

const app = createOpenApiHono();

const apiRoutes = app.route(
  "/api",
  createOpenApiHono()
    .onError((error, c) => {
      if (error instanceof HTTPException) {
        return c.json<ErrorResponse>(
          {
            message: error.message,
            ...(error.cause instanceof ZodError && {
              errors: Object.fromEntries(
                Object.entries(error.cause.flatten().fieldErrors).filter(
                  (x): x is [string, string[]] => !!x[1],
                ),
              ),
            }),
          },
          error.status,
        );
      }
      return c.json<ErrorResponse>({ message: "Internal Server Error" }, 500);
    })
    .use(cors())
    .route("/user", userRoute)
);

type AppType = typeof apiRoutes;

if (process.env.NODE_ENV !== "production") {
  app
    .doc("/openapi", {
      openapi: "3.0.0",
      info: { version: "1.0.0", title: "My API" },
    })
    .get("/docs", swaggerUI({ url: "/openapi" }));
}

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export type { AppType };