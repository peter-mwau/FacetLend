import { useDarkMode } from "../hooks/useDarkMode";
import HowItWorks from "../sections/About";
import HeroSection from "../sections/Hero";

function Home() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <div className={isDarkMode ? "dark" : "light"}>
        <HeroSection />
        <HowItWorks />
      </div>
    </>
  );
}

export default Home;
