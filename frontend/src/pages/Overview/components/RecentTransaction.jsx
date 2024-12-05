const RecentTransaction = () => {
  return (
    <div>
      <h2 className="text-[#878787] text-lg">Recent Transaction</h2>
      <div className="bg-white rounded-lg shadow-lg px-6 py-4 mt-2">
        <div className="flex justify-evenly items-center ">
          <button className="text-[#299D91] font-semibold border-[#299D91] border-b-2 py-2">
            All
          </button>
          <button className=" font-semibold">Revenue</button>
          <button className=" font-semibold">Expenses</button>
        </div>
        <div className="divide-y mt-3">
          <div className="flex justify-between items-center py-6">
            <div>
              <p className="font-semibold">Bioskop</p>
              <p className="text-[#9F9F9F] text-xs">Gopay</p>
            </div>
            <div>
              <p className="font-semibold">Rp45.000</p>
              <p className="text-[#9F9F9F] text-xs">02 Des 2024</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-6">
            <div>
              <p className="font-semibold">Bioskop</p>
              <p className="text-[#9F9F9F] text-xs">Gopay</p>
            </div>
            <div>
              <p className="font-semibold">Rp45.000</p>
              <p className="text-[#9F9F9F] text-xs">02 Des 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
