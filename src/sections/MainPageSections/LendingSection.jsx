import { useDarkMode } from "../../hooks/useDarkMode";

function LendingSection() {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`p-10 rounded-lg shadow-md mt-12.5 ${isDarkMode ? "bg-[#111827] text-gray-100 shadow-black/20" : "bg-white text-gray-900 shadow-gray-200"}`}
    >
      <h2 className="text-2xl font-semibold mb-4">Lending Section</h2>
      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
        This is the Lending Section. Here you can manage your lending
        activities, view your active loans, and monitor your health factor.
      </p>
    </div>
  );
}

export default LendingSection;
