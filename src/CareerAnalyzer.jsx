import { useState } from "react";
import { supabase } from "./supabaseClient";

function CareerAnalyzer({ user }) {
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || "",
    branch: "",
    year: "",
    cgpa: "",
    targetRole: "",
    skills: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showReport, setShowReport] = useState(false);

  const roleSkills = {
    "Software Developer": [
      "javascript",
      "react",
      "sql",
      "git",
      "dsa",
    ],

    "AI/ML Engineer": [
      "python",
      "machine learning",
      "sql",
      "git",
      "deep learning",
    ],

    "Data Analyst": [
      "python",
      "sql",
      "excel",
      "power bi",
      "statistics",
    ],

    "Data Scientist": [
      "python",
      "sql",
      "machine learning",
      "statistics",
      "pandas",
    ],

    "Web Developer": [
      "html",
      "css",
      "javascript",
      "react",
      "git",
    ],

    "UI/UX Designer": [
      "figma",
      "user research",
      "wireframing",
      "prototyping",
      "design",
    ],
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const analyzeCareer = async (event) => {
    event.preventDefault();

    setMessage("");
    setResult(null);
    setShowReport(false);

    if (!user) {
      setMessage("Please login before analyzing your career.");
      return;
    }

    setLoading(true);

    try {
      const studentSkills = form.skills
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const requiredSkills = roleSkills[form.targetRole] || [];

      const matchedSkills = requiredSkills.filter((requiredSkill) =>
        studentSkills.some(
          (studentSkill) =>
            studentSkill === requiredSkill ||
            studentSkill.includes(requiredSkill) ||
            requiredSkill.includes(studentSkill)
        )
      );

      const missingSkills = requiredSkills.filter(
        (requiredSkill) => !matchedSkills.includes(requiredSkill)
      );

      const skillScore =
        requiredSkills.length > 0
          ? Math.round(
              (matchedSkills.length / requiredSkills.length) * 100
            )
          : 0;

      const cgpaScore = Math.min(
        100,
        Math.round((Number(form.cgpa) / 10) * 100)
      );

      const readinessScore = Math.round(
        skillScore * 0.7 + cgpaScore * 0.3
      );

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: form.name,
          branch: form.branch,
          year: form.year,
          cgpa: Number(form.cgpa),
          target_role: form.targetRole,
          skills: form.skills,
          readiness_score: readinessScore,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (error) {
        throw error;
      }

      setResult({
        score: readinessScore,
        skillScore,
        cgpaScore,
        matchedSkills,
        missingSkills,
        targetRole: form.targetRole,
      });

      setMessage("Career profile saved successfully!");
    } catch (error) {
      console.error("Career analysis error:", error);

      setMessage(
        error.message || "Unable to save your career profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAdvice = () => {
    if (!result) return "";

    if (result.score >= 80) {
      return `Your current profile shows a strong foundation for ${result.targetRole}. Focus on advanced projects, interview preparation and demonstrating your skills through real-world work.`;
    }

    if (result.score >= 60) {
      return `You have a good starting foundation for ${result.targetRole}. Strengthen your missing skills and build practical projects to improve your job readiness.`;
    }

    return `You are at the beginning of your ${result.targetRole} journey. Focus on the missing skills one by one and build small projects as you learn.`;
  };

  const roadmap = [
    {
      week: "WEEK 1",
      title: "Strengthen Fundamentals",
      description:
        "Focus on the most important fundamentals required for your target role.",
    },
    {
      week: "WEEK 2",
      title: "Build Missing Skills",
      description: result?.missingSkills?.length
        ? `Work specifically on ${result.missingSkills
            .slice(0, 2)
            .join(" and ")}.`
        : "Strengthen your existing technical skills.",
    },
    {
      week: "WEEK 3",
      title: "Build a Real Project",
      description:
        "Convert your learning into practical portfolio experience.",
    },
    {
      week: "WEEK 4",
      title: "Prepare for Jobs",
      description:
        "Improve your resume, interview skills and application strategy.",
    },
  ];

  return (
    <section className="analyzer-page">
      <style>{`
        .careerpilot-premium {
          margin-top: 32px;
          padding: 32px;
          border-radius: 24px;
          background: linear-gradient(135deg, #17164d, #302b78);
          color: white;
          box-shadow: 0 20px 50px rgba(40, 35, 100, 0.22);
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 18px;
        }

        .premium-heading {
          margin: 0 0 10px;
          font-size: 30px;
          line-height: 1.2;
          color: #ffffff;
        }

        .premium-description {
          margin: 0 0 24px;
          max-width: 760px;
          line-height: 1.7;
          color: rgba(255,255,255,0.78);
        }

        .premium-benefits {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 20px 0 28px;
        }

        .premium-benefit {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          line-height: 1.45;
        }

        .premium-check {
          flex-shrink: 0;
          font-weight: 900;
          color: #9ff6bd;
        }

        .premium-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.14);
        }

        .premium-price {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .premium-price strong {
          font-size: 30px;
          line-height: 1;
          color: #ffffff;
        }

        .premium-price span {
          font-size: 13px;
          color: rgba(255,255,255,0.68);
        }

        .premium-button {
          border: none;
          border-radius: 12px;
          padding: 14px 22px;
          background: #ffffff;
          color: #28245f;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .premium-preview {
          margin-top: 28px;
          padding: 28px;
          border-radius: 20px;
          background: #ffffff;
          color: #1e2545;
          border: 1px solid #e5e7f4;
        }

        .premium-preview-header {
          margin-bottom: 24px;
        }

        .premium-preview-label {
          display: block;
          margin-bottom: 8px;
          color: #5146d8;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .premium-preview-header h2 {
          margin: 0 0 8px;
          font-size: 26px;
          color: #1e2545;
        }

        .premium-preview-header p {
          margin: 0;
          color: #667085;
          line-height: 1.6;
        }

        .report-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .report-box {
          padding: 20px;
          border-radius: 16px;
          background: #f7f8ff;
          border: 1px solid #e8e9f5;
        }

        .report-box h3 {
          margin: 0 0 10px;
          color: #252b52;
          font-size: 17px;
        }

        .report-box p {
          margin: 0;
          color: #667085;
          line-height: 1.6;
        }

        .report-list {
          margin: 0;
          padding-left: 20px;
          color: #667085;
        }

        .report-list li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .report-close {
          margin-top: 22px;
          border: 1px solid #d9dbed;
          background: white;
          color: #30365f;
          padding: 11px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .premium-benefits,
          .report-grid {
            grid-template-columns: 1fr;
          }

          .premium-bottom {
            flex-direction: column;
            align-items: stretch;
          }

          .premium-button {
            width: 100%;
          }

          .careerpilot-premium {
            padding: 22px;
          }
        }
      `}</style>

      <div className="analyzer-container">

        {/* INTRO */}
        <div className="analyzer-intro">
          <span>🎯 CAREER ANALYZER</span>

          <h2>Discover Your Career Readiness</h2>

          <p>
            Tell CareerPilot AI about your education, skills and target
            role. We'll analyze your current profile and identify
            important skill gaps.
          </p>
        </div>

        {/* FORM */}
        <form className="career-form" onSubmit={analyzeCareer}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Branch</label>

              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="e.g. CSE / AIML"
                required
              />
            </div>

            <div className="form-group">
              <label>Year</label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                required
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>CGPA</label>

              <input
                type="number"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.2"
                min="0"
                max="10"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Role</label>

              <select
                name="targetRole"
                value={form.targetRole}
                onChange={handleChange}
                required
              >
                <option value="">Select target role</option>

                {Object.keys(roleSkills).map((role) => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Your Skills</label>

            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Python, SQL, Git, Machine Learning"
              required
            />

            <small>
              Separate multiple skills with commas.
            </small>
          </div>

          <button
            className="analyze-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze My Career →"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <>
            <div className="result-card">

              <div className="result-top">

                <div>
                  <span>CAREER ANALYSIS</span>

                  <h3>{result.targetRole}</h3>
                </div>

                <div className="score-circle">
                  <strong>{result.score}%</strong>
                  <span>Readiness</span>
                </div>

              </div>

              <div className="result-columns">

                <div className="result-section">
                  <h4>✅ Skills You Have</h4>

                  <div className="skill-list">

                    {result.matchedSkills.length > 0 ? (
                      result.matchedSkills.map((skill) => (
                        <span
                          className="matched"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No matching skills yet.</p>
                    )}

                  </div>
                </div>

                <div className="result-section">
                  <h4>📚 Skills To Improve</h4>

                  <div className="skill-list">

                    {result.missingSkills.length > 0 ? (
                      result.missingSkills.map((skill) => (
                        <span
                          className="missing"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>
                        Great! You have all the listed skills.
                      </p>
                    )}

                  </div>
                </div>

              </div>

              <div className="roadmap-preview">
                <span>💡</span>

                <div>
                  <small>NEXT STEP</small>

                  <strong>
                    Build projects and strengthen your missing
                    skills.
                  </strong>
                </div>
              </div>

            </div>

            {/* AI ANALYSIS */}
            <div className="ai-analysis">

              <div className="ai-analysis-header">

                <div>

                  <span className="ai-label">
                    🤖 CAREERPILOT AI INSIGHT
                  </span>

                  <h2>
                    Your Personalized Career Analysis
                  </h2>

                  <p>
                    Based on the information you provided, here is
                    your current career profile and suggested
                    improvement path.
                  </p>

                </div>

                <div className="ai-score">
                  <strong>{result.score}%</strong>
                  <span>Readiness</span>
                </div>

              </div>

              <div className="ai-analysis-grid">

                <div className="ai-analysis-box">

                  <div className="ai-box-icon">
                    💪
                  </div>

                  <h3>Your Strengths</h3>

                  {result.matchedSkills.length > 0 ? (
                    <div className="ai-skill-list">

                      {result.matchedSkills.map((skill) => (
                        <span
                          className="ai-skill matched"
                          key={skill}
                        >
                          ✓ {skill}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <p>
                      You haven't matched any of the main
                      role-specific skills yet.
                    </p>
                  )}

                </div>

                <div className="ai-analysis-box">

                  <div className="ai-box-icon">
                    📚
                  </div>

                  <h3>Priority Skill Gaps</h3>

                  {result.missingSkills.length > 0 ? (
                    <div className="ai-skill-list">

                      {result.missingSkills.map((skill) => (
                        <span
                          className="ai-skill missing"
                          key={skill}
                        >
                          + {skill}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <p>
                      You currently match all the listed skills
                      for this role.
                    </p>
                  )}

                </div>

              </div>

              {/* ADVICE */}
              <div className="ai-advice">

                <div className="ai-advice-icon">
                  💡
                </div>

                <div>

                  <span>
                    PERSONALIZED ADVICE
                  </span>

                  <h3>
                    {getAdvice()}
                  </h3>

                  <p>
                    CareerPilot has identified your current
                    strengths and skill gaps. Use the roadmap below
                    as a starting point for your preparation.
                  </p>

                </div>

              </div>

              {/* ROADMAP */}
              <div className="roadmap-section">

                <div className="roadmap-heading">

                  <span>
                    🛣️ YOUR STARTING ROADMAP
                  </span>

                  <h2>
                    30-Day Career Plan
                  </h2>

                  <p>
                    A practical starting plan based on your current
                    career analysis.
                  </p>

                </div>

                <div className="roadmap-grid">

                  {roadmap.map((item) => (
                    <div
                      className="roadmap-card"
                      key={item.week}
                    >

                      <span className="roadmap-week">
                        {item.week}
                      </span>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              <div className="ai-disclaimer">

                <span>ℹ️</span>

                <p>
                  This analysis is based on the profile information
                  you provided. It is career guidance and does not
                  guarantee employment or hiring outcomes.
                </p>

              </div>

            </div>

            {/* PREMIUM SECTION */}
            <div className="careerpilot-premium">

              <div className="premium-badge">
                🚀 CAREERPILOT PLUS
              </div>

              <h2 className="premium-heading">
                Get Your Detailed Career Report
              </h2>

              <p className="premium-description">
                Go beyond your basic readiness score with a detailed
                career preparation plan designed around your target
                role and current skill level.
              </p>

              <div className="premium-benefits">

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>Detailed skill-gap analysis</span>
                </div>

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>90-day personalized roadmap</span>
                </div>

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>Recommended projects for your role</span>
                </div>

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>Resume improvement checklist</span>
                </div>

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>Interview preparation topics</span>
                </div>

                <div className="premium-benefit">
                  <span className="premium-check">✓</span>
                  <span>Job-readiness checklist</span>
                </div>

              </div>

              <div className="premium-bottom">

                <div className="premium-price">
                  <strong>₹49</strong>
                  <span>One-time payment</span>
                </div>

                <button
                  type="button"
                  className="premium-button"
                  onClick={() => setShowReport(true)}
                >
                  Preview Detailed Report →
                </button>

              </div>

              {/* REPORT PREVIEW */}
              {showReport && (
                <div className="premium-preview">

                  <div className="premium-preview-header">

                    <span className="premium-preview-label">
                      🚀 CAREERPILOT PLUS PREVIEW
                    </span>

                    <h2>
                      Your Detailed Career Report
                    </h2>

                    <p>
                      This is a preview of the information that
                      CareerPilot Plus can provide.
                    </p>

                  </div>

                  <div className="report-grid">

                    <div className="report-box">

                      <h3>
                        📊 Skill Gap Analysis
                      </h3>

                      <p>
                        Your current skill match is{" "}
                        <strong>
                          {result.skillScore}%
                        </strong>.
                        Focus first on the missing skills identified
                        in your analysis.
                      </p>

                    </div>

                    <div className="report-box">

                      <h3>
                        🎯 Career Readiness
                      </h3>

                      <p>
                        Your current readiness score is{" "}
                        <strong>
                          {result.score}%
                        </strong>.
                        Your academic score contributes to the overall
                        profile assessment.
                      </p>

                    </div>

                    <div className="report-box">

                      <h3>
                        🗓️ 90-Day Roadmap
                      </h3>

                      <ul className="report-list">
                        <li>
                          Strengthen missing technical skills
                        </li>
                        <li>
                          Build role-specific projects
                        </li>
                        <li>
                          Improve resume and GitHub
                        </li>
                        <li>
                          Practice technical interviews
                        </li>
                      </ul>

                    </div>

                    <div className="report-box">

                      <h3>
                        🚀 Recommended Next Steps
                      </h3>

                      <ul className="report-list">
                        {result.missingSkills
                          .slice(0, 4)
                          .map((skill) => (
                            <li key={skill}>
                              Learn and practice {skill}
                            </li>
                          ))}

                        <li>
                          Build one practical project
                        </li>

                        <li>
                          Prepare for internships and jobs
                        </li>
                      </ul>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="report-close"
                    onClick={() => setShowReport(false)}
                  >
                    Close Preview
                  </button>

                </div>
              )}

            </div>
          </>
        )}

      </div>
    </section>
  );
}

export default CareerAnalyzer;