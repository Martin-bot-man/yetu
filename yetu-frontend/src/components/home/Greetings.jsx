import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Greetings = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour12: false });

  const hour = dateTime.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#1a2538] via-[#131d2f] to-[#121a2b] px-5 py-5 sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute -top-8 right-10 h-28 w-28 rounded-full bg-[#3ca0ff]/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-36 rounded-full bg-[#ff7a59]/20 blur-2xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <p className="inline-flex rounded-full border border-[#8fd0ff]/35 bg-[#10314b]/60 px-3 py-1 text-sm font-semibold tracking-[0.18em] text-[#9fd9ff] uppercase">
            Front Desk Overview
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#f4f7ff] sm:text-3xl">
            {greeting}, Martin.
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-[#b2bfd5] sm:text-base">
            Keep service fast, keep waste low, and maintain healthy table turnover this shift.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-2xl border border-white/15 bg-[#0e1422]/70 px-5 py-4 text-right shadow-inner shadow-black/20"
        >
          <h2 className="text-3xl font-extrabold tracking-[0.08em] text-[#f5f9ff] sm:text-4xl">
            {formatTime(dateTime)}
          </h2>
          <p className="mt-1 text-sm font-medium tracking-wide text-[#9aa9c6] sm:text-[15px]">
            {formatDate(dateTime)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Greetings;
