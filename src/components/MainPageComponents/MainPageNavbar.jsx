// components/MainPageNavbar.jsx
import { useEffect, useRef, useState } from "react";
import { FacetLendConnectButton } from "../../providers/FC_Connectbtn.jsx";
import { useDarkMode } from "../../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";

function MainPageNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgStyles = isDarkMode
    ? `bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#1A1F2E] ${
        isScrolled ? "shadow-lg shadow-[#3B82F6]/10" : ""
      }`
    : `bg-white/95 backdrop-blur-md border-b border-gray-200 ${
        isScrolled ? "shadow-lg" : ""
      }`;

  return (
    <>
      <nav
        className={`fixed top-0 right-0 z-40 transition-all duration-300 ${bgStyles}`}
        style={{ left: "250px" }} // Leave space for sidebar
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Page Title - will be updated based on active section */}
          <div className="flex items-center gap-2">
            <span className="text-[#3B82F6] text-xl">◆</span>
            <h1
              className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Lending Dashboard
            </h1>
            <span
              className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-[#1A1F2E] text-gray-400" : "bg-gray-100 text-gray-600"}`}
            >
              Diamond Protocol
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                ${isDarkMode ? "bg-[#1A1F2E] hover:bg-[#141824] text-[#F59E0B]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              <span className="text-lg">{isDarkMode ? "🌙" : "☀️"}</span>
            </motion.button>

            {/* Connect Button */}
            <FacetLendConnectButton />
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

export default MainPageNavbar;
