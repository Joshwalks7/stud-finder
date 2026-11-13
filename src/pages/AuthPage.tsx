import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import "./AuthPage.css";

type AuthMode = "signIn" | "signUp" | "confirm";

function AuthPage() {
  const { user, errorMessage, signIn, signUp, confirmSignUp, signOut } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        await signIn(email, password);
        setMessage("You are signed in.");
      } else if (mode === "signUp") {
        await signUp(email, password);
        setMode("confirm");
        setMessage("Check your email for a confirmation code.");
      } else {
        await confirmSignUp(email, code);
        setMode("signIn");
        setMessage("Your account is confirmed. You can now sign in.");
      }
    } catch {
      // The authentication context stores the user-facing error message.
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return (
      <section className="auth-page">
        <h2>You are signed in</h2>
        <p>Signed in as {user.getUsername()}</p>
        <button className="button" type="button" onClick={signOut}>
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <h2>{mode === "confirm" ? "Confirm your account" : "Account"}</h2>

      {mode !== "confirm" && (
        <div className="auth-tabs" role="tablist" aria-label="Account actions">
          <button
            className={`auth-tab ${mode === "signIn" ? "active" : ""}`}
            type="button"
            onClick={() => setMode("signIn")}
          >
            Sign in
          </button>
          <button
            className={`auth-tab ${mode === "signUp" ? "active" : ""}`}
            type="button"
            onClick={() => setMode("signUp")}
          >
            Create account
          </button>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        {mode !== "confirm" && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>
        )}

        {mode === "confirm" && (
          <label>
            Confirmation code
            <input
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </label>
        )}

        {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
        {message && <p className="status-message" role="status">{message}</p>}

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Working..."
            : mode === "signIn"
              ? "Sign in"
              : mode === "signUp"
                ? "Create account"
                : "Confirm account"}
        </button>
      </form>
    </section>
  );
}

export default AuthPage;
