import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  CheckCircle2,
  CircleDot,
  Calendar,
  ChevronDown,
  HelpCircle,
  Terminal,
  Layers,
} from "lucide-react";

const ROADMAP_DATA = [
  {
    quarter: "Q1 2025",
    title: "Proxy Core Initialization",
    status: "COMPLETED",
    desc: "Deployed EIP-2535 diamond proxy framework binding initial fallback routine modules.",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
  },
  {
    quarter: "Q2 2025",
    title: "Aave Pool Synchronization",
    status: "COMPLETED",
    desc: "Integrated baseline liquidity mappings directly into battle-tested pool wrappers.",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
  },
  {
    quarter: "Q3 2025",
    title: "Sandboxed Simulations",
    status: "COMPLETED",
    desc: "Compiling client-side dApp interfaces alongside real-time oracle price feed models.",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
  },
  {
    quarter: "Q4 2025",
    title: "Multi-Asset Margin Expansion",
    status: "ACTIVE",
    desc: "Expanding system collateral thresholds to isolate non-correlated stablecoins.",
    icon: CircleDot,
    iconClass: "text-blue-500 animate-pulse",
  },
  {
    quarter: "Q1 2026",
    title: "Governance DAO Formation",
    status: "UPCOMING",
    desc: "Deploying stateful veToken vote-escrow tracking models for risk configurations.",
    icon: Calendar,
    iconClass: "text-gray-500",
  },
];

const FAQ_DATA = [
  {
    q: "What triggers automatic position liquidation parameters?",
    a: "When your localized margin health score slides below 1.0x, the position enters liquidatable state. External liquidators settle up to 50% of your outstanding asset debt debt directly against the underlying protocol smart contracts, acquiring collateral at an implicit discounted rate to insulate the pool.",
    cat: "RISK",
  },
  {
    q: "How are flash transactions processed in a single block cycle?",
    a: "Flash operations require zero upfront capital backing but rely on absolute atomicity. Debt drawing and settlement loops must complete execution vectors entirely within a single block boundary. Any routine failure instantly forces an automated state rollback.",
    cat: "EXECUTION",
  },
  {
    q: "Where is the underlying asset collateral custody maintained?",
    a: "All liquidity positions remain entirely non-custodial, locked inside transparent, audited multi-facet smart contracts synced directly to Aave v3 infrastructure pools. Asset upgrade loops are governed via rigid structural proxy controls.",
    cat: "SECURITY",
  },
  {
    q: "What limit constraints does diamond contract mapping fix?",
    a: "By tracking decoupled contract logic modules under an EIP-2535 multi-facet directory, the application completely bypasses the standard Ethereum 24KB bytecode size cap. Features can be upgraded individually without risking memory slot overrides.",
    cat: "ARCHITECTURE",
  },
];

function RoadmapFAQ() {
  const { isDarkMode } = useDarkMode();
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section
      className={`py-24 relative border-b tracking-tight ${
        isDarkMode
          ? "bg-[#090A0F] text-white border-white/5"
          : "bg-[#FAFAFC] text-gray-950 border-black/5"
      }`}
    >
      {/* Structural Minimal Mesh Line Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Production Logs & Diagnostic Matrix ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              System Registry Documentation
            </h2>
          </div>
          <p
            className={`text-sm font-mono max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Review verified block-by-block engineering development milestones on
            the left, alongside critical system margin parameter definitions on
            the right.
          </p>
        </div>

        {/* Cohesive Dual-Panel Grid Layout */}
        <div className="grid lg:grid-cols-[450px_1fr] gap-16 items-start">
          {/* LEFT COLUMN: Production Log (Roadmap) */}
          <div className="space-y-8">
            <div className="p-4 border-b border-white/5 font-mono text-[10px] uppercase text-gray-400 tracking-widest font-bold flex items-center gap-2">
              <Layers size={14} className="text-blue-500" />
              <span>Development Lifecycle Ledger</span>
            </div>

            <div className="relative border-l border-white/5 ml-4 pl-6 space-y-10 font-mono">
              {ROADMAP_DATA.map((milestone, idx) => {
                const StatusIcon = milestone.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative"
                  >
                    {/* Node Placement Anchor Point */}
                    <div className="absolute -left-7.75 top-1 bg-[#090A0F] p-0.5 rounded-full z-10">
                      <StatusIcon size={14} className={milestone.iconClass} />
                    </div>

                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <span className="text-xs font-bold text-blue-500">
                        {milestone.quarter}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          milestone.status === "COMPLETED"
                            ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                            : milestone.status === "ACTIVE"
                              ? "text-blue-400 bg-blue-500/5 border-blue-500/20"
                              : "text-gray-500 bg-white/5 border-white/5"
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold tracking-tight uppercase text-gray-300">
                      {milestone.title}
                    </h4>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                    >
                      {milestone.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Parametric FAQ Accordion System */}
          <div className="space-y-8">
            <div className="p-4 border-b border-white/5 font-mono text-[10px] uppercase text-gray-400 tracking-widest font-bold flex items-center gap-2">
              <HelpCircle size={14} className="text-blue-500" />
              <span>Risk Parameter Definitions & Query Node</span>
            </div>

            <div
              className={`border rounded-xl divide-y ${
                isDarkMode
                  ? "bg-[#0F111A] border-white/5 divide-white/5"
                  : "bg-white border-black/5 divide-black/5 shadow-sm"
              }`}
            >
              {FAQ_DATA.map((faq, index) => {
                const IsOpen = openFAQ === index;

                return (
                  <div
                    key={index}
                    className="overflow-hidden transition-colors duration-300"
                  >
                    <button
                      onClick={() => setOpenFAQ(IsOpen ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left gap-4 font-mono group"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                            isDarkMode
                              ? "bg-white/5 border-white/5 text-gray-400"
                              : "bg-black/5 border-black/5 text-gray-500"
                          }`}
                        >
                          {faq.cat}
                        </span>
                        <h4
                          className={`text-xs font-bold uppercase tracking-tight transition-colors ${
                            IsOpen
                              ? "text-blue-500"
                              : isDarkMode
                                ? "text-gray-300 group-hover:text-white"
                                : "text-gray-800 group-hover:text-black"
                          }`}
                        >
                          {faq.q}
                        </h4>
                      </div>
                      <motion.div
                        animate={{ rotate: IsOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 shrink-0"
                      >
                        <ChevronDown size={14} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {IsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div
                            className={`p-5 pt-0 text-xs leading-relaxed font-mono relative overflow-hidden ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {/* Decorative Technical Terminal Background inside Expanded Content */}
                            <div className="absolute right-4 bottom-2 opacity-[0.015] pointer-events-none">
                              <Terminal size={64} />
                            </div>

                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoadmapFAQ;
