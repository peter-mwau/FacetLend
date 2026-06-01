import Navbar from "../components/Navbar";
import { useDarkMode } from "../hooks/useDarkMode";
import HeroSection from "../sections/Hero";

function Home() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <div className={isDarkMode ? "dark" : "light"}>
        <Navbar />
        <HeroSection />
      </div>
    </>
  );
}

export default Home;
