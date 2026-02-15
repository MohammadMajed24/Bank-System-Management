import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { CheckCircle, XCircle, Clock, History, FileText,  } from 'lucide-react';
import Swal from "sweetalert2";
export default function HandleLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("requests"); 
  const [history, setHistory] = useState([]);

  const getStateText = (s) => {
    switch (s) {
      case 0: return "Finished";
      case 1: return "Approved";
      case 2: return "Pending";
      case 3: return "Denied";
      case 4: return "Late";
      default: return "Unknown";
    }
  };


  const getStatusStyle = (status) => {
    const s = getStateText(status).toLowerCase();
    if (s.includes('accept') || s.includes('approved')) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes('deny') || s.includes('denied')) return "bg-red-100 text-red-700 border-red-200";
    if (s.includes('finish') || s.includes('finished')) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes('late')) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };


  const fetchLoans = () => {
    setLoading(true);
    axiosClient.get("admin/get-all-loans")
      .then((res) => setLoans(res.data || []))
      .finally(() => setLoading(false));
  };

  const fetchHistory = () => {
    setLoading(true);
    axiosClient.get("admin/get-all-loans-history")
      .then((res) => {setHistory(res.data || [])})
      .then(() => setLoading(false));
  };

  const handleApprove = (id) => {
    axiosClient.post("admin/approve-loan", { id })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Loan Approved Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        fetchLoans();
        fetchHistory();
      })
      .catch(err=>{
        console.log(err);
        const errormessage = err.response.data.message|| err.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errormessage,
        })
      });
  };

  const handleDeny = (id) => {
    axiosClient.post("admin/deny-loan", { id })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Loan Denied Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        fetchLoans();
        fetchHistory();
      })
      .catch(err=>{
        console.log(err);
        const errormessage = err.response.data.message|| err.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errormessage,
        })
      });
  };


  
  useEffect(() => {
    fetchLoans();
    fetchHistory();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-gray-50/50 min-h-screen">
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loan Management</h1>
            <p className="text-gray-500 text-sm">Review requests and view history.</p>
          </div>

          {}
          <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-sm">
            <button 
              onClick={() => setTab("requests")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === "requests" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
              `}
            >
              <Clock size={16} />
              Pending Requests
              {}
              {loans.length > 0 && tab !== "requests" && (
                <span className="bg-blue-100 text-blue-600 text-xs py-0.5 px-1.5 rounded-full ml-1">{loans.length}</span>
              )}
            </button>

            <button 
              onClick={() => setTab("history")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === "history" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
              `}
            >
              <History size={16} />
              Loan History
            </button>
          </div>
        </div>
  
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p>Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              
              {tab === "requests" && (
                <>
                  {loans.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <FileText size={48} className="mx-auto mb-3 opacity-20" />
                      <p>No pending loan requests found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          <th className="p-4">ID</th>
                          <th className="p-4">User Email</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {loans.map((loan) => {
                          const isFrist = loans.indexOf(loan) === 0;
                          return(
                          <tr key={loan.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-4 font-mono text-gray-500">#{loan.id}</td>
                            <td className="p-4 font-medium text-gray-800">{loan.email}</td>
                            <td className="p-4 text-gray-600">{loan.duration}</td>
                            <td className="p-4 font-bold text-gray-800">${loan.loan_cost}</td>
                            <td className="p-4 text-gray-500">{loan.date}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(loan.states)}`}>
                                {getStateText(loan.states)}
                              </span>
                            </td>
                            <td className="p-4 flex justify-end gap-2">
                              <button 
                                onClick={() => handleApprove(loan.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors text-xs font-bold ${isFrist ? '' : 'opacity-50 cursor-not-allowed'}`}
                                title="Approve Loan"
                                disabled={isFrist ? false : true}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button 
                                onClick={() => handleDeny(loan.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors text-xs font-bold ${isFrist ? '' : 'opacity-50 cursor-not-allowed'}`}
                                title="Deny Loan"
                                disabled={isFrist ? false : true}
                              >
                                <XCircle size={14} /> Deny
                              </button>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {}
              {tab === "history" && (
                <>
                  {history.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <History size={48} className="mx-auto mb-3 opacity-20" />
                      <p>No loan history records.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          <th className="p-4">ID</th>
                          <th className="p-4">User Email</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Final Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {history.map((loan, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono text-gray-500">#{loan.id}</td>
                            <td className="p-4 text-gray-600">{loan.email}</td>
                            <td className="p-4 text-gray-600">{loan.duration}</td>
                            <td className="p-4 font-bold text-gray-800">${loan.loan_cost}</td>
                            <td className="p-4 text-gray-500">{loan.date}</td>
                            <td className="p-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(loan.states)}`}>
                                {getStateText(loan.states)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
