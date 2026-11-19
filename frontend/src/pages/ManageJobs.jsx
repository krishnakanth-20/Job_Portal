
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("jobs/");
      setJobs(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`jobs/${id}/delete/`);
      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== id)
      );
      alert("Job deleted successfully.");
    } catch (err) {
      alert(
        err.response?.data?.error || "Unable to delete this job."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/recruiter-dashboard" className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <Link to="/recruiter-dashboard" className="font-semibold text-slate-600 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-indigo-600">RECRUITER WORKSPACE</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              Manage Jobs
            </h1>
            <p className="mt-2 text-slate-500">
              Manage your published job opportunities.
            </p>
          </div>

          <Link
            to="/create-job"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-center font-bold text-white hover:bg-indigo-700"
          >
            + Post New Job
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">Total jobs listed</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              {jobs.length}
            </h2>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Your job listings
            </h2>
            <button
              onClick={fetchJobs}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-16 text-center text-slate-500">Loading jobs...</p>
          ) : error ? (
            <p className="rounded-xl bg-red-50 p-5 text-center text-red-600">
              {error}
            </p>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
              <div className="text-5xl">💼</div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No jobs posted yet
              </h3>
              <p className="mt-2 text-slate-500">
                Start by publishing your first job opportunity.
              </p>
              <Link
                to="/create-job"
                className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Create Job →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="mt-1 font-medium text-indigo-600">
                      {job.company}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary_range || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      to={`/jobs/${job.id}/edit`}
                      className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
