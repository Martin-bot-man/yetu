import React from "react";
import { FaCheckDouble } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils";

const OrderList = ({ order }) => {
  const customerName = order?.customerDetails?.name || "Guest";
  const tableNo = order?.table?.tableNo || "-";
  const itemsCount = Array.isArray(order?.items) ? order.items.length : 0;
  const status = order?.orderStatus || "In Progress";
  const isReady = status === "Ready";

  return (
    <div className="rounded-xl border border-white/10 bg-[#121c2e] px-4 py-3 transition hover:border-white/20">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#203451] text-[15px] font-bold text-[#dcebff]">
          {getAvatarName(customerName)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold tracking-wide text-[#f5f8ff] sm:text-base">{customerName}</h1>
          <p className="text-sm text-[#91a4c6]">{itemsCount} items</p>
        </div>

        <h1 className="rounded-lg border border-[#f6b100]/50 px-2 py-1 text-sm font-semibold text-[#ffd56e] sm:text-[15px]">
            Table No: {tableNo}
          </h1>

        <div className="ml-auto flex flex-col items-start gap-1">
          {isReady ? (
            <>
              <p className="px-2 text-sm font-semibold text-[#41d98c] sm:text-[15px]">
                <FaCheckDouble className="mr-1 inline" />
                Ready
              </p>
              <p className="text-sm text-[#8ea7cc]">
                <FaCircle className="mr-1 inline text-[#41d98c]" />
                Ready to serve
              </p>
            </>
          ) : (
            <>
              <p className="px-2 text-sm font-semibold text-[#ffcd5d] sm:text-[15px]">
                <FaCircle className="mr-1 inline" />
                {status}
              </p>
              <p className="text-sm text-[#8ea7cc]">
                <FaCircle className="mr-1 inline text-[#ffcd5d]" />
                Preparing order
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
