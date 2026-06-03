import { motion } from "framer-motion";
import { useDarkMode } from "../hooks/useDarkMode";
import { useState } from "react";
import {
  ArrowUpRight,
  Cpu,
  Zap,
  Layers,
  Activity,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function HeroSection() {
  const { isDarkMode } = useDarkMode();
  const [isHovered, setIsHovered] = useState(false);

  const stats = [
    {
      label: "Total Value Locked",
      value: "$42.8M",
      change: "+12.4%",
      status: "UP",
    },
    {
      label: "Active Pool Loans",
      value: "$12.1M",
      change: "Healthy",
      status: "STABLE",
    },
    {
      label: "Protocol APY Range",
      value: "4.2% – 18.6%",
      change: "Variable",
      status: "LIVE",
    },
  ];

  const features = [
    {
      icon: Layers,
      title: "Diamond Architecture",
      desc: "EIP-2535 modular multi-facet proxy implementation for secure, hot-upgradable logic.",
    },
    {
      icon: Zap,
      title: "Flash Liquidity",
      desc: "Atomic uncollateralized lending execution routing natively through custom pool routers.",
    },
    {
      icon: Cpu,
      title: "Aave v3 Core Routing",
      desc: "Algorithmic yield optimization mapping idle capital into secondary money markets automatically.",
    },
    {
      icon: Activity,
      title: "APS Oracle System",
      desc: "Multi-venue decentralized price feeds preventing artificial liquidations during flash crashes.",
    },
  ];

  return (
    <div
      id="hero"
      className={`relative min-h-screen font-sans antialiased selection:bg-blue-500/30 ${
        isDarkMode ? "bg-[#090A0F] text-white" : "bg-[#FAFAFC] text-gray-950"
      }`}
    >
      <Navbar />
      {/* Structural Low-Contrast Technical Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 opacity-[0.015] ${isDarkMode ? "invert-0" : "invert"}`}
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Simple crisp horizontal line accents replacing glowing orbs */}
        <div
          className={`absolute top-24 left-0 right-0 h-px ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
        />
        <div
          className={`absolute bottom-40 left-0 right-0 h-px ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
        />
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        {/* Top Operational Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10 font-mono text-[11px] tracking-wider uppercase"
        >
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            DIAMOND_PROTOCOL_V1 // MAINNET ONLINE
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${isDarkMode ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"}`}
          >
            SEPOLIA TESTNET
          </span>
        </motion.div>

        {/* Asymmetric Asymmetrical Hero Core */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start mb-24">
          {/* Left Column: Clear Text & Hard CTAs */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Modular Lending. <br />
              <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>
                Programmable Liquidity.
              </span>
            </h1>

            <p
              className={`text-base md:text-lg max-w-xl leading-relaxed mb-10 font-mono text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Execute flash loans, optimize yields across automated markets, and
              monitor structural health ratios via audited EIP-2535 multi-facet
              architecture.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`px-6 py-3.5 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-3 transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Link to={"/mainpage"}>Launch App Console</Link>
                <motion.span
                  animate={{ x: isHovered ? 3 : 0, y: isHovered ? -3 : 0 }}
                >
                  <ArrowUpRight size={16} />
                </motion.span>
              </motion.button>

              <button
                className={`px-6 py-3.5 text-sm font-semibold rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-white/10 text-white hover:bg-white/5"
                    : "border-black/10 text-gray-900 hover:bg-black/5"
                }`}
              >
                Read Protocol Spec
              </button>
            </div>
          </div>

          {/* Right Column: Flat Technical Security Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-xl border ${
              isDarkMode
                ? "bg-[#0F111A] border-white/5"
                : "bg-white border-black/5 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 mb-4 font-mono text-[10px] uppercase text-gray-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Cryptographic Security Registry</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Smart Contract Audits</span>
                <span className="text-emerald-500 font-bold">
                  ConsenSys / Halborn
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Multi-Sig Control</span>
                <span>3-of-5 Gnosis Safe</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Upgrade Timelock</span>
                <span>48 Hours Execution</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Protocol Analytics Block */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 border-t border-b ${isDarkMode ? "border-white/5 bg-white/[0.01]" : "border-black/5 bg-black/[0.005]"}`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-6 flex flex-col justify-between min-h-[120px] ${
                i > 0
                  ? isDarkMode
                    ? "md:border-l border-white/5"
                    : "md:border-l border-black/5"
                  : ""
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-bold font-mono tracking-tight">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] text-emerald-500 font-bold">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modular Feature Directory Map */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-20">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`p-6 border rounded-xl transition-all ${
                  isDarkMode
                    ? "bg-[#0F111A] border-white/5 hover:border-blue-500/30"
                    : "bg-white border-black/5 shadow-sm hover:border-blue-500/30"
                }`}
              >
                <div
                  className={`p-2 rounded-lg inline-block mb-4 ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
                >
                  <Icon size={18} strokeWidth={1.5} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
