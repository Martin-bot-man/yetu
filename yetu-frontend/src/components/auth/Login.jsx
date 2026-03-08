import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { _id, name, email, phone, role } = res.data.data;
      dispatch(setUser({ _id, name, email, phone, role }));
      navigate("/ops");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Couldn’t sign you in. Check your details and try again.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
      }}
    >
      <div>
        <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Work Email</label>
        <div className="flex rounded-lg border border-slate-300 bg-white p-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@yourrestaurant.com"
            className="flex-1 bg-transparent text-slate-900 focus:outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Password</label>
        <div className="flex rounded-lg border border-slate-300 bg-white p-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            className="flex-1 bg-transparent text-slate-900 focus:outline-none"
            required
          />
        </div>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-lg font-bold text-white hover:bg-slate-800">
        Open My Shift
      </button>
    </form>
  );
};

export default Login;
