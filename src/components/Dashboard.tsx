import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DashboardProps = {
  title?: string;
  labels?: string[];
  values?: number[];
};

const Dashboard: React.FC<DashboardProps> = ({
  title = 'Dashboard Summary',
  labels = ['Covered', 'Missing', 'Overlap'],
  values = [70, 30, 10],
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Scenarios',
        data: values,
        backgroundColor: [
          'rgba(34,197,94,0.3)', // green-500
          'rgba(239,68,68,0.3)', // red-500
          'rgba(59,130,246,0.3)', // blue-500
        ],
        borderColor: [
          'rgba(34,197,94,1)',
          'rgba(239,68,68,1)',
          'rgba(59,130,246,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Dashboard;
