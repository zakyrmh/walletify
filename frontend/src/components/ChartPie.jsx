import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Mendaftarkan modul yang diperlukan untuk Pie Chart
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPie = () => {
  // Data untuk Pie Chart
  const data = {
    labels: ["Belanja", "Kendaraan", "Jajan", "Kesehatan"],
    datasets: [
      {
        label: "Keuangan",
        data: [3000, 2000, 1000, 1500], // Data untuk tiap bagian pie
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(54, 162, 235, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1, // Lebar border tiap bagian pie
      },
    ],
  };

  // Opsi untuk grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posisi legenda
      },
      title: {
        display: true,
        text: "Kategori Pengeluaran",
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-md mx-auto p-3">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ChartPie;
