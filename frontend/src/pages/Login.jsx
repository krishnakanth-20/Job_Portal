
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 text-white flex-col justify-center px-16">
        <h1 className="text-5xl font-bold mb-6">
          Find Your Dream Job
        </h1>

        <p className="text-lg text-blue-100 leading-8">
          Discover thousands of job opportunities.
          Connect with top companies and build your
          successful career with us.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-3xl font-bold">10K+</h2>
            <p className="text-blue-200">Active Jobs</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">5K+</h2>
            <p className="text-blue-200">Companies</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-gray-50">

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700">
              JobPortal
            </h1>

            <h2 className="text-2xl font-semibold mt-6 text-gray-800">
              Welcome Back!
            </h2>

            <p className="text-gray-500 mt-2">
              Login to continue your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <label className="block font-medium text-gray-700 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Login
            </button>

          </form>

          <p className="text-center text-gray-600 mt-7">
            Don't have an account?
            <Link
              to="/register"
              className="text-blue-700 font-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
