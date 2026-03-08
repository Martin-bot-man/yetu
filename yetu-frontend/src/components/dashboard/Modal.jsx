import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ setIsTableModalOpen }) => {
  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setIsTableModalOpen(false);
      enqueueSnackbar(res.data.message, { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Could not create table.", { variant: "error" });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-96 rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Create New Table</h2>
          <button onClick={() => setIsTableModalOpen(false)} className="text-slate-500 hover:text-slate-900">
            <IoMdClose size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            tableMutation.mutate(tableData);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Table Number</label>
            <div className="flex rounded-lg border border-slate-300 bg-white p-3 px-4">
              <input
                type="number"
                name="tableNo"
                value={tableData.tableNo}
                onChange={(e) => setTableData((prev) => ({ ...prev, tableNo: e.target.value }))}
                className="flex-1 bg-transparent text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 mt-3 block text-[15px] font-medium text-slate-600">Number of Seats</label>
            <div className="flex rounded-lg border border-slate-300 bg-white p-3 px-4">
              <input
                type="number"
                name="seats"
                value={tableData.seats}
                onChange={(e) => setTableData((prev) => ({ ...prev, seats: e.target.value }))}
                className="flex-1 bg-transparent text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <button type="submit" className="mb-4 mt-8 w-full rounded-lg bg-slate-900 py-3 text-lg font-bold text-white">
            Save Table Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
