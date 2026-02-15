import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  X,
  Globe
} from "lucide-react";
import Swal from "sweetalert2";

export default function ABranches() {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [currentBranch, setCurrentBranch] = useState({
    id: null,
    name: "", 
    location_link: "",
    phone: "",
    address: "",
  });

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/branches");
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

  const handleInput = (e) => {
    setCurrentBranch({
      ...currentBranch,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    setCurrentBranch({
      id: null,
      name: "",
      location_link: "",
      phone: "",
      address: "",
    });
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (branch) => {
    setCurrentBranch({
        ...branch,
        name: branch.name || branch.branch_name 
    });
    setIsEdit(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosClient.put("/admin/branches", {
          id: currentBranch.id,
          name: currentBranch.name,
          location_link: currentBranch.location_link,
          phone: currentBranch.phone,
          address: currentBranch.address,
        });
        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Branch details updated successfully.',
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: 'rounded-2xl' }
        });
      } else {
        await axiosClient.post("/admin/branches", {
          name: currentBranch.name,
          location_link: currentBranch.location_link,
          phone: currentBranch.phone,
          address: currentBranch.address,
        });
        Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'New branch added successfully.',
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: 'rounded-2xl' }
        });
      }
      setShowForm(false);
      loadBranches();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        customClass: { popup: 'rounded-2xl' }
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axiosClient.delete("/admin/branches", {
                  data: { id },
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Branch has been deleted.',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: { popup: 'rounded-2xl' }
                });
                loadBranches();
              } catch (err) {
                console.error(err);
              }
        }
      })
  };

  const filteredBranches = branches.filter((b) =>
    b.id.toString().includes(search) || 
    (b.name && b.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-8 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg">
                        <Building2 className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Branch Management</h1>
                        <p className="text-blue-100 mt-1 font-medium">Manage physical locations and details</p>
                    </div>
                </div>
                
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Add Branch
                </button>
             </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="text-sm text-slate-500 font-medium">
                Total Branches: {branches.length}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Branch Name</th>
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                    <span className="text-slate-500 text-sm">Loading data...</span>
                                </td>
                            </tr>
                        ) : filteredBranches.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-400">
                                    <Search size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>No branches found matching your search.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredBranches.map((branch, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-5 font-mono text-slate-500 text-sm">#{branch.id}</td>
                                    <td className="p-5 font-bold text-slate-800">{branch.name}</td>
                                    <td className="p-5 text-sm text-slate-600 flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        {branch.phone}
                                    </td>
                                    <td className="p-5 text-sm text-slate-600">
                                        <div className="flex items-start gap-2 max-w-xs">
                                            <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                            <span className="truncate">{branch.address}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <a
                                            href={branch.location_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                                        >
                                            <Globe size={12} /> Map
                                            <ExternalLink size={10} />
                                        </a>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(branch)}
                                                className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(branch.id)}
                                                className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 border border-rose-100 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-slate-900/5 transform transition-all scale-100">
              
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800">
                    {isEdit ? "Update Branch" : "Create New Branch"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={20} />
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch Name</label>
                    <input
                        type="text"
                        name="name" 
                        placeholder="e.g. Downtown HQ"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        value={currentBranch.name || ""} 
                        onChange={handleInput}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="e.g. +20 123 456 7890"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        value={currentBranch.phone}
                        onChange={handleInput}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Google Maps Link</label>
                    <input
                        type="text"
                        name="location_link"
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        value={currentBranch.location_link}
                        onChange={handleInput}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
                    <textarea
                        name="address"
                        placeholder="Street, City, Governorate"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 min-h-[80px] resize-none"
                        value={currentBranch.address}
                        onChange={handleInput}
                        required
                    />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
                  >
                    {isEdit ? "Save Changes" : "Create Branch"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}