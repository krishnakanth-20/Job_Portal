
import { Link, useNavigate } from "react-router-dom";

export default function SeekerDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Job Seeker";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cards = [
    { title: "Browse Jobs", description: "Explore available job opportunities.", link: "/jobs", icon: "💼" },
    { title: "My Applications", description: "Track your submitted applications.", link: "/my-applications", icon: "📄" },
    { title: "My Profile", description: "Manage your account information.", link: "/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/seeker-dashboard" className="text-2xl font-extrabold text-indigo-700">
            ✦ CareerConnect
          </Link>
          <button onClick={logout} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100">
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="rounded-3xl bg-linear-to-br from-indigo-700 to-violet-600 p-8 text-white sm:p-12">
          <p className="text-sm font-semibold text-indigo-100">SEEKER DASHBOARD</p>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Welcome back, {username}!
          </h1>
          <p className="mt-4 max-w-xl text-indigo-100">
            Discover opportunities, apply for jobs and take the next step in your career.
          </p>
          <Link to="/jobs" className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 hover:bg-indigo-50">
            Explore Jobs →
          </Link>
        </div>

        <h2 className="mb-6 mt-12 text-2xl font-extrabold text-slate-900">
          Your workspace
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
