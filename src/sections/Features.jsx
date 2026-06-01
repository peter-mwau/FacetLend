import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  Layers,
  Zap,
  GitMerge,
  Radio,
  ChevronRight,
  Terminal,
} from "lucide-react";

const FEATURES = [
  {
    id: "diamond",
    title: "Diamond Architecture",
    eipStandard: "EIP-2535 MULTI-FACET PROXY",
    icon: Layers,
    description:
      "Modular facet-based layout for infinite, sizing-limit-free logic contract upgradability.",
    longDesc:
      "Unlike traditional static or basic proxy wrappers, Diamond Architecture lets you add, swap, or clear functions across separated structural facets at runtime. This bypasses the EVM contract size threshold while maintaining unified state memory.",
    benefits: [
      "No maximum contract bytecode limitations",
      "Isolated upgrades mapped per modular proxy facet",
      "Immutable structural storage layout alignment",
      "Gas-optimized fallback delegatecall execution",
    ],
    stats: [
      { label: "FACETS_ACTIVE", value: "04", unit: "" },
      { label: "METHOD_CAP", value: "∞", unit: " FUNC" },
      { label: "GAS_DELEGATION", value: "-30", unit: "%" },
    ],
  },
  {
    id: "flashloan",
    title: "Flash Capital Routing",
    eipStandard: "ATOMIC UNCOLLATERALIZED LOANS",
    icon: Zap,
    description:
      "Instant single-block capital blocks deployed with strict atomic settlement checks.",
    longDesc:
      "Draw arbitrary amounts of asset liquidity from internal protocol vaults without upfront security commitments. Executed routines must settle balance obligations entirely inside the scope of a single block, or the runtime triggers a rollback.",
    benefits: [
      "Zero upfront capital backing parameters required",
      "Atomic transactional validation constraints",
      "Dynamic routing scaling directly to pool caps",
      "Minimal protocol fee when balances break even",
    ],
    stats: [
      { label: "MAX_DRAWDOWN", value: "UNLIMIT", unit: "" },
      { label: "PRE_SET_FEE", value: "0.09", unit: "%" },
      { label: "EXECUTION_TIME", value: "< 1", unit: " BLK" },
    ],
  },
  {
    id: "aave",
    title: "Aave Core Integration",
    eipStandard: "AUTOMATED CAPITAL OPTIMIZATION",
    icon: GitMerge,
    description:
      "Continuous synchronization maps with deep external baseline money markets.",
    longDesc:
      "Idle collateral allocations drop dynamically into secondary liquidity networks. Deposits continuously generate wrapped yielding positions, optimizing system-wide capital efficiency ratios.",
    benefits: [
      "Natively tapped into global deep liquidity networks",
      "Algorithmic rate matching matrices",
      "Block-by-block streaming interest accumulations",
      "Core isolation mode safety parameters",
    ],
    stats: [
      { label: "TARGET_TVL_ACC", value: "12.5", unit: "B" },
      { label: "MARKET_ROUTES", value: "15", unit: "+" },
      { label: "BASE_YIELD_AVG", value: "3.50", unit: "%" },
    ],
  },
  {
    id: "oracle",
    title: "APS TWAP Oracle Network",
    eipStandard: "MANIPULATION-RESISTANT PRICE FEEDS",
    icon: Radio,
    description:
      "Decentralized on-chain calculation loops tracking state verification points.",
    longDesc:
      "Secures internal health factor calculations using time-weighted average price data sourced directly from AMM pairs. High-frequency tracking suppresses sudden spot variations.",
    benefits: [
      "Continuous geometric on-chain price accumulation",
      "High resilience against spot-market manipulation",
      "Integrated validation checks preventing flash crashes",
      "Deterministic data resolution via cryptographic nodes",
    ],
    stats: [
      { label: "POLLING_INTERVAL", value: "30", unit: " SEC" },
      { label: "MAX_DEVIATION", value: "< 1.0", unit: "%" },
      { label: "DECENTRALIZED", value: "TRUE", unit: "" },
    ],
  },
];

function FeaturesDeepDive() {
  const { isDarkMode } = useDarkMode();
  const [activeFeature, setActiveFeature] = useState(0);

  const currentFeature = FEATURES[activeFeature];
  const MainIcon = currentFeature.icon;

  return (
    <section
      id="features"
      className={`py-24 relative border-b tracking-tight ${
        isDarkMode
          ? "bg-[#090A0F] text-white border-white/5"
          : "bg-[#FAFAFC] text-gray-950 border-black/5"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Core Engineering Dossier ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Protocol Specifications
            </h2>
          </div>
          <p
            className={`text-sm font-mono max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Deep technical diagnostic overview mapping out contract execution
            paths, structural immutability, and risk control mechanics.
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-stretch">
          <div className="flex flex-col gap-3">
            {FEATURES.map((feature, idx) => {
              const IsSelected = activeFeature === idx;
              const TabIcon = feature.icon;

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(idx)}
                  className={`w-full text-left p-5 border rounded-xl relative overflow-hidden transition-all duration-300 group ${
                    IsSelected
                      ? isDarkMode
                        ? "bg-[#0F111A] border-blue-500/40"
                        : "bg-white border-blue-500/40"
                      : isDarkMode
                        ? "bg-[#0F111A]/40 border-white/5 opacity-60 hover:opacity-100"
                        : "bg-white border-black/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg border ${
                          IsSelected
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                            : isDarkMode
                              ? "bg-white/5 border-white/5 text-gray-400"
                              : "bg-black/5 border-black/5 text-gray-500"
                        }`}
                      >
                        <TabIcon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-gray-500 block mb-0.5">
                          {feature.eipStandard}
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-tight">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-gray-500 group-hover:translate-x-1 transition-transform ${IsSelected ? "text-blue-500" : ""}`}
                    />
                  </div>

                  {IsSelected && (
                    <motion.div
                      layoutId="active-selector-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className={`p-8 rounded-xl border h-full grid md:grid-cols-[1fr_300px] gap-8 relative overflow-hidden ${
                  isDarkMode
                    ? "bg-[#0F111A] border-white/5"
                    : "bg-white border-black/5 shadow-sm"
                }`}
              >
                <div className="absolute right-4 bottom-4 opacity-[0.015] pointer-events-none">
                  <Terminal size={220} />
                </div>

                <div className="space-y-6 relative z-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 border-b border-white/5 pb-3 uppercase tracking-wider font-bold">
                      <MainIcon size={14} strokeWidth={1.5} />
                      <span>{currentFeature.eipStandard}</span>
                    </div>

                    <h3 className="font-serif text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-current to-gray-500">
                      {currentFeature.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {currentFeature.longDesc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold mb-2">Key Benefits</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      {currentFeature.benefits.map((b, i) => (
                        <li
                          key={i}
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={`p-6 border rounded-xl flex flex-col justify-between min-h-62.5 font-mono relative z-10 ${isDarkMode ? "bg-white/1 border-white/5" : "bg-black/1 border-black/5"}`}
                >
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                      Parametric Telemetry
                    </div>
                    <div className="space-y-3">
                      {currentFeature.stats.map((s, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <span className="text-xs text-gray-400">
                            {s.label}
                          </span>
                          <span className="font-bold">
                            {s.value}
                            {s.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full mt-6 py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${isDarkMode ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40" : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"}`}
                  >
                    Verify Logic Spec →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesDeepDive;
