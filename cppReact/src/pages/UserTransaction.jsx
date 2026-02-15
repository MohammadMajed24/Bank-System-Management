import { useEffect, useState } from "react";
import { 
    ArrowUpRight, 
    ArrowDownLeft, 
    Calendar, 
    Hash, 
    User, 
    History, 
    SearchX, 
    ArrowRightLeft 
} from 'lucide-react';
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function UserTransaction() {
    const [userTransactions, setUserTransactions] = useState(null);
    const { user } = useStateContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        axiosClient.post("/user-transaction", {
            "accountNumber": user.accountNumber
        })
        .then(res => {
            console.log(res);
            setUserTransactions(res.data.transactions);
        })
    }, []);

    const moneyFormatter = (amount) => {
        return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
                            <History size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction History</h1>
                            <p className="text-slate-500 text-sm">View all your recent inflows and outflows</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                        <Hash size={16} className="text-slate-400" />
                        <span className="text-sm font-mono font-semibold text-slate-700">
                            {user?.accountNumber}
                        </span>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    {userTransactions && userTransactions.length > 0 ? (
                        userTransactions.map((transaction, index) => {
                            const isSender = transaction.senderAccountNumber === user.accountNumber;

                            return (
                                <div 
                                    key={index} 
                                    className="group bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-5"
                                >
                                    {/* Icon Box */}
                                    <div className={`p-4 rounded-2xl flex-shrink-0 ${
                                        isSender 
                                        ? 'bg-rose-50 text-rose-600' 
                                        : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {isSender ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                    </div>

                                    {/* Main Info */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-bold uppercase tracking-wider ${
                                                isSender ? 'text-rose-700' : 'text-emerald-700'
                                            }`}>
                                                {isSender ? 'Outgoing Transfer' : 'Incoming Transfer'}
                                            </h3>
                                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1 md:hidden">
                                                <Calendar size={12} />
                                                {transaction.date}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 w-fit">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-xs text-slate-500">
                                                    {isSender ? 'To:' : 'From:'}
                                                </span>
                                                <span className="font-mono font-bold text-slate-800">
                                                    {isSender ? transaction.receiverAccountNumber : transaction.senderAccountNumber}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <Hash size={12} />
                                                <span className="font-mono">ID: {transaction.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount & Date (Desktop) */}
                                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                                        <div className="hidden md:flex items-center text-slate-400 text-xs mb-1">
                                            <Calendar size={14} className="mr-1.5" />
                                            <span>{transaction.date}</span>
                                        </div>
                                        
                                        <div className="text-right flex items-center gap-2 md:block">
                                            <p className={`text-lg md:text-xl font-bold tracking-tight ${
                                                isSender ? 'text-rose-600' : 'text-emerald-600'
                                            }`}>
                                                {isSender ? '-' : '+'}{moneyFormatter(transaction.amount).replace('EGP', '')}
                                            </p>
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-auto">EGP</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                            <div className="p-4 bg-slate-50 rounded-full mb-4">
                                <SearchX size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No Transactions Found</h3>
                            <p className="text-slate-400 text-sm mt-1">Your recent activity will appear here.</p>
                            <button 
                                onClick={() => navigate('/send-money')}
                                className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
                            >
                                <ArrowRightLeft size={16} />
                                Make a transfer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}