// components/sections/MovePriceSection.jsx
import { useState, useEffect } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useMovePrice } from "../../contexts/MovePriceContext";
import { useAPSDEX } from "../../contexts/APSDEXContext";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
  DollarSign,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Activity,
  Coins,
} from "lucide-react";
import { parseEther, formatEther } from "viem";
import { toast } from "react-toastify";

function MovePriceSection() {
  const { isDarkMode } = useDarkMode();
  const account = useActiveAccount();
  const address = account?.address;

  const {
    movePrice,
    initializeMovePrice,
    loading: movePriceLoading,
    error,
  } = useMovePrice();

  const {
    getCurrentPrice,
    getEthReserves,
    getTokenReserves,
    price,
    ethReserves,
    tokenReserves,
    loading: apsdexLoading,
  } = useAPSDEX();

  const [moveAmount, setMoveAmount] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [currentPriceDisplay, setCurrentPriceDisplay] = useState("—");
  const [priceChange, setPriceChange] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [moveDirection, setMoveDirection] = useState("ethToAps"); // "ethToAps" or "apsToEth"

  // Fetch current price
  const fetchPrice = async () => {
    if (!address) return;
    setLoadingPrice(true);
    try {
      const p = await getCurrentPrice();
      if (p !== null && p !== undefined) {
        const priceValue = Number(p) / 1e18;
        setCurrentPriceDisplay(priceValue.toFixed(6));

        // Calculate price change
        if (previousPrice !== null) {
          const change = ((priceValue - previousPrice) / previousPrice) * 100;
          setPriceChange(change);
        }
        setPreviousPrice(priceValue);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setLoadingPrice(false);
    }
  };

  // Check if MovePrice is initialized
  const checkInitialization = async () => {
    try {
      // Try to get price - if it works, it's initialized
      await getCurrentPrice();
      setIsInitialized(true);
    } catch {
      setIsInitialized(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchPrice();
      checkInitialization();
    }
  }, [address]);

  // Auto-refresh price every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        fetchPrice();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [address]);

  // Handle initialize
  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const apsTokenAddress = ADDRESSES.APS;
      const apsDexAddress = ADDRESSES.Facets.ApsdexFacet;

      await initializeMovePrice(apsTokenAddress, apsDexAddress);
      setIsInitialized(true);
      toast.success("MovePrice initialized successfully!");
      await fetchPrice();
    } catch (error) {
      console.error("Error initializing MovePrice:", error);
      toast.error("Failed to initialize MovePrice");
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle moving price with ETH
  const handleMovePrice = async () => {
    if (!moveAmount || parseFloat(moveAmount) <= 0) {
      toast.error("Please enter a valid ETH amount");
      return;
    }

    const ethAmount = parseFloat(moveAmount);

    // For ETH to APS, we send ETH (positive size)
    // For APS to ETH, we send APS (negative size)
    const amount = moveDirection === "ethToAps" ? ethAmount : -ethAmount;

    setIsMoving(true);
    try {
      const amountInWei = parseEther(amount.toString());
      await movePrice(amountInWei);
      setMoveAmount("");

      const directionText =
        moveDirection === "ethToAps"
          ? `Swapped ${ethAmount} ETH → APS`
          : `Swapped ${ethAmount} APS → ETH`;

      toast.success(`${directionText} - Price moved!`);

      // Refresh data after move
      setTimeout(() => {
        fetchPrice();
        getEthReserves();
        getTokenReserves();
      }, 2000);
    } catch (error) {
      console.error("Error moving price:", error);
      toast.error(error.message || "Failed to move price");
    } finally {
      setIsMoving(false);
    }
  };

  const formatReserve = (value) => {
    if (!value) return "—";
    const num =
      typeof value === "bigint" ? Number(value) / 1e18 : Number(value);
    return num.toFixed(4);
  };

  const canAct = !!address && !movePriceLoading && !apsdexLoading;

  // Calculate impact preview
  const getPriceImpact = () => {
    if (!moveAmount || !ethReserves || !tokenReserves) return null;
    const ethAmount = parseFloat(moveAmount);
    const ethRes = Number(ethReserves) / 1e18;
    const apsRes = Number(tokenReserves) / 1e18;

    if (ethRes === 0 || apsRes === 0) return null;

    if (moveDirection === "ethToAps") {
      // Adding ETH to pool increases ETH reserves, decreases price
      const newEthRes = ethRes + ethAmount;
      const newPrice = apsRes / newEthRes;
      const currentPrice = apsRes / ethRes;
      const impact = ((newPrice - currentPrice) / currentPrice) * 100;
      return impact;
    } else {
      // Removing ETH from pool (swapping APS to ETH) increases price
      const newEthRes = ethRes - ethAmount;
      if (newEthRes <= 0) return -100;
      const newPrice = apsRes / newEthRes;
      const currentPrice = apsRes / ethRes;
      const impact = ((newPrice - currentPrice) / currentPrice) * 100;
      return impact;
    }
  };

  const priceImpact = getPriceImpact();

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
          <Activity size={16} className="text-purple-500" />
          <span
            className={`text-[10px] uppercase font-bold tracking-widest ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Move Price Engine
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
            onClick={fetchPrice}
            disabled={loadingPrice}
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "border-white/5 hover:bg-white/5 text-gray-400"
                : "border-gray-200 hover:bg-gray-50 text-gray-500"
            }`}
            title="Refresh Price"
          >
            <RefreshCw
              size={14}
              className={loadingPrice ? "animate-spin" : ""}
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
            ◆ Connect your wallet to use the Move Price engine
          </span>
        </div>
      )}

      {/* Price Display */}
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
              <DollarSign size={14} className="text-blue-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Current Price
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {loadingPrice ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  {currentPriceDisplay}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    APS/ETH
                  </span>
                </>
              )}
            </div>
            {priceChange !== null && (
              <div
                className={`text-xs mt-1 flex items-center gap-1 ${
                  priceChange > 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {priceChange > 0 ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {priceChange.toFixed(2)}%
              </div>
            )}
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? "bg-white/[0.01] border-white/5"
                : "bg-gray-50/50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                ETH Reserves
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {formatReserve(ethReserves)}
              <span className="text-xs font-normal text-gray-500 ml-1">
                ETH
              </span>
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
              <TrendingDown size={14} className="text-yellow-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                APS Reserves
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {formatReserve(tokenReserves)}
              <span className="text-xs font-normal text-gray-500 ml-1">
                APS
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
                  Initialize MovePrice
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Initialize the MovePrice facet to enable price manipulation for
                testing purposes.
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
                  "Initialize MovePrice"
                )}
              </button>
            </div>
          )}

          {/* Move Price Section */}
          {isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
                  Move Price
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setMoveDirection("ethToAps")}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded border transition-colors ${
                    moveDirection === "ethToAps"
                      ? isDarkMode
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                        : "bg-blue-100 border-blue-300 text-blue-700"
                      : isDarkMode
                        ? "bg-white/5 border-white/5 text-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                >
                  ETH → APS (Lowers Price)
                </button>
                <button
                  onClick={() => setMoveDirection("apsToEth")}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded border transition-colors ${
                    moveDirection === "apsToEth"
                      ? isDarkMode
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : "bg-amber-100 border-amber-300 text-amber-700"
                      : isDarkMode
                        ? "bg-white/5 border-white/5 text-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                >
                  APS → ETH (Raises Price)
                </button>
              </div>

              <label className="text-xs text-gray-500 block mb-2">
                Amount of{" "}
                {moveDirection === "ethToAps" ? "ETH to swap" : "APS to swap"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step={moveDirection === "ethToAps" ? "0.01" : "100"}
                  value={moveAmount}
                  onChange={(e) => setMoveAmount(e.target.value)}
                  className={`w-full p-3 font-bold pr-16 rounded-lg border outline-none ${
                    isDarkMode
                      ? "bg-[#090A0F] border-white/5 text-white focus:border-purple-500/50"
                      : "bg-white border-gray-200 text-gray-900 focus:border-purple-500"
                  }`}
                  placeholder={`Enter ${moveDirection === "ethToAps" ? "ETH" : "APS"} amount`}
                />
                <span className="absolute right-4 text-sm text-gray-500 font-bold">
                  {moveDirection === "ethToAps" ? "ETH" : "APS"}
                </span>
              </div>

              {/* Price Impact Preview */}
              {priceImpact !== null && moveAmount && (
                <div
                  className={`mt-2 p-2 rounded-lg text-[10px] ${
                    Math.abs(priceImpact) > 5
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  <span>Estimated price impact: </span>
                  <span className="font-bold">
                    {priceImpact > 0 ? "+" : ""}
                    {priceImpact.toFixed(2)}%
                  </span>
                  <span className="text-gray-500 ml-2">
                    (
                    {moveDirection === "ethToAps"
                      ? "🔽 Price decreases"
                      : "🔼 Price increases"}
                    )
                  </span>
                </div>
              )}

              <button
                onClick={handleMovePrice}
                disabled={!canAct || !moveAmount || isMoving}
                className={`w-full py-3 mt-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  !canAct || !moveAmount || isMoving
                    ? isDarkMode
                      ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                      : "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100"
                }`}
              >
                {isMoving ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    Swapping...
                  </span>
                ) : (
                  `Swap ${moveDirection === "ethToAps" ? "ETH → APS" : "APS → ETH"}`
                )}
              </button>

              <div className="mt-2 p-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                <p className="text-[9px] text-yellow-500 text-center flex items-center justify-center gap-1">
                  <AlertTriangle size={12} />
                  {moveDirection === "ethToAps"
                    ? "Swapping ETH → APS lowers price → reduces health factor → risk of liquidation"
                    : "Swapping APS → ETH raises price → increases health factor → safer positions"}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isInitialized && (
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Coins size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Quick Test Amounts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMoveAmount("0.01")}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isDarkMode
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  0.01 ETH
                </button>
                <button
                  onClick={() => setMoveAmount("0.05")}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isDarkMode
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  0.05 ETH
                </button>
                <button
                  onClick={() => setMoveAmount("0.1")}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isDarkMode
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  0.1 ETH
                </button>
                <button
                  onClick={() => setMoveAmount("0.5")}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isDarkMode
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  0.5 ETH
                </button>
              </div>

              <div className="mt-3 p-2 rounded-lg border border-blue-500/20 bg-blue-500/5">
                <p className="text-[9px] text-blue-500 text-center flex items-center justify-center gap-1">
                  <Info size={12} />
                  Use these amounts to test how price changes affect health
                  factors
                </p>
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

export default MovePriceSection;
