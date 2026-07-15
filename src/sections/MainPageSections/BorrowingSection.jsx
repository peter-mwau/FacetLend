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
  AlertTriangle,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { parseEther, formatEther } from "viem";
import { toast } from "react-toastify";
import { useAPSDEX } from "../../contexts/APSDEXContext";

function BorrowingSection() {
  const { isDarkMode } = useDarkMode();
  const { address } = useActiveAccount();

  const {
    addCollateral,
    withdrawCollateral,
    borrowAPS,
    repayAPS,
    getHealthFactor,
    getRepayableAmount,
    getPositionDetails,
    loading,
    healthFactor: contextHealthFactor,
    repayableAmount: contextRepayableAmount,
    positionDetails,
  } = useLending();
  const { price } = useAPSDEX();

  const { mintTokens, burnTokens, getTokenBalance } = useAPS();

  // Form states
  const [collateralAmount, setCollateralAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");

  // APS testing/dev-tool state
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);

  // Loading states
  const [localLoadingCollateral, setLocalLoadingCollateral] = useState(false);
  const [localLoadingWithdraw, setLocalLoadingWithdraw] = useState(false);
  const [localLoadingBorrow, setLocalLoadingBorrow] = useState(false);
  const [localLoadingRepay, setLocalLoadingRepay] = useState(false);
  const [localLoadingMint, setLocalLoadingMint] = useState(false);
  const [localLoadingBurn, setLocalLoadingBurn] = useState(false);
  const [localLoadingBalance, setLocalLoadingBalance] = useState(false);

  const [showDevTools, setShowDevTools] = useState(false);

  // Local state for health factor and repayable
  const [localHealthFactor, setLocalHealthFactor] = useState(null);
  const [localRepayableAmount, setLocalRepayableAmount] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  const canAct = useMemo(() => !!address && !loading, [address, loading]);

  const parseInput = (v) => {
    const trimmed = String(v).trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  };

  const getETHPerAPS = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);

    // LendingFacet.currentPrice() returns ETH per APS with 18 decimals.
    return raw / 1e18;
  };

  // Fetch user position
  const fetchUserPosition = async () => {
    if (!address) return;
    try {
      const position = await getPositionDetails(address);
      if (position) {
        const collateral = position.collateralETH
          ? formatEther(position.collateralETH)
          : "0";
        const borrowed = position.borrowedAPS
          ? formatEther(position.borrowedAPS)
          : "0";
        setUserPosition({
          collateralETH: parseFloat(collateral),
          borrowedAPS: parseFloat(borrowed),
          raw: position,
        });
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    }
  };

  const refreshHealthFactor = async () => {
    if (!address) return;
    try {
      const hf = await getHealthFactor(address);
      setLocalHealthFactor(hf);
    } catch (error) {
      console.error("Error fetching health factor:", error);
    }
  };

  const refreshRepayableAmount = async () => {
    if (!address) return;
    try {
      const amt = await getRepayableAmount(address);
      setLocalRepayableAmount(amt);
    } catch (error) {
      console.error("Error fetching repayable amount:", error);
    }
  };

  const refreshTokenBalance = async () => {
    if (!address) return;
    setLocalLoadingBalance(true);
    try {
      const bal = await getTokenBalance(address);
      setTokenBalance(bal);
    } catch (e) {
      console.error("Error refreshing APS balance:", e);
    } finally {
      setLocalLoadingBalance(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchUserPosition(),
      refreshHealthFactor(),
      refreshRepayableAmount(),
      refreshTokenBalance(),
    ]);
  };

  useEffect(() => {
    if (!address) return;
    refreshAll();
  }, [address]);

  // Add Collateral
  const onAddCollateral = async () => {
    const amt = parseInput(collateralAmount);
    if (!amt) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLocalLoadingCollateral(true);
    try {
      const amountInWei = parseEther(amt.toString());
      await addCollateral(amountInWei);
      setCollateralAmount("");
      await refreshAll();
      toast.success(`Added ${amt} ETH as collateral`);
    } catch (error) {
      console.error("Error adding collateral:", error);
      toast.error(error.message || "Failed to add collateral");
    } finally {
      setLocalLoadingCollateral(false);
    }
  };

  // Withdraw Collateral
  const onWithdrawCollateral = async () => {
    const amt = parseInput(withdrawAmount);
    if (!amt) {
      toast.error("Please enter a valid amount");
      return;
    }

    const maxWithdraw = userPosition?.collateralETH || 0;
    if (amt > maxWithdraw) {
      toast.error(`You only have ${maxWithdraw.toFixed(4)} ETH to withdraw`);
      return;
    }

    setLocalLoadingWithdraw(true);
    try {
      const amountInWei = parseEther(amt.toString());
      await withdrawCollateral(amountInWei);
      setWithdrawAmount("");
      await refreshAll();
      toast.success(`Withdrew ${amt} ETH collateral`);
    } catch (error) {
      console.error("Error withdrawing collateral:", error);
      toast.error(error.message || "Failed to withdraw collateral");
    } finally {
      setLocalLoadingWithdraw(false);
    }
  };

  // Borrow APS
  const onBorrow = async () => {
    const amt = parseInput(borrowAmount);
    if (!amt) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if user has collateral first
    if (!userPosition || userPosition.collateralETH <= 0) {
      toast.error("You need to add collateral first before borrowing");
      return;
    }

    // Check if user has enough collateral for the borrow amount
    const collateralETH = userPosition.collateralETH;
    const ethPerAPS = getETHPerAPS();
    const maxBorrowETH = collateralETH / 1.2; // 120% collateral ratio
    const maxBorrowAPS = ethPerAPS > 0 ? maxBorrowETH / ethPerAPS : 0;

    if (amt > maxBorrowAPS) {
      toast.error(
        `Maximum borrow is ${maxBorrowAPS.toFixed(0)} APS with your current collateral`,
      );
      return;
    }

    setLocalLoadingBorrow(true);
    try {
      const amountInWei = parseEther(amt.toString());
      await borrowAPS(amountInWei);
      setBorrowAmount("");
      await refreshAll();
      toast.success(`Borrowed ${amt} APS`);
    } catch (error) {
      console.error("Error borrowing:", error);
      // Better error messages
      if (error.message?.includes("Insufficient collateral")) {
        toast.error("You don't have enough collateral. Add more ETH first.");
      } else if (error.message?.includes("Protocol lacks liquidity")) {
        toast.error("The lending pool doesn't have enough APS right now");
      } else {
        toast.error(error.message || "Failed to borrow APS");
      }
    } finally {
      setLocalLoadingBorrow(false);
    }
  };

  // Repay Loan
  const onRepay = async () => {
    const repayAmount = getRepayableAmountDisplay();
    if (!repayAmount || repayAmount <= 0) {
      toast.info("No debt to repay");
      return;
    }

    // Check if user has enough APS to repay
    const tokenBalanceNum = tokenBalance
      ? parseFloat(formatEther(tokenBalance))
      : 0;
    if (tokenBalanceNum < repayAmount) {
      toast.error(
        `You need ${repayAmount.toFixed(4)} APS to repay. You have ${tokenBalanceNum.toFixed(4)} APS`,
      );
      return;
    }

    setLocalLoadingRepay(true);
    try {
      await repayAPS();
      await refreshAll();
      toast.success(`Repaid ${repayAmount.toFixed(4)} APS`);
    } catch (error) {
      console.error("Error repaying:", error);
      toast.error(error.message || "Failed to repay loan");
    } finally {
      setLocalLoadingRepay(false);
    }
  };

  // Mint APS (Dev Tool)
  const onMintAPS = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLocalLoadingMint(true);
    try {
      const amt = parseEther(mintAmount.toString());
      await mintTokens(address, amt);
      setMintAmount("");
      await refreshAll();
      toast.success(`Minted ${mintAmount} APS`);
    } catch (error) {
      console.error("Error minting APS:", error);
      toast.error(error.message || "Failed to mint APS");
    } finally {
      setLocalLoadingMint(false);
    }
  };

  // Burn APS (Dev Tool)
  const onBurnAPS = async () => {
    if (!burnAmount || parseFloat(burnAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLocalLoadingBurn(true);
    try {
      const amt = parseEther(burnAmount.toString());
      await burnTokens(address, amt);
      setBurnAmount("");
      await refreshAll();
      toast.success(`Burned ${burnAmount} APS`);
    } catch (error) {
      console.error("Error burning APS:", error);
      toast.error(error.message || "Failed to burn APS");
    } finally {
      setLocalLoadingBurn(false);
    }
  };

  const formatHealthFactor = (hf) => {
    if (hf === null || hf === undefined) return null;
    const raw = typeof hf === "bigint" ? Number(hf) : Number(hf);
    return raw / 1e18;
  };

  const getHealthFactorStatus = () => {
    const hf = formatHealthFactor(localHealthFactor);
    if (hf === null)
      return { color: "text-gray-400", status: "No Data", emoji: "—" };
    if (hf >= 2.0)
      return { color: "text-emerald-400", status: "Healthy", emoji: "✅" };
    if (hf >= 1.5)
      return { color: "text-yellow-400", status: "Caution", emoji: "⚠️" };
    if (hf >= 1.1)
      return { color: "text-orange-400", status: "Risky", emoji: "⚠️" };
    return { color: "text-red-400", status: "Critical", emoji: "🚨" };
  };

  const getRepayableAmountDisplay = () => {
    if (localRepayableAmount === null || localRepayableAmount === undefined)
      return 0;
    if (typeof localRepayableAmount === "bigint") {
      return parseFloat(formatEther(localRepayableAmount));
    }
    return typeof localRepayableAmount === "number"
      ? localRepayableAmount
      : parseFloat(localRepayableAmount) || 0;
  };

  const healthStatus = getHealthFactorStatus();
  const displayHF = formatHealthFactor(localHealthFactor);
  const displayRepayable = getRepayableAmountDisplay();

  // Check if user has a position
  const hasPosition = userPosition && userPosition.collateralETH > 0;
  const hasDebt = userPosition && userPosition.borrowedAPS > 0;

  // Calculate max borrow for display
  const maxBorrowAPS = hasPosition
    ? (() => {
        const ethPerAPS = getETHPerAPS();
        return ethPerAPS > 0 ? userPosition.collateralETH / 1.2 / ethPerAPS : 0;
      })()
    : 0;

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 border rounded-xl text-sm relative overflow-hidden mt-12 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 text-white"
          : "bg-white border-gray-200 text-gray-900 shadow-sm"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Header */}
      <div
        className="border-b pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-blue-500" />
          <span
            className={`text-[10px] uppercase font-bold tracking-widest ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Borrow & Lend
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase text-gray-500">
            EIP-2535 // Diamond Proxy
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
            {showDevTools ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Position Summary */}
      {address && hasPosition && (
        <div
          className={`p-4 rounded-lg border mb-6 ${
            isDarkMode
              ? "border-blue-500/20 bg-blue-500/5"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400">
              Your Position
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="text-[10px] text-gray-500">Collateral</div>
              <div className="font-bold">
                {userPosition.collateralETH.toFixed(4)} ETH
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Borrowed</div>
              <div className="font-bold text-yellow-500">
                {userPosition.borrowedAPS.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                APS
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Health Factor</div>
              <div className={`font-bold ${healthStatus.color}`}>
                {displayHF !== null ? displayHF.toFixed(2) : "—"}x
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Status</div>
              <div className={`font-bold ${healthStatus.color}`}>
                {healthStatus.emoji} {healthStatus.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Add Collateral */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownLeft size={16} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Add Collateral
            </span>
          </div>

          <label className="text-xs text-gray-500 block mb-2">
            Amount of ETH to deposit
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.01"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className={`w-full p-3 font-bold pr-16 rounded-lg border outline-none ${
                isDarkMode
                  ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                  : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="0.00"
            />
            <span className="absolute right-4 text-sm text-gray-500 font-bold">
              ETH
            </span>
          </div>

          <button
            onClick={onAddCollateral}
            disabled={
              !canAct || !parseInput(collateralAmount) || localLoadingCollateral
            }
            className={`w-full py-3 mt-4 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct || !parseInput(collateralAmount) || localLoadingCollateral
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {localLoadingCollateral ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Depositing...
              </span>
            ) : (
              "Deposit Collateral"
            )}
          </button>
        </div>

        {/* Withdraw Collateral */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight size={16} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Withdraw Collateral
            </span>
          </div>

          <label className="text-xs text-gray-500 block mb-2">
            Amount of ETH to withdraw
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className={`w-full p-3 font-bold pr-16 rounded-lg border outline-none ${
                isDarkMode
                  ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                  : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="0.00"
            />
            <span className="absolute right-4 text-sm text-gray-500 font-bold">
              ETH
            </span>
          </div>
          {hasPosition && (
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">
                Max: {userPosition.collateralETH.toFixed(4)} ETH
              </span>
              <button
                onClick={() =>
                  setWithdrawAmount(userPosition.collateralETH.toString())
                }
                className="text-[10px] text-blue-500 hover:text-blue-600"
              >
                Max
              </button>
            </div>
          )}

          <button
            onClick={onWithdrawCollateral}
            disabled={
              !canAct ||
              !parseInput(withdrawAmount) ||
              localLoadingWithdraw ||
              !hasPosition
            }
            className={`w-full py-3 mt-4 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct ||
              !parseInput(withdrawAmount) ||
              localLoadingWithdraw ||
              !hasPosition
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                  : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
            }`}
          >
            {localLoadingWithdraw ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Withdrawing...
              </span>
            ) : (
              "Withdraw Collateral"
            )}
          </button>
        </div>
      </div>

      {/* Borrow & Repay Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 relative z-10">
        {/* Borrow APS */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight size={16} className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Borrow APS
            </span>
          </div>

          <label className="text-xs text-gray-500 block mb-2">
            Amount of APS to borrow
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="100"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className={`w-full p-3 font-bold pr-16 rounded-lg border outline-none ${
                isDarkMode
                  ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                  : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
              }`}
              placeholder="0.00"
            />
            <span className="absolute right-4 text-sm text-gray-500 font-bold">
              APS
            </span>
          </div>

          {hasPosition && (
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">
                Max borrow: {maxBorrowAPS.toFixed(0)} APS
              </span>
              <button
                onClick={() =>
                  setBorrowAmount(Math.floor(maxBorrowAPS).toString())
                }
                className="text-[10px] text-blue-500 hover:text-blue-600"
              >
                Max
              </button>
            </div>
          )}

          <button
            onClick={onBorrow}
            disabled={
              !canAct ||
              !parseInput(borrowAmount) ||
              localLoadingBorrow ||
              !hasPosition
            }
            className={`w-full py-3 mt-4 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct ||
              !parseInput(borrowAmount) ||
              localLoadingBorrow ||
              !hasPosition
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20"
                  : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            }`}
          >
            {localLoadingBorrow ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Borrowing...
              </span>
            ) : (
              "Borrow APS"
            )}
          </button>

          {!hasPosition && address && (
            <p className="text-[10px] text-yellow-500 mt-2 flex items-center gap-1">
              <AlertTriangle size={12} />
              You need to add collateral first before borrowing
            </p>
          )}
        </div>

        {/* Repay Loan */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Repay Loan
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Total Debt:</span>
            <span className="font-bold text-rose-500">
              {displayRepayable > 0 ? displayRepayable.toFixed(4) : "0.0000"}{" "}
              APS
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Health Factor:</span>
            <span className={`font-bold ${healthStatus.color}`}>
              {displayHF !== null ? displayHF.toFixed(2) : "—"}x
            </span>
          </div>

          {tokenBalance && (
            <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
              <span>Your APS Balance:</span>
              <span className="font-mono">
                {parseFloat(formatEther(tokenBalance)).toFixed(4)} APS
              </span>
            </div>
          )}

          <button
            onClick={onRepay}
            disabled={
              !canAct || localLoadingRepay || !hasDebt || displayRepayable <= 0
            }
            className={`w-full py-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
              !canAct || localLoadingRepay || !hasDebt || displayRepayable <= 0
                ? isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : isDarkMode
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                  : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
            }`}
          >
            {localLoadingRepay ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Repaying...
              </span>
            ) : (
              "Repay All Debt"
            )}
          </button>

          {!hasDebt && address && (
            <p className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1">
              <CheckCircle size={12} />
              No debt to repay
            </p>
          )}

          {hasDebt &&
            tokenBalance &&
            parseFloat(formatEther(tokenBalance)) < displayRepayable && (
              <p className="text-[10px] text-yellow-500 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                You need {displayRepayable.toFixed(4)} APS to repay. You have{" "}
                {parseFloat(formatEther(tokenBalance)).toFixed(4)} APS
              </p>
            )}
        </div>
      </div>

      {/* Developer Tools */}
      <AnimatePresence>
        {showDevTools && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 p-5 rounded-lg border-2 border-dashed relative z-10 ${
              isDarkMode
                ? "bg-yellow-500/5 border-yellow-500/30"
                : "bg-yellow-50 border-yellow-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle size={16} className="text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                Developer Tools
              </span>
              <span className="text-[9px] text-gray-500 ml-auto">
                TESTNET ONLY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mint */}
              <div>
                <label className="text-xs text-gray-500 block mb-2">
                  Mint APS Tokens
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="100"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className={`flex-1 p-2 rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-[#090A0F] border-yellow-500/30 text-white focus:border-yellow-500"
                        : "bg-white border-yellow-300 text-gray-900 focus:border-yellow-500"
                    }`}
                    placeholder="Amount"
                  />
                  <button
                    onClick={onMintAPS}
                    disabled={
                      !canAct || !parseInput(mintAmount) || localLoadingMint
                    }
                    className="px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-400 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {localLoadingMint ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      "Mint"
                    )}
                  </button>
                </div>
              </div>

              {/* Burn */}
              <div>
                <label className="text-xs text-gray-500 block mb-2">
                  Burn APS Tokens
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="100"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    className={`flex-1 p-2 rounded-lg border outline-none ${
                      isDarkMode
                        ? "bg-[#090A0F] border-rose-500/30 text-white focus:border-rose-500"
                        : "bg-white border-rose-300 text-gray-900 focus:border-rose-500"
                    }`}
                    placeholder="Amount"
                  />
                  <button
                    onClick={onBurnAPS}
                    disabled={
                      !canAct || !parseInput(burnAmount) || localLoadingBurn
                    }
                    className="px-4 py-2 bg-rose-500 text-white hover:bg-rose-400 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {localLoadingBurn ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      "Burn"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
              <span>
                Balance:{" "}
                {tokenBalance !== null
                  ? parseFloat(formatEther(tokenBalance)).toFixed(4)
                  : "—"}{" "}
                APS
              </span>
              <button
                onClick={refreshTokenBalance}
                disabled={!address || localLoadingBalance}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <RefreshCw
                  size={10}
                  className={localLoadingBalance ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="mt-2 text-[9px] text-yellow-600/70 text-center">
              ⚠️ For testing only. Mints/burns testnet APS tokens.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Wallet Message */}
      {!address && (
        <div
          className={`mt-6 p-4 rounded-lg text-center text-sm relative z-10 ${
            isDarkMode
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
            ◆ Connect your wallet to borrow, lend, and manage your position
          </span>
        </div>
      )}
    </div>
  );
}

export default BorrowingSection;
