import React, { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAvatarName } from "../../utils";
import { getOrders } from "../../https";

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
    <div className="mt-6 pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">Popular Dishes</h1>
        </div>
        <div className="overflow-y-scroll h-[680px] scrollbar-hide">
          {isLoading && <p className="text-[#ababab] px-6 pb-4">Loading dish trends...</p>}
          {!isLoading && !popularDishes.length && (
            <p className="text-[#ababab] px-6 pb-4">No completed dish data yet.</p>
          )}

          {!isLoading &&
            popularDishes.map((dish) => {
              return (
                <div
                  key={dish.id}
                  className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-4 mx-6"
                >
                  <h1 className="text-[#f5f5f5] font-bold text-xl mr-3">
                    {dish.id < 10 ? `0${dish.id}` : dish.id}
                  </h1>
                  <div className="w-[50px] h-[50px] rounded-full bg-[#2f2f2f] text-[#f5f5f5] flex items-center justify-center font-bold">
                    {getAvatarName(dish.name)}
                  </div>
                  <div>
                    <h1 className="text-[#f5f5f5] font-semibold tracking-wide">{dish.name}</h1>
                    <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
                      <span className="text-[#ababab]">Orders: </span>
                      {dish.numberOfOrders}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
