import { z } from "@hono/zod-openapi";

import type { createRoute } from "@hono/zod-openapi";

const ErrorsSchema = z.record(z.array(z.string())).optional();
const MessageSchema = z.string();

const createErrorResponseSchema = ({
  errorsExample,
  messageExample,
}: {
  errorsExample?: z.infer<typeof ErrorsSchema>;
  messageExample: z.infer<typeof MessageSchema>;
}) =>
  z
    .object({
      errors: ErrorsSchema,
      message: MessageSchema,
    })
    .openapi({
      example: {
        errors: errorsExample,
        message: messageExample,
      },
    });

type ErrorResponse = z.infer<
  ReturnType<typeof createErrorResponseSchema>
>;

const errorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: createErrorResponseSchema({
          errorsExample: {
            "username": [
              "名前が短すぎます",
              "名前に特殊文字を含めることはできません"
            ],
            password: ["パスワードは8文字以上で入力してください"],
          },
          messageExample: "Bad Request",
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

export { errorResponses };

export type { ErrorResponse };