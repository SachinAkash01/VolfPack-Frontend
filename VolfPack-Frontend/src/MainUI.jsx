import React from 'react';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { FaBolt } from 'react-icons/fa';


const App = () => {
  const weatherData = [
    { day: 'Sun', weather: 'Sunny', powerOutcome: 200 },
    { day: 'Mon', weather: 'Cloudy', powerOutcome: 180 },
    { day: 'Tue', weather: 'Rainy', powerOutcome: 150 },
    { day: 'Wed', weather: 'Partly Sunny', powerOutcome: 220 },
    { day: 'Thu', weather: 'Thunderstorm', powerOutcome: 120 },
    { day: 'Fri', weather: 'Clear Sky', powerOutcome: 250 },
    { day: 'Sat', weather: 'Windy', powerOutcome: 170 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          6-Day Weather Prediction
        </h1>

        {/* Weather Table */}
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
    </div>
  );
};

export default App;
