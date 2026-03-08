import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { addOrder, createOrderRazorpay, updateTable, verifyPaymentRazorpay } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);

  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: () => enqueueSnackbar("Order saved, but table status did not update. Refresh tables.", { variant: "warning" }),
  });

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);
      setTimeout(() => tableUpdateMutation.mutate({ status: "Booked", orderId: data._id, tableId: data.table }), 1500);
      enqueueSnackbar("Order placed.", { variant: "success" });
      setShowInvoice(true);
    },
    onError: () => enqueueSnackbar("Couldn’t place order. Review details and try again.", { variant: "error" }),
  });

  const submitOrder = (paymentData = undefined) => {
    orderMutation.mutate({
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },
      orderStatus: "In Progress",
      bills: { total, tax, totalWithTax: totalPriceWithTax },
      items: cartData,
      table: customerData.table.tableId,
      paymentMethod,
      paymentData,
    });
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Pick a payment method to continue.", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Online") {
      try {
        const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!scriptLoaded) {
          enqueueSnackbar("Payment gateway didn’t load. Check connection and try again.", { variant: "warning" });
          return;
        }

        const { data } = await createOrderRazorpay({ amount: totalPriceWithTax.toFixed(2) });
        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Yetu POS",
          description: "Order Payment",
          order_id: data.order.id,
          handler: async (response) => {
            const verification = await verifyPaymentRazorpay(response);
            enqueueSnackbar(verification.data.message, { variant: "success" });
            setTimeout(() =>
              submitOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              }),
            1500);
          },
          prefill: {
            name: customerData.name,
            contact: customerData.phone,
          },
          theme: { color: "#334155" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch {
        enqueueSnackbar("Payment failed. No charge was recorded.", { variant: "error" });
      }
      return;
    }

    submitOrder();
  };

  return (
    <>
      <div className="mt-2 flex items-center justify-between px-5">
        <p className="mt-2 text-sm font-medium text-slate-500">Items ({cartData.length})</p>
        <h1 className="text-md font-bold text-slate-900">KES {total.toFixed(2)}</h1>
      </div>
      <div className="mt-2 flex items-center justify-between px-5">
        <p className="mt-2 text-sm font-medium text-slate-500">Tax (5.25%)</p>
        <h1 className="text-md font-bold text-slate-900">KES {tax.toFixed(2)}</h1>
      </div>
      <div className="mt-2 flex items-center justify-between px-5">
        <p className="mt-2 text-sm font-medium text-slate-500">Total With Tax</p>
        <h1 className="text-md font-bold text-slate-900">KES {totalPriceWithTax.toFixed(2)}</h1>
      </div>

      <div className="mt-4 flex items-center gap-3 px-5">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`w-full rounded-lg border px-4 py-2.5 text-[15px] font-semibold ${
            paymentMethod === "Cash" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`w-full rounded-lg border px-4 py-2.5 text-[15px] font-semibold ${
            paymentMethod === "Online" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          Online
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 px-5 pb-5">
        <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-[15px] font-semibold text-slate-700">
          Print Receipt
        </button>
        <button onClick={handlePlaceOrder} className="w-full rounded-lg bg-slate-900 px-4 py-3 text-[15px] font-semibold text-white">
          Confirm & Send to Kitchen
        </button>
      </div>

      {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}
    </>
  );
};

export default Bill;
