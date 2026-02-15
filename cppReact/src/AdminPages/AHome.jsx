import { useNavigate } from "react-router-dom";
import { ShieldAlert, History, Building2, KeyRound, LayoutDashboard, HandCoins ,Users} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";

export default function AHome() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { user } = useStateContext();
  const isPostedRef = useRef(false);
  // Fetch dashboard data
  useEffect(() => {
    if (!user?.email) return;

    axiosClient
      .post("/adman-home-data", { email: user.email })
      .then(res => {
        setData(res.data);
        console.log(res);
      })
      .catch(err => console.error("Dashboard data error", err));
  }, [user]);

  useEffect(() => {
    if (isPostedRef.current) return;
    isPostedRef.current = true;
    axiosClient.post("/check-loan-time").catch(console.error);
    axiosClient.post("/check-fixed-time").catch(console.error);
  }, []);


  const menuItems = [
    {
      title: "User Accounts",
      path: "/admin/all-users-data",
      icon: <Users size={32} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "View and manage user accounts"
    }
    ,{
      title: "Holded Accounts",
      path: "/admin/holded-accounts",
      icon: <ShieldAlert size={32} />,
      color: "text-red-600",
      bg: "bg-red-50",
      description: "Manage suspended and frozen user accounts"
    },
    {
      title: "All Transactions",
      path: "/admin/all-transactions",
      icon: <History size={32} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "View and audit all system financial transactions"
    },
    {
      title: "Branches Management",
      path: "/admin/branches",
      icon: <Building2 size={32} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Add, edit, or remove bank branches"
    },
    {
      title: "Password Requests",
      path: "/admin/password-change-requests",
      icon: <KeyRound size={32} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Review pending password reset requests"
    },
    {
      title: "Handle Loan Requests",
      path: "/admin/handle-loan-request",
      icon: <ShieldAlert size={32} />,
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Approve or deny user loan applications"
    },
    {
      title: "Handle Fixed Requests",
      path: "/admin/handle-fixed-request",
      icon: <HandCoins size={32} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      description: "Approve or deny user fixed deposit applications"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-left" dir="ltr">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-slate-500 text-lg">
          Welcome back, Administrator. Select a module to manage.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Active Users",
            value: data.userCount,
            trend: "+12%",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
          },
          {
            label: "Total Volume",
            value: data.totalBalance,
            trend: "+5.4%",
            color: "text-blue-600",
            bg: "bg-blue-50"
          },
          {
            label: "Pending Loans",
            value: data.totalLoanRequest,
            trend:
              data.totalLoanRequest > 100
                ? "High Risk"
                : data.totalLoanRequest > 10
                ? "Medium"
                : data.totalLoanRequest >= 1
                ? "Low"
                : "Optimal",
            color: "text-amber-600",
            bg: "bg-amber-50"
          },
          {
            label: "System Health",
            value: "99.9%",
            trend: "Stable",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
          }
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {item.label}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.bg} ${item.color}`}
              >
                {item.trend}
              </span>
            </div>
            <div className="text-3xl font-black text-slate-800">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500 ${item.bg}`}
            ></div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${item.bg} ${item.color} group-hover:rotate-6 transition-transform duration-300`}
            >
              {item.icon}
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="flex items-center text-indigo-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
              MANAGE MODULE <span className="ml-2">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
