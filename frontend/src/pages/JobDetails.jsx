
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`jobs/${id}/`);
        setJob(response.data);
      } catch (err) {
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Job not found
        </h2>
        <p className="mt-3 text-slate-500">{error}</p>
        <Link to="/jobs" className="mt-6 font-bold text-indigo-600">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const isRecruiter = localStorage.getItem("role") === "recruiter";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to={isRecruiter ? "/recruiter-dashboard" : "/seeker-dashboard"}
            className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <Link
            to={isRecruiter ? "/manage-jobs" : "/jobs"}
            className="font-semibold text-slate-600 hover:text-indigo-600"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
            💼
          </div>

          <p className="mt-7 text-sm font-bold text-indigo-600">
            JOB OPPORTUNITY
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {job.title}
          </h1>

          <p className="mt-3 text-xl font-semibold text-indigo-600">
            {job.company}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              📍 {job.location}
            </span>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
              💰 {job.salary_range || "Salary not specified"}
            </span>
          </div>

          <div className="my-9 border-t border-slate-100" />

          <h2 className="text-xl font-bold text-slate-900">
            Job Description
          </h2>

          <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
            {job.description}
          </p>

          <div className="my-9 border-t border-slate-100" />

          <div className="flex flex-wrap gap-3">
            {isRecruiter ? (
              <Link
                to={`/jobs/${job.id}/edit`}
                className="rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Edit Job →
              </Link>
            ) : (
              <button
                disabled
                title="Job application page will be connected in the next step"
                className="cursor-not-allowed rounded-xl bg-indigo-300 px-7 py-3 font-bold text-white"
              >
                Apply Now (Coming Soon)
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
