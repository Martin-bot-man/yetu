import React, { useMemo, useState, useEffect } from "react";
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
    const params = { status: statusMap[status], sortBy: "tableNo", order: "asc" };
    if (search.trim()) params.search = search.trim();
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
    queryFn: async () => getTables(tableParams),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) enqueueSnackbar("Couldn’t load tables. Try again.", { variant: "error" });
  }, [isError]);

  const tablesData = resData?.data?.data?.tables || [];
  const summary = resData?.data?.data?.summary || { total: 0, booked: 0, available: 0, seats: 0 };

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f3f4f6] pb-24">
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tables</h1>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(statusMap).map((key) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`rounded-full border px-4 py-1.5 text-[15px] font-medium ${
                  status === key
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Visible Tables" value={summary.total} />
          <StatCard label="Booked" value={summary.booked} />
          <StatCard label="Available" value={summary.available} />
          <StatCard label="Total Seats" value={summary.seats} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by table number"
            className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-slate-800 outline-none focus:border-slate-500"
          />
          <select
            value={seatFilter}
            onChange={(e) => setSeatFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-800 outline-none focus:border-slate-500"
          >
            <option value="all">All capacities</option>
            <option value="2">1-2 seats</option>
            <option value="4">3-4 seats</option>
            <option value="6">5+ seats</option>
          </select>
          {isFetching && <p className="text-sm text-slate-500">Syncing latest tables...</p>}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
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
            <p className="col-span-full py-8 text-center text-slate-500">
              No tables match those filters. Adjust and try again.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default Tables;
