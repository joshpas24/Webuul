import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function LineChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Extract data for labels, open prices, and close prices
    const labels = data.map((entry) => new Date(entry.timestamp * 1000)); // Convert Unix timestamps to JavaScript Date objects
    const openPrices = data.map((entry) => entry.open);
    const closePrices = data.map((entry) => entry.close);

    // Create a new chart instance
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Open Prices',
            data: openPrices,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Close Prices',
            data: closePrices,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day', // You can customize the time axis unit as needed
            },
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price',
            },
          },
        },
      },
    });

    // Clean up the chart when the component unmounts
    return () => {
      myChart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default LineChart;
