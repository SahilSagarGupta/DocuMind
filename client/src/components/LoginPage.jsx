// This is the login/register screen shown before a user can access the chat

import { useState } from "react";
import { loginUser, registerUser } from "../api";

function LoginPage({ onLoginSuccess }) {
  // This tracks whether we're showing the login form or the register form
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      localStorage.setItem("documind_token", result.token);
      onLoginSuccess(result.user);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  }

  async function handleRegister(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await registerUser(name, email, password);

      // After successful registration, switch to login mode
      // so the user can log in with their new account
      setSuccessMessage("Account created. Please log in.");
      setIsRegisterMode(false);
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  }

  function toggleMode() {
    setIsRegisterMode(!isRegisterMode);
    setErrorMessage("");
    setSuccessMessage("");
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="bg-white border border-fog rounded-xl p-8 max-w-sm w-full">
        <h1 className="font-display font-semibold text-2xl text-ink mb-1">
          DocuMind
        </h1>
        <p className="text-slate text-sm mb-6">
          {isRegisterMode
            ? "Create an account to get started."
            : "Log in to ask questions about your documents."}
        </p>

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
          {isRegisterMode && (
            <>
              <label className="text-xs text-slate uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={function (event) {
                  setName(event.target.value);
                }}
                required
                className="w-full border border-fog rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-ink mb-4 mt-1"
              />
            </>
          )}

          <label className="text-xs text-slate uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={function (event) {
              setEmail(event.target.value);
            }}
            required
            className="w-full border border-fog rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-ink mb-4 mt-1"
          />

          <label className="text-xs text-slate uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={function (event) {
              setPassword(event.target.value);
            }}
            required
            className="w-full border border-fog rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-ink mb-4 mt-1"
          />

          {errorMessage && (
            <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-verified mb-4">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-paper text-sm rounded-lg py-2 mb-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? isRegisterMode
                ? "Creating account..."
                : "Logging in..."
              : isRegisterMode
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="w-full text-sm text-slate cursor-pointer hover:text-ink"
        >
          {isRegisterMode
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
