import { createRoute, z } from "@hono/zod-openapi";

import { publicErrorResponses } from "../error-schema";
import { createOpenApiHono } from "../hono";

const userRoute = createOpenApiHono().openapi(
  createRoute({
    method: "get",
    path: "/:id",
    request: {
      params: z.object({
        id: z
          .string()
          .min(3)
          .openapi({
            param: {
              name: "id",
              in: "path",
            },
            example: "1212121",
          }),
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              id: z.string().openapi({
                example: "123",
              }),
              name: z.string().openapi({
                example: "John Doe",
              }),
              age: z.number().openapi({
                example: 42,
              }),
            }),
          },
        },
        description: "Retrieve the user",
      },
      ...publicErrorResponses,
    },
  }),
  (c) => {
    const { id } = c.req.valid("param");
    return c.json(
      {
        id,
        age: 20,
        name: "Ultra-man",
      },
      200,
    );
  },
);

const publicRoute = createOpenApiHono().route("/users", userRoute);

export { publicRoute };