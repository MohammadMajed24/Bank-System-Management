import { useNavigate } from "react-router-dom";
import { useStateContext } from "./context/ContextProvider";
import { useEffect, useRef, useState } from "react";
import axiosClient from "./axiosClient";
import { 
  LayoutDashboard, 
  UserCircle, 
  ShieldCheck, 
  Mail, 
  CreditCard, 
  Wallet, 
  Hash, 
  Key, 
  Send, 
  History, 
  HandCoins, 
  Lock,
  Copy
} from 'lucide-react';

export default function Home() {
  const {user, token} = useStateContext();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(0);
  const hasPostedRef = useRef(false);

  useEffect(() => {
    if (user && user.nationalID == "123456789123") {
      navigate('/admin/admin-home')
    }  
  }, [])

  useEffect(() => {
    axiosClient.post("/get-user-data", {
      "email": user.email
    }).then(req => {
      console.log(req);
      setUserData(req.data.user);
    })
  }, [])
  
  console.log(user);

  const moneyFormatter = (amount) => {
    return new Intl.NumberFormat('en-EG', {style: 'currency', currency: 'EGP'}).format(amount);
  }

  useEffect(() => {
    if (hasPostedRef.current) return;
    hasPostedRef.current = true;
    axiosClient.post("/check-loan-time").catch(console.error);
    axiosClient.post("/check-fixed-time").catch(console.error);
  }, []);

  const quickActions = [
    { 
      label: "Send Money", 
      path: "/send-money", 
      icon: <Send size={22} />, 
      color: "bg-slate-700", 
      hover: "hover:bg-slate-800",
    },
    { 
      label: "Transactions", 
      path: "/user-transaction", 
      icon: <History size={22} />, 
      color: "bg-blue-800", 
      hover: "hover:bg-blue-900",
    },
    { 
      label: "Request Loan", 
      path: "/loan-request", 
      icon: <HandCoins size={22} />, 
      color: "bg-emerald-600", 
      hover: "hover:bg-emerald-700",
    },
    {
      label: "Request Fixed",
      path: "/fixed-request",
      icon: <HandCoins size={22} />,  
      color: "bg-amber-600",
      hover: "hover:bg-amber-700",
    },
    {
      label: "Branches",
      path: "/user/branches",
      icon: <Wallet size={22} />,
      color: "bg-indigo-700",
      hover: "hover:bg-indigo-800",
    },
    { 
      label: "Change Password", 
      path: "/change-password", 
      icon: <Lock size={22} />, 
      color: "bg-rose-700", 
      hover: "hover:bg-rose-800",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <LayoutDashboard className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Dashboard
                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${userData.status == "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {userData.status == "active" ? "Active" : "Hold"} 
                </span>
              </h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, <span className="text-slate-900 font-bold">{user?.firstName || userData?.name1}</span></p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`${action.color} ${action.hover} text-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group relative overflow-hidden`}
            >
              <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                {action.icon}
              </div>
              <span className="font-semibold text-xs uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
              <UserCircle className="w-6 h-6 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
            </div>
            
            <div className="p-8 space-y-6 flex-1">
              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-lg font-bold text-slate-900">
                    {userData?.name1} {userData?.name2}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                   <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-base font-medium text-slate-900">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                   <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">National ID</p>
                  <p className="text-base font-medium text-slate-900 tracking-widest">{userData?.nationalID}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-emerald-700" />
              <h2 className="text-lg font-bold text-slate-800">Financial Overview</h2>
            </div>
            
            <div className="p-8 space-y-8 flex-1 flex flex-col justify-center">
               <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-200">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-blue-400 opacity-20"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Total Balance</p>
                        <Wallet className="text-blue-300 opacity-80" size={24} />
                    </div>
                    <p className={`font-bold tracking-tight mb-2 ${userData?.balance >= 10000000 ? "text-2xl md:text-3xl" : "text-4xl"}`}>
                      {moneyFormatter(userData?.balance || 0)}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xs text-blue-100 font-medium">Active Account</span>
                    </div>
                  </div>
               </div>

              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 border-dashed">
                <div className="p-3 bg-white rounded-lg shadow-sm text-slate-700 border border-slate-100">
                    <Hash className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</p>
                  <p className="text-xl font-mono font-bold text-slate-800 tracking-widest mt-0.5">
                    {userData?.accountNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100">
                      <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Secure API Token</h3>
                    <p className="text-xs text-slate-500">Private access key for operations</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center justify-between gap-4">
                <code className="text-xs md:text-sm text-blue-700 font-mono break-all font-semibold">
                  {token || "No token generated"}
                </code>
                <div className="p-2 hover:bg-slate-200 rounded-md cursor-pointer transition-colors text-slate-400 hover:text-slate-600">
                   <Copy size={16} />
                </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-4 flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg inline-flex border border-blue-50">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Do not share this token with anyone.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}