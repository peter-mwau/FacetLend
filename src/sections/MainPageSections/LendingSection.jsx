// components/sections/LendingSection.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useActiveAccount } from "thirdweb/react";
import {
  Shield,
  RefreshCw,
  Zap,
  ArrowDownLeft,
  Briefcase,
  AlertTriangle,
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

  const canAct = useMemo(() => !!address && !loading, [address, loading]);

  const [collateralAmount, setCollateralAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [localLoadingCollateral, setLocalLoadingCollateral] = useState(false);
  const [localLoadingWithdraw, setLocalLoadingWithdraw] = useState(false);
  const [localLoadingHarvest, setLocalLoadingHarvest] = useState(false);

  const [localLoadingHF, setLocalLoadingHF] = useState(false);
  const [localLoadingLiquidation, setLocalLoadingLiquidation] = useState(false);
  const [localLoadingYield, setLocalLoadingYield] = useState(false);

  const [localLoadingRepayable, setLocalLoadingRepayable] = useState(false);

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

  const refreshAll = async () => {
    // Load in parallel; each read function updates its own state in context.
    await Promise.all([
      refreshHealthFactor(),
      refreshLiquidationStatus(),
      refreshYield(),
      refreshPosition(),
      refreshRepayable(),
    ]);
  };

  useEffect(() => {
    if (!address) return;
    // Defer to next tick to avoid cascading render warnings from sync state updates.
    setTimeout(() => {
      void refreshAll();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onAddCollateral = async () => {
    const amt = parseInput(collateralAmount);
    console.log("Parsed collateral amount:", amt);
    console.log("Raw collateral input:", typeof Number(amt));
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

  const collateralETH = positionDetails?.[0]
    ? positionDetails[0].toString()
    : null;

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 border rounded-xl font-mono text-xs relative overflow-hidden mt-12 ${
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
            Lending Pool Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-500 uppercase">
            EIP-2535 // LEND_FACET
          </span>

          <button
            onClick={refreshAll}
            disabled={!address || loading}
            className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
              isDarkMode
                ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
            }`}
          >
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <p
        className={`text-xs mb-6 sm:mb-8 max-w-2xl leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Supply collateral, harvest staking yield, and monitor your account’s
        risk telemetry. This section uses the lending facet functions exposed by{" "}
        <span className="text-blue-400">LendingContext</span>.
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
          className={`mt-2 p-4 rounded-lg text-center text-xs relative z-10 ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
        {/* Supply / Withdrawal */}
        <div
          className={`p-4 sm:p-5 border rounded-lg flex flex-col justify-between min-h-[230px] ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-black/[0.01] border-black/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <ArrowDownLeft size={12} className="text-emerald-500" />
                <span>STAGE_01 // SUPPLY_COLLATERAL</span>
              </div>
            </div>

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
              className={`w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                !canAct ||
                !parseInput(collateralAmount) ||
                localLoadingCollateral
                  ? isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {localLoadingCollateral ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin" /> Supplying...
                </span>
              ) : (
                "Authorize Collateral"
              )}
            </button>
          </div>

          <div
            className={`mt-4 pt-4 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}
          >
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
                !canAct || !parseInput(withdrawAmount) || localLoadingWithdraw
              }
              className={`w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                !canAct || !parseInput(withdrawAmount) || localLoadingWithdraw
                  ? isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40"
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

        {/* Yield / Risk telemetry */}
        <div className="grid grid-rows-2 gap-4 sm:gap-6">
          <div
            className={`p-4 sm:p-5 border rounded-lg flex flex-col min-h-[230px] ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  <Zap size={12} className="text-blue-500" />
                  <span>STAGE_03 // STAKING_HARVEST</span>
                </div>
                <p className="text-[10px] text-gray-500 tracking-tight">
                  Harvest staking rewards accrued by your collateral position.
                </p>
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

            <div className="flex-1 flex items-center justify-center mt-4">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
                >
                  {stakingYieldDisplay}
                </div>
                <div className="text-[9px] text-gray-500 mt-2">APS_YIELD</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                onClick={refreshYield}
                disabled={!address || localLoadingYield}
                className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                }`}
              >
                <RefreshCw
                  size={10}
                  className={localLoadingYield ? "animate-spin" : ""}
                />
                Query
              </button>
              <div className="text-[9px] text-gray-500">
                Position: {collateralETH ? "ACTIVE" : "—"}
              </div>
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 border rounded-lg flex flex-col min-h-[230px] ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-black/[0.01] border-black/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  <Shield size={12} className="text-blue-500" />
                  <span>STAGE_04 // RISK_TELEMETRY</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  Health Factor & Liquidation State
                </span>
              </div>

              <div className="flex items-center gap-2">
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
            </div>

            <div className="flex-1 flex items-center justify-center mt-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${hfStatus.color}`}>
                  {healthFactor === null || healthFactor === undefined
                    ? "—"
                    : (() => {
                        const formatted = formatHealthFactor(healthFactor);
                        return formatted ? formatted.toFixed(2) : "—";
                      })()}
                </div>
                <div className="text-[9px] text-gray-500 mt-2">
                  {hfStatus.status}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="text-[9px] text-gray-500">
                Liquidation:{" "}
                {isLiquidatable === null || isLiquidatable === undefined
                  ? "—"
                  : isLiquidatable
                    ? "ELIGIBLE"
                    : "COMPLIANT"}
              </div>
              <button
                onClick={refreshLiquidationStatus}
                disabled={!address || localLoadingLiquidation}
                className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                }`}
              >
                <RefreshCw
                  size={10}
                  className={localLoadingLiquidation ? "animate-spin" : ""}
                />
                Query
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-[9px] text-gray-500">
                Repayable Amount (Debt):
                <span className="ml-2 font-bold text-gray-950 dark:text-white">
                  {repayableDisplay}
                </span>
              </div>
              <button
                onClick={refreshRepayable}
                disabled={!address || localLoadingRepayable}
                className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                }`}
              >
                <RefreshCw
                  size={10}
                  className={localLoadingRepayable ? "animate-spin" : ""}
                />
                Query
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden panel for future expansion */}
    </div>
  );
}

export default LendingSection;
