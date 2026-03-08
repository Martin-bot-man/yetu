import React, { useEffect } from "react";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#f3f4f6] pb-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-6 py-6 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-4">
              <BackButton />
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Menu</h1>
            </div>
            <div className="flex items-center gap-3">
              <MdRestaurantMenu className="text-3xl text-slate-700" />
              <div className="flex flex-col items-start">
                <h1 className="text-[15px] font-semibold tracking-wide text-slate-900">
                  {customerData.customerName || "Walk-in Guest"}
                </h1>
                <p className="text-sm text-slate-500">Table: {customerData.table?.tableNo || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <MenuContainer />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <CustomerInfo />
          <hr className="border-slate-200" />
          <CartInfo />
          <hr className="border-slate-200" />
          <Bill />
        </div>
      </div>
    </section>
  );
};

export default Menu;
