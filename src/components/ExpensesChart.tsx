import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ExpensesChartProps {
  expensesByDate: Record<string, number>;
  incomesByDate: Record<string, number>;
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ expensesByDate, incomesByDate }) => {
  const allDates = Array.from(new Set([...Object.keys(expensesByDate), ...Object.keys(incomesByDate)])).sort();
  const expensesData = allDates.map(date => expensesByDate[date] || 0);
  const incomesData = allDates.map(date => incomesByDate[date] || 0);

  const chartData = {
    labels: allDates,
    datasets: [
      {
        label: 'Despesas Diárias',
        data: expensesData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Receitas Diárias',
        data: incomesData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default ExpensesChart;