import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Auth from "./Auth";
import Dashboard from "./Dashboard";
import CareerAnalyzer from "./CareerAnalyzer";
import CareerAssistant from "./CareerAssistant";
import ResumeBuilder from "./ResumeBuilder";
import InterviewPractice from "./InterviewPractice";
import ProjectGenerator from "./ProjectGenerator";
import Premium from "./Premium";
import AdminPayments from "./AdminPayments";

import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("home");

  const [approvedPayment, setApprovedPayment] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  // --------------------------------------------------
  // GET SESSION
  // --------------------------------------------------
  useEffect(() => {
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (!newSession) {
        setApprovedPayment(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // GET USER SESSION
  // --------------------------------------------------
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
    }

    setSession(data?.session || null);
    setLoading(false);
  };

  // --------------------------------------------------
  // CHECK PREMIUM + ADMIN
  // --------------------------------------------------
  useEffect(() => {
    if (session?.user?.id) {
      checkAccess(session.user.id);
    }
  }, [session]);

  const checkAccess = async (userId) => {
    setCheckingAccess(true);

    try {
      // Check approved payment
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select(
          "id, package_id, package_name, amount, status, approved_at"
        )
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("approved_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (paymentError) {
        console.error("Payment check error:", paymentError);
        setApprovedPayment(null);
      } else {
        setApprovedPayment(payment || null);
      }

      // Check admin
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (adminError) {
        console.error("Admin check error:", adminError);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!adminData);
      }
    } catch (error) {
      console.error("Access check error:", error);
      setApprovedPayment(null);
      setIsAdmin(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSession(null);
    setApprovedPayment(null);
    setIsAdmin(false);
    setActiveSection("home");
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  const handleNavigation = (section) => {
    setActiveSection(section);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // PACKAGE ACCESS
  // --------------------------------------------------
  const packageAccess = {
    resume: ["resume"],

    career: [
      "career",
      "assistant",
      "roadmap",
    ],

    interview: [
      "resume",
      "interview",
    ],

    placement: [
      "resume",
      "career",
      "assistant",
      "roadmap",
      "interview",
      "projects",
    ],

    pro: [
      "career",
      "assistant",
      "roadmap",
      "resume",
      "interview",
      "projects",
      "planner",
      "jobs",
    ],
  };

  // --------------------------------------------------
  // FREE TRIAL
  // --------------------------------------------------
  const trialKey = session?.user?.id
    ? `careerpilot_trial_used_${session.user.id}`
    : null;

  const trialUsed = trialKey
    ? localStorage.getItem(trialKey) === "true"
    : false;

  const freeSections = [
    "home",
    "profile",
    "premium",
  ];

  // --------------------------------------------------
  // CHECK WHETHER USER CAN ACCESS SECTION
  // --------------------------------------------------
  const hasAccess = (section) => {
    // Home/profile/premium are always available
    if (freeSections.includes(section)) {
      return true;
    }

    // Admin
    if (section === "admin") {
      return isAdmin;
    }

    // Approved payment
    if (approvedPayment?.package_id) {
      const allowed =
        packageAccess[approvedPayment.package_id] || [];

      if (allowed.includes(section)) {
        return true;
      }
    }

    return false;
  };

  // --------------------------------------------------
  // PREMIUM LOCK
  // --------------------------------------------------
  const PremiumLock = () => {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "650px",
            width: "100%",
            textAlign: "center",
            padding: "45px 30px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, #ffffff, #f5f3ff)",
            boxShadow:
              "0 15px 45px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🔒
          </div>

          <h1
            style={{
              marginBottom: "12px",
              color: "#222",
            }}
          >
            Premium Feature
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            This feature is available with a CareerPilot
            one-time package.
          </p>

          <button
            onClick={() => handleNavigation("premium")}
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "14px 30px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, #6c5ce7, #8e44ad)",
              color: "white",
              boxShadow:
                "0 8px 20px rgba(108,92,231,0.3)",
            }}
          >
            View Premium Packages
          </button>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // RENDER SECTION
  // --------------------------------------------------
  const renderSection = () => {
    // HOME
    if (activeSection === "home") {
      return (
        <Dashboard
          onNavigate={handleNavigation}
        />
      );
    }

    // PROFILE
    if (activeSection === "profile") {
      const user = session?.user;

      return (
        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "35px",
              boxShadow:
                "0 10px 35px rgba(0,0,0,0.08)",
            }}
          >
            <h1>👤 My Profile</h1>

            <div style={{ marginTop: "25px" }}>
              <p>
                <strong>Name:</strong>{" "}
                {user?.user_metadata?.full_name ||
                  "CareerPilot User"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {user?.email || "Not available"}
              </p>

              <p>
                <strong>Account:</strong> Active
              </p>

              <p>
                <strong>Premium:</strong>{" "}
                {approvedPayment
                  ? `Yes — ${approvedPayment.package_name}`
                  : "No"}
              </p>

              {isAdmin && (
                <p>
                  <strong>Role:</strong> Administrator
                </p>
              )}
            </div>

            <button
              onClick={handleLogout}
              style={{
                marginTop: "25px",
                padding: "12px 25px",
                border: "none",
                borderRadius: "10px",
                background: "#e74c3c",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // PREMIUM
    if (activeSection === "premium") {
      return (
        <Premium
          onNavigate={handleNavigation}
        />
      );
    }

    // ADMIN
    if (activeSection === "admin") {
      if (!isAdmin) {
        return <PremiumLock />;
      }

      return <AdminPayments />;
    }

    // CAREER ANALYSIS
    if (activeSection === "career") {
      if (!hasAccess("career")) {
        return <PremiumLock />;
      }

      return (
        <CareerAnalyzer
          onNavigate={handleNavigation}
        />
      );
    }

    // AI ASSISTANT
    if (activeSection === "assistant") {
      if (!hasAccess("assistant")) {
        return <PremiumLock />;
      }

      return (
        <CareerAssistant
          onNavigate={handleNavigation}
        />
      );
    }

    // RESUME
    if (activeSection === "resume") {
      if (!hasAccess("resume")) {
        return <PremiumLock />;
      }

      return (
        <ResumeBuilder
          onNavigate={handleNavigation}
        />
      );
    }

    // INTERVIEW
    if (activeSection === "interview") {
      if (!hasAccess("interview")) {
        return <PremiumLock />;
      }

      return (
        <InterviewPractice
          onNavigate={handleNavigation}
        />
      );
    }

    // PROJECTS
    if (activeSection === "projects") {
      if (!hasAccess("projects")) {
        return <PremiumLock />;
      }

      return (
        <ProjectGenerator
          onNavigate={handleNavigation}
        />
      );
    }

    // ROADMAP
    if (activeSection === "roadmap") {
      if (!hasAccess("roadmap")) {
        return <PremiumLock />;
      }

      return (
        <ComingSoon
          title="Career Roadmap"
          icon="🗺️"
        />
      );
    }

    // PLANNER
    if (activeSection === "planner") {
      if (!hasAccess("planner")) {
        return <PremiumLock />;
      }

      return (
        <ComingSoon
          title="Study Planner"
          icon="📚"
        />
      );
    }

    // JOBS
    if (activeSection === "jobs") {
      if (!hasAccess("jobs")) {
        return <PremiumLock />;
      }

      return (
        <ComingSoon
          title="Job Opportunities"
          icon="💼"
        />
      );
    }

    return (
      <Dashboard
        onNavigate={handleNavigation}
      />
    );
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading || checkingAccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <div
          style={{
            fontSize: "40px",
          }}
        >
          🚀
        </div>

        <h2>Loading CareerPilot AI...</h2>
      </div>
    );
  }

  // --------------------------------------------------
  // LOGIN / SIGNUP
  // --------------------------------------------------
  if (!session) {
    return (
      <Auth
        onLogin={(newSession) => {
          setSession(newSession);
          setActiveSection("home");
        }}
      />
    );
  }

  // --------------------------------------------------
  // MAIN APP
  // --------------------------------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "white",
          borderBottom:
            "1px solid rgba(0,0,0,0.08)",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* LOGO */}
          <div
            onClick={() =>
              handleNavigation("home")
            }
            style={{
              fontSize: "22px",
              fontWeight: "800",
              cursor: "pointer",
              color: "#6c5ce7",
            }}
          >
            🚀 CareerPilot AI
          </div>

          {/* NAV LINKS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <NavButton
              text="Home"
              onClick={() =>
                handleNavigation("home")
              }
              active={activeSection === "home"}
            />

            <NavButton
              text="Career"
              onClick={() =>
                handleNavigation("career")
              }
              active={activeSection === "career"}
            />

            <NavButton
              text="AI Assistant"
              onClick={() =>
                handleNavigation("assistant")
              }
              active={
                activeSection === "assistant"
              }
            />

            <NavButton
              text="Resume"
              onClick={() =>
                handleNavigation("resume")
              }
              active={
                activeSection === "resume"
              }
            />

            <NavButton
              text="Interview"
              onClick={() =>
                handleNavigation("interview")
              }
              active={
                activeSection === "interview"
              }
            />

            <NavButton
              text="Projects"
              onClick={() =>
                handleNavigation("projects")
              }
              active={
                activeSection === "projects"
              }
            />

            <NavButton
              text="Premium"
              onClick={() =>
                handleNavigation("premium")
              }
              active={
                activeSection === "premium"
              }
            />

            {isAdmin && (
              <NavButton
                text="Admin"
                onClick={() =>
                  handleNavigation("admin")
                }
                active={
                  activeSection === "admin"
                }
              />
            )}

            <NavButton
              text="Profile"
              onClick={() =>
                handleNavigation("profile")
              }
              active={
                activeSection === "profile"
              }
            />
          </div>

          {/* USER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#555",
              }}
            >
              {session.user?.user_metadata
                ?.full_name ||
                session.user?.email
                  ?.split("@")[0] ||
                "User"}
            </span>

            <button
              onClick={handleLogout}
              style={{
                border: "none",
                borderRadius: "8px",
                padding: "9px 14px",
                cursor: "pointer",
                background: "#f1f1f1",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main>{renderSection()}</main>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "60px",
          padding: "30px 20px",
          textAlign: "center",
          background: "#111827",
          color: "#d1d5db",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2026 CareerPilot AI
        </p>

        <p
          style={{
            marginTop: "8px",
            fontSize: "13px",
          }}
        >
          Build your career. Build your future. 🚀
        </p>
      </footer>
    </div>
  );
}

// --------------------------------------------------
// NAV BUTTON
// --------------------------------------------------
function NavButton({
  text,
  onClick,
  active,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: active
          ? "#6c5ce7"
          : "transparent",
        color: active
          ? "white"
          : "#444",
        padding: "9px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: active
          ? "600"
          : "500",
        fontSize: "14px",
      }}
    >
      {text}
    </button>
  );
}

// --------------------------------------------------
// COMING SOON
// --------------------------------------------------
function ComingSoon({
  title,
  icon,
}) {
  return (
    <div
      style={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "50px",
          borderRadius: "22px",
          textAlign: "center",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.08)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "15px",
          }}
        >
          {icon}
        </div>

        <h1>{title}</h1>

        <p
          style={{
            color: "#666",
            lineHeight: "1.6",
          }}
        >
          This feature is coming soon to
          CareerPilot AI.
        </p>
      </div>
    </div>
  );
}

export default App;