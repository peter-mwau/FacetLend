// components/MainContent.jsx
import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

// Import your section components
import BorrowingSection from "./sections/BorrowingSection";
import FlashloanSection from "./sections/FlashloanSection";
import SettingsSection from "./sections/SettingsSection";
import Dashboard from "../../sections/MainPageSections/Dashboard";
import LendingSection from "../../sections/MainPageSections/LendingSection";

function MainContent({ activeSection }) {
  const { isDarkMode } = useDarkMode();

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Dashboard />;
      case "lending":
        return <LendingSection />;
      case "borrowing":
        return <BorrowingSection />;
      case "flashloan":
        return <FlashloanSection />;
      case "positions":
        return <MintAPSSection />;
      case "health":
        return <MovePriceSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main
      className={`flex-1 min-h-screen transition-all duration-300 ${isDarkMode ? "bg-[#0A0C10]" : "bg-gray-50"}`}
    >
      <div className="p-6 md:p-8">{renderSection()}</div>
    </main>
  );
}

export default MainContent;
