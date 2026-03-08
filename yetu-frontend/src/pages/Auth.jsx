import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Auth";
  }, []);

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f3f4f6]">
      <div className="relative hidden w-1/2 items-center justify-center bg-cover lg:flex">
        <img className="h-full w-full object-cover" src={restaurant} alt="Restaurant" />
        <div className="absolute inset-0 bg-slate-900/70" />
        <blockquote className="absolute bottom-10 mb-10 px-8 text-2xl italic text-white">
          "Busy service is good. Blind service is expensive. Keep orders moving and money visible."
          <br />
          <span className="mt-4 block text-slate-200">- Team Yetu</span>
        </blockquote>
      </div>

      <div className="w-full min-h-screen bg-[#f3f4f6] p-8 lg:w-1/2 lg:p-10">
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="Yetu Logo" className="h-14 w-14 rounded-full border border-slate-200 p-1" />
            <h1 className="text-lg font-semibold tracking-wide text-slate-900">Yetu</h1>
          </div>

          <h2 className="mb-4 mt-8 text-center text-4xl font-semibold text-slate-900">
            {isRegister ? "Add Your Team Access" : "Run Your Shift"}
          </h2>
          <p className="mb-8 text-center text-slate-500">
            {isRegister
              ? "Create a staff login so the right person can do the right job."
              : "Sign in and see tables, orders, and cash flow in one place."}
          </p>

          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

          <div className="mt-6 flex justify-center">
            <p className="text-[15px] text-slate-500">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 font-semibold text-slate-900 underline-offset-2 hover:underline"
                type="button"
              >
                {isRegister ? "Log in now" : "Create access"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
