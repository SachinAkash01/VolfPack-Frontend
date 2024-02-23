import { useState, useEffect, useRef } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FiSun, FiMoon } from "react-icons/fi"; // Import sun and moon icons
import { FaBolt } from "react-icons/fa";
import Chart from "chart.js/auto";
import axios from "axios";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Main = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [futureWeather, setFutureWeather] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch current weather data
    axios
      .get("http://localhost:3001/api/CurrentWeather")
      .then((response) => {
        setCurrentWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
      });

    // Fetch future weather data
    axios
      .get("http://localhost:3001/api/futureWeather")
      .then((response) => {
        setFutureWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching future weather data:", error);
      });

    // Update time every second
    const interval = setInterval(() => {
      setCurrentWeather((prevWeather) => {
        if (prevWeather) {
          return {
            ...prevWeather,
            time: new Date().toLocaleTimeString(),
          };
        }
        return null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("powerChart").getContext("2d");
    const powerData = futureWeather.map((data) =>
      calculateSolarPowerOutput(
        data.temperature.max,
        data.humidity,
        data.windSpeed
      )
    );
    const temperatureData = futureWeather.map((data) => data.temperature.max);

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: futureWeather.map(
          (data) =>
            `${daysOfWeek[new Date(data.date).getDay()]} - ${new Date(
              data.date
            ).toLocaleDateString()}`
        ),
        datasets: [
          {
            label: "Power",
            data: powerData,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "power",
          },
          {
            label: "Temperature",
            data: temperatureData,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "temperature",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
          },
          y: {
            beginAtZero: true,
          },
          power: {
            position: "left",
            title: {
              display: true,
              text: "Power (MW/h)",
              color: "rgba(75, 192, 192, 1)",
            },
          },
          temperature: {
            position: "right",
            title: {
              display: true,
              text: "Temperature (°C)",
              color: "rgba(255, 99, 132, 1)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    chartRef.current = newChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [futureWeather]);

  // Function to toggle theme between dark and light
  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const calculateSolarPowerOutput = (temperature, humidity, windSpeed) => {
    const tempCoefficient = 0.05;
    const humidityCoefficient = 0.02;
    const windCoefficient = 0.03;
    let basePowerOutput = 500; // MW/h (example base power output)
    basePowerOutput -= temperature * tempCoefficient;
    basePowerOutput -= humidity * humidityCoefficient;
    basePowerOutput += windSpeed * windCoefficient;
    basePowerOutput = Math.max(basePowerOutput, 0);
    return basePowerOutput.toFixed(2);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
          <div className="border p-2">
            <p className="text-lg font-semibold">
              {currentWeather && currentWeather.time}
            </p>
          </div>
          {currentWeather && (
            <>
              <div className="border p-2">
                <p className="text-lg font-semibold">
                  Temperature: {currentWeather.temperature}°C
                </p>
              </div>
              <div className="border p-2">
                <p className="text-lg font-semibold">
                  Humidity: {currentWeather.humidity}%
                </p>
              </div>
              <div className="border p-2">
                <p className="text-lg font-semibold">
                  Wind Speed: {currentWeather.windSpeed} km/h
                </p>
              </div>
            </>
          )}
        </div>
        {/* Theme Toggle Button */}
        <button
          className="m-4 p-2 rounded-full bg-yellow-500 text-white"
          onClick={toggleTheme}
        >
          {darkTheme ? (
            <FiSun className="w-6 h-6" /> // Sun icon for light theme
          ) : (
            <FiMoon className="w-6 h-6" /> // Moon icon for dark theme
          )}
        </button>
      </div>

      {/* Table and Chart in One Row */}
      <div className="flex">
        {/* Weather Table */}
        <div className="w-1/2 p-4 border border-gray-200">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
            6-Day Weather Prediction
          </h1>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Day</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Weather</th>
                <th className="p-3 border">Power Output (MW/h)</th>
                <th className="p-3 border">Temperature (°C)</th>
                <th className="p-3 border">Humidity (%)</th>
                <th className="p-3 border">Wind Speed (km/h)</th>
              </tr>
            </thead>
            <tbody>
              {futureWeather.map((dayData, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border">
                    {daysOfWeek[new Date(dayData.date).getDay()]}
                  </td>
                  <td className="p-3 border">
                    {new Date(dayData.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 border flex items-center">
                    <TiWeatherPartlySunny className="text-xl text-yellow-500 mr-2" />
                    <span className="text-sm">{dayData.condition}</span>
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center">
                      <FaBolt className="text-xl text-blue-500 mr-2" />
                      <span className="text-sm">
                        {calculateSolarPowerOutput(
                          dayData.temperature.max,
                          dayData.humidity,
                          dayData.windSpeed
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border">{dayData.temperature.max}</td>
                  <td className="p-3 border">{dayData.humidity}</td>
                  <td className="p-3 border">{dayData.windSpeed}</td>
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
