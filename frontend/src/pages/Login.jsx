
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("login/", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      navigate(
        response.data.role === "recruiter"
          ? "/recruiter-dashboard"
          : "/seeker-dashboard"
      );
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">

      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-indigo-950 via-indigo-800 to-violet-700 p-14 text-white">
        <h1 className="text-3xl font-extrabold tracking-tight">
          ✦ CareerConnect
        </h1>

        <div className="max-w-lg">
          <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
            Your career starts here
          </span>

          <h2 className="text-5xl font-extrabold leading-tight mt-8">
            Find the job that moves you forward.
          </h2>

          <p className="text-indigo-100 mt-6 text-lg leading-8">
            Discover exciting opportunities, connect with employers
            and build the future you deserve.
          </p>
        </div>

        <p className="text-indigo-200 text-sm">
          © 2026 CareerConnect. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden text-2xl font-extrabold text-indigo-700 mb-10">
            ✦ CareerConnect
          </div>

          <p className="text-indigo-600 font-semibold text-sm">
            WELCOME BACK
          </p>

          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">
            Sign in
          </h2>

          <p className="text-slate-500 mt-3 mb-9">
            Enter your details to access your account.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>

          <p className="text-center text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
