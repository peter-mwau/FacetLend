import { client } from "../services/client";
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useMemo, useEffect } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

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
            src: "/facetlend_logo.png",
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

  // Diamond Protocol Theme Colors
  const customTheme = useMemo(
    () =>
      isDarkMode
        ? darkTheme({
            colors: {
              // Primary accents - Diamond Blue & Gold
              accentText: "#3B82F6", // Diamond Blue
              accentButtonBg: "#3B82F6", // Diamond Blue
              accentButtonText: "#F3F4F6", // Ice White

              // Backgrounds - Deep Shale Black theme
              modalBg: "#0A0C10", // Deep Shale Black
              borderColor: "#1A1F2E", // Gunmetal
              separatorLine: "#141824", // Dark Slate

              // Text colors
              primaryText: "#F3F4F6", // Ice White
              secondaryText: "#9CA3AF", // Cool Gray
              selectedTextColor: "#3B82F6", // Diamond Blue

              // Button states
              connectedButtonBg: "#1A1F2E", // Gunmetal
              connectedButtonBgHover: "#141824", // Dark Slate

              // Wallet selector
              walletSelectorButtonHoverBg: "#1A1F2E",
            },
          })
        : lightTheme({
            colors: {
              // Primary accents - Sapphire (slightly deeper for light mode)
              accentText: "#2563EB", // Sapphire
              accentButtonBg: "#2563EB", // Sapphire
              accentButtonText: "#FFFFFF", // White

              // Backgrounds - Arctic White theme
              modalBg: "#FFFFFF", // Arctic White
              borderColor: "#E5E7EB", // Soft Mist
              separatorLine: "#F3F4F6", // Lighter mist

              // Text colors
              primaryText: "#1F2937", // Charcoal
              secondaryText: "#6B7280", // Cool Gray
              selectedTextColor: "#2563EB", // Sapphire

              // Button states
              connectedButtonBg: "#F3F4F6", // Soft Mist
              connectedButtonBgHover: "#E5E7EB",

              // Wallet selector
              walletSelectorButtonHoverBg: "#EFF6FF", // Light blue tint
            },
          }),
    [isDarkMode],
  );

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{
        label: "◆ Connect Wallet",
        style: {
          background: isDarkMode
            ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)" // Diamond Blue to Frost Cyan
            : "linear-gradient(135deg, #2563EB 0%, #0891B2 100%)", // Sapphire to Cyan
          color: "#FFFFFF",
          border: isDarkMode ? "1px solid rgba(59, 130, 246, 0.3)" : "none",
          borderRadius: "12px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isDarkMode
            ? "0 0 15px rgba(59, 130, 246, 0.3)" // Diamond Blue glow
            : "0 2px 8px rgba(37, 99, 235, 0.2)",
        },
        className: "connect-button-diamond",
      }}
      connectModal={{
        size: "compact",
        titleIcon: "/facetlend_logo.png",
        showThirdwebBranding: false, // Cleaner look without thirdweb branding
        title: "FacetLend",
      }}
      theme={customTheme}
    />
  );
}
