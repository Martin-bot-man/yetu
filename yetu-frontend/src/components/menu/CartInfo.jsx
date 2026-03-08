import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({ top: scrolLRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [cartData]);

  return (
    <div className="px-4 py-3">
      <h1 className="text-lg font-semibold tracking-wide text-slate-900">Order Details</h1>
      <div className="mt-4 h-[380px] overflow-y-scroll" ref={scrolLRef}>
        {cartData.length === 0 ? (
          <p className="flex h-[380px] items-center justify-center text-[15px] text-slate-500">
            No items yet. Add dishes to build this order.
          </p>
        ) : (
          cartData.map((item) => (
            <div key={item.id} className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-md font-semibold text-slate-700">{item.name}</h1>
                <p className="font-semibold text-slate-500">x{item.quantity}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => dispatch(removeItem(item.id))}
                    className="cursor-pointer text-slate-500"
                    size={20}
                  />
                  <FaNotesMedical className="cursor-pointer text-slate-500" size={18} />
                </div>
                <p className="text-md font-bold text-slate-900">KES {item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;
