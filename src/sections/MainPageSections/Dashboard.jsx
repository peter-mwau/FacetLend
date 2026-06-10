import { useDarkMode } from "../../hooks/useDarkMode";
import { useLending } from "../../contexts/LendingContext";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

function Dashboard() {
  const { isDarkMode } = useDarkMode();
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
    error,
  } = useLending();
  const account = useActiveAccount();
  const address = account?.address;

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return value.toString();
  };

  const formatEther = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    const bigintValue = BigInt(value);
    const whole = bigintValue / 10n ** 18n;
    const fraction = bigintValue % 10n ** 18n;
    const fractionText = fraction
      .toString()
      .padStart(18, "0")
      .replace(/0+$/, "");

    return fractionText ? `${whole}.${fractionText}` : whole.toString();
  };

  const formatTimestamp = (value) => {
    if (!value || value === 0n) {
      return "Not set";
    }

    const milliseconds = Number(value) * 1000;
    return Number.isNaN(milliseconds)
      ? "Invalid date"
      : new Date(milliseconds).toLocaleString();
  };

  const formatBoolean = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return value ? "Yes" : "No";
  };

  useEffect(() => {
    if (!address) {
      return;
    }

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

  console.log("User Position Details:", positionDetails);

  return (
    <div
      className={`p-10 rounded-lg shadow-md mt-12.5 ${isDarkMode ? "bg-[#111827] text-gray-100 shadow-black/20" : "bg-white text-gray-900 shadow-gray-200"}`}
    >
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
        Welcome to the Lending Dashboard! Here you can monitor your lending and
        borrowing activities, manage your positions, and access various tools to
        optimize your DeFi experience.
      </p>
      {error ? (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Health Factor</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            {healthFactor ? formatValue(healthFactor) : "-"}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Liquidation Risk</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            {formatBoolean(isLiquidatable)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Repayable Amount</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            {repayableAmount ? formatValue(repayableAmount) : "-"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Staking Yield</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            {yieldAmount ? formatValue(yieldAmount) : "-"}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Wallet Address</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            {address ?? "Connect wallet"}
          </p>
          <p
            className={
              isDarkMode
                ? "text-gray-400 text-sm mt-1"
                : "text-gray-500 text-sm mt-1"
            }
          >
            {loading
              ? "Refreshing dashboard data..."
              : "Live from LendingContext"}
          </p>
        </div>
      </div>

      <div
        className={`mt-8 rounded-lg border p-6 ${isDarkMode ? "border-[#2B3142] bg-[#151A26]" : "border-gray-200 bg-gray-50"}`}
      >
        <h3 className="text-xl font-semibold mb-4">Your Position</h3>

        {positionDetails ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-md p-4 bg-black/5 dark:bg-white/5">
              <p className="text-sm opacity-70 mb-1">Collateral</p>
              <p className="text-lg font-medium">
                {formatEther(positionDetails.collateralETH)} ETH
              </p>
            </div>
            <div className="rounded-md p-4 bg-black/5 dark:bg-white/5">
              <p className="text-sm opacity-70 mb-1">Borrowed APS</p>
              <p className="text-lg font-medium">
                {formatValue(positionDetails.borrowedAPS)} APS
              </p>
            </div>
            <div className="rounded-md p-4 bg-black/5 dark:bg-white/5">
              <p className="text-sm opacity-70 mb-1">Borrow Timestamp</p>
              <p className="text-lg font-medium">
                {formatTimestamp(positionDetails.borrowTimestamp)}
              </p>
            </div>
            <div className="rounded-md p-4 bg-black/5 dark:bg-white/5">
              <p className="text-sm opacity-70 mb-1">Risk Timestamp</p>
              <p className="text-lg font-medium">
                {formatTimestamp(positionDetails.riskTimestamp)}
              </p>
            </div>
            <div className="rounded-md p-4 bg-black/5 dark:bg-white/5 sm:col-span-2 lg:col-span-4">
              <p className="text-sm opacity-70 mb-1">Stake Timestamp</p>
              <p className="text-lg font-medium">
                {formatTimestamp(positionDetails.stakeTimestamp)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm opacity-70">
            No position data loaded yet. Connect a wallet to view your lending
            position.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
