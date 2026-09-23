import { useEffect, useMemo, useState } from "react";

const TASKS_KEY = "careerPilotStudyTasks";
const SUBJECTS_KEY = "careerPilotSubjects";
const SESSIONS_KEY = "careerPilotStudySessions";

const defaultSubjects = [
  "Machine Learning",
  "Data Structures",
  "Database Management",
];

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function StudyPlanner() {
  const [subjects, setSubjects] = useState(() =>
    loadStorage(SUBJECTS_KEY, defaultSubjects)
  );

  const [tasks, setTasks] = useState(() =>
    loadStorage(TASKS_KEY, [])
  );

  const [sessions, setSessions] = useState(() =>
    loadStorage(SESSIONS_KEY, [])
  );

  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState(
    defaultSubjects[0]
  );
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");

  const [subjectName, setSubjectName] = useState("");

  const [filter, setFilter] = useState("All");

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("Focus");

  const [todaySessionMinutes, setTodaySessionMinutes] =
    useState(0);

  useEffect(() => {
    localStorage.setItem(
      TASKS_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      SUBJECTS_KEY,
      JSON.stringify(subjects)
    );
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(
      SESSIONS_KEY,
      JSON.stringify(sessions)
    );
  }, [sessions]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!timerRunning) return;

      setSecondsLeft((previous) => {
        if (previous <= 1) {
          setTimerRunning(false);

          if (timerMode === "Focus") {
            const newSession = {
              id: Date.now(),
              minutes: 25,
              date: new Date().toISOString(),
            };

            setSessions((previousSessions) => [
              ...previousSessions,
              newSession,
            ]);
          }

          return timerMode === "Focus"
            ? 5 * 60
            : 25 * 60;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, timerMode]);

  useEffect(() => {
    const today = new Date().toDateString();

    const minutes = sessions
      .filter(
        (session) =>
          new Date(session.date).toDateString() === today
      )
      .reduce(
        (total, session) => total + session.minutes,
        0
      );

    setTodaySessionMinutes(minutes);
  }, [sessions]);

  const addSubject = () => {
    const cleanName = subjectName.trim();

    if (!cleanName) return;

    const exists = subjects.some(
      (subject) =>
        subject.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      setSubjectName("");
      return;
    }

    setSubjects((previous) => [
      ...previous,
      cleanName,
    ]);

    setTaskSubject(cleanName);
    setSubjectName("");
  };

  const addTask = (event) => {
    event.preventDefault();

    if (!taskTitle.trim()) return;

    const task = {
      id: Date.now(),
      title: taskTitle.trim(),
      subject: taskSubject,
      dueDate: taskDate,
      priority: taskPriority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedDate: null,
    };

    setTasks((previous) => [
      task,
      ...previous,
    ]);

    setTaskTitle("");
    setTaskDate("");
    setTaskPriority("Medium");
  };

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((task) => {
        if (task.id !== id) return task;

        const completed = !task.completed;

        return {
          ...task,
          completed,
          completedDate: completed
            ? new Date().toISOString()
            : null,
        };
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const resetTimer = () => {
    setTimerRunning(false);

    setSecondsLeft(
      timerMode === "Focus"
        ? 25 * 60
        : 5 * 60
    );
  };

  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setTimerRunning(false);

    setSecondsLeft(
      mode === "Focus"
        ? 25 * 60
        : 5 * 60
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }

    if (filter === "Pending") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "High") {
      return tasks.filter(
        (task) => task.priority === "High"
      );
    }

    return tasks;
  }, [tasks, filter]);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100
        );

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayTasks = tasks.filter(
    (task) => task.dueDate === today
  ).length;

  return (
    <section className="study-planner-page">

      <div className="study-planner-header">

        <div>
          <span className="study-planner-label">
            📚 CAREERPILOT AI
          </span>

          <h1>
            Study Planner
          </h1>

          <p>
            Organize your study tasks, track progress
            and build consistent learning habits.
          </p>
        </div>

        <div className="study-planner-status">
          <span></span>
          Focus Workspace
        </div>

      </div>

      {/* STATS */}

      <div className="study-stats-grid">

        <div className="study-stat-card">
          <span className="study-stat-icon">
            📋
          </span>

          <div>
            <small>Total Tasks</small>
            <strong>{tasks.length}</strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            ⏳
          </span>

          <div>
            <small>Pending</small>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            ✓
          </span>

          <div>
            <small>Completed</small>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            🎯
          </span>

          <div>
            <small>Progress</small>
            <strong>{progress}%</strong>
          </div>
        </div>

      </div>

      <div className="study-planner-main">

        {/* LEFT */}

        <div className="study-planner-left">

          <div className="study-card add-task-card">

            <div className="study-card-heading">
              <div>
                <span>01</span>
                <h2>Add Study Task</h2>
              </div>

              <small>
                {todayTasks} task(s) today
              </small>
            </div>

            <form onSubmit={addTask}>

              <div className="study-form-group">

                <label>
                  TASK
                </label>

                <input
                  type="text"
                  value={taskTitle}
                  onChange={(event) =>
                    setTaskTitle(
                      event.target.value
                    )
                  }
                  placeholder="Example: Revise KNN algorithm"
                />

              </div>

              <div className="study-form-row">

                <div className="study-form-group">

                  <label>
                    SUBJECT
                  </label>

                  <select
                    value={taskSubject}
                    onChange={(event) =>
                      setTaskSubject(
                        event.target.value
                      )
                    }
                  >
                    {subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="study-form-group">

                  <label>
                    DUE DATE
                  </label>

                  <input
                    type="date"
                    value={taskDate}
                    onChange={(event) =>
                      setTaskDate(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="study-form-group">

                  <label>
                    PRIORITY
                  </label>

                  <select
                    value={taskPriority}
                    onChange={(event) =>
                      setTaskPriority(
                        event.target.value
                      )
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>

                </div>

              </div>

              <button
                type="submit"
                className="study-add-task-button"
              >
                + Add Task
              </button>

            </form>

          </div>

          {/* TASK LIST */}

          <div className="study-card task-list-card">

            <div className="study-card-heading">

              <div>
                <span>02</span>
                <h2>My Tasks</h2>
              </div>

              <div className="task-filters">

                {[
                  "All",
                  "Pending",
                  "Completed",
                  "High",
                ].map((item) => (
                  <button
                    key={item}
                    className={
                      filter === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter(item)
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty-study-state">

                <div>
                  📚
                </div>

                <h3>
                  No tasks here yet
                </h3>

                <p>
                  Add a study task above and
                  start building your learning plan.
                </p>

              </div>
            ) : (
              <div className="study-task-list">

                {filteredTasks.map((task) => (
                  <div
                    className={
                      task.completed
                        ? "study-task completed"
                        : "study-task"
                    }
                    key={task.id}
                  >

                    <button
                      className="task-check"
                      onClick={() =>
                        toggleTask(task.id)
                      }
                    >
                      {task.completed
                        ? "✓"
                        : ""}
                    </button>

                    <div className="study-task-info">

                      <strong>
                        {task.title}
                      </strong>

                      <div className="study-task-meta">

                        <span>
                          {task.subject}
                        </span>

                        {task.dueDate && (
                          <span>
                            📅{" "}
                            {new Date(
                              `${task.dueDate}T00:00:00`
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                          </span>
                        )}

                        <span
                          className={`priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                      </div>

                    </div>

                    <button
                      className="task-delete"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      title="Delete task"
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* SUBJECTS */}

          <div className="study-card subjects-card">

            <div className="study-card-heading">

              <div>
                <span>03</span>
                <h2>My Subjects</h2>
              </div>

              <small>
                {subjects.length} subjects
              </small>

            </div>

            <div className="subject-add-row">

              <input
                type="text"
                value={subjectName}
                onChange={(event) =>
                  setSubjectName(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    addSubject();
                  }
                }}
                placeholder="Add a subject..."
              />

              <button
                onClick={addSubject}
              >
                Add
              </button>

            </div>

            <div className="subject-list">

              {subjects.map((subject) => (
                <div
                  className="subject-chip"
                  key={subject}
                >
                  <span>
                    📘
                  </span>

                  {subject}
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <aside className="study-planner-right">

          {/* TIMER */}

          <div className="study-card focus-timer-card">

            <div className="timer-heading">

              <span>
                ⏱️ FOCUS TIMER
              </span>

              <small>
                {timerMode}
              </small>

            </div>

            <div className="timer-mode-buttons">

              <button
                className={
                  timerMode === "Focus"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeTimerMode("Focus")
                }
              >
                Focus 25m
              </button>

              <button
                className={
                  timerMode === "Break"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeTimerMode("Break")
                }
              >
                Break 5m
              </button>

            </div>

            <div className="timer-circle">

              <div>

                <strong>
                  {formatTime(secondsLeft)}
                </strong>

                <span>
                  {timerRunning
                    ? "STUDYING"
                    : "READY"}
                </span>

              </div>

            </div>

            <div className="timer-controls">

              <button
                className="timer-main-button"
                onClick={() =>
                  setTimerRunning(
                    (previous) =>
                      !previous
                  )
                }
              >
                {timerRunning
                  ? "Pause"
                  : "Start Focus"}
              </button>

              <button
                className="timer-reset-button"
                onClick={resetTimer}
              >
                Reset
              </button>

            </div>

            <div className="timer-session-info">

              <span>
                Today's focused time
              </span>

              <strong>
                {todaySessionMinutes} min
              </strong>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="study-card progress-card">

            <div className="timer-heading">
              <span>
                🎯 TODAY'S PROGRESS
              </span>
            </div>

            <div className="progress-circle">

              <strong>
                {progress}%
              </strong>

              <span>
                Complete
              </span>

            </div>

            <div className="progress-bar">

              <div
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p>
              {completedTasks} of{" "}
              {tasks.length} tasks completed.
            </p>

          </div>

          {/* TIPS */}

          <div className="study-card study-tip-card">

            <span>
              💡 STUDY TIP
            </span>

            <h3>
              Focus on one task at a time.
            </h3>

            <p>
              Use the focus timer to create
              distraction-free study sessions.
              Consistency matters more than
              studying for very long hours once.
            </p>

          </div>

        </aside>

      </div>

      <div className="study-planner-disclaimer">
        Your study data is stored locally in
        your browser. It is not a substitute for
        academic or professional advice.
      </div>

    </section>
  );
}

export default StudyPlanner;