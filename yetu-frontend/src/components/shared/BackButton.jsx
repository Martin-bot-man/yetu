import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="rounded-full border border-slate-300 bg-white p-2 text-lg text-slate-700 transition hover:bg-slate-100"
    >
      <IoArrowBackOutline />
    </button>
  );
};

export default BackButton;
