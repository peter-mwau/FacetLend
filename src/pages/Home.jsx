import { useDarkMode } from "../hooks/useDarkMode";
import HowItWorks from "../sections/About";
import DeveloperTools from "../sections/DeveloperTools";
import FeaturesDeepDive from "../sections/Features";
import HeroSection from "../sections/Hero";
import LiveStatsSection from "../sections/LiveStats";

function Home() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <div className={isDarkMode ? "dark" : "light"}>
        <HeroSection />
        <HowItWorks />
        <LiveStatsSection />
        <FeaturesDeepDive />
        <DeveloperTools />
      </div>
    </>
  );
}

export default Home;
