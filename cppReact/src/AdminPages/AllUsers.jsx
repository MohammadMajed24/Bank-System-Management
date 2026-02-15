import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../context/ContextProvider";
import { 
  Users, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Wallet, 
  User as UserIcon,
  Search,
  ArrowUpRight
} from 'lucide-react';

export default function AllUsers() {
  const { user } = useStateContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient.post("/get-users", { "email": user.email })
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => setLoading(false));
  }, [user.email]);

  const getStatusStyle = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTypeStyle = (type) => {
    return type === "savings"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Users className="text-blue-600" size={24} />
                <h1 className="text-2xl font-bold text-gray-800">User Directory</h1>
            </div>
            <p className="text-gray-500 text-sm">Manage and view all registered bank customers.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p>Fetching users data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4 text-center"><UserIcon size={14} className="inline mr-1"/> Name</th>
                    <th className="p-4"><Mail size={14} className="inline mr-1"/> Contact</th>
                    <th className="p-4"><CreditCard size={14} className="inline mr-1"/> Account Info</th>
                    <th className="p-4"><Wallet size={14} className="inline mr-1"/> Balance</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {users.length > 0 ? (
                    users.map((u, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              {u.name1[0]?.toUpperCase()}{u.name2[0]?.toUpperCase() || ''}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 capitalize">{u.name1} {u.name2}</p>
                              <p className="text-xs text-gray-400 font-mono">National ID: {u.nationalID || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{u.email}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-gray-700 font-medium">{u.accountNumber}</span>
                            <span className={`w-fit mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getTypeStyle(u.accountType)}`}>
                              {u.accountType}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-900">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(u.balance)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(u.status)}`}>
                            {u.status}
                          </span>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400">
                        <Users size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No users found in the system.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

