import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const defaultSubjects = [
  "Machine Learning",
  "Data Structures",
  "Database Management",
];

function StudyPlanner() {
  const [user, setUser] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");

  const [subjectName, setSubjectName] = useState("");

  const [filter, setFilter] = useState("All");

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("Focus");

  const [todaySessionMinutes, setTodaySessionMinutes] =
    useState(0);

  /*
   * LOAD USER + STUDY DATA
   */
  useEffect(() => {
    loadStudyData();
  }, []);

  const loadStudyData = async () => {
    setLoading(true);

    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);
        return;
      }

      if (!currentUser) {
        console.error("No authenticated user found.");
        return;
      }

      setUser(currentUser);

      /*
       * LOAD SUBJECTS
       */
      let { data: subjectData, error: subjectError } =
        await supabase
          .from("study_subjects")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: true,
          });

      if (subjectError) {
        console.error(
          "Subject loading error:",
          subjectError
        );
        return;
      }

      /*
       * CREATE DEFAULT SUBJECTS FOR NEW USERS
       */
      if (!subjectData || subjectData.length === 0) {
        const defaultRows = defaultSubjects.map(
          (name) => ({
            user_id: currentUser.id,
            name,
            color: null,
          })
        );

        const { data: createdSubjects, error } =
          await supabase
            .from("study_subjects")
            .insert(defaultRows)
            .select();

        if (error) {
          console.error(
            "Default subject creation error:",
            error
          );
        } else {
          subjectData = createdSubjects || [];
        }
      }

      setSubjects(subjectData || []);

      if (subjectData && subjectData.length > 0) {
        setTaskSubject(subjectData[0].name);
      }

      /*
       * LOAD TASKS
       */
      const { data: taskData, error: taskError } =
        await supabase
          .from("study_tasks")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: false,
          });

      if (taskError) {
        console.error(
          "Task loading error:",
          taskError
        );
      } else {
        const formattedTasks = (taskData || []).map(
          (task) => {
            const subject = (subjectData || []).find(
              (item) =>
                item.id === task.subject_id
            );

            return {
              id: task.id,
              title: task.title,
              subject:
                subject?.name || "General",
              subjectId: task.subject_id,
              dueDate: task.due_date || "",
              priority:
                task.priority
                  ? task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)
                  : "Medium",
              completed: task.completed,
              createdAt: task.created_at,
              completedDate: task.completed
                ? task.updated_at
                : null,
            };
          }
        );

        setTasks(formattedTasks);
      }

      /*
       * LOAD STUDY SESSIONS
       */
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", {
          ascending: false,
        });

      if (sessionError) {
        console.error(
          "Session loading error:",
          sessionError
        );
      } else {
        const formattedSessions = (
          sessionData || []
        ).map((session) => ({
          id: session.id,
          minutes: session.duration_minutes || 0,
          date:
            session.completed_at ||
            session.created_at,
        }));

        setSessions(formattedSessions);
      }
    } catch (error) {
      console.error(
        "Study planner loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * TIMER
   */
  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          setTimerRunning(false);

          if (timerMode === "Focus") {
            saveFocusSession();
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

  /*
   * TODAY'S SESSION TIME
   */
  useEffect(() => {
    const today = new Date().toDateString();

    const minutes = sessions
      .filter(
        (session) =>
          new Date(session.date).toDateString() ===
          today
      )
      .reduce(
        (total, session) =>
          total + Number(session.minutes || 0),
        0
      );

    setTodaySessionMinutes(minutes);
  }, [sessions]);

  /*
   * SAVE COMPLETED FOCUS SESSION
   */
  const saveFocusSession = async () => {
    if (!user) return;

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        subject_id: null,
        task_id: null,
        duration_minutes: 25,
        started_at: new Date(
          Date.now() - 25 * 60 * 1000
        ).toISOString(),
        completed_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Focus session save error:",
        error
      );
      return;
    }

    const newSession = {
      id: data.id,
      minutes: data.duration_minutes,
      date: data.completed_at || data.created_at,
    };

    setSessions((previous) => [
      newSession,
      ...previous,
    ]);
  };

  /*
   * ADD SUBJECT
   */
  const addSubject = async () => {
    const cleanName = subjectName.trim();

    if (!cleanName || !user) return;

    const exists = subjects.some(
      (subject) =>
        subject.name.toLowerCase() ===
        cleanName.toLowerCase()
    );

    if (exists) {
      setSubjectName("");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("study_subjects")
      .insert({
        user_id: user.id,
        name: cleanName,
        color: null,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error(
        "Subject creation error:",
        error
      );
      alert(
        "Unable to add subject. Please try again."
      );
      return;
    }

    setSubjects((previous) => [
      ...previous,
      data,
    ]);

    setTaskSubject(cleanName);
    setSubjectName("");
  };

  /*
   * ADD TASK
   */
  const addTask = async (event) => {
    event.preventDefault();

    if (!taskTitle.trim() || !user) return;

    const selectedSubject = subjects.find(
      (subject) =>
        subject.name === taskSubject
    );

    setSaving(true);

    const { data, error } = await supabase
      .from("study_tasks")
      .insert({
        user_id: user.id,
        subject_id:
          selectedSubject?.id || null,
        title: taskTitle.trim(),
        description: null,
        due_date: taskDate || null,
        priority:
          taskPriority.toLowerCase(),
        completed: false,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error(
        "Task creation error:",
        error
      );
      alert(
        "Unable to add task. Please try again."
      );
      return;
    }

    const newTask = {
      id: data.id,
      title: data.title,
      subject:
        selectedSubject?.name || "General",
      subjectId: data.subject_id,
      dueDate: data.due_date || "",
      priority:
        data.priority.charAt(0).toUpperCase() +
        data.priority.slice(1),
      completed: data.completed,
      createdAt: data.created_at,
      completedDate: null,
    };

    setTasks((previous) => [
      newTask,
      ...previous,
    ]);

    setTaskTitle("");
    setTaskDate("");
    setTaskPriority("Medium");
  };

  /*
   * COMPLETE / UNCOMPLETE TASK
   */
  const toggleTask = async (id) => {
    const currentTask = tasks.find(
      (task) => task.id === id
    );

    if (!currentTask) return;

    const newCompleted =
      !currentTask.completed;

    const { error } = await supabase
      .from("study_tasks")
      .update({
        completed: newCompleted,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Task update error:",
        error
      );
      alert(
        "Unable to update task."
      );
      return;
    }

    setTasks((previous) =>
      previous.map((task) => {
        if (task.id !== id) return task;

        return {
          ...task,
          completed: newCompleted,
          completedDate: newCompleted
            ? new Date().toISOString()
            : null,
        };
      })
    );
  };

  /*
   * DELETE TASK
   */
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("study_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Task deletion error:",
        error
      );
      alert(
        "Unable to delete task."
      );
      return;
    }

    setTasks((previous) =>
      previous.filter(
        (task) => task.id !== id
      )
    );
  };

  /*
   * TIMER RESET
   */
  const resetTimer = () => {
    setTimerRunning(false);

    setSecondsLeft(
      timerMode === "Focus"
        ? 25 * 60
        : 5 * 60
    );
  };

  /*
   * CHANGE TIMER MODE
   */
  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setTimerRunning(false);

    setSecondsLeft(
      mode === "Focus"
        ? 25 * 60
        : 5 * 60
    );
  };

  /*
   * FORMAT TIMER
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /*
   * FILTER TASKS
   */
  const filteredTasks = useMemo(() => {
    if (filter === "Completed") {
      return tasks.filter(
        (task) => task.completed
      );
    }

    if (filter === "Pending") {
      return tasks.filter(
        (task) => !task.completed
      );
    }

    if (filter === "High") {
      return tasks.filter(
        (task) =>
          task.priority === "High"
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
          (completedTasks /
            tasks.length) *
            100
        );

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayTasks = tasks.filter(
    (task) => task.dueDate === today
  ).length;

  /*
   * LOADING SCREEN
   */
  if (loading) {
    return (
      <section className="study-planner-page">
        <div
          className="study-card"
          style={{
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>
            📚
          </div>

          <h2>
            Loading your Study Planner...
          </h2>

          <p>
            Syncing your tasks and subjects
            with CareerPilot AI.
          </p>
        </div>
      </section>
    );
  }

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
            Organize your study tasks, track
            progress and build consistent
            learning habits.
          </p>
        </div>

        <div className="study-planner-status">
          <span></span>
          Cloud Synced
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
            <strong>
              {tasks.length}
            </strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            ⏳
          </span>

          <div>
            <small>Pending</small>
            <strong>
              {pendingTasks}
            </strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            ✓
          </span>

          <div>
            <small>Completed</small>
            <strong>
              {completedTasks}
            </strong>
          </div>
        </div>

        <div className="study-stat-card">
          <span className="study-stat-icon">
            🎯
          </span>

          <div>
            <small>Progress</small>
            <strong>
              {progress}%
            </strong>
          </div>
        </div>

      </div>

      <div className="study-planner-main">

        {/* LEFT */}

        <div className="study-planner-left">

          {/* ADD TASK */}

          <div className="study-card add-task-card">

            <div className="study-card-heading">

              <div>
                <span>01</span>
                <h2>
                  Add Study Task
                </h2>
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
                    {subjects.map(
                      (subject) => (
                        <option
                          key={subject.id}
                          value={
                            subject.name
                          }
                        >
                          {subject.name}
                        </option>
                      )
                    )}
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
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "+ Add Task"}
              </button>

            </form>

          </div>

          {/* TASK LIST */}

          <div className="study-card task-list-card">

            <div className="study-card-heading">

              <div>
                <span>02</span>
                <h2>
                  My Tasks
                </h2>
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
                  Add a study task above
                  and start building
                  your learning plan.
                </p>

              </div>
            ) : (
              <div className="study-task-list">

                {filteredTasks.map(
                  (task) => (
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
                          toggleTask(
                            task.id
                          )
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
                          deleteTask(
                            task.id
                          )
                        }
                        title="Delete task"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* SUBJECTS */}

          <div className="study-card subjects-card">

            <div className="study-card-heading">

              <div>
                <span>03</span>
                <h2>
                  My Subjects
                </h2>
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
                  if (
                    event.key === "Enter"
                  ) {
                    event.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Add a subject..."
              />

              <button
                onClick={addSubject}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Add"}
              </button>

            </div>

            <div className="subject-list">

              {subjects.map(
                (subject) => (
                  <div
                    className="subject-chip"
                    key={subject.id}
                  >
                    <span>
                      📘
                    </span>

                    {subject.name}
                  </div>
                )
              )}

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
                  changeTimerMode(
                    "Focus"
                  )
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
                  changeTimerMode(
                    "Break"
                  )
                }
              >
                Break 5m
              </button>

            </div>

            <div className="timer-circle">

              <div>

                <strong>
                  {formatTime(
                    secondsLeft
                  )}
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
              {tasks.length} tasks
              completed.
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
              distraction-free study
              sessions. Consistency matters
              more than studying for very
              long hours once.
            </p>

          </div>

        </aside>

      </div>

      <div className="study-planner-disclaimer">
        Your study data is securely synced
        to your CareerPilot account.
      </div>

    </section>
  );
}

export default StudyPlanner;