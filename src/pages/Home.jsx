import { useDarkMode } from "../hooks/useDarkMode";
import HowItWorks from "../sections/About";
import DeveloperTools from "../sections/DeveloperTools";
import FeaturesDeepDive from "../sections/Features";
import Footer from "../sections/Footer";
import HeroSection from "../sections/Hero";
import LiveStatsSection from "../sections/LiveStats";
import RoadmapFAQ from "../sections/Roadmap";

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
        <RoadmapFAQ />
        <Footer />
      </div>
    </>
  );
}

export default Home;
