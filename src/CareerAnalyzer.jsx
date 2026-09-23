import { useState } from "react";
import { supabase } from "./supabaseClient";

function CareerAnalyzer({ user }) {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    cgpa: "",
    targetRole: "",
    skills: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState("");

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

  const roleProjects = {
    "Software Developer": [
      "Student Management System",
      "Expense Tracker Web App",
      "E-Commerce Application",
    ],

    "AI/ML Engineer": [
      "Student Performance Prediction",
      "Resume Screening AI",
      "Image Classification System",
    ],

    "Data Analyst": [
      "Student Performance Dashboard",
      "Sales Analytics Dashboard",
      "Customer Data Analysis",
    ],

    "Data Scientist": [
      "Customer Churn Prediction",
      "House Price Prediction",
      "Recommendation System",
    ],

    "Web Developer": [
      "Portfolio Website",
      "E-Commerce Website",
      "College Event Management Website",
    ],

    "UI/UX Designer": [
      "Student Learning App",
      "Career Guidance App",
      "College Dashboard Redesign",
    ],
  };

  const roleRoadmaps = {
    "Software Developer": [
      {
        period: "Days 1–30",
        title: "Programming + DSA",
        items: [
          "Strengthen JavaScript fundamentals",
          "Practice arrays, strings and objects",
          "Learn Git and GitHub",
          "Solve 2–3 coding problems per day",
        ],
      },
      {
        period: "Days 31–60",
        title: "Development Skills",
        items: [
          "Learn React fundamentals",
          "Build reusable components",
          "Learn REST APIs",
          "Practice SQL queries",
        ],
      },
      {
        period: "Days 61–90",
        title: "Projects + Interview",
        items: [
          "Build one complete project",
          "Deploy the project",
          "Improve GitHub profile",
          "Practice technical interviews",
        ],
      },
    ],

    "AI/ML Engineer": [
      {
        period: "Days 1–30",
        title: "Python + Mathematics",
        items: [
          "Strengthen Python",
          "Learn NumPy and Pandas",
          "Revise statistics",
          "Practice data preprocessing",
        ],
      },
      {
        period: "Days 31–60",
        title: "Machine Learning",
        items: [
          "Learn supervised learning",
          "Learn unsupervised learning",
          "Practice model evaluation",
          "Build small ML projects",
        ],
      },
      {
        period: "Days 61–90",
        title: "Deep Learning + Projects",
        items: [
          "Learn neural networks",
          "Explore computer vision or NLP",
          "Build an AI project",
          "Prepare for AI/ML interviews",
        ],
      },
    ],

    "Data Analyst": [
      {
        period: "Days 1–30",
        title: "Data Fundamentals",
        items: [
          "Learn Excel",
          "Practice SQL",
          "Learn data cleaning",
          "Study descriptive statistics",
        ],
      },
      {
        period: "Days 31–60",
        title: "Visualization",
        items: [
          "Learn Power BI",
          "Create dashboards",
          "Practice data storytelling",
          "Work with real datasets",
        ],
      },
      {
        period: "Days 61–90",
        title: "Portfolio + Jobs",
        items: [
          "Build 2 analytics projects",
          "Publish dashboards",
          "Improve resume",
          "Practice analyst interviews",
        ],
      },
    ],

    "Data Scientist": [
      {
        period: "Days 1–30",
        title: "Python + Statistics",
        items: [
          "Strengthen Python",
          "Learn Pandas",
          "Revise statistics",
          "Practice data analysis",
        ],
      },
      {
        period: "Days 31–60",
        title: "Machine Learning",
        items: [
          "Learn regression",
          "Learn classification",
          "Learn clustering",
          "Practice model evaluation",
        ],
      },
      {
        period: "Days 61–90",
        title: "Projects + Deployment",
        items: [
          "Build an end-to-end project",
          "Create a GitHub portfolio",
          "Learn basic deployment",
          "Prepare for interviews",
        ],
      },
    ],

    "Web Developer": [
      {
        period: "Days 1–30",
        title: "Web Fundamentals",
        items: [
          "Learn HTML",
          "Learn CSS",
          "Practice responsive design",
          "Strengthen JavaScript",
        ],
      },
      {
        period: "Days 31–60",
        title: "React Development",
        items: [
          "Learn React",
          "Build reusable components",
          "Learn API integration",
          "Practice Git/GitHub",
        ],
      },
      {
        period: "Days 61–90",
        title: "Portfolio + Deployment",
        items: [
          "Build 2 strong websites",
          "Deploy projects",
          "Create portfolio",
          "Prepare for frontend interviews",
        ],
      },
    ],

    "UI/UX Designer": [
      {
        period: "Days 1–30",
        title: "Design Fundamentals",
        items: [
          "Learn design principles",
          "Practice Figma",
          "Study typography and color",
          "Learn user research basics",
        ],
      },
      {
        period: "Days 31–60",
        title: "UX Process",
        items: [
          "Create user personas",
          "Build user flows",
          "Practice wireframing",
          "Create prototypes",
        ],
      },
      {
        period: "Days 61–90",
        title: "Portfolio + Case Studies",
        items: [
          "Complete 2 case studies",
          "Create high-fidelity designs",
          "Build a design portfolio",
          "Prepare for design interviews",
        ],
      },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const analyzeCareer = async (e) => {
    e.preventDefault();

    setError("");
    setShowReport(false);

    if (!user) {
      setError("Please login before analyzing your career.");
      return;
    }

    if (
      !formData.name ||
      !formData.branch ||
      !formData.year ||
      !formData.cgpa ||
      !formData.targetRole ||
      !formData.skills
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    const cgpaNumber = Number(formData.cgpa);

    if (Number.isNaN(cgpaNumber) || cgpaNumber < 0 || cgpaNumber > 10) {
      setError("Please enter a valid CGPA between 0 and 10.");
      return;
    }

    setLoading(true);

    try {
      const requiredSkills = roleSkills[formData.targetRole] || [];

      const userSkills = formData.skills
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const matchedSkills = requiredSkills.filter((skill) =>
        userSkills.some(
          (userSkill) =>
            userSkill === skill ||
            userSkill.includes(skill) ||
            skill.includes(userSkill)
        )
      );

      const missingSkills = requiredSkills.filter(
        (skill) => !matchedSkills.includes(skill)
      );

      const skillScore =
        requiredSkills.length > 0
          ? (matchedSkills.length / requiredSkills.length) * 100
          : 0;

      const cgpaScore = Math.min(100, (cgpaNumber / 10) * 100);

      const readinessScore = Math.round(
        skillScore * 0.7 + cgpaScore * 0.3
      );

      const profileData = {
        id: user.id,
        full_name: formData.name,
        branch: formData.branch,
        year: formData.year,
        cgpa: cgpaNumber,
        target_role: formData.targetRole,
        skills: userSkills.join(", "),
        readiness_score: readinessScore,
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
        });

      if (saveError) {
        console.error("Profile save error:", saveError);
      }

      setResult({
        score: readinessScore,
        skillScore: Math.round(skillScore),
        cgpaScore: Math.round(cgpaScore),
        matchedSkills,
        missingSkills,
        targetRole: formData.targetRole,
        userSkills,
        cgpa: cgpaNumber,
        name: formData.name,
        branch: formData.branch,
        year: formData.year,
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while analyzing your career.");
    } finally {
      setLoading(false);
    }
  };

  const getAdvice = () => {
    if (!result) return "";

    if (result.score >= 80) {
      return "You have a strong foundation for your target role. Focus on projects, interview preparation and improving your professional profile.";
    }

    if (result.score >= 60) {
      return "You are on the right track. Strengthen your missing skills and build practical projects to become more job-ready.";
    }

    return "Your current foundation needs improvement. Focus on the missing skills first, then build projects and practice interview questions.";
  };

  const getScoreLabel = () => {
    if (!result) return "";

    if (result.score >= 80) return "Strong Foundation";
    if (result.score >= 60) return "Developing";
    return "Needs Improvement";
  };

  const getScoreClass = () => {
    if (!result) return "";

    if (result.score >= 80) return "score-good";
    if (result.score >= 60) return "score-medium";
    return "score-low";
  };

  const roadmap =
    roleRoadmaps[result?.targetRole] || [
      {
        period: "Days 1–30",
        title: "Build Fundamentals",
        items: [
          "Strengthen your core skills",
          "Practice regularly",
          "Complete small projects",
        ],
      },
      {
        period: "Days 31–60",
        title: "Build Projects",
        items: [
          "Create practical projects",
          "Publish your work",
          "Improve your GitHub profile",
        ],
      },
      {
        period: "Days 61–90",
        title: "Job Preparation",
        items: [
          "Improve your resume",
          "Practice interviews",
          "Start applying for suitable opportunities",
        ],
      },
    ];

  const recommendedProjects =
    roleProjects[result?.targetRole] || [
      "Personal Portfolio Website",
      "Student Management System",
      "Career Guidance Application",
    ];

  return (
    <div className="analyzer-page">
      <div className="analyzer-container">
        <div className="analyzer-intro">
          <div className="analyzer-intro-icon">🎯</div>

          <div>
            <span className="section-eyebrow">CAREERPILOT AI</span>

            <h1>Career Analyzer</h1>

            <p>
              Understand your current job readiness, identify missing skills
              and get a personalized career preparation roadmap.
            </p>
          </div>
        </div>

        <form className="career-form" onSubmit={analyzeCareer}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch">Branch</label>

              <input
                id="branch"
                name="branch"
                type="text"
                placeholder="e.g. CSE, AIML, ECE"
                value={formData.branch}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>

              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>

              <input
                id="cgpa"
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 7.8"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetRole">Target Role</label>

              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
              >
                <option value="">Select target role</option>

                {Object.keys(roleSkills).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              Current Skills
              <span className="field-hint">
                Separate skills with commas
              </span>
            </label>

            <textarea
              id="skills"
              name="skills"
              rows="4"
              placeholder="Python, SQL, Machine Learning, Git"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-message">{error}</div>}

          <button
            type="submit"
            className="analyze-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Analyzing your career...
              </>
            ) : (
              <>✨ Analyze My Career</>
            )}
          </button>
        </form>

        {result && (
          <>
            <div className="result-card">
              <div className="result-top">
                <div>
                  <span className="result-label">YOUR CAREER READINESS</span>

                  <h2>{getScoreLabel()}</h2>

                  <p>
                    Your current profile has been analyzed for the{" "}
                    <strong>{result.targetRole}</strong> role.
                  </p>
                </div>

                <div className={`score-circle ${getScoreClass()}`}>
                  <strong>{result.score}</strong>
                  <span>/100</span>
                </div>
              </div>

              <div className="result-columns">
                <div className="result-section">
                  <div className="result-section-heading">
                    <span>🧩</span>
                    <h3>Matched Skills</h3>
                  </div>

                  {result.matchedSkills.length > 0 ? (
                    <div className="skill-list">
                      {result.matchedSkills.map((skill) => (
                        <span
                          className="skill-tag matched"
                          key={skill}
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-result">
                      No matching skills found yet.
                    </p>
                  )}
                </div>

                <div className="result-section">
                  <div className="result-section-heading">
                    <span>🚧</span>
                    <h3>Missing Skills</h3>
                  </div>

                  {result.missingSkills.length > 0 ? (
                    <div className="skill-list">
                      {result.missingSkills.map((skill) => (
                        <span
                          className="skill-tag missing"
                          key={skill}
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-result">
                      Great! You matched all the core skills.
                    </p>
                  )}
                </div>
              </div>

              <div className="ai-analysis">
                <div className="ai-analysis-header">
                  <div>
                    <span className="ai-label">AI-STYLE ANALYSIS</span>

                    <h3>Your Career Snapshot</h3>
                  </div>

                  <span className="ai-score">
                    {result.score}% ready
                  </span>
                </div>

                <div className="ai-analysis-grid">
                  <div className="ai-analysis-box">
                    <div className="ai-box-icon">💻</div>

                    <div>
                      <span>Skill Match</span>
                      <strong>{result.skillScore}%</strong>
                    </div>
                  </div>

                  <div className="ai-analysis-box">
                    <div className="ai-box-icon">🎓</div>

                    <div>
                      <span>Academic Score</span>
                      <strong>{result.cgpaScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="ai-advice">
                  <div className="ai-advice-icon">💡</div>

                  <div>
                    <strong>CareerPilot Advice</strong>

                    <p>{getAdvice()}</p>
                  </div>
                </div>
              </div>

              <div className="roadmap-preview">
                <div className="roadmap-heading">
                  <div>
                    <span className="ai-label">START HERE</span>

                    <h3>Your 30-Day Action Plan</h3>
                  </div>

                  <span className="roadmap-badge">
                    Free Preview
                  </span>
                </div>

                <div className="roadmap-grid">
                  <div className="roadmap-card">
                    <span className="roadmap-week">WEEK 1</span>

                    <h4>Strengthen Fundamentals</h4>

                    <p>
                      Focus on the most important fundamentals required
                      for your target role.
                    </p>
                  </div>

                  <div className="roadmap-card">
                    <span className="roadmap-week">WEEK 2</span>

                    <h4>Build Missing Skills</h4>

                    <p>
                      Work specifically on the skills identified in
                      your career analysis.
                    </p>
                  </div>

                  <div className="roadmap-card">
                    <span className="roadmap-week">WEEK 3</span>

                    <h4>Build a Real Project</h4>

                    <p>
                      Convert your learning into practical portfolio
                      experience.
                    </p>
                  </div>

                  <div className="roadmap-card">
                    <span className="roadmap-week">WEEK 4</span>

                    <h4>Prepare for Jobs</h4>

                    <p>
                      Improve your resume, interview skills and
                      application strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CAREERPILOT PLUS ₹49 SECTION */}
            <div className="premium-report-card">
              <div className="premium-report-glow"></div>

              <div className="premium-report-content">
                <div className="premium-report-top">
                  <span className="premium-badge">
                    🚀 CAREERPILOT PLUS
                  </span>

                  <span className="premium-preview-badge">
                    PREVIEW
                  </span>
                </div>

                <h2>Get Your Detailed Career Report</h2>

                <p>
                  Go beyond your basic readiness score with a detailed
                  career preparation plan designed around your target
                  role and current skill level.
                </p>

                <div className="premium-features">
                  <div className="premium-feature">
                    <span>✓</span>
                    <span>Detailed skill-gap analysis</span>
                  </div>

                  <div className="premium-feature">
                    <span>✓</span>
                    <span>90-day personalized roadmap</span>
                  </div>

                  <div className="premium-feature">
                    <span>✓</span>
                    <span>Recommended projects for your role</span>
                  </div>

                  <div className="premium-feature">
                    <span>✓</span>
                    <span>Resume improvement checklist</span>
                  </div>

                  <div className="premium-feature">
                    <span>✓</span>
                    <span>Interview preparation topics</span>
                  </div>

                  <div className="premium-feature">
                    <span>✓</span>
                    <span>Job-readiness checklist</span>
                  </div>
                </div>

                <div className="premium-bottom">
                  <div className="premium-price-area">
                    <span className="premium-price">₹49</span>

                    <span className="premium-one-time">
                      one-time
                    </span>
                  </div>

                  <button
                    type="button"
                    className="premium-btn"
                    onClick={() => setShowReport(!showReport)}
                  >
                    {showReport
                      ? "Hide Detailed Report ↑"
                      : "Preview Detailed Report →"}
                  </button>
                </div>
              </div>
            </div>

            {/* DETAILED REPORT PREVIEW */}
            {showReport && (
              <div className="detailed-report">
                <div className="detailed-report-header">
                  <div>
                    <span className="ai-label">
                      CAREERPILOT PLUS REPORT
                    </span>

                    <h2>
                      {result.name}'s Career Preparation Plan
                    </h2>

                    <p>
                      Target role:{" "}
                      <strong>{result.targetRole}</strong>
                    </p>
                  </div>

                  <div className="report-score">
                    <span>Readiness</span>
                    <strong>{result.score}/100</strong>
                  </div>
                </div>

                <div className="report-summary-grid">
                  <div className="report-summary-box">
                    <span>🎓</span>

                    <div>
                      <small>Academic Profile</small>
                      <strong>
                        {result.cgpa}/10 CGPA
                      </strong>
                    </div>
                  </div>

                  <div className="report-summary-box">
                    <span>💻</span>

                    <div>
                      <small>Skill Match</small>
                      <strong>
                        {result.skillScore}%
                      </strong>
                    </div>
                  </div>

                  <div className="report-summary-box">
                    <span>🎯</span>

                    <div>
                      <small>Target Role</small>
                      <strong>
                        {result.targetRole}
                      </strong>
                    </div>
                  </div>

                  <div className="report-summary-box">
                    <span>📚</span>

                    <div>
                      <small>Missing Skills</small>
                      <strong>
                        {result.missingSkills.length}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="detailed-report-section">
                  <div className="detailed-section-title">
                    <span>🔍</span>

                    <div>
                      <span>01</span>
                      <h3>Skill Gap Analysis</h3>
                    </div>
                  </div>

                  <p>
                    Your current skills were compared with the core
                    skills commonly associated with your selected target
                    role inside CareerPilot.
                  </p>

                  <div className="report-skills-grid">
                    <div>
                      <h4>Skills You Already Have</h4>

                      {result.matchedSkills.length > 0 ? (
                        <ul>
                          {result.matchedSkills.map((skill) => (
                            <li key={skill}>
                              <span>✓</span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No matched skills recorded yet.</p>
                      )}
                    </div>

                    <div>
                      <h4>Skills To Prioritize</h4>

                      {result.missingSkills.length > 0 ? (
                        <ul>
                          {result.missingSkills.map((skill) => (
                            <li key={skill}>
                              <span>→</span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>
                          You matched all listed core skills.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="detailed-report-section">
                  <div className="detailed-section-title">
                    <span>🗺️</span>

                    <div>
                      <span>02</span>
                      <h3>Your 90-Day Roadmap</h3>
                    </div>
                  </div>

                  <div className="ninety-day-grid">
                    {roadmap.map((item) => (
                      <div
                        className="ninety-day-card"
                        key={item.period}
                      >
                        <span>{item.period}</span>

                        <h4>{item.title}</h4>

                        <ul>
                          {item.items.map((task) => (
                            <li key={task}>
                              <span>✓</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detailed-report-section">
                  <div className="detailed-section-title">
                    <span>🚀</span>

                    <div>
                      <span>03</span>
                      <h3>Recommended Projects</h3>
                    </div>
                  </div>

                  <p>
                    These project directions can help you turn your
                    learning into portfolio evidence.
                  </p>

                  <div className="recommended-projects">
                    {recommendedProjects.map((project, index) => (
                      <div
                        className="recommended-project"
                        key={project}
                      >
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>{project}</strong>

                        <small>
                          Portfolio project idea
                        </small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detailed-report-section">
                  <div className="detailed-section-title">
                    <span>📝</span>

                    <div>
                      <span>04</span>
                      <h3>Resume Improvement Checklist</h3>
                    </div>
                  </div>

                  <div className="checklist-grid">
                    <div>✓ Add your strongest technical skills</div>
                    <div>✓ Include measurable project outcomes</div>
                    <div>✓ Add GitHub/project links</div>
                    <div>✓ Keep your resume focused on your target role</div>
                    <div>✓ Highlight relevant internships and certifications</div>
                    <div>✓ Remove unnecessary or unrelated information</div>
                  </div>
                </div>

                <div className="detailed-report-section">
                  <div className="detailed-section-title">
                    <span>🎤</span>

                    <div>
                      <span>05</span>
                      <h3>Interview Preparation</h3>
                    </div>
                  </div>

                  <div className="interview-topics">
                    <div>
                      <strong>Technical Fundamentals</strong>
                      <p>
                        Revise the core technologies listed for your
                        target role.
                      </p>
                    </div>

                    <div>
                      <strong>Project Questions</strong>
                      <p>
                        Be prepared to explain your project decisions,
                        technologies and results.
                      </p>
                    </div>

                    <div>
                      <strong>Behavioral Questions</strong>
                      <p>
                        Practice concise answers about teamwork,
                        challenges and learning.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="detailed-report-section final-report-section">
                  <div className="detailed-section-title">
                    <span>🎯</span>

                    <div>
                      <span>06</span>
                      <h3>Your Immediate Next Steps</h3>
                    </div>
                  </div>

                  <ol className="next-steps-list">
                    <li>
                      Start with your highest-priority missing skill.
                    </li>

                    <li>
                      Spend focused time practicing it every day.
                    </li>

                    <li>
                      Build one practical project around the skill.
                    </li>

                    <li>
                      Add the project to your resume and GitHub.
                    </li>

                    <li>
                      Practice role-specific interview questions.
                    </li>

                    <li>
                      Start applying when your portfolio is ready.
                    </li>
                  </ol>
                </div>

                <div className="report-preview-note">
                  <span>🔒</span>

                  <p>
                    This is a preview of the CareerPilot Plus report.
                    Payment is not connected yet. The current ₹49
                    button is only a product preview and does not
                    charge your account.
                  </p>
                </div>
              </div>
            )}

            <div className="ai-disclaimer">
              <span>ⓘ</span>

              <p>
                CareerPilot's readiness score is an educational
                estimate based on the information you provide. It is
                not a guarantee of employment or interview selection.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CareerAnalyzer;