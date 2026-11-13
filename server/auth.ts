import type { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPoolId = process.env.COGNITO_USER_POOL_ID
  ?? process.env.VITE_COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID
  ?? process.env.VITE_COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
  throw new Error(
    "Cognito server configuration is missing. Set COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID.",
  );
}

const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId,
});

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = request.header("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    response.status(401).json({ message: "Authentication is required." });
    return;
  }

  try {
    // verify the token and add the id
    const payload = await accessTokenVerifier.verify(token);
    response.locals.userId = payload.sub;
    next();
  } catch {
    response.status(401).json({ message: "Your authentication token is invalid or expired." });
  }
}

export function getAuthenticatedUserId(response: Response): string {
  const userId = response.locals.userId;

  if (typeof userId !== "string") {
    throw new Error("Authenticated user ID is missing.");
  }

  return userId;
}
