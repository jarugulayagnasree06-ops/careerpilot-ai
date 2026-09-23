import { useEffect, useState } from "react";
import Auth from "./Auth";
import CareerAnalyzer from "./CareerAnalyzer";
import CareerAssistant from "./CareerAssistant";
import ResumeBuilder from "./ResumeBuilder";
import InterviewPractice from "./InterviewPractice";
import ProjectGenerator from "./ProjectGenerator";
import Dashboard from "./Dashboard";
import { supabase } from "./supabaseClient";
import "./App.css";
import Jobs from "./Jobs";
import Profile from "./Profile";

const navigation = [
  {
    id: "home",
    icon: "⌂",
    label: "Dashboard",
  },
  {
    id: "career",
    icon: "🎯",
    label: "Career Analysis",
  },
  {
    id: "assistant",
    icon: "🤖",
    label: "AI Assistant",
  },
  {
    id: "roadmap",
    icon: "🗺️",
    label: "My Roadmap",
  },
  {
    id: "resume",
    icon: "📄",
    label: "Resume Builder",
  },
  {
    id: "interview",
    icon: "🎤",
    label: "Interview Practice",
  },
  {
    id: "projects",
    icon: "🛠️",
    label: "Project Generator",
  },
  {
    id: "planner",
    icon: "📅",
    label: "Study Planner",
  },
  {
    id: "jobs",
    icon: "💼",
    label: "Jobs & Internships",
  },
  {
    id: "profile",
    icon: "👤",
    label: "Profile",
  },
];

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data } =
        await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          🚀
        </div>

        <h2>CareerPilot AI</h2>

        <p>
          Preparing your career workspace...
        </p>
      </div>
    );
  }

  if (!session && showAuth) {
    return (
      <Auth
        onLogin={(user) => {
          if (user) {
            setSession({
              user,
            });
          } else {
            setShowAuth(false);
          }
        }}
      />
    );
  }

  if (!session) {
    return (
      <LandingPage
        onGetStarted={() =>
          setShowAuth(true)
        }
      />
    );
  }

  return (
    <CareerPilotApp
      user={session.user}
      onLogout={async () => {
        await supabase.auth.signOut();

        setSession(null);
        setShowAuth(false);
      }}
    />
  );
}

function CareerPilotApp({
  user,
  onLogout,
}) {
  const [activeSection, setActiveSection] =
    useState("home");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleNavigation = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const getSectionTitle = () => {
    const titles = {
      home: "Dashboard",
      career: "Career Analysis",
      assistant: "AI Career Assistant",
      roadmap: "My Roadmap",
      resume: "Resume Builder",
      interview: "Interview Practice",
      projects: "Project Generator",
      planner: "Study Planner",
      jobs: "Jobs & Internships",
      profile: "Profile",
    };

    return (
      titles[activeSection] ||
      "Dashboard"
    );
  };

  return (
    <div className="workspace">
      <aside
        className={`sidebar ${
          mobileMenuOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            🚀
          </div>

          <div>
            <strong>CareerPilot</strong>
            <span>AI WORKSPACE</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {(
              user?.user_metadata?.full_name ||
              user?.email ||
              "S"
            )[0].toUpperCase()}
          </div>

          <div>
            <strong>
              {user?.user_metadata?.full_name ||
                "Student"}
            </strong>

            <span>
              {user?.email ||
                "CareerPilot User"}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                activeSection === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                handleNavigation(
                  item.id
                )
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <span>💡</span>

          <div>
            <strong>Career Tip</strong>

            <p>
              Build projects that prove
              your skills.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          ↪ Logout
        </button>
      </aside>

      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <main className="workspace-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              ☰
            </button>

            <div>
              <div className="breadcrumb">
                CareerPilot / Workspace
              </div>

              <h1>
                {getSectionTitle()}
              </h1>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="notification-button"
            >
              🔔
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">
                {(
                  user?.user_metadata?.full_name ||
                  user?.email ||
                  "S"
                )[0].toUpperCase()}
              </div>

              <div>
                <strong>
                  {user?.user_metadata?.full_name ||
                    "Student"}
                </strong>

                <span>
                  Student
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="workspace-content">
          {activeSection === "home" && (
            <DashboardHome
              user={user}
              onNavigate={
                handleNavigation
              }
            />
          )}

          {activeSection === "career" && (
            <CareerAnalyzer
              user={user}
            />
          )}

          {activeSection === "assistant" && (
            <CareerAssistant
              user={user}
            />
          )}

          {activeSection === "resume" && (
            <ResumeBuilder
              user={user}
            />
          )}

          {activeSection === "interview" && (
            <InterviewPractice
              user={user}
            />
          )}

          {activeSection === "projects" && (
            <ProjectGenerator
              user={user}
            />
          )}

          {activeSection === "roadmap" && (
            <ComingSoon
              icon="🗺️"
              title="Personal Career Roadmap"
              description="Your personalized skill and career roadmap will appear here."
              onStart={() =>
                handleNavigation(
                  "career"
                )
              }
              buttonText="Start Career Analysis"
            />
          )}

          {activeSection === "planner" && (
            <ComingSoon
              icon="📅"
              title="Study Planner"
              description="Plan your daily learning, tasks and career preparation."
              buttonText="Study Planner Coming Soon"
            />
          )}

          {activeSection === "jobs" && (
            <ComingSoon
              icon="💼"
              title="Jobs & Internships"
              description="Your personalized internship and job discovery workspace will appear here."
              buttonText="Jobs Module Coming Soon"
            />
          )}

          {activeSection === "profile" && (
            <ProfilePage user={user} />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardHome({
  user,
  onNavigate,
}) {
  const name =
    user?.user_metadata?.full_name ||
    "Student";

  return (
    <section className="dashboard-home">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            YOUR CAREER WORKSPACE
          </span>

          <h2>
            Welcome back,{" "}
            <strong>{name}</strong> 👋
          </h2>

          <p>
            Build your skills, improve your
            readiness and move closer to
            your target career.
          </p>

          <div className="dashboard-actions">
            <button
              type="button"
              onClick={() =>
                onNavigate("career")
              }
            >
              Analyze My Career →
            </button>

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                onNavigate(
                  "assistant"
                )
              }
            >
              Ask AI Assistant
            </button>
          </div>
        </div>

        <div className="dashboard-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-rocket">
            🚀
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          icon="🎯"
          title="Career Readiness"
          value="0%"
          subtitle="Complete analysis"
        />

        <StatCard
          icon="📚"
          title="Skill Gaps"
          value="—"
          subtitle="Analyze your profile"
        />

        <StatCard
          icon="📄"
          title="Resume"
          value="0%"
          subtitle="Build your resume"
        />

        <StatCard
          icon="💼"
          title="Applications"
          value="0"
          subtitle="Track your progress"
        />
      </div>

      <div className="dashboard-tools">
        <div className="section-heading">
          <div>
            <span>
              CAREERPILOT TOOLS
            </span>

            <h2>
              Start building your career
            </h2>
          </div>
        </div>

        <div className="tool-grid">
          <ToolCard
            icon="🎯"
            title="Career Analysis"
            text="Find skill gaps and calculate your current readiness."
            button="Analyze"
            onClick={() =>
              onNavigate("career")
            }
          />

          <ToolCard
            icon="🤖"
            title="AI Career Assistant"
            text="Ask career questions about skills, projects and interviews."
            button="Ask AI"
            onClick={() =>
              onNavigate(
                "assistant"
              )
            }
          />

          <ToolCard
            icon="📄"
            title="Resume Builder"
            text="Create a professional student resume with a live preview."
            button="Build Resume"
            onClick={() =>
              onNavigate("resume")
            }
          />

          <ToolCard
            icon="🎤"
            title="Interview Practice"
            text="Practice technical and HR interview questions."
            button="Practice"
            onClick={() =>
              onNavigate(
                "interview"
              )
            }
          />

          <ToolCard
            icon="🛠️"
            title="Project Generator"
            text="Generate portfolio projects based on your target career."
            button="Generate"
            onClick={() =>
              onNavigate(
                "projects"
              )
            }
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function ToolCard({
  icon,
  title,
  text,
  button,
  onClick,
}) {
  return (
    <div className="tool-card">
      <div className="tool-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button
        type="button"
        onClick={onClick}
      >
        {button} →
      </button>
    </div>
  );
}

function ComingSoon({
  icon,
  title,
  description,
  buttonText,
  onStart,
}) {
  return (
    <section className="coming-soon-page">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          {icon}
        </div>

        <span>
          CAREERPILOT AI
        </span>

        <h1>{title}</h1>

        <p>{description}</p>

        {onStart ? (
          <button
            type="button"
            onClick={onStart}
          >
            {buttonText} →
          </button>
        ) : (
          <div className="coming-badge">
            ⚡ Module in development
          </div>
        )}
      </div>
    </section>
  );
}

function ProfilePage({ user }) {
  const fullName =
    user?.user_metadata?.full_name ||
    "Student";

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-large-avatar">
          {fullName[0]?.toUpperCase()}
        </div>

        <span className="profile-label">
          CAREERPILOT ACCOUNT
        </span>

        <h1>{fullName}</h1>

        <p>{user?.email}</p>

        <div className="profile-info-grid">
          <div>
            <span>Account ID</span>

            <strong>
              {user?.id
                ? `${user.id.slice(
                    0,
                    8
                  )}...`
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Authentication
            </span>

            <strong>
              Supabase Auth
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPage({
  onGetStarted,
}) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span>🚀</span>

          <strong>
            CareerPilot AI
          </strong>
        </div>

        <button
          type="button"
          onClick={onGetStarted}
        >
          Get Started →
        </button>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="hero-badge">
            ✦ AI-POWERED CAREER WORKSPACE
          </div>

          <h1>
            Turn your college journey
            <br />
            into a{" "}
            <span>
              career roadmap.
            </span>
          </h1>

          <p>
            CareerPilot AI helps students
            understand their skills, build
            projects, improve resumes and
            prepare for interviews.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              onClick={onGetStarted}
            >
              Start Your Career Journey →
            </button>
          </div>

          <div className="hero-note">
            Free to get started · Student
            focused · No employment guarantee
          </div>
        </section>

        <section className="landing-features">
          <Feature
            icon="🎯"
            title="Career Analysis"
            text="Understand your current skills and identify gaps for your target role."
          />

          <Feature
            icon="🤖"
            title="AI Career Assistant"
            text="Get practical guidance about skills, projects, resumes and interviews."
          />

          <Feature
            icon="📄"
            title="Resume Builder"
            text="Create and preview a clean professional student resume."
          />

          <Feature
            icon="🎤"
            title="Interview Practice"
            text="Practice technical, HR and behavioral interview questions."
          />
        </section>

        <section className="landing-how">
          <span>HOW IT WORKS</span>

          <h2>
            From student profile to career
            preparation
          </h2>

          <div className="how-grid">
            <HowStep
              number="01"
              title="Build your profile"
              text="Tell CareerPilot about your education, skills and career target."
            />

            <HowStep
              number="02"
              title="Find your gaps"
              text="Analyze the skills needed for your selected role."
            />

            <HowStep
              number="03"
              title="Build evidence"
              text="Create projects, improve your resume and practice interviews."
            />

            <HowStep
              number="04"
              title="Prepare for opportunities"
              text="Use your personalized workspace to organize your career preparation."
            />
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <strong>
          CareerPilot AI
        </strong>

        <span>
          Career guidance is informational
          and does not guarantee employment.
        </span>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="landing-feature">
      <div>{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function HowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="how-step">
      <span>{number}</span>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default App;