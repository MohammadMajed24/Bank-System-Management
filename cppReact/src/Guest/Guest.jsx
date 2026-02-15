import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Globe, 
  Zap, 
  BarChart3, 
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Guest() {
  const navigate = useNavigate();
  return (
<div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans antialiased selection:bg-indigo-100">


      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-50 -z-10" />
        <div className="absolute bottom-0 left-[-5%] w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 -z-10" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Zap size={14} fill="currentColor" />
            Empowering Your Finances
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.95]">
            Banking for the <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Digital Generation.
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Experience the next level of financial management. Secure, lightning-fast, and designed to give you total control over your assets.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-2xl shadow-indigo-200 group"
            onClick={() => navigate("/signup")}
            >
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Bank-Grade Security</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              We use 256-bit AES encryption to ensure your data and transactions are protected 24/7.
            </p>
            <div className="mt-8 flex items-center text-indigo-600 font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more <ChevronRight size={18} />
            </div>
          </div>

          <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Smart Analytics</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Gain deep insights into your spending habits with our AI-driven financial tracking tools.
            </p>
            <div className="mt-8 flex items-center text-indigo-600 font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more <ChevronRight size={18} />
            </div>
          </div>

          <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <Globe size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Global Access</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Manage your accounts, pay bills, and transfer money across borders instantly from anywhere.
            </p>
            <div className="mt-8 flex items-center text-indigo-600 font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-100 py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
            <ShieldCheck size={20} />
            <span className="font-bold tracking-tight">TRUSTBANK SYSTEM</span>
          </div>
          
          <div className="flex gap-8 text-slate-400 text-sm">
            <span className="flex items-center gap-2 hover:text-slate-600 cursor-pointer">
              <CreditCard size={16} /> Virtual Cards
            </span>
            <span className="flex items-center gap-2 hover:text-slate-600 cursor-pointer">
              <Lock size={16} /> Privacy Policy
            </span>
          </div>

          <p className="text-slate-400 text-xs">
            © 2025 Bank Management System. Built for modern financial security.
          </p>
        </div>
      </footer>
    </div>
  );
}