function Dashboard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md pt-[100px]">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="text-gray-600">
        Welcome to the Lending Dashboard! Here you can monitor your lending and
        borrowing activities, manage your positions, and access various tools to
        optimize your DeFi experience.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Total Value Locked</h3>
          <p className="text-gray-700 text-xl">$1,234,567</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Active Loans</h3>
          <p className="text-gray-700 text-xl">42</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Health Factor</h3>
          <p className="text-gray-700 text-xl">1.5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
