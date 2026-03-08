import React, { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAvatarName } from "../../utils";
import { getOrders } from "../../https";
import { motion } from "framer-motion";

const PopularDishes = () => {
  const { data: resData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  const popularDishes = useMemo(() => {
    const orders = resData?.data?.data || [];
    const countByDish = new Map();

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const name = item?.name || "Unknown Item";
        const quantity = Number(item?.quantity || 1);
        countByDish.set(name, (countByDish.get(name) || 0) + quantity);
      });
    });

    return [...countByDish.entries()]
      .map(([name, numberOfOrders], index) => ({
        id: index + 1,
        name,
        numberOfOrders,
      }))
      .sort((a, b) => b.numberOfOrders - a.numberOfOrders)
      .slice(0, 10);
  }, [resData]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111a2a]/85 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#f5f8ff]">Popular Dishes</h1>
          <p className="mt-1 text-[15px] text-[#9caed0]">Top performing items this cycle.</p>
        </div>
        <span className="rounded-full border border-[#f6b100]/35 bg-[#2f250d]/70 px-3 py-1 text-sm font-semibold text-[#ffd56e]">
          Top 10
        </span>
      </div>

      <div className="mt-4 h-[624px] space-y-2 overflow-y-auto pr-1 scrollbar-hide">
        {isLoading && <p className="px-1 text-[#9caed0]">Calculating top sellers...</p>}
        {!isLoading && !popularDishes.length && (
          <p className="px-1 text-[#9caed0]">No item sales yet. Top dishes will show after first orders.</p>
        )}

        {!isLoading &&
          popularDishes.map((dish, index) => {
            const width = Math.max(10, Math.min(100, dish.numberOfOrders * 8));
            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: index * 0.03 }}
                className="rounded-2xl border border-white/10 bg-[#0e1420] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <h1 className="min-w-9 text-lg font-bold text-[#7bc8ff]">
                    {dish.id < 10 ? `0${dish.id}` : dish.id}
                  </h1>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b2a43] font-bold text-[#dce9ff]">
                    {getAvatarName(dish.name)}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h1 className="truncate text-[15px] font-semibold tracking-wide text-[#f5f8ff]">{dish.name}</h1>
                      <p className="text-sm font-semibold text-[#9fc7ff]">{dish.numberOfOrders} orders</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#4ca8ff] to-[#66f1c0]" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default PopularDishes;
