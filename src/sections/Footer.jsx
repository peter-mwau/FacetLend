import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  Layers,
  Copy,
  Check,
  BookOpen,
  ExternalLink,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  const { isDarkMode } = useDarkMode();
  const [copiedAddress, setCopiedAddress] = useState(null);
  const currentYear = new Date().getFullYear();

  const contractAddresses = [
    {
      name: "Diamond Proxy (EIP-2535)",
      address: "0x1234...5678",
      chain: "Sepolia",
    },
    { name: "Lending Facet Core", address: "0x8765...4321", chain: "Sepolia" },
    {
      name: "Flashloan Router Facet",
      address: "0xabcd...efgh",
      chain: "Sepolia",
    },
    {
      name: "APS Token Mint Proxy",
      address: "0x9876...5432",
      chain: "Sepolia",
    },
  ];

  const quickLinks = [
    { name: "Lending Market", href: "/lending" },
    { name: "Flashloan Router", href: "/flashloan" },
    { name: "DEX Aggregator", href: "/dex" },
    { name: "Console Dashboard", href: "/dashboard" },
    { name: "Developer Sandbox", href: "/dev-tools" },
  ];

  const resources = [
    { name: "Protocol Architecture Spec", href: "https://docs.facetlend.io" },
    { name: "GitHub Repository Matrix", href: "https://github.com/facetlend" },
    { name: "ConsenSys Security Audit", href: "/audit.pdf" },
    { name: "Immunefi Bug Bounty", href: "/bounty" },
    { name: "Governance Snapshot DAO", href: "/governance" },
  ];

  const socials = [
    {
      name: "Twitter",
      icon: FaXTwitter,
      href: "https://twitter.com/facetlend",
    },
    { name: "Discord", icon: FaDiscord, href: "https://discord.gg/facetlend" },
    { name: "GitHub", icon: FaGithub, href: "https://github.com/facetlend" },
    { name: "Docs", icon: BookOpen, href: "https://docs.facetlend.io" },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://linkedin.com/company/facetlend",
    },
  ];

  const copyToClipboard = (address, name) => {
    navigator.clipboard.writeText(address.replace("...", ""));
    setCopiedAddress(name);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <footer
      className={`relative border-t tracking-tight ${
        isDarkMode
          ? "bg-[#090A0F] text-white border-white/5"
          : "bg-[#FAFAFC] text-gray-950 border-black/5"
      }`}
    >
      {/* Structural Low-Contrast Accent Line Instead of Rainbow Gradients */}
      <div
        className={`absolute top-0 left-0 right-0 h-px ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        {/* Main Interface Directory Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* BRAND COLUMN: Core System Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}
              >
                <Layers size={18} className="text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-base font-bold uppercase tracking-tight">
                  FacetLend
                </div>
                <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                  Diamond Protocol
                </div>
              </div>
            </div>

            <p
              className={`text-xs leading-relaxed font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Algorithmic liquidity allocation mapping multi-facet proxy
              architectures to decentralized credit markets. Complete bytecode
              execution optimization.
            </p>

            {/* Social Connection Array */}
            <div className="flex gap-2">
              {socials.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                      isDarkMode
                        ? "bg-[#0F111A] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                        : "bg-white border-black/5 text-gray-500 hover:text-black hover:border-black/10 shadow-sm"
                    }`}
                  >
                    <SocialIcon size={14} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
              [ Core Endpoints ]
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-xs font-mono transition-colors flex items-center gap-1 group ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <ChevronRight
                      size={10}
                      className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500"
                    />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES COLUMN */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
              [ Documentation Registry ]
            </h4>
            <ul className="space-y-2.5">
              {resources.map((res) => (
                <li key={res.name}>
                  <a
                    href={res.href}
                    target={res.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      res.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`text-xs font-mono transition-colors inline-flex items-center gap-1.5 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <span>{res.name}</span>
                    {res.href.startsWith("http") && (
                      <ExternalLink size={10} className="text-gray-600" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTRACT REGISTRY COLUMN */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
              [ Verified Signatures ]
            </h4>
            <ul className="space-y-3 font-mono">
              {contractAddresses.map((contract) => (
                <li
                  key={contract.name}
                  className={`p-2.5 border rounded-lg flex items-center justify-between ${
                    isDarkMode
                      ? "bg-white/[0.01] border-white/5"
                      : "bg-black/[0.01] border-black/5"
                  }`}
                >
                  <div>
                    <span className="text-[9px] text-gray-500 block mb-0.5 uppercase tracking-wider">
                      {contract.name}
                    </span>
                    <code
                      className={`text-[11px] font-bold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {contract.address}
                    </code>
                  </div>

                  {/* Stateful Hash Clipboard Trigger */}
                  <button
                    onClick={() =>
                      copyToClipboard(contract.address, contract.name)
                    }
                    className={`p-1.5 rounded border transition-colors flex items-center justify-center ${
                      isDarkMode
                        ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                        : "bg-black/5 border-black/5 text-gray-500 hover:text-black hover:border-black/10"
                    }`}
                    title="Copy Contract Hash"
                  >
                    <AnimatePresence mode="wait">
                      {copiedAddress === contract.name ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Check size={12} className="text-emerald-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Copy size={12} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SYSTEM STATUS FOOTER BOTTOM */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-[10px] ${
            isDarkMode
              ? "border-white/5 text-gray-500"
              : "border-black/5 text-gray-400"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest font-bold text-gray-500">
              © {currentYear} FACETLEND LABS
            </span>
            <div
              className={`h-3 w-px hidden sm:block ${isDarkMode ? "bg-white/10" : "bg-black/10"}`}
            />
            <span className="hidden sm:inline">
              COMPLIANCE: CRYPTOGRAPHICALLY SECURE
            </span>
          </div>

          <div className="flex items-center gap-2 text-blue-500 font-bold">
            <Cpu size={12} className="animate-pulse" />
            <span className="tracking-wider">BUILD_TAG: SECURE_STATE_V1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
