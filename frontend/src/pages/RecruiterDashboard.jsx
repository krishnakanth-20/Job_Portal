
import { Link, useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Recruiter";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cards = [
    { title: "Post a Job", description: "Create and publish a new job opening.", link: "/create-job", icon: "➕" },
    { title: "Manage Jobs", description: "View and manage your job listings.", link: "/manage-jobs", icon: "💼" },
    { title: "Applications", description: "Review candidates who applied.", link: "/applications", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/recruiter-dashboard" className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <button onClick={logout} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100">
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="rounded-3xl bg-linear-to-r from-violet-800 to-indigo-600 p-8 text-white sm:p-12">
          <p className="text-sm font-semibold text-violet-100">RECRUITER DASHBOARD</p>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Welcome, {username}!
          </h1>
          <p className="mt-4 max-w-xl text-violet-100">
            Find talented candidates, publish job openings and manage applications.
          </p>
          <Link to="/create-job" className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 hover:bg-indigo-50">
            Post a Job →
          </Link>
        </div>

        <h2 className="mb-6 mt-12 text-2xl font-extrabold text-slate-900">
          Recruiter workspace
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.title} to={card.link} className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl">
              <div className="text-4xl">{card.icon}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
              <p className="mt-6 font-bold text-indigo-600">Open page →</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
