import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = () => {
  const [dateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex flex-col items-start">
        <h1 className="text-[15px] font-semibold tracking-wide text-slate-900">
          {customerData.customerName || "Walk-in Guest"}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">#{customerData.orderId || "N/A"} / Dine in</p>
        <p className="mt-2 text-sm font-medium text-slate-500">{formatDate(dateTime)}</p>
      </div>
      <button className="rounded-lg bg-slate-100 px-3 py-2 text-lg font-bold text-slate-700">
        {getAvatarName(customerData.customerName) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;
