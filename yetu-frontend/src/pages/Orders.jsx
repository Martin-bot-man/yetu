import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import OrderCard from "../components/orders/OrderCard";
import { getOrders } from "../https";

const statuses = ["all", "in progress", "ready", "completed"];

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
    placeholderData: keepPreviousData,
  });

  const orders = resData?.data?.data || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = (order?.orderStatus || "").toLowerCase();
      const statusMatch = statusFilter === "all" || normalizedStatus === statusFilter;

      const query = search.trim().toLowerCase();
      if (!query) return statusMatch;

      const customer = (order?.customerDetails?.name || "").toLowerCase();
      const tableNo = String(order?.table?.tableNo || "");
      const orderId = String(order?._id || "").toLowerCase();

      return statusMatch && (customer.includes(query) || tableNo.includes(query) || orderId.includes(query));
    });
  }, [orders, search, statusFilter]);

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f3f4f6] pb-24">
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Orders</h1>
          <div className="flex flex-wrap items-center gap-2">
            {statuses.map((label) => {
              const isActive = statusFilter === label;
              return (
                <button
                  key={label}
                  onClick={() => setStatusFilter(label)}
                  className={`rounded-full border px-4 py-1.5 text-[15px] font-medium transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {label === "all" ? "All" : label.replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, table, or order id"
            className="w-full max-w-lg rounded-md border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-slate-800 outline-none focus:border-slate-500"
          />
        </div>

        <div className="h-[calc(100vh-15rem)] overflow-y-auto pr-2">
          {isLoading && <p className="text-slate-500">Loading live orders...</p>}
          {!isLoading && !filteredOrders.length && (
            <p className="text-slate-500">No orders match this view. Try a different filter.</p>
          )}
          {!isLoading && filteredOrders.map((order) => <OrderCard key={order._id || order.id} order={order} />)}
        </div>
      </div>
    </section>
  );
};

export default Orders;
