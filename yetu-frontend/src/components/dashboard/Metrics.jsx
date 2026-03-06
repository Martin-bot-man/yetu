import React from "react";
import { itemsData, metricsData } from "../../constants";
import { useSelector } from "react-redux";
import { selectLowStockItems, selectWasteAnalysis } from "../../redux/slices/inventorySlice";
import { MdInventory, MdWarning } from "react-icons/md";
import { FaRecycle } from "react-icons/fa";

const Metrics = () => {
  const lowStockItems = useSelector(selectLowStockItems);
  const wasteAnalysis = useSelector(selectWasteAnalysis);

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Complete business overview with AI-powered inventory insights
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Inventory Insights Section */}
      <div className="mt-8 bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#f5f5f5] text-lg flex items-center gap-2">
            <MdInventory /> Inventory Insights
          </h3>
          <span className="text-sm text-[#ababab]">AI-Powered Analysis</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Low Stock Alert */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-400 font-semibold">Low Stock Items</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">{lowStockItems.length}</p>
              </div>
              <MdWarning className="text-red-400 text-2xl" />
            </div>
            {lowStockItems.length > 0 && (
              <div className="mt-3 space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <p key={item._id} className="text-sm text-[#ababab]">• {item.name}</p>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-sm text-[#ababab]">• +{lowStockItems.length - 3} more</p>
                )}
              </div>
            )}
          </div>

          {/* Waste Analysis */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-400 font-semibold">Waste Cost</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">KES {wasteAnalysis.totalWasteCost?.toLocaleString() || '0'}</p>
              </div>
              <FaRecycle className="text-orange-400 text-2xl" />
            </div>
            <p className="text-sm text-[#ababab] mt-2">Last 30 days</p>
          </div>

          {/* Inventory Value */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-400 font-semibold">Total Inventory Value</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">KES 0</p>
              </div>
              <MdInventory className="text-green-400 text-2xl" />
            </div>
            <p className="text-sm text-[#ababab] mt-2">Real-time valuation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Item Details
          </h2>
          <p className="text-sm text-[#ababab]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Distinctio, obcaecati?
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                itemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                            <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
