import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  Target,
  BarChart3,
  Droplet,
  Sliders,
  ChevronRight,
  Terminal,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const TOOLS = [
  {
    id: "moveprice",
    name: "MovePrice Facet Router",
    icon: Target,
    description: "Simulate price feed updates across active DEX oracle pools.",
    details:
      "Mutate the localized oracle accumulator variables inside a sandboxed instance for TWAP delta testing.",
  },
  {
    id: "simulator",
    name: "LTV Margin Simulator",
    icon: BarChart3,
    description:
      "Model dynamic debt liquidation ratios across varied parameters.",
    details:
      "Adjust collateral and debt to see projected liquidation thresholds and safety margins.",
  },
  {
    id: "faucet",
    name: "Gas & Facet Faucet",
    icon: Droplet,
    description:
      "Request gas tokens and asset allocations for Sepolia deployment.",
    details:
      "Seed test accounts with ERC-20 tokens and Sepolia ETH for local protocol development.",
  },
  {
    id: "debug",
    name: "EIP-2535 Proxy Debugger",
    icon: Sliders,
    description: "Trace fallback delegatecall execution loops.",
    details:
      "Inspect facet selectors and storage slot mappings in an instrumented sandbox.",
  },
];

function DeveloperTools() {
  const { isDarkMode } = useDarkMode();
  const [selectedTool, setSelectedTool] = useState("moveprice");
  const [ethPrice, setEthPrice] = useState(1850);
  const [isSimulating, setIsSimulating] = useState(false);

  const healthFactor = (ethPrice / 1000) * 1.32;
  const isCritical = healthFactor < 1.5;
  const isWarning = healthFactor >= 1.5 && healthFactor < 2.2;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  return (
    <section
      id="devtools"
      className={`py-24 relative border-b tracking-tight ${
        isDarkMode
          ? "bg-[#090A0F] text-white border-white/5"
          : "bg-[#FAFAFC] text-gray-950 border-black/5"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Developer Test Environment ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Sandbox Tools
            </h2>
          </div>
          <p
            className={`text-sm font-mono max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Execute dry-run contract mutations, seed Sepolia accounts, and debug
            EIP-2535 delegate calls.
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-stretch">
          <div className="flex flex-col gap-3">
            {TOOLS.map((tool) => {
              const IsSelected = selectedTool === tool.id;
              const ToolIcon = tool.icon;

              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
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
                        <ToolIcon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-tight">
                          {tool.name}
                        </h3>
                        <p
                          className={`text-[11px] mt-0.5 max-w-60 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-gray-500 group-hover:translate-x-1 transition-transform ${IsSelected ? "text-blue-500" : ""}`}
                    />
                  </div>

                  {IsSelected && (
                    <motion.div
                      layoutId="dev-selector-bar"
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
                key={selectedTool}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className={`p-8 rounded-xl border h-full relative overflow-hidden ${isDarkMode ? "bg-[#0F111A] border-white/5" : "bg-white border-black/5 shadow-sm"}`}
              >
                <div className="absolute right-4 bottom-4 opacity-[0.012] pointer-events-none">
                  <Terminal size={220} />
                </div>

                {selectedTool === "moveprice" && (
                  <div className="grid md:grid-cols-[1fr_280px] gap-8 h-full">
                    <div className="space-y-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 border-b border-white/5 pb-3 uppercase tracking-wider font-bold">
                          <Target size={14} strokeWidth={1.5} />
                          <span>SANDBOX ENVIRONMENT // PARAMETER_INPUT</span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {TOOLS[0].details}
                        </p>
                      </div>

                      <div className="space-y-3 font-mono">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 uppercase tracking-wide">
                            Simulated ETH Spot Price
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${isDarkMode ? "bg-white/5 text-white" : "bg-black/5 text-gray-900 border"}`}
                          >
                            ${ethPrice}.00 USD
                          </span>
                        </div>

                        <input
                          type="range"
                          min="1000"
                          max="5000"
                          step="10"
                          value={ethPrice}
                          onChange={(e) =>
                            setEthPrice(parseInt(e.target.value, 10))
                          }
                          className="w-full h-1 bg-blue-500/20 appearance-none rounded-lg cursor-ew-resize outline-none accent-blue-500"
                        />
                        <div className="flex justify-between text-[9px] text-gray-500">
                          <span>$1,000</span>
                          <span>$3,000</span>
                          <span>$5,000</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 border rounded-xl flex flex-col justify-between font-mono ${isDarkMode ? "bg-white/1 border-white/5" : "bg-black/1 border-black/5"}`}
                    >
                      <div>
                        <div className="text-[10px] text-gray-400 border-b border-white/5 pb-2 uppercase tracking-widest font-bold">
                          [ Derived Matrix Outputs ]
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-500 block mb-1 uppercase tracking-wider">
                            Position Health Factor
                          </span>
                          <div
                            className={`text-2xl font-bold tracking-tight ${isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-emerald-500"}`}
                          >
                            {healthFactor.toFixed(2)}x
                          </div>
                          <div className="text-[9px] font-bold mt-2">
                            {isCritical
                              ? "CRITICAL_RISK"
                              : isWarning
                                ? "CAUTION_THRESHOLD"
                                : "STABLE_MARGIN"}
                          </div>

                          <div className="mt-4 text-sm text-gray-500">
                            Liquidation Margin Delta:{" "}
                            {((healthFactor - 1) * 100).toFixed(1)}% above floor
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className={`w-full mt-6 py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider rounded border flex items-center justify-center gap-2 transition-colors ${
                          isDarkMode
                            ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40"
                            : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        <RefreshCw
                          size={12}
                          className={isSimulating ? "animate-spin" : ""}
                        />
                        {isSimulating
                          ? "Broadcasting State..."
                          : "Push State to Sandbox"}
                      </button>
                    </div>
                  </div>
                )}

                {selectedTool === "simulator" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 border-b border-white/5 pb-3 uppercase tracking-wider font-bold">
                      <BarChart3 size={14} strokeWidth={1.5} />
                      <span>LTV MARGIN SIMULATOR</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {TOOLS[1].details}
                    </p>
                    <div className="p-6 border rounded-xl bg-transparent">
                      <div className="text-sm">
                        Simulated preview controls go here (collateral, debt,
                        leverage)
                      </div>
                    </div>
                  </div>
                )}

                {selectedTool === "faucet" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 border-b border-white/5 pb-3 uppercase tracking-wider font-bold">
                      <Droplet size={14} strokeWidth={1.5} />
                      <span>GAS & FACET FAUCET</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {TOOLS[2].details}
                    </p>
                    <div className="p-6 border rounded-xl">
                      <button className="px-4 py-2 rounded bg-blue-600 text-white">
                        Request Test Funds
                      </button>
                    </div>
                  </div>
                )}

                {selectedTool === "debug" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 border-b border-white/5 pb-3 uppercase tracking-wider font-bold">
                      <Sliders size={14} strokeWidth={1.5} />
                      <span>PROXY DEBUGGER</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {TOOLS[3].details}
                    </p>
                    <div className="p-6 border rounded-xl flex items-center gap-4">
                      <AlertTriangle />
                      <div className="text-sm">
                        Debugger is offline in this environment. Connect a local
                        node to enable tracing.
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DeveloperTools;
