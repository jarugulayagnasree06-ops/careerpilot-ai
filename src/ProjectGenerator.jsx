import { useMemo, useState } from "react";

const SAVED_PROJECTS_KEY = "careerPilotSavedProjects";

const projectDatabase = {
  "AI/ML Engineer": [
    {
      title: "AI Resume Analyzer",
      difficulty: "Intermediate",
      duration: "2–3 weeks",
      description:
        "Build a web application that analyzes a student's resume against a target job role and identifies missing skills, strengths and improvement areas.",
      technologies: ["Python", "NLP", "React", "FastAPI", "SQLite"],
      features: [
        "Resume PDF upload",
        "Resume text extraction",
        "Skill detection",
        "Job description comparison",
        "Skill-gap report",
        "Resume improvement suggestions",
      ],
      skills: [
        "Natural Language Processing",
        "Python",
        "React",
        "REST APIs",
        "Data processing",
      ],
      roadmap: [
        "Create the React frontend",
        "Build the Python backend",
        "Implement resume text extraction",
        "Create skill matching logic",
        "Build the skill-gap dashboard",
        "Test with multiple resumes",
        "Deploy the application",
      ],
      resume:
        "Developed an AI-powered resume analyzer using Python, NLP and React to identify candidate skills and generate personalized skill-gap insights.",
    },
    {
      title: "Smart Attendance Using Computer Vision",
      difficulty: "Advanced",
      duration: "3–4 weeks",
      description:
        "Create a computer vision system that detects and recognizes students from classroom images and automatically records attendance.",
      technologies: [
        "Python",
        "OpenCV",
        "YOLO",
        "Face Recognition",
        "Firebase",
      ],
      features: [
        "Student face detection",
        "Face recognition",
        "Automatic attendance",
        "Attendance dashboard",
        "Firebase storage",
        "Daily attendance reports",
      ],
      skills: [
        "Computer Vision",
        "OpenCV",
        "YOLO",
        "Python",
        "Firebase",
      ],
      roadmap: [
        "Collect sample student images",
        "Create the face dataset",
        "Implement face detection",
        "Implement recognition",
        "Connect attendance database",
        "Create dashboard",
        "Test classroom scenarios",
      ],
      resume:
        "Built a computer vision attendance system using Python, OpenCV and face recognition to automate classroom attendance tracking.",
    },
    {
      title: "AI Study Assistant",
      difficulty: "Intermediate",
      duration: "2–3 weeks",
      description:
        "Build an intelligent study assistant that helps students organize subjects, generate study plans and understand difficult topics.",
      technologies: [
        "React",
        "Python",
        "NLP",
        "FastAPI",
        "Supabase",
      ],
      features: [
        "Subject management",
        "AI study recommendations",
        "Topic explanations",
        "Study schedule",
        "Progress tracking",
        "Question generation",
      ],
      skills: [
        "AI Application Development",
        "React",
        "Python",
        "NLP",
        "Database Management",
      ],
      roadmap: [
        "Design the student dashboard",
        "Create subject and topic management",
        "Build the backend API",
        "Add recommendation logic",
        "Implement progress tracking",
        "Add AI-powered explanations",
        "Deploy the application",
      ],
      resume:
        "Created an AI-powered study assistant using React and Python to provide personalized study planning, topic explanations and progress tracking.",
    },
    {
      title: "Fake News Detection System",
      difficulty: "Advanced",
      duration: "3–4 weeks",
      description:
        "Develop a machine learning system that analyzes news text and predicts whether the content is likely to be reliable or misleading.",
      technologies: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "NLP",
        "Streamlit",
      ],
      features: [
        "News article input",
        "Text preprocessing",
        "TF-IDF feature extraction",
        "Classification model",
        "Prediction confidence",
        "Model evaluation dashboard",
      ],
      skills: [
        "Machine Learning",
        "NLP",
        "Text Classification",
        "Scikit-learn",
        "Model Evaluation",
      ],
      roadmap: [
        "Find and prepare a labeled dataset",
        "Clean and preprocess text",
        "Create TF-IDF features",
        "Train classification models",
        "Evaluate model performance",
        "Build the prediction interface",
        "Deploy the application",
      ],
      resume:
        "Developed an NLP-based news classification system using Python and Scikit-learn to analyze text and classify potentially misleading content.",
    },
  ],

  "Software Developer": [
    {
      title: "College Management Portal",
      difficulty: "Intermediate",
      duration: "3–4 weeks",
      description:
        "Build a full-stack college portal where students can manage academic information, assignments, attendance and announcements.",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Git",
      ],
      features: [
        "Student authentication",
        "Dashboard",
        "Assignment management",
        "Attendance records",
        "Announcements",
        "Profile management",
      ],
      skills: [
        "React",
        "Backend Development",
        "REST APIs",
        "SQL",
        "Authentication",
      ],
      roadmap: [
        "Design database schema",
        "Create authentication",
        "Build React dashboard",
        "Create backend APIs",
        "Implement academic modules",
        "Add validation",
        "Deploy frontend and backend",
      ],
      resume:
        "Developed a full-stack college management portal using React, Node.js and PostgreSQL with authentication, assignments and academic dashboards.",
    },
    {
      title: "Expense Tracker",
      difficulty: "Beginner",
      duration: "1–2 weeks",
      description:
        "Create a personal finance application that allows users to track income, expenses and spending categories.",
      technologies: ["React", "JavaScript", "CSS", "LocalStorage"],
      features: [
        "Add income",
        "Add expenses",
        "Category management",
        "Monthly summaries",
        "Expense filtering",
        "Visual charts",
      ],
      skills: [
        "React",
        "JavaScript",
        "State Management",
        "UI Development",
        "Data Visualization",
      ],
      roadmap: [
        "Create application layout",
        "Build transaction form",
        "Store transactions",
        "Create category filters",
        "Calculate summaries",
        "Add charts",
        "Make the application responsive",
      ],
      resume:
        "Built a responsive expense tracking application using React and JavaScript with transaction management, filtering and spending summaries.",
    },
    {
      title: "Real-Time Team Collaboration App",
      difficulty: "Advanced",
      duration: "4–5 weeks",
      description:
        "Develop a collaboration platform where students or teams can create workspaces, tasks and real-time discussions.",
      technologies: [
        "React",
        "Node.js",
        "Socket.io",
        "MongoDB",
        "Express",
      ],
      features: [
        "User authentication",
        "Team workspaces",
        "Task management",
        "Real-time chat",
        "Notifications",
        "Activity history",
      ],
      skills: [
        "Full-Stack Development",
        "WebSockets",
        "MongoDB",
        "React",
        "API Development",
      ],
      roadmap: [
        "Design application architecture",
        "Implement authentication",
        "Create workspace management",
        "Build task management",
        "Add real-time communication",
        "Implement notifications",
        "Deploy and test",
      ],
      resume:
        "Developed a real-time team collaboration platform using React, Node.js and Socket.io with shared workspaces, task management and live communication.",
    },
  ],

  "Data Analyst": [
    {
      title: "Student Performance Analytics",
      difficulty: "Beginner",
      duration: "1–2 weeks",
      description:
        "Analyze student academic data to identify performance patterns, subject-wise trends and students who may need additional support.",
      technologies: [
        "Python",
        "Pandas",
        "Excel",
        "Power BI",
        "Matplotlib",
      ],
      features: [
        "Data cleaning",
        "Subject analysis",
        "Attendance analysis",
        "Performance trends",
        "Interactive dashboard",
        "Performance reports",
      ],
      skills: [
        "Python",
        "Pandas",
        "Excel",
        "Power BI",
        "Data Visualization",
      ],
      roadmap: [
        "Collect sample academic data",
        "Clean the dataset",
        "Perform exploratory analysis",
        "Create visualizations",
        "Build Power BI dashboard",
        "Identify important trends",
        "Prepare final report",
      ],
      resume:
        "Analyzed student performance data using Python, Pandas and Power BI to identify academic trends and create interactive performance dashboards.",
    },
    {
      title: "E-Commerce Sales Dashboard",
      difficulty: "Intermediate",
      duration: "2 weeks",
      description:
        "Create an analytics dashboard that helps businesses understand sales, customers, products and revenue trends.",
      technologies: [
        "Python",
        "SQL",
        "Pandas",
        "Power BI",
        "Excel",
      ],
      features: [
        "Revenue analysis",
        "Product performance",
        "Customer segmentation",
        "Monthly trends",
        "Regional analysis",
        "Interactive dashboard",
      ],
      skills: [
        "SQL",
        "Python",
        "Power BI",
        "Data Cleaning",
        "Business Analytics",
      ],
      roadmap: [
        "Prepare sales dataset",
        "Clean and transform data",
        "Write SQL analysis queries",
        "Perform Python analysis",
        "Create dashboard",
        "Add business KPIs",
        "Present insights",
      ],
      resume:
        "Created an e-commerce sales analytics dashboard using SQL, Python, Pandas and Power BI to identify revenue, product and customer trends.",
    },
  ],

  "Data Scientist": [
    {
      title: "Customer Churn Prediction",
      difficulty: "Advanced",
      duration: "3–4 weeks",
      description:
        "Build a machine learning model that predicts which customers are at risk of leaving a service.",
      technologies: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Matplotlib",
        "Streamlit",
      ],
      features: [
        "Data preprocessing",
        "Exploratory analysis",
        "Feature engineering",
        "Classification models",
        "Model evaluation",
        "Prediction interface",
      ],
      skills: [
        "Machine Learning",
        "Python",
        "Feature Engineering",
        "Classification",
        "Model Evaluation",
      ],
      roadmap: [
        "Prepare customer dataset",
        "Explore customer behavior",
        "Clean the data",
        "Engineer useful features",
        "Train multiple models",
        "Compare evaluation metrics",
        "Build prediction interface",
      ],
      resume:
        "Developed a customer churn prediction model using Python and Scikit-learn with feature engineering, classification and model evaluation.",
    },
    {
      title: "House Price Prediction",
      difficulty: "Intermediate",
      duration: "2–3 weeks",
      description:
        "Build a regression model that predicts house prices from property characteristics.",
      technologies: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Matplotlib",
        "Jupyter",
      ],
      features: [
        "Data cleaning",
        "Exploratory analysis",
        "Feature engineering",
        "Regression models",
        "Model comparison",
        "Price prediction",
      ],
      skills: [
        "Regression",
        "Python",
        "Pandas",
        "Feature Engineering",
        "Data Visualization",
      ],
      roadmap: [
        "Collect a housing dataset",
        "Clean missing values",
        "Explore important variables",
        "Create features",
        "Train regression models",
        "Evaluate model performance",
        "Create prediction interface",
      ],
      resume:
        "Built a house price prediction model using Python, Pandas and Scikit-learn with feature engineering and regression model comparison.",
    },
  ],

  "Frontend Developer": [
    {
      title: "Modern Portfolio Builder",
      difficulty: "Beginner",
      duration: "1–2 weeks",
      description:
        "Create a portfolio builder where students can enter their information and automatically generate a professional developer portfolio.",
      technologies: ["React", "JavaScript", "CSS", "LocalStorage"],
      features: [
        "Profile editor",
        "Project management",
        "Skills section",
        "Experience section",
        "Live preview",
        "Responsive design",
      ],
      skills: [
        "React",
        "JavaScript",
        "CSS",
        "Responsive Design",
        "Component Design",
      ],
      roadmap: [
        "Design portfolio layout",
        "Create profile form",
        "Build reusable components",
        "Add project management",
        "Create live preview",
        "Add responsive styles",
        "Deploy the portfolio",
      ],
      resume:
        "Built a responsive React portfolio builder with live preview, reusable components and dynamic project and skills sections.",
    },
    {
      title: "Interactive Learning Dashboard",
      difficulty: "Intermediate",
      duration: "2–3 weeks",
      description:
        "Develop a visually engaging dashboard where students can track courses, assignments, progress and learning goals.",
      technologies: ["React", "JavaScript", "CSS", "Chart.js"],
      features: [
        "Student dashboard",
        "Course cards",
        "Progress tracking",
        "Assignment tracker",
        "Charts",
        "Responsive UI",
      ],
      skills: [
        "React",
        "UI Design",
        "Data Visualization",
        "JavaScript",
        "Responsive Design",
      ],
      roadmap: [
        "Create dashboard wireframe",
        "Build reusable UI components",
        "Add course management",
        "Implement progress calculations",
        "Add charts",
        "Optimize mobile layout",
        "Deploy application",
      ],
      resume:
        "Created an interactive student learning dashboard using React and JavaScript with progress tracking, assignments and data visualization.",
    },
  ],
};

const defaultRoles = [
  "AI/ML Engineer",
  "Software Developer",
  "Data Analyst",
  "Data Scientist",
  "Frontend Developer",
];

const difficultyFilters = ["All", "Beginner", "Intermediate", "Advanced"];

function loadSavedProjects() {
  try {
    const saved = localStorage.getItem(SAVED_PROJECTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function ProjectGenerator() {
  const [role, setRole] = useState("AI/ML Engineer");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState(loadSavedProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  const generateProjects = () => {
    const availableProjects = projectDatabase[role] || [];

    setProjects(
      [...availableProjects]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
    );

    setShowSaved(false);
    setSelectedProject(null);
  };

  const filteredProjects = useMemo(() => {
    let list = showSaved
      ? savedProjects
      : projects;

    if (!showSaved && list.length === 0) {
      list = projectDatabase[role] || [];
    }

    return list.filter((project) => {
      const matchesDifficulty =
        difficulty === "All" ||
        project.difficulty === difficulty;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        project.title.toLowerCase().includes(searchText) ||
        project.description.toLowerCase().includes(searchText) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchText)
        ) ||
        project.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      return matchesDifficulty && matchesSearch;
    });
  }, [
    role,
    difficulty,
    search,
    projects,
    savedProjects,
    showSaved,
  ]);

  const isSaved = (project) => {
    return savedProjects.some(
      (item) => item.title === project.title
    );
  };

  const toggleSave = (project) => {
    let updated;

    if (isSaved(project)) {
      updated = savedProjects.filter(
        (item) => item.title !== project.title
      );
    } else {
      updated = [
        {
          ...project,
          savedAt: new Date().toISOString(),
        },
        ...savedProjects,
      ];
    }

    setSavedProjects(updated);

    localStorage.setItem(
      SAVED_PROJECTS_KEY,
      JSON.stringify(updated)
    );
  };

  const createCustomProject = () => {
    const available = projectDatabase[role] || [];

    if (!available.length) return;

    const source =
      available[Math.floor(Math.random() * available.length)];

    const customProject = {
      ...source,
      id: Date.now(),
      title: `${source.title} — Personalized Edition`,
      description:
        `A personalized version of ${source.title} designed for a student targeting the ${role} role. ${source.description}`,
    };

    setProjects((current) => [
      customProject,
      ...current.filter(
        (item) => item.title !== customProject.title
      ),
    ]);

    setSelectedProject(customProject);
    setShowSaved(false);
  };

  return (
    <div className="project-generator-page">
      <section className="project-generator-hero">
        <div className="project-hero-content">
          <span className="project-kicker">
            🚀 CAREERPILOT AI
          </span>

          <h1>Project Generator</h1>

          <p>
            Discover practical projects that match your target
            career, build real skills, and strengthen your
            portfolio.
          </p>

          <div className="project-hero-actions">
            <button
              className="project-primary-button"
              onClick={generateProjects}
            >
              ✨ Generate Project Ideas
            </button>

            <button
              className="project-secondary-button"
              onClick={createCustomProject}
            >
              🎯 Personalize One
            </button>
          </div>
        </div>

        <div className="project-hero-visual">
          <div className="project-orbit orbit-one">
            💻
          </div>

          <div className="project-orbit orbit-two">
            🧠
          </div>

          <div className="project-orbit orbit-three">
            🚀
          </div>

          <div className="project-main-icon">
            💡
          </div>
        </div>
      </section>

      <section className="project-generator-controls">
        <div className="project-control">
          <label>Target Role</label>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setProjects([]);
              setShowSaved(false);
              setSelectedProject(null);
            }}
          >
            {defaultRoles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="project-control">
          <label>Difficulty</label>

          <div className="project-filter-buttons">
            {difficultyFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  difficulty === item
                    ? "project-filter-button active"
                    : "project-filter-button"
                }
                onClick={() => setDifficulty(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="project-control project-search-control">
          <label>Search</label>

          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="project-toolbar">
        <div>
          <h2>
            {showSaved
              ? "Saved Projects"
              : `${role} Project Ideas`}
          </h2>

          <p>
            {showSaved
              ? "Your saved project ideas."
              : "Choose a project that matches your current skill level."}
          </p>
        </div>

        <button
          className={
            showSaved
              ? "saved-project-button active"
              : "saved-project-button"
          }
          onClick={() => {
            setShowSaved((value) => !value);
            setSelectedProject(null);
          }}
        >
          {showSaved ? "← All Projects" : "🔖 Saved Projects"}
          {savedProjects.length > 0 && (
            <span>{savedProjects.length}</span>
          )}
        </button>
      </section>

      {filteredProjects.length === 0 ? (
        <div className="project-empty-state">
          <div>🔍</div>
          <h3>No projects found</h3>
          <p>
            Try changing the difficulty, search term or target
            role.
          </p>

          {!showSaved && (
            <button
              className="project-primary-button"
              onClick={generateProjects}
            >
              Generate Again
            </button>
          )}
        </div>
      ) : (
        <section className="project-grid">
          {filteredProjects.map((project, index) => (
            <article
              className="project-card"
              key={`${project.title}-${index}`}
            >
              <div className="project-card-top">
                <div className="project-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <button
                  className={
                    isSaved(project)
                      ? "project-save-button saved"
                      : "project-save-button"
                  }
                  onClick={() => toggleSave(project)}
                  title={
                    isSaved(project)
                      ? "Remove from saved"
                      : "Save project"
                  }
                >
                  {isSaved(project) ? "★" : "☆"}
                </button>
              </div>

              <div className="project-card-badges">
                <span
                  className={`project-difficulty ${project.difficulty
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.difficulty}
                </span>

                <span className="project-duration">
                  ⏱ {project.duration}
                </span>
              </div>

              <h3>{project.title}</h3>

              <p className="project-description">
                {project.description}
              </p>

              <div className="project-tech-list">
                {project.technologies
                  .slice(0, 5)
                  .map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
              </div>

              <div className="project-card-footer">
                <button
                  className="project-view-button"
                  onClick={() =>
                    setSelectedProject(project)
                  }
                >
                  View Project →
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-modal-header">
              <div>
                <span className="project-modal-kicker">
                  PROJECT BLUEPRINT
                </span>

                <h2>{selectedProject.title}</h2>

                <div className="project-modal-meta">
                  <span>
                    {selectedProject.difficulty}
                  </span>
                  <span>
                    ⏱ {selectedProject.duration}
                  </span>
                  <span>🎯 {role}</span>
                </div>
              </div>

              <button
                className="project-close-button"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>

            <div className="project-modal-body">
              <section className="project-detail-section">
                <h3>📌 Problem & Idea</h3>
                <p>{selectedProject.description}</p>
              </section>

              <section className="project-detail-section">
                <h3>🛠 Technologies</h3>

                <div className="project-detail-tags">
                  {selectedProject.technologies.map(
                    (tech) => (
                      <span key={tech}>{tech}</span>
                    )
                  )}
                </div>
              </section>

              <section className="project-detail-section">
                <h3>✨ Core Features</h3>

                <div className="project-feature-grid">
                  {selectedProject.features.map(
                    (feature, index) => (
                      <div
                        className="project-feature-item"
                        key={feature}
                      >
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p>{feature}</p>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="project-detail-section">
                <h3>🧠 Skills You Will Build</h3>

                <div className="project-detail-tags skill-tags">
                  {selectedProject.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>

              <section className="project-detail-section">
                <h3>🗺 Development Roadmap</h3>

                <div className="project-roadmap">
                  {selectedProject.roadmap.map(
                    (step, index) => (
                      <div
                        className="project-roadmap-step"
                        key={step}
                      >
                        <div className="roadmap-number">
                          {index + 1}
                        </div>

                        <div>
                          <strong>
                            Phase {index + 1}
                          </strong>
                          <p>{step}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="project-detail-section resume-description-box">
                <h3>💼 Resume Description</h3>

                <p>{selectedProject.resume}</p>

                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      selectedProject.resume
                    )
                  }
                >
                  Copy Resume Description
                </button>
              </section>
            </div>

            <div className="project-modal-footer">
              <button
                className={
                  isSaved(selectedProject)
                    ? "project-secondary-button saved-modal-button"
                    : "project-secondary-button"
                }
                onClick={() =>
                  toggleSave(selectedProject)
                }
              >
                {isSaved(selectedProject)
                  ? "★ Saved"
                  : "☆ Save Project"}
              </button>

              <button
                className="project-primary-button"
                onClick={() => setSelectedProject(null)}
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectGenerator;