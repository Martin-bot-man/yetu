import React, { useMemo, useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTables } from "../https";

const statusMap = {
  all: "all",
  booked: "Booked",
  available: "Available",
};

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [seatFilter, setSeatFilter] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const tableParams = useMemo(() => {
    const params = {
      status: statusMap[status],
      sortBy: "tableNo",
      order: "asc",
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (seatFilter === "2") params.maxSeats = 2;
    if (seatFilter === "4") {
      params.minSeats = 3;
      params.maxSeats = 4;
    }
    if (seatFilter === "6") params.minSeats = 5;

    return params;
  }, [search, seatFilter, status]);

  const { data: resData, isError, isFetching } = useQuery({
    queryKey: ["tables", tableParams],
    queryFn: async () => {
      return await getTables(tableParams);
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Unable to load tables", { variant: "error" });
    }
  }, [isError]);

  const tablesData = resData?.data?.data?.tables || [];
  const summary = resData?.data?.data?.summary || {
    total: 0,
    booked: 0,
    available: 0,
    seats: 0,
  };

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Tables</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-sm ${status === "all" ? "bg-[#383838]" : "bg-transparent"} rounded-lg px-4 py-2 font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-sm ${status === "booked" ? "bg-[#383838]" : "bg-transparent"} rounded-lg px-4 py-2 font-semibold`}
          >
            Booked
          </button>
          <button
            onClick={() => setStatus("available")}
            className={`text-[#ababab] text-sm ${status === "available" ? "bg-[#383838]" : "bg-transparent"} rounded-lg px-4 py-2 font-semibold`}
          >
            Available
          </button>
        </div>
      </div>

      <div className="px-10 pb-3">
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Visible Tables" value={summary.total} />
          <StatCard label="Booked" value={summary.booked} />
          <StatCard label="Available" value={summary.available} />
          <StatCard label="Total Seats" value={summary.seats} />
        </div>
      </div>

      <div className="flex items-center gap-3 px-10 pb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search table number"
          className="bg-[#262626] text-[#f5f5f5] placeholder:text-[#7d7d7d] rounded-lg px-4 py-2 w-64 outline-none border border-transparent focus:border-yellow-500"
        />
        <select
          value={seatFilter}
          onChange={(e) => setSeatFilter(e.target.value)}
          className="bg-[#262626] text-[#f5f5f5] rounded-lg px-3 py-2 outline-none"
        >
          <option value="all">All capacities</option>
          <option value="2">1-2 seats</option>
          <option value="4">3-4 seats</option>
          <option value="6">5+ seats</option>
        </select>
        {isFetching && <p className="text-xs text-[#ababab]">Refreshing...</p>}
      </div>

      <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[560px] overflow-y-scroll scrollbar-hide">
        {tablesData.map((table) => (
          <TableCard
            key={table._id}
            id={table._id}
            name={table.tableNo}
            status={table.status}
            initials={table?.currentOrder?.customerDetails?.name}
            seats={table.seats}
          />
        ))}
        {!tablesData.length && (
          <p className="text-[#ababab] col-span-5 text-center py-8">No tables match the selected filters.</p>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="bg-[#262626] rounded-lg p-3 border border-[#323232]">
      <p className="text-xs text-[#ababab]">{label}</p>
      <p className="text-xl text-[#f5f5f5] font-semibold mt-1">{value}</p>
    </div>
  );
};

export default Tables;
