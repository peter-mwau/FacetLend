import { useEffect, useRef, useState } from "react";
import { FacetLendConnectButton } from "../providers/FC_Connectbtn";
import { useDarkMode } from "../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isFull, setIsFull] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < 0) return;

      // Hide navbar when scrolling down, show when scrolling up
      if (y > lastY.current && y > 100) {
        setIsVisible(false);
      } else if (y < lastY.current) {
        setIsVisible(true);
      }

      // Handle width transformation
      if (y > 50) {
        setIsFull(true);
      } else {
        setIsFull(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Lending", href: "/", icon: "◆" },
    { name: "Flashloan", href: "/flashloan", icon: "⚡" },
    { name: "DEX", href: "/dex", icon: "📊" },
    { name: "Dashboard", href: "/dashboard", icon: "📈" },
  ];

  // Base navbar styles
  const baseStyles = "fixed z-50 transition-all duration-500 ease-in-out";
  const centeredStyles =
    "w-[90%] md:w-[80%] left-1/2 transform -translate-x-1/2 top-4 rounded-2xl";
  const fullStyles =
    "w-full left-0 transform-none rounded-none top-0 shadow-lg";

  // Visibility styles
  const visibleStyles = "translate-y-0";
  const hiddenStyles = "-translate-y-full";

  // Theme-based background styles
  const bgStyles = isDarkMode
    ? "bg-gradient-to-r from-[#0A0C10] via-[#141824] to-[#0A0C10] backdrop-blur-md bg-opacity-95"
    : "bg-gradient-to-r from-white via-[#F3F4F6] to-white shadow-md";

  const borderStyles = isFull
    ? "border-b border-opacity-20"
    : `border ${isDarkMode ? "border-[#1A1F2E] border-opacity-50" : "border-gray-200"}`;

  const textStyles = isDarkMode ? "text-[#F3F4F6]" : "text-[#1F2937]";
  const hoverStyles = isDarkMode
    ? "hover:text-[#3B82F6]"
    : "hover:text-[#2563EB]";

  return (
    <>
      <div
        className={`${baseStyles} ${isFull ? fullStyles : centeredStyles} 
          ${isVisible ? visibleStyles : hiddenStyles} 
          ${bgStyles} ${borderStyles} transition-all duration-500`}
        style={{
          boxShadow:
            isDarkMode && !isFull
              ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-[#3B82F6]">◆</span>
                <span className={`ml-1 ${textStyles}`}>Facet</span>
                <span className={`font-light ${textStyles}`}>Lend</span>
              </div>
              <div className="hidden lg:block ml-2">
                <span
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Diamond Protocol
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`
                    relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${textStyles} ${hoverStyles}
                    group
                  `}
                >
                  <span className="flex items-center gap-1">
                    <span className="text-[#3B82F6] text-xs">{link.icon}</span>
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Right Section: Theme Toggle + Connect Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${
                    isDarkMode
                      ? "bg-[#1A1F2E] hover:bg-[#141824] text-[#F59E0B]"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }
                `}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" className="">
                  <motion.span
                    key={isDarkMode ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl hover:cursor-pointer"
                  >
                    {!isDarkMode ? "🌙" : "☀️"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Connect Button Wrapper */}
              <div className="w-auto">
                <FacetLendConnectButton />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  md:hidden w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-1.5
                  transition-all duration-200
                  ${isDarkMode ? "bg-[#1A1F2E] hover:bg-[#141824]" : "bg-gray-100 hover:bg-gray-200"}
                `}
                aria-label="Menu"
              >
                <span
                  className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  } ${isDarkMode ? "bg-white" : "bg-gray-700"}`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  } ${isDarkMode ? "bg-white" : "bg-gray-700"}`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  } ${isDarkMode ? "bg-white" : "bg-gray-700"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed top-[70px] left-0 right-0 z-40 md:hidden
              ${isDarkMode ? "bg-[#0A0C10] border-b border-[#1A1F2E]" : "bg-white border-b border-gray-200"}
              shadow-xl rounded-b-2xl
            `}
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${textStyles} ${hoverStyles}
                    ${isDarkMode ? "hover:bg-[#1A1F2E]" : "hover:bg-gray-50"}
                  `}
                >
                  <span className="text-[#3B82F6] text-lg">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div
        className={`transition-all duration-500 ${isFull ? "h-16" : "h-20"}`}
      />
    </>
  );
}

export default Navbar;
