// components/MainPageNavbar.jsx
import { useEffect, useState } from "react";
import { FacetLendConnectButton } from "../../providers/FC_Connectbtn.jsx";
import { useDarkMode } from "../../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { SlDocs } from "react-icons/sl";

function MainPageNavbar({ activeSection = "overview" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default width (256px = w-64)
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Get the title based on active section
  const getPageTitle = () => {
    const titles = {
      overview: "Dashboard Overview",
      lending: "Lending Markets",
      borrowing: "Borrowing",
      flashloan: "Flashloan",
      positions: "My Positions",
      health: "Health Factor Monitor",
      settings: "Settings",
    };
    return titles[activeSection] || "FacetLend";
  };

  const getPageSubtitle = () => {
    const subtitles = {
      overview: "Your portfolio at a glance",
      lending: "Supply assets and earn interest",
      borrowing: "Request loans against your collateral",
      flashloan: "Instant uncollateralized loans",
      positions: "Manage your active positions",
      health: "Monitor your loan health factor",
      settings: "Configure your preferences",
    };
    return subtitles[activeSection] || "Diamond Protocol";
  };

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarWidth(event.detail.isCollapsed ? 80 : 256);
    };

    const handleResize = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle scroll effect
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
        className={`fixed top-0 pt-5 pl-10 right-0 z-40 transition-all duration-300 ${bgStyles}`}
        style={{ left: isMobile ? `0px` : `${sidebarWidth}px` }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Page Title Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <motion.div
                key={activeSection}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[#3B82F6] text-xl"
              >
                ◆
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeSection}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  {getPageTitle()}
                </motion.h1>
              </AnimatePresence>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-[#1A1F2E] text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Diamond --{" "}
                <span className="text-[#3B82F6] italic uppercase animate-pulse">
                  aave
                </span>{" "}
                Protocol
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${activeSection}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                {getPageSubtitle()}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Center navigation */}
          <div className="hidden md:flex items-center gap-6">
            {[
              {
                id: "Home",
                label: "Home",
                icon: <Home size={14} />,
                link: "/",
              },
              {
                id: "Docs",
                label: "Docs",
                icon: <SlDocs size={14} />,
                link: "/docs",
              },
            ].map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Network Indicator */}
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs
              ${isDarkMode ? "bg-[#1A1F2E] text-gray-400" : "bg-gray-100 text-gray-600"}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sepolia
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-full hover:cursor-pointer flex items-center justify-center transition-all
                ${
                  isDarkMode
                    ? "bg-[#1A1F2E] hover:bg-[#141824] text-[#F59E0B]"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isDarkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg"
                >
                  {isDarkMode ? "🌙" : "☀️"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Connect Button */}
            <div className="scale-90">
              <FacetLendConnectButton />
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#3B82F6] to-[#06B6D4]"
            style={{
              transformOrigin: "left",
              transform: `scaleX(${window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)})`,
            }}
          />
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

export default MainPageNavbar;
