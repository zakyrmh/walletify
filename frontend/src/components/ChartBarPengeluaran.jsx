import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Mendaftarkan komponen Chart.js yang diperlukan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartBarPengeluaran = () => {
  // Data untuk grafik
  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // Label sumbu X
    datasets: [
      {
        label: "Pengeluaran", // Dataset pertama
        data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 10], // Data untuk grafik
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Warna batang
        borderColor: "rgba(255, 99, 132, 1)", // Warna border
        borderWidth: 1, // Lebar border
        borderRadius: 8, // Menambahkan border-radius
      },
    ],
  };

  // Opsi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pengeluaran",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg max-w-4xl p-3 mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartBarPengeluaran;
