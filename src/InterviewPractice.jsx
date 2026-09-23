import { useMemo, useState } from "react";

const HISTORY_KEY = "careerPilotInterviewHistory";

const roleQuestions = {
  "AI/ML Engineer": {
    Beginner: [
      {
        question: "What is machine learning?",
        keywords: ["data", "model", "learn", "prediction", "algorithm"],
        ideal:
          "Machine learning is a branch of AI where algorithms learn patterns from data and use those patterns to make predictions or decisions without being explicitly programmed for every case.",
      },
      {
        question: "What is the difference between supervised and unsupervised learning?",
        keywords: ["labeled", "unlabeled", "classification", "clustering"],
        ideal:
          "Supervised learning uses labeled data to learn a mapping between inputs and outputs. Unsupervised learning works with unlabeled data to discover patterns such as clusters.",
      },
      {
        question: "What is overfitting?",
        keywords: ["training", "test", "generalize", "complex", "validation"],
        ideal:
          "Overfitting happens when a model learns the training data too closely, including noise, and therefore performs poorly on unseen data.",
      },
      {
        question: "What is Python used for in AI and machine learning?",
        keywords: ["python", "numpy", "pandas", "sklearn", "tensorflow"],
        ideal:
          "Python is widely used for AI and ML because it has libraries such as NumPy, Pandas, Scikit-learn, TensorFlow and PyTorch for data processing, modeling and experimentation.",
      },
    ],

    Intermediate: [
      {
        question: "Explain the bias-variance tradeoff.",
        keywords: ["bias", "variance", "underfitting", "overfitting", "generalization"],
        ideal:
          "Bias represents error from overly simple assumptions, while variance represents sensitivity to training data. High bias can cause underfitting and high variance can cause overfitting. The goal is to balance both for good generalization.",
      },
      {
        question: "How would you handle an imbalanced classification dataset?",
        keywords: ["smote", "oversampling", "undersampling", "class", "weight", "metric"],
        ideal:
          "I would examine the class distribution, use techniques such as class weights, oversampling or SMOTE when appropriate, and evaluate using metrics such as precision, recall, F1-score and ROC-AUC rather than accuracy alone.",
      },
      {
        question: "What is cross-validation and why is it useful?",
        keywords: ["fold", "validation", "training", "model", "generalization"],
        ideal:
          "Cross-validation divides the dataset into multiple folds and repeatedly trains and validates the model using different folds. It gives a more reliable estimate of model performance and helps with model selection.",
      },
      {
        question: "What is feature engineering?",
        keywords: ["feature", "transform", "data", "selection", "model"],
        ideal:
          "Feature engineering is the process of creating, transforming or selecting useful input features from raw data so that a machine learning model can learn more effectively.",
      },
    ],

    Advanced: [
      {
        question: "How would you design an end-to-end machine learning system for production?",
        keywords: ["data", "training", "deployment", "monitoring", "pipeline", "model"],
        ideal:
          "I would design the system around data ingestion and validation, feature processing, model training and evaluation, versioning, deployment, monitoring, logging and retraining. The pipeline should also handle model drift and data quality issues.",
      },
      {
        question: "What is data drift and how would you detect it?",
        keywords: ["distribution", "data", "monitoring", "drift", "production"],
        ideal:
          "Data drift occurs when the distribution of production inputs changes from the training data. It can be detected by monitoring feature distributions, statistical tests, data-quality metrics and changes in model performance.",
      },
      {
        question: "How would you improve a machine learning model that performs poorly in production?",
        keywords: ["data", "features", "model", "monitoring", "error", "retrain"],
        ideal:
          "I would first inspect production data quality and compare it with training data, analyze model errors, check for drift, review feature engineering and model assumptions, and then retrain or redesign the model based on the evidence.",
      },
    ],
  },

  "Software Developer": {
    Beginner: [
      {
        question: "What is the difference between a variable and a function?",
        keywords: ["variable", "value", "function", "code", "reuse"],
        ideal:
          "A variable stores a value or reference, while a function is a reusable block of code that performs a specific operation and can accept inputs and return outputs.",
      },
      {
        question: "What is Git and why is it useful?",
        keywords: ["git", "version", "control", "commit", "repository"],
        ideal:
          "Git is a distributed version control system used to track code changes, create branches, collaborate with others and maintain project history.",
      },
      {
        question: "What is an API?",
        keywords: ["api", "application", "interface", "request", "response"],
        ideal:
          "An API is an interface that allows different software systems to communicate. A client can send a request and receive a response according to the API's defined contract.",
      },
    ],

    Intermediate: [
      {
        question: "What is the difference between SQL and NoSQL databases?",
        keywords: ["sql", "nosql", "relational", "document", "schema"],
        ideal:
          "SQL databases are generally relational and use structured schemas and tables. NoSQL databases use models such as documents, key-value pairs or graphs and are often useful when data structures or scaling requirements differ.",
      },
      {
        question: "Explain time complexity.",
        keywords: ["time", "complexity", "input", "algorithm", "big", "o"],
        ideal:
          "Time complexity describes how the running time of an algorithm grows as the input size increases. Big-O notation is commonly used to describe this growth.",
      },
      {
        question: "What is REST?",
        keywords: ["rest", "http", "api", "get", "post", "resource"],
        ideal:
          "REST is an architectural style for designing network APIs around resources and standard HTTP operations such as GET, POST, PUT and DELETE.",
      },
    ],

    Advanced: [
      {
        question: "How would you design a scalable web application?",
        keywords: ["load", "cache", "database", "server", "scaling", "monitoring"],
        ideal:
          "I would separate concerns between frontend, backend and data layers, use scalable services, caching, database optimization, load balancing where necessary, monitoring and reliable deployment practices.",
      },
      {
        question: "How would you debug a slow API?",
        keywords: ["logs", "database", "latency", "profiling", "query", "monitor"],
        ideal:
          "I would measure the API latency, inspect logs and traces, identify whether the bottleneck is application code, database queries, external services or infrastructure, then profile and optimize the actual bottleneck.",
      },
    ],
  },

  "Data Analyst": {
    Beginner: [
      {
        question: "What is data analysis?",
        keywords: ["data", "analyze", "pattern", "insight", "decision"],
        ideal:
          "Data analysis is the process of examining, cleaning and interpreting data to identify patterns, generate insights and support decision-making.",
      },
      {
        question: "What is the difference between mean and median?",
        keywords: ["mean", "median", "average", "outlier"],
        ideal:
          "Mean is calculated by adding values and dividing by the number of values. Median is the middle value after sorting. Median is generally less affected by extreme outliers.",
      },
      {
        question: "Why is SQL important for data analysts?",
        keywords: ["sql", "database", "query", "data", "table"],
        ideal:
          "SQL allows analysts to retrieve, filter, join and aggregate data stored in relational databases.",
      },
    ],

    Intermediate: [
      {
        question: "How do you handle missing values in a dataset?",
        keywords: ["missing", "null", "remove", "impute", "median", "mean"],
        ideal:
          "I would first understand why values are missing. Depending on the situation, I might remove records, use statistical imputation or create a separate category for missing values.",
      },
      {
        question: "What is the difference between correlation and causation?",
        keywords: ["correlation", "causation", "relationship", "cause"],
        ideal:
          "Correlation means two variables are associated, while causation means a change in one variable directly contributes to a change in another. Correlation alone does not establish causation.",
      },
      {
        question: "What makes a good dashboard?",
        keywords: ["dashboard", "visualization", "metric", "user", "simple"],
        ideal:
          "A good dashboard focuses on relevant metrics, presents information clearly, avoids unnecessary visual complexity and allows the intended users to quickly understand important trends.",
      },
    ],

    Advanced: [
      {
        question: "How would you investigate a sudden drop in business revenue?",
        keywords: ["data", "segment", "trend", "customer", "product", "compare"],
        ideal:
          "I would validate the data first, compare the current period with historical periods, segment the decline by product, region, customer type and channel, identify where the change is concentrated and then investigate likely causes.",
      },
    ],
  },

  "Data Scientist": {
    Beginner: [
      {
        question: "What is the difference between data science and data analysis?",
        keywords: ["data", "analysis", "machine", "model", "prediction"],
        ideal:
          "Data analysis focuses heavily on understanding existing data and generating insights, while data science can additionally involve predictive modeling, machine learning and experimentation.",
      },
      {
        question: "What is a training dataset?",
        keywords: ["training", "data", "model", "learn"],
        ideal:
          "A training dataset is the portion of data used by a machine learning algorithm to learn patterns and model parameters.",
      },
    ],

    Intermediate: [
      {
        question: "What is precision and recall?",
        keywords: ["precision", "recall", "positive", "false", "classification"],
        ideal:
          "Precision measures how many predicted positives are actually positive. Recall measures how many actual positives were correctly identified.",
      },
      {
        question: "Why do we split data into training and testing sets?",
        keywords: ["training", "testing", "unseen", "generalization", "model"],
        ideal:
          "The training set is used to learn the model, while the test set provides an evaluation on unseen data to estimate how well the model generalizes.",
      },
    ],

    Advanced: [
      {
        question: "How would you choose a machine learning model for a business problem?",
        keywords: ["problem", "data", "metric", "model", "baseline", "interpret"],
        ideal:
          "I would first define the business objective and evaluation metric, understand the data, establish a baseline, compare appropriate models using validation and consider performance, interpretability, cost and deployment constraints.",
      },
    ],
  },

  "Frontend Developer": {
    Beginner: [
      {
        question: "What is the difference between HTML, CSS and JavaScript?",
        keywords: ["html", "css", "javascript", "structure", "style", "behavior"],
        ideal:
          "HTML defines page structure, CSS controls presentation and layout, and JavaScript adds logic and interactive behavior.",
      },
      {
        question: "What is React?",
        keywords: ["react", "component", "javascript", "ui", "user"],
        ideal:
          "React is a JavaScript library for building user interfaces using reusable components and state-driven rendering.",
      },
    ],

    Intermediate: [
      {
        question: "What is state in React?",
        keywords: ["state", "react", "component", "change", "render"],
        ideal:
          "State is data managed by a React component that can change over time. Updating state causes React to render the affected UI again.",
      },
      {
        question: "What is the purpose of useEffect?",
        keywords: ["useeffect", "effect", "react", "side", "render"],
        ideal:
          "useEffect is a React Hook used to perform side effects such as data fetching, subscriptions or interacting with external systems after rendering.",
      },
      {
        question: "How would you improve frontend performance?",
        keywords: ["performance", "lazy", "bundle", "image", "cache", "render"],
        ideal:
          "I would identify the actual bottlenecks and then consider code splitting, lazy loading, optimized assets, reducing unnecessary renders, caching and minimizing bundle size.",
      },
    ],

    Advanced: [
      {
        question: "How would you architect a large React application?",
        keywords: ["component", "state", "routing", "api", "architecture", "testing"],
        ideal:
          "I would organize the application into reusable components and feature modules, define clear state-management boundaries, separate API services, use routing and shared UI components, and include testing and performance practices.",
      },
    ],
  },
};

const fallbackQuestions = [
  {
    question: "Tell me about yourself and your career goals.",
    keywords: ["student", "skills", "project", "career", "goal"],
    ideal:
      "Give a concise introduction covering your education, relevant skills, projects or experience, and the type of role you are targeting.",
  },
  {
    question: "Tell me about a project you worked on.",
    keywords: ["project", "problem", "solution", "technology", "result"],
    ideal:
      "Explain the problem, your solution, technologies used, your personal contribution and the result.",
  },
  {
    question: "Why should we consider you for this role?",
    keywords: ["skills", "project", "learn", "contribute", "role"],
    ideal:
      "Connect your strongest relevant skills and practical experience to the requirements of the role and explain how you can contribute.",
  },
];

const roles = Object.keys(roleQuestions);
const difficulties = ["Beginner", "Intermediate", "Advanced"];

function getQuestions(role, difficulty) {
  return roleQuestions[role]?.[difficulty] || fallbackQuestions;
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function calculateEvaluation(answer, question) {
  const cleanedAnswer = answer.toLowerCase().trim();

  if (!cleanedAnswer) {
    return {
      score: 0,
      relevance: 0,
      technical: 0,
      communication: 0,
      matchedKeywords: [],
      missingKeywords: question.keywords,
      feedback:
        "No answer was provided. Try answering the question in your own words and include the main concepts related to it.",
    };
  }

  const words = cleanedAnswer.split(/\s+/).filter(Boolean);

  const matchedKeywords = question.keywords.filter((keyword) =>
    cleanedAnswer.includes(keyword.toLowerCase())
  );

  const missingKeywords = question.keywords.filter(
    (keyword) => !cleanedAnswer.includes(keyword.toLowerCase())
  );

  const keywordScore =
    (matchedKeywords.length / question.keywords.length) * 100;

  const lengthScore =
    words.length >= 80
      ? 100
      : words.length >= 50
      ? 90
      : words.length >= 30
      ? 75
      : words.length >= 15
      ? 55
      : 35;

  const relevance = Math.round(keywordScore);
  const communication = Math.round(lengthScore);
  const technical = Math.round(
    keywordScore * 0.75 + lengthScore * 0.25
  );

  const score = Math.round(
    relevance * 0.4 +
      technical * 0.4 +
      communication * 0.2
  );

  let feedback = "";

  if (score >= 80) {
    feedback =
      "Strong answer. You covered several important concepts and gave enough detail to demonstrate understanding.";
  } else if (score >= 60) {
    feedback =
      "Good start. Your answer contains some relevant concepts, but adding more technical detail would make it stronger.";
  } else {
    feedback =
      "Your answer needs more depth. Try explaining the concept directly, adding an example, and covering the important technical terms.";
  }

  return {
    score,
    relevance,
    technical,
    communication,
    matchedKeywords,
    missingKeywords,
    feedback,
  };
}

function InterviewPractice() {
  const [stage, setStage] = useState("setup");

  const [role, setRole] = useState("AI/ML Engineer");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState([]);

  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentIndex];

  const averageScore = useMemo(() => {
    if (!evaluations.length) return 0;

    return Math.round(
      evaluations.reduce((total, item) => total + item.score, 0) /
        evaluations.length
    );
  }, [evaluations]);

  const startInterview = () => {
    const availableQuestions = getQuestions(role, difficulty);

    const selected = [...availableQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(questionCount, availableQuestions.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setAnswer("");
    setEvaluations([]);
    setCurrentEvaluation(null);
    setShowAnswer(false);
    setStage("interview");
  };

  const evaluateAnswer = () => {
    if (!currentQuestion) return;

    const evaluation = calculateEvaluation(
      answer,
      currentQuestion
    );

    setCurrentEvaluation(evaluation);
  };

  const nextQuestion = () => {
    if (!currentEvaluation) return;

    const updatedEvaluations = [
      ...evaluations,
      {
        question: currentQuestion.question,
        answer,
        ...currentEvaluation,
      },
    ];

    setEvaluations(updatedEvaluations);

    if (currentIndex + 1 >= questions.length) {
      finishInterview(updatedEvaluations);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setAnswer("");
    setCurrentEvaluation(null);
    setShowAnswer(false);
  };

  const finishInterview = (finalEvaluations) => {
    const score = Math.round(
      finalEvaluations.reduce(
        (total, item) => total + item.score,
        0
      ) / finalEvaluations.length
    );

    const result = {
      id: Date.now(),
      role,
      difficulty,
      date: new Date().toISOString(),
      score,
      questions: finalEvaluations.length,
      evaluations: finalEvaluations,
    };

    const updatedHistory = [result, ...history].slice(0, 10);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );

    setHistory(updatedHistory);
    setEvaluations(finalEvaluations);
    setStage("results");
  };

  const restartInterview = () => {
    setStage("setup");
    setAnswer("");
    setCurrentEvaluation(null);
    setEvaluations([]);
    setCurrentIndex(0);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const scoreLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Keep Practicing";
  };

  if (stage === "setup") {
    return (
      <div className="interview-page">
        <div className="interview-hero">
          <div>
            <span className="interview-kicker">
              🎤 CAREERPILOT AI
            </span>

            <h1>AI Interview Practice</h1>

            <p>
              Practice role-specific interview questions,
              evaluate your answers, and identify the areas
              you need to improve.
            </p>
          </div>

          <div className="interview-hero-icon">🎯</div>
        </div>

        <div className="interview-setup-grid">
          <div className="interview-setup-card">
            <div className="interview-card-title">
              <span>01</span>
              <div>
                <h2>Choose your interview</h2>
                <p>Customize the interview for your target role.</p>
              </div>
            </div>

            <div className="interview-field">
              <label>Target Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="interview-field">
              <label>Difficulty</label>

              <div className="difficulty-options">
                {difficulties.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      difficulty === item
                        ? "difficulty-option active"
                        : "difficulty-option"
                    }
                    onClick={() => setDifficulty(item)}
                  >
                    <strong>{item}</strong>
                    <span>
                      {item === "Beginner"
                        ? "Fundamentals"
                        : item === "Intermediate"
                        ? "Practical"
                        : "Advanced"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="interview-field">
              <label>Number of Questions</label>

              <div className="question-count-options">
                {[3, 5, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={
                      questionCount === count
                        ? "count-option active"
                        : "count-option"
                    }
                    onClick={() => setQuestionCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="start-interview-button"
              onClick={startInterview}
            >
              Start Interview →
            </button>
          </div>

          <div className="interview-info-card">
            <div className="interview-info-icon">🧠</div>

            <h2>How it works</h2>

            <div className="interview-step">
              <span>1</span>
              <div>
                <strong>Answer</strong>
                <p>Answer each question as if you were in a real interview.</p>
              </div>
            </div>

            <div className="interview-step">
              <span>2</span>
              <div>
                <strong>Evaluate</strong>
                <p>CareerPilot checks relevance, technical coverage and communication.</p>
              </div>
            </div>

            <div className="interview-step">
              <span>3</span>
              <div>
                <strong>Improve</strong>
                <p>See missing concepts and a suggested answer structure.</p>
              </div>
            </div>

            <div className="interview-demo-note">
              💡 <strong>Practice tip:</strong> Don't try to
              memorize answers. Explain concepts in your own
              words and use examples from your projects.
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="interview-history-card">
            <div className="history-header">
              <div>
                <h2>Recent Interviews</h2>
                <p>Your previous practice sessions.</p>
              </div>

              <button onClick={clearHistory}>
                Clear History
              </button>
            </div>

            <div className="history-list">
              {history.slice(0, 5).map((item) => (
                <div className="history-item" key={item.id}>
                  <div>
                    <strong>{item.role}</strong>
                    <span>
                      {item.difficulty} • {item.questions} questions
                    </span>
                  </div>

                  <div className="history-score">
                    <strong>{item.score}%</strong>
                    <span>{scoreLabel(item.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === "interview") {
    const progress =
      ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="interview-page">
        <div className="interview-session-header">
          <div>
            <span className="interview-kicker">
              🎤 INTERVIEW SESSION
            </span>
            <h1>{role}</h1>
            <p>{difficulty} difficulty</p>
          </div>

          <button
            className="exit-interview-button"
            onClick={restartInterview}
          >
            Exit
          </button>
        </div>

        <div className="interview-progress-container">
          <div className="interview-progress-top">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <strong>{Math.round(progress)}%</strong>
          </div>

          <div className="interview-progress-track">
            <div
              className="interview-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="interview-question-card">
          <div className="question-number">
            QUESTION {String(currentIndex + 1).padStart(2, "0")}
          </div>

          <h2>{currentQuestion?.question}</h2>

          <p className="question-instruction">
            Explain your answer clearly. Include an example
            when possible.
          </p>

          <textarea
            className="interview-answer-box"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setCurrentEvaluation(null);
            }}
            placeholder="Type your answer here..."
            rows="9"
          />

          <div className="answer-footer">
            <span>{answer.trim().split(/\s+/).filter(Boolean).length} words</span>

            {!currentEvaluation ? (
              <button
                className="evaluate-answer-button"
                onClick={evaluateAnswer}
              >
                Evaluate Answer →
              </button>
            ) : (
              <button
                className="next-question-button"
                onClick={nextQuestion}
              >
                {currentIndex + 1 === questions.length
                  ? "View Results →"
                  : "Next Question →"}
              </button>
            )}
          </div>
        </div>

        {currentEvaluation && (
          <div className="evaluation-card">
            <div className="evaluation-header">
              <div>
                <span>ANSWER EVALUATION</span>
                <h2>{scoreLabel(currentEvaluation.score)}</h2>
              </div>

              <div className="evaluation-score">
                {currentEvaluation.score}
                <small>/100</small>
              </div>
            </div>

            <div className="evaluation-metrics">
              <EvaluationMetric
                label="Relevance"
                value={currentEvaluation.relevance}
              />

              <EvaluationMetric
                label="Technical"
                value={currentEvaluation.technical}
              />

              <EvaluationMetric
                label="Communication"
                value={currentEvaluation.communication}
              />
            </div>

            <div className="evaluation-feedback">
              <strong>💬 Feedback</strong>
              <p>{currentEvaluation.feedback}</p>
            </div>

            {currentEvaluation.matchedKeywords.length > 0 && (
              <div className="keyword-section">
                <strong>✓ Concepts covered</strong>

                <div>
                  {currentEvaluation.matchedKeywords.map(
                    (keyword) => (
                      <span
                        className="keyword-tag matched"
                        key={keyword}
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {currentEvaluation.missingKeywords.length > 0 && (
              <div className="keyword-section">
                <strong>📌 Concepts you could add</strong>

                <div>
                  {currentEvaluation.missingKeywords.map(
                    (keyword) => (
                      <span
                        className="keyword-tag missing"
                        key={keyword}
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="model-answer-section">
              <button
                className="model-answer-toggle"
                onClick={() => setShowAnswer((value) => !value)}
              >
                {showAnswer
                  ? "Hide suggested answer"
                  : "Show suggested answer"}
              </button>

              {showAnswer && (
                <div className="model-answer">
                  <p>{currentQuestion.ideal}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="interview-results-hero">
        <div className="results-trophy">🏆</div>

        <span className="interview-kicker">
          INTERVIEW COMPLETE
        </span>

        <h1>Great work!</h1>

        <p>
          You completed your {difficulty.toLowerCase()}{" "}
          {role} practice interview.
        </p>

        <div className="final-score">
          <strong>{averageScore}</strong>
          <span>/100</span>
        </div>

        <div className="final-score-label">
          {scoreLabel(averageScore)}
        </div>
      </div>

      <div className="results-grid">
        <div className="result-stat-card">
          <span>📝</span>
          <strong>{evaluations.length}</strong>
          <p>Questions Answered</p>
        </div>

        <div className="result-stat-card">
          <span>🎯</span>
          <strong>{averageScore}%</strong>
          <p>Overall Score</p>
        </div>

        <div className="result-stat-card">
          <span>💡</span>
          <strong>
            {
              evaluations.reduce(
                (total, item) =>
                  total + item.missingKeywords.length,
                0
              )
            }
          </strong>
          <p>Concepts to Review</p>
        </div>
      </div>

      <div className="results-card">
        <div className="results-card-header">
          <div>
            <h2>Question-by-Question Review</h2>
            <p>Review your answers and identify improvement areas.</p>
          </div>
        </div>

        <div className="results-list">
          {evaluations.map((item, index) => (
            <div className="result-question" key={index}>
              <div className="result-question-top">
                <div>
                  <span>Question {index + 1}</span>
                  <h3>{item.question}</h3>
                </div>

                <div className="result-question-score">
                  {item.score}/100
                </div>
              </div>

              <div className="result-answer">
                <strong>Your answer</strong>
                <p>{item.answer || "No answer provided."}</p>
              </div>

              <div className="result-feedback">
                <strong>Feedback</strong>
                <p>{item.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-actions">
        <button
          className="start-interview-button"
          onClick={restartInterview}
        >
          Practice Again
        </button>
      </div>
    </div>
  );
}

function EvaluationMetric({ label, value }) {
  return (
    <div className="evaluation-metric">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="metric-track">
        <div
          className="metric-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default InterviewPractice;