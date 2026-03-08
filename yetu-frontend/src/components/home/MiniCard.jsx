import React from "react";
import { motion } from "framer-motion";

const MiniCard = ({ title, icon, number, footerNum, prefix = "" }) => {
  const isPositive = Number(footerNum) >= 0;
  const trendColor = isPositive ? "text-[#37d67a]" : "text-[#ff6b6b]";
  const chipColor = isPositive
    ? "border-[#37d67a]/35 bg-[#123325]/70 text-[#86f3b8]"
    : "border-[#ff6b6b]/35 bg-[#3a1d1d]/70 text-[#ff9c9c]";
  const meterWidth = Math.min(Math.max(Math.abs(Number(footerNum) * 12), 8), 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#172237,#10192a)] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[#90a7cf] uppercase">{title}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#f4f7ff]">
            {prefix}
            {number}
          </h2>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-2xl text-[#f6d47b]">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] text-[#94a6c7]">vs previous shift</p>
          <p className={`rounded-full border px-2.5 py-1 text-sm font-semibold ${chipColor}`}>
            {isPositive ? "+" : "-"}
            {Math.abs(Number(footerNum)).toFixed(1)}%
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#2f9fff] to-[#6cf6d1]" style={{ width: `${meterWidth}%` }} />
        </div>
        <p className={`mt-2 text-sm font-medium ${trendColor}`}>
          {isPositive ? "On-track against shift benchmark" : "Below benchmark, requires attention"}
        </p>
      </div>
    </motion.div>
  );
};

export default MiniCard;
