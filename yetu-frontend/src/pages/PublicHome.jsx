import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiClock,
  FiChevronDown,
  FiCpu,
  FiLayers,
  FiShield,
} from "react-icons/fi";
import restaurantImage from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";

const navItems = [
  { label: "Solutions", target: "solutions" },
  { label: "Pricing", target: "pricing" },
  { label: "Integrations", target: "integrations" },
  { label: "Resources", target: "resources" },
  { label: "Contact", target: "contact" },
];
const pageLinks = [
  { label: "Home", path: "/" },
  { label: "Kenya", path: "/kenya" },
  { label: "Ops", path: "/ops" },
  { label: "Orders", path: "/orders" },
  { label: "Tables", path: "/tables" },
  { label: "Menu", path: "/menu" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Inventory", path: "/inventory" },
  { label: "Auth", path: "/auth" },
];

const heroBullets = [
  "Capture dine-in, pickup, and delivery orders in one workflow.",
  "Track margin and inventory in real time to reduce waste.",
  "Scale from one outlet to multi-location operations with ease.",
  "Equip teams with fast checkout and kitchen-ready ticketing.",
];

const trustLogos = ["Hertford House", "Laguna", "Honey & Smoke", "Wayford Bridge", "Pasta District", "West Bay Grill"];

const featureSections = [
  {
    title: "Connect front-of-house and kitchen without friction",
    text:
      "Sync waiter devices, counter terminals, and kitchen displays so every order reaches the right station instantly.",
    bullets: [
      "Reduce ticket errors with centralized order routing.",
      "Prioritize prep by course, table, and timing.",
      "Track order progress live for faster service recovery.",
      "Keep teams aligned during peak hours.",
    ],
    imageLeft: false,
    accent: "from-[#eef4ff] to-[#dbe9ff]",
  },
  {
    title: "Sell smarter with integrated order channels",
    text:
      "Bring in-store, delivery platforms, and direct online orders into one queue, with consistent menus and pricing.",
    bullets: [
      "Auto-sync menu updates across channels.",
      "Route delivery orders by zone and prep load.",
      "Control peak-hour availability in one place.",
      "Improve guest retention with order history and loyalty.",
    ],
    imageLeft: true,
    accent: "from-[#fff4ed] to-[#ffe7d8]",
  },
  {
    title: "Control stock and purchasing before profit leaks",
    text:
      "Automate low-stock alerts, monitor item-level consumption, and plan purchasing based on demand trends.",
    bullets: [
      "Track ingredient usage down to recipe level.",
      "Set reorder triggers by supplier lead times.",
      "Prevent stockouts with branch-level visibility.",
      "Audit variance and waste by shift.",
    ],
    imageLeft: false,
    accent: "from-[#eefbf3] to-[#daf4e6]",
  },
];

const hardwareCards = [
  {
    title: "Caller ID",
    text: "Identify repeat guests instantly and personalize service before they speak.",
    icon: FiCpu,
  },
  {
    title: "Kitchen Display",
    text: "Push orders to kitchen stations in real time and improve prep coordination.",
    icon: FiLayers,
  },
  {
    title: "Staff Access Cards",
    text: "Secure sign-in for cashiers and service teams with quick shift handover.",
    icon: FiShield,
  },
];

const faqs = [
  {
    q: "What is a restaurant POS system?",
    a: "It is your operational hub for ordering, billing, table management, payments, and reporting.",
  },
  {
    q: "Can Yetu handle high-volume service periods?",
    a: "Yes. Queue controls, kitchen prioritization, and live status tracking are designed for rush-hour stability.",
  },
  {
    q: "Does it support multiple branches?",
    a: "Yes. You can manage menus, inventory, staff roles, and performance across locations from one account.",
  },
  {
    q: "How does inventory tracking work?",
    a: "Stock is reduced automatically from sales and recipe usage, with reorder alerts and waste monitoring.",
  },
];

const PublicHome = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const countdown = useMemo(() => {
    const now = new Date();
    return {
      d: 0,
      h: (24 - now.getHours()) % 24,
      m: 59 - now.getMinutes(),
      s: 59 - now.getSeconds(),
    };
  }, []);

  const riseIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, ease: "easeOut" },
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#0e2a4d]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="industry-shell flex h-16 items-center justify-between gap-6">
          <button className="text-[42px] font-black tracking-tight text-[#0e2a4d]">YETU</button>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="text-[16px] font-semibold text-[#0e2a4d]/90 hover:text-[#0e2a4d]"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/kenya")}
              className="hidden rounded-md border border-emerald-600 px-3 py-2 text-[14px] font-semibold text-emerald-700 md:block"
            >
              Kenya
            </button>
            <button onClick={() => navigate("/contact-sales")} className="hidden text-[16px] font-semibold md:block">Contact sales</button>
            <button onClick={() => navigate("/auth")} className="rounded-md border border-[#0e2a4d] px-4 py-2 text-[15px] font-semibold">
              Log in
            </button>
            <button onClick={() => navigate("/auth")} className="rounded-md bg-[#165dff] px-4 py-2 text-[15px] font-semibold text-white">
              Get a demo
            </button>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="industry-shell flex items-center gap-2 overflow-x-auto py-2">
            <span className="shrink-0 text-[13px] font-semibold text-slate-500">All pages:</span>
            {pageLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1 text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-[#0c2a52] text-white">
        <div className="industry-shell flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2 text-[14px] font-semibold">
            <FiClock />
            <span>{countdown.d}D : {countdown.h}H : {countdown.m}M : {countdown.s}S</span>
          </div>
          <p className="text-[16px]">Complete restaurant platform from <span className="font-bold">$349</span></p>
          <button className="rounded-md bg-[#165dff] px-5 py-2 text-[15px] font-semibold">Get offer</button>
        </div>
      </section>

      <motion.section id="pricing" {...riseIn} className="industry-shell py-12 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full bg-[#e6eefc] px-3 py-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0e2a4d]">
              Restaurant POS System
            </p>
            <h1 className="mt-4 text-[58px] font-bold leading-[1.03] text-[#0e2a4d]">Run service, sales, and stock on one platform</h1>
            <p className="mt-5 text-[20px] leading-relaxed text-[#224063]">
              Built for modern hospitality teams that need speed at the front desk and control in the back office.
            </p>
            <ul className="mt-6 space-y-3">
              {heroBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[18px] leading-relaxed text-[#1b3658]">
                  <FiCheck className="mt-1 shrink-0 text-[#1157e5]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => navigate("/auth")} className="rounded-md bg-[#165dff] px-7 py-3 text-[17px] font-semibold text-white">
                Get your offer
              </button>
              <button onClick={() => navigate("/contact-sales")} className="rounded-md border border-[#0e2a4d] px-7 py-3 text-[17px] font-semibold text-[#0e2a4d]">
                Talk to sales
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <img src={restaurantImage} alt="Restaurant operations" className="h-[470px] w-full rounded-xl object-cover" />
            <div className="absolute -left-5 top-6 rounded-lg border border-blue-200 bg-white/95 px-3 py-2 shadow">
              <p className="text-[13px] font-semibold text-slate-500">Live Orders</p>
              <p className="text-[22px] font-bold text-[#1157e5]">128</p>
            </div>
            <div className="absolute -right-5 bottom-6 rounded-lg border border-emerald-200 bg-white/95 px-3 py-2 shadow">
              <p className="text-[13px] font-semibold text-slate-500">Avg Prep Time</p>
              <p className="text-[22px] font-bold text-emerald-600">11m</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...riseIn} className="border-y border-slate-200 bg-white">
        <div className="industry-shell py-10 text-center">
          <h2 className="text-[42px] font-semibold">Trusted by 63,000+ business locations worldwide</h2>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustLogos.map((name) => (
              <div key={name} className="flex items-center gap-2 rounded-md border border-slate-200 bg-[#f8fafc] px-3 py-3 text-left text-[14px] font-semibold text-[#26466d]">
                <img src={logo} alt="" className="h-6 w-6 rounded-full border border-slate-200 bg-white p-0.5" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {featureSections.map((feature, idx) => (
        <motion.section
          key={feature.title}
          id={idx === 0 ? "solutions" : idx === 1 ? "integrations" : undefined}
          {...riseIn}
          className="industry-shell py-12 lg:py-14"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className={feature.imageLeft ? "order-1" : "order-2 lg:order-1"}>
              <div className={`relative h-[360px] overflow-hidden rounded-xl bg-gradient-to-br ${feature.accent} p-6`}>
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/45" />
                <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-white/35" />
                <img src={restaurantImage} alt="Feature visual" className="relative h-full w-full rounded-lg object-cover shadow-md" />
              </div>
            </div>
            <div className={feature.imageLeft ? "order-2" : "order-1 lg:order-2"}>
              <h3 className="text-[46px] font-semibold leading-[1.08] text-[#0e2a4d]">{feature.title}</h3>
              <p className="mt-4 text-[20px] leading-relaxed text-[#1f3f64]">{feature.text}</p>
              <ul className="mt-5 space-y-3">
                {feature.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[18px] leading-relaxed text-[#1f3f64]">
                    <FiCheck className="mt-1 shrink-0 text-[#1157e5]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      ))}

      <motion.section {...riseIn} className="border-y border-slate-200 bg-[#eef3fa]">
        <div className="industry-shell py-12">
          <div className="text-center">
            <h3 className="text-[48px] font-semibold text-[#0e2a4d]">Hardware that keeps shifts moving</h3>
            <p className="mx-auto mt-3 max-w-3xl text-[20px] text-[#224063]">Choose the accessories that match your service model and scale as demand grows.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {hardwareCards.map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -4, boxShadow: "0 10px 24px rgba(15,42,77,0.12)" }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex rounded-lg bg-[#e8f0ff] p-3 text-[#1157e5]">
                  <item.icon size={24} />
                </div>
                <h4 className="mt-4 text-[30px] font-semibold text-[#0e2a4d]">{item.title}</h4>
                <p className="mt-2 text-[18px] leading-relaxed text-[#315172]">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="resources" {...riseIn} className="industry-shell py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.25fr]">
          <div>
            <h3 className="text-[50px] font-semibold leading-[1.08]">Frequently asked questions</h3>
            <p className="mt-4 text-[20px] leading-relaxed text-[#1f3f64]">
              Learn how Yetu POS fits your operation, from setup and training to multi-location performance.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const open = idx === openFaq;
              return (
                <div key={faq.q} className="rounded-xl border border-slate-300 bg-white">
                  <button
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[20px] font-semibold text-[#0e2a4d]"
                  >
                    <span>{faq.q}</span>
                    <FiChevronDown className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="px-5 pb-5 text-[18px] leading-relaxed text-[#305174]">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section {...riseIn} className="border-t border-slate-200 bg-white">
        <div className="industry-shell py-14 text-center">
          <h3 className="text-[54px] font-semibold">Take your restaurant business to new heights</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate("/auth")} className="rounded-md bg-[#165dff] px-8 py-3 text-[17px] font-semibold text-white">
              Get your offer
            </button>
            <button onClick={() => navigate("/contact-sales")} className="rounded-md border border-[#0e2a4d] px-8 py-3 text-[17px] font-semibold text-[#0e2a4d]">
              Talk to sales
            </button>
          </div>
        </div>
      </motion.section>

      <footer id="contact" className="bg-[#0c2a52] text-white">
        <div className="industry-shell py-10">
          <div className="rounded-xl bg-[#123862] px-6 py-5 text-center text-[33px] font-semibold">
            Ready to get started? Call <span className="text-[#ff4a93]">0797782614</span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            <FooterCol title="Hospitality" links={["Bar", "Cafe", "Food Truck", "Delivery"]} />
            <FooterCol title="Hardware" links={["POS Kit", "Card Machines", "Caller ID", "Kitchen Display"]} />
            <FooterCol title="Software" links={["Order & Pay", "Inventory", "Analytics", "Integrations"]} />
            <FooterCol title="Company" links={["Pricing", "Support", "Contact Sales", "Login"]} />
          </div>
        </div>
      </footer>
    </main>
  );
};

const FooterCol = ({ title, links }) => (
  <div>
    <p className="text-[20px] font-semibold">{title}</p>
    <ul className="mt-3 space-y-2 text-[16px] text-slate-200">
      {links.map((link) => (
        <li key={link}>{link}</li>
      ))}
    </ul>
  </div>
);

export default PublicHome;
