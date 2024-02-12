import React, { useEffect, useState, useRef, useMemo } from 'react';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { FaBolt } from 'react-icons/fa';
import Chart from 'chart.js/auto';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Main = () => {
  // Sample weather data
  const weatherData = useMemo(
    () => [
      { day: 'Sun', weather: 'Sunny', powerOutcome: 200, temperature: 25, solarActivity: 80 },
      { day: 'Mon', weather: 'Cloudy', powerOutcome: 180, temperature: 23, solarActivity: 70 },
      { day: 'Tue', weather: 'Rainy', powerOutcome: 150, temperature: 20, solarActivity: 60 },
      { day: 'Wed', weather: 'Partly Sunny', powerOutcome: 220, temperature: 26, solarActivity: 85 },
      { day: 'Thu', weather: 'Thunderstorm', powerOutcome: 120, temperature: 18, solarActivity: 50 },
      { day: 'Fri', weather: 'Clear Sky', powerOutcome: 250, temperature: 28, solarActivity: 90 },
      { day: 'Sat', weather: 'Windy', powerOutcome: 170, temperature: 22, solarActivity: 75 },
    ],
    []
  );

  // Chart state and ref
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // State for UI theme
  const [darkTheme, setDarkTheme] = useState(false);

  // Function to toggle UI theme
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Effect to update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Effect to create or update the chart
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('powerChart').getContext('2d');
    const powerData = weatherData.map((data) => data.powerOutcome);
    const temperatureData = weatherData.map((data) => data.temperature);
    const solarActivityData = weatherData.map((data) => data.solarActivity);

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
            yAxisID: 'power',
          },
          {
            label: 'Temperature',
            data: temperatureData,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'temperature',
          },
          {
            label: 'Solar Activity',
            data: solarActivityData,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'solar',
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
          power: {
            position: 'left',
            title: {
              display: true,
              text: 'Power Outcome (MW)',
              color: 'rgba(75, 192, 192, 1)',
            },
          },
          temperature: {
            position: 'right',
            title: {
              display: true,
              text: 'Temperature (°C)',
              color: 'rgba(255, 99, 132, 1)',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          solar: {
            position: 'right',
            title: {
              display: true,
              text: 'Solar Activity',
              color: 'rgba(54, 162, 235, 1)',
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return value + '%';
              },
            },
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
    <div className={`min-h-screen flex items-center justify-center ${darkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-full flex items-center justify-center relative">
        {/* Weather Table */}
        <div className={`w-1/2 p-4 border border-gray-200 ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h1 className="text-3xl font-bold mb-6 text-center">{darkTheme ? '6-Day Weather Prediction (Dark)' : '6-Day Weather Prediction (Light)'}</h1>
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

        {/* Digital Clock, Temperature, and Humidity Indicators */}
        <div className={`absolute top-0 right-0 m-8 flex flex-col items-end space-y-2 ${darkTheme ? 'text-white' : 'text-black'}`}>
          <div className="border p-2">
            <p className="text-lg font-semibold">{currentTime}</p>
          </div>
          <div className="border p-2">
            <p className="text-lg font-semibold">Temperature: 25°C</p>
          </div>
          <div className="border p-2">
            <p className="text-lg font-semibold">Humidity: 60%</p>
          </div>
        </div>

        {/* Toggle Theme Button */}
        <button className="absolute bottom-0 right-0 m-8 p-2 rounded-full bg-yellow-500 text-white" onClick={toggleTheme}>
          {darkTheme ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default Main;
