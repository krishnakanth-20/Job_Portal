
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker"
  });

  const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await api.post("register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        });

        if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        }

        alert("Registration successful!");

        navigate("/login");

    } catch (error) {
        console.log(error.response?.data);

        alert(
        JSON.stringify(
            error.response?.data || "Registration failed"
        )
        );
    }
    };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 text-white flex-col justify-center px-16">

        <h1 className="text-5xl font-bold mb-6">
          Start Your Journey
        </h1>

        <p className="text-lg text-blue-100 leading-8">
          Create your account and explore thousands
          of job opportunities. Connect with companies
          and take the next step in your career.
        </p>

        <div className="mt-12">
          <h2 className="text-3xl font-bold">
            Your Career Starts Here!
          </h2>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 bg-gray-50">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-blue-700">
              JobPortal
            </h1>

            <h2 className="text-2xl font-semibold mt-5 text-gray-800">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Join us and find your dream job.
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
              placeholder="Enter username"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium text-gray-700 mb-2">
              Register As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-700 font-semibold ml-1"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;
