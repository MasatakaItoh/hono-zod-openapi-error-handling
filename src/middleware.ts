import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type ProtectedEnvVariables = {
  accessToken: string;
};

const authMiddleware = createMiddleware<{
  Variables: Partial<ProtectedEnvVariables>;
}>(async (c, next) => {
  const authorizationHeader = c.req.header("Authorization");

  if (!authorizationHeader) {
    throw new HTTPException(401, { message: "Authorization header missing" });
  }

  const accessToken = authorizationHeader.replace("Bearer ", "");

  // TODO: アクセストークンの検証
  const token = 'honoiscool';
  if (accessToken !== token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("accessToken", accessToken);

  await next();
});

export { authMiddleware };