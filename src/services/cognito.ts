import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
  throw new Error(
    "Missing Cognito configuration. Check VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env.",
  );
}

export const cognitoUserPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

export function getCurrentAccessToken(): Promise<string | null> {
  const currentUser = cognitoUserPool.getCurrentUser();

  if (!currentUser) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    currentUser.getSession((error, session) => {
      if (error || !session || !session.isValid()) {
        resolve(null);
        return;
      }

      resolve(session.getAccessToken().getJwtToken());
    });
  });
}
