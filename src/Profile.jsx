import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const roles = [
  "AI/ML Engineer",
  "Software Developer",
  "Data Analyst",
  "Data Scientist",
  "Frontend Developer",
  "Web Developer",
  "UI/UX Designer",
];

const branches = [
  "CSE",
  "CSE (AI/ML)",
  "AIML",
  "AI & Data Science",
  "ECE",
  "EEE",
  "IT",
  "Mechanical",
  "Civil",
  "Other",
];

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduate",
];

const recommendedSkills = [
  "Python",
  "Java",
  "JavaScript",
  "React",
  "SQL",
  "Git",
  "Machine Learning",
  "Deep Learning",
  "Pandas",
  "NumPy",
  "OpenCV",
  "HTML",
  "CSS",
  "Figma",
  "Power BI",
];

function Profile({ user }) {
  const [profile, setProfile] = useState({
    full_name: "",
    branch: "",
    year: "",
    cgpa: "",
    target_role: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    loadProfile();
  }, [user]);

  async function loadProfile() {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select(
        "id, full_name, branch, year, cgpa, target_role, skills, readiness_score"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setProfile({
      full_name:
        data?.full_name ||
        user.user_metadata?.full_name ||
        "",
      branch: data?.branch || "",
      year: data?.year || "",
      cgpa: data?.cgpa ?? "",
      target_role: data?.target_role || "",
      skills: data?.skills || "",
    });

    setLoading(false);
  }

  const skillList = useMemo(() => {
    return profile.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [profile.skills]);

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.full_name,
      profile.branch,
      profile.year,
      profile.cgpa,
      profile.target_role,
      profile.skills,
    ];

    const completed = fields.filter(
      (field) => String(field).trim() !== ""
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const initials = useMemo(() => {
    const name = profile.full_name.trim();

    if (!name) {
      return "CP";
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [profile.full_name]);

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  };

  const addSkill = (skill) => {
    const cleanSkill = skill.trim();

    if (!cleanSkill) return;

    const exists = skillList.some(
      (item) => item.toLowerCase() === cleanSkill.toLowerCase()
    );

    if (exists) {
      setNewSkill("");
      return;
    }

    const updatedSkills = [...skillList, cleanSkill];

    updateField("skills", updatedSkills.join(", "));
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skillList.filter(
      (skill) => skill !== skillToRemove
    );

    updateField("skills", updatedSkills.join(", "));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill(newSkill);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setError("You must be logged in to update your profile.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const cgpaValue =
      profile.cgpa === "" ? null : Number(profile.cgpa);

    if (
      cgpaValue !== null &&
      (Number.isNaN(cgpaValue) ||
        cgpaValue < 0 ||
        cgpaValue > 10)
    ) {
      setError("CGPA must be between 0 and 10.");
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: profile.full_name.trim(),
          branch: profile.branch,
          year: profile.year,
          cgpa: cgpaValue,
          target_role: profile.target_role,
          skills: profile.skills.trim(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-avatar">
            {initials}
          </div>

          <div>
            <span className="profile-kicker">
              CAREERPILOT ACCOUNT
            </span>

            <h1>
              {profile.full_name || "Complete your profile"}
            </h1>

            <p>{user?.email}</p>
          </div>
        </div>

        <div className="profile-completion">
          <div className="profile-completion-top">
            <span>Profile completion</span>
            <strong>{profileCompletion}%</strong>
          </div>

          <div className="profile-completion-track">
            <div
              className="profile-completion-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            />
          </div>
        </div>
      </section>

      {message && (
        <div className="profile-message success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="profile-message error">
          ⚠ {error}
        </div>
      )}

      <div className="profile-layout">
        <main className="profile-main-card">
          <div className="profile-section-heading">
            <div>
              <h2>Personal & Career Information</h2>
              <p>
                Keep your information updated so CareerPilot
                can personalize your career recommendations.
              </p>
            </div>

            <span>01</span>
          </div>

          <form onSubmit={saveProfile}>
            <div className="profile-form-grid">
              <div className="profile-field profile-field-full">
                <label>Full Name</label>

                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    updateField(
                      "full_name",
                      e.target.value
                    )
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="profile-field">
                <label>Branch</label>

                <select
                  value={profile.branch}
                  onChange={(e) =>
                    updateField(
                      "branch",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select your branch
                  </option>

                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="profile-field">
                <label>Year</label>

                <select
                  value={profile.year}
                  onChange={(e) =>
                    updateField("year", e.target.value)
                  }
                >
                  <option value="">
                    Select your year
                  </option>

                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="profile-field">
                <label>CGPA</label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={profile.cgpa}
                  onChange={(e) =>
                    updateField(
                      "cgpa",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 8.2"
                />

                <small>Enter CGPA on a 10-point scale.</small>
              </div>

              <div className="profile-field">
                <label>Target Career Role</label>

                <select
                  value={profile.target_role}
                  onChange={(e) =>
                    updateField(
                      "target_role",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select target role
                  </option>

                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="profile-skills-section">
              <div className="profile-section-heading small">
                <div>
                  <h2>Skills</h2>
                  <p>
                    Add the technologies and skills you
                    currently know.
                  </p>
                </div>

                <span>02</span>
              </div>

              <div className="profile-skill-input">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(e.target.value)
                  }
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                />

                <button
                  type="button"
                  onClick={() => addSkill(newSkill)}
                >
                  + Add
                </button>
              </div>

              {skillList.length > 0 && (
                <div className="profile-skill-tags">
                  {skillList.map((skill) => (
                    <span key={skill}>
                      {skill}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(skill)
                        }
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="recommended-skills">
                <span>Quick add:</span>

                {recommendedSkills
                  .filter(
                    (skill) =>
                      !skillList.some(
                        (item) =>
                          item.toLowerCase() ===
                          skill.toLowerCase()
                      )
                  )
                  .slice(0, 8)
                  .map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </div>
          </form>
        </main>

        <aside className="profile-sidebar">
          <div className="profile-summary-card">
            <div className="profile-summary-icon">
              🎯
            </div>

            <h2>Career Profile</h2>

            <div className="profile-summary-row">
              <span>Target role</span>
              <strong>
                {profile.target_role || "Not set"}
              </strong>
            </div>

            <div className="profile-summary-row">
              <span>Branch</span>
              <strong>
                {profile.branch || "Not set"}
              </strong>
            </div>

            <div className="profile-summary-row">
              <span>Year</span>
              <strong>
                {profile.year || "Not set"}
              </strong>
            </div>

            <div className="profile-summary-row">
              <span>CGPA</span>
              <strong>
                {profile.cgpa || "Not set"}
              </strong>
            </div>

            <div className="profile-summary-row">
              <span>Skills</span>
              <strong>{skillList.length}</strong>
            </div>
          </div>

          <div className="profile-tip-card">
            <div>💡</div>

            <h3>Why keep this updated?</h3>

            <p>
              CareerPilot uses your profile to personalize
              career analysis, skill gaps, project ideas,
              interview practice and future roadmap
              recommendations.
            </p>
          </div>

          <div className="profile-account-card">
            <span>ACCOUNT</span>

            <p>{user?.email}</p>

            <button
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;