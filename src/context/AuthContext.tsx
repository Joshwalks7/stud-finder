import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import {
  useEffect,
  useState,
} from "react";
import { AuthContext, type AuthProviderProps } from "./authTypes";
import { cognitoUserPool } from "../services/cognito";

function getCurrentUser(): Promise<CognitoUser | null> {
  const currentUser = cognitoUserPool.getCurrentUser();

  if (!currentUser) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    currentUser.getSession((error, session) => {
      resolve(error || !session || !session.isValid() ? null : currentUser);
    });
  });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  function signIn(email: string, password: string): Promise<void> {
    setErrorMessage(null);

    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: cognitoUserPool,
      });
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          setUser(cognitoUser);
          resolve();
        },
        onFailure: (error) => {
          setErrorMessage(error.message);
          reject(error);
        },
      });
    });
  }

  function signUp(email: string, password: string): Promise<void> {
    setErrorMessage(null);

    return new Promise((resolve, reject) => {
      cognitoUserPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: "email", Value: email })],
        [],
        (error) => {
          if (error) {
            setErrorMessage(error.message);
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  function confirmSignUp(email: string, code: string): Promise<void> {
    setErrorMessage(null);

    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: cognitoUserPool,
      });

      cognitoUser.confirmRegistration(code, true, (error) => {
        if (error) {
          setErrorMessage(error.message);
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  function signOut(): void {
    cognitoUserPool.getCurrentUser()?.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        errorMessage,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
