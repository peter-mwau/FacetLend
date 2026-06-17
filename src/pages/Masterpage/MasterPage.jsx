// components/MainContent.jsx
// import React from "react";
import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";

// Import your section components
import Dashboard from "../../sections/MainPageSections/Dashboard";
import LendingSection from "../../sections/MainPageSections/LendingSection";
import BorrowingSection from "../../sections/MainPageSections/BorrowingSection";
import FlashloanSection from "../../sections/MainPageSections/FlashloanSection";
import MintAPSSection from "../../sections/MainPageSections/MintAPSSection";
import MovePriceSection from "../../sections/MainPageSections/MovePriceSection";
import SettingsSection from "../../sections/MainPageSections/SettingsSection";

import MasterPageNavbar from "../../components/MainPageComponents/MainPageNavbar";
import MainPageSidebar from "../../components/MainPageComponents/MainPageSidebar";
import { BorrowingCalculator } from "../../sections/MainPageSections/BorrowingCalculator";

function MainContent({ activeSection, onSectionChange }) {
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
        return <BorrowingCalculator />;
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
      <MasterPageNavbar activeSection={activeSection} />
      <MainPageSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      <div className="p-6 md:p-8 ml-[16%]">{renderSection()}</div>
    </main>
  );
}

function MasterPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <MainContent
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    />
  );
}

export default MasterPage;
