import React, { useState } from "react";
import { register } from "../../https";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const Register = ({ setIsRegister }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", role: "" });

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      setFormData({ name: "", email: "", phone: "", password: "", role: "" });
      setTimeout(() => setIsRegister(false), 1500);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? "Cannot reach server. Check backend is running on http://localhost:8000."
          : "Couldn’t create access. Please try again.");
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        registerMutation.mutate(formData);
      }}
    >
      <Field label="Full Name">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Martin Owino"
          className="flex-1 bg-transparent text-slate-900 focus:outline-none"
          required
        />
      </Field>

      <Field label="Work Email">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="name@yourrestaurant.com"
          className="flex-1 bg-transparent text-slate-900 focus:outline-none"
          required
        />
      </Field>

      <Field label="Phone Number">
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="07XX XXX XXX"
          className="flex-1 bg-transparent text-slate-900 focus:outline-none"
          required
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
          className="flex-1 bg-transparent text-slate-900 focus:outline-none"
          required
        />
      </Field>

      <div>
        <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Pick access level</label>
        <div className="mt-3 flex items-center gap-3">
          {["Waiter", "Cashier", "Admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData({ ...formData, role })}
              className={`w-full rounded-lg border px-4 py-2.5 text-[15px] font-semibold ${
                formData.role === role
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-lg font-bold text-white hover:bg-slate-800">
        Create Team Access
      </button>
    </form>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">{label}</label>
    <div className="flex rounded-lg border border-slate-300 bg-white p-4">{children}</div>
  </div>
);

export default Register;
