import React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated.", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => enqueueSnackbar("Couldn’t update order status. Try again.", { variant: "error" }),
  });

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">Couldn’t load orders right now.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Live Order Queue</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[15px] text-slate-800">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment</th>
            </tr>
          </thead>
          <tbody>
            {(resData?.data?.data || []).map((order) => (
              <tr key={order._id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4">#{Math.floor(new Date(order.orderDate).getTime())}</td>
                <td className="p-4">{order?.customerDetails?.name || "Guest"}</td>
                <td className="p-4">
                  <select
                    className={`rounded-md border border-slate-300 bg-white p-2 text-[15px] focus:outline-none ${
                      order.orderStatus === "Ready" ? "text-emerald-700" : "text-amber-700"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) =>
                      orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: e.target.value })
                    }
                  >
                    <option className="text-amber-700" value="In Progress">In Progress</option>
                    <option className="text-emerald-700" value="Ready">Ready</option>
                  </select>
                </td>
                <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                <td className="p-4">{Array.isArray(order?.items) ? order.items.length : 0} Items</td>
                <td className="p-4">Table - {order?.table?.tableNo || "-"}</td>
                <td className="p-4">KES {Number(order?.bills?.totalWithTax || 0).toFixed(2)}</td>
                <td className="p-4 text-center">{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
