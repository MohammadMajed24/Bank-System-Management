import { useRef } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axiosClient";
import { Lock, KeyRound, Save, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const newPasswordRef = useRef();
  const oldPasswordRef = useRef();
  const {user} = useStateContext();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    axiosClient.post("/change-password",{
      "email": user.email,
      "newPassword": newPasswordRef.current.value,
      "oldPassword": oldPasswordRef.current.value
    }).then(res => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your security credentials have been changed successfully.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
            popup: 'rounded-2xl'
        }
      })
      }).catch(err => {
        console.log(err);
        const errormessage = err.response.data.message || err.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: errormessage,
          customClass: {
            popup: 'rounded-2xl'
        }
        })
    })
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 font-sans">
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
        
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
          
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative z-10 flex flex-col items-center mt-2">
            <div className="bg-white/10 p-4 rounded-2xl shadow-inner border border-white/10 mb-4 backdrop-blur-md">
                <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Security Settings</h1>
            <p className="text-blue-100 text-sm mt-1 font-medium">Update your password to keep your account safe</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            ref={oldPasswordRef} 
                            type="password" 
                            placeholder="Enter your current password" 
                            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            ref={newPasswordRef} 
                            type="password" 
                            placeholder="Create a strong password" 
                            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200"
                        />
                    </div>
                    
                    <div className="flex items-start gap-2 mt-3 px-1">
                        <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-500 leading-tight">
                          Password must be at least 8 characters long and include a mix of numbers and symbols.
                        </p>
                    </div>
                </div>
            </div>

            <button 
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-300 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
                onClick={handleChangePassword}
            >
                <Save size={20} />
                <span>Update Credentials</span>
            </button>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
            <Lock size={14} className="text-emerald-600" />
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                End-to-End Encrypted
            </p>
        </div>

      </div>
    </div>
  );
}