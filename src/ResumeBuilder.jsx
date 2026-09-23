import { useEffect, useState } from "react";

const defaultResume = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  targetRole: "",
  summary: "",
  education: [
    {
      degree: "",
      college: "",
      year: "",
      cgpa: "",
    },
  ],
  skills: "",
  projects: [
    {
      title: "",
      description: "",
      technologies: "",
    },
  ],
  experience: [
    {
      role: "",
      company: "",
      duration: "",
      description: "",
    },
  ],
  certifications: "",
};

function ResumeBuilder() {
  const [resume, setResume] = useState(() => {
    const saved = localStorage.getItem(
      "careerPilotResume"
    );

    return saved
      ? JSON.parse(saved)
      : defaultResume;
  });

  const [activeTab, setActiveTab] =
    useState("personal");

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "careerPilotResume",
      JSON.stringify(resume)
    );
  }, [resume]);

  const updateField = (field, value) => {
    setResume((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateEducation = (
    index,
    field,
    value
  ) => {
    setResume((previous) => ({
      ...previous,
      education: previous.education.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const updateProject = (
    index,
    field,
    value
  ) => {
    setResume((previous) => ({
      ...previous,
      projects: previous.projects.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const updateExperience = (
    index,
    field,
    value
  ) => {
    setResume((previous) => ({
      ...previous,
      experience: previous.experience.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const addEducation = () => {
    setResume((previous) => ({
      ...previous,
      education: [
        ...previous.education,
        {
          degree: "",
          college: "",
          year: "",
          cgpa: "",
        },
      ],
    }));
  };

  const addProject = () => {
    setResume((previous) => ({
      ...previous,
      projects: [
        ...previous.projects,
        {
          title: "",
          description: "",
          technologies: "",
        },
      ],
    }));
  };

  const addExperience = () => {
    setResume((previous) => ({
      ...previous,
      experience: [
        ...previous.experience,
        {
          role: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setResume((previous) => ({
      ...previous,
      education: previous.education.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const removeProject = (index) => {
    setResume((previous) => ({
      ...previous,
      projects: previous.projects.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const removeExperience = (index) => {
    setResume((previous) => ({
      ...previous,
      experience: previous.experience.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const generateSummary = () => {
    const role =
      resume.targetRole ||
      "technology professional";

    const skills = resume.skills
      ? resume.skills
          .split(",")
          .slice(0, 5)
          .map((skill) => skill.trim())
          .filter(Boolean)
          .join(", ")
      : "programming, problem solving and technology";

    const projectCount =
      resume.projects.filter(
        (project) =>
          project.title.trim()
      ).length;

    const summary = `Motivated college student aspiring to build a career as a ${role}. Skilled in ${skills}, with hands-on experience through ${projectCount || "practical"} project${projectCount === 1 ? "" : "s"}. Interested in solving real-world problems, learning modern technologies, and contributing to technology-driven teams.`;

    updateField("summary", summary);

    setMessage(
      "Professional summary generated."
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const clearResume = () => {
    const confirmed = window.confirm(
      "Clear all resume information?"
    );

    if (!confirmed) {
      return;
    }

    setResume({
      ...defaultResume,
      education: [
        {
          degree: "",
          college: "",
          year: "",
          cgpa: "",
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          technologies: "",
        },
      ],
      experience: [
        {
          role: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    });

    localStorage.removeItem(
      "careerPilotResume"
    );
  };

  const printResume = () => {
    window.print();
  };

  const tabs = [
    {
      id: "personal",
      label: "Personal",
      icon: "👤",
    },
    {
      id: "education",
      label: "Education",
      icon: "🎓",
    },
    {
      id: "skills",
      label: "Skills",
      icon: "⚡",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "🛠️",
    },
    {
      id: "experience",
      label: "Experience",
      icon: "💼",
    },
  ];

  return (
    <section className="resume-builder-page">

      <div className="resume-builder-header">

        <div>
          <span className="resume-builder-label">
            📄 CAREERPILOT AI
          </span>

          <h1>AI Resume Builder</h1>

          <p>
            Create a clean, student-friendly resume
            designed around your target career.
          </p>
        </div>

        <div className="resume-header-actions">
          <button
            className="resume-clear-button"
            onClick={clearResume}
          >
            Clear
          </button>

          <button
            className="resume-print-button"
            onClick={printResume}
          >
            🖨️ Download / Print
          </button>
        </div>

      </div>

      {message && (
        <div className="resume-success-message">
          ✓ {message}
        </div>
      )}

      <div className="resume-builder-layout">

        {/* =========================
            FORM
        ========================= */}

        <div className="resume-form-panel">

          <div className="resume-tabs">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={
                  activeTab === tab.id
                    ? "resume-tab active"
                    : "resume-tab"
                }
                onClick={() =>
                  setActiveTab(tab.id)
                }
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

          </div>

          <div className="resume-form-content">

            {/* PERSONAL */}

            {activeTab === "personal" && (
              <div className="resume-section">

                <div className="resume-section-heading">
                  <div>
                    <span>01</span>
                    <h2>Personal Information</h2>
                  </div>

                  <p>
                    Start with the information
                    recruiters need to identify you.
                  </p>
                </div>

                <div className="resume-form-grid">

                  <div className="resume-field full">
                    <label>FULL NAME</label>
                    <input
                      value={resume.fullName}
                      onChange={(e) =>
                        updateField(
                          "fullName",
                          e.target.value
                        )
                      }
                      placeholder="JARUGULA YAGNASREE"
                    />
                  </div>

                  <div className="resume-field">
                    <label>EMAIL</label>
                    <input
                      type="email"
                      value={resume.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="resume-field">
                    <label>PHONE</label>
                    <input
                      value={resume.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="resume-field">
                    <label>LOCATION</label>
                    <input
                      value={resume.location}
                      onChange={(e) =>
                        updateField(
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Guntur, Andhra Pradesh"
                    />
                  </div>

                  <div className="resume-field">
                    <label>TARGET ROLE</label>
                    <input
                      value={resume.targetRole}
                      onChange={(e) =>
                        updateField(
                          "targetRole",
                          e.target.value
                        )
                      }
                      placeholder="AI/ML Engineer"
                    />
                  </div>

                  <div className="resume-field">
                    <label>LINKEDIN</label>
                    <input
                      value={resume.linkedin}
                      onChange={(e) =>
                        updateField(
                          "linkedin",
                          e.target.value
                        )
                      }
                      placeholder="linkedin.com/in/yourname"
                    />
                  </div>

                  <div className="resume-field">
                    <label>GITHUB</label>
                    <input
                      value={resume.github}
                      onChange={(e) =>
                        updateField(
                          "github",
                          e.target.value
                        )
                      }
                      placeholder="github.com/yourname"
                    />
                  </div>

                </div>

                <div className="resume-summary-box">

                  <div className="resume-summary-heading">

                    <div>
                      <span>✨</span>

                      <div>
                        <strong>
                          Professional Summary
                        </strong>

                        <small>
                          Build a concise career
                          introduction.
                        </small>
                      </div>
                    </div>

                    <button
                      onClick={generateSummary}
                    >
                      ✨ Generate
                    </button>

                  </div>

                  <textarea
                    value={resume.summary}
                    onChange={(e) =>
                      updateField(
                        "summary",
                        e.target.value
                      )
                    }
                    placeholder="Write a short professional summary..."
                  />

                </div>

              </div>
            )}

            {/* EDUCATION */}

            {activeTab === "education" && (
              <div className="resume-section">

                <div className="resume-section-heading">
                  <div>
                    <span>02</span>
                    <h2>Education</h2>
                  </div>

                  <p>
                    Add your current degree and
                    previous education.
                  </p>
                </div>

                {resume.education.map(
                  (education, index) => (
                    <div
                      className="resume-repeat-card"
                      key={index}
                    >

                      <div className="repeat-card-header">
                        <strong>
                          Education #{index + 1}
                        </strong>

                        {resume.education.length >
                          1 && (
                          <button
                            onClick={() =>
                              removeEducation(index)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="resume-form-grid">

                        <div className="resume-field">
                          <label>DEGREE</label>
                          <input
                            value={education.degree}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="B.Tech in CSE / AIML"
                          />
                        </div>

                        <div className="resume-field">
                          <label>COLLEGE</label>
                          <input
                            value={education.college}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "college",
                                e.target.value
                              )
                            }
                            placeholder="College / University"
                          />
                        </div>

                        <div className="resume-field">
                          <label>YEAR</label>
                          <input
                            value={education.year}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "year",
                                e.target.value
                              )
                            }
                            placeholder="2023 - 2027"
                          />
                        </div>

                        <div className="resume-field">
                          <label>CGPA</label>
                          <input
                            value={education.cgpa}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "cgpa",
                                e.target.value
                              )
                            }
                            placeholder="8.2"
                          />
                        </div>

                      </div>

                    </div>
                  )
                )}

                <button
                  className="add-resume-item"
                  onClick={addEducation}
                >
                  + Add Education
                </button>

              </div>
            )}

            {/* SKILLS */}

            {activeTab === "skills" && (
              <div className="resume-section">

                <div className="resume-section-heading">
                  <div>
                    <span>03</span>
                    <h2>Technical Skills</h2>
                  </div>

                  <p>
                    Add only technologies and skills
                    that you can explain in an interview.
                  </p>
                </div>

                <div className="resume-field">

                  <label>
                    TECHNICAL SKILLS
                  </label>

                  <textarea
                    className="large-resume-textarea"
                    value={resume.skills}
                    onChange={(e) =>
                      updateField(
                        "skills",
                        e.target.value
                      )
                    }
                    placeholder="Python, JavaScript, React, SQL, Machine Learning, Git, HTML, CSS"
                  />

                  <small className="field-help">
                    Separate skills using commas.
                  </small>

                </div>

                <div className="skills-preview">

                  <div className="skills-preview-title">
                    Your Skills
                  </div>

                  <div className="resume-skill-tags">

                    {resume.skills
                      .split(",")
                      .map((skill) =>
                        skill.trim()
                      )
                      .filter(Boolean)
                      .map((skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))}

                    {!resume.skills && (
                      <small>
                        Skills will appear here.
                      </small>
                    )}

                  </div>

                </div>

                <div className="resume-advice-card">
                  <span>💡</span>

                  <div>
                    <strong>
                      Resume Tip
                    </strong>

                    <p>
                      Group related skills and
                      prioritize the technologies
                      relevant to your target role.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* PROJECTS */}

            {activeTab === "projects" && (
              <div className="resume-section">

                <div className="resume-section-heading">
                  <div>
                    <span>04</span>
                    <h2>Projects</h2>
                  </div>

                  <p>
                    Projects are one of the most
                    important sections for students.
                  </p>
                </div>

                {resume.projects.map(
                  (project, index) => (
                    <div
                      className="resume-repeat-card"
                      key={index}
                    >

                      <div className="repeat-card-header">
                        <strong>
                          Project #{index + 1}
                        </strong>

                        {resume.projects.length >
                          1 && (
                          <button
                            onClick={() =>
                              removeProject(index)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="resume-field">
                        <label>
                          PROJECT TITLE
                        </label>

                        <input
                          value={project.title}
                          onChange={(e) =>
                            updateProject(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="AI-Based Smart Library Management System"
                        />
                      </div>

                      <div className="resume-field">
                        <label>
                          TECHNOLOGIES
                        </label>

                        <input
                          value={
                            project.technologies
                          }
                          onChange={(e) =>
                            updateProject(
                              index,
                              "technologies",
                              e.target.value
                            )
                          }
                          placeholder="Python, OpenCV, YOLO, Firebase, Flutter"
                        />
                      </div>

                      <div className="resume-field">
                        <label>
                          DESCRIPTION
                        </label>

                        <textarea
                          value={
                            project.description
                          }
                          onChange={(e) =>
                            updateProject(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Explain the problem, your solution, technologies used and your contribution."
                        />
                      </div>

                    </div>
                  )
                )}

                <button
                  className="add-resume-item"
                  onClick={addProject}
                >
                  + Add Project
                </button>

              </div>
            )}

            {/* EXPERIENCE */}

            {activeTab === "experience" && (
              <div className="resume-section">

                <div className="resume-section-heading">
                  <div>
                    <span>05</span>
                    <h2>Experience</h2>
                  </div>

                  <p>
                    Add internships, freelance work
                    or relevant experience.
                  </p>
                </div>

                {resume.experience.map(
                  (experience, index) => (
                    <div
                      className="resume-repeat-card"
                      key={index}
                    >

                      <div className="repeat-card-header">
                        <strong>
                          Experience #{index + 1}
                        </strong>

                        {resume.experience.length >
                          1 && (
                          <button
                            onClick={() =>
                              removeExperience(index)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="resume-form-grid">

                        <div className="resume-field">
                          <label>
                            ROLE
                          </label>

                          <input
                            value={
                              experience.role
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "role",
                                e.target.value
                              )
                            }
                            placeholder="Software Development Intern"
                          />
                        </div>

                        <div className="resume-field">
                          <label>
                            COMPANY
                          </label>

                          <input
                            value={
                              experience.company
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="Company Name"
                          />
                        </div>

                        <div className="resume-field full">
                          <label>
                            DURATION
                          </label>

                          <input
                            value={
                              experience.duration
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="June 2026 - August 2026"
                          />
                        </div>

                      </div>

                      <div className="resume-field">
                        <label>
                          RESPONSIBILITIES / ACHIEVEMENTS
                        </label>

                        <textarea
                          value={
                            experience.description
                          }
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe what you worked on and what you achieved."
                        />
                      </div>

                    </div>
                  )
                )}

                <button
                  className="add-resume-item"
                  onClick={addExperience}
                >
                  + Add Experience
                </button>

                <div className="resume-field certifications-field">

                  <label>
                    CERTIFICATIONS
                  </label>

                  <textarea
                    value={
                      resume.certifications
                    }
                    onChange={(e) =>
                      updateField(
                        "certifications",
                        e.target.value
                      )
                    }
                    placeholder="Generative AI Fundamentals, Python Certification, etc."
                  />

                </div>

              </div>
            )}

          </div>

        </div>

        {/* =========================
            LIVE PREVIEW
        ========================= */}

        <div className="resume-preview-panel">

          <div className="resume-preview-toolbar">

            <div>
              <span>LIVE PREVIEW</span>
              <strong>
                Student Resume
              </strong>
            </div>

            <div className="preview-status">
              <span></span>
              Auto-saved
            </div>

          </div>

          <div className="resume-paper">

            <div className="resume-paper-header">

              <h1>
                {resume.fullName ||
                  "YOUR NAME"}
              </h1>

              <div className="resume-role">
                {resume.targetRole ||
                  "Target Role"}
              </div>

              <div className="resume-contact">

                {resume.email && (
                  <span>
                    {resume.email}
                  </span>
                )}

                {resume.phone && (
                  <span>
                    {resume.phone}
                  </span>
                )}

                {resume.location && (
                  <span>
                    {resume.location}
                  </span>
                )}

                {resume.linkedin && (
                  <span>
                    {resume.linkedin}
                  </span>
                )}

                {resume.github && (
                  <span>
                    {resume.github}
                  </span>
                )}

              </div>

            </div>

            {resume.summary && (
              <div className="resume-paper-section">

                <h2>
                  PROFILE
                </h2>

                <p>
                  {resume.summary}
                </p>

              </div>
            )}

            {resume.skills && (
              <div className="resume-paper-section">

                <h2>
                  TECHNICAL SKILLS
                </h2>

                <p>
                  {resume.skills}
                </p>

              </div>
            )}

            {resume.education.some(
              (item) =>
                item.degree ||
                item.college
            ) && (
              <div className="resume-paper-section">

                <h2>
                  EDUCATION
                </h2>

                {resume.education.map(
                  (education, index) =>
                    (education.degree ||
                      education.college) && (
                      <div
                        className="paper-item"
                        key={index}
                      >

                        <div className="paper-item-top">

                          <strong>
                            {education.degree}
                          </strong>

                          <span>
                            {education.year}
                          </span>

                        </div>

                        <p>
                          {education.college}

                          {education.cgpa &&
                            ` • CGPA: ${education.cgpa}`}
                        </p>

                      </div>
                    )
                )}

              </div>
            )}

            {resume.projects.some(
              (item) =>
                item.title ||
                item.description
            ) && (
              <div className="resume-paper-section">

                <h2>
                  PROJECTS
                </h2>

                {resume.projects.map(
                  (project, index) =>
                    (project.title ||
                      project.description) && (
                      <div
                        className="paper-item"
                        key={index}
                      >

                        <strong>
                          {project.title}
                        </strong>

                        {project.technologies && (
                          <div className="paper-tech">
                            {project.technologies}
                          </div>
                        )}

                        <p>
                          {project.description}
                        </p>

                      </div>
                    )
                )}

              </div>
            )}

            {resume.experience.some(
              (item) =>
                item.role ||
                item.company
            ) && (
              <div className="resume-paper-section">

                <h2>
                  EXPERIENCE
                </h2>

                {resume.experience.map(
                  (experience, index) =>
                    (experience.role ||
                      experience.company) && (
                      <div
                        className="paper-item"
                        key={index}
                      >

                        <div className="paper-item-top">

                          <strong>
                            {experience.role}
                          </strong>

                          <span>
                            {experience.duration}
                          </span>

                        </div>

                        <p>
                          {experience.company}
                        </p>

                        <p>
                          {experience.description}
                        </p>

                      </div>
                    )
                )}

              </div>
            )}

            {resume.certifications && (
              <div className="resume-paper-section">

                <h2>
                  CERTIFICATIONS
                </h2>

                <p>
                  {resume.certifications}
                </p>

              </div>
            )}

          </div>

          <div className="resume-preview-note">
            CareerPilot Resume Builder •
            Information should be accurate
            and verifiable.
          </div>

        </div>

      </div>

    </section>
  );
}

export default ResumeBuilder;