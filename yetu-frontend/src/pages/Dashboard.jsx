import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";

const buttons = [
  { label: "Create Table", icon: <MdTableBar />, action: "table" },
  { label: "Create Category", icon: <MdCategory />, action: "category" },
  { label: "Add Menu Item", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Performance", "Orders", "Payments"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Performance");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f3f4f6] pb-24">
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-blue-700">
                Shift Command Center
              </p>
              <h1 className="mt-3 text-[48px] font-semibold leading-[1.05] text-slate-900">
                Run performance, orders, and payments from one console
              </h1>
              <p className="mt-2 text-[18px] text-slate-600">
                Keep service speed high and operating risk low with real-time visibility for this shift.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full border px-5 py-2 text-[16px] font-semibold ${
                    activeTab === tab
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {buttons.map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={() => handleOpenModal(action)}
                className="flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-[16px] font-semibold text-slate-800 hover:bg-slate-100"
              >
                {label} {icon}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Performance" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Payments" && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
            Payments view is next. For now, complete payments from the order flow.
          </div>
        )}

        <section className="mt-8 rounded-2xl bg-[#0c2a52] px-6 py-7 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.08em] text-blue-200">Operations Support</p>
              <h2 className="mt-1 text-[36px] font-semibold leading-[1.08]">Need help during service?</h2>
              <p className="mt-2 text-[17px] text-slate-200">
                Reach support and keep your shift running without downtime.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-md bg-white px-5 py-2.5 text-[16px] font-semibold text-[#0c2a52]">
                Contact Support
              </button>
              <button className="rounded-md border border-blue-200 px-5 py-2.5 text-[16px] font-semibold text-white">
                View Playbooks
              </button>
            </div>
          </div>
        </section>
      </div>

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
    </div>
  );
};

export default Dashboard;
