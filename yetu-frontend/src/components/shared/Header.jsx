import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiCommand, FiCloud, FiWifi, FiBatteryCharging, FiZap } from "react-icons/fi";
import { TbCircleFilled } from "react-icons/tb";
import { getOrders, getTables } from "../../https";
import { getInventoryItems } from "../../https/inventoryAPI";

const getGreetingByTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getTableStatus = (summary = {}) => {
  const total = Number(summary.total || 0);
  const booked = Number(summary.booked || 0);
  if (!total) {
    return {
      label: "Tables Stable",
      tone: "text-emerald-700",
      bg: "bg-emerald-50",
      dot: "text-emerald-500",
    };
  }

  const utilization = booked / total;
  if (utilization >= 0.9) {
    return { label: "High Occupancy", tone: "text-rose-700", bg: "bg-rose-50", dot: "text-rose-500" };
  }
  if (utilization >= 0.7) {
    return { label: "Peak Service", tone: "text-amber-700", bg: "bg-amber-50", dot: "text-amber-500" };
  }

  return {
    label: "Tables Stable",
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "text-emerald-500",
  };
};

const staticCommands = [
  { id: "cmd-home", kind: "Page", label: "Operations Home", description: "Service overview", path: "/ops" },
  { id: "cmd-orders", kind: "Page", label: "Orders", description: "Live and completed bills", path: "/orders" },
  { id: "cmd-tables", kind: "Page", label: "Tables", description: "Occupancy and assignment", path: "/tables" },
  { id: "cmd-menu", kind: "Page", label: "Menu", description: "Take and prepare orders", path: "/menu" },
  { id: "cmd-inventory", kind: "Page", label: "Inventory", description: "Stock and suppliers", path: "/inventory" },
  { id: "cmd-dashboard", kind: "Page", label: "Dashboard", description: "Business and shift metrics", path: "/dashboard" },
];

const Header = () => {
  const { name, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [networkStrength, setNetworkStrength] = useState("strong");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const setOnlineState = () => setOnline(navigator.onLine);
    window.addEventListener("online", setOnlineState);
    window.addEventListener("offline", setOnlineState);

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const updateStrength = () => {
      const downlink = connection?.downlink || 10;
      if (downlink >= 5) setNetworkStrength("strong");
      else if (downlink >= 2) setNetworkStrength("medium");
      else setNetworkStrength("weak");
    };

    updateStrength();
    connection?.addEventListener?.("change", updateStrength);

    let batteryManager;
    let onBatteryChange;
    const setupBattery = async () => {
      if (!navigator.getBattery) return;
      batteryManager = await navigator.getBattery();
      onBatteryChange = () => setBatteryLevel(Math.round((batteryManager.level || 1) * 100));
      onBatteryChange();
      batteryManager.addEventListener("levelchange", onBatteryChange);
    };

    setupBattery();

    return () => {
      window.removeEventListener("online", setOnlineState);
      window.removeEventListener("offline", setOnlineState);
      connection?.removeEventListener?.("change", updateStrength);
      if (batteryManager && onBatteryChange) {
        batteryManager.removeEventListener("levelchange", onBatteryChange);
      }
    };
  }, []);

  const { data: tableSummaryData } = useQuery({
    queryKey: ["header", "table-summary"],
    queryFn: async () => {
      const res = await getTables({ status: "all", sortBy: "tableNo", order: "asc" });
      return res?.data?.data?.summary || {};
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const { data: liveSearchData } = useQuery({
    queryKey: ["header", "search", debouncedQuery],
    enabled: debouncedQuery.length >= 2 && isOpen,
    queryFn: async () => {
      const [ordersRes, tablesRes, inventoryRes] = await Promise.allSettled([
        getOrders(),
        getTables({ status: "all", sortBy: "tableNo", order: "asc" }),
        getInventoryItems({ sortBy: "name", order: "asc" }),
      ]);

      const orders = ordersRes.status === "fulfilled" ? ordersRes.value?.data?.data || [] : [];
      const tables = tablesRes.status === "fulfilled" ? tablesRes.value?.data?.data?.tables || [] : [];
      const inventory = inventoryRes.status === "fulfilled" ? inventoryRes.value?.data?.data || [] : [];

      const q = debouncedQuery;

      const orderMatches = orders
        .filter((order) => {
          const customer = String(order?.customerDetails?.name || "").toLowerCase();
          const tableNo = String(order?.table?.tableNo || "").toLowerCase();
          const orderId = String(order?._id || "").toLowerCase();
          return customer.includes(q) || tableNo.includes(q) || orderId.includes(q);
        })
        .slice(0, 4)
        .map((order) => ({
          id: `order-${order._id}`,
          kind: "Order",
          label: order?.customerDetails?.name || `Order ${String(order?._id || "").slice(-6)}`,
          description: `Table ${order?.table?.tableNo || "-"} | ${order?.orderStatus || "In Progress"}`,
          path: "/orders",
        }));

      const tableMatches = tables
        .filter((table) => String(table?.tableNo || "").toLowerCase().includes(q))
        .slice(0, 4)
        .map((table) => ({
          id: `table-${table._id}`,
          kind: "Table",
          label: `Table ${table.tableNo}`,
          description: `${table.status || "Available"} | ${table.seats || 0} seats`,
          path: "/tables",
        }));

      const inventoryMatches = inventory
        .filter((item) => `${item?.name || ""} ${item?.category || ""}`.toLowerCase().includes(q))
        .slice(0, 4)
        .map((item) => ({
          id: `inv-${item._id}`,
          kind: "Stock",
          label: item?.name || "Inventory Item",
          description: `${item?.category || "Uncategorized"} | Stock ${item?.currentStock ?? 0}`,
          path: "/inventory",
        }));

      return [...orderMatches, ...tableMatches, ...inventoryMatches];
    },
    staleTime: 10000,
  });

  const commands = useMemo(() => {
    if (debouncedQuery.length < 2) return staticCommands;
    const matchedStatic = staticCommands.filter((item) =>
      `${item.label} ${item.description}`.toLowerCase().includes(debouncedQuery)
    );
    return [...(liveSearchData || []), ...matchedStatic].slice(0, 10);
  }, [debouncedQuery, liveSearchData]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, isOpen]);

  const onSelectCommand = (path) => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
    navigate(path);
  };

  const onInputKeyDown = (event) => {
    if (!isOpen) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(0, commands.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!commands.length) return;
      onSelectCommand(commands[Math.max(0, Math.min(activeIndex, commands.length - 1))].path);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const tableStatus = getTableStatus(tableSummaryData);

  const healthNetworkTone =
    networkStrength === "strong"
      ? "text-emerald-700 bg-emerald-50"
      : networkStrength === "medium"
      ? "text-amber-700 bg-amber-50"
      : "text-rose-700 bg-rose-50";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1650px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d0342c] text-white shadow-sm">
            <FiZap size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-slate-900">{`${getGreetingByTime()}, ${name || "Team"}`}</p>
            <div className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium ${tableStatus.bg} ${tableStatus.tone}`}>
              <TbCircleFilled className={tableStatus.dot} size={8} />
              <span className="truncate">{tableStatus.label}</span>
            </div>
          </div>
        </div>

        <div className="relative hidden flex-1 lg:flex lg:justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:border-slate-500">
              <FiSearch className="text-slate-500" size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 120)}
                placeholder="Search orders, tables, guests, inventory..."
                className="w-full bg-transparent text-[16px] text-slate-800 outline-none placeholder:text-slate-400"
              />
              <span className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                <FiCommand size={10} />K
              </span>
            </div>

            {isOpen && (
              <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                <div className="max-h-[320px] overflow-y-auto p-1">
                  {commands.length ? (
                    commands.map((item, index) => (
                      <button
                        key={item.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onSelectCommand(item.path)}
                        className={`flex w-full items-start justify-between rounded px-3 py-2 text-left transition ${
                          index === activeIndex ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold text-slate-900">{item.label}</span>
                          <span className="block truncate text-sm text-slate-500">{item.description}</span>
                        </span>
                        <span className="ml-3 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{item.kind}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-sm text-slate-500">No results found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <HealthPill
            icon={<FiCloud size={12} />}
            label={online ? "Cloud Sync" : "Offline"}
            className={online ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}
          />
          <HealthPill
            icon={<FiBatteryCharging size={12} />}
            label={`${batteryLevel}%`}
            className="text-slate-700 bg-slate-100"
          />
          <HealthPill icon={<FiWifi size={12} />} label={networkStrength} className={healthNetworkTone} />
          <div className="ml-1 min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-right">
            <p className="truncate text-[12px] font-semibold text-slate-900">{name || "Team Member"}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.08em] text-slate-500">{role || "Cashier"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const HealthPill = ({ icon, label, className }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${className}`}>
    {icon}
    <span className="max-w-16 truncate">{label}</span>
  </span>
);

export default Header;
