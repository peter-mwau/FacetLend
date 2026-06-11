// components/sections/BorrowingSection.jsx
import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAPS } from "../../hooks/useAPS";
import {
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Eye,
  EyeOff,
  PlusCircle,
} from "lucide-react";

function BorrowingSection() {
  const { isDarkMode } = useDarkMode();
  const { address } = useActiveAccount();

  const {
    addCollateral,
    borrowAPS,
    repayAPS,
    getHealthFactor,
    getRepayableAmount,
    loading,
  } = useLending();

  const { mintTokens, burnTokens, getTokenBalance } = useAPS();

  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");

  // APS testing/dev-tool state
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [tokenBalanceForSelf, setTokenBalanceForSelf] = useState(null);
  const [localLoadingBurn, setLocalLoadingBurn] = useState(false);
  const [localLoadingBalance, setLocalLoadingBalance] = useState(false);

  const [showDevTools, setShowDevTools] = useState(false);

  const [healthFactor, setHealthFactor] = useState(null);
  const [repayableAmount, setRepayableAmount] = useState(null);
  const [localLoadingHF, setLocalLoadingHF] = useState(false);
  const [localLoadingRepayable, setLocalLoadingRepayable] = useState(false);
  const [localLoadingMint, setLocalLoadingMint] = useState(false);

  const canAct = useMemo(() => !!address && !loading, [address, loading]);

  const parseInput = (v) => {
    const trimmed = String(v).trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  };

  const refreshHealthFactor = async () => {
    if (!address) return;
    setLocalLoadingHF(true);
    try {
      const hf = await getHealthFactor(address);
      setHealthFactor(hf);
    } catch (error) {
      console.error("Error fetching health factor:", error);
    } finally {
      setLocalLoadingHF(false);
    }
  };

  const refreshRepayableAmount = async () => {
    if (!address) return;
    setLocalLoadingRepayable(true);
    try {
      const amt = await getRepayableAmount(address);
      setRepayableAmount(amt);
    } catch (error) {
      console.error("Error fetching repayable amount:", error);
    } finally {
      setLocalLoadingRepayable(false);
    }
  };

  const refreshTokenBalance = async () => {
    if (!address) return;
    setLocalLoadingBalance(true);
    try {
      const bal = await getTokenBalance(address);
      setTokenBalanceForSelf(bal);
    } catch (e) {
      console.error("Error refreshing APS balance:", e);
    } finally {
      setLocalLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (!address) return;

    const t = setTimeout(() => {
      Promise.all([
        refreshHealthFactor(),
        refreshRepayableAmount(),
        refreshTokenBalance(),
      ]);
    }, 0);

    return () => clearTimeout(t);
    // Intentionally not listing helper functions to match existing code style.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onAddCollateral = async () => {
    const amt = parseInput(collateralAmount);
    if (!amt) return;
    await addCollateral(amt);
    setCollateralAmount("");
    await Promise.all([refreshHealthFactor(), refreshRepayableAmount()]);
  };

  const onBorrow = async () => {
    const amt = parseInput(borrowAmount);
    if (!amt) return;
    await borrowAPS(amt);
    setBorrowAmount("");
    await Promise.all([refreshHealthFactor(), refreshRepayableAmount()]);
  };

  const onRepay = async () => {
    await repayAPS();
    await Promise.all([refreshHealthFactor(), refreshRepayableAmount()]);
  };

  const onMintAPS = async () => {
    const amt = parseInput(mintAmount);
    if (!amt) return;
    setLocalLoadingMint(true);
    try {
      await mintTokens(address, amt);
      setMintAmount("");
      await refreshHealthFactor();
      await refreshRepayableAmount();
      await refreshTokenBalance();
    } catch (error) {
      console.error("Error minting APS:", error);
    } finally {
      setLocalLoadingMint(false);
    }
  };

  const onBurnAPS = async () => {
    const amt = parseInput(burnAmount);
    if (!amt) return;
    setLocalLoadingBurn(true);
    try {
      await burnTokens(address, amt);
      setBurnAmount("");
      await refreshHealthFactor();
      await refreshRepayableAmount();
      await refreshTokenBalance();
    } catch (error) {
      console.error("Error burning APS:", error);
    } finally {
      setLocalLoadingBurn(false);
    }
  };

  // Determine health factor color and status
  const getHealthFactorStatus = () => {
    if (!healthFactor) return { color: "text-gray-400", status: "No Data" };
    if (healthFactor >= 2.0)
      return { color: "text-emerald-400", status: "Healthy" };
    if (healthFactor >= 1.5)
      return { color: "text-yellow-400", status: "Caution" };
    if (healthFactor >= 1.1)
      return { color: "text-orange-400", status: "Risky" };
    return { color: "text-red-400", status: "Critical" };
  };

  const healthStatus = getHealthFactorStatus();

  // Helper function to format health factor from bigint
  const formatHealthFactor = (hf) => {
    if (hf === null || hf === undefined) return null;

    const rawValue = typeof hf === "bigint" ? Number(hf) : Number(hf);
    const divisor = 10 ** 18;
    const formattedValue = rawValue / divisor;
    return formattedValue;
  };

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

      <div className="border-b border-white/5 pb-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-500" />
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
            Margin Transaction Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-500 uppercase">
            EIP-2535 // FACET_ROUTING
          </span>
          <button
            onClick={() => setShowDevTools(!showDevTools)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? "hover:bg-yellow-500/10 text-yellow-500"
                : "hover:bg-yellow-500/10 text-yellow-600"
            }`}
            title="Developer Tools"
          >
            {showDevTools ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <p
        className={`text-xs mb-6 sm:mb-8 max-w-2xl leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        Execute cryptographic state mutations on the money market. Allocate
        baseline collateral parameters, mint asset debt fractions, and monitor
        risk profiles natively.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
        <div
          className={`p-4 sm:p-5 border rounded-lg flex flex-col justify-between min-h-[220px] ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-black/[0.01] border-black/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <ArrowDownLeft size={12} className="text-emerald-500" />
                <span>STAGE_01 // ESCROW_ALLOCATION</span>
              </div>
            </div>

            <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
              Collateral Deposit Volume
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
          </div>

          <button
            onClick={onAddCollateral}
            disabled={!canAct || !parseInput(collateralAmount)}
            className={`w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct || !parseInput(collateralAmount)
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            Authorize Collateral
          </button>
        </div>

        <div
          className={`p-4 sm:p-5 border rounded-lg flex flex-col justify-between min-h-[220px] ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-black/[0.01] border-black/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight size={12} className="text-blue-500" />
                <span>STAGE_02 // LIQUIDITY_DRAWDOWN</span>
              </div>
            </div>

            <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
              Debt Issuance Target
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.01"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                  isDarkMode
                    ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                    : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                APS
              </span>
            </div>
          </div>

          <button
            onClick={onBorrow}
            disabled={!canAct || !parseInput(borrowAmount)}
            className={`w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct || !parseInput(borrowAmount)
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40"
                  : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Draw Asset Debt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 relative z-10">
        <div
          className={`p-4 sm:p-5 border rounded-lg flex flex-col min-h-[180px] ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-black/[0.01] border-black/5"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                <ShieldCheck size={12} className="text-blue-500" />
                <span>STAGE_03 // RISK_TELEMETRY</span>
              </div>
              Safe Threshold {">"} 1.50x
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

          <div className="flex-1 flex items-center justify-center mt-3">
            <div className="text-center">
              <div className={`text-3xl font-bold ${healthStatus.color}`}>
                {healthFactor === null || healthFactor === undefined
                  ? "—"
                  : (() => {
                      const formatted = formatHealthFactor(healthFactor);
                      return formatted ? formatted.toFixed(2) : "—";
                    })()}
              </div>
              <div className="text-[9px] text-gray-500 mt-2">HF_SCORE</div>
            </div>
          </div>
        </div>

        <div
          className={`p-4 sm:p-5 border rounded-lg flex flex-col min-h-[180px] ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-black/[0.01] border-black/5"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                <Layers size={12} className="text-rose-500" />
                <span>STAGE_04 // DEBT_SETTLEMENT</span>
              </div>
              <p className="text-[10px] text-gray-500 tracking-tight">
                Clear outstanding protocol liability registry entries entirely.
              </p>
            </div>

            <button
              onClick={refreshRepayableAmount}
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

          <div className="flex-1 flex items-center justify-between gap-4 mt-3 flex-wrap">
            <div className="text-center flex-1">
              <div className="text-xl font-bold">
                {repayableAmount === null || repayableAmount === undefined
                  ? "—"
                  : typeof repayableAmount === "number"
                    ? repayableAmount.toFixed(4)
                    : repayableAmount.toString()}
              </div>
              <div className="text-[9px] text-gray-500 mt-1">APS_DEBT</div>
            </div>

            <button
              onClick={onRepay}
              disabled={
                !canAct || !repayableAmount || Number(repayableAmount) <= 0
              }
              className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider rounded border transition-all duration-200 ${
                !canAct || !repayableAmount || Number(repayableAmount) <= 0
                  ? isDarkMode
                    ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-black/5 border-black/5 text-gray-400 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40"
                    : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              }`}
            >
              Liquidate Total Debt
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDevTools && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 p-4 sm:p-5 rounded-lg border-2 border-dashed relative z-10 ${
              isDarkMode
                ? "bg-yellow-500/5 border-yellow-500/30"
                : "bg-yellow-500/5 border-yellow-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle size={16} className="text-yellow-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                Developer Tools // APS Minting Facet
              </span>
              <span className="text-[8px] text-gray-500 ml-auto">
                TESTNET ONLY
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
                    Mint APS Tokens (Testing)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                        isDarkMode
                          ? "bg-[#090A0F] border-yellow-500/30 text-white focus:border-yellow-500"
                          : "bg-white border-yellow-500/30 text-gray-950 focus:border-yellow-500"
                      }`}
                      placeholder="Amount to mint"
                    />
                    <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                      APS
                    </span>
                  </div>
                </div>

                <button
                  onClick={onMintAPS}
                  disabled={
                    !canAct || !parseInput(mintAmount) || localLoadingMint
                  }
                  className={`w-full sm:w-auto px-6 py-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                    !canAct || !parseInput(mintAmount) || localLoadingMint
                      ? isDarkMode
                        ? "bg-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-black/5 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-500 text-black hover:bg-yellow-400 font-bold shadow-lg hover:shadow-xl"
                  }`}
                >
                  {localLoadingMint ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin" />
                      Minting...
                    </div>
                  ) : (
                    "◆ Mint APS Tokens"
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">
                    Burn APS Tokens (Testing)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(e.target.value)}
                      className={`w-full p-3 font-bold pr-12 rounded-lg border outline-none font-mono ${
                        isDarkMode
                          ? "bg-[#090A0F] border-rose-500/30 text-white focus:border-rose-500"
                          : "bg-white border-rose-500/30 text-gray-950 focus:border-rose-500"
                      }`}
                      placeholder="Amount to burn"
                    />
                    <span className="absolute right-4 text-[10px] text-gray-500 font-bold">
                      APS
                    </span>
                  </div>
                </div>

                <button
                  onClick={onBurnAPS}
                  disabled={
                    !canAct || !parseInput(burnAmount) || localLoadingBurn
                  }
                  className={`w-full sm:w-auto px-6 py-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                    !canAct || !parseInput(burnAmount) || localLoadingBurn
                      ? isDarkMode
                        ? "bg-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-black/5 text-gray-400 cursor-not-allowed"
                      : "bg-rose-500 text-black hover:bg-rose-400 font-bold shadow-lg hover:shadow-xl"
                  }`}
                >
                  {localLoadingBurn ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin" />
                      Burning...
                    </div>
                  ) : (
                    "◆ Burn APS Tokens"
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="text-[9px] text-gray-500">
                  Wallet APS balance:
                  <span className="ml-2 font-bold text-gray-950 dark:text-white">
                    {tokenBalanceForSelf === null ||
                    tokenBalanceForSelf === undefined
                      ? "—"
                      : tokenBalanceForSelf.toString()}
                  </span>
                </div>

                <button
                  onClick={refreshTokenBalance}
                  disabled={!address || localLoadingBalance}
                  className={`p-2 rounded border text-[9px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
                  }`}
                >
                  <RefreshCw
                    size={10}
                    className={localLoadingBalance ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              <div className="mt-1 text-[8px] text-yellow-500/70 text-center">
                ⚠️ For testing purposes only. This mints/burns test APS tokens
                on the testnet.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!address && (
        <div
          className={`mt-6 p-4 rounded-lg text-center text-xs relative z-10 ${
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
    </div>
  );
}

export default BorrowingSection;
