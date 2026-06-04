import { useDarkMode } from "../../hooks/useDarkMode";

function BorrowingSection() {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`p-10 rounded-lg shadow-md mt-12.5 ${isDarkMode ? "bg-[#111827] text-gray-100 shadow-black/20" : "bg-white text-gray-900 shadow-gray-200"}`}
    >
      <h2 className="text-2xl font-semibold mb-4">Borrowing Section</h2>
      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
        This is the Borrowing Section. Here you can manage your borrowing
        activities, view your active loans, and monitor your health factor.
      </p>
    </div>
  );
}

export default BorrowingSection;
