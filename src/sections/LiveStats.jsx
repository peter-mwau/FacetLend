import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  HardDrive,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

function LiveStatsSection() {
  const { isDarkMode } = useDarkMode();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const isConnected = Boolean(activeAccount);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState("ETH");

  const [stats, setStats] = useState({
    totalSupplied: "0.00",
    totalBorrowed: "0.00",
    availableLiquidity: "0.00",
    utilizationRate: "0.00",
  });

  const [userPosition, setUserPosition] = useState({
    supplied: { ETH: "0.00", APS: "0.00", USDC: "0.00" },
    borrowed: { ETH: "0.00", APS: "0.00", USDC: "0.00" },
    healthFactor: "∞",
    healthFactorValue: 999,
  });

  useEffect(() => {
    let isMounted = true;

    const timer = window.setTimeout(() => {
      if (!isMounted) return;

      setStats({
        totalSupplied: "1,245,678.00",
        totalBorrowed: "892,345.00",
        availableLiquidity: "353,333.00",
        utilizationRate: "71.60",
      });

      if (isConnected && address) {
        setUserPosition({
          supplied: { ETH: "5.20", APS: "0.00", USDC: "0.00" },
          borrowed: { ETH: "0.00", APS: "2,340.00", USDC: "0.00" },
          healthFactor: "2.45",
          healthFactorValue: 2.45,
        });
      }

      setIsLoading(false);
    }, 1200);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [isConnected, address]);

  const assets = [
    {
      symbol: "ETH",
      name: "Ethereum",
      apy: "2.40%",
      walletBalance: "1.50",
      network: "ERC-20",
    },
    {
      symbol: "APS",
      name: "APS Token",
      apy: "4.80%",
      walletBalance: "0.00",
      network: "Native",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      apy: "3.10%",
      walletBalance: "0.00",
      network: "EIP-712",
    },
  ];

  const getHealthColorClass = (health) => {
    if (health >= 2.0) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (health >= 1.5) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse";
  };

  const getHealthStatus = (health) => {
    if (health >= 2.0) return "SECURE";
    if (health >= 1.5) return "CAUTION";
    if (health >= 1.1) return "MARGIN_WARNING";
    if (health > 1.0) return "CRITICAL_COLLATERAL";
    return "LIQUIDATED";
  };

  return (
    <section
      className={`relative border-b py-24 ${isDarkMode ? "bg-[#090A0F] text-white border-white/5" : "bg-[#FAFAFC] text-gray-950 border-black/5"}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Live Liquidity Metrics ]</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Market Protocol Registry
            </h2>
          </div>
          <p
            className={`text-xs font-mono max-w-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Cryptographic confirmation vectors streaming on-chain data loops via
            secondary pool indices.
          </p>
        </div>

        <div
          className={`grid grid-cols-2 lg:grid-cols-4 border-t border-b mb-12 divide-y lg:divide-y-0 ${isDarkMode ? "border-white/5 bg-white/1 divide-white/5" : "border-black/5 bg-black/1 divide-black/5"}`}
        >
          {[
            {
              label: "Total Liquidity Supplied",
              value: `$${stats.totalSupplied}`,
              change: "+12.4%",
              labelIcon: ArrowDownLeft,
            },
            {
              label: "Active Capital Borrowed",
              value: `$${stats.totalBorrowed}`,
              change: "+8.1%",
              labelIcon: ArrowUpRight,
            },
            {
              label: "Free Available Liquidity",
              value: `$${stats.availableLiquidity}`,
              change: "-3.2%",
              labelIcon: Shield,
            },
            {
              label: "System Pool Utilization",
              value: `${stats.utilizationRate}%`,
              change: "Stable",
              labelIcon: TrendingUp,
            },
          ].map((stat, idx) => {
            const Icon = stat.labelIcon;

            return (
              <div
                key={stat.label}
                className={`p-6 flex flex-col justify-between h-28 ${idx > 0 ? (isDarkMode ? "lg:border-l border-white/5" : "lg:border-l border-black/5") : ""}`}
              >
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-gray-400 gap-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon size={12} className="text-blue-500 shrink-0" />
                    <span className="truncate">{stat.label}</span>
                  </div>
                  <span
                    className={
                      stat.change.startsWith("+")
                        ? "text-emerald-500 font-bold"
                        : stat.change.startsWith("-")
                          ? "text-rose-500 font-bold"
                          : "text-gray-400"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight mt-2">
                  {isLoading ? (
                    <div
                      className={`w-28 h-6 rounded animate-pulse ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
                    />
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
          <div
            className={`p-6 rounded-xl border flex flex-col justify-between min-h-95 ${isDarkMode ? "bg-[#0F111A] border-white/5" : "bg-white border-black/5 shadow-sm"}`}
          >
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-gray-400 font-bold">
                  <HardDrive size={14} className="text-blue-500" />
                  <span>Account State Ledger</span>
                </div>

                {isConnected && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 font-mono text-[9px] rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                    CONNECTED
                  </span>
                )}
              </div>

              {!isConnected ? (
                <div className="text-center py-16 font-mono">
                  <div
                    className={`w-10 h-10 mx-auto border border-dashed rounded-lg flex items-center justify-center text-gray-500 mb-4 ${isDarkMode ? "border-white/20" : "border-black/20"}`}
                  >
                    !
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Cryptographic Keys Required
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-xs mx-auto mb-6">
                    Initialize a validated provider interface to retrieve
                    structural lending vectors.
                  </p>
                  <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Connect Wallet API
                  </button>
                </div>
              ) : isLoading ? (
                <div className="space-y-4">
                  <div
                    className={`h-16 rounded animate-pulse ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
                  />
                  <div
                    className={`h-24 rounded animate-pulse ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div
                    className={`p-4 border rounded-lg ${isDarkMode ? "bg-white/1 border-white/5" : "bg-black/1 border-black/5"}`}
                  >
                    <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-gray-400 uppercase">
                      <span>Margin Health Score</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getHealthColorClass(userPosition.healthFactorValue)}`}
                      >
                        {getHealthStatus(userPosition.healthFactorValue)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span
                        className={`text-3xl font-bold ${
                          userPosition.healthFactorValue >= 2.0
                            ? "text-emerald-500"
                            : userPosition.healthFactorValue >= 1.5
                              ? "text-amber-500"
                              : "text-rose-500"
                        }`}
                      >
                        {userPosition.healthFactor}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        / 1.00x Liquidation Threshold
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-xs space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">
                        Total Collateral Allocated
                      </span>
                      <span className="font-bold">
                        ${userPosition.supplied[selectedAsset]} {selectedAsset} equivalent
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Active Utilized Debt</span>
                      <span className="font-bold">
                        ${userPosition.borrowed[selectedAsset]} {selectedAsset} equivalent
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Provider Address</span>
                      <span className="font-bold truncate max-w-45 text-right">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "NULL"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl overflow-hidden border ${isDarkMode ? "bg-[#0F111A] border-white/5" : "bg-white border-black/5 shadow-sm"}`}
          >
            <div className="px-6 py-5 border-b border-white/5 font-mono text-[10px] uppercase tracking-[0.35em] text-gray-400">
              Asset Router Configuration Matrix
            </div>

            <div className="divide-y divide-white/5">
              {assets.map((asset) => {
                const isTarget = selectedAsset === asset.symbol;

                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => setSelectedAsset(asset.symbol)}
                    className={`w-full text-left p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors relative ${
                      isTarget
                        ? isDarkMode
                          ? "bg-white/1"
                          : "bg-black/1"
                        : isDarkMode
                          ? "hover:bg-white/1"
                          : "hover:bg-black/1"
                    }`}
                  >
                    {isTarget && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}

                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs shrink-0 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
                      >
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{asset.name}</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                          {asset.network} Architecture
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                          Optimized APY
                        </div>
                        <div className="font-bold">{asset.apy}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                          Available Balance
                        </div>
                        <div className="font-bold text-sm">
                          {asset.walletBalance} {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveStatsSection;