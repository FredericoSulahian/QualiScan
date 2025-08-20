import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type CoverageRingProps = {
  percentage: number; // 0-100
};

const CoverageRing: React.FC<CoverageRingProps> = ({ percentage }) => {
  const safe = Math.max(0, Math.min(100, Math.round(percentage)));
  const data = {
    labels: ['Covered', 'Remaining'],
    datasets: [
      {
        data: [safe, 100 - safe],
        backgroundColor: [
          'rgba(59,130,246,0.9)', // blue-500
          'rgba(203,213,225,0.6)', // slate-300
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '78%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  } as const;

  return (
    <div className="relative w-40 h-40">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">{safe}%</div>
        <div className="text-xs text-gray-500">Overall Coverage</div>
      </div>
    </div>
  );
};

export default CoverageRing;
