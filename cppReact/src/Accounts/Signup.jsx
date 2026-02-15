import { useEffect, useRef, useState } from "react";
import SignupImage from "../assets/signup Image.png";
import {
  User, Mail, Lock, Phone, MapPin,
  CreditCard, Briefcase, Calendar,
  ArrowRight, ArrowLeft, CheckCircle,
} from "lucide-react";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Swal from "sweetalert2";

export default function Signup() {
  const [progress, setProgress] = useState(30);

  const name1 = useRef("");
  const name2 = useRef("");
  const nationalID = useRef("");
  const birthdate = useRef("");
  const email = useRef("");
  const phone = useRef("");
  const password = useRef("");
  const cpassword = useRef("");
  const address = useRef("");
  const job = useRef("");
  const accountType = useRef("");

  const navigate = useNavigate();
  const { token } = useStateContext();
  useEffect(() => {
    if (token) {
      navigate('/admin/admin-home');
    }
  }, [])



  const handleSignup = () => {
    const userData = {
      firstName: name1.current?.value,
      lastName: name2.current?.value,
      nationalID: nationalID.current?.value,
      birthdate: birthdate.current?.value,
      email: email.current?.value,
      phone: phone.current?.value,
      password: password.current?.value,
      address: address.current?.value,
      job: job.current?.value,
      accountType: accountType.current?.value,
    };
    if (name1.current?.value === "" || name2.current?.value === "") {
      Swal.fire({
        icon: 'invalid-name',
        title: 'Error',
        text: 'Please enter both first and last names.',
      });
      return;
    }


    if (!userData.password || userData.password.length < 4) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (userData.password !== cpassword.current?.value) {
      Swal.fire({ icon: 'error', title: 'Mismatch', text: 'Passwords do not match.' });
      return;
    }
    if (userData.nationalID.length !== 14) {
      Swal.fire({
        icon: 'invalid-id',
        title: 'Error',
        text: 'National ID must be 14 digits long.',
      });
      return;
    }
    if (!userData.email.includes("@") && !userData.email.includes(".")) {
      Swal.fire({
        icon: 'invalid-email',
        title: 'Error',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    axiosClient.post('/signup', userData)
      .then(response => {
        console.log("Signup Successful:", response.data);
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          showConfirmButton: false,
          timer: 1500
        });

      }).then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.error("Signup Error:", error);
        const errormessage = error.response.data.message || error.message || "Something went wrong";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errormessage,
        })
      });
    console.log("User Data Collected:", userData);

  };

  return (
    <div className="flex  w-full h-screen bg-gray-50 overflow-hidden">

      <div className="hidden lg:flex w-1/2 h-full relative ">
        <div className="absolute inset-0 bg-blue-900/20 z-10" />
        <img
          src={SignupImage}
          alt="Banking Signup"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h2 className="text-4xl font-bold mb-2">Secure Banking</h2>
          <p className="text-lg opacity-90">Manage your finances with confidence.</p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 h-full justify-center items-center p-8 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col space-y-6">

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {progress === 30 ? "Personal Details" : progress === 60 ? "Security Setup" : "Finalize Registration"}
                </p>
              </div>
              <span className="text-blue-700 font-bold text-lg">{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 h-2.5 rounded-full mt-2">
              <div
                className="bg-blue-700 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 relative">

            <div className={progress === 30 ? "space-y-4 animate-in fade-in duration-300" : "hidden"}>

              <div className="grid grid-cols-2 gap-4">
                <InputField icon={User} inputRef={name1} placeholder="First Name" type="text" />
                <InputField icon={User} inputRef={name2} placeholder="Last Name" type="text" />
              </div>

              <InputField icon={CreditCard} inputRef={nationalID} placeholder="National ID (14 Digits)" type="number" />

              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  ref={birthdate}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                />
              </div>

              <button
                onClick={() => setProgress(60)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Next Step <ArrowRight size={20} />
              </button>
            </div>

            <div className={progress === 60 ? "space-y-4 animate-in fade-in duration-300" : "hidden"}>

              <InputField icon={Mail} inputRef={email} placeholder="Email Address" type="email" />
              <InputField icon={Phone} inputRef={phone} placeholder="Phone Number" type="tel" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={Lock} inputRef={password} placeholder="Password" type="password" />
                <InputField icon={Lock} inputRef={cpassword} placeholder="Confirm Password" type="password" />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setProgress(30)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft size={20} /> Back
                </button>
                <button
                  onClick={() => setProgress(100)}
                  className="w-2/3 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className={progress === 100 ? "space-y-4 animate-in fade-in duration-300" : "hidden"}>

              <InputField icon={MapPin} inputRef={address} placeholder="Home Address (Full)" type="text" />
              <InputField icon={Briefcase} inputRef={job} placeholder="Job Title / Employment" type="text" />

              <div className="relative">
                <select ref={accountType} className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white appearance-none">
                  <option value="" disabled defaultValue>Select Account Type</option>
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setProgress(60)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft size={20} /> Back
                </button>
                <button
                  onClick={handleSignup}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  Create Account <CheckCircle size={20} />
                </button>
              </div>
            </div>

          </div>
          <div className="flex justify-center items-center space-x-2">

            <p className="text-center text-gray-500 text-sm">
              Already have an account?
            </p>

            <button onClick={() => navigate("/login")} className="text-blue-700 cursor-pointer font-bold hover:underline">Login</button>

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