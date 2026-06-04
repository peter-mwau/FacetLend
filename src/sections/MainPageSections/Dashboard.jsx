import { useDarkMode } from "../../hooks/useDarkMode";

function Dashboard() {
  const { isDarkMode } = useDarkMode();

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
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Total Value Locked</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            $1,234,567
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Active Loans</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            42
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow-sm ${isDarkMode ? "bg-[#1A1F2E]" : "bg-gray-100"}`}
        >
          <h3 className="text-lg font-medium mb-2">Health Factor</h3>
          <p
            className={
              isDarkMode ? "text-gray-200 text-xl" : "text-gray-700 text-xl"
            }
          >
            1.5
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
