import { client } from "../services/client";
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useMemo, useEffect } from "react";
import { useDarkMode } from "../contexts/ThemeContext.jsx";

export function FacetLendConnectButton() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: {
          options: ["google", "discord", "passkey", "github"],
        },
        metadata: {
          name: "FacetLend",
          image: {
            src: "/favicon.svg",
            width: 150,
            height: 150,
          },
        },
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
        smartAccount: {
          chain: defineChain(11155111),
          sponsorGas: true,
        },
      }),
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
    ],
    [],
  );

  const customTheme = useMemo(
    () =>
      isDarkMode
        ? darkTheme({
            colors: {
              separatorLine: "hsl(45, 93%, 47%)",
              accentText: "hsl(41, 62%, 51%)",
              modalBg: "hsl(221, 39%, 11%)",
              borderColor: "hsl(58, 5%, 13%)",
              selectedTextColor: "hsl(230, 7%, 22%)",
              primaryText: "hsl(0, 0%, 100%)",
              secondaryText: "hsl(0, 0%, 70%)",
              accentButtonBg: "hsl(41, 80%, 49%)",
              accentButtonText: "hsl(0, 0%, 100%)",
              connectedButtonBg: "hsl(45, 93%, 48%)",
            },
          })
        : lightTheme({
            colors: {
              separatorLine: "hsl(41, 80%, 49%)",
              accentText: "hsl(41, 62%, 51%)",
              modalBg: "hsl(0, 0%, 100%)",
              borderColor: "hsl(0, 0%, 85%)",
              selectedTextColor: "hsl(100, 100%, 100%)",
              primaryText: "hsl(0, 0%, 0%)",
              secondaryText: "hsl(0, 0%, 30%)",
              accentButtonBg: "hsl(41, 80%, 49%)",
              accentButtonText: "hsl(0, 0%, 100%)",
              connectedButtonBg: "hsl(230, 26%, 95%)",
              walletSelectorButtonHoverBg: "hsl(41, 80%, 49%)",
            },
          }),
    [isDarkMode],
  );

  return (
    <ConnectButton
      {...(client ? { client } : {})}
      wallets={wallets}
      connectButton={{
        label: "Connect Wallet",
        style: {
          background: isDarkMode ? "#eab308" : "#e5e7eb",
          color: isDarkMode ? "white" : "black",
          border: "none",
          borderRadius: "8px",
          padding: "5px 5px",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          width: "70%",
          boxShadow: isDarkMode
            ? "0 2px 8px 0 #facc15, 0 0 0 2px #facc15"
            : "0 0 0 2px #e5e7eb, 0 0 8px 2px #facc15",
        },
      }}
      connectModal={{
        size: "compact",
        titleIcon: "/favicon.svg",
        showThirdwebBranding: true,
      }}
      theme={customTheme}
    />
  );
}
