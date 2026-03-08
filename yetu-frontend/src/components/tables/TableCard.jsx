import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === "Booked") return;
    dispatch(updateTable({ table: { tableId: id, tableNo: name } }));
    navigate("/menu");
  };

  return (
    <div
      onClick={handleClick}
      key={id}
      className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="text-lg font-semibold text-slate-900">
          Table <FaLongArrowAltRight className="ml-2 inline text-slate-400" /> {name}
        </h1>
        <p
          className={`rounded-full px-2 py-1 text-sm font-semibold ${
            status === "Booked" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {status}
        </p>
      </div>
      <div className="mb-8 mt-5 flex items-center justify-center">
        <h1
          className="rounded-full p-5 text-xl text-white"
          style={{ backgroundColor: initials ? getBgColor() : "#94a3b8" }}
        >
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
      <p className="text-sm text-slate-500">
        Seats: <span className="font-semibold text-slate-800">{seats}</span>
      </p>
    </div>
  );
};

export default TableCard;
