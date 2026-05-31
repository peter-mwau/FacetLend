import { useEffect, useRef, useState } from "react";
import { FacetLendConnectButton } from "../providers/FC_Connectbtn";

function Navbar() {
  const [isFull, setIsFull] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < 0) return;

      if (y < lastY.current) {
        // scrolling up
        setIsFull(true);
      } else if (y > lastY.current) {
        // scrolling down
        setIsFull(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const base =
    "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out";
  const centeredStyles = "w-[80%] rounded-lg";
  const fullStyles = "w-full left-0 transform-none rounded-none top-0";

  return (
    <div
      className={`bg-gray-800 text-white p-4 ${base} ${isFull ? fullStyles : centeredStyles}`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Navbar</h1>
        <div>
          <FacetLendConnectButton />
        </div>
      </div>

      <nav className="mt-2">
        <a href="/" className="mr-4 hover:underline">
          Home
        </a>
        <a href="/about" className="hover:underline">
          About
        </a>
      </nav>
    </div>
  );
}

export default Navbar;
