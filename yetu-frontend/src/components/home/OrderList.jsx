import React from "react";
import { FaCheckDouble } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils";

const OrderList = ({ order }) => {
  const customerName = order?.customerDetails?.name || "Guest";
  const tableNo = order?.table?.tableNo || "-";
  const itemsCount = Array.isArray(order?.items) ? order.items.length : 0;
  const status = order?.orderStatus || "In Progress";

  return (
    <div className="flex items-center gap-5 mb-3">
      <button className="bg-[#f6b100] p-3 text-xl font-bold text-[#f5f5f5] rounded-lg">
        {getAvatarName(customerName)}
      </button>
      <div className="flex items-center justify-between w-full">
        <div className=" flex flex-col items-start gap-1">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">{customerName}</h1>
          <p className="text-[#ababab] text-sm">{itemsCount} Items</p>
        </div>
        <div>
          <h1 className="text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg p-1">
            Table No: {tableNo}
          </h1>
        </div>
        <div className=" flex flex-col items-start gap-2">
          {status === "Ready" ? (
            <>
              <p className=" text-green-600 px-4">
                <FaCheckDouble className="inline mr-2" />
                Ready
              </p>
              <p className="text-[#ababab] text-sm">
                <FaCircle className="inline mr-2 text-green-600" />
                Ready to serve
              </p>
            </>
          ) : (
            <>
              <p className=" text-yellow-500 px-4">
                <FaCircle className="inline mr-2" />
                {status}
              </p>
              <p className="text-[#ababab] text-sm">
                <FaCircle className="inline mr-2 text-yellow-500" />
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
