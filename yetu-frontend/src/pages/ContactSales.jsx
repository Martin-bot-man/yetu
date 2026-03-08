import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactSales = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessName: "",
    city: "",
    branches: "1",
  });

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#0e2a4d]">
      <header className="border-b border-slate-200 bg-white">
        <div className="industry-shell flex h-16 items-center justify-between">
          <button onClick={() => navigate("/")} className="text-[42px] font-black tracking-tight text-[#0e2a4d]">YETU</button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-[15px] font-semibold text-slate-700">Home</button>
            <button onClick={() => navigate("/auth")} className="rounded-md border border-slate-300 px-4 py-2 text-[15px] font-semibold text-slate-700">Log in</button>
          </div>
        </div>
      </header>

      <section className="industry-shell py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr,1fr]">
          <div className="rounded-2xl bg-[#0c2a52] p-7 text-white shadow-lg">
            <p className="text-[12px] uppercase tracking-[0.08em] text-blue-200">Contact Sales</p>
            <h1 className="mt-2 text-[50px] font-semibold leading-[1.05]">Let’s set up your POS</h1>
            <p className="mt-3 text-[18px] text-slate-200">
              Talk to our team to plan rollout, staff onboarding, and branch expansion.
            </p>

            <div className="mt-6 rounded-xl bg-white/10 p-5">
              <p className="text-[14px] text-blue-100">Kenya Sales Line</p>
              <p className="mt-1 text-[42px] font-bold leading-none text-[#ff8a3d]">0797782614</p>
              <p className="mt-2 text-[16px] text-slate-200">Available Monday to Saturday, 8:00 AM - 8:00 PM</p>
            </div>

            <ul className="mt-6 space-y-2 text-[17px] text-slate-100">
              <li>• M-Pesa-ready payments and reconciliation</li>
              <li>• Multi-branch dashboard and reporting</li>
              <li>• Inventory, menu, and kitchen workflows</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-[34px] font-semibold text-slate-900">Request a callback</h2>
            <p className="mt-2 text-[17px] text-slate-600">Share your details and we’ll call you shortly.</p>

            <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Field label="Full Name">
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="Phone Number">
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="07XX XXX XXX" className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="Business Name">
                <input value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="City">
                <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="Branch Count">
                <select value={formData.branches} onChange={(e) => setFormData({ ...formData, branches: e.target.value })} className="w-full bg-transparent outline-none">
                  <option value="1">1 Branch</option>
                  <option value="2-5">2-5 Branches</option>
                  <option value="6-15">6-15 Branches</option>
                  <option value="15+">15+ Branches</option>
                </select>
              </Field>

              <button className="w-full rounded-md bg-[#165dff] py-3 text-[17px] font-semibold text-white">Submit Request</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1 block text-[14px] font-semibold text-slate-600">{label}</span>
    <div className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[16px]">{children}</div>
  </label>
);

export default ContactSales;
