
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary_range: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("jobs/create/", formData);
      alert("Job published successfully!");
      navigate("/manage-jobs");
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === "object"
          ? Object.entries(data)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ")
          : "Unable to publish job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/recruiter-dashboard" className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <Link to="/recruiter-dashboard" className="font-semibold text-slate-600 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold text-indigo-600">RECRUITER WORKSPACE</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Create a new job
          </h1>
          <p className="mt-3 text-slate-500">
            Share your opportunity and find the right candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-8 border-b border-slate-100 pb-5">
            <h2 className="text-xl font-bold text-slate-900">Job information</h2>
            <p className="mt-1 text-sm text-slate-500">Enter the details of the position.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Job title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Python Developer"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Company name *</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. ABC Technologies"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Location *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Coimbatore"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Salary range</label>
              <input
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g. ₹3 LPA - ₹5 LPA"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Job description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, skills and qualifications..."
              rows="7"
              required
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/recruiter-dashboard"
              className="rounded-xl border border-slate-200 px-7 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Job →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
