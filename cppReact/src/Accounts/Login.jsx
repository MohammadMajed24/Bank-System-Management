import { User } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import signupImage from "../assets/signup Image.png";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
export default function Login() {
    const {token,setUser,setToken}=useStateContext();
    const [error, setError] = useState("");
    const password = useRef("");
    const email = useRef("");
    const navigate = useNavigate();

    
    useEffect(()=>{
        if(token){
            navigate('/admin/admin-home');
        }
    },[])
    
    
    
    
    
    const handleSubmit=()=>{
        const userData={
            email: email.current?.value,
            password: password.current?.value,
        };
        axiosClient.post('/login',userData)
        .then(response=>{
            console.log(response);
            setUser(response.data.user);
            setToken(response.data.token);
            navigate('/');
        }).catch(()=>{
            setError("Invalid email or password");
        })
    }


    return (
        <div className="flex w-full h-screen ">
            <div className="lg:w-1/2 max-xl:hidden h-full flex items-center justify-center bg-gray-50 overflow-hidden">
                <img src={signupImage} className="h-full w-full object-cover" alt="Login Image" />
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md flex flex-col space-y-6">

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Login</h1>
                                <p className="text-slate-500 text-sm mt-1">
                                   
                                </p>
                            </div>
                            <span className="text-blue-700 font-bold text-lg"></span>
                        </div>

                        <div className="w-full bg-gray-200 h-2.5 rounded-full mt-2">
                            <div
                                className="bg-blue-700 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                            ></div>
                        </div>
                    </div>
                    {error && <div className="text-red-600 font-semibold">{error}</div>}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField icon={User} inputRef={email} placeholder="example@gmail.com" type="text" />
                        <InputField icon={User} inputRef={password} placeholder="password" type="text" />
                    </div>
                    <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    onClick={handleSubmit}
                    >
                        Login
                    </button>
                    <div className="flex justify-center items-center space-x-2">

                              <p className="text-center text-gray-500 text-sm">
            Don't have an account? 
          </p>
          <button onClick={()=>navigate("/signup")} className="text-blue-700  cursor-pointer font-bold hover:underline">Signup</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function InputField({ icon: Icon, inputRef, placeholder, type }) {
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type={type}
                ref={inputRef}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-shadow"
                placeholder={placeholder}
            />
        </div>
    );
}