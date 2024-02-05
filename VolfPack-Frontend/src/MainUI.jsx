import { useEffect, useState, useRef, useMemo } from 'react';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { FaBolt } from 'react-icons/fa';
import Chart from 'chart.js/auto';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Main = () => {
  const weatherData = useMemo(
    () => [
      { day: 'Sun', weather: 'Sunny', powerOutcome: 200 },
      { day: 'Mon', weather: 'Cloudy', powerOutcome: 180 },
      { day: 'Tue', weather: 'Rainy', powerOutcome: 150 },
      { day: 'Wed', weather: 'Partly Sunny', powerOutcome: 220 },
      { day: 'Thu', weather: 'Thunderstorm', powerOutcome: 120 },
      { day: 'Fri', weather: 'Clear Sky', powerOutcome: 250 },
      { day: 'Sat', weather: 'Windy', powerOutcome: 170 },
    ],
    []
  );

  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('powerChart').getContext('2d');
    const powerData = weatherData.map((data) => data.powerOutcome);

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: 'Power Outcome',
            data: powerData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChart(newChart);
    chartRef.current = newChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [weatherData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-full flex items-center justify-center">
        {/* Weather Table */}
        <div className="w-1/2 p-4 border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            6-Day Weather Prediction
          </h1>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border">Day</th>
                <th className="p-4 border">Weather</th>
                <th className="p-4 border">Power Outcome</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((dayData, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-4 border">{dayData.day}</td>
                  <td className="p-4 border">
                    <div className="flex items-center">
                      <TiWeatherPartlySunny className="text-xl text-yellow-500 mr-2" />
                      <span className="text-sm">{dayData.weather}</span>
                    </div>
                  </td>
                  <td className="p-4 border">
                    <div className="flex items-center">
                      <FaBolt className="text-xl text-blue-500 mr-2" />
                      <span className="text-sm">{dayData.powerOutcome} MW</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="w-1/2 p-4">
          <canvas id="powerChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Main;
