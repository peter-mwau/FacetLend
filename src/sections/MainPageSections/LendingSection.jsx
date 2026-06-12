// components/sections/LendingSection.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useAPSDEX } from "../../contexts/APSDEXContext";
import { useActiveAccount } from "thirdweb/react";
import {
  Shield,
  RefreshCw,
  Zap,
  ArrowDownLeft,
  Briefcase,
  AlertTriangle,
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  Droplet,
  Coins,
  Activity,
} from "lucide-react";
import { parseEther } from "viem";

function LendingSection() {
  const { isDarkMode } = useDarkMode();
  const account = useActiveAccount();
  const address = account?.address;

  const {
    addCollateral,
    withdrawCollateral,
    harvestStakingRewards,
    getHealthFactor,
    checkLiquidationStatus,
    calculateStakingYield,
    getPositionDetails,
    getRepayableAmount,
    loading,
    yieldAmount,
    healthFactor,
    isLiquidatable,
    positionDetails,
    repayableAmount,
    error,
  } = useLending();

  const {
    getCurrentPrice,
    getEthReserves,
    getTokenReserves,
    getTotalLiquidity,
    getProviderLiquidity,
    swapOnAPSDEX,
    depositToAPSDEX,
    withdrawFromAPSDEX,
    price,
    ethReserves,
    tokenReserves,
    totalLiquidity,
    providerLiquidity,
    loading: apsdexLoading,
  } = useAPSDEX();

  const canAct = useMemo(
    () => !!address && !loading && !apsdexLoading,
    [address, loading, apsdexLoading],
  );

  const [collateralAmount, setCollateralAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState("ethToAps"); // ethToAps or apsToEth
  const [depositEthAmount, setDepositEthAmount] = useState("");
  const [depositApsAmount, setDepositApsAmount] = useState("");
  const [withdrawEthAmount, setWithdrawEthAmount] = useState("");
  const [withdrawApsAmount, setWithdrawApsAmount] = useState("");
  const [showPoolDetails, setShowPoolDetails] = useState(false);

  const [localLoadingCollateral, setLocalLoadingCollateral] = useState(false);
  const [localLoadingWithdraw, setLocalLoadingWithdraw] = useState(false);
  const [localLoadingHarvest, setLocalLoadingHarvest] = useState(false);
  const [localLoadingHF, setLocalLoadingHF] = useState(false);
  const [localLoadingLiquidation, setLocalLoadingLiquidation] = useState(false);
  const [localLoadingYield, setLocalLoadingYield] = useState(false);
  const [localLoadingRepayable, setLocalLoadingRepayable] = useState(false);
  const [localLoadingSwap, setLocalLoadingSwap] = useState(false);
  const [localLoadingDeposit, setLocalLoadingDeposit] = useState(false);
  const [localLoadingWithdrawPool, setLocalLoadingWithdrawPool] =
    useState(false);
  const [localLoadingPoolData, setLocalLoadingPoolData] = useState(false);

  const parseInput = (v) => {
    const trimmed = String(v).trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  };

  const formatHealthFactor = (hf) => {
    if (hf === null || hf === undefined) return null;
    const raw = typeof hf === "bigint" ? Number(hf) : Number(hf);
    const divisor = 10 ** 18;
    return raw / divisor;
  };

  const formatReserves = (reserves) => {
    if (reserves === null || reserves === undefined) return null;
    const raw =
      typeof reserves === "bigint" ? Number(reserves) : Number(reserves);
    const divisor = 10 ** 18;
    return raw / divisor;
  };

  const formatPrice = (priceValue) => {
    if (priceValue === null || priceValue === undefined) return null;
    const raw =
      typeof priceValue === "bigint" ? Number(priceValue) : Number(priceValue);
    const divisor = 10 ** 18;
    return raw / divisor;
  };

  const refreshHealthFactor = async () => {
    if (!address) return;
    setLocalLoadingHF(true);
    try {
      await getHealthFactor(address);
    } finally {
      setLocalLoadingHF(false);
    }
  };

  const refreshLiquidationStatus = async () => {
    if (!address) return;
    setLocalLoadingLiquidation(true);
    try {
      await checkLiquidationStatus(address);
    } finally {
      setLocalLoadingLiquidation(false);
    }
  };

  const refreshYield = async () => {
    if (!address) return;
    setLocalLoadingYield(true);
    try {
      await calculateStakingYield(address);
    } finally {
      setLocalLoadingYield(false);
    }
  };

  const refreshPosition = async () => {
    if (!address) return;
    await getPositionDetails(address);
  };

  const refreshRepayable = async () => {
    if (!address) return;
    setLocalLoadingRepayable(true);
    try {
      await getRepayableAmount(address);
    } finally {
      setLocalLoadingRepayable(false);
    }
  };

  const refreshPoolData = async () => {
    setLocalLoadingPoolData(true);
    try {
      await Promise.all([
        getCurrentPrice(),
        getEthReserves(),
        getTokenReserves(),
        getTotalLiquidity(),
        address ? getProviderLiquidity(address) : Promise.resolve(),
      ]);
    } finally {
      setLocalLoadingPoolData(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      refreshHealthFactor(),
      refreshLiquidationStatus(),
      refreshYield(),
      refreshPosition(),
      refreshRepayable(),
      refreshPoolData(),
    ]);
  };

  useEffect(() => {
    if (!address) return;
    setTimeout(() => {
      void refreshAll();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onAddCollateral = async () => {
    const amt = parseInput(collateralAmount);
    if (!amt) return;
    setLocalLoadingCollateral(true);
    try {
      await addCollateral(parseEther(amt.toString()));
      setCollateralAmount("");
      await Promise.all([
        refreshHealthFactor(),
        refreshPosition(),
        refreshRepayable(),
      ]);
    } finally {
      setLocalLoadingCollateral(false);
    }
  };

  const onWithdraw = async () => {
    const amt = parseInput(withdrawAmount);
    if (!amt) return;
    setLocalLoadingWithdraw(true);
    try {
      await withdrawCollateral(amt);
      setWithdrawAmount("");
      await Promise.all([
        refreshHealthFactor(),
        refreshPosition(),
        refreshRepayable(),
        refreshLiquidationStatus(),
      ]);
    } finally {
      setLocalLoadingWithdraw(false);
    }
  };

  const onHarvest = async () => {
    setLocalLoadingHarvest(true);
    try {
      await harvestStakingRewards();
      await Promise.all([refreshYield(), refreshPosition()]);
    } finally {
      setLocalLoadingHarvest(false);
    }
  };

  const onSwap = async () => {
    const amt = parseInput(swapAmount);
    if (!amt) return;
    setLocalLoadingSwap(true);
    try {
      await swapOnAPSDEX(parseEther(amt.toString()));
      setSwapAmount("");
      await refreshPoolData();
    } finally {
      setLocalLoadingSwap(false);
    }
  };

  const onDepositToPool = async () => {
    setLocalLoadingDeposit(true);
    try {
      await depositToAPSDEX();
      setDepositEthAmount("");
      setDepositApsAmount("");
      await refreshPoolData();
      if (address) await getProviderLiquidity(address);
    } finally {
      setLocalLoadingDeposit(false);
    }
  };

  const onWithdrawFromPool = async () => {
    const ethAmt = parseInput(withdrawEthAmount);
    const apsAmt = parseInput(withdrawApsAmount);
    if (!ethAmt || !apsAmt) return;
    setLocalLoadingWithdrawPool(true);
    try {
      await withdrawFromAPSDEX(
        parseEther(ethAmt.toString()),
        parseEther(apsAmt.toString()),
      );
      setWithdrawEthAmount("");
      setWithdrawApsAmount("");
      await refreshPoolData();
      if (address) await getProviderLiquidity(address);
    } finally {
      setLocalLoadingWithdrawPool(false);
    }
  };

  const hfStatus = useMemo(() => {
    if (!healthFactor) return { color: "text-gray-400", status: "No Data" };
    const formatted = formatHealthFactor(healthFactor);
    const hf = typeof formatted === "number" ? formatted : null;
    if (hf === null) return { color: "text-gray-400", status: "No Data" };
    if (hf >= 2.0) return { color: "text-emerald-400", status: "Healthy" };
    if (hf >= 1.5) return { color: "text-yellow-400", status: "Caution" };
    if (hf >= 1.1) return { color: "text-orange-400", status: "Risky" };
    return { color: "text-red-400", status: "Critical" };
  }, [healthFactor]);

  const formatValue = (v) => {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return v;
    if (typeof v === "bigint") return Number(v);
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const stakingYieldDisplay = useMemo(() => {
    if (yieldAmount === null || yieldAmount === undefined) return "—";
    const n = formatValue(yieldAmount);
    if (n === null) return String(yieldAmount);
    return n.toFixed(4);
  }, [yieldAmount]);

  const repayableDisplay = useMemo(() => {
    if (repayableAmount === null || repayableAmount === undefined) return "—";
    if (typeof repayableAmount === "number") return repayableAmount.toFixed(4);
    if (typeof repayableAmount === "bigint") return repayableAmount.toString();
    return String(repayableAmount);
  }, [repayableAmount]);

  const currentPriceFormatted = useMemo(() => {
    const p = formatPrice(price);
    return p !== null ? p.toFixed(6) : "—";
  }, [price]);

  const ethReservesFormatted = useMemo(() => {
    const r = formatReserves(ethReserves);
    return r !== null ? r.toFixed(4) : "—";
  }, [ethReserves]);

  const apsReservesFormatted = useMemo(() => {
    const r = formatReserves(tokenReserves);
    return r !== null ? r.toFixed(4) : "—";
  }, [tokenReserves]);

  const totalLiquidityFormatted = useMemo(() => {
    const l = formatReserves(totalLiquidity);
    return l !== null ? l.toFixed(4) : "—";
  }, [totalLiquidity]);

  const providerLiquidityFormatted = useMemo(() => {
    const l = formatReserves(providerLiquidity);
    return l !== null ? l.toFixed(4) : "—";
  }, [providerLiquidity]);

  const collateralETH = positionDetails?.[0]
    ? formatReserves(positionDetails[0])?.toFixed(4)
    : null;

  // Calculate pool utilization
  const poolUtilization = useMemo(() => {
    if (!ethReserves || !tokenReserves) return null;
    const eth = formatReserves(ethReserves);
    const aps = formatReserves(tokenReserves);
    if (eth === null || aps === null) return null;
    // Simplified utilization: APS reserves relative to total value
    const totalValue =
      eth +
      aps *
        (currentPriceFormatted !== "—" ? parseFloat(currentPriceFormatted) : 0);
    if (totalValue === 0) return 0;
    return (aps / totalValue) * 100;
  }, [ethReserves, tokenReserves, currentPriceFormatted]);

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 border rounded-xl font-mono text-xs relative overflow-hidden ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 text-white"
          : "bg-white border-black/5 text-gray-950 shadow-sm"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="border-b border-white/5 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-blue-500" />
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
            Lending & Pool Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-500 uppercase">
            EIP-2535 // LEND_FACET + APSDEX_FACET
          </span>

          <button
            onClick={refreshAll}
            disabled={!address || loading || apsdexLoading}
            className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
              isDarkMode
                ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
            }`}
          >
            <RefreshCw
              size={10}
              className={loading || apsdexLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      <p
        className={`text-xs mb-6 sm:mb-8 max-w-2xl leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Supply collateral, harvest staking yield, and interact with the APSDEX
        pool. This section integrates both lending and DEX facets of the Diamond
        Proxy.
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 border rounded-lg ${
            isDarkMode
              ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span className="font-bold">Error:</span>
            <span className="break-words">{String(error)}</span>
          </div>
        </motion.div>
      )}

      {!address && (
        <div
          className={`mt-2 p-4 rounded-lg text-center text-xs relative z-10 mb-6 ${
            isDarkMode
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
            ◆ Connect your wallet to interact with the lending protocol
          </span>
        </div>
      )}

      {/* Pool Statistics Panel */}
      <div className="mb-6 relative z-10">
        <button
          onClick={() => setShowPoolDetails(!showPoolDetails)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            isDarkMode
              ? "bg-[#1A1F2E]/50 border-[#3B82F6]/20 hover:border-[#3B82F6]/40"
              : "bg-gray-50 border-blue-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              APSDEX Pool Statistics
            </span>
          </div>
          <div className="flex items-center gap-2">
            {localLoadingPoolData && (
              <RefreshCw size={12} className="animate-spin" />
            )}
            <span className="text-[10px] text-gray-500">
              {showPoolDetails ? "▼" : "▶"}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {showPoolDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 p-4 rounded-lg border ${
                  isDarkMode
                    ? "border-white/5 bg-white/[0.01]"
                    : "border-black/5 bg-black/[0.01]"
                }`}
              >
                <StatCard
                  icon={DollarSign}
                  label="ETH/APS Price"
                  value={currentPriceFormatted}
                  suffix="APS"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  icon={Coins}
                  label="ETH Reserves"
                  value={ethReservesFormatted}
                  suffix="ETH"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  icon={Activity}
                  label="APS Reserves"
                  value={apsReservesFormatted}
                  suffix="APS"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  icon={Wallet}
                  label="Total Liquidity"
                  value={totalLiquidityFormatted}
                  suffix="LP"
                  isDarkMode={isDarkMode}
                />
                {address && (
                  <StatCard
                    icon={TrendingUp}
                    label="Your Pool Share"
                    value={providerLiquidityFormatted}
                    suffix="LP Tokens"
                    isDarkMode={isDarkMode}
                  />
                )}
                {poolUtilization !== null && (
                  <StatCard
                    icon={Droplet}
                    label="Pool Utilization"
                    value={poolUtilization.toFixed(2)}
                    suffix="%"
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Lending Section */}
        <div className="space-y-6">
          {/* Supply / Withdrawal */}
          <div
            className={`p-4 sm:p-5 border rounded-lg ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <ArrowDownLeft size={12} className="text-emerald-500" />
                <span>LENDING // COLLATERAL MANAGEMENT</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
                  Deposit Collateral (ETH)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                        : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                    }`}
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                    ETH
                  </span>
                </div>
                <button
                  onClick={onAddCollateral}
                  disabled={
                    !canAct ||
                    !parseInput(collateralAmount) ||
                    localLoadingCollateral
                  }
                  className={`w-full py-2.5 mt-3 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                    !canAct ||
                    !parseInput(collateralAmount) ||
                    localLoadingCollateral
                      ? isDarkMode
                        ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                      : isDarkMode
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {localLoadingCollateral ? (
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin" />{" "}
                      Supplying...
                    </span>
                  ) : (
                    "Supply Collateral"
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
                  Withdraw Collateral (ETH)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                        : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                    }`}
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                    ETH
                  </span>
                </div>
                <button
                  onClick={onWithdraw}
                  disabled={
                    !canAct ||
                    !parseInput(withdrawAmount) ||
                    localLoadingWithdraw
                  }
                  className={`w-full py-2.5 mt-3 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                    !canAct ||
                    !parseInput(withdrawAmount) ||
                    localLoadingWithdraw
                      ? isDarkMode
                        ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                      : isDarkMode
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                        : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                  }`}
                >
                  {localLoadingWithdraw ? (
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin" />{" "}
                      Withdrawing...
                    </span>
                  ) : (
                    "Withdraw Collateral"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Staking Harvest */}
          <div
            className={`p-4 sm:p-5 border rounded-lg ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  <Zap size={12} className="text-blue-500" />
                  <span>STAKING // HARVEST REWARDS</span>
                </div>
              </div>
              <button
                onClick={onHarvest}
                disabled={!canAct || localLoadingHarvest}
                className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                }`}
              >
                <RefreshCw
                  size={10}
                  className={localLoadingHarvest ? "animate-spin" : ""}
                />
                Harvest
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[9px] text-gray-500">Accrued Yield:</span>
              <span
                className={`text-xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
              >
                {stakingYieldDisplay} APS
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-gray-500">
                Collateral Position:
              </span>
              <span className="text-[10px] font-mono">
                {collateralETH || "—"} ETH
              </span>
            </div>
          </div>
        </div>

        {/* Risk Telemetry & Pool Actions */}
        <div className="space-y-6">
          {/* Risk Telemetry */}
          <div
            className={`p-4 sm:p-5 border rounded-lg ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400">
                <Shield size={12} className="text-blue-500" />
                <span>RISK TELEMETRY</span>
              </div>
              <button
                onClick={refreshHealthFactor}
                disabled={!address || localLoadingHF}
                className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                }`}
              >
                <RefreshCw
                  size={10}
                  className={localLoadingHF ? "animate-spin" : ""}
                />
                Sync
              </button>
            </div>

            <div className="text-center py-4">
              <div className={`text-4xl font-bold ${hfStatus.color}`}>
                {healthFactor === null || healthFactor === undefined
                  ? "—"
                  : (() => {
                      const formatted = formatHealthFactor(healthFactor);
                      return formatted ? formatted.toFixed(2) : "—";
                    })()}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Health Factor
              </div>
              <div className={`text-xs mt-1 ${hfStatus.color}`}>
                {hfStatus.status}
              </div>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Liquidation Status:</span>
                <span
                  className={
                    isLiquidatable ? "text-red-400" : "text-emerald-400"
                  }
                >
                  {isLiquidatable === null
                    ? "—"
                    : isLiquidatable
                      ? "ELIGIBLE"
                      : "COMPLIANT"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Repayable Debt:</span>
                <span className="font-mono">{repayableDisplay} APS</span>
              </div>
            </div>
          </div>

          {/* APSDEX Swap */}
          <div
            className={`p-4 sm:p-5 border rounded-lg ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-3">
              <TrendingUp size={12} className="text-blue-500" />
              <span>APSDEX // SWAP TOKENS</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSwapDirection("ethToAps")}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded border transition-all ${
                  swapDirection === "ethToAps"
                    ? isDarkMode
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                      : "bg-blue-100 border-blue-300 text-blue-700"
                    : isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-400"
                      : "bg-black/5 border-black/5 text-gray-500"
                }`}
              >
                ETH → APS
              </button>
              <button
                onClick={() => setSwapDirection("apsToEth")}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded border transition-all ${
                  swapDirection === "apsToEth"
                    ? isDarkMode
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                      : "bg-blue-100 border-blue-300 text-blue-700"
                    : isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-400"
                      : "bg-black/5 border-black/5 text-gray-500"
                }`}
              >
                APS → ETH
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                step="0.01"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                  isDarkMode
                    ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                    : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                }`}
                placeholder={`Amount in ${swapDirection === "ethToAps" ? "ETH" : "APS"}`}
              />
              <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                {swapDirection === "ethToAps" ? "ETH" : "APS"}
              </span>
            </div>

            <button
              onClick={onSwap}
              disabled={!canAct || !parseInput(swapAmount) || localLoadingSwap}
              className={`w-full py-2.5 mt-3 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                !canAct || !parseInput(swapAmount) || localLoadingSwap
                  ? isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
              }`}
            >
              {localLoadingSwap ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin" /> Swapping...
                </span>
              ) : (
                `Swap ${swapDirection === "ethToAps" ? "ETH to APS" : "APS to ETH"}`
              )}
            </button>

            <div className="mt-3 text-center">
              <span className="text-[9px] text-gray-500">
                1 ETH ≈ {currentPriceFormatted} APS
              </span>
            </div>
          </div>

          {/* Pool Liquidity Management */}
          <div
            className={`p-4 sm:p-5 border rounded-lg ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-3">
              <Wallet size={12} className="text-emerald-500" />
              <span>APSDEX // LIQUIDITY POOL</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={onDepositToPool}
                disabled={!canAct || localLoadingDeposit}
                className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  !canAct || localLoadingDeposit
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {localLoadingDeposit ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin" />{" "}
                    Depositing...
                  </span>
                ) : (
                  "Deposit to Pool"
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={withdrawEthAmount}
                  onChange={(e) => setWithdrawEthAmount(e.target.value)}
                  className={`p-2 text-center rounded border outline-none text-xs ${
                    isDarkMode
                      ? "bg-[#090A0F] border-white/5 text-white"
                      : "bg-white border-black/5 text-gray-950"
                  }`}
                  placeholder="ETH amount"
                />
                <input
                  type="number"
                  step="0.01"
                  value={withdrawApsAmount}
                  onChange={(e) => setWithdrawApsAmount(e.target.value)}
                  className={`p-2 text-center rounded border outline-none text-xs ${
                    isDarkMode
                      ? "bg-[#090A0F] border-white/5 text-white"
                      : "bg-white border-black/5 text-gray-950"
                  }`}
                  placeholder="APS amount"
                />
              </div>

              <button
                onClick={onWithdrawFromPool}
                disabled={
                  !canAct ||
                  !parseInput(withdrawEthAmount) ||
                  !parseInput(withdrawApsAmount) ||
                  localLoadingWithdrawPool
                }
                className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  !canAct ||
                  !parseInput(withdrawEthAmount) ||
                  !parseInput(withdrawApsAmount) ||
                  localLoadingWithdrawPool
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                      : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                }`}
              >
                {localLoadingWithdrawPool ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin" />{" "}
                    Withdrawing...
                  </span>
                ) : (
                  "Withdraw from Pool"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper StatCard Component
const StatCard = ({ icon: Icon, label, value, suffix, isDarkMode }) => (
  <div
    className={`p-3 rounded-lg border ${isDarkMode ? "border-white/5 bg-black/20" : "border-black/5 bg-white/50"}`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-blue-500" />
      <span className="text-[9px] text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-lg font-bold">
      {value}{" "}
      <span className="text-[9px] font-normal text-gray-500">{suffix}</span>
    </div>
  </div>
);

export default LendingSection;
