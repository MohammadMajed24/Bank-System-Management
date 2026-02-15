import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { CheckCircle, XCircle, Clock, History, FileText } from 'lucide-react';
import Swal from "sweetalert2";
export default function HandleFixed() {
  const [fixeds, setFixeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("requests"); 
  const [history, setHistory] = useState([]);

  const getStateText = (s) => {
    switch (s) {
      case 0: return "Finished";
      case 1: return "Approved";
      case 2: return "Pending";
      case 3: return "Denied";
      default: return "Unknown";
    }
  };

  const getStatusStyle = (status) => {
    const s = getStateText(status).toLowerCase();
    if (s.includes('accept') || s.includes('approved')) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes('deny') || s.includes('denied')) return "bg-red-100 text-red-700 border-red-200";
    if (s.includes('finish') || s.includes('finished')) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const fetchFixeds = () => {
    setLoading(true);
    axiosClient.get("admin/get-all-fixed")
      .then((res) => setFixeds(res.data || []))
      .finally(() => setLoading(false));
  };

  const fetchHistory = () => {
    setLoading(true);
    axiosClient.get("admin/get-all-fixed-history")
      .then((res) => setHistory(res.data || []))
      .finally(() => setLoading(false));
  };

  const handleApprove = (id) => {
    axiosClient.post("admin/approve-fixed", { id })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Fixed Deposit Approved',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchFixeds();
        fetchHistory();
      }).catch(()=>{
        Swal.fire({
          icon: 'error',
          title: 'Error approving fixed deposit',
          timer: 2000,
          showConfirmButton: false,
        });
      });
  };

  const handleDeny = (id) => {
    axiosClient.post("admin/deny-fixed", { id })
      .then(() => {
        Swal.fire({
          icon: 'failure',
          title: 'Fixed Deposit Denied',
          showConfirmButton: true,
        });
        fetchFixeds();
        fetchHistory();
      });
  };

  

  useEffect(() => {
    fetchFixeds();
    fetchHistory();
  }, []);




  
  const firstPendingIndex = fixeds.findIndex(f => f.status === 2);

  return (
    <div className="p-6 md:p-10 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fixed Deposits Management</h1>
            <p className="text-gray-500 text-sm">Review fixed deposit requests and view history.</p>
          </div>

          <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-sm">
            <button 
              onClick={() => setTab("requests")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === "requests" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
              `}
            >
              <Clock size={16} /> Pending Requests
              {fixeds.length > 0 && tab !== "requests" && (
                <span className="bg-blue-100 text-blue-600 text-xs py-0.5 px-1.5 rounded-full ml-1">{fixeds.length}</span>
              )}
            </button>

            <button 
              onClick={() => setTab("history")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === "history" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
              `}
            >
              <History size={16} /> Fixed History
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p>Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              {}
              {tab === "requests" && (
                <>
                  {fixeds.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <FileText size={48} className="mx-auto mb-3 opacity-20" />
                      <p>No pending fixed deposit requests found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          <th className="p-4">ID</th>
                          <th className="p-4">User Email</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Profit</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {fixeds.map((f, index) => {
                          const isFirstPending = index === firstPendingIndex;
                          return (
                            <tr key={f.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="p-4 font-mono text-gray-500">#{f.id}</td>
                              <td className="p-4 font-medium text-gray-800">{f.email}</td>
                              <td className="p-4 text-gray-600">{f.duration}</td>
                              <td className="p-4 font-bold text-gray-800">${f.amount}</td>
                              <td className="p-4 font-bold text-gray-800">${f.profit}</td>
                              <td className="p-4 text-gray-500">{f.date}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(f.status)}`}>
                                  {getStateText(f.status)}
                                </span>
                              </td>
                              <td className="p-4 flex justify-end gap-2">
                                <button 
                                  onClick={() => isFirstPending && handleApprove(f.id)}
                                  disabled={!isFirstPending}
                                  className={`
                                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                                    ${isFirstPending 
                                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300" 
                                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                    }
                                  `}
                                  title="Approve Fixed"
                                >
                                  <CheckCircle size={14} /> Approve
                                </button>
                                <button 
                                  onClick={() => isFirstPending && handleDeny(f.id)}
                                  disabled={!isFirstPending}
                                  className={`
                                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                                    ${isFirstPending 
                                      ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300" 
                                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                    }
                                  `}
                                  title="Deny Fixed"
                                >
                                  <XCircle size={14} /> Deny
                                </button>
                              </td>
                            </tr>
                          )
                        })}
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
                      <p>No fixed deposit history records.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          <th className="p-4">ID</th>
                          <th className="p-4">User Email</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Profit</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Final Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {history.map((f, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono text-gray-500">#{f.id}</td>
                            <td className="p-4 text-gray-600">{f.email}</td>
                            <td className="p-4 text-gray-600">{f.duration}</td>
                            <td className="p-4 font-bold text-gray-800">${f.amount}</td>
                            <td className="p-4 font-bold text-gray-800">${f.profit}</td>
                            <td className="p-4 text-gray-500">{f.date}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(f.status)}`}>
                                {getStateText(f.status)}
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
