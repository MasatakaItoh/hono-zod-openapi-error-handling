import { z } from "@hono/zod-openapi";

import type { createRoute } from "@hono/zod-openapi";

const errorsSchema = z.record(z.array(z.string())).optional();
const messageSchema = z.string();

const createErrorResponseSchema = ({
  errorsExample,
  messageExample,
}: {
  errorsExample?: z.infer<typeof errorsSchema>;
  messageExample: z.infer<typeof messageSchema>;
}) =>
  z
    .object({
      errors: errorsSchema,
      message: messageSchema,
    })
    .openapi({
      example: {
        errors: errorsExample,
        message: messageExample,
      },
    });

type ErrorResponse = z.infer<ReturnType<typeof createErrorResponseSchema>>;

const errorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: createErrorResponseSchema({
          errorsExample: {
            email: ["The email address format is incorrect"],
            password: ["Password must be at least 8 characters long"],
          },
          messageExample: "Bad Request",
        }),
      },
    },
  },
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: createErrorResponseSchema({
          messageExample: "Unauthorized",
        }),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: createErrorResponseSchema({
          messageExample: "Internal Server Error",
        }),
      },
    },
  },
} as const satisfies Parameters<typeof createRoute>["0"]["responses"];

const protectedErrorResponses = {
  400: errorResponses["400"],
  401: errorResponses["401"],
  500: errorResponses["500"],
} satisfies Parameters<typeof createRoute>["0"]["responses"];

const publicErrorResponses = {
  400: errorResponses["400"],
  500: errorResponses["500"],
} satisfies Parameters<typeof createRoute>["0"]["responses"];

export { protectedErrorResponses, publicErrorResponses };

export type { ErrorResponse };
