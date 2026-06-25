// components/sections/FlashloanSection.jsx
import { useState, useEffect, useMemo } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useFlashLoan } from "../../contexts/FlashLoanContext";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { ADDRESSES } from "../../constants/addresses";
import {
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Activity,
  Coins,
  Wallet,
  Clock,
  TrendingUp,
} from "lucide-react";
import { parseEther, formatEther } from "viem";
import { toast } from "react-toastify";

function FlashloanSection() {
  const { isDarkMode } = useDarkMode();
  const account = useActiveAccount();
  const address = account?.address;

  const {
    initializeFlashLoan,
    requestFlashLoan,
    withdrawFlashLoanProfits,
    getFlashLoanContractBalance,
    loadingInitializingFlashLoan,
    error,
    tokenBalance,
  } = useFlashLoan();

  const [flashLoanAmount, setFlashLoanAmount] = useState("");
  const [assetAddress, setAssetAddress] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const AAVE_POOL_ADDRESS =
    import.meta.env.VITE_AAVE_POOL_SEPOLIA_ADDRESS ||
    "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
  const APS_TOKEN_ADDRESS = ADDRESSES.APS;

  console.log("AAVE POOL ADDRESS: ", AAVE_POOL_ADDRESS);

  // Check if flash loan is initialized
  const checkInitialization = async () => {
    try {
      // If the contract has a way to check initialization
      const isInit = await getFlashLoanContractBalance(APS_TOKEN_ADDRESS);
      if (isInit !== null && isInit !== undefined) {
        setIsInitialized(true);
        toast.success("Flash loan already initialized!");
        return true;
      }
      return false;
    } catch (error) {
      // If the error is "pool not set", it's not initialized
      if (error.message?.includes("pool not set")) {
        setIsInitialized(false);
        return false;
      }
      return false;
    }
  };

  useEffect(() => {
    if (address) {
      checkInitialization();
      refreshBalance();
    }
  }, [address]);

  // Refresh balance
  const refreshBalance = async () => {
    if (!address) return;
    setLoadingBalance(true);
    try {
      const bal = await getFlashLoanContractBalance(APS_TOKEN_ADDRESS);
      setBalance(bal);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Handle initialize flash loan
  const handleInitialize = async () => {
    // Prevent duplicate submissions
    if (isInitializing) {
      toast.info("Initialization already in progress...");
      return;
    }

    setIsInitializing(true);
    try {
      await initializeFlashLoan(AAVE_POOL_ADDRESS);
      setIsInitialized(true);
      toast.success("Flash loan initialized!");
    } catch (error) {
      if (error.message?.includes("already known")) {
        toast.info("Transaction already submitted. Check your wallet.");
      } else {
        console.error("Error:", error);
        toast.error(error.message || "Failed to initialize");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle request flash loan
  const handleRequestFlashLoan = async () => {
    if (!isInitialized) {
      toast.error("Flash loan not initialized. Please initialize first!");
      return;
    }

    if (!flashLoanAmount || parseFloat(flashLoanAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsRequesting(true);
    try {
      const amountInWei = parseEther(flashLoanAmount.toString());
      await requestFlashLoan(APS_TOKEN_ADDRESS, amountInWei);
      setFlashLoanAmount("");
      toast.success(`Flash loan of ${flashLoanAmount} APS requested!`);
      await refreshBalance();
    } catch (error) {
      console.error("Error requesting flash loan:", error);
      toast.error(error.message || "Failed to request flash loan");
    } finally {
      setIsRequesting(false);
    }
  };

  // Handle withdraw profits
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawFlashLoanProfits(APS_TOKEN_ADDRESS);
      toast.success("Flash loan profits withdrawn!");
      await refreshBalance();
    } catch (error) {
      console.error("Error withdrawing profits:", error);
      toast.error(error.message || "Failed to withdraw profits");
    } finally {
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    if (address && !isInitialized) {
      // Try to initialize with AAVE pool address
      const autoInitialize = async () => {
        try {
          await initializeFlashLoan(AAVE_POOL_ADDRESS);
          setIsInitialized(true);
          toast.success("Flash loan initialized automatically!");
        } catch (error) {
          console.error("Auto-initialization failed:", error);
          // Don't show error toast - user can manually initialize
        }
      };
      autoInitialize();
    }
  }, [address]);

  const canAct = !!address && !loadingInitializingFlashLoan;

  const formatBalance = (value) => {
    if (!value) return "—";
    const num =
      typeof value === "bigint" ? Number(value) / 1e18 : Number(value);
    return num.toFixed(4);
  };

  return (
    <div
      className={`p-6 border rounded-xl text-sm relative overflow-hidden mt-12 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 text-white"
          : "bg-white border-gray-200 text-gray-900 shadow-sm"
      }`}
    >
      {/* Background Pattern */}
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
          <Zap size={16} className="text-yellow-500" />
          <span
            className={`text-[10px] uppercase font-bold tracking-widest ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Flash Loan Engine
          </span>
          {isInitialized && (
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Active
            </span>
          )}
          {!isInitialized && address && (
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
              Not Initialized
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshBalance}
            disabled={loadingBalance}
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "border-white/5 hover:bg-white/5 text-gray-400"
                : "border-gray-200 hover:bg-gray-50 text-gray-500"
            }`}
            title="Refresh Balance"
          >
            <RefreshCw
              size={14}
              className={loadingBalance ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Not Connected Message */}
      {!address && (
        <div
          className={`mt-2 p-4 rounded-lg text-center text-sm relative z-10 mb-6 ${
            isDarkMode
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
            ◆ Connect your wallet to use the Flash Loan engine
          </span>
        </div>
      )}

      {/* Status Cards */}
      {address && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={14} className="text-blue-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Contract Balance
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {loadingBalance ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  {formatBalance(balance)}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    APS
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-emerald-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Status
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {isInitialized ? (
                <>
                  <CheckCircle
                    size={16}
                    className="inline mr-2 text-emerald-400"
                  />
                  Ready
                </>
              ) : (
                <>
                  <AlertTriangle
                    size={16}
                    className="inline mr-2 text-yellow-400"
                  />
                  Not Active
                </>
              )}
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-purple-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Asset
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              APS
              <span className="text-xs font-normal text-gray-500 ml-1">
                Token
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      {address && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Initialize Section */}
          {!isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-yellow-500/30"
                  : "bg-yellow-50/50 border-yellow-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">
                  Initialize Flash Loan
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Initialize the Flash Loan facet to enable flash loan operations
                through AAVE.
              </p>
              <button
                onClick={handleInitialize}
                disabled={isInitializing}
                className={`w-full py-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  isInitializing
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100"
                }`}
              >
                {isInitializing ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    Initializing...
                  </span>
                ) : (
                  "Initialize Flash Loan"
                )}
              </button>
            </div>
          )}

          {/* Request Flash Loan */}
          {isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">
                  Request Flash Loan
                </span>
              </div>

              <label className="text-xs text-gray-500 block mb-2">
                Amount of APS to borrow
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="100"
                  value={flashLoanAmount}
                  onChange={(e) => setFlashLoanAmount(e.target.value)}
                  className={`w-full p-3 font-bold pr-16 rounded-lg border outline-none ${
                    isDarkMode
                      ? "bg-[#090A0F] border-white/5 text-white focus:border-yellow-500/50"
                      : "bg-white border-gray-200 text-gray-900 focus:border-yellow-500"
                  }`}
                  placeholder="Enter APS amount"
                />
                <span className="absolute right-4 text-sm text-gray-500 font-bold">
                  APS
                </span>
              </div>

              <button
                onClick={handleRequestFlashLoan}
                disabled={!canAct || !flashLoanAmount || isRequesting}
                className={`w-full py-3 mt-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  !canAct || !flashLoanAmount || isRequesting
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100"
                }`}
              >
                {isRequesting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    Requesting...
                  </span>
                ) : (
                  "Request Flash Loan"
                )}
              </button>

              <div className="mt-2 p-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                <p className="text-[9px] text-yellow-500 text-center flex items-center justify-center gap-1">
                  <Info size={12} />
                  Flash loans must be repaid in the same transaction
                </p>
              </div>
            </div>
          )}

          {/* Withdraw Profits */}
          {isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Coins size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                  Withdraw Profits
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  Available Balance:
                </span>
                <span className="font-bold text-emerald-400">
                  {formatBalance(balance)} APS
                </span>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={
                  !canAct || isWithdrawing || !balance || Number(balance) <= 0
                }
                className={`w-full py-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  !canAct || isWithdrawing || !balance || Number(balance) <= 0
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {isWithdrawing ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    Withdrawing...
                  </span>
                ) : (
                  "Withdraw Profits"
                )}
              </button>

              <div className="mt-2 p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-[9px] text-emerald-500 text-center flex items-center justify-center gap-1">
                  <CheckCircle size={12} />
                  Only the contract owner can withdraw profits
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Tips */}
          {isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Quick Tips
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 text-sm">◆</span>
                  <span>Flash loans are uncollateralized loans</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 text-sm">◆</span>
                  <span>Must be repaid within the same transaction</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 text-sm">◆</span>
                  <span>
                    Use for arbitrage, collateral swaps, or self-liquidation
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 text-sm">◆</span>
                  <span>
                    Profits from flash loans are stored in the contract
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 border rounded-lg relative z-10 ${
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
    </div>
  );
}

export default FlashloanSection;
