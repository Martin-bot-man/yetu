import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdInventory, MdWarning } from "react-icons/md";
import { FaRecycle } from "react-icons/fa";
import { getOrders, getTables } from "../../https";
import { getInventoryOverview, getWasteAnalysis } from "../../https/inventoryAPI";

const cardColors = ["#025cca", "#02ca3a", "#f6b100", "#be3e3f"];

const Metrics = () => {
  const { data: ordersRes } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
  });

  const { data: tablesRes } = useQuery({
    queryKey: ["tables", { status: "all", sortBy: "tableNo", order: "asc" }],
    queryFn: async () => getTables({ status: "all", sortBy: "tableNo", order: "asc" }),
  });

  const { data: overviewRes } = useQuery({
    queryKey: ["inventory-overview"],
    queryFn: async () => getInventoryOverview(),
  });

  const { data: wasteRes } = useQuery({
    queryKey: ["waste-analysis"],
    queryFn: async () => getWasteAnalysis(),
  });

  const orders = ordersRes?.data?.data || [];
  const tablesSummary = tablesRes?.data?.data?.summary || { total: 0, booked: 0, available: 0 };
  const inventoryOverview = overviewRes?.data?.data || {};
  const wasteData = wasteRes?.data?.data || {};

  const metricsData = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order?.bills?.totalWithTax || 0),
      0
    );
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
    { title: "Total Categories", value: String(inventoryOverview.categoryBreakdown?.length || 0), color: "#5b45b0" },
    { title: "Inventory Items", value: String(inventoryOverview.totalItems || 0), color: "#285430" },
    { title: "Active Orders", value: String(orders.filter((o) => o?.orderStatus !== "Completed").length), color: "#735f32" },
    { title: "Total Tables", value: String(tablesSummary.total || 0), color: "#7f167f" },
  ];

  const lowStockCount = inventoryOverview.lowStock || 0;
  const lowStockItems = inventoryOverview.lowStockItems || [];
  const wasteCost = Number(
    inventoryOverview.totalWasteCost || wasteData.totalWasteCost || 0
  );
  const totalStockValue = Number(inventoryOverview.totalStockValue || 0);

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Overall Performance</h2>
          <p className="text-sm text-[#ababab]">
            Live business overview powered by orders, tables, and inventory APIs
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <div
            key={metric.title}
            className="shadow-sm rounded-lg p-4"
            style={{ backgroundColor: cardColors[index % cardColors.length] }}
          >
            <p className="font-medium text-xs text-[#f5f5f5]">{metric.title}</p>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#f5f5f5] text-lg flex items-center gap-2">
            <MdInventory /> Inventory Insights
          </h3>
          <span className="text-sm text-[#ababab]">Live Analysis</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-400 font-semibold">Low Stock Items</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">{lowStockCount}</p>
              </div>
              <MdWarning className="text-red-400 text-2xl" />
            </div>
            {lowStockItems.length > 0 && (
              <div className="mt-3 space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <p key={item._id} className="text-sm text-[#ababab]">
                    • {item.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-400 font-semibold">Waste Cost</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">
                  KES {wasteCost.toLocaleString()}
                </p>
              </div>
              <FaRecycle className="text-orange-400 text-2xl" />
            </div>
            <p className="text-sm text-[#ababab] mt-2">Based on tracked waste records</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-400 font-semibold">Total Inventory Value</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">
                  KES {Math.round(totalStockValue).toLocaleString()}
                </p>
              </div>
              <MdInventory className="text-green-400 text-2xl" />
            </div>
            <p className="text-sm text-[#ababab] mt-2">Real-time valuation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Item Details</h2>
          <p className="text-sm text-[#ababab]">Live operational counters from backend data.</p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {itemDetails.map((item) => (
            <div key={item.title} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
              <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
