
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("jobs/");
      setJobs(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      job.location?.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/seeker-dashboard" className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <Link to="/seeker-dashboard" className="font-semibold text-slate-600 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="bg-linear-to-r from-indigo-800 to-violet-600 px-6 py-16 text-center text-white">
        <p className="font-semibold text-indigo-200">FIND YOUR NEXT OPPORTUNITY</p>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          Find a job you love.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-indigo-100">
          Discover opportunities and take the next step in your career.
        </p>

        <div className="mx-auto mt-9 grid max-w-3xl gap-3 rounded-2xl bg-white p-3 shadow-xl sm:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Job title or company"
            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-indigo-500"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-indigo-500"
          />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Latest Opportunities
            </h2>
            <p className="mt-2 text-slate-500">
              {filteredJobs.length} jobs found
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading jobs...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">💼</div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {jobs.length === 0 ? "No jobs available yet" : "No matching jobs"}
            </h3>
            <p className="mt-2 text-slate-500">
              {jobs.length === 0
                ? "New opportunities will appear here when recruiters post jobs."
                : "Try changing your search or location."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                    💼
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {job.title}
                </h3>
                <p className="mt-2 font-medium text-indigo-600">
                  {job.company}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary_range || "Not specified"}</p>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                  {job.description}
                </p>

                <Link
                  to={`/jobs/${job.id}`}
                  className="mt-6 block rounded-xl bg-indigo-600 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
