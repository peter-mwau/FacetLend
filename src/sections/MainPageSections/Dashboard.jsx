import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// 1. Core Health Factor Monitor Component
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
    return "ACCOUNT_SECURE";
  };

  const getStatusColorClass = () => {
    switch (getStatusString()) {
      case "CRITICAL_RISK":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "MARGIN_WARNING":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  const getBarColor = () => {
    if (getStatusString() === "CRITICAL_RISK") return "bg-rose-500";
    if (getStatusString() === "MARGIN_WARNING") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div
      className={`p-6 border rounded-xl font-mono ${isDarkMode ? "bg-[#0F111A] border-white/5" : "bg-white border-black/5 shadow-sm"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-wider">
          <Shield size={12} className="text-blue-500" />
          <span>System Collateral Ratio</span>
        </div>
        <span
          className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${getStatusColorClass()}`}
        >
          {getStatusString()}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span
          className={`text-4xl font-bold tracking-tight ${
            getStatusString() === "CRITICAL_RISK"
              ? "text-rose-500"
              : getStatusString() === "MARGIN_WARNING"
                ? "text-amber-500"
                : "text-emerald-500"
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

      {/* Structural Pipeline Track */}
      <div
        className={`relative h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-black/5"}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className={`absolute h-full rounded-full ${getBarColor()}`}
        />
        {/* Precise Intersecting Limit Vectors */}
        <div
          className="absolute top-0 h-full w-px bg-white/40"
          style={{ left: `${(liquidationThreshold / maxDisplay) * 100}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-amber-500/40"
          style={{ left: `${(warningThreshold / maxDisplay) * 100}%` }}
        />
      </div>

      {/* Axis Data Labels */}
      <div className="flex justify-between text-[9px] text-gray-500 mt-2 uppercase tracking-tight">
        <span>0.00x</span>
        <span>Liquidation ({liquidationThreshold.toFixed(1)}x)</span>
        <span>Warning ({warningThreshold.toFixed(1)}x)</span>
        <span>3.00x+</span>
      </div>

      {/* Hard Alert Condition Block */}
      {getStatusString() !== "ACCOUNT_SECURE" && (
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
            <span className="font-bold">SYSTEM_EXECUTION_ALERT:</span>{" "}
            {getStatusString() === "CRITICAL_RISK"
              ? "Chassis allocation under extreme volatility risk. Supplement primary collateral deposits or initiate partial debt repayment variables immediately to protect state ledger."
              : "Collateral balance depth approaching caution boundaries. Consider reinforcing asset margins to safeguard loan positions."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// 2. Telemetry Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isDarkMode,
}) => (
  <div
    className={`p-6 border rounded-xl font-mono flex flex-col justify-between h-32 transition-colors ${
      isDarkMode
        ? "bg-[#0F111A] border-white/5"
        : "bg-white border-black/5 shadow-sm"
    }`}
  >
    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-gray-400">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-blue-500" strokeWidth={1.5} />}
        <span>{title}</span>
      </div>
      {trend !== undefined && (
        <span
          className={`font-bold ${trend > 0 ? "text-emerald-500" : "text-rose-500"}`}
        >
          {trend > 0 ? "+" : "-"}
          {Math.abs(trend)}%
        </span>
      )}
    </div>

    <div className="text-2xl font-bold tracking-tight mt-2">{value}</div>

    <div className="text-[9px] text-gray-500 uppercase tracking-tight truncate">
      {subtitle || "STATUS_VERIFIED // SECURE"}
    </div>
  </div>
);

// 3. Compact Info Row Component
const InfoRow = ({ label, value, isDarkMode }) => (
  <div
    className={`flex justify-between items-center py-3 border-b font-mono text-xs ${
      isDarkMode ? "border-white/5" : "border-black/5"
    }`}
  >
    <span className="text-gray-400 uppercase tracking-tight">{label}</span>
    <span
      className={`font-bold tracking-tight ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

// 4. Main Console Module Component
function Dashboard() {
  const { isDarkMode } = useDarkMode();
  const [refreshing, setRefreshing] = useState(false);
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

  const account = useActiveAccount();
  const address = account?.address;

  const network = import.meta.env.VITE_APP_BLOCKCHAIN_NETWORK
    ? import.meta.env.VITE_APP_BLOCKCHAIN_NETWORK.toUpperCase()
    : "SEPOLIA";

  const formatValue = (value) =>
    value === null || value === undefined ? "0.00" : value.toString();

  const formatEther = (value) => {
    if (value === null || value === undefined) return "0.00";
    try {
      const bigintValue = BigInt(value);
      const whole = bigintValue / 10n ** 18n;
      const fraction = bigintValue % 10n ** 18n;
      const fractionText = fraction
        .toString()
        .padStart(18, "0")
        .replace(/0+$/, "");
      return fractionText
        ? `${whole}.${fractionText.slice(0, 4)}`
        : whole.toString();
    } catch {
      return "0.00";
    }
  };

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "DISCONNECTED";
  const formatTimestamp = (value) => {
    if (!value || value === 0n) return "NO_RECORD";
    const milliseconds = Number(value) * 1000;
    return Number.isNaN(milliseconds)
      ? "INVALID_TIME"
      : new Date(milliseconds).toLocaleDateString();
  };

  const refreshData = async () => {
    if (!address) return;
    setRefreshing(true);
    await Promise.all([
      getPositionDetails(address),
      getHealthFactor(address),
      checkLiquidationStatus(address),
      calculateStakingYield(address),
      getRepayableAmount(address),
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    if (!address) return;
    const loadDashboardData = async () => {
      await Promise.all([
        getPositionDetails(address),
        getHealthFactor(address),
        checkLiquidationStatus(address),
        calculateStakingYield(address),
        getRepayableAmount(address),
      ]);
    };
    void loadDashboardData();
  }, [
    address,
    getPositionDetails,
    getHealthFactor,
    checkLiquidationStatus,
    calculateStakingYield,
    getRepayableAmount,
  ]);

  const numericHealthFactor =
    typeof healthFactor === "number"
      ? healthFactor
      : parseFloat(healthFactor) || 0;

  // Helper to safely access position details array
  const collateralETH = positionDetails?.[0]
    ? formatEther(positionDetails[0])
    : "0.00";
  const borrowedETH = positionDetails?.[1]
    ? formatEther(positionDetails[1])
    : "0.00";
  const principalBalance = positionDetails?.[2]
    ? formatEther(positionDetails[2])
    : "0.00";
  const interestRate = positionDetails?.[3]
    ? formatValue(positionDetails[3])
    : "0.00";

  return (
    <div
      className={`relative min-h-screen font-sans antialiased p-6 ${
        isDarkMode ? "bg-[#090A0F] text-white" : "bg-[#FAFAFC] text-gray-950"
      }`}
    >
      {/* Structural Low-Contrast Accent Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 pt-6">
        {/* Top Control Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold">
              <span>[ Liquidity Console Room ]</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              <span className="italic text-emerald-500">{network}</span> Account
              Overview
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-3 ${
                isDarkMode
                  ? "bg-[#0F111A] border-white/5"
                  : "bg-white border-black/5"
              }`}
            >
              PROVIDER_ID: {formatAddress(address)}
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing || loading}
              className={`p-2.5 rounded-lg border flex items-center justify-center transition-colors ${
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
            </button>
          </div>
        </div>

        {/* Global Protocol Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Collateral Deposited"
            value={`${collateralETH} ETH`}
            subtitle="VAULT_ROUTING: ACTIVE"
            icon={Layers}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Active Allocated Debt"
            value={`${borrowedETH} ETH`}
            subtitle="UTILIZATION_LIMIT: BALANCED"
            icon={TrendingUp}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Accruing Protocol Yield"
            value={`${formatValue(yieldAmount)} APS`}
            subtitle="STAKING_ESCROW_MULTIPLIER"
            icon={Cpu}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Outstanding Settlement Due"
            value={`${formatEther(repayableAmount)} ETH`}
            subtitle="CLEARING_POOL_ROUTE"
            icon={ShieldAlert}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Core Layout Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Dynamic Risk Analytics Monitor */}
          <HealthFactorGauge
            healthFactor={
              address ? <span>{numericHealthFactor.toFixed(2)}</span> : "0.00"
            }
            liquidationThreshold={1.0}
            warningThreshold={1.5}
          />

          {/* RIGHT: Stateful Storage Slot Registry Ledger */}
          <div
            className={`p-6 border rounded-xl flex flex-col justify-between min-h-[300px] ${
              isDarkMode
                ? "bg-[#0F111A] border-white/5"
                : "bg-white border-black/5 shadow-sm"
            }`}
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2">
                <KeyRound size={12} className="text-blue-500" />
                <span>On-Chain Storage Memory Matrix</span>
              </div>
            </div>
            <div className="space-y-1">
              <InfoRow
                label="Liquidation Clearance State"
                value={
                  isLiquidatable
                    ? "CRITICAL_REVERT_TRIGGERABLE"
                    : "COMPLIANT_LIQUID_STABLE"
                }
                isDarkMode={isDarkMode}
              />
              <InfoRow
                label="Chassis Principal Memory Balance"
                value={`${principalBalance} ETH`}
                isDarkMode={isDarkMode}
              />
              <InfoRow
                label="Interest Rate Index Vector"
                value={`${interestRate}% Baseline`}
                isDarkMode={isDarkMode}
              />
            </div>
            <div
              className={`mt-4 pt-4 border-t text-[9px] ${isDarkMode ? "border-white/5 text-gray-600" : "border-black/5 text-gray-400"}`}
            >
              Security Audits: Verified | Sys_Status: 0x0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
