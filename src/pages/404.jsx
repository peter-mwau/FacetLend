import { motion } from "framer-motion";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  Terminal,
  RefreshCw,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

function NotFoundPage() {
  const { isDarkMode } = useDarkMode();

  const handleSystemReset = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`relative min-h-screen font-sans antialiased flex flex-col items-center justify-center selection:bg-blue-500/30 px-6 ${
        isDarkMode ? "bg-[#090A0F] text-white" : "bg-[#FAFAFC] text-gray-950"
      }`}
    >
      {/* Structural Low-Contrast Technical Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-left space-y-8">
        {/* Top Exception Flag Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-rose-500 font-bold"
        >
          <AlertTriangle size={14} className="animate-pulse" />
          <span>EXCEPTION_LOG // STATUS_404</span>
        </motion.div>

        {/* Big Code Title */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none font-mono">
            TX_REVERTED
          </h1>
          <p
            className={`text-sm font-mono ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            The requested contract routing path does not match any deployed
            multi-facet proxies on this network.
          </p>
        </div>

        {/* Stateful Technical Debug Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border relative overflow-hidden font-mono text-xs ${
            isDarkMode
              ? "bg-[#0F111A] border-white/5"
              : "bg-white border-black/5 shadow-sm"
          }`}
        >
          {/* Console Watermark background element */}
          <div className="absolute right-4 bottom-4 opacity-[0.012] pointer-events-none">
            <Terminal size={140} />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                [ Virtual Machine Stack Trace ]
              </span>
              <span className="text-[10px] text-rose-500 font-bold">
                ERR_ROUTE_NOT_FOUND
              </span>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed text-gray-500">
              <p>
                <span className="text-blue-500">▶ CALLDATA</span>{" "}
                0x404ffffff783a21bc9e145f590000000000000
              </p>
              <p>
                <span className="text-amber-500">⚠ WARNING</span> Fallback
                handler triggered: delegatecall signature mismatch.
              </p>
              <p>
                <span className="text-gray-400">⚡ EXEC_STATE</span> Gas
                consumed: 21,000 | Safe frame rollbacks applied.
              </p>
            </div>

            {/* Simulated Block Context Hash Box */}
            <div
              className={`p-4 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.02] border-white/5"
                  : "bg-black/[0.02] border-black/5"
              }`}
            >
              <div className="flex justify-between py-1 text-[10px] text-gray-400 uppercase">
                <span>Target URI Hash</span>
                <span>Active Endpoint</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <code className="text-[11px] font-bold text-gray-400">
                  {typeof window !== "undefined"
                    ? window.location.pathname
                    : "/invalid-facet-pointer"}
                </code>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border border-rose-500/20 text-rose-500 bg-rose-500/5">
                  NULL_PTR
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fail-safe Navigation Action Vectors */}
        <div className="flex flex-wrap gap-4 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSystemReset}
            className="px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-sm flex items-center gap-2 transition-all"
          >
            <RefreshCw size={12} />
            <span>Reset Mainnet Console</span>
          </motion.button>

          <button
            onClick={() => window.history.back()}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 ${
              isDarkMode
                ? "border-white/10 text-white hover:bg-white/5"
                : "border-black/10 text-gray-950 hover:bg-black/5"
            }`}
          >
            <ArrowLeft size={12} />
            <span>Revert to Previous Frame</span>
          </button>
        </div>
      </div>

      {/* Environmental Status Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
        <ShieldAlert size={12} className="text-gray-500" />
        <span>System Isolation Mode Active // Threat Neutralized</span>
      </div>
    </div>
  );
}

export default NotFoundPage;
