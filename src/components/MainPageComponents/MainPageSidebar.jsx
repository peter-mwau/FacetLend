// components/MainPageSidebar.jsx
import { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";

function MainPageSidebar({ activeSection, onSectionChange }) {
  const { isDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
        setIsMobileExpanded(false);
      } else {
        setIsMobileOpen(false);
        setIsMobileExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Emit sidebarToggle events
  useEffect(() => {
    try {
      const ev = new CustomEvent("sidebarToggle", { detail: { isCollapsed } });
      window.dispatchEvent(ev);
    } catch {}
  }, [isCollapsed]);

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

  const activeItem =
    menuItems.find((item) => item.id === activeSection) || menuItems[0];
  const ActiveIcon = activeItem.icon;

  // Desktop: Normal sidebar behavior
  if (!isMobile) {
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
            borderRadius: "12px",
          }}
        >
          {/* Desktop Header */}
          <div>
            <div
              className={`p-4 flex items-center justify-between border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}
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
              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "border-white/5 hover:bg-white/5 text-gray-400 hover:text-white"
                      : "border-black/5 hover:bg-black/5 text-gray-500 hover:text-black"
                  }`}
                >
                  <ChevronLeft
                    size={12}
                    className={`${isDarkMode ? "text-white" : "text-gray-800"}`}
                  />
                </button>
              )}
            </div>

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

            {/* Desktop Navigation */}
            <nav className="mt-6 px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                const MenuIcon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full hover:cursor-pointer flex items-center gap-3 p-3 rounded-lg relative overflow-hidden transition-all group ${
                      isActive
                        ? "text-blue-500 font-bold"
                        : isDarkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-black"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    {isActive && (
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
                    <div
                      className={`p-1 rounded transition-colors flex-shrink-0 ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      <MenuIcon size={14} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
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

          {/* Desktop Footer */}
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
        <div className={`transition-all duration-300 ${contentMargin}`} />
      </>
    );
  }

  // ========== MOBILE RESPONSIVE SIDEBAR ==========
  return (
    <>
      {/* Floating Action Button - Only shows active icon when closed */}
      <AnimatePresence mode="wait">
        {!isMobileOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={() => setIsMobileOpen(true)}
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
              isDarkMode
                ? "bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white"
                : "bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white"
            }`}
          >
            <ActiveIcon size={24} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMobileOpen(false);
                setIsMobileExpanded(false);
              }}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col shadow-2xl ${
                isMobileExpanded ? "w-64" : "w-20"
              } ${
                isDarkMode
                  ? "bg-[#0F111A] border-r border-white/10"
                  : "bg-white border-r border-black/10"
              }`}
            >
              {/* Mobile Header */}
              <div
                className={`p-4 flex items-center justify-between border-b ${
                  isDarkMode ? "border-white/10" : "border-black/10"
                }`}
              >
                {isMobileExpanded ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-blue-500" />
                      <span className="font-bold text-sm">FacetLend</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setIsMobileExpanded(false)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => setIsMobileOpen(false)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                        }`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsMobileExpanded(true)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                      }`}
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = activeSection === item.id;
                  const MenuIcon = item.icon;

                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onSectionChange(item.id);
                        if (!isMobileExpanded) {
                          setIsMobileOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all group ${
                        isActive
                          ? `${
                              isDarkMode
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-blue-500/10 text-blue-600"
                            } border border-blue-500/30`
                          : isDarkMode
                            ? "text-gray-400 hover:bg-white/5 hover:text-white"
                            : "text-gray-600 hover:bg-black/5 hover:text-black"
                      } ${!isMobileExpanded ? "justify-center" : ""}`}
                      title={!isMobileExpanded ? item.name : ""}
                    >
                      <MenuIcon size={18} strokeWidth={isActive ? 2 : 1.5} />
                      {isMobileExpanded && (
                        <div className="flex-1 text-left">
                          <div className="text-xs font-medium">{item.name}</div>
                          <div className="text-[9px] opacity-60">
                            {item.desc}
                          </div>
                        </div>
                      )}
                      {isMobileExpanded && isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div
                className={`p-4 border-t text-[9px] ${
                  isDarkMode
                    ? "border-white/10 text-gray-500"
                    : "border-black/10 text-gray-400"
                }`}
              >
                {isMobileExpanded ? (
                  <div className="flex items-center justify-between">
                    <span>◆ Diamond Protocol</span>
                    <Cpu size={10} className="text-blue-500/60" />
                  </div>
                ) : (
                  <div className="text-center">
                    <Cpu size={12} className="text-blue-500/60 mx-auto" />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* No spacer needed on mobile since sidebar overlays */}
    </>
  );
}

export default MainPageSidebar;
