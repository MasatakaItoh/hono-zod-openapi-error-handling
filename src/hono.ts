import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import type { Env } from "hono";
import type { ProtectedEnvVariables } from "./middleware";

const createOpenApiHono = <E extends Env = Env>() =>
  new OpenAPIHono<E>({
    defaultHook: (result) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: "Bad Request",
          cause: result.error,
        });
      }
    },
  });

const createProtectedOpenApiHono = () =>
  createOpenApiHono<{ Variables: ProtectedEnvVariables }>();

export { createOpenApiHono, createProtectedOpenApiHono }