import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../https";
import OrderList from "./OrderList";

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
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">Recent Orders</h1>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="text-[#025cca] text-sm font-semibold"
          >
            View all
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recent orders"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full"
          />
        </div>

        <div className="mt-4 px-6 overflow-scroll h-[300px] scrollbar-hide">
          {isLoading && <p className="text-[#ababab]">Loading orders...</p>}
          {!isLoading && !filteredOrders.length && (
            <p className="text-[#ababab]">No recent orders found.</p>
          )}
          {!isLoading &&
            filteredOrders.map((order) => <OrderList key={order._id} order={order} />)}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
