import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import { DarkModeProvider } from "./contexts/ThemeContext.jsx";
import { LendingProvider } from "./contexts/LendingContext.jsx";
import { FlashLoanProvider } from "./contexts/FlashLoanContext.jsx";
import { APSDEXProvider } from "./contexts/APSDEXContext.jsx";
import MovePriceProvider from "./contexts/MovePriceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThirdwebProvider>
        <DarkModeProvider>
          <LendingProvider>
            <FlashLoanProvider>
              <APSDEXProvider>
                <MovePriceProvider>
                  <App />
                </MovePriceProvider>
              </APSDEXProvider>
            </FlashLoanProvider>
          </LendingProvider>
        </DarkModeProvider>
      </ThirdwebProvider>
    </BrowserRouter>
  </StrictMode>,
);
