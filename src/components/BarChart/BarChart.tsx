import React from 'react';
import './BarChart.css';

interface BarChartProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const BarChart: React.FC<BarChartProps> = ({ label, value, maxValue, color }) => {
  const barFillHeight = (value / maxValue) * 100;

  return (
    <div className="bar-chart-container">
      <div className="bar-chart-label">{label}</div>
      <div className="bar-chart">
        <div
          className="bar-chart-fill"
          style={{ height: `${barFillHeight}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="bar-chart-value">R$ {value.toFixed(2)}</div>
    </div>
  );
};

export default BarChart;