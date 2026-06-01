// components/RoadmapFAQ.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

function RoadmapFAQ() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [openFAQs, setOpenFAQs] = useState([]);

  const roadmap = {
    completed: [
      {
        quarter: "Q1 2024",
        title: "Diamond Proxy Deployment",
        description:
          "Successfully deployed diamond proxy architecture with core facets",
        icon: "✅",
        items: [
          "Diamond Proxy contract",
          "Lending Facet",
          "Flashloan Facet",
          "APS DEX Oracle",
        ],
      },
      {
        quarter: "Q2 2024",
        title: "Aave Integration",
        description: "Integrated Aave v3 protocols for lending pools",
        icon: "✅",
        items: [
          "Aave pool connection",
          "Interest rate models",
          "Collateral management",
          "Liquidation mechanics",
        ],
      },
    ],
    inProgress: [
      {
        quarter: "Q3 2024",
        title: "Frontend & Testing",
        description: "Building intuitive UI and comprehensive test suite",
        icon: "🔄",
        items: [
          "Complete dApp interface",
          "MovePrice testing tools",
          "Health factor simulator",
          "User analytics",
        ],
      },
    ],
    upcoming: [
      {
        quarter: "Q4 2024",
        title: "Multi-Collateral Support",
        description: "Expand beyond ETH to support more assets",
        icon: "📅",
        items: [
          "USDC, DAI, USDT support",
          "Cross-collateral positions",
          "Improved risk parameters",
          "Mobile app beta",
        ],
      },
      {
        quarter: "Q1 2025",
        title: "Governance Launch",
        description: "Decentralized governance with veToken model",
        icon: "📅",
        items: [
          "DAO formation",
          "Protocol fee voting",
          "Parameter adjustments",
          "Treasury management",
        ],
      },
      {
        quarter: "Q2 2025",
        title: "Layer 2 Expansion",
        description: "Deploy on Arbitrum and Optimism",
        icon: "📅",
        items: [
          "Arbitrum deployment",
          "Optimism integration",
          "Cross-chain flashloans",
          "Reduced gas costs",
        ],
      },
    ],
  };

  const faqs = [
    {
      question: "What happens when my health factor drops below 1.0?",
      answer:
        "When your health factor falls below 1.0, your position becomes eligible for liquidation. Liquidators can repay up to 50% of your debt in exchange for your collateral, plus a liquidation bonus. You can prevent this by adding more collateral or repaying part of your debt.",
      category: "lending",
    },
    {
      question: "How are flash loans different from regular loans?",
      answer:
        "Flash loans don't require collateral but must be repaid within the same transaction block. They're ideal for arbitrage, collateral swaps, and self-liquidation. If you don't repay by the end of the transaction, the entire transaction reverts as if it never happened.",
      category: "flashloan",
    },
    {
      question: "Is my collateral safe?",
      answer:
        "Yes! All collateral is held in audited smart contracts with Aave's battle-tested security. The diamond proxy architecture adds an extra layer of upgradeability without compromising security. All funds are non-custodial — you maintain control of your assets at all times.",
      category: "security",
    },
    {
      question: "What's the benefit of diamond architecture?",
      answer:
        "Diamond architecture allows unlimited contract size, selective upgrades per facet, and eliminates storage collisions. This means we can add new features without redeploying, fix bugs in specific modules, and scale infinitely without hitting Ethereum's 24KB contract limit.",
      category: "technical",
    },
    {
      question: "How are interest rates calculated?",
      answer:
        "Interest rates are determined by Aave's utilization-based model. When utilization is low, rates are low to encourage borrowing. As utilization increases, rates rise to incentivize more deposits. You can see real-time rates in the lending markets table.",
      category: "lending",
    },
    {
      question: "Can I use the MovePrice facet on mainnet?",
      answer:
        "The MovePrice facet is currently available only on testnet (Sepolia) for testing and simulation purposes. It allows developers and power users to understand how price movements affect health factors without risking real funds.",
      category: "testing",
    },
    {
      question: "What fees does the protocol charge?",
      answer:
        "Flash loans have a 0.09% fee. Regular lending/borrowing uses Aave's standard fee structure. Future governance may introduce protocol fees, which will be voted on by veToken holders.",
      category: "fees",
    },
    {
      question: "How do I get testnet tokens?",
      answer:
        "You can get Sepolia ETH from faucets like Alchemy or Infura. APS test tokens will be available through our faucet tool (coming soon). Check the Developer Tools section for updates.",
      category: "testing",
    },
  ];

  const toggleFAQ = (index) => {
    if (openFAQs.includes(index)) {
      setOpenFAQs(openFAQs.filter((i) => i !== index));
    } else {
      setOpenFAQs([...openFAQs, index]);
    }
  };

  return (
    <section
      className={`py-24 relative ${isDarkMode ? "bg-[#141824]" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-sm font-semibold mb-4">
            <span>🗺️</span>
            <span>Transparency</span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Roadmap & FAQs
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Our vision for the future and answers to common questions
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-[#3B82F6] text-white shadow-lg"
                : isDarkMode
                  ? "bg-[#1A1F2E] text-gray-400 hover:text-white"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
            }`}
          >
            🗺️ Roadmap
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "faq"
                ? "bg-[#3B82F6] text-white shadow-lg"
                : isDarkMode
                  ? "bg-[#1A1F2E] text-gray-400 hover:text-white"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
            }`}
          >
            ❓ FAQs
          </button>
        </div>

        {/* Roadmap Content */}
        {activeTab === "roadmap" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Completed */}
            <div className="mb-12">
              <h3
                className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <span>✅</span>
                <span>Completed</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {roadmap.completed.map((item, idx) => (
                  <motion.div
                    key={item.quarter}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl ${isDarkMode ? "bg-[#0A0C10] border border-[#1A1F2E]" : "bg-white border border-gray-200 shadow-sm"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-emerald-500 font-semibold">
                          {item.quarter}
                        </div>
                        <h4
                          className={`text-lg font-bold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <div className="text-2xl">{item.icon}</div>
                    </div>
                    <p
                      className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.items.map((subItem) => (
                        <span
                          key={subItem}
                          className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}
                        >
                          {subItem}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div className="mb-12">
              <h3
                className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <span>🔄</span>
                <span>In Progress</span>
              </h3>
              <div className="grid md:grid-cols-1 gap-6">
                {roadmap.inProgress.map((item, idx) => (
                  <motion.div
                    key={item.quarter}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl ${isDarkMode ? "bg-[#0A0C10] border border-[#1A1F2E]" : "bg-white border border-gray-200 shadow-sm"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-amber-500 font-semibold">
                          {item.quarter}
                        </div>
                        <h4
                          className={`text-lg font-bold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <div className="text-2xl">{item.icon}</div>
                    </div>
                    <p
                      className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.items.map((subItem) => (
                        <span
                          key={subItem}
                          className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700"}`}
                        >
                          {subItem}
                        </span>
                      ))}
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-amber-500">65%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-amber-500 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <h3
                className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <span>📅</span>
                <span>Upcoming</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {roadmap.upcoming.map((item, idx) => (
                  <motion.div
                    key={item.quarter}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl ${isDarkMode ? "bg-[#0A0C10] border border-[#1A1F2E]" : "bg-white border border-gray-200 shadow-sm"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-[#3B82F6] font-semibold">
                          {item.quarter}
                        </div>
                        <h4
                          className={`text-lg font-bold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <div className="text-2xl">{item.icon}</div>
                    </div>
                    <p
                      className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.items.map((subItem) => (
                        <span
                          key={subItem}
                          className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-blue-100 text-blue-700"}`}
                        >
                          {subItem}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Content */}
        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-[#0A0C10] border border-[#1A1F2E]" : "bg-white border border-gray-200"}`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-all"
                  >
                    <span
                      className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: openFAQs.includes(idx) ? 180 : 0 }}
                      className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      ↓
                    </motion.span>
                  </button>

                  {openFAQs.includes(idx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`px-6 pb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      <div
                        className={`pt-2 border-t ${isDarkMode ? "border-[#1A1F2E]" : "border-gray-100"}`}
                      >
                        <p className="text-sm leading-relaxed">{faq.answer}</p>
                        <div className="mt-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-[#1A1F2E] text-gray-500" : "bg-gray-100 text-gray-600"}`}
                          >
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Still have questions? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`mt-12 p-8 rounded-2xl text-center ${isDarkMode ? "bg-[#1A1F2E] border border-[#1A1F2E]" : "bg-white border border-gray-200 shadow-sm"}`}
            >
              <div className="text-4xl mb-3">💬</div>
              <h3
                className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Still have questions?
              </h3>
              <p
                className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Join our community or read the technical documentation
              </p>
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold">
                  Join Discord →
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border ${isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}`}
                >
                  Read Docs →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default RoadmapFAQ;
