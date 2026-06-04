// components/MainPageSidebar.jsx
import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { motion } from "framer-motion";

function MainPageSidebar({ activeSection, onSectionChange }) {
  const { isDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "overview",
      name: "Overview",
      icon: "📊",
      description: "Portfolio summary",
    },
    {
      id: "lending",
      name: "Lending",
      icon: "◆",
      description: "Supply assets",
    },
    {
      id: "borrowing",
      name: "Borrowing",
      icon: "📈",
      description: "Request loans",
    },
    {
      id: "flashloan",
      name: "Flashloan",
      icon: "⚡",
      description: "Instant loans",
    },
    {
      id: "positions",
      name: "My Positions",
      icon: "💼",
      description: "Active loans",
    },
    {
      id: "health",
      name: "Health Factor",
      icon: "🛡️",
      description: "Risk management",
    },
    {
      id: "settings",
      name: "Settings",
      icon: "⚙️",
      description: "Preferences",
    },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const contentMargin = isCollapsed ? "ml-20" : "ml-64";

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-screen ${sidebarWidth} z-50 transition-all duration-300
          ${isDarkMode ? "bg-gradient-to-b from-[#0A0C10] to-[#141824] border-r border-[#1A1F2E]" : "bg-white border-r border-gray-200"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-[#1A1F2E]">
          <div
            className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <span className="text-2xl text-[#3B82F6]">◆</span>
            {!isCollapsed && (
              <span
                className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                FacetLend
              </span>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded-lg transition-all ${isDarkMode ? "hover:bg-[#1A1F2E]" : "hover:bg-gray-100"}`}
            >
              <span className="text-gray-400">◀</span>
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-xs"
          >
            ▶
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${
                  activeSection === item.id
                    ? isDarkMode
                      ? "bg-[#1A1F2E] text-[#3B82F6] border-l-2 border-[#3B82F6]"
                      : "bg-blue-50 text-[#2563EB] border-l-2 border-[#2563EB]"
                    : isDarkMode
                      ? "text-gray-400 hover:bg-[#1A1F2E] hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? item.name : ""}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs opacity-60">{item.description}</div>
                </div>
              )}
              {activeSection === item.id && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? "border-[#1A1F2E]" : "border-gray-200"}`}
        >
          {!isCollapsed ? (
            <div className="text-center">
              <div
                className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                Diamond Protocol v1
              </div>
              <div
                className={`text-xs mt-1 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}
              >
                Powered by Aave
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500">◆</div>
          )}
        </div>
      </motion.aside>

      {/* Return the margin class for main content */}
      <div className={contentMargin} />
    </>
  );
}

export default MainPageSidebar;
