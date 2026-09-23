import { useMemo, useState } from "react";

const JOBS_KEY = "careerPilotJobs";

const defaultJobs = [
  {
    id: 1,
    title: "AI/ML Intern",
    company: "TechNova Labs",
    location: "Remote",
    type: "Internship",
    mode: "Remote",
    skills: ["Python", "Machine Learning", "SQL"],
    stipend: "₹15,000 - ₹25,000/month",
    posted: "2 days ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "InnovateSoft",
    location: "Bengaluru",
    type: "Internship",
    mode: "Hybrid",
    skills: ["React", "JavaScript", "Git"],
    stipend: "₹12,000 - ₹20,000/month",
    posted: "3 days ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "DataBridge",
    location: "Hyderabad",
    type: "Internship",
    mode: "On-site",
    skills: ["Python", "SQL", "Excel"],
    stipend: "₹15,000 - ₹22,000/month",
    posted: "4 days ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 4,
    title: "Junior Software Developer",
    company: "CodeSphere",
    location: "Pune",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["JavaScript", "React", "SQL", "Git"],
    stipend: "₹4 - ₹7 LPA",
    posted: "5 days ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 5,
    title: "Computer Vision Intern",
    company: "VisionAI",
    location: "Remote",
    type: "Internship",
    mode: "Remote",
    skills: ["Python", "OpenCV", "YOLO"],
    stipend: "₹18,000 - ₹30,000/month",
    posted: "1 week ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 6,
    title: "Data Science Intern",
    company: "AnalyticsHub",
    location: "Chennai",
    type: "Internship",
    mode: "Hybrid",
    skills: ["Python", "Pandas", "Machine Learning"],
    stipend: "₹15,000 - ₹25,000/month",
    posted: "1 week ago",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
];

function loadJobs() {
  try {
    const saved = localStorage.getItem(JOBS_KEY);

    return saved
      ? JSON.parse(saved)
      : defaultJobs.map((job) => ({
          ...job,
          saved: false,
          status: "Not Applied",
        }));
  } catch {
    return defaultJobs.map((job) => ({
      ...job,
      saved: false,
      status: "Not Applied",
    }));
  }
}

function Jobs() {
  const [jobs, setJobs] = useState(loadJobs);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showSavedOnly, setShowSavedOnly] =
    useState(false);

  const [selectedJob, setSelectedJob] =
    useState(null);

  const saveJobs = (updatedJobs) => {
    setJobs(updatedJobs);

    localStorage.setItem(
      JOBS_KEY,
      JSON.stringify(updatedJobs)
    );
  };

  const toggleSaved = (id) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? {
            ...job,
            saved: !job.saved,
          }
        : job
    );

    saveJobs(updatedJobs);
  };

  const updateStatus = (id, status) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? {
            ...job,
            status,
          }
        : job
    );

    saveJobs(updatedJobs);
  };

  const locations = useMemo(() => {
    return [
      "All",
      ...new Set(
        jobs.map((job) => job.location)
      ),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesType =
        typeFilter === "All" ||
        job.type === typeFilter;

      const matchesLocation =
        locationFilter === "All" ||
        job.location === locationFilter;

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      const matchesSaved =
        !showSavedOnly || job.saved;

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesStatus &&
        matchesSaved
      );
    });
  }, [
    jobs,
    search,
    typeFilter,
    locationFilter,
    statusFilter,
    showSavedOnly,
  ]);

  const savedCount = jobs.filter(
    (job) => job.saved
  ).length;

  const appliedCount = jobs.filter(
    (job) =>
      job.status !== "Not Applied"
  ).length;

  const interviewCount = jobs.filter(
    (job) =>
      job.status === "Interview"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setLocationFilter("All");
    setStatusFilter("All");
    setShowSavedOnly(false);
  };

  return (
    <section className="jobs-page">

      {/* HEADER */}

      <div className="jobs-header">

        <div>
          <span className="jobs-label">
            💼 CAREERPILOT AI
          </span>

          <h1>
            Jobs & Internships
          </h1>

          <p>
            Discover opportunities that match
            your skills and track your applications
            in one place.
          </p>
        </div>

        <div className="jobs-header-badge">
          <span></span>
          Opportunity Hub
        </div>

      </div>

      {/* STATS */}

      <div className="jobs-stats">

        <div className="job-stat">
          <div className="job-stat-icon">
            🔎
          </div>

          <div>
            <small>
              Opportunities
            </small>

            <strong>
              {jobs.length}
            </strong>
          </div>
        </div>

        <div className="job-stat">
          <div className="job-stat-icon">
            ⭐
          </div>

          <div>
            <small>
              Saved
            </small>

            <strong>
              {savedCount}
            </strong>
          </div>
        </div>

        <div className="job-stat">
          <div className="job-stat-icon">
            📤
          </div>

          <div>
            <small>
              Applied
            </small>

            <strong>
              {appliedCount}
            </strong>
          </div>
        </div>

        <div className="job-stat">
          <div className="job-stat-icon">
            🎤
          </div>

          <div>
            <small>
              Interviews
            </small>

            <strong>
              {interviewCount}
            </strong>
          </div>
        </div>

      </div>

      {/* SEARCH */}

      <div className="jobs-search-card">

        <div className="jobs-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search jobs, companies or skills..."
          />

        </div>

        <div className="jobs-filters">

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >
            <option value="All">
              All Types
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Full-time">
              Full-time
            </option>
          </select>

          <select
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(event.target.value)
            }
          >
            {locations.map((location) => (
              <option
                key={location}
                value={location}
              >
                {location === "All"
                  ? "All Locations"
                  : location}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Not Applied">
              Not Applied
            </option>

            <option value="Applied">
              Applied
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          <button
            className={
              showSavedOnly
                ? "saved-filter active"
                : "saved-filter"
            }
            onClick={() =>
              setShowSavedOnly(
                (previous) => !previous
              )
            }
          >
            ⭐ Saved
          </button>

        </div>

      </div>

      {/* RESULT BAR */}

      <div className="jobs-result-bar">

        <div>
          <strong>
            {filteredJobs.length}
          </strong>{" "}
          opportunities found
        </div>

        <button onClick={clearFilters}>
          Clear filters
        </button>

      </div>

      {/* JOB LIST */}

      {filteredJobs.length === 0 ? (
        <div className="jobs-empty">

          <div className="jobs-empty-icon">
            🔍
          </div>

          <h2>
            No opportunities found
          </h2>

          <p>
            Try changing your search or filters.
          </p>

          <button onClick={clearFilters}>
            Reset Filters
          </button>

        </div>
      ) : (
        <div className="jobs-grid">

          {filteredJobs.map((job) => (
            <article
              className="job-card"
              key={job.id}
            >

              <div className="job-card-top">

                <div className="company-logo">
                  {job.company
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <button
                  className={
                    job.saved
                      ? "job-save saved"
                      : "job-save"
                  }
                  onClick={() =>
                    toggleSaved(job.id)
                  }
                  title="Save job"
                >
                  {job.saved
                    ? "★"
                    : "☆"}
                </button>

              </div>

              <div className="job-type-row">

                <span
                  className={
                    job.type === "Internship"
                      ? "job-type internship"
                      : "job-type fulltime"
                  }
                >
                  {job.type}
                </span>

                <span className="job-posted">
                  {job.posted}
                </span>

              </div>

              <h2>
                {job.title}
              </h2>

              <p className="job-company">
                {job.company}
              </p>

              <div className="job-details">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  💻 {job.mode}
                </span>

              </div>

              <div className="job-skills">

                {job.skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>

              <div className="job-bottom">

                <div className="job-pay">
                  {job.stipend}
                </div>

                <span
                  className={`application-status ${job.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {job.status}
                </span>

              </div>

              <div className="job-actions">

                <button
                  className="job-view-button"
                  onClick={() =>
                    setSelectedJob(job)
                  }
                >
                  View Details
                </button>

                <a
                  className="job-apply-button"
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    updateStatus(
                      job.id,
                      "Applied"
                    )
                  }
                >
                  Apply →
                </a>

              </div>

            </article>
          ))}

        </div>
      )}

      {/* APPLICATION TRACKER */}

      <div className="application-tracker">

        <div className="tracker-heading">

          <div>
            <span>
              📊 APPLICATION TRACKER
            </span>

            <h2>
              Keep track of your applications
            </h2>
          </div>

          <small>
            {appliedCount} tracked
          </small>

        </div>

        {jobs.filter(
          (job) =>
            job.status !== "Not Applied"
        ).length === 0 ? (
          <div className="tracker-empty">
            Apply to an opportunity and it will
            appear here.
          </div>
        ) : (
          <div className="application-list">

            {jobs
              .filter(
                (job) =>
                  job.status !== "Not Applied"
              )
              .map((job) => (
                <div
                  className="application-row"
                  key={job.id}
                >

                  <div className="application-company">
                    <div>
                      {job.company
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span>
                      <strong>
                        {job.title}
                      </strong>

                      <small>
                        {job.company}
                      </small>
                    </span>
                  </div>

                  <select
                    value={job.status}
                    onChange={(event) =>
                      updateStatus(
                        job.id,
                        event.target.value
                      )
                    }
                  >
                    <option>
                      Applied
                    </option>

                    <option>
                      Interview
                    </option>

                    <option>
                      Rejected
                    </option>
                  </select>

                </div>
              ))}

          </div>
        )}

      </div>

      <div className="jobs-disclaimer">
        CareerPilot opportunity listings are
        demo data for the current prototype.
        Always verify the employer, role,
        eligibility and application page before
        applying.
      </div>

      {/* DETAILS MODAL */}

      {selectedJob && (
        <div
          className="job-modal-overlay"
          onClick={() =>
            setSelectedJob(null)
          }
        >

          <div
            className="job-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="job-modal-close"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              ×
            </button>

            <div className="job-modal-logo">
              {selectedJob.company
                .charAt(0)
                .toUpperCase()}
            </div>

            <span className="job-type internship">
              {selectedJob.type}
            </span>

            <h2>
              {selectedJob.title}
            </h2>

            <p className="job-company">
              {selectedJob.company}
            </p>

            <div className="modal-job-info">

              <span>
                📍 {selectedJob.location}
              </span>

              <span>
                💻 {selectedJob.mode}
              </span>

              <span>
                💰 {selectedJob.stipend}
              </span>

            </div>

            <h3>
              Required Skills
            </h3>

            <div className="job-skills modal-skills">
              {selectedJob.skills.map(
                (skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                )
              )}
            </div>

            <p className="modal-note">
              Review the opportunity details
              carefully before applying. Your
              application status can be updated
              from the Application Tracker.
            </p>

            <div className="modal-actions">

              <button
                onClick={() =>
                  toggleSaved(
                    selectedJob.id
                  )
                }
              >
                {selectedJob.saved
                  ? "★ Saved"
                  : "☆ Save Job"}
              </button>

              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  updateStatus(
                    selectedJob.id,
                    "Applied"
                  );
                  setSelectedJob(null);
                }}
              >
                Apply Now →
              </a>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default Jobs;