import { useRef, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";
import { Send, Hash, DollarSign, ArrowLeft, Banknote, ShieldCheck, Wallet } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

export default function SendMoney() {
    const navigate = useNavigate();
    const moneyRef = useRef(null);
    const accountRef = useRef(null);
    const { user } = useStateContext();

    const handleSend = () => {
        const amount = moneyRef.current?.value;
        if (amount <= 0) return;
        const accountNumber = accountRef.current?.value;
        axiosClient.post("/send-money", {
            "amount": amount,
            "receiverAccountNumber": accountNumber,
            "senderAccountNumber": user.accountNumber
        }).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Money sent successfully',
                showConfirmButton: false,
                timer: 1500
            })
        }).catch(err => {
            console.log(err);
            const errormessage = err.response.data.message || err.message || "Something went wrong";
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errormessage,
            })
        })
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                
                <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex flex-col items-center mt-4 relative z-10">
                        <div className="bg-white/10 p-4 rounded-2xl shadow-inner border border-white/10 mb-4 backdrop-blur-md">
                            <Send size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Transfer Funds</h2>
                        <p className="text-blue-100 text-sm mt-1 font-medium">Send money securely to another account</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* From Account Info */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg text-blue-700 shadow-sm border border-blue-50">
                             <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">From Account</p>
                            <p className="text-slate-800 font-mono font-semibold tracking-wide">{user?.accountNumber}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Recipient Account</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    ref={accountRef}
                                    type="text"
                                    placeholder="Enter 12-digit account number"
                                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Amount to Transfer</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    ref={moneyRef}
                                    type="number"
                                    placeholder="0.00"
                                    className="block w-full pl-12 pr-16 py-3.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 font-bold text-lg"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">EGP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button - Changed to Blue Theme */}
                    <button
                        className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 mt-6"
                        onClick={handleSend}
                    >
                        <Banknote size={20} />
                        <span>Confirm Transaction</span>
                    </button>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        256-bit SSL Encrypted
                    </p>
                </div>

            </div>
        </div>
    );
}