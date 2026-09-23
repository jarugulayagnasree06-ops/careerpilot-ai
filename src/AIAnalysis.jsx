function AIAnalysis({ result }) {
  if (!result) {
    return null;
  }

  const roadmap = [
    {
      week: "Week 1",
      title: "Strengthen Fundamentals",
      description:
        "Revise the core concepts required for your target career.",
    },
    {
      week: "Week 2",
      title: "Learn Missing Skills",
      description:
        "Focus on the important skills identified from your career analysis.",
    },
    {
      week: "Week 3",
      title: "Build a Real Project",
      description:
        "Create one practical project using the skills you have learned.",
    },
    {
      week: "Week 4",
      title: "Prepare for Jobs",
      description:
        "Improve your resume, GitHub profile and interview preparation.",
    },
  ];

  return (
    <div className="ai-analysis">
      <div className="ai-analysis-header">
        <div>
          <span className="ai-label">🤖 AI CAREER INSIGHT</span>

          <h2>Your Personalized Career Analysis</h2>

          <p>
            Based on your current profile and target role,
            here is a suggested path to improve your job readiness.
          </p>
        </div>

        <div className="ai-score">
          <strong>{result.score}%</strong>
          <span>Readiness</span>
        </div>
      </div>

      <div className="ai-analysis-grid">
        <div className="ai-analysis-box">
          <div className="ai-box-icon">💪</div>

          <h3>Your Strengths</h3>

          {result.matchedSkills?.length > 0 ? (
            <div className="ai-skill-list">
              {result.matchedSkills.map((skill) => (
                <span className="ai-skill matched" key={skill}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>
              Your profile needs more role-specific skills.
              Start with the recommended skills below.
            </p>
          )}
        </div>

        <div className="ai-analysis-box">
          <div className="ai-box-icon">📚</div>

          <h3>Skills To Improve</h3>

          {result.missingSkills?.length > 0 ? (
            <div className="ai-skill-list">
              {result.missingSkills.map((skill) => (
                <span className="ai-skill missing" key={skill}>
                  + {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>
              You currently match all the listed role skills.
            </p>
          )}
        </div>
      </div>

      <div className="ai-advice">
        <div className="ai-advice-icon">💡</div>

        <div>
          <span>PERSONALIZED ADVICE</span>

          <h3>
            Focus on practical skills and real-world projects.
          </h3>

          <p>
            For a <strong>{result.targetRole}</strong> career,
            combine your existing skills with the missing skills
            identified above. Building practical projects will
            help you demonstrate those skills to recruiters.
          </p>
        </div>
      </div>

      <div className="roadmap-section">
        <div className="roadmap-heading">
          <span>🛣️ YOUR STARTING ROADMAP</span>

          <h2>30-Day Career Plan</h2>

          <p>
            A simple starting plan based on your current analysis.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <div className="roadmap-card" key={item.week}>
              <span className="roadmap-week">{item.week}</span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-disclaimer">
        <span>ℹ️</span>

        <p>
          This is a career guidance recommendation based on the
          information you provided. It is not a guarantee of
          employment or a prediction of hiring outcomes.
        </p>
      </div>
    </div>
  );
}

export default AIAnalysis;