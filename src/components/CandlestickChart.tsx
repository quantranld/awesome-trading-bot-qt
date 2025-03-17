import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Candle } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CandlestickChartProps {
  data: Candle[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const labels = data.map(candle => {
    const date = new Date(candle.timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: data.map(candle => candle.close),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
        text: 'Crypto Price Chart',
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default CandlestickChart;
