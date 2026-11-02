
import { useEffect, useState } from "react";
import api from "./api";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary_range: "",
    description: "",
  });

  async function loadJobs() {
    try {
      const response = await api.get("jobs/");
      setJobs(response.data);
    } catch {
      setMessage("Unable to load jobs.");
    }
  }

  async function loadApplications() {
    try {
      const response = await api.get("my-applications/");
      setApplications(response.data);
    } catch {
      setMessage("Please log in to view your applications.");
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function updateJobForm(event) {
    setJobForm({
      ...jobForm,
      [event.target.name]: event.target.value,
    });
  }

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");

    try {
      const endpoint =
        page === "register" ? "register/" : "login/";

      const payload =
        page === "register"
          ? form
          : {
              username: form.username,
              password: form.password,
            };

      const response = await api.post(endpoint, payload);

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setMessage(response.data.message);
      setPage("jobs");
      await loadJobs();
    } catch (error) {
      setMessage(
        JSON.stringify(
          error.response?.data || "Authentication failed"
        )
      );
    }
  }

  async function applyJob(jobId) {
    if (!token) {
      setPage("login");
      setMessage("Please log in before applying.");
      return;
    }

    try {
      const response = await api.post(
        `jobs/${jobId}/apply/`
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to apply."
      );
    }
  }

  async function postJob(event) {
    event.preventDefault();

    try {
      await api.post("jobs/", jobForm);
      setMessage("Job posted successfully!");
      setJobForm({
        title: "",
        company: "",
        location: "",
        salary_range: "",
        description: "",
      });
      setPage("jobs");
      await loadJobs();
    } catch (error) {
      setMessage(
        JSON.stringify(
          error.response?.data || "Unable to post job"
        )
      );
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setPage("jobs");
    setMessage("Logged out successfully.");
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 p-3 outline-blue-500";

  const buttonClass =
    "rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-blue-700 p-5 text-white shadow">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setPage("jobs")}
            className="text-2xl font-bold"
          >
            Job Portal
          </button>

          <nav className="flex flex-wrap gap-2">
            <button
              onClick={() => setPage("jobs")}
              className="rounded px-3 py-2 hover:bg-blue-600"
            >
              Jobs
            </button>

            {token && (
              <>
                <button
                  onClick={() => setPage("post")}
                  className="rounded px-3 py-2 hover:bg-blue-600"
                >
                  Post Job
                </button>
                <button
                  onClick={() => {
                    setPage("applications");
                    loadApplications();
                  }}
                  className="rounded px-3 py-2 hover:bg-blue-600"
                >
                  My Applications
                </button>
                <button
                  onClick={logout}
                  className="rounded bg-white px-3 py-2 text-blue-700"
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <button
                  onClick={() => setPage("login")}
                  className="rounded px-3 py-2 hover:bg-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => setPage("register")}
                  className="rounded bg-white px-3 py-2 text-blue-700"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-5 md:p-8">
        {message && (
          <div className="mb-5 rounded-lg bg-blue-50 p-4 text-blue-800">
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-3 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {(page === "login" || page === "register") && (
          <form
            onSubmit={handleAuth}
            className="mx-auto max-w-md space-y-4 rounded-xl bg-white p-7 shadow"
          >
            <h1 className="text-2xl font-bold">
              {page === "register"
                ? "Create Account"
                : "Welcome Back"}
            </h1>

            <input
              className={inputClass}
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={updateForm}
              required
            />

            {page === "register" && (
              <input
                className={inputClass}
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={updateForm}
                required
              />
            )}

            <input
              className={inputClass}
              name="password"
              type="password"
              placeholder="Password (minimum 8 characters)"
              value={form.password}
              onChange={updateForm}
              minLength={8}
              required
            />

            <button className={`${buttonClass} w-full`}>
              {page === "register" ? "Register" : "Login"}
            </button>

            <p className="text-sm">
              {page === "register"
                ? "Already have an account?"
                : "New to Job Portal?"}{" "}
              <button
                type="button"
                onClick={() =>
                  setPage(
                    page === "register" ? "login" : "register"
                  )
                }
                className="font-semibold text-blue-600"
              >
                {page === "register" ? "Login" : "Register"}
              </button>
            </p>
          </form>
        )}

        {page === "jobs" && (
          <>
            <section className="mb-8 rounded-2xl bg-blue-50 p-8 md:p-12">
              <h1 className="text-3xl font-bold md:text-4xl">
                Find Your Dream Job
              </h1>
              <p className="mt-3 text-slate-600">
                Explore opportunities and take the next step
                in your career.
              </p>
            </section>

            <h2 className="mb-5 text-2xl font-bold">
              Latest Jobs
            </h2>

            {jobs.length === 0 && (
              <p>No jobs available. Check back later.</p>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold">
                    {job.title}
                  </h3>
                  <p className="mt-2 font-medium text-blue-700">
                    {job.company}
                  </p>
                  <p className="mt-1 text-slate-600">
                    {job.location}
                  </p>

                  {job.salary_range && (
                    <p className="mt-2 font-semibold">
                      Salary: {job.salary_range}
                    </p>
                  )}

                  <p className="my-4 whitespace-pre-line text-slate-600">
                    {job.description}
                  </p>

                  <button
                    onClick={() => applyJob(job.id)}
                    className={buttonClass}
                  >
                    Apply Now
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {page === "post" && (
          <form
            onSubmit={postJob}
            className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white p-7 shadow"
          >
            <h1 className="text-2xl font-bold">Post a Job</h1>

            <input
              className={inputClass}
              name="title"
              placeholder="Job title"
              value={jobForm.title}
              onChange={updateJobForm}
              required
            />
            <input
              className={inputClass}
              name="company"
              placeholder="Company name"
              value={jobForm.company}
              onChange={updateJobForm}
              required
            />
            <input
              className={inputClass}
              name="location"
              placeholder="Job location"
              value={jobForm.location}
              onChange={updateJobForm}
              required
            />
            <input
              className={inputClass}
              name="salary_range"
              placeholder="Salary range (optional)"
              value={jobForm.salary_range}
              onChange={updateJobForm}
            />
            <textarea
              className={inputClass}
              name="description"
              placeholder="Job description"
              rows={5}
              value={jobForm.description}
              onChange={updateJobForm}
              required
            />

            <button className={buttonClass}>
              Publish Job
            </button>
          </form>
        )}

        {page === "applications" && (
          <section>
            <h1 className="mb-5 text-2xl font-bold">
              My Applications
            </h1>

            {applications.length === 0 && (
              <p>No applications found.</p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <h2 className="text-lg font-bold">
                    {application.job_title}
                  </h2>
                  <p>{application.company}</p>
                  <p className="mt-2">
                    Status:{" "}
                    <span className="font-semibold capitalize text-blue-700">
                      {application.status}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Applied:{" "}
                    {new Date(
                      application.application_date
                    ).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
