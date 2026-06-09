// components/MainPageNavbar.jsx
import { useEffect, useState } from "react";
import { FacetLendConnectButton } from "../../providers/FC_Connectbtn.jsx";
import { useDarkMode } from "../../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Menu, X } from "lucide-react";
import { SlDocs } from "react-icons/sl";

function MainPageNavbar({ activeSection = "overview" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Get the title based on active section
  const getPageTitle = () => {
    const titles = {
      overview: "Overview",
      lending: "Lending",
      borrowing: "Borrowing",
      flashloan: "Flashloan",
      positions: "Positions",
      health: "Risk Monitor",
      settings: "Settings",
    };
    return titles[activeSection] || "FacetLend";
  };

  const getPageSubtitle = () => {
    const subtitles = {
      overview: "Portfolio summary",
      lending: "Supply & earn",
      borrowing: "Request loans",
      flashloan: "Instant execution",
      positions: "Active positions",
      health: "Health factor",
      settings: "Preferences",
    };
    return subtitles[activeSection] || "Diamond Protocol";
  };

  // Listen for sidebar toggle events and resize
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarWidth(event.detail.isCollapsed ? 80 : 256);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle scroll effect and progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const bgStyles = isDarkMode
    ? `bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#1A1F2E] ${
        isScrolled ? "shadow-lg shadow-[#3B82F6]/10" : ""
      }`
    : `bg-white/95 backdrop-blur-md border-b border-gray-200 ${
        isScrolled ? "shadow-lg" : ""
      }`;

  const navLinks = [
    { id: "home", label: "Home", icon: <Home size={16} />, link: "/" },
    { id: "docs", label: "Docs", icon: <SlDocs size={14} />, link: "/docs" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 right-0 z-40 transition-all duration-300 ${bgStyles}`}
        style={{ left: isMobile ? "0px" : `${sidebarWidth}px` }}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                isDarkMode
                  ? "hover:bg-[#1A1F2E] text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Page Title Section - Hidden on smallest screens */}
            <div className="hidden xs:flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <motion.div
                  key={activeSection}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#3B82F6] text-base sm:text-xl flex-shrink-0"
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
                    className={`text-sm sm:text-lg md:text-xl font-semibold truncate ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {getPageTitle()}
                  </motion.h1>
                </AnimatePresence>

                {/* Badge - Hidden on tablet */}
                <span
                  className={`hidden lg:inline-block text-[10px] sm:text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    isDarkMode
                      ? "bg-[#1A1F2E] text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Diamond ◆{" "}
                  <span className="text-[#3B82F6] italic uppercase">Aave</span>
                </span>
              </div>

              {/* Subtitle - Hidden on mobile */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${activeSection}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className={`hidden sm:block text-[10px] sm:text-xs mt-0.5 truncate ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {getPageSubtitle()}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Center Navigation - Desktop only */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {navLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target={item.id === "docs" ? "_blank" : undefined}
                  rel={item.id === "docs" ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-1 text-xs lg:text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Right Section - Compact on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Network Indicator - Hidden on small mobile */}
              <div
                className={`hidden sm:flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs
                ${isDarkMode ? "bg-[#1A1F2E] text-gray-400" : "bg-gray-100 text-gray-600"}`}
              >
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
                </span>
                <span className="hidden sm:inline">Sepolia</span>
              </div>

              {/* Theme Toggle - Always visible */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0
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
                    className="text-sm md:text-lg"
                  >
                    {isDarkMode ? "🌙" : "☀️"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Connect Button - Scaled for mobile */}
              <div className="scale-75 sm:scale-90 md:scale-100">
                <FacetLendConnectButton />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]"
          style={{
            transformOrigin: "left",
            transform: `scaleX(${scrollProgress / 100})`,
          }}
        />
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              style={{ top: "60px" }}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed left-0 top-[60px] bottom-0 w-64 z-40 md:hidden shadow-xl ${
                isDarkMode
                  ? "bg-[#0F111A] border-r border-[#1A1F2E]"
                  : "bg-white border-r border-gray-200"
              }`}
            >
              <div className="p-4 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <div
                    className={`text-xs font-semibold mb-2 px-3 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    NAVIGATION
                  </div>
                  {navLinks.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.link}
                      target={item.id === "docs" ? "_blank" : undefined}
                      rel={
                        item.id === "docs" ? "noopener noreferrer" : undefined
                      }
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-[#1A1F2E] hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      <span className="text-[#3B82F6]">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Network Indicator */}
                <div
                  className={`pt-4 border-t ${isDarkMode ? "border-[#1A1F2E]" : "border-gray-200"}`}
                >
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                      isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Network
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-medium">Sepolia</span>
                    </div>
                  </div>
                </div>

                {/* Diamond Protocol Footer */}
                <div
                  className={`pt-4 text-center text-[10px] ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>◆</span>
                    <span>Diamond Protocol v1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under navbar */}
      <div className="h-[60px] sm:h-[70px] md:h-[80px]" />
    </>
  );
}

export default MainPageNavbar;
