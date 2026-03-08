import React, { useMemo, useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdInventory } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const navItems = useMemo(
    () => [
      { label: "Home", path: "/ops", icon: FaHome },
      { label: "Orders", path: "/orders", icon: MdOutlineReorder },
      { label: "Tables", path: "/tables", icon: MdTableBar },
      { label: "Stock", path: "/inventory", icon: MdInventory },
      { label: "More", path: "/dashboard", icon: CiCircleMore },
    ],
    []
  );

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(
      setCustomer({
        name: name || "Walk-in Guest",
        phone,
        guests: guestCount || 1,
      })
    );
    setIsModalOpen(false);
    navigate("/tables");
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-slate-300/80 to-transparent" />
      <nav className="fixed inset-x-0 bottom-0 z-50 px-2 pb-3 sm:px-4">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl border border-slate-300 bg-white/95 px-3 shadow-xl backdrop-blur">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`group relative flex h-12 min-w-[72px] items-center justify-center gap-2 rounded-xl px-3 text-[15px] font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            );
          })}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isActive("/tables") || isActive("/menu")}
            onClick={() => setIsModalOpen(true)}
            className="ml-2 rounded-xl bg-[#d0342c] p-2.5 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            title="Start New Order"
          >
            <BiSolidDish size={18} />
          </motion.button>
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start New Order">
        <div>
          <label className="mb-2 block text-[15px] font-medium text-slate-600">Guest Name</label>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-3 px-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Who are we serving?"
              className="flex-1 bg-transparent text-slate-900 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Phone Number</label>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-3 px-4">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="07XX XXX XXX"
              className="flex-1 bg-transparent text-slate-900 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Party Size</label>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <button onClick={() => setGuestCount((g) => Math.max(1, g - 1))} className="px-2 text-2xl text-slate-700">
              &minus;
            </button>
            <span className="text-slate-900">{guestCount} Person</span>
            <button onClick={() => setGuestCount((g) => Math.min(12, g + 1))} className="px-2 text-2xl text-slate-700">
              &#43;
            </button>
          </div>
        </div>
        <button
          onClick={handleCreateOrder}
          className="mt-8 w-full rounded-lg bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Pick Table & Start Order
        </button>
      </Modal>
    </>
  );
};

export default BottomNav;
