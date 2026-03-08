import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlignJustify,
  FiSearch,
  FiUser,
  FiMessageSquare,
  FiArrowUpRight,
  FiSliders,
  FiGrid,
  FiShield,
  FiCpu,
  FiLayers,
  FiCheckSquare,
} from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#191919]">
      <header className="border-b border-[#d8dadd] bg-white">
        <div className="industry-shell flex h-[64px] items-center gap-3">
          <button className="rounded-md p-2 text-[#242424] transition hover:bg-[#f1f3f6]">
            <FiAlignJustify size={18} />
          </button>

          <div className="text-[44px] leading-none font-black tracking-tight text-[#d0342c]">YETU</div>

          <div className="ml-3 hidden flex-1 items-center md:flex">
            <div className="flex w-full max-w-[640px] items-center gap-2 rounded-md border border-[#cfd3d8] bg-[#fafafa] px-3 py-2">
              <FiSearch className="text-[#4b5563]" />
              <input
                placeholder="Search"
                className="w-full bg-transparent text-[16px] text-[#222] outline-none placeholder:text-[#6b7280]"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="rounded-md p-2 text-[#242424] transition hover:bg-[#f1f3f6]">
              <FiUser size={20} />
            </button>
            <button className="rounded-md p-2 text-[#242424] transition hover:bg-[#f1f3f6]">
              <FiMessageSquare size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-[#d8dadd] bg-[linear-gradient(120deg,#ffffff_0%,#ffffff_70%,#f2f5f7_100%)]">
        <div className="industry-shell py-8">
          <h1 className="text-[56px] font-light tracking-tight text-[#161616]">Yetu Industries</h1>
          <p className="mt-3 max-w-3xl text-[18px] leading-relaxed text-[#3b3e45]">
            Build, run, and grow your restaurant business from top to bottom with modular cloud operations.
            Deploy practical workflows for service, billing, and inventory on secure, scalable infrastructure.
          </p>
        </div>
      </section>

      <nav className="border-b border-[#d8dadd] bg-white">
        <div className="industry-shell flex gap-8 overflow-x-auto py-3 text-[16px] text-[#343a40]">
          <button className="whitespace-nowrap border-b-2 border-transparent pb-2 transition hover:border-[#c6cbd2]">
            Customer Successes
          </button>
          <button className="whitespace-nowrap border-b-2 border-transparent pb-2 transition hover:border-[#c6cbd2]">
            Find your industry
          </button>
          <button className="whitespace-nowrap border-b-2 border-transparent pb-2 transition hover:border-[#c6cbd2]">
            Industry Labs
          </button>
        </div>
      </nav>

      <section className="industry-shell py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-[52px] font-light tracking-tight text-[#191919]">Why Yetu Industries?</h2>
            <p className="mt-3 max-w-3xl text-[18px] leading-relaxed text-[#40454d]">
              Yetu applications and embedded services are designed for organizations that need operational control
              during high-demand periods. Solve critical business challenges with flexible industry modules and
              integrated workflows.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              <ValueItem icon={<FiSliders />} text="Modernize your tech stack with industry-specific applications." />
              <ValueItem icon={<FiCpu />} text="Get more out of AI with industry-specific features." />
              <ValueItem icon={<FiGrid />} text="Select from a broad range of features to address short- and long-term business challenges." />
              <ValueItem icon={<FiShield />} text="Address industry security and other regulatory requirements." />
              <ValueItem icon={<FiLayers />} text="Expand and adapt as needed with modular capabilities." />
              <ValueItem icon={<FiCheckSquare />} text="Simplify and integrate business processes end to end." />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-md border border-[#cfd3d8] bg-[#232a31] text-white shadow-sm">
              <div className="h-[180px] bg-[linear-gradient(120deg,#39434d_0%,#1f2730_100%)] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c6d0db]">Yetu Playbook</p>
                <h3 className="mt-2 text-[24px] font-semibold">Industry Operations Playbooks</h3>
              </div>
              <div className="p-5">
                <p className="text-[16px] leading-relaxed text-[#d8e1ea]">
                  Find comprehensive standards, strategies, and tools to accelerate and optimize operations.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-[#111827]"
                >
                  Explore Yetu Playbooks <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const ValueItem = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 text-[#5b636f]">{icon}</span>
    <p className="text-[20px] leading-tight text-[#171a1f]">{text}</p>
  </div>
);

export default Home;
