import { useState } from "react";
import { supabase } from "./supabaseClient";

function CareerAssistant({ user }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! I'm your CareerPilot AI Assistant 👋

I can help you with career planning, skills, projects, resumes, interviews and job preparation.

Tell me what career goal you're working toward.`,
    },
  ]);

  const quickQuestions = [
    "What skills should I learn for an AI/ML job?",
    "Give me a 30-day career plan",
    "What projects should I build?",
    "How can I improve my resume?",
  ];

  const getResponse = (question) => {
    const text = question.toLowerCase();

    if (
      text.includes("skill") ||
      text.includes("learn") ||
      text.includes("ai/ml") ||
      text.includes("aiml")
    ) {
      return `For an AI/ML career, focus on:

1. Python
2. SQL
3. NumPy and Pandas
4. Statistics
5. Machine Learning
6. Data Visualization
7. Git & GitHub
8. Deep Learning
9. Generative AI
10. Real-world projects

Start with Python, SQL and statistics. Then move into machine learning and practical projects.

The important thing is not just learning these skills. You should be able to demonstrate them through projects.`;
    }

    if (
      text.includes("30-day") ||
      text.includes("30 day") ||
      text.includes("plan")
    ) {
      return `Here's a practical 30-day career plan:

WEEK 1
• Strengthen programming fundamentals
• Practice basic DSA
• Revise Git and GitHub

WEEK 2
• Learn your target-role skills
• Practice SQL
• Solve small coding problems

WEEK 3
• Build one practical project
• Upload it to GitHub
• Create a good README

WEEK 4
• Improve your resume
• Practice interviews
• Prepare project explanations
• Start applying for internships/jobs

Try to maintain 1–2 focused hours of preparation every day.`;
    }

    if (
      text.includes("project") ||
      text.includes("portfolio")
    ) {
      return `For your portfolio, build projects that demonstrate real problem-solving.

Some useful project ideas:

• AI/ML prediction system
• Computer vision application
• AI-powered student productivity app
• Recommendation system
• Resume analyzer
• Career guidance platform
• Data analytics dashboard

For each project explain:

Problem → Solution → Technology → Your Contribution → Result → Demo

A smaller completed project is usually more useful than an unfinished large project.`;
    }

    if (
      text.includes("resume") ||
      text.includes("cv")
    ) {
      return `For a student resume, keep the focus on evidence.

Recommended structure:

1. Name and contact
2. Professional summary
3. Technical skills
4. Projects
5. Internship/experience
6. Education
7. Certifications
8. Achievements

For every important project mention:

• Problem solved
• Technologies used
• What you personally built
• Results or measurable impact

Only include skills you can confidently explain in an interview.`;
    }

    if (
      text.includes("interview") ||
      text.includes("job")
    ) {
      return `Prepare for interviews in four areas:

TECHNICAL
• Programming
• DSA
• SQL
• Target-role concepts

PROJECTS
• Architecture
• Your contribution
• Challenges
• Technology choices

HR
• Tell me about yourself
• Why this role?
• Your strengths
• Your weaknesses
• Career goals

COMMUNICATION
Practice explaining your projects in simple language.

You should be able to explain the important parts of every project listed on your resume.`;
    }

    return `Here's a useful way to approach your career:

🎯 Choose a target role
↓
📚 Identify required skills
↓
🔎 Find your skill gaps
↓
🛠️ Build projects
↓
📄 Create your resume
↓
🎤 Practice interviews
↓
💼 Apply for opportunities

Ask me about skills, projects, resumes, interviews or career planning and I'll help you create a practical plan.`;
  };

  const sendMessage = async (customMessage = null) => {
    const question = (
      customMessage || message
    ).trim();

    if (!question || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: question,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      if (user) {
        await supabase
          .from("profiles")
          .select(
            "full_name, branch, year, cgpa, target_role, skills, readiness_score"
          )
          .eq("id", user.id)
          .maybeSingle();
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const response = getResponse(question);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <section className="assistant-page">
      <div className="assistant-header">
        <div>
          <span className="assistant-label">
            🤖 CAREERPILOT AI
          </span>

          <h1>AI Career Assistant</h1>

          <p>
            Your career planning workspace for skills,
            projects, resumes, interviews and job preparation.
          </p>
        </div>

        <div className="assistant-status">
          <span></span>
          Assistant Online
        </div>
      </div>

      <div className="assistant-layout">
        <aside className="assistant-sidebar">
          <div className="assistant-sidebar-title">
            QUICK QUESTIONS
          </div>

          {quickQuestions.map((question) => (
            <button
              key={question}
              className="quick-question"
              onClick={() => sendMessage(question)}
            >
              {question}
              <span>→</span>
            </button>
          ))}

          <div className="assistant-tip">
            <span>💡</span>

            <div>
              <strong>Career Tip</strong>

              <p>
                Focus on the skills required for your
                target role instead of trying to learn
                everything.
              </p>
            </div>
          </div>
        </aside>

        <div className="assistant-chat">
          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.role === "user"
                    ? "chat-row user-row"
                    : "chat-row"
                }
              >
                {item.role === "assistant" && (
                  <div className="chat-avatar">
                    🤖
                  </div>
                )}

                <div
                  className={
                    item.role === "user"
                      ? "chat-bubble user-bubble"
                      : "chat-bubble"
                  }
                >
                  {item.text.split("\n").map(
                    (line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        <br />
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-row">
                <div className="chat-avatar">
                  🤖
                </div>

                <div className="chat-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <form
            className="assistant-input-area"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask CareerPilot about your career..."
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
            >
              {loading ? "..." : "Send →"}
            </button>
          </form>

          <div className="assistant-disclaimer">
            Career guidance is informational and does not
            guarantee employment or hiring outcomes.
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerAssistant;