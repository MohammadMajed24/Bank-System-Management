import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { ShieldCheck } from "lucide-react";
export default function GuestLayout() {
    const {token}=useStateContext();
    const navigate=useNavigate();
    useEffect(()=>{
        if(token){
            navigate('/home');
        }
    },[])
  return (


    <>

        <div>
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">TRUST<span className="text-blue-600">BANK</span></span>
        </div>
        <div className="flex gap-2">
            <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
            onClick={()=>{navigate("/signup")}}
            >signup</button>
            </div>
            <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
            onClick={()=>{navigate("/login")}}
            >login</button>
            </div>
        </div>
      </header>
    </div>
    <main>
      <Outlet />
    </main>
    </>
  );
}