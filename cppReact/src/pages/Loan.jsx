import { useRef, useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";
import { HandCoins, History, Calendar, DollarSign, FileText, Search, X, Check, AlertCircle } from 'lucide-react';
import Swal from "sweetalert2";
export default function Loan() {
  const moneyRef = useRef(null);
  const durationRef = useRef(null);
  const { user } = useStateContext();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== ADDED STATE ===== */
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null); // { type: 'success' | 'error', text: string }
  /* ====================== */

  const getStateText = (state) => {
    switch (state) {
      case 0: return "Finished";
      case 1: return "Approved";
      case 2: return "Pending";
      case 3: return "Denied";
      case 4: return "Late"; 
      default: return "Unknown";
    }
  };

  const handleSubmit = () => {
    const money = Number(moneyRef.current?.value);
    const duration = durationRef.current?.value;

    if (!money || money < 1000) {
      alert("Loan amount must be at least 1000");
      return;
    }
    if(user?.status !== "active"){
      function notActive(){
        Swal.fire({
          icon: 'warning',
          title: 'Your account is not active',
          text: 'Please activate your account to submit a loan request',
          confirmButtonColor: '#1d4ed8'
        });
      }
      notActive();
      return ;
    }

    axiosClient.post("submit-loan-request", {
      moneyOfLoan: money,
      duration: duration,
      email: user.email,
    }).then(() => fetchLoanHistory());
  };

  const getStatusBadgeStyles = (statusText) => {
    const status = statusText.toLowerCase();
    if (status.includes('pending') || status.includes('wait')) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    } else if (status.includes('approv') || status.includes('accept') || status.includes('done')) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (status.includes('reject') || status.includes('denied')) {
      return "bg-rose-50 text-rose-700 border-rose-100";
    } else if (status.includes('finished')) {
      return "bg-blue-50 text-blue-700 border-blue-100";
    } else if (status.includes('late')) {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const fetchLoanHistory = () => {
    setLoading(true);
    axiosClient
      .get(`client/get-loans-history?email=${user.email}`)
      .then((res) => setLoans(res.data || []))
      .finally(() => setLoading(false));
  };

  /* ===== ADDED FUNCTIONS ===== */
  const openPayModal = (loanId) => {
    setSelectedLoanId(loanId);
    setShowPayModal(true);
  };

  const confirmPayLoan = () => {
    if (!selectedLoanId) return;

    setPaying(true);
    axiosClient
      .post("/pay-loan", {
        loanId: selectedLoanId,
        email: user.email,
      })
      .then(() => {
        setShowPayModal(false);
        setSelectedLoanId(null);
        fetchLoanHistory();
        setPaymentMessage({ type: "success", text: "Loan payment successful!" });
        // Auto hide message after 3 seconds
        setTimeout(() => setPaymentMessage(null), 3000);
      })
      .catch(() => {
        setPaymentMessage({ type: "error", text: "Failed to pay the loan. Check balance." });
        setTimeout(() => setPaymentMessage(null), 3000);
      })
      .finally(() => setPaying(false));
  };
  /* =========================== */

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    axiosClient.post("/adman-home-data", { email: user.email }).catch(console.error);
  }, [user]);

  useEffect(() => {
    let ran = false;

    const checkLoanAndFixedTime = () => {
      if (ran) return;
      ran = true;
      axiosClient.post("/check-loan-time").catch(console.error);
      axiosClient.post("/check-fixed-time").catch(console.error);
    };

    checkLoanAndFixedTime();
    const interval = setInterval(checkLoanAndFixedTime, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8 font-sans">

      {/* Loan Request Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        {/* Header - Blue Gradient */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-8 relative overflow-hidden">
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg">
                    <HandCoins className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Request Funding</h1>
                    <p className="text-blue-100 text-sm font-medium">Apply for a personal loan instantly</p>
                </div>
             </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Loan Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  ref={moneyRef}
                  type="number"
                  placeholder="Min. 1000"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Duration</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <select
                  ref={durationRef}
                  defaultValue="3 months"
                  className="block w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
                {/* Custom Arrow */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Submit Application
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
             <History size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Application History</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">Loading history...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-3">
                 <Search size={32} className="opacity-40" />
              </div>
              <p className="font-medium text-slate-500">No loan history found</p>
              <p className="text-sm mt-1">Requests you make will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan ID</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loans.map((loan) => {
                    const statusText = getStateText(loan.states);
                    return (
                      <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 text-sm font-mono text-slate-600">#{loan.id}</td>
                        <td className="p-5 text-sm font-medium text-slate-700">{loan.duration}</td>
                        <td className="p-5 text-sm font-bold text-slate-900">${loan.loan_cost}</td>
                        <td className="p-5 text-sm text-slate-500">{loan.date}</td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(statusText)}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          {(loan.states === 1 || loan.states === 4) ? (
                            <button
                              onClick={() => openPayModal(loan.id)}
                              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-slate-300 text-xs font-medium">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl ring-1 ring-slate-900/5 transform transition-all scale-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <HandCoins size={24} />
                </div>
                <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Payment</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to pay off this loan? The amount will be deducted from your account immediately.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPayModal(false)}
                disabled={paying}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayLoan}
                disabled={paying}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors shadow-lg shadow-blue-200"
              >
                {paying ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {paymentMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl shadow-slate-300 animate-in slide-in-from-bottom-5 duration-300 border
          ${paymentMessage.type === "success" 
            ? "bg-emerald-600 border-emerald-500 text-white" 
            : "bg-white border-rose-200 text-rose-600"}`}>
          
          <div className={`p-1 rounded-full ${paymentMessage.type === "success" ? "bg-white/20" : "bg-rose-100"}`}>
             {paymentMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          </div>
          
          <div>
              <p className={`text-sm font-bold ${paymentMessage.type === "success" ? "text-white" : "text-slate-800"}`}>
                  {paymentMessage.type === "success" ? "Success" : "Transaction Failed"}
              </p>
              <p className={`text-xs ${paymentMessage.type === "success" ? "text-emerald-100" : "text-slate-500"}`}>
                  {paymentMessage.text}
              </p>
          </div>

          <button
            onClick={() => setPaymentMessage(null)}
            className={`ml-2 p-1 rounded-md hover:bg-white/10 transition-colors ${paymentMessage.type === "success" ? "text-white" : "text-slate-400"}`}
          >
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  );
}