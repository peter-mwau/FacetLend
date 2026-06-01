import { useEffect, useState } from "react";
import { FacetLendConnectButton } from "../providers/FC_Connectbtn";
import { useDarkMode } from "../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Zap,
  GitMerge,
  Activity,
  Sun,
  Moon,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Lending Pool", id: "lending", href: "/", icon: Layers },
  { name: "Flashloan Router", id: "flashloan", href: "/flashloan", icon: Zap },
  { name: "DEX Aggregator", id: "dex", href: "/dex", icon: GitMerge },
  {
    name: "Console Metrics",
    id: "dashboard",
    href: "/dashboard",
    icon: Activity,
  },
];

const PAGE_SECTIONS = [
  { id: "hero", name: "Home", icon: Activity },
  { id: "about", name: "How It Works", icon: Layers },
  { id: "livestats", name: "Live Stats", icon: Activity },
  { id: "features", name: "Features", icon: Zap },
  { id: "devtools", name: "Developer Tools", icon: GitMerge },
  { id: "roadmap", name: "Roadmap", icon: Layers },
  { id: "footer", name: "Footer", icon: Activity },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/",
  );
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState(null);

  // Track window scroll height for backdrop alterations
  useEffect(() => {
    const handleScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(y > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // `currentPath` is initialized from `window.location` to avoid synchronous setState in an effect

  // Safely close mobile layout structures during viewport shifts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Observe page sections on the homepage and mark which section is active
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ids = PAGE_SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.25 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b tracking-tight ${
          isScrolled
            ? isDarkMode
              ? "bg-[#090A0F]/90 backdrop-blur-md border-white/5"
              : "bg-[#FAFAFC]/90 backdrop-blur-md border-black/5"
            : isDarkMode
              ? "bg-[#090A0F] border-transparent"
              : "bg-[#FAFAFC] border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* LOGO SECTION */}
          <div className="flex items-center gap-3">
            <img
              src="/facetlend_logo.png"
              alt="FacetLend Terminal"
              className="h-7 w-auto object-contain"
            />
            <div
              className={`hidden lg:block h-4 w-px ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}
            />
            <span className="hidden lg:inline font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              CORE_SYSTEM_V1.0
            </span>
          </div>

          {/* DESKTOP LINKS: Shared Border Navigation with Active Underlines */}
          <div
            className={`hidden md:flex items-center border-l border-r font-mono text-xs h-full px-4 ${
              isDarkMode ? "border-white/5" : "border-black/5"
            }`}
          >
            {NAV_LINKS.map((link) => {
              const LinkIcon = link.icon;
              const IsActive = currentPath === link.href;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (
                      typeof window !== "undefined" &&
                      window.location.pathname === "/" &&
                      document.getElementById(link.id)
                    ) {
                      e.preventDefault();
                      document
                        .getElementById(link.id)
                        .scrollIntoView({ behavior: "smooth", block: "start" });
                      setIsMobileMenuOpen(false);
                      setCurrentPath(window.location.pathname);
                    }
                  }}
                  className={`px-4 py-2 mx-1 rounded-lg flex items-center gap-2 transition-colors relative group ${
                    IsActive
                      ? "text-blue-500"
                      : isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                  }`}
                >
                  <LinkIcon size={13} strokeWidth={1.5} />
                  <span>{link.name}</span>

                  {/* Shared Layout Magic: Smoothly transitions the active horizontal bar indicator line */}
                  {IsActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute -bottom-4.25 left-0 right-0 h-0.5 bg-blue-500"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* UTILITY CONTROL PACK */}
          <div className="flex items-center gap-3 font-mono">
            {/* Minimalist Theme Toggle Node */}
            <button
              onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                isDarkMode
                  ? "bg-[#0F111A] border-white/5 text-amber-500 hover:bg-white/5"
                  : "bg-white border-black/5 text-gray-600 hover:bg-black/5"
              }`}
              title="Toggle Environment Theme"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="dark"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun size={14} strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon size={14} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Production Connect API Trigger */}
            <div className="text-xs">
              <FacetLendConnectButton />
            </div>

            {/* Mobile Menu Action Box */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors md:hidden ${
                isDarkMode
                  ? "bg-[#0F111A] border-white/5 text-white"
                  : "bg-white border-black/5 text-black"
              }`}
            >
              {isMobileMenuOpen ? (
                <X size={16} strokeWidth={1.5} />
              ) : (
                <Menu size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE EXPANSION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-16 left-0 right-0 z-40 md:hidden border-b font-mono text-xs ${
              isDarkMode
                ? "bg-[#090A0F] border-white/5"
                : "bg-[#FAFAFC] border-black/5"
            }`}
          >
            <div className="p-4 space-y-2">
              {PAGE_SECTIONS.map((section) => {
                const SectionIcon = section.icon;
                const IsActiveSection = activeSection === section.id;

                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(section.id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        setActiveSection(section.id);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-colors relative ${
                      IsActiveSection
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                        : isDarkMode
                          ? "bg-[#0F111A] border-white/5 text-gray-300 hover:text-white"
                          : "bg-white border-black/5 text-gray-700 hover:text-black"
                    }`}
                  >
                    <SectionIcon size={14} strokeWidth={1.5} />
                    <span className="font-bold">{section.name}</span>

                    {IsActiveSection && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                  </a>
                );
              })}

              {/* Divider between page sections and route links */}
              <div className="h-px my-2 w-full bg-white/2 opacity-10" />

              {NAV_LINKS.map((link) => {
                const MobileIcon = link.icon;
                const IsActive = currentPath === link.href;

                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      if (
                        typeof window !== "undefined" &&
                        window.location.pathname === "/" &&
                        document.getElementById(link.id)
                      ) {
                        e.preventDefault();
                        document
                          .getElementById(link.id)
                          .scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        setCurrentPath(window.location.pathname);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-colors relative ${
                      IsActive
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                        : isDarkMode
                          ? "bg-[#0F111A] border-white/5 text-gray-300 hover:text-white"
                          : "bg-white border-black/5 text-gray-700 hover:text-black"
                    }`}
                  >
                    <MobileIcon size={14} strokeWidth={1.5} />
                    <span className="font-bold">{link.name}</span>

                    {IsActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                  </a>
                );
              })}

              <div className="pt-2 flex items-center justify-between text-[9px] text-gray-500 px-1">
                <span>SEPOLIA_NODE: SYNCED</span>
                <HelpCircle size={12} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
