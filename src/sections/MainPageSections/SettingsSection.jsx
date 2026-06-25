// components/sections/SettingsSection.jsx
import { useState, useEffect } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useActiveAccount } from "thirdweb/react";
import { useLending } from "../../contexts/LendingContext";
import { useAPSDEX } from "../../contexts/APSDEXContext";
import { useFlashLoan } from "../../contexts/FlashLoanContext";
import { useMovePrice } from "../../contexts/MovePriceContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  RefreshCw,
  Shield,
  ShieldCheck,
  Wallet,
  KeyRound,
  User,
  Bell,
  BellOff,
  Globe,
  Lock,
  Unlock,
  Settings as SettingsIcon,
  Info,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  Zap,
  Coins,
  TrendingUp,
  Smartphone,
  Laptop,
  Monitor,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatEther } from "viem";

function SettingsSection() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const account = useActiveAccount();
  const address = account?.address;

  // Contexts
  const { healthFactor, positionDetails, loading } = useLending();
  const { price, ethReserves, tokenReserves } = useAPSDEX();
  const { tokenBalance } = useFlashLoan();
  const { error } = useMovePrice();

  // Local state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Network settings
  const [selectedNetwork, setSelectedNetwork] = useState("sepolia");
  const [selectedTheme, setSelectedTheme] = useState(
    isDarkMode ? "dark" : "light",
  );

  // Notification settings
  const [healthAlertThreshold, setHealthAlertThreshold] = useState("1.5");
  const [liquidationAlert, setLiquidationAlert] = useState(true);

  const networks = [
    { id: "sepolia", name: "Sepolia", icon: "🔵", chainId: 11155111 },
    { id: "mainnet", name: "Ethereum Mainnet", icon: "🟣", chainId: 1 },
    { id: "polygon", name: "Polygon", icon: "🟣", chainId: 137 },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵", chainId: 42161 },
  ];

  // Copy address to clipboard
  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  // Refresh all data
  const refreshAllData = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing all data...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Data refreshed!");
    setIsRefreshing(false);
  };

  // Handle theme change
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (theme === "dark" && !isDarkMode) toggleDarkMode();
    if (theme === "light" && isDarkMode) toggleDarkMode();
    toast.success(`Theme switched to ${theme} mode`);
  };

  // Reset settings
  const resetSettings = () => {
    setNotificationsEnabled(true);
    setAutoRefresh(true);
    setHealthAlertThreshold("1.5");
    setLiquidationAlert(true);
    setSelectedNetwork("sepolia");
    toast.success("Settings reset to default");
  };

  // Save settings
  const saveSettings = () => {
    toast.success("Settings saved successfully!");
    // In a real app, you'd save to localStorage or backend
  };

  // Format address
  const formatAddress = (addr) => {
    if (!addr) return "Not Connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Health factor status
  const getHealthStatus = () => {
    if (!healthFactor) return { color: "text-gray-400", label: "No Data" };
    const hf =
      typeof healthFactor === "bigint"
        ? Number(healthFactor) / 1e18
        : Number(healthFactor);
    if (hf >= 2.0) return { color: "text-emerald-400", label: "Excellent" };
    if (hf >= 1.5) return { color: "text-yellow-400", label: "Good" };
    if (hf >= 1.1) return { color: "text-orange-400", label: "Caution" };
    return { color: "text-red-400", label: "Critical" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 border rounded-xl text-sm relative overflow-hidden mt-12 ${
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
          <SettingsIcon size={18} className="text-blue-500" />
          <span
            className={`text-[10px] uppercase font-bold tracking-widest ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Settings
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshAllData}
            disabled={isRefreshing}
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "border-white/5 hover:bg-white/5 text-gray-400"
                : "border-gray-200 hover:bg-gray-50 text-gray-500"
            }`}
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={saveSettings}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isDarkMode
                ? "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            } border`}
          >
            <Save size={12} className="inline mr-1" />
            Save
          </button>
        </div>
      </div>

      {/* Wallet Info */}
      <div
        className={`p-4 rounded-lg border mb-6 relative z-10 ${
          isDarkMode
            ? "bg-white/[0.01] border-white/5"
            : "bg-gray-50/50 border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                address ? "bg-emerald-500/20" : "bg-yellow-500/20"
              }`}
            >
              {address ? (
                <ShieldCheck size={18} className="text-emerald-400" />
              ) : (
                <Shield size={18} className="text-yellow-400" />
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500">Connected Wallet</div>
              <div className="font-mono text-sm flex items-center gap-2">
                {address ? formatAddress(address) : "Not Connected"}
                {address && (
                  <button
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>
          {address && (
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-bold ${healthStatus.color}`}>
                {healthStatus.label}
              </span>
              <span className="text-gray-500">|</span>
              <span className="font-mono text-gray-500">
                {healthFactor ? (Number(healthFactor) / 1e18).toFixed(2) : "—"}x
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Theme Settings */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            {isDarkMode ? (
              <Moon size={16} className="text-blue-400" />
            ) : (
              <Sun size={16} className="text-yellow-500" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Theme
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                selectedTheme === "light"
                  ? isDarkMode
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-white/5 hover:border-white/20"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Sun
                size={20}
                className={`mx-auto mb-1 ${
                  selectedTheme === "light"
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              />
              <div className="text-[10px] font-medium">Light</div>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                selectedTheme === "dark"
                  ? isDarkMode
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-white/5 hover:border-white/20"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Moon
                size={20}
                className={`mx-auto mb-1 ${
                  selectedTheme === "dark" ? "text-blue-400" : "text-gray-400"
                }`}
              />
              <div className="text-[10px] font-medium">Dark</div>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                selectedTheme === "system"
                  ? isDarkMode
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-white/5 hover:border-white/20"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Monitor
                size={20}
                className={`mx-auto mb-1 ${
                  selectedTheme === "system"
                    ? "text-purple-400"
                    : "text-gray-400"
                }`}
              />
              <div className="text-[10px] font-medium">System</div>
            </button>
          </div>
        </div>

        {/* Network Settings */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Network
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  selectedNetwork === network.id
                    ? isDarkMode
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : isDarkMode
                      ? "border-white/5 hover:border-white/20 text-gray-400"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <span className="mr-1">{network.icon}</span>
                {network.name}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-gray-500 text-center">
            Current: Sepolia (Chain ID: 11155111)
          </div>
        </div>

        {/* Notifications */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            {notificationsEnabled ? (
              <Bell size={16} className="text-yellow-400" />
            ) : (
              <BellOff size={16} className="text-gray-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Notifications
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs">Enable notifications</span>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled
                    ? "bg-emerald-500"
                    : isDarkMode
                      ? "bg-white/20"
                      : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    notificationsEnabled ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">Health factor alerts</span>
              <button
                onClick={() => setLiquidationAlert(!liquidationAlert)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  liquidationAlert
                    ? "bg-emerald-500"
                    : isDarkMode
                      ? "bg-white/20"
                      : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    liquidationAlert ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Health alert threshold
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="3.0"
                value={healthAlertThreshold}
                onChange={(e) => setHealthAlertThreshold(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs font-mono ${
                  isDarkMode
                    ? "bg-[#090A0F] border-white/5 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div
          className={`p-5 border rounded-lg ${
            isDarkMode
              ? "bg-white/[0.01] border-white/5"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Preferences
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs">Auto-refresh data</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoRefresh
                    ? "bg-emerald-500"
                    : isDarkMode
                      ? "bg-white/20"
                      : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    autoRefresh ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">Show advanced settings</span>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showAdvanced
                    ? "bg-emerald-500"
                    : isDarkMode
                      ? "bg-white/20"
                      : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    showAdvanced ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 relative z-10"
          >
            <div
              className={`p-5 border rounded-lg ${
                isDarkMode
                  ? "bg-white/[0.01] border-yellow-500/30"
                  : "bg-yellow-50/50 border-yellow-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">
                  Advanced Settings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Gas Limit
                  </label>
                  <input
                    type="text"
                    defaultValue="3000000"
                    className={`w-full p-2 rounded-lg border text-xs font-mono ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    RPC Endpoint
                  </label>
                  <input
                    type="text"
                    defaultValue="https://sepolia.infura.io/v3/..."
                    className={`w-full p-2 rounded-lg border text-xs font-mono ${
                      isDarkMode
                        ? "bg-[#090A0F] border-white/5 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={resetSettings}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                    isDarkMode
                      ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      : "border-yellow-300 text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <RotateCcw size={12} className="inline mr-1" />
                  Reset Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Info */}
      <div
        className={`mt-6 p-4 rounded-lg border relative z-10 ${
          isDarkMode
            ? "bg-white/[0.01] border-white/5"
            : "bg-gray-50/50 border-gray-200"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
          <div>
            <span className="text-gray-500">Version</span>
            <div className="font-mono">v0.1.0</div>
          </div>
          <div>
            <span className="text-gray-500">Network</span>
            <div className="font-mono">Sepolia</div>
          </div>
          <div>
            <span className="text-gray-500">Chain ID</span>
            <div className="font-mono">11155111</div>
          </div>
          <div>
            <span className="text-gray-500">Status</span>
            <div className="font-mono text-emerald-400">Operational</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 relative z-10">
        <button
          onClick={saveSettings}
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            isDarkMode
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <Save size={14} className="inline mr-2" />
          Save All Settings
        </button>
        <button
          onClick={resetSettings}
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
            isDarkMode
              ? "border-white/10 text-gray-400 hover:bg-white/5"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <RotateCcw size={14} className="inline mr-2" />
          Reset to Default
        </button>
        <a
          href="https://sepolia.etherscan.io/address/0x5d182fb5decFbD41d7fFe44C2803D91E5397369d"
          target="_blank"
          rel="noopener noreferrer"
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
            isDarkMode
              ? "border-white/10 text-gray-400 hover:bg-white/5"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ExternalLink size={14} className="inline mr-2" />
          View Contract
        </a>
      </div>
    </div>
  );
}

export default SettingsSection;
