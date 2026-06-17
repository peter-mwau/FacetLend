// components/sections/BorrowingCalculator.jsx
import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAPSDEX } from "../../contexts/APSDEXContext";
import { useLending } from "../../contexts/LendingContext";
import { useActiveAccount } from "thirdweb/react";
import { parseEther, formatEther } from "viem";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BorrowingCalculator() {
  const { isDarkMode } = useDarkMode();
  const account = useActiveAccount();
  const address = account?.address;

  // Contexts
  const {
    getEthReserves,
    getTokenReserves,
    getCurrentPrice,
    calculateYOutput,
    calculateXInput,
    swapOnAPSDEX,
    price,
    ethReserves,
    tokenReserves,
    loading: apsdexLoading,
  } = useAPSDEX();

  const {
    getPositionDetails,
    getHealthFactor,
    getAPSToETHValue,
    getRepayableAmount,
    borrowAPS,
    addCollateral,
    positionDetails,
    healthFactor,
    repayableAmount,
    loading: lendingLoading,
  } = useLending();

  // Local state
  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState("ethToAps");
  const [calculationResult, setCalculationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [borrowingPower, setBorrowingPower] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Fetch user position
  const fetchUserPosition = async () => {
    if (!address) return;
    setIsLoadingPosition(true);
    try {
      const position = await getPositionDetails(address);
      console.log("User Position:", position);

      if (position) {
        const collateralETH = position.collateralETH
          ? formatEther(position.collateralETH)
          : "0";
        const borrowedAPS = position.borrowedAPS
          ? formatEther(position.borrowedAPS)
          : "0";
        const borrowTimestamp = position.borrowTimestamp || 0n;
        const riskTimestamp = position.riskTimestamp || 0n;
        const stakeTimestamp = position.stakeTimestamp || 0n;

        setUserPosition({
          collateralETH: parseFloat(collateralETH),
          borrowedAPS: parseFloat(borrowedAPS),
          borrowTimestamp: Number(borrowTimestamp),
          riskTimestamp: Number(riskTimestamp),
          stakeTimestamp: Number(stakeTimestamp),
          raw: position,
        });

        // Auto-set collateral amount to user's current collateral
        if (parseFloat(collateralETH) > 0) {
          setCollateralAmount(collateralETH);
        }
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    } finally {
      setIsLoadingPosition(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserPosition();
    }
  }, [address]);

  // Format helper
  const formatReserve = (value) => {
    if (!value) return "0";
    const formatted =
      typeof value === "bigint" ? formatEther(value) : value.toString();
    return parseFloat(formatted).toFixed(4);
  };

  // Get current price in APS per ETH
  const getAPSPerETH = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);
    const ethPerAps = raw / 1e18;
    if (ethPerAps > 0) {
      return 1 / ethPerAps;
    }
    return 0;
  };

  // Get ETH per APS
  const getETHPerAPS = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);
    return raw / 1e18;
  };

  // Calculate max borrowable APS based on collateral
  const calculateMaxBorrow = (collateralETH, priceAPS) => {
    // COLLATERAL_RATIO = 120% (from contract)
    // Max borrow = collateralETH / 1.2 * priceAPS
    const collateralRatio = 1.2; // 120%
    const maxBorrowETH = collateralETH / collateralRatio;
    const maxBorrowAPS = maxBorrowETH * priceAPS;
    return maxBorrowAPS;
  };

  // Calculate health factor
  const calculateHealthFactor = (collateralETH, borrowedAPS, priceAPS) => {
    if (borrowedAPS === 0) return Infinity;
    const debtETH = borrowedAPS / priceAPS;
    if (debtETH === 0) return Infinity;
    // HF = (collateralETH * PRECISION * 100) / (debtETH * COLLATERAL_RATIO)
    // From contract: getHealthFactor
    const collateralRatio = 1.2; // 120%
    const healthFactor = (collateralETH * 100) / (debtETH * collateralRatio);
    return healthFactor;
  };

  // Calculate liquidation price
  const calculateLiquidationPrice = (collateralETH, borrowedAPS) => {
    if (borrowedAPS === 0) return 0;
    // Liquidation when HF < 1.0
    // HF = (collateralETH * 100) / (debtETH * 120)
    // debtETH = borrowedAPS / priceAPS
    // 1.0 = (collateralETH * 100) / ((borrowedAPS / priceAPS) * 120)
    // priceAPS = (borrowedAPS * 120) / (collateralETH * 100)
    const liquidationPrice = (borrowedAPS * 1.2) / (collateralETH * 1.0);
    return liquidationPrice;
  };

  // Main calculation function
  const calculateBorrowingPower = async () => {
    setIsCalculating(true);
    try {
      // Get current price
      const apsPerETH = getAPSPerETH();
      if (apsPerETH === 0) {
        await getCurrentPrice();
        // Re-fetch after getting price
        const newApsPerETH = getAPSPerETH();
        if (newApsPerETH === 0) {
          alert("Unable to fetch current price. Please try again.");
          setIsCalculating(false);
          return;
        }
      }

      // Use collateral from input or user's actual position
      let collateralETH = parseFloat(collateralAmount);
      if (!collateralETH || collateralETH <= 0) {
        if (userPosition && userPosition.collateralETH > 0) {
          collateralETH = userPosition.collateralETH;
          setCollateralAmount(collateralETH.toString());
        } else {
          alert(
            "Please enter a collateral amount or connect a wallet with collateral",
          );
          setIsCalculating(false);
          return;
        }
      }

      const currentPrice = getAPSPerETH();
      const currentETHPerAPS = getETHPerAPS();

      // Calculate max borrowable
      const maxBorrowAPS = calculateMaxBorrow(collateralETH, currentPrice);
      const maxBorrowETH = maxBorrowAPS / currentPrice;

      // Get current borrowed amount
      const currentBorrowed = userPosition?.borrowedAPS || 0;

      // Calculate health factors
      const currentHF = calculateHealthFactor(
        collateralETH,
        currentBorrowed,
        currentPrice,
      );
      const maxBorrowHF = calculateHealthFactor(
        collateralETH,
        currentBorrowed + maxBorrowAPS,
        currentPrice,
      );

      // Calculate liquidation price
      const liquidationPrice = calculateLiquidationPrice(
        collateralETH,
        currentBorrowed + maxBorrowAPS,
      );

      // Calculate optimal borrow (70% of max)
      const optimalBorrowAPS = maxBorrowAPS * 0.7;
      const optimalBorrowHF = calculateHealthFactor(
        collateralETH,
        currentBorrowed + optimalBorrowAPS,
        currentPrice,
      );

      // Calculate swap simulation (if user swaps ETH for APS)
      let swapSimulation = null;
      if (swapAmount && parseFloat(swapAmount) > 0) {
        const swapETH = parseFloat(swapAmount);
        const ethRes = ethReserves || 0n;
        const apsRes = tokenReserves || 0n;

        if (ethRes > 0n && apsRes > 0n) {
          const xInput = parseEther(swapETH.toString());
          const yOutput = await calculateYOutput(xInput, ethRes, apsRes);
          if (yOutput) {
            const apsReceived = parseFloat(formatEther(yOutput));

            // Calculate new reserves after swap
            const newETHReserves = parseFloat(formatReserve(ethRes)) + swapETH;
            const newAPSReserves =
              parseFloat(formatReserve(apsRes)) - apsReceived;

            // Calculate new price after swap
            const newPriceAPS = newAPSReserves / newETHReserves;
            const newETHPerAPS = newETHReserves / newAPSReserves;

            // Calculate new health factor if user borrows after swap
            const borrowAfterSwap = currentBorrowed + optimalBorrowAPS;
            const newHF = calculateHealthFactor(
              collateralETH,
              borrowAfterSwap,
              newPriceAPS,
            );

            swapSimulation = {
              ethSwapped: swapETH,
              apsReceived,
              newETHReserves,
              newAPSReserves,
              newPriceAPS,
              newETHPerAPS,
              newHealthFactor: newHF,
              priceImpact: ((newPriceAPS - currentPrice) / currentPrice) * 100,
            };
          }
        }
      }

      setBorrowingPower({
        collateralETH,
        currentPrice,
        currentETHPerAPS,
        maxBorrowAPS,
        maxBorrowETH,
        optimalBorrowAPS,
        currentBorrowed,
        currentHF,
        maxBorrowHF,
        optimalBorrowHF,
        liquidationPrice,
        swapSimulation,
        timestamp: new Date().toLocaleTimeString(),
        // User position info
        hasPosition: userPosition !== null,
        riskTimestamp: userPosition?.riskTimestamp || 0,
        stakeTimestamp: userPosition?.stakeTimestamp || 0,
      });
    } catch (error) {
      console.error("Error calculating borrowing power:", error);
      alert("Failed to calculate borrowing power");
    } finally {
      setIsCalculating(false);
    }
  };

  // Simulate borrow
  const simulateBorrow = (amount) => {
    if (!borrowingPower) return null;
    const borrowAPS = parseFloat(amount) || 0;
    const collateralETH = borrowingPower.collateralETH;
    const currentPrice = borrowingPower.currentPrice;
    const currentBorrowed = borrowingPower.currentBorrowed;

    const totalBorrowed = currentBorrowed + borrowAPS;
    const newHF = calculateHealthFactor(
      collateralETH,
      totalBorrowed,
      currentPrice,
    );
    const isSafe = newHF >= 1.0;
    const isOptimal = newHF >= 1.5;

    return {
      borrowAPS,
      totalBorrowed,
      newHF,
      isSafe,
      isOptimal,
      debtETH: totalBorrowed / currentPrice,
    };
  };

  // Handle borrow action
  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert("Please enter a valid borrow amount");
      return;
    }

    const borrowAPS = parseFloat(borrowAmount);
    const maxBorrow = borrowingPower?.maxBorrowAPS || 0;

    if (borrowAPS > maxBorrow) {
      alert(`You can only borrow up to ${maxBorrow.toLocaleString()} APS`);
      return;
    }

    try {
      const amountInWei = parseEther(borrowAPS.toString());
      await borrowAPS(amountInWei);
      // Refresh position
      await fetchUserPosition();
      await calculateBorrowingPower();
      setBorrowAmount("");
    } catch (error) {
      console.error("Error borrowing:", error);
      alert("Failed to borrow APS");
    }
  };

  // Handle swap
  const handleSwap = async () => {
    if (!swapAmount || parseFloat(swapAmount) <= 0) {
      alert("Please enter a valid swap amount");
      return;
    }

    try {
      if (swapDirection === "ethToAps") {
        const amountInWei = parseEther(swapAmount);
        await swapOnAPSDEX(amountInWei);
      } else {
        const amountInWei = parseEther(swapAmount);
        await swapOnAPSDEX(amountInWei);
      }
      // Refresh data
      await getEthReserves();
      await getTokenReserves();
      await getCurrentPrice();
      await calculateBorrowingPower();
      setSwapAmount("");
    } catch (error) {
      console.error("Error swapping:", error);
      alert("Failed to swap tokens");
    }
  };

  // Auto-calculate when collateral changes
  useEffect(() => {
    if (collateralAmount && parseFloat(collateralAmount) > 0) {
      const timeout = setTimeout(() => {
        calculateBorrowingPower();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [collateralAmount]);

  return (
    <div
      className={`p-6 border rounded-xl ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5"
          : "bg-white border-black/5 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-blue-500" />
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
            Borrowing Power Calculator
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUserPosition}
            disabled={isLoadingPosition}
            className="text-[9px] px-2 py-1 rounded border border-white/5 text-gray-400 hover:bg-white/5 flex items-center gap-1"
          >
            <RefreshCw
              size={10}
              className={isLoadingPosition ? "animate-spin" : ""}
            />
            Refresh Position
          </button>
        </div>
      </div>

      {/* User Position Summary */}
      {userPosition && (
        <div
          className={`p-3 rounded-lg border mb-4 ${
            isDarkMode
              ? "border-blue-500/20 bg-blue-500/5"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-blue-400" />
            <span className="text-[9px] font-bold text-blue-400">
              Current Position
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            <div>
              <div className="text-[8px] text-gray-500">Collateral</div>
              <div className="text-sm font-bold">
                {userPosition.collateralETH.toFixed(4)} ETH
              </div>
            </div>
            <div>
              <div className="text-[8px] text-gray-500">Borrowed</div>
              <div className="text-sm font-bold">
                {userPosition.borrowedAPS.toLocaleString()} APS
              </div>
            </div>
            <div>
              <div className="text-[8px] text-gray-500">Health Factor</div>
              <div
                className={`text-sm font-bold ${
                  healthFactor
                    ? Number(healthFactor) > 1e18
                      ? "text-emerald-400"
                      : "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {healthFactor ? (Number(healthFactor) / 1e18).toFixed(2) : "—"}
              </div>
            </div>
            <div>
              <div className="text-[8px] text-gray-500">Status</div>
              <div
                className={`text-sm font-bold ${
                  userPosition.riskTimestamp > 0
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {userPosition.riskTimestamp > 0 ? "⚠️ At Risk" : "✅ Safe"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] uppercase text-gray-500 block mb-2">
            Collateral Amount (ETH)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.0001"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className={`w-full p-3 rounded-lg border outline-none font-mono ${
                isDarkMode
                  ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                  : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
              }`}
              placeholder="Enter ETH amount"
            />
            <span className="absolute right-4 text-sm text-gray-500">ETH</span>
          </div>
          {userPosition && userPosition.collateralETH > 0 && (
            <button
              onClick={() => {
                setCollateralAmount(userPosition.collateralETH.toString());
              }}
              className="text-[9px] text-blue-400 hover:text-blue-300 mt-1"
            >
              Use current collateral ({userPosition.collateralETH.toFixed(4)}{" "}
              ETH)
            </button>
          )}
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateBorrowingPower}
            disabled={isCalculating || apsdexLoading || lendingLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate Borrowing Power"
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {borrowingPower && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Market Conditions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <div>
                <div className="text-[8px] text-gray-500 uppercase">
                  Current Price
                </div>
                <div className="text-sm font-bold text-blue-400">
                  {borrowingPower.currentPrice.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  <span className="text-[10px] font-normal text-gray-500">
                    APS/ETH
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-500 uppercase">
                  Collateral
                </div>
                <div className="text-sm font-bold">
                  {borrowingPower.collateralETH.toFixed(4)}{" "}
                  <span className="text-[10px] font-normal text-gray-500">
                    ETH
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-500 uppercase">
                  Current Borrowed
                </div>
                <div className="text-sm font-bold text-yellow-400">
                  {borrowingPower.currentBorrowed.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  <span className="text-[10px] font-normal text-gray-500">
                    APS
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-500 uppercase">
                  Health Factor
                </div>
                <div
                  className={`text-sm font-bold ${
                    borrowingPower.currentHF >= 2
                      ? "text-emerald-400"
                      : borrowingPower.currentHF >= 1.5
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {borrowingPower.currentHF === Infinity
                    ? "∞"
                    : borrowingPower.currentHF.toFixed(2)}
                  x
                </div>
              </div>
            </div>

            {/* Max Borrow Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-400">
                    Maximum Borrow
                  </span>
                </div>
                <div className="text-xl font-bold">
                  {borrowingPower.maxBorrowAPS.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    APS
                  </span>
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  {borrowingPower.maxBorrowETH.toFixed(4)} ETH (120% collateral
                  ratio)
                </div>
                <div className="text-[9px] mt-1">
                  <span
                    className={`${borrowingPower.maxBorrowHF >= 1 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    HF:{" "}
                    {borrowingPower.maxBorrowHF === Infinity
                      ? "∞"
                      : borrowingPower.maxBorrowHF.toFixed(2)}
                    x
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "border-blue-500/20 bg-blue-500/5"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={12} className="text-blue-400" />
                  <span className="text-[9px] font-bold text-blue-400">
                    Optimal Borrow (70%)
                  </span>
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {borrowingPower.optimalBorrowAPS.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    APS
                  </span>
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  Safer position with better health factor
                </div>
                <div className="text-[9px] mt-1">
                  <span className="text-emerald-400">
                    HF:{" "}
                    {borrowingPower.optimalBorrowHF === Infinity
                      ? "∞"
                      : borrowingPower.optimalBorrowHF.toFixed(2)}
                    x
                  </span>
                </div>
              </div>
            </div>

            {/* Liquidation Warning */}
            {borrowingPower.liquidationPrice > 0 && (
              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "border-yellow-500/20 bg-yellow-500/5"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-yellow-400" />
                  <span className="text-[9px] font-bold text-yellow-400">
                    Liquidation Warning
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  Position would liquidate if APS/ETH price drops below{" "}
                  <span className="font-bold text-yellow-400">
                    {borrowingPower.liquidationPrice.toFixed(4)}
                  </span>{" "}
                  (at max borrow)
                </div>
              </div>
            )}

            {/* Borrow Form */}
            <div
              className={`p-3 rounded-lg border ${
                isDarkMode ? "border-white/5" : "border-black/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={12} className="text-emerald-400" />
                <span className="text-[9px] font-bold">Borrow APS</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="100"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none font-mono text-sm ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                        : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                    }`}
                    placeholder="Amount in APS"
                  />
                </div>
                <button
                  onClick={handleBorrow}
                  disabled={!borrowAmount || lendingLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  Borrow
                </button>
              </div>
              <button
                onClick={() =>
                  setBorrowAmount(borrowingPower.optimalBorrowAPS.toString())
                }
                className="text-[8px] text-blue-400 hover:text-blue-300 mt-1"
              >
                Use optimal amount
              </button>
            </div>

            {/* Swap Simulation */}
            <div
              className={`p-3 rounded-lg border ${
                isDarkMode ? "border-white/5" : "border-black/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap size={12} className="text-purple-400" />
                <span className="text-[9px] font-bold">Swap Simulation</span>
                <span className="text-[8px] text-gray-500 ml-2">
                  How swapping affects your position
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setSwapDirection("ethToAps")}
                  className={`px-3 py-1 text-[9px] font-bold rounded ${
                    swapDirection === "ethToAps"
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                        ? "bg-white/5"
                        : "bg-black/5"
                  }`}
                >
                  ETH → APS
                </button>
                <button
                  onClick={() => setSwapDirection("apsToEth")}
                  className={`px-3 py-1 text-[9px] font-bold rounded ${
                    swapDirection === "apsToEth"
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                        ? "bg-white/5"
                        : "bg-black/5"
                  }`}
                >
                  APS → ETH
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.01"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none font-mono text-sm ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                        : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                    }`}
                    placeholder={`Amount in ${swapDirection === "ethToAps" ? "ETH" : "APS"}`}
                  />
                </div>
                <button
                  onClick={handleSwap}
                  disabled={!swapAmount || apsdexLoading}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  Simulate Swap
                </button>
              </div>
              <button
                onClick={() => {
                  const swapAmounts = ["0.01", "0.05", "0.1", "0.5"];
                  const random =
                    swapAmounts[Math.floor(Math.random() * swapAmounts.length)];
                  setSwapAmount(random);
                }}
                className="text-[8px] text-gray-500 hover:text-gray-400 mt-1"
              >
                Quick amounts: 0.01 | 0.05 | 0.1 | 0.5 ETH
              </button>

              {/* Swap Simulation Results */}
              {borrowingPower.swapSimulation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-white/5"
                >
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div>
                      <span className="text-gray-500">ETH Swapped:</span>
                      <span className="ml-1 font-bold">
                        {borrowingPower.swapSimulation.ethSwapped} ETH
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">APS Received:</span>
                      <span className="ml-1 font-bold text-emerald-400">
                        {borrowingPower.swapSimulation.apsReceived.toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        APS
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">New Price:</span>
                      <span className="ml-1 font-bold">
                        {borrowingPower.swapSimulation.newPriceAPS.toFixed(4)}{" "}
                        APS/ETH
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price Impact:</span>
                      <span
                        className={`ml-1 font-bold ${
                          Math.abs(borrowingPower.swapSimulation.priceImpact) >
                          5
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {borrowingPower.swapSimulation.priceImpact.toFixed(2)}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">
                        New Health Factor (if borrowing):
                      </span>
                      <span
                        className={`ml-1 font-bold ${
                          borrowingPower.swapSimulation.newHealthFactor >= 1.5
                            ? "text-emerald-400"
                            : borrowingPower.swapSimulation.newHealthFactor >= 1
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {borrowingPower.swapSimulation.newHealthFactor.toFixed(
                          2,
                        )}
                        x
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Toggle Breakdown */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={`w-full text-[9px] uppercase tracking-wider p-2 rounded border ${
                isDarkMode
                  ? "border-white/5 hover:bg-white/5"
                  : "border-black/5 hover:bg-black/5"
              }`}
            >
              {showBreakdown ? "▼ Hide" : "▶ Show"} Calculation Breakdown
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-3 rounded-lg border text-[9px] space-y-1 ${
                      isDarkMode
                        ? "border-white/5 bg-black/20"
                        : "border-black/5 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-500">Collateral:</span>
                      <span>{borrowingPower.collateralETH.toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Price:</span>
                      <span>
                        {borrowingPower.currentPrice.toFixed(4)} APS/ETH
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Collateral Ratio:</span>
                      <span>120%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Borrow:</span>
                      <span className="font-bold text-emerald-400">
                        {borrowingPower.maxBorrowAPS.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        APS
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-gray-500">
                        Health Factor (max):
                      </span>
                      <span>
                        {borrowingPower.maxBorrowHF === Infinity
                          ? "∞"
                          : borrowingPower.maxBorrowHF.toFixed(2)}
                        x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Liquidation Price:</span>
                      <span className="font-bold text-yellow-400">
                        {borrowingPower.liquidationPrice.toFixed(4)} APS/ETH
                      </span>
                    </div>
                    {userPosition && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Risk Timestamp:</span>
                          <span>
                            {userPosition.riskTimestamp > 0
                              ? new Date(
                                  userPosition.riskTimestamp * 1000,
                                ).toLocaleString()
                              : "None"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Stake Timestamp:
                          </span>
                          <span>
                            {userPosition.stakeTimestamp > 0
                              ? new Date(
                                  userPosition.stakeTimestamp * 1000,
                                ).toLocaleString()
                              : "None"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
