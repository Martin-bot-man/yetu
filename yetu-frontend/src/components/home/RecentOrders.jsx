import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../https";
import OrderList from "./OrderList";
import { motion } from "framer-motion";

const RecentOrders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: resData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  const orders = resData?.data?.data || [];

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = [...orders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    if (!query) {
      return sorted.slice(0, 6);
    }

    return sorted
      .filter((order) => {
        const customer = (order?.customerDetails?.name || "").toLowerCase();
        const tableNo = String(order?.table?.tableNo || "");
        return customer.includes(query) || tableNo.includes(query);
      })
      .slice(0, 6);
  }, [orders, search]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111a2a]/85 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#f5f8ff]">Recent Orders</h1>
          <p className="mt-1 text-[15px] text-[#9caed0]">Monitor live tickets and service progress.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-lg border border-[#4ca8ff]/35 bg-[#102a44]/70 px-3 py-2 text-[15px] font-semibold text-[#8fd0ff] transition hover:bg-[#153555]"
        >
          View all
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0e1420] px-4 py-3">
        <FaSearch className="text-[#8aa3cf]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by guest or table number"
          className="w-full bg-transparent text-[15px] text-[#f5f8ff] outline-none placeholder:text-[#6d80a7]"
        />
      </div>

      <div className="mt-4 h-[330px] space-y-2 overflow-y-auto pr-1 scrollbar-hide">
        {isLoading && <p className="text-[#9caed0]">Loading latest orders...</p>}
        {!isLoading && !filteredOrders.length && (
          <p className="text-[#9caed0]">No recent orders yet. New tickets will appear here.</p>
        )}
        {!isLoading &&
          filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <OrderList order={order} />
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default RecentOrders;
