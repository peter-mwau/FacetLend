import { useDarkMode } from "../hooks/useDarkMode";
import HowItWorks from "../sections/About";
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
      </div>
    </>
  );
}

export default Home;
