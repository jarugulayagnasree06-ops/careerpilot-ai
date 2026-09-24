import React from "react";

function Dashboard({ user, onNavigate }) {
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Career Explorer";

  const goTo = (section) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  const features = [
    {
      icon: "🎯",
      title: "Career Analysis",
      description:
        "Discover career paths that match your skills, interests and goals.",
      section: "career",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        "Ask career questions and get personalized AI-powered guidance.",
      section: "assistant",
    },
    {
      icon: "📄",
      title: "Resume Builder",
      description:
        "Create a professional resume that highlights your strengths.",
      section: "resume",
    },
    {
      icon: "🎤",
      title: "Interview Practice",
      description:
        "Practice interview questions and improve your confidence.",
      section: "interview",
    },
    {
      icon: "🗺️",
      title: "Career Roadmap",
      description:
        "Follow a step-by-step roadmap toward your target career.",
      section: "roadmap",
    },
    {
      icon: "🛠️",
      title: "Project Generator",
      description:
        "Get project ideas to strengthen your portfolio and skills.",
      section: "projects",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* ================= HERO ================= */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-badge">
            ✨ AI-Powered Career Platform
          </div>

          <h1>
            Hello, <span>{userName}</span> 👋
          </h1>

          <p>
            Your journey to becoming job-ready starts here.
            Explore careers, build your resume, improve your
            skills and prepare for your dream job.
          </p>

          <div className="dashboard-buttons">

            <button
              className="dashboard-primary-button"
              onClick={() => goTo("career")}
            >
              🎯 Start Career Analysis
            </button>

            <button
              className="dashboard-secondary-button"
              onClick={() => goTo("resume")}
            >
              📄 Build My Resume
            </button>

          </div>

        </div>

        {/* Hero illustration */}

        <div className="dashboard-hero-visual">

          <div className="dashboard-orbit">

            <div className="dashboard-rocket">
              🚀
            </div>

            <div className="dashboard-floating-icon icon-one">
              💼
            </div>

            <div className="dashboard-floating-icon icon-two">
              🎯
            </div>

            <div className="dashboard-floating-icon icon-three">
              📈
            </div>

            <div className="dashboard-floating-icon icon-four">
              ⭐
            </div>

          </div>

        </div>

      </section>

      {/* ================= QUICK ACCESS ================= */}

      <section className="dashboard-stats">

        <div
          className="dashboard-stat-card"
          onClick={() => goTo("career")}
        >
          <div className="stat-icon">
            🎯
          </div>

          <div>
            <strong>Career</strong>
            <span>Discover your path</span>
          </div>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => goTo("resume")}
        >
          <div className="stat-icon">
            📄
          </div>

          <div>
            <strong>Resume</strong>
            <span>Build professionally</span>
          </div>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => goTo("interview")}
        >
          <div className="stat-icon">
            🎤
          </div>

          <div>
            <strong>Interview</strong>
            <span>Practice confidently</span>
          </div>
        </div>

        <div
          className="dashboard-stat-card"
          onClick={() => goTo("projects")}
        >
          <div className="stat-icon">
            🚀
          </div>

          <div>
            <strong>Projects</strong>
            <span>Build your portfolio</span>
          </div>
        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span>
              EXPLORE CAREERPILOT
            </span>

            <h2>
              Everything you need for your career
            </h2>

          </div>

          <p>
            One platform to help you move from learning
            to becoming job-ready.
          </p>

        </div>

        <div className="dashboard-feature-grid">

          {features.map((feature) => (

            <button
              key={feature.section}
              className="dashboard-feature-card"
              onClick={() => goTo(feature.section)}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

              <span className="feature-link">
                Explore →
              </span>

            </button>

          ))}

        </div>

      </section>

      {/* ================= CALL TO ACTION ================= */}

      <section className="dashboard-cta">

        <div className="dashboard-cta-content">

          <div className="dashboard-cta-icon">
            🚀
          </div>

          <div>

            <h2>
              Ready to become job-ready?
            </h2>

            <p>
              Take the first step toward your career goals
              with CareerPilot AI.
            </p>

          </div>

        </div>

        <button
          onClick={() => goTo("career")}
        >
          Get Started →
        </button>

      </section>

    </div>
  );
}

export default Dashboard;