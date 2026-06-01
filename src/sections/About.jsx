import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Terminal,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Supply Assets",
    description:
      "Deposit ETH, USDC, or native protocol facets directly into audited liquidity pools.",
    details:
      "Capital allocations bypass intermediate proxies, routing natively to baseline yield curves. Assets automatically serve as margin collateral, accumulating compounded block-by-block APY parameters.",
    icon: ArrowDownLeft,
    metricLabel: "Current Pool APY",
    metricValue: "Up to 14.2%",
    action: "Authorize Liquidity",
  },
  {
    number: "02",
    title: "Borrow Margin",
    description:
      "Mint dynamic liquidity debt using your supplied assets as the baseline valuation.",
    details:
      "Borrow ratios operate underneath EIP-2535 diamond facet configurations. Interest rates calibrate natively using stateful pool utilization tracking matrices rather than third-party dependencies.",
    icon: ArrowUpRight,
    metricLabel: "Utilization Cap",
    metricValue: "85.0% Max LTV",
    action: "Draw Capital",
  },
  {
    number: "03",
    title: "Risk Monitoring",
    description:
      "Track systemic position thresholds in real-time to mitigate liquidation vulnerability.",
    details:
      "Positions maintaining an asset health score greater than 1.5x are certified stable. Scores slipping below 1.0x activate structural liquidation parameters to insulate core liquidity pools.",
    icon: ShieldAlert,
    metricLabel: "Liquidation Point",
    metricValue: "Score < 1.0x",
    action: "Inspect Health Score",
  },
  {
    number: "04",
    title: "Atomic Flash Execution",
    description:
      "Deploy single-block zero-collateral capital blocks using stateful routers.",
    details:
      "Flash executions process atomically. Loans missing self-repayment assertions within the bounds of a individual block cycle trigger safe state rollbacks, preventing global contract losses.",
    icon: Zap,
    metricLabel: "Single Block Fee",
    metricValue: "0.09% Flat Rate",
    action: "Test Flash Route",
  },
];

function HowItWorks() {
  const { isDarkMode } = useDarkMode();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="about"
      className={`py-24 relative overflow-hidden border-b tracking-tight ${
        isDarkMode
          ? "bg-[#090A0F] text-white border-white/5"
          : "bg-[#FAFAFC] text-gray-950 border-black/5"
      }`}
    >
      {/* Structural Minimal Background Accents */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial Sub-Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Lifecycle Architecture ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Operational Pipeline
            </h2>
          </div>
          <p
            className={`text-sm font-mono max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            From collateral allocation to single-block atomic flash lending.
            Follow the structural logic paths below.
          </p>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-stretch">
          {/* LEFT PANEL: Interactive Timeline Map */}
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const IsActive = activeStep === index;
              const StepIcon = step.icon;

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    IsActive
                      ? isDarkMode
                        ? "bg-[#0F111A] border-blue-500/40 shadow-sm"
                        : "bg-white border-blue-500/40 shadow-sm"
                      : isDarkMode
                        ? "bg-[#0F111A]/40 border-white/5 opacity-60 hover:opacity-100"
                        : "bg-white border-black/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-6 justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Technical Line Icon Enclosure */}
                      <div
                        className={`p-2.5 rounded-lg border ${
                          IsActive
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                            : isDarkMode
                              ? "bg-white/5 border-white/5 text-gray-400"
                              : "bg-black/5 border-black/5 text-gray-500"
                        }`}
                      >
                        <StepIcon size={18} strokeWidth={1.5} />
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-gray-500 block mb-0.5">
                          STAGE_{step.number}
                        </span>
                        <h3 className="text-base font-bold uppercase tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p
                      className={`text-xs max-w-sm hidden md:block ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Horizontal Progress bar inside active list tracker */}
                  {IsActive && (
                    <motion.div
                      layoutId="active-border"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT PANEL: Stateful Technical Console Display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`p-6 rounded-xl border h-full flex flex-col justify-between relative overflow-hidden ${
                  isDarkMode
                    ? "bg-[#0F111A] border-white/5"
                    : "bg-white border-black/5 shadow-sm"
                }`}
              >
                {/* Console Watermark Accent */}
                <div className="absolute right-4 bottom-4 opacity-[0.02] pointer-events-none">
                  <Terminal size={140} />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                      [ Registry Data Readout ]
                    </span>
                    <span className="font-mono text-[10px] text-blue-500 font-bold">
                      SYS_OK
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-2xl font-bold tracking-tight mb-3">
                      {STEPS[activeStep].title}
                    </h4>
                    <p
                      className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {STEPS[activeStep].details}
                    </p>
                  </div>

                  {/* Dynamic Parametric Metric Card inside the Console */}
                  <div
                    className={`p-4 border rounded-lg font-mono ${
                      isDarkMode
                        ? "bg-white/[0.02] border-white/5"
                        : "bg-black/[0.02] border-black/5"
                    }`}
                  >
                    <span className="text-[9px] uppercase text-gray-400 block mb-1">
                      {STEPS[activeStep].metricLabel}
                    </span>
                    <span className="text-xl font-bold tracking-tight text-blue-500">
                      {STEPS[activeStep].metricValue}
                    </span>
                  </div>
                </div>

                {/* Firm Structural Action Trigger */}
                <button
                  className={`w-full mt-8 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40"
                      : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {STEPS[activeStep].action} →
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
