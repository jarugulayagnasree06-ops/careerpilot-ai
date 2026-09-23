import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Dashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    if (onLogout) {
      onLogout();
    }
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span>CareerPilot AI</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-badge">
              🎯 Student Career Dashboard
            </span>

            <h1>
              Welcome, <span>{displayName}</span> 👋
            </h1>

            <p>
              Build your career profile, discover skill gaps and become
              job-ready step by step.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">🎯</div>
            <h3>Career Analysis</h3>
            <p>
              Analyze your current skills and understand what you need
              for your target career.
            </p>
            <button>Analyze Career →</button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">📄</div>
            <h3>AI Resume</h3>
            <p>
              Build an ATS-friendly resume using your education, skills
              and projects.
            </p>
            <button>Build Resume →</button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">🎤</div>
            <h3>AI Interview</h3>
            <p>
              Practice technical and HR interview questions based on
              your target role.
            </p>
            <button>Start Interview →</button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">🛣️</div>
            <h3>Career Roadmap</h3>
            <p>
              Follow a personalized roadmap to improve your skills and
              prepare for jobs.
            </p>
            <button>View Roadmap →</button>
          </div>
        </div>

        <section className="dashboard-progress">
          <div>
            <span className="dashboard-section-label">
              YOUR PROGRESS
            </span>

            <h2>Career Readiness</h2>

            <p>
              Complete your career profile to unlock personalized
              recommendations.
            </p>
          </div>

          <div className="progress-circle">
            <strong>0%</strong>
            <span>Ready</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;