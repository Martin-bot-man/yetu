import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import { getOrders } from "../https";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  const orders = resData?.data?.data || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = (order?.orderStatus || "").toLowerCase();
      const statusMatch =
        statusFilter === "all" || normalizedStatus === statusFilter.toLowerCase();

      const query = search.trim().toLowerCase();
      if (!query) return statusMatch;

      const customer = (order?.customerDetails?.name || "").toLowerCase();
      const tableNo = String(order?.table?.tableNo || "");
      const orderId = String(order?._id || "").toLowerCase();

      const searchMatch =
        customer.includes(query) || tableNo.includes(query) || orderId.includes(query);

      return statusMatch && searchMatch;
    });
  }, [orders, search, statusFilter]);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4 mt-2">
        <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">Orders</h1>
        <div className="flex items-center justify-around gap-4">
          {["all", "In Progress", "Ready", "Completed"].map((label) => {
            const value = label.toLowerCase();
            const isActive = statusFilter === value;
            return (
              <button
                key={label}
                onClick={() => setStatusFilter(value)}
                className={`text-[#ababab] text-lg rounded-lg px-5 py-2 font-semibold ${
                  isActive ? "bg-[#383838]" : ""
                }`}
              >
                {label === "all" ? "All" : label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-10 pb-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, table, or order id"
          className="bg-[#262626] text-[#f5f5f5] placeholder:text-[#7d7d7d] rounded-lg px-4 py-2 w-[420px] outline-none border border-transparent focus:border-yellow-500"
        />
      </div>

      <div className="px-10 py-4 h-[520px] overflow-y-auto scrollbar-hide">
        {isLoading && <p className="text-[#ababab]">Loading orders...</p>}
        {!isLoading && !filteredOrders.length && (
          <p className="text-[#ababab]">No orders found for the selected filters.</p>
        )}
        {!isLoading &&
          filteredOrders.map((order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
