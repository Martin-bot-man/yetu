import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdInventory, MdWarning } from "react-icons/md";
import { FaRecycle } from "react-icons/fa";
import { getOrders, getTables } from "../../https";
import { getInventoryOverview, getWasteAnalysis } from "../../https/inventoryAPI";

const cardColors = ["#0f4c81", "#1f6f4a", "#9a3412", "#334155"];

const Metrics = () => {
  const { data: ordersRes } = useQuery({ queryKey: ["orders"], queryFn: async () => getOrders() });
  const { data: tablesRes } = useQuery({
    queryKey: ["tables", { status: "all", sortBy: "tableNo", order: "asc" }],
    queryFn: async () => getTables({ status: "all", sortBy: "tableNo", order: "asc" }),
  });
  const { data: overviewRes } = useQuery({ queryKey: ["inventory-overview"], queryFn: async () => getInventoryOverview() });
  const { data: wasteRes } = useQuery({ queryKey: ["waste-analysis"], queryFn: async () => getWasteAnalysis() });

  const orders = ordersRes?.data?.data || [];
  const tablesSummary = tablesRes?.data?.data?.summary || { total: 0 };
  const inventoryOverview = overviewRes?.data?.data || {};
  const wasteData = wasteRes?.data?.data || {};

  const metricsData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order?.bills?.totalWithTax || 0), 0);
    const completedOrders = orders.filter((order) => order?.orderStatus === "Completed").length;
    const averageTicket = orders.length ? totalRevenue / orders.length : 0;

    return [
      { title: "Revenue", value: `KES ${Math.round(totalRevenue).toLocaleString()}` },
      { title: "Total Orders", value: orders.length.toString() },
      { title: "Completed Orders", value: completedOrders.toString() },
      { title: "Avg Ticket", value: `KES ${Math.round(averageTicket).toLocaleString()}` },
    ];
  }, [orders]);

  const itemDetails = [
    { title: "Total Categories", value: String(inventoryOverview.categoryBreakdown?.length || 0) },
    { title: "Inventory Items", value: String(inventoryOverview.totalItems || 0) },
    { title: "Active Orders", value: String(orders.filter((o) => o?.orderStatus !== "Completed").length) },
    { title: "Total Tables", value: String(tablesSummary.total || 0) },
  ];

  const lowStockCount = inventoryOverview.lowStock || 0;
  const lowStockItems = inventoryOverview.lowStockItems || [];
  const wasteCost = Number(inventoryOverview.totalWasteCost || wasteData.totalWasteCost || 0);
  const totalStockValue = Number(inventoryOverview.totalStockValue || 0);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[34px] font-semibold tracking-tight text-slate-900">Overall Performance</h2>
        <p className="text-[17px] text-slate-500">Revenue, stock risk, and service health for the current cycle.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric, index) => (
          <div key={metric.title} className="rounded-2xl p-5 text-white shadow-md" style={{ backgroundColor: cardColors[index % cardColors.length] }}>
            <p className="text-[14px] font-medium text-white/90">{metric.title}</p>
            <p className="mt-2 text-[34px] font-semibold leading-none">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[24px] font-semibold text-slate-900">
            <MdInventory /> Inventory Insights
          </h3>
          <span className="text-[16px] text-slate-500">Live Analysis</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[16px] font-semibold text-red-700">Low Stock Items</p>
                <p className="mt-1 text-[32px] font-bold leading-none text-slate-900">{lowStockCount}</p>
              </div>
              <MdWarning className="text-2xl text-red-500" />
            </div>
            {lowStockItems.length > 0 && (
              <div className="mt-3 space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <p key={item._id} className="text-[15px] text-slate-600">• {item.name}</p>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[16px] font-semibold text-amber-700">Waste Cost</p>
                <p className="mt-1 text-[32px] font-bold leading-none text-slate-900">KES {wasteCost.toLocaleString()}</p>
              </div>
              <FaRecycle className="text-2xl text-amber-600" />
            </div>
            <p className="mt-2 text-[15px] text-slate-600">This is money lost, not just food lost.</p>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[16px] font-semibold text-emerald-700">Total Inventory Value</p>
                <p className="mt-1 text-[32px] font-bold leading-none text-slate-900">KES {Math.round(totalStockValue).toLocaleString()}</p>
              </div>
              <MdInventory className="text-2xl text-emerald-600" />
            </div>
            <p className="mt-2 text-[15px] text-slate-600">Real-time valuation.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-[30px] font-semibold tracking-tight text-slate-900">Item Details</h2>
        <p className="text-[17px] text-slate-500">Fast operational checkpoints for the shift.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {itemDetails.map((item, idx) => (
            <div key={item.title} className={`rounded-xl border p-5 shadow-sm ${idx % 2 === 0 ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-white"}`}>
              <p className="text-[14px] font-medium text-slate-500">{item.title}</p>
              <p className="mt-2 text-[34px] font-semibold leading-none text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
