import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { getInventoryItems } from "../../https/inventoryAPI";

const categoryColors = ["#d0342c", "#0f4c81", "#2f6f4e", "#9a3412", "#1d4ed8", "#334155"];

const MenuContainer = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState({});

  const { data: resData, isLoading } = useQuery({
    queryKey: ["inventory-items-for-menu"],
    queryFn: async () => getInventoryItems({ sortBy: "name", order: "asc" }),
  });

  const inventoryItems = resData?.data?.data || [];

  const groupedMenus = useMemo(() => {
    const groups = {};
    inventoryItems.forEach((item) => {
      const category = item?.category || "Uncategorized";
      if (!groups[category]) groups[category] = [];
      groups[category].push({
        id: item._id,
        name: item.name,
        price: Number(item.sellingPrice || item.costPrice || 0),
      });
    });
    return groups;
  }, [inventoryItems]);

  const categories = Object.keys(groupedMenus);
  const activeCategory = selectedCategory || categories[0] || "";
  const selectedItems = groupedMenus[activeCategory] || [];

  const increment = (id) => setQuantities((prev) => ({ ...prev, [id]: Math.min((prev[id] || 0) + 1, 20) }));
  const decrement = (id) => setQuantities((prev) => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 0;
    if (!quantity) return;

    dispatch(
      addItems({
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        pricePerQuantity: item.price,
        quantity,
        price: item.price * quantity,
      })
    );

    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-3 px-5 py-5 lg:grid-cols-4">
        {categories.map((category, index) => {
          const isSelected = activeCategory === category;
          return (
            <div
              key={category}
              className="flex h-[100px] cursor-pointer flex-col items-start justify-between rounded-lg p-4"
              style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex w-full items-center justify-between">
                <h1 className="text-base font-semibold text-white">{category}</h1>
                {isSelected && <GrRadialSelected className="text-white" size={20} />}
              </div>
              <p className="text-[15px] font-semibold text-white/75">{groupedMenus[category]?.length || 0} Items</p>
            </div>
          );
        })}
      </div>

      <hr className="border-slate-200" />

      <div className="grid w-full grid-cols-1 gap-3 px-5 py-5 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && <p className="col-span-full text-slate-500">Loading menu...</p>}
        {!isLoading && !selectedItems.length && (
          <p className="col-span-full text-slate-500">No inventory items available. Add items in Inventory first.</p>
        )}

        {!isLoading &&
          selectedItems.map((item) => (
            <div key={item.id} className="flex h-[160px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <h1 className="text-base font-semibold text-slate-900">{item.name}</h1>
                <button onClick={() => handleAddToCart(item)} className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <FaShoppingCart size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-slate-900">KES {item.price}</p>
                <div className="flex w-[58%] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <button onClick={() => decrement(item.id)} className="text-2xl text-slate-700">&minus;</button>
                  <span className="font-semibold text-slate-900">{quantities[item.id] || 0}</span>
                  <button onClick={() => increment(item.id)} className="text-2xl text-slate-700">&#43;</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default MenuContainer;
