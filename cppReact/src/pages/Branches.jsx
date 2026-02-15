import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { MapPin, Phone, Building2, Navigation, Search, Globe } from "lucide-react";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/user/branches");
      setBranches(res.data == null ? [] : res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg">
                <Globe className="text-blue-400" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Our Branches</h1>
                <p className="text-slate-300 mt-1 font-medium">Find a location near you</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm text-slate-300 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
             <p className="text-slate-500 font-medium">Locating branches...</p>
           </div>
        ) : branches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
             <div className="p-4 bg-slate-50 rounded-full mb-3">
               <Search size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Branches Found</h3>
             <p className="text-slate-400">We couldn't find any branch information at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Building2 size={24} />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">
                  {branch.name}
                </h2>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin size={18} className="mt-1 text-slate-400 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{branch.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-slate-400 flex-shrink-0" />
                    <p className="text-sm font-medium">{branch.phone}</p>
                  </div>
                </div>

                <a
                  href={branch.location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-100 group-hover:border-blue-600"
                >
                  <Navigation size={18} />
                  Get Directions
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}