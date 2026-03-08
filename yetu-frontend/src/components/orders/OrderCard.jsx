import React from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index.jsx";

const OrderCard = ({ order }) => {
  const customerName = order?.customerDetails?.name || order?.customer || "Guest";
  const orderDate = order?.orderDate || order?.dateTime || new Date().toISOString();
  const tableNo = order?.table?.tableNo || order?.tableNo || "-";
  const orderStatus = order?.orderStatus || order?.status || "In Progress";
  const itemsCount = Array.isArray(order?.items) ? order.items.length : Number(order?.items || 0);
  const totalWithTax = Number(order?.bills?.totalWithTax ?? order?.total ?? 0);

  return (
    <div className="mb-4 w-full max-w-[620px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-base font-bold text-slate-700">
          {getAvatarName(customerName)}
        </button>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-base font-semibold tracking-wide text-slate-900">{customerName}</h1>
            <p className="text-[15px] text-slate-500">#{Math.floor(new Date(orderDate).getTime())} / Dine in</p>
            <p className="text-[15px] text-slate-500">Table <FaLongArrowAltRight className="ml-2 inline text-slate-400" /> {tableNo}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {orderStatus === "Ready" ? (
              <>
                <p className="rounded-full bg-emerald-50 px-2 py-1 text-[15px] text-emerald-700">
                  <FaCheckDouble className="mr-1 inline" /> {orderStatus}
                </p>
                <p className="text-sm text-slate-500">
                  <FaCircle className="mr-1 inline text-emerald-500" /> Ready to serve
                </p>
              </>
            ) : (
              <>
                <p className="rounded-full bg-amber-50 px-2 py-1 text-[15px] text-amber-700">
                  <FaCircle className="mr-1 inline" /> {orderStatus}
                </p>
                <p className="text-sm text-slate-500">
                  <FaCircle className="mr-1 inline text-amber-500" /> Preparing order
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[15px] text-slate-500">
        <p>{formatDateAndTime(orderDate)}</p>
        <p>{itemsCount} Items</p>
      </div>
      <hr className="mt-4 border-slate-200" />
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-900">Total</h1>
        <p className="text-base font-semibold text-slate-900">KES {totalWithTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderCard;
