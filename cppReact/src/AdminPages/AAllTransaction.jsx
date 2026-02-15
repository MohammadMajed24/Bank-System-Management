import { useEffect, useRef, useState } from "react";
import { 
    ArrowRight, 
    Calendar, 
    Hash, 
    User, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Search, 
    RefreshCw, 
    CreditCard,
    ArrowRightLeft
} from 'lucide-react';
import axiosClient from "../axiosClient";

export default function AAllTransaction() {
    const [usersTransactions, setUsersTransactions] = useState(null);
    const idSearchRef = useRef();
    const [reload, setReload] = useState(false);

    useEffect(() => {
        axiosClient.get("/all-transactions")
        .then(res => {
            console.log(res);
            setUsersTransactions(res.data.transactions);
        })
    }, [reload]);

    const handleSearch = () => {
        axiosClient.post("/search-transaction", {
            "searchId": idSearchRef.current.value
        }).then(res => {
            console.log(res);
            res.data.transactions.message 
                ? setUsersTransactions([]) 
                : setUsersTransactions([res.data.transactions]);
        })
    }

    const allTransaction = () => {
        setReload(!reload);
        if(idSearchRef.current) idSearchRef.current.value = "";
    };

    const moneyFormatter = (amount) => {
        return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                            <ArrowRightLeft size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Transactions</h1>
                            <p className="text-slate-500 text-sm">Monitor all fund transfers across the system</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            ref={idSearchRef}
                            placeholder="Search by Transaction ID..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                    >
                        <Search size={18} />
                        Search
                    </button>
                    <button 
                        onClick={allTransaction}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Reset
                    </button>
                </div>

                <div className="space-y-4">
                    {usersTransactions && usersTransactions.length > 0 ? (
                        usersTransactions.map((transaction, index) => (
                            <div 
                                key={index} 
                                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                        <Hash size={14} className="text-slate-500" />
                                        <span className="text-xs font-mono font-bold text-slate-600 tracking-wider">{transaction.id}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400 text-xs font-medium">
                                        <Calendar size={14} className="mr-1.5" />
                                        <span>{transaction.date}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
                                            <ArrowUpRight size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sender</p>
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-slate-400" />
                                                <span className="font-mono font-bold text-slate-700 text-sm">
                                                    {transaction.senderAccountNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300">
                                        <ArrowRight size={20} />
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-1/3 justify-start md:justify-end md:flex-row-reverse text-left md:text-right">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                                            <ArrowDownLeft size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Receiver</p>
                                            <div className="flex items-center gap-2 md:flex-row-reverse">
                                                <User size={16} className="text-slate-400" />
                                                <span className="font-mono font-bold text-slate-700 text-sm">
                                                    {transaction.receiverAccountNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 rounded-xl px-4 py-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transfer Amount</span>
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <CreditCard size={18} className="text-indigo-600" />
                                        <span className="text-xl font-bold tracking-tight">{moneyFormatter(transaction.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="p-4 bg-slate-50 rounded-full mb-3">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No Transactions Found</h3>
                            <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}