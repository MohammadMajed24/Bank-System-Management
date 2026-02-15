import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import BankLogo from '../assets/BankLogo.png'; // Kept import if needed later
import { ShieldCheck, Bell, CheckCheck, BellOff, Info, Circle, ChevronDown, User, LogOut } from "lucide-react";
import axios from "axios";
import axiosClient from "../axiosClient";

function Notifications({ email }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasPostedRef = useState(false);

  const fetchNotifications = () => {
    setLoading(true);
    if (hasPostedRef.current) {
      setLoading(false);
      return;
    }
    hasPostedRef.current = true;
    axiosClient
      .get(`client/get-notifications?email=${email}`)
      .then((res) => setList(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (email) {
      fetchNotifications();
    }
  }, [email]);

  const markRead = async (id) => {
    await axios.post(`/api/notifications/read`, { id });
    setList(prev => prev.map(n => n.id === id ? { ...n, states: 1 } : n));
  };

  const markAllRead = async () => {
    await axios.post(`/api/notifications/read-all`, { email });
    setList(prev => prev.map(n => ({ ...n, states: 1 })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          fetchNotifications();
        }}
        className={`relative p-2.5 rounded-full transition-all duration-200 focus:outline-none 
        ${open ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
      >
        <Bell size={20} />
        {list.some(n => n.states === 0) && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-100 z-50 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
              </div>
              <button
                onClick={markAllRead}
                className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-100 border-b-blue-600"></div>
                  <p className="text-slate-400 text-xs font-medium">Syncing...</p>
                </div>
              )}

              {!loading && list.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-300">
                    <BellOff size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No new notifications</p>
                </div>
              )}

              {!loading && list.map((n) => (
                <div
                  key={n.id}
                  onClick={() => n.states === 0 && markRead(n.id)}
                  className={`group relative flex items-start gap-4 px-5 py-4 border-b border-slate-50 cursor-pointer transition-all duration-200
                  ${n.states === 0 ? "bg-blue-50/50 hover:bg-blue-50" : "bg-white hover:bg-slate-50/50"}`}
                >
                  <div className={`mt-1 flex-shrink-0 p-2 rounded-full transition-colors ${n.states === 0 ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "bg-slate-100 text-slate-400"}`}>
                    <Info size={16} />
                  </div>

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-sm leading-snug ${n.states === 0 ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                        {n.message}
                      </span>
                      {n.states === 0 && (
                        <Circle size={8} fill="currentColor" className="text-blue-600 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
              <button className="text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors py-1">
                View All Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { setUser, setToken, user } = useStateContext();
  const [toggleIcon, setToggleIcon] = useState(false);
  const userInitial = user?.firstName?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate('/');
  };

  useEffect(() => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Section - CHANGED from Black to Blue Gradient */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  TRUST<span className="text-blue-600">BANK</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Secure Banking
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Notifications email={user?.email} />
              
              <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

              <div className="relative">
                <button
                  onClick={() => setToggleIcon(!toggleIcon)}
                  className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-full transition-all duration-200 border 
                    ${toggleIcon ? 'bg-blue-50 border-blue-100 ring-2 ring-blue-50' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                >
                  <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-sm font-bold text-slate-700 leading-none">{user?.firstName || "User"}</span>
                  </div>

                  {/* Avatar - Changed to Blue Theme */}
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-200 font-bold text-sm border-2 border-white">
                    {userInitial}
                  </div>
                  
                  <ChevronDown 
                    size={14} 
                    className={`text-slate-400 transition-transform duration-200 ${toggleIcon ? 'rotate-180 text-blue-600' : ''}`} 
                  />
                </button>

                {toggleIcon && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setToggleIcon(false)}
                    ></div>

                    <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      
                      <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>

                      <div className="p-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setToggleIcon(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                        >
                          <User size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                          My Profile
                        </button>

                        <div className="h-px bg-slate-100 my-1 mx-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors group"
                        >
                          <LogOut size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}