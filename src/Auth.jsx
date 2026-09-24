import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // CREATE / UPDATE PROFILE
  // ==========================================

  const createProfile = async (
    user,
    userName,
    userEmail
  ) => {
    if (!user) {
      return;
    }

    const profileData = {
      id: user.id,

      full_name:
        userName ||
        user.user_metadata?.full_name ||
        "CareerPilot User",

      email:
        userEmail ||
        user.email ||
        "",
    };

    console.log(
      "Saving profile:",
      profileData
    );

    const { error } = await supabase
      .from("profiles")
      .upsert(
        profileData,
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.error(
        "PROFILE ERROR:",
        error
      );

      throw error;
    }

    console.log(
      "Profile saved successfully."
    );
  };

  // ==========================================
  // MESSAGE
  // ==========================================

  const showMessage = (
    text,
    type = "success"
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  // ==========================================
  // LOGIN / SIGNUP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      // ======================================
      // LOGIN
      // ======================================

      if (isLogin) {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });

        if (error) {
          console.error(
            "LOGIN ERROR:",
            error
          );

          showMessage(
            error.message ||
              "Login failed. Please check your email and password.",
            "error"
          );

          return;
        }

        // Update profile after login

        try {
          await createProfile(
            data.user,
            data.user?.user_metadata
              ?.full_name || "",
            data.user?.email || email.trim()
          );
        } catch (profileError) {
          console.error(
            "PROFILE UPDATE ERROR:",
            profileError
          );

          showMessage(
            `Login successful, but profile update failed: ${
              profileError.message ||
              "Unknown error"
            }`,
            "error"
          );

          return;
        }

        showMessage(
          "🎉 Welcome back to CareerPilot AI!",
          "success"
        );

        if (onLogin) {
          onLogin(data.user);
        }

        return;
      }

      // ======================================
      // SIGNUP VALIDATION
      // ======================================

      if (!name.trim()) {
        showMessage(
          "Please enter your full name.",
          "error"
        );

        return;
      }

      if (!email.trim()) {
        showMessage(
          "Please enter your email address.",
          "error"
        );

        return;
      }

      if (password.length < 6) {
        showMessage(
          "Password must contain at least 6 characters.",
          "error"
        );

        return;
      }

      // ======================================
      // SIGN UP
      // ======================================

      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),

          password: password,

          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

      // ======================================
      // SIGNUP ERROR
      // ======================================

      if (error) {
        console.error(
          "SIGNUP ERROR:",
          error
        );

        showMessage(
          error.message ||
            "Signup failed. Please try again.",
          "error"
        );

        return;
      }

      // ======================================
      // ACCOUNT CREATED
      // ======================================

      if (data.user) {
        // If email confirmation is disabled,
        // session will exist immediately.

        if (data.session) {
          try {
            await createProfile(
              data.user,
              name.trim(),
              email.trim()
            );
          } catch (profileError) {
            console.error(
              "PROFILE CREATION ERROR:",
              profileError
            );

            showMessage(
              `Account created, but profile creation failed: ${
                profileError.message ||
                "Unknown error"
              }`,
              "error"
            );

            return;
          }

          showMessage(
            "🎉 Your CareerPilot account is ready!",
            "success"
          );

          if (onLogin) {
            onLogin(data.user);
          }
        } else {
          // Email confirmation is enabled.

          showMessage(
            "🎉 Account created! Please check your email and confirm your account before logging in.",
            "success"
          );
        }
      }
    } catch (error) {
      console.error(
        "AUTHENTICATION ERROR:",
        error
      );

      showMessage(
        error.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SWITCH LOGIN / SIGNUP
  // ==========================================

  const switchMode = () => {
    setIsLogin(!isLogin);

    setName("");
    setEmail("");
    setPassword("");

    setMessage("");
    setMessageType("");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="auth-page">

      <div className="auth-glow auth-glow-one"></div>

      <div className="auth-glow auth-glow-two"></div>

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">

          <div className="auth-logo-icon">
            🚀
          </div>

          <div>
            <div className="auth-logo-title">
              CareerPilot
            </div>

            <div className="auth-logo-ai">
              AI
            </div>
          </div>

        </div>

        {/* TITLE */}

        <h1>
          {isLogin
            ? "Welcome Back 👋"
            : "Create Your Account 🚀"}
        </h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Continue your journey toward becoming job-ready."
            : "Start building your future with CareerPilot AI."}
        </p>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          {!isLogin && (
            <div className="auth-group">

              <label>
                Full Name
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  disabled={loading}
                />

              </div>

            </div>
          )}

          {/* EMAIL */}

          <div className="auth-group">

            <label>
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <span className="auth-input-icon">
                ✉️
              </span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="auth-group">

            <label>
              Password
            </label>

            <div className="auth-input-wrapper">

              <span className="auth-input-icon">
                🔒
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={6}
                required
                disabled={loading}
              />

            </div>

            {!isLogin && (
              <small className="password-hint">
                Password must be at least 6 characters.
              </small>
            )}

          </div>

          {/* SUBMIT BUTTON */}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Please wait...
              </>
            ) : isLogin ? (
              "Login to CareerPilot →"
            ) : (
              "Create My Account →"
            )}

          </button>

        </form>

        {/* MESSAGE */}

        {message && (
          <div
            className={`auth-message ${
              messageType === "error"
                ? "auth-message-error"
                : "auth-message-success"
            }`}
          >
            {message}
          </div>
        )}

        {/* LOGIN / SIGNUP SWITCH */}

        <div className="auth-switch">

          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={switchMode}
            disabled={loading}
          >
            {isLogin
              ? "Create Account"
              : "Login"}
          </button>

        </div>

        {/* FEATURES */}

        <div className="auth-features">

          <div>
            <span>🎯</span>
            <p>
              Career Guidance
            </p>
          </div>

          <div>
            <span>🤖</span>
            <p>
              AI Assistant
            </p>
          </div>

          <div>
            <span>💼</span>
            <p>
              Job Ready
            </p>
          </div>

        </div>

        {/* BACK HOME */}

        <button
          type="button"
          className="back-home"
          onClick={() =>
            onLogin && onLogin(null)
          }
          disabled={loading}
        >
          ← Back to CareerPilot
        </button>

      </div>
    </div>
  );
}

export default Auth;