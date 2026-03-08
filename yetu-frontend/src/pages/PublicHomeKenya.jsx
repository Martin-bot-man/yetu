import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiChevronDown, FiChevronUp, FiCheck, FiSmartphone, FiPackage, FiTrendingUp } from "react-icons/fi";
import heroImage from "../assets/images/restaurant-img.jpg";
import nyama from "../assets/images/rogan-josh.jpg";
import breakfast from "../assets/images/masala-dosa.jpg";
import cafe from "../assets/images/paneer-tika.webp";
import dessert from "../assets/images/gulab-jamun.webp";

const tabs = ["Restaurants", "Catering", "Venues"];
const navItems = [
  { label: "Solutions", target: "solutions" },
  { label: "Pricing", target: "pricing" },
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

const kenyaCuisines = [
  { name: "Nyama Choma", image: nyama },
  { name: "Swahili", image: breakfast },
  { name: "Chapati & Stew", image: cafe },
  { name: "Fast Food", image: nyama },
  { name: "Coffee & Tea", image: cafe },
  { name: "Desserts", image: dessert },
];

const cityClusters = [
  ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  ["Thika", "Machakos", "Naivasha", "Nyeri", "Meru"],
  ["Kakamega", "Malindi", "Nanyuki", "Kericho", "Embu"],
];

const benefits = [
  "Accept M-Pesa, cash, and card payments from one till.",
  "Track stock, wastage, and daily margin by branch.",
  "Manage dine-in, delivery, and pickup in one queue.",
  "Scale from one location to multi-branch operations.",
];

const faqs = [
  {
    q: "Do you support M-Pesa?",
    a: "Yes. Yetu supports M-Pesa workflows alongside card and cash settlement.",
  },
  {
    q: "Can I run multiple branches in Kenya?",
    a: "Yes. You can monitor menus, inventory, and team performance across all branches.",
  },
  {
    q: "How fast can we onboard?",
    a: "Most teams are trained and operational within a few days depending on branch count.",
  },
  {
    q: "Do you offer local support?",
    a: "Yes. Setup and support are available with a Kenya-focused operations team.",
  },
];

const PublicHomeKenya = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Restaurants");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const visibleCuisines = useMemo(
    () => (showAll ? kenyaCuisines : kenyaCuisines.slice(0, 5)),
    [showAll]
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#142237]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="industry-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-[42px] font-black tracking-tight text-[#ff5a1f]">
              YETU
            </button>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[12px] font-semibold text-emerald-700">KENYA</span>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="text-[15px] font-semibold text-slate-700 hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="hidden text-[15px] font-semibold text-slate-700 md:block">
              Global site
            </button>
            <button onClick={() => navigate("/auth")} className="rounded-md border border-slate-300 px-4 py-2 text-[15px] font-semibold">
              Sign in
            </button>
            <button onClick={() => navigate("/auth")} className="rounded-md bg-blue-700 px-4 py-2 text-[15px] font-semibold text-white">
              Request demo
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

      <section id="pricing" className="border-b border-slate-200 bg-white">
        <div className="industry-shell grid grid-cols-1 gap-8 py-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-[56px] font-bold leading-[1.03] text-slate-900">Built for Kenya restaurants that move fast</h1>
            <p className="mt-4 text-[20px] leading-relaxed text-slate-600">
              Run service, payments, and stock control from one POS built for local operations.
            </p>
            <ul className="mt-5 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[18px] text-slate-700">
                  <FiCheck className="mt-1 shrink-0 text-blue-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => navigate("/auth")} className="rounded-md bg-blue-700 px-6 py-3 text-[16px] font-semibold text-white">
                Get started
              </button>
              <button className="rounded-md border border-slate-300 px-6 py-3 text-[16px] font-semibold text-slate-700">
                Call 0797782614
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <img src={heroImage} alt="Kenya restaurant operations" className="h-[430px] w-full rounded-xl object-cover" />
            <div className="absolute -left-4 top-6 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow">
              <p className="text-[12px] font-semibold text-slate-500">Daily Sales</p>
              <p className="text-[22px] font-bold text-slate-900">KES 128,420</p>
            </div>
            <div className="absolute -right-4 bottom-6 rounded-lg border border-emerald-200 bg-white px-3 py-2 shadow">
              <p className="text-[12px] font-semibold text-slate-500">Orders</p>
              <p className="text-[22px] font-bold text-emerald-600">312 Today</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eceff4] pb-8 pt-8">
        <div className="industry-shell">
          <div className="mx-auto flex w-fit rounded-full bg-white p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2 text-[16px] font-semibold transition ${
                  activeTab === tab ? "bg-slate-900 text-white" : "text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-5 flex max-w-2xl items-center rounded-full border border-slate-300 bg-white px-4 py-3">
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-3 text-[17px] outline-none"
              placeholder="Search city or area in Kenya"
            />
            <FiMapPin className="text-slate-500" />
          </div>

          <h2 className="mt-8 text-[34px] font-semibold text-slate-900">Popular near you</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {visibleCuisines.map((item) => (
              <article key={item.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="h-28 w-full object-cover" />
                <p className="px-3 py-2 text-[16px] font-semibold text-slate-800">{item.name}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 text-[16px] font-semibold text-blue-700"
            >
              {showAll ? "Show less" : "Show more"}
              {showAll ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>
      </section>

      <section id="solutions" className="industry-shell py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-[36px] font-semibold text-slate-900">Explore Kenyan growth markets</h3>
          <p className="mt-2 text-[18px] text-slate-600">Find demand hotspots for expansion, cloud kitchens, and catering opportunities.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {cityClusters.map((col, idx) => (
              <div key={idx} className="space-y-3">
                {col.map((city) => (
                  <button key={city} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-[18px] font-semibold text-slate-800 hover:bg-slate-50">
                    {city}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9eef6] py-10">
        <div className="industry-shell grid grid-cols-1 gap-5 md:grid-cols-3">
          <InfoCard icon={FiSmartphone} title="M-Pesa Ready" text="Take mobile money payments with reconciliation built into daily close." />
          <InfoCard icon={FiPackage} title="Stock Control" text="Track ingredient usage and reorder levels across branches." />
          <InfoCard icon={FiTrendingUp} title="Profit Insights" text="See your top sellers, peak periods, and margin trends in real time." />
        </div>
      </section>

      <section id="resources" className="industry-shell py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.3fr]">
          <div>
            <h3 className="text-[44px] font-semibold leading-[1.06] text-slate-900">Frequently asked questions</h3>
            <p className="mt-3 text-[18px] text-slate-600">Everything you need to launch and scale in Kenya.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const open = idx === openFaq;
              return (
                <div key={faq.q} className="rounded-xl border border-slate-300 bg-white">
                  <button onClick={() => setOpenFaq(open ? -1 : idx)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <span className="text-[20px] font-semibold text-slate-900">{faq.q}</span>
                    {open ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {open && <p className="px-5 pb-5 text-[17px] leading-relaxed text-slate-600">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#0f2743] text-white">
        <div className="industry-shell py-10">
          <div className="rounded-xl bg-[#163659] px-6 py-5 text-center text-[30px] font-semibold">
            Kenya onboarding line: <span className="text-[#ff8a3d]">0797782614</span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
            <FooterCol title="Products" links={["POS", "Online Ordering", "Kitchen Display", "Inventory"]} />
            <FooterCol title="Kenya Markets" links={["Nairobi", "Mombasa", "Kisumu", "Nakuru"]} />
            <FooterCol title="Resources" links={["Pricing", "Guides", "Support", "Training"]} />
            <FooterCol title="Company" links={["About", "Contact", "Careers", "Partners"]} />
          </div>
        </div>
      </footer>
    </main>
  );
};

const InfoCard = ({ icon: Icon, title, text }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-700">
      <Icon size={20} />
    </div>
    <h4 className="mt-3 text-[26px] font-semibold text-slate-900">{title}</h4>
    <p className="mt-2 text-[17px] leading-relaxed text-slate-600">{text}</p>
  </article>
);

const FooterCol = ({ title, links }) => (
  <div>
    <p className="text-[20px] font-semibold">{title}</p>
    <ul className="mt-3 space-y-2 text-[16px] text-slate-200">
      {links.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export default PublicHomeKenya;
