// pages/Dashboard.jsx
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useAPSDEX } from "../../contexts/APSDEXContext";
import { useEffect, useState, useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatEther } from "viem";
import {
  Shield,
  ShieldAlert,
  Layers,
  TrendingUp,
  Cpu,
  RefreshCw,
  Wallet,
  KeyRound,
  AlertTriangle,
  DollarSign,
  Activity,
  Zap,
  BarChart3,
  Clock,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  CheckCircle,
  Info,
} from "lucide-react";
import { parseEther } from "viem";

// 1. Enhanced Health Factor Gauge Component
const HealthFactorGauge = ({
  healthFactor,
  liquidationThreshold = 1.0,
  warningThreshold = 1.5,
}) => {
  const { isDarkMode } = useDarkMode();
  const maxDisplay = 3.0;

  const parsedHealth =
    typeof healthFactor === "number"
      ? healthFactor
      : parseFloat(healthFactor) || 999;
  const fillPercentage = Math.min((parsedHealth / maxDisplay) * 100, 100);

  const getStatusString = () => {
    if (parsedHealth <= liquidationThreshold + 0.1) return "CRITICAL_RISK";
    if (parsedHealth < warningThreshold) return "MARGIN_WARNING";
    if (parsedHealth >= 2.5) return "OPTIMAL_SECURE";
    return "ACCOUNT_SECURE";
  };

  const getStatusColorClass = () => {
    switch (getStatusString()) {
      case "CRITICAL_RISK":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "MARGIN_WARNING":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "OPTIMAL_SECURE":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getBarColor = () => {
    if (getStatusString() === "CRITICAL_RISK") return "bg-rose-500";
    if (getStatusString() === "MARGIN_WARNING") return "bg-amber-500";
    if (getStatusString() === "OPTIMAL_SECURE") return "bg-emerald-500";
    return "bg-blue-500";
  };

  return (
    <div
      className={`p-6 border rounded-xl font-mono transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
          : "bg-white border-black/5 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-wider">
          <Shield size={12} className="text-blue-500" />
          <span>System Collateral Ratio</span>
        </div>
        <span
          className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${getStatusColorClass()}`}
        >
          {getStatusString().replace("_", " ")}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span
          className={`text-4xl font-bold tracking-tight ${
            getStatusString() === "CRITICAL_RISK"
              ? "text-rose-500"
              : getStatusString() === "MARGIN_WARNING"
                ? "text-amber-500"
                : getStatusString() === "OPTIMAL_SECURE"
                  ? "text-emerald-500"
                  : "text-blue-500"
          }`}
        >
          {typeof healthFactor === "number"
            ? healthFactor.toFixed(2)
            : healthFactor}
          x
        </span>
        <span className="text-[10px] text-gray-500">
          / 1.00x Execution Threshold
        </span>
      </div>

      {/* Gauge Track */}
      <div
        className={`relative h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className={`absolute h-full rounded-full ${getBarColor()}`}
        />
        {/* Markers */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white/60"
          style={{ left: `${(liquidationThreshold / maxDisplay) * 100}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-amber-500/60"
          style={{ left: `${(warningThreshold / maxDisplay) * 100}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-gray-500 mt-2 uppercase tracking-tight">
        <span>0.00x</span>
        <span>Liquidation</span>
        <span>Warning</span>
        <span>3.00x+</span>
      </div>

      {/* Alert Condition */}
      {getStatusString() !== "ACCOUNT_SECURE" &&
        getStatusString() !== "OPTIMAL_SECURE" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 p-4 border rounded-lg flex gap-3 ${
              getStatusString() === "CRITICAL_RISK"
                ? "bg-rose-500/5 border-rose-500/20"
                : "bg-amber-500/5 border-amber-500/20"
            }`}
          >
            <AlertTriangle
              size={16}
              className={`flex-shrink-0 mt-0.5 ${getStatusString() === "CRITICAL_RISK" ? "text-rose-500" : "text-amber-500"}`}
            />
            <p
              className={`text-xs leading-relaxed ${getStatusString() === "CRITICAL_RISK" ? "text-rose-400" : "text-amber-400"}`}
            >
              <span className="font-bold">⚠️ EXECUTION_ALERT:</span>{" "}
              {getStatusString() === "CRITICAL_RISK"
                ? "Health factor critical. Add collateral or repay debt immediately to avoid liquidation."
                : "Health factor approaching warning zone. Consider reinforcing your position."}
            </p>
          </motion.div>
        )}
    </div>
  );
};

// 2. Enhanced Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isDarkMode,
  suffix,
  color = "blue",
}) => {
  const colorMap = {
    blue: "text-blue-500",
    green: "text-emerald-500",
    yellow: "text-yellow-500",
    red: "text-rose-500",
    purple: "text-purple-500",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-6 border rounded-xl font-mono flex flex-col justify-between transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
          : "bg-white border-black/5 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-gray-400">
        <div className="flex items-center gap-1.5">
          {Icon && (
            <Icon
              size={12}
              className={colorMap[color] || "text-blue-500"}
              strokeWidth={1.5}
            />
          )}
          <span>{title}</span>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-0.5 font-bold ${trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-gray-500"}`}
          >
            {trend > 0 ? (
              <ArrowUpRight size={10} />
            ) : trend < 0 ? (
              <ArrowDownRight size={10} />
            ) : null}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="text-2xl font-bold tracking-tight mt-2">
        {value}{" "}
        {suffix && (
          <span className="text-xs font-normal text-gray-500">{suffix}</span>
        )}
      </div>

      <div className="text-[9px] text-gray-500 uppercase tracking-tight truncate mt-1">
        {subtitle || "STATUS_VERIFIED"}
      </div>
    </motion.div>
  );
};

// 3. Enhanced Info Row Component
const InfoRow = ({ label, value, isDarkMode, highlight, valueColor }) => (
  <div
    className={`flex justify-between items-center py-3 border-b font-mono text-xs ${
      isDarkMode ? "border-white/5" : "border-black/5"
    } ${highlight ? "bg-blue-500/5 -mx-2 px-2 rounded" : ""}`}
  >
    <span className="text-gray-400 uppercase tracking-tight">{label}</span>
    <span
      className={`font-bold tracking-tight ${
        valueColor ||
        (highlight
          ? "text-blue-500"
          : isDarkMode
            ? "text-gray-300"
            : "text-gray-800")
      }`}
    >
      {value}
    </span>
  </div>
);

// 4. Pool Statistics Card - CORRECTED
const PoolStatsCard = ({
  ethReserves,
  tokenReserves,
  price,
  totalLiquidity,
  loading,
  isDarkMode,
}) => {
  const formatValue = (val) => {
    if (!val) return "—";
    const num = typeof val === "bigint" ? Number(val) / 1e18 : Number(val);
    return num.toFixed(4);
  };

  // Price from contract is already APS per ETH with 18 decimals
  const getAPSPerETH = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);

    // The contract returns price with 18 decimals
    // But the frontend might be getting it as a raw number
    // Check if it's already formatted or needs conversion
    if (raw > 1e18) {
      // It's in wei format (large number)
      return raw / 1e18;
    } else {
      // It's already the raw price
      return raw;
    }
  };

  const apsPerETH = getAPSPerETH();

  // Calculate ETH per APS
  const getETHPerAPS = () => {
    if (apsPerETH === 0) return 0;
    return 1 / apsPerETH;
  };

  const ethPerAPS = getETHPerAPS();

  return (
    <div
      className={`p-6 border rounded-xl transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
          : "bg-white border-black/5 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <PieChart size={14} className="text-blue-500" />
        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
          APSDEX Pool Stats
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw size={20} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">APS/ETH Price</span>
            <span className="text-sm font-bold text-emerald-400">
              {apsPerETH >= 1
                ? apsPerETH.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })
                : apsPerETH.toFixed(6)}{" "}
              <span className="text-[10px] font-normal text-gray-500">APS</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">ETH/APS Price</span>
            <span className="text-sm font-mono text-blue-400">
              {ethPerAPS.toFixed(12)} ETH
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">ETH Reserves</span>
            <span className="text-sm font-mono">
              {formatValue(ethReserves)} ETH
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">APS Reserves</span>
            <span className="text-sm font-mono">
              {formatValue(tokenReserves)} APS
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-500">Total Liquidity</span>
            <span className="text-sm font-bold text-emerald-500">
              {formatValue(totalLiquidity)} LP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Borrowing Power Summary Component
const BorrowingPowerSummary = ({
  collateralETH,
  borrowedAPS,
  healthFactor,
  maxBorrowAPS,
  isDarkMode,
  price,
}) => {
  const getAPSPerETH = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);

    // The contract returns price with 18 decimals
    // But the frontend might be getting it as a raw number
    // Check if it's already formatted or needs conversion
    if (raw > 1e18) {
      // It's in wei format (large number)
      return raw / 1e18;
    } else {
      // It's already the raw price
      return raw;
    }
  };

  const apsPerETH = getAPSPerETH();
  const collateralETHNum = parseFloat(collateralETH) || 0;
  const borrowedAPSNum = parseFloat(borrowedAPS) || 0;
  const healthFactorNum =
    typeof healthFactor === "number"
      ? healthFactor
      : parseFloat(healthFactor) || 0;

  // Calculate max borrow based on 120% collateral ratio
  const calculateMaxBorrow = () => {
    if (collateralETHNum === 0 || apsPerETH === 0) return 0;
    const maxBorrowETH = collateralETHNum / 1.2;
    return maxBorrowETH * apsPerETH;
  };

  const maxBorrow = calculateMaxBorrow();
  const availableToBorrow = Math.max(0, maxBorrow - borrowedAPSNum);

  // Calculate liquidation price
  const liquidationPrice =
    borrowedAPSNum > 0 && collateralETHNum > 0
      ? (borrowedAPSNum * 1.2) / collateralETHNum
      : 0;

  return (
    <div
      className={`p-6 border rounded-xl transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
          : "bg-white border-black/5 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={14} className="text-purple-500" />
        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
          Borrowing Power Summary
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">Current Collateral</span>
          <span className="text-sm font-bold">
            {collateralETHNum.toFixed(4)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">Current Borrowed</span>
          <span className="text-sm font-bold text-yellow-400">
            {borrowedAPSNum.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            APS
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">
            Max Borrow (120% LTV)
          </span>
          <span className="text-sm font-bold text-emerald-400">
            {maxBorrow.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
            APS
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-[10px] text-gray-500">Available to Borrow</span>
          <span
            className={`text-sm font-bold ${
              availableToBorrow > 0 ? "text-blue-400" : "text-rose-400"
            }`}
          >
            {availableToBorrow.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            APS
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">
            Liquidation Price (APS/ETH)
          </span>
          <span
            className={`text-sm font-bold ${
              healthFactorNum > 2
                ? "text-emerald-400"
                : healthFactorNum > 1.5
                  ? "text-yellow-400"
                  : "text-rose-400"
            }`}
          >
            {liquidationPrice.toFixed(4)} APS/ETH
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">Current HF</span>
          <span
            className={`text-sm font-bold ${
              healthFactorNum > 2
                ? "text-emerald-400"
                : healthFactorNum > 1.5
                  ? "text-yellow-400"
                  : "text-rose-400"
            }`}
          >
            {healthFactorNum === Infinity ? "∞" : healthFactorNum.toFixed(2)}x
          </span>
        </div>
      </div>

      {availableToBorrow > 0 && (
        <div className="mt-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
          <span className="text-[9px] text-emerald-400">
            You can borrow up to{" "}
            {availableToBorrow.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            more APS
          </span>
        </div>
      )}

      {healthFactorNum < 1.5 && healthFactorNum > 0 && (
        <div className="mt-4 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-2">
          <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
          <span className="text-[9px] text-yellow-400">
            Health factor is {healthFactorNum.toFixed(2)}x - Consider adding
            collateral or repaying debt
          </span>
        </div>
      )}
    </div>
  );
};

// 6. Main Dashboard Component
function Dashboard() {
  const { isDarkMode } = useDarkMode();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUserOwner, setIsUserOwner] = useState(false);
  const [showInitPool, setShowInitPool] = useState(false);
  const [isPoolInitialized, setIsPoolInitialized] = useState(false);
  const [checkingPool, setCheckingPool] = useState(true);
  const [apsAmount, setAPSAmount] = useState("");

  // User position state - using the same pattern as BorrowingCalculator
  const [userPosition, setUserPosition] = useState(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const {
    getPositionDetails,
    getHealthFactor,
    checkLiquidationStatus,
    calculateStakingYield,
    getRepayableAmount,
    positionDetails,
    healthFactor,
    isLiquidatable,
    yieldAmount,
    repayableAmount,
    loading,
  } = useLending();

  const {
    getCurrentPrice,
    getEthReserves,
    getTokenReserves,
    getTotalLiquidity,
    initializeAPSDEX,
    price,
    ethReserves,
    tokenReserves,
    totalLiquidity,
    loading: apsdexLoading,
    getContractOwner,
  } = useAPSDEX();

  const account = useActiveAccount();
  const address = account?.address;

  const network = import.meta.env.VITE_APP_BLOCKCHAIN_NETWORK
    ? import.meta.env.VITE_APP_BLOCKCHAIN_NETWORK.toUpperCase()
    : "SEPOLIA";

  // Debug price
  console.log("Raw price (wei):", price?.toString());
  if (price) {
    const apsPerETH = Number(price) / 1e18;
    console.log("APS per ETH:", apsPerETH);
    console.log("ETH per APS:", 1 / apsPerETH);
  }

  // Fetch user position - EXACT same as BorrowingCalculator
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
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    } finally {
      setIsLoadingPosition(false);
    }
  };

  // Check if user is contract owner
  useEffect(() => {
    const checkOwner = async () => {
      if (address) {
        try {
          const owner = await getContractOwner();
          setIsUserOwner(address.toLowerCase() === owner?.toLowerCase());
        } catch (error) {
          console.error("Error checking owner:", error);
        }
      }
    };
    checkOwner();
  }, [address, getContractOwner]);

  // Check if pool is initialized
  const checkPoolInitialization = async () => {
    try {
      const reserves = await getTokenReserves();
      setIsPoolInitialized(reserves !== null && reserves !== 0n);
    } catch {
      setIsPoolInitialized(false);
    } finally {
      setCheckingPool(false);
    }
  };

  // Fetch position on mount and address change
  useEffect(() => {
    if (address) {
      fetchUserPosition();
      checkPoolInitialization();
    }
  }, [address]);

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "DISCONNECTED";

  const refreshData = async () => {
    if (!address) return;
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUserPosition(),
        getHealthFactor(address),
        checkLiquidationStatus(address),
        calculateStakingYield(address),
        getRepayableAmount(address),
        getCurrentPrice(),
        getEthReserves(),
        getTokenReserves(),
        getTotalLiquidity(),
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (!address || !isPoolInitialized) return;
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          fetchUserPosition(),
          getHealthFactor(address),
          checkLiquidationStatus(address),
          calculateStakingYield(address),
          getRepayableAmount(address),
          getCurrentPrice(),
          getEthReserves(),
          getTokenReserves(),
          getTotalLiquidity(),
        ]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    void loadDashboardData();
  }, [address, isPoolInitialized]);

  const numericHealthFactor = useMemo(() => {
    if (healthFactor === null || healthFactor === undefined) return 0;
    return typeof healthFactor === "number"
      ? healthFactor
      : parseFloat(healthFactor) || 0;
  }, [healthFactor]);

  // Use userPosition for display, fallback to positionDetails
  const collateralETH = userPosition?.collateralETH?.toFixed(4) || "0.0000";
  const borrowedAPS = userPosition?.borrowedAPS?.toFixed(4) || "0.0000";

  // Get position age from userPosition
  const positionAge = userPosition?.stakeTimestamp
    ? Math.floor((Date.now() / 1000 - userPosition.stakeTimestamp) / 86400)
    : null;

  // Format yields and repayable
  const yieldFormatted = useMemo(() => {
    if (yieldAmount === null || yieldAmount === undefined) return "0.00";
    const num =
      typeof yieldAmount === "bigint"
        ? Number(yieldAmount) / 1e18
        : Number(yieldAmount);
    return num.toFixed(4);
  }, [yieldAmount]);

  const repayableFormatted = useMemo(() => {
    if (repayableAmount === null || repayableAmount === undefined)
      return "0.00";
    if (typeof repayableAmount === "bigint")
      return formatEther(repayableAmount);
    return repayableAmount.toString();
  }, [repayableAmount]);

  const handleInitializePool = async (e) => {
    e.preventDefault();
    if (!apsAmount) return;

    try {
      const success = await initializeAPSDEX(parseEther(apsAmount));
      if (success) {
        setAPSAmount("");
        await refreshData();
        await checkPoolInitialization();
      }
    } catch (error) {
      console.error("Error initializing pool:", error);
    }
  };

  // Calculate max borrow for summary
  const getAPSPerETH = () => {
    if (!price) return 0;
    const raw = typeof price === "bigint" ? Number(price) : Number(price);

    // The contract returns price with 18 decimals
    // But the frontend might be getting it as a raw number
    // Check if it's already formatted or needs conversion
    if (raw > 1e18) {
      // It's in wei format (large number)
      return raw / 1e18;
    } else {
      // It's already the raw price
      return raw;
    }
  };

  const apsPerETH = getAPSPerETH();
  const collateralETHNum = parseFloat(collateralETH) || 0;
  const borrowedAPSNum = parseFloat(borrowedAPS) || 0;
  const maxBorrow =
    collateralETHNum > 0 && apsPerETH > 0
      ? (collateralETHNum / 1.2) * apsPerETH
      : 0;

  return (
    <div
      className={`relative min-h-screen font-sans antialiased p-4 sm:p-6 ${
        isDarkMode ? "bg-[#090A0F] text-white" : "bg-[#FAFAFC] text-gray-950"
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 pt-4">
        {/* Header Section */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500 text-lg">◆</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold">
                FACETLEND CONSOLE
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-emerald-500">{network}</span> Account
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                isDarkMode
                  ? "bg-[#0F111A] border-white/5"
                  : "bg-white border-black/5"
              }`}
            >
              <Wallet size={12} className="text-blue-500" />
              <span className="text-gray-500">ACCOUNT:</span>
              <span className="font-bold">
                {formatAddress(address) || "Not Connected"}
              </span>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing || loading || isLoadingPosition}
              className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:bg-black/10"
              }`}
              title="Synchronize State Registry"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="text-xs hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Last Updated Timestamp */}
        {lastUpdated && (
          <div className="flex justify-end">
            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <Clock size={10} />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Stats Grid - 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Collateral"
            value={collateralETH}
            suffix="ETH"
            subtitle="VAULT_ROUTING: ACTIVE"
            icon={Layers}
            isDarkMode={isDarkMode}
            color="blue"
          />
          <StatCard
            title="Borrowed APS"
            value={parseFloat(borrowedAPS).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
            suffix="APS"
            subtitle="ACTIVE_DEBT"
            icon={TrendingUp}
            isDarkMode={isDarkMode}
            color="yellow"
          />
          <StatCard
            title="Accrued Yield"
            value={yieldFormatted}
            suffix="APS"
            subtitle="STAKING_ESCROW"
            icon={Cpu}
            isDarkMode={isDarkMode}
            color="purple"
          />
          <StatCard
            title="Repayable Debt"
            value={repayableFormatted}
            suffix="ETH"
            subtitle="CLEARING_POOL"
            icon={ShieldAlert}
            isDarkMode={isDarkMode}
            color="red"
          />
          <StatCard
            title="Max Borrow"
            value={maxBorrow.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
            suffix="APS"
            subtitle="120% LTV LIMIT"
            icon={DollarSign}
            isDarkMode={isDarkMode}
            color="green"
          />
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Health Factor */}
          <div className="lg:col-span-1">
            <HealthFactorGauge
              healthFactor={address ? numericHealthFactor : "0.00"}
              liquidationThreshold={1.0}
              warningThreshold={1.5}
            />
          </div>

          {/* Center: Borrowing Power Summary */}
          <div className="lg:col-span-1">
            <BorrowingPowerSummary
              collateralETH={collateralETH}
              borrowedAPS={borrowedAPS}
              healthFactor={numericHealthFactor}
              maxBorrowAPS={maxBorrow}
              isDarkMode={isDarkMode}
              price={price}
            />
          </div>

          {/* Right: Position Storage Registry */}
          <div
            className={`p-6 border rounded-xl transition-all duration-300 ${
              isDarkMode
                ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
                : "bg-white border-black/5 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                <KeyRound size={12} className="text-blue-500" />
                <span>Position Storage Matrix</span>
              </div>
            </div>
            <div className="space-y-1">
              <InfoRow
                label="Liquidation Status"
                value={isLiquidatable ? "⚠️ ELIGIBLE" : "✅ COMPLIANT"}
                isDarkMode={isDarkMode}
                highlight={isLiquidatable}
                valueColor={
                  isLiquidatable ? "text-rose-400" : "text-emerald-400"
                }
              />
              <InfoRow
                label="Collateral"
                value={`${collateralETH} ETH`}
                isDarkMode={isDarkMode}
              />
              <InfoRow
                label="Borrowed"
                value={`${parseFloat(borrowedAPS).toLocaleString(undefined, { maximumFractionDigits: 0 })} APS`}
                isDarkMode={isDarkMode}
              />
              <InfoRow
                label="Health Factor"
                value={`${numericHealthFactor.toFixed(2)}x`}
                isDarkMode={isDarkMode}
                highlight={numericHealthFactor < 1.5}
                valueColor={
                  numericHealthFactor > 2
                    ? "text-emerald-400"
                    : numericHealthFactor > 1.5
                      ? "text-yellow-400"
                      : "text-rose-400"
                }
              />
              <InfoRow
                label="Position Age"
                value={positionAge !== null ? `${positionAge} days` : "—"}
                isDarkMode={isDarkMode}
              />
            </div>
            <div
              className={`mt-4 pt-4 border-t text-[9px] flex justify-between items-center ${
                isDarkMode
                  ? "border-white/5 text-gray-600"
                  : "border-black/5 text-gray-400"
              }`}
            >
              <span>Security Audits: ✅ Verified</span>
              <span>Sys_Status: 0x00</span>
            </div>
          </div>
        </div>

        {/* Pool Stats & Init Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PoolStatsCard
              ethReserves={ethReserves}
              tokenReserves={tokenReserves}
              price={price}
              totalLiquidity={totalLiquidity}
              loading={apsdexLoading}
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            {/* Only show pool initialization section for contract owner */}
            {isUserOwner && !isPoolInitialized && (
              <div
                className={`p-6 border rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-[#0F111A] border-white/5 hover:border-blue-500/20"
                    : "bg-white border-black/5 shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setShowInitPool(!showInitPool)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-blue-500" />
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                      Pool Administration
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {showInitPool ? "▼" : "▶"}
                  </span>
                </button>

                <AnimatePresence>
                  {showInitPool && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleInitializePool}
                      className="overflow-hidden mt-4"
                    >
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-500">
                          Initialize APSDEX pool with initial APS liquidity
                        </p>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="APS amount"
                          value={apsAmount}
                          onChange={(e) => setAPSAmount(e.target.value)}
                          className={`w-full p-3 rounded-lg border outline-none text-sm font-mono ${
                            isDarkMode
                              ? "bg-[#090A0F] border-white/5 text-white focus:border-blue-500/50"
                              : "bg-white border-black/5 text-gray-950 focus:border-blue-500/50"
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!apsAmount || apsdexLoading}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                            !apsAmount || apsdexLoading
                              ? "bg-gray-500/20 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {apsdexLoading
                            ? "Initializing..."
                            : "Initialize Pool"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Pool status message if initialized */}
            {isPoolInitialized && (
              <div
                className={`p-6 border rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-[#0F111A] border-emerald-500/20"
                    : "bg-white border-emerald-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">
                    Pool Initialized
                  </span>
                </div>
                <p className="text-[9px] text-gray-500 mt-2">
                  APSDEX pool is ready for trading and lending
                </p>
                <div className="mt-3 text-[9px] space-y-1 text-gray-500">
                  <div className="flex justify-between">
                    <span>ETH Reserves:</span>
                    <span className="font-mono">
                      {ethReserves ? Number(ethReserves) / 1e18 : 0} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>APS Reserves:</span>
                    <span className="font-mono">
                      {tokenReserves ? Number(tokenReserves) / 1e18 : 0} APS
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-4">
          <motion.a
            whileHover={{ scale: 0.98 }}
            href="/lending"
            className={`p-4 rounded-xl border text-center transition-all duration-200 ${
              isDarkMode
                ? "bg-[#0F111A] border-white/5 hover:border-blue-500/30"
                : "bg-white border-black/5 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Activity size={16} className="text-blue-500" />
              <span className="text-sm font-bold">Go to Lending Console</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">
              Manage collateral, borrow, and harvest rewards
            </p>
          </motion.a>

          <motion.a
            whileHover={{ scale: 0.98 }}
            href="/flashloan"
            className={`p-4 rounded-xl border text-center transition-all duration-200 ${
              isDarkMode
                ? "bg-[#0F111A] border-white/5 hover:border-blue-500/30"
                : "bg-white border-black/5 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap size={16} className="text-blue-500" />
              <span className="text-sm font-bold">Flashloan Terminal</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">
              Execute atomic flashloan operations
            </p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
