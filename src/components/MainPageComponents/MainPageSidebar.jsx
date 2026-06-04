import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Layers,
  TrendingUp,
  Zap,
  Briefcase,
  ShieldCheck,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Cpu,
} from "lucide-react";

function MainPageSidebar({ activeSection, onSectionChange }) {
  const { isDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "overview",
      name: "Overview",
      icon: BarChart3,
      desc: "Portfolio summary",
    },
    {
      id: "lending",
      name: "Lending Pool",
      icon: Layers,
      desc: "Supply assets",
    },
    {
      id: "borrowing",
      name: "Margin Debt",
      icon: TrendingUp,
      desc: "Request loans",
    },
    {
      id: "flashloan",
      name: "Flash Router",
      icon: Zap,
      desc: "Instant execution",
    },
    {
      id: "positions",
      name: "My Ledger",
      icon: Briefcase,
      desc: "Active allocations",
    },
    {
      id: "health",
      name: "Risk Matrix",
      icon: ShieldCheck,
      desc: "Health threshold",
    },
    {
      id: "settings",
      name: "Configuration",
      icon: Sliders,
      desc: "System parameters",
    },
  ];

  // Structural layouts using explicit margins instead of bounding full viewport widths
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const contentMargin = isCollapsed ? "pl-28" : "pl-72";

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className={`fixed left-4 top-4 bottom-4 z-40 flex flex-col justify-between tracking-tight border shadow-sm transition-all duration-300 font-mono text-xs ${sidebarWidth} ${
          isDarkMode
            ? "bg-[#0F111A] border-white/5 text-white"
            : "bg-white border-black/5 text-gray-950"
        }`}
        style={{
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      >
        {/* TOP: System Registry Header */}
        <div>
          <div
            className={`p-4 flex items-center justify-between border-b ${
              isDarkMode ? "border-white/5" : "border-black/5"
            }`}
          >
            <div
              className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}
            >
              <div
                className={`p-1.5 rounded-md border ${isDarkMode ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
              >
                <Terminal size={14} className="text-blue-500" />
              </div>

              {!isCollapsed && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src="/facetlend_logo.png"
                  alt="FacetLend"
                  className="h-16 w-24 object-contain"
                />
              )}
            </div>

            {/* Toggle Handle */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-white/5 hover:bg-white/5 text-gray-400 hover:text-white"
                    : "border-black/5 hover:bg-black/5 text-gray-500 hover:text-black"
                }`}
              >
                <ChevronLeft size={12} />
              </button>
            )}
          </div>

          {/* Expander button node overlay when collapsed */}
          {isCollapsed && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsCollapsed(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-white/5 bg-white/5 text-blue-400 hover:bg-white/10"
                    : "border-black/5 bg-black/5 text-blue-600 hover:bg-black/10"
                }`}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* MIDDLE: Module Navigation List Matrix */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const IsTarget = activeSection === item.id;
              const MenuIcon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full hover:cursor-pointer flex items-center gap-3 p-3 rounded-lg relative overflow-hidden transition-all group ${
                    IsTarget
                      ? "text-blue-500 font-bold"
                      : isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  {/* Anchor Active Bar Line */}
                  {IsTarget && (
                    <motion.div
                      layoutId="sidebarActiveLine"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Inline Icon Frame */}
                  <div
                    className={`p-1 rounded transition-colors flex-shrink-0 ${
                      IsTarget
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                  >
                    <MenuIcon size={14} strokeWidth={IsTarget ? 2 : 1.5} />
                  </div>

                  {/* Text Descriptors */}
                  {!isCollapsed && (
                    <div className="flex-1 text-left truncate">
                      <div className="text-[11px] uppercase tracking-tight leading-none mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[9px] text-gray-500 font-normal truncate">
                        {item.desc}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM: Parametric Metadata Footer */}
        <div
          className={`p-4 border-t font-mono text-[9px] text-gray-500 ${
            isDarkMode
              ? "border-white/5 bg-white/[0.005]"
              : "border-black/5 bg-black/[0.005]"
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="block uppercase tracking-wider">
                  TAG_SYS_V1
                </span>
                <span className="block opacity-60">BASE // AAVE_V3</span>
              </div>
              <Cpu size={12} className="text-blue-500/40 animate-pulse" />
            </div>
          ) : (
            <div className="text-center font-bold text-blue-500">◆</div>
          )}
        </div>
      </motion.aside>

      {/* Structural Spacer block that shifts layout viewports correctly */}
      <div className={`transition-all duration-300 ${contentMargin}`} />
    </>
  );
}

export default MainPageSidebar;
