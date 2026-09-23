import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          throw error;
        }

        setMessage("Login successful! 🎉");

        if (onLogin) {
          onLogin(data.user);
        }
      } else {
        // REGISTER
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }

        if (password.length < 6) {
          throw new Error(
            "Password must contain at least 6 characters."
          );
        }

        const { data, error } =
          await supabase.auth.signUp({
            email,
            password,

            options: {
              data: {
                full_name: name,
              },
            },
          });

        if (error) {
          throw error;
        }

        if (data.session) {
          setMessage("Account created successfully! 🎉");

          if (onLogin) {
            onLogin(data.user);
          }
        } else {
          setMessage(
            "Account created! Please check your email to confirm your account."
          );
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);

    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">
          <span>🚀</span>
          <span>CareerPilot AI</span>
        </div>

        {/* HEADING */}
        <h1>
          {isLogin
            ? "Welcome Back"
            : "Create Your Account"}
        </h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Continue your journey toward becoming job-ready."
            : "Start building your career with CareerPilot AI."}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME */}
          {!isLogin && (
            <div className="auth-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="auth-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="auth-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              minLength={6}
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login →"
              : "Create Account →"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* SWITCH */}
        <div className="auth-switch">
          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={switchMode}
          >
            {isLogin
              ? "Create Account"
              : "Login"}
          </button>
        </div>

        {/* BACK */}
        <button
          type="button"
          className="back-home"
          onClick={onLogin}
        >
          ← Back to CareerPilot
        </button>

      </div>
    </div>
  );
}

export default Auth;