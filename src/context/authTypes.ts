import type { CognitoUser } from "amazon-cognito-identity-js";
import { createContext, type ReactNode } from "react";

export interface AuthContextValue {
  user: CognitoUser | null;
  isLoading: boolean;
  errorMessage: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
