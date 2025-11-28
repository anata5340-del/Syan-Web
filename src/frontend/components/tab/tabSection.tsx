// components/TabSection.js
export default function TabSection({
  type,
  activeTab,
  setActiveTab,
}: {
  type: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="border border-[#636363] rounded">
      <div className="flex ">
        <button
          className={`flex-1 ms-1 py-1 px-3 text-xs text-center ${
            activeTab === "total" || activeTab === "weekly"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(type === "Chart" ? "weekly" : "total")}
        >
          {type === "Chart" ? "Weekly" : "Total"}
        </button>
        <button
          className={`flex-1 py-1 px-3 text-xs text-center ${
            activeTab === "today" || activeTab === "monthly"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(type === "Chart" ? "monthly" : "today")}
        >
          {type === "Chart" ? "Monthly" : "Today"}
        </button>
        <button
          className={`flex-1 me-1 py-1 px-3 text-xs text-center ${
            activeTab === "month" || activeTab === "yearly"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(type === "Chart" ? "yearly" : "month")}
        >
          {type === "Chart" ? "Yearly" : "Month"}
        </button>
      </div>
    </div>
  );
}
