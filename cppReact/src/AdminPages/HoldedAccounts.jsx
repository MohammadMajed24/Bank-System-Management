import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { 
  User, 
  Mail, 
  Calendar, 
  Check, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Swal from "sweetalert2";

export default function HoldedAccounts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosClient.get("/holded-accounts")
      .then(response => {
        setData(response.data.accounts || []);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const handleActive = (email) => {
    axiosClient.post("/holded-accounts/activate", { email })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Account Activated',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'rounded-2xl' }
        })
        setReload(!reload);
      })
      .catch(error => {
        const errormessage = error.response?.data?.message || error.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Activation Failed',
          text: errormessage,
          customClass: { popup: 'rounded-2xl' }
        })
      });
  }

  const handleDelete = (email) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      customClass: { popup: 'rounded-2xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.post("/holded-accounts/delete", { email })
          .then(response => {
            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              showConfirmButton: false,
              timer: 1500,
              customClass: { popup: 'rounded-2xl' }
            })
            setReload(!reload);
          })
          .catch(error => {
            const errormessage = error.response?.data?.message || error.message || "Something went wrong";
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errormessage,
              customClass: { popup: 'rounded-2xl' }
            })
          })
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <ShieldAlert size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suspended Accounts</h1>
                    <p className="text-slate-500 text-sm">Review and manage accounts currently on hold</p>
                </div>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
                    Pending: {data?.length || 0}
                </span>
            </div>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
               <p>Loading accounts...</p>
             </div>
          ) : data && data.length > 0 ? (
            data.map((account, index) => {
              const isFirst = index === 0;

              return (
                <div 
                  key={index}
                  className={`
                    relative group flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border transition-all duration-300
                    ${isFirst 
                      ? "bg-white border-blue-200 shadow-lg shadow-blue-100 scale-100 z-10" 
                      : "bg-slate-50 border-slate-200 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 hover:bg-white hover:shadow-md"}
                  `}
                >
                  
                  {isFirst && (
                    <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Clock size={12} /> Next in Queue
                    </div>
                  )}

                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border-2
                      ${isFirst ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-200 text-slate-500 border-slate-300"}
                    `}>
                      {index + 1}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {account.name}
                      </span>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" /> {account.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" /> {account.creationDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-200 pt-4 md:pt-0">
                    
                    <button 
                      disabled={!isFirst}
                      onClick={() => handleActive(account.email)}  
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                        ${isFirst 
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:-translate-y-0.5" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                      `}
                    >
                      <CheckCircle2 size={18} />
                      <span>Activate</span>
                    </button>

                    <button
                      disabled={!isFirst}
                      onClick={() => handleDelete(account.email)}  
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                        ${isFirst 
                          ? "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300" 
                          : "bg-transparent text-slate-300 border border-slate-200 cursor-not-allowed"}
                      `}
                    >
                      <XCircle size={18} />
                      <span>Reject</span>
                    </button>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="p-4 bg-slate-50 rounded-full mb-3">
                 <Search size={32} className="text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">No holded accounts found</p>
              <p className="text-sm text-slate-400">All accounts are currently active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}