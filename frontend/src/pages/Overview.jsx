import ChartBarPemasukkan from "../components/ChartBarPemasukkan";
import ChartBarPengeluaran from "../components/ChartBarPengeluaran";
import ChartPie from "../components/ChartPie";

const Overview = () => {
  return (
    <div className="my-4 mx-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <div className="flex gap-4">
        <div>
          <div className="bg-slate-700/20 rounded-xl shadow-xl p-4 mt-4">
            <ChartBarPengeluaran />
          </div>
          <div className="bg-slate-700/20 rounded-xl shadow-xl p-4 mt-4">
            <ChartPie />
          </div>
        </div>
        <div>
          <div className="bg-slate-700/20 rounded-xl shadow-xl p-4 mt-4">
            <ChartBarPemasukkan />
          </div>
          <div className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-auto p-4 mt-4">
            <h1 className="text-lg font-semibold">Transaksi</h1>
            <div className="bg-white flex items-center justify-between rounded-lg py-2 px-3 ">
              <h2>Tunai</h2>
              <p>Rp1.890.000</p>
            </div>
            <div className="bg-white flex items-center justify-between rounded-lg py-2 px-3 ">
              <h2>BRI</h2>
              <p>Rp980.000</p>
            </div>
            <div className="bg-white flex items-center justify-between rounded-lg py-2 px-3 ">
              <h2>Gopay</h2>
              <p>Rp1.890.000</p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-slate-700/20 flex flex-col gap-3 rounded-xl shadow-xl w-44 p-4 mt-4">
            <h1 className="text-lg font-semibold">Dompet</h1>
            <div className="bg-white rounded-lg py-2 px-3 ">
              <h2>Tunai</h2>
              <p className="text-sm font-medium">Rp1.890.000</p>
            </div>
            <div className="bg-white rounded-lg py-2 px-3 ">
              <h2>BRI</h2>
              <p className="text-sm font-medium">Rp980.000</p>
            </div>
            <div className="bg-white rounded-lg py-2 px-3 ">
              <h2>Gopay</h2>
              <p className="text-sm font-medium">Rp1.890.000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
