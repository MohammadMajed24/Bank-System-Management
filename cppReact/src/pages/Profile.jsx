import { UserCircle, Mail, CreditCard, Phone, Briefcase, Calendar, Home, Hash, ShieldCheck, User } from "lucide-react";
import { useStateContext } from "../context/ContextProvider";

export default function Profile() {
  const { user } = useStateContext();
  console.log(user);

  const InfoCard = ({ icon, label, value, isMono = false }) => (
    <div className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-center gap-4">
      <div className="p-3 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-slate-800 ${isMono ? 'font-mono tracking-wide' : ''}`}>
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl overflow-hidden relative p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/10 shadow-2xl">
              <span className="text-4xl md:text-5xl font-bold text-white">
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-sm uppercase tracking-wider">
                  Active Account
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 backdrop-blur-sm uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Verified Profile
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <UserCircle size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard 
                icon={<User size={20} />} 
                label="Full Name" 
                value={`${user?.firstName} ${user?.lastName}`} 
              />
              <InfoCard 
                icon={<Calendar size={20} />} 
                label="Date of Birth" 
                value={user?.birthdate} 
              />
              <InfoCard 
                icon={<CreditCard size={20} />} 
                label="National ID" 
                value={user?.nationalID} 
                isMono={true}
              />
              <InfoCard 
                icon={<Briefcase size={20} />} 
                label="Occupation" 
                value={user?.job} 
              />
              <InfoCard 
                icon={<Phone size={20} />} 
                label="Phone Number" 
                value={user?.phone} 
                isMono={true}
              />
              <InfoCard 
                icon={<Home size={20} />} 
                label="Residential Address" 
                value={user?.address} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <ShieldCheck size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Account Details</h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-3 text-slate-700">
                   <Mail size={18} className="text-slate-400" />
                   <span className="font-semibold">{user?.email}</span>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</label>
                <div className="flex items-center gap-3 text-slate-700">
                   <Hash size={18} className="text-slate-400" />
                   <span className="font-mono font-bold text-lg tracking-wide">{user?.accountNumber}</span>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Type</label>
                <div className="flex items-center gap-3">
                   <Briefcase size={18} className="text-slate-400" />
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                     {user?.accountType || "Standard Savings"}
                   </span>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</label>
                <div className="flex items-center gap-3 text-slate-700">
                   <Calendar size={18} className="text-slate-400" />
                   <span className="font-semibold">{user?.createAt}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}