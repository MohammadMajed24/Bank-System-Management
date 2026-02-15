import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";
import {
  HandCoins,
  History,
  Calendar,
  DollarSign,
  FileText,
  Search,
  TrendingUp,
  Wallet,
  PieChart
} from "lucide-react";
import Swal from 'sweetalert2';

const PROFIT_RATES = {
  "3 months": 0.05,
  "6 months": 0.08,
  "12 months": 0.12,
};

export default function Loan() {
  const { user } = useStateContext();

  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("3 months");

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const profitRate = PROFIT_RATES[duration];
  const profit = amount ? amount * profitRate : 0;

  const getStateText = (state) => {
    switch (state) {
      case 0: return "Finished";
      case 1: return "Approved";
      case 2: return "Pending";
      case 3: return "Denied";
      default: return "Unknown";
    }
  };

  const getStatusBadgeStyles = (statusText) => {
    const status = statusText.toLowerCase();
    if (status.includes("pending"))
      return "bg-amber-50 text-amber-700 border-amber-100";
    if (status.includes("approved"))
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status.includes("denied"))
      return "bg-rose-50 text-rose-700 border-rose-100";
    if (status.includes("finished"))
      return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const handleSubmit = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < 1000) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Minimum fixed deposit amount is 1000 EGP',
        confirmButtonColor: '#1d4ed8'
      });
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
    axiosClient
      .post("submit-fixed-request", {
        amount: numericAmount,
        profit: Number(profit.toFixed(2)),
        duration,
        email: user.email,
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Fixed deposit request submitted successfully',
          showConfirmButton: false,
          timer: 1500
        });
        fetchHistory();
        setAmount("");
      })
      .catch((err) => {
        console.log(err);
        const errormessage = err.response?.data?.message || err.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errormessage,
        });
      });
  };

  const fetchHistory = () => {
    setLoading(true);
    axiosClient
      .post(`client/get-fixed-history`, { email: user.email })
      .then((res) => setLoans(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8 font-sans">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg">
                    <HandCoins className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Apply Fixed Deposit</h1>
                    <p className="text-blue-100 text-sm font-medium">Higher duration yields higher profit returns</p>
                </div>
             </div>
        </div>

        <div className="p-8 space-y-8">

          <div className="grid md:grid-cols-3 gap-6 items-end">

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Investment Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200"
                  placeholder="Min. 1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Duration Plan</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 cursor-pointer appearance-none"
                >
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
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
              Confirm Deposit
            </button>

          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                  <PieChart size={18} />
                  <p className="text-xs font-bold uppercase tracking-wider">Profit Rate</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {(profitRate * 100).toFixed(0)}%
              </p>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp size={18} />
                  <p className="text-xs font-bold uppercase tracking-wider">Expected Profit</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                ${profit.toFixed(2)}
              </p>
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-indigo-600">
                  <Wallet size={18} />
                  <p className="text-xs font-bold uppercase tracking-wider">Total Return</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                ${(Number(amount || 0) + profit).toFixed(2)}
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <History size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">My Deposits</h2>
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
              <p className="font-medium text-slate-500">No deposit records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Profit</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {loans.map((loan) => {
                    const statusText = getStateText(loan.status);
                    return (
                        <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 text-sm font-mono text-slate-600">#{loan.id}</td>
                        <td className="p-5 text-sm font-medium text-slate-700">{loan.duration}</td>
                        <td className="p-5 text-sm font-bold text-slate-900">${loan.amount}</td>
                        <td className="p-5 text-sm font-bold text-emerald-600">
                            +${loan.profit}
                        </td>
                        <td className="p-5 text-sm text-slate-500">{loan.date}</td>
                        <td className="p-5 text-center">
                            <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(statusText)}`}
                            >
                            {statusText}
                            </span>
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

    </div>
  );
}