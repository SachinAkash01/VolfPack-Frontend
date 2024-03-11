import React, { useState, useEffect, useRef } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import Chart from "react-apexcharts";
import axios from "axios";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Main = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [futureWeather, setFutureWeather] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [displayTable, setDisplayTable] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [displayMap, setDisplayMap] = useState(false); // State for map display
  const [displayGraph, setDisplayGraph] = useState(false); // State for graph display

  useEffect(() => {
    if (!showModal) {
      fetchData();
    }
  }, [showModal]);

  const fetchData = () => {
    // Fetching weather data
    axios
      .get(
        `http://localhost:3001/api/CurrentWeather?city=${city}&country=${country}`
      )
      .then((response) => {
        setCurrentWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
      });

    axios
      .get(
        `http://localhost:3001/api/futureWeather?city=${city}&country=${country}`
      )
      .then((response) => {
        setFutureWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching future weather data:", error);
      });

    // Setting interval to update current time
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
  };

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const calculateSolarPowerOutput = (temperature, humidity, windSpeed) => {
    const tempCoefficient = 0.05;
    const humidityCoefficient = 0.02;
    const windCoefficient = 0.03;
    let basePowerOutput = 500;
    basePowerOutput -= temperature * tempCoefficient;
    basePowerOutput -= humidity * humidityCoefficient;
    basePowerOutput += windSpeed * windCoefficient;
    basePowerOutput = Math.max(basePowerOutput, 0);
    return basePowerOutput.toFixed(2);
  };

  const options = {
    chart: {
      id: "weather-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: futureWeather.map(
        (data) =>
          `${daysOfWeek[new Date(data.date).getDay()]} - ${new Date(
            data.date
          ).toLocaleDateString()}`
      ),
    },
    yaxis: [
      {
        title: {
          text: "Power (MW/h)",
          style: {
            color: "#FFD700",
          },
        },
        opposite: true,
        min: 495,
        max: 500,
      },
      {
        title: {
          text: "Temperature (°C)",
          style: {
            color: "#FF6347",
          },
        },
        min: 20,
        max: 40,
      },
    ],
    colors: ["#FFD700", "#FF6347"],
  };

  const series = [
    {
      name: "Power",
      type: "line",
      data: futureWeather.map((data) =>
        calculateSolarPowerOutput(
          data.temperature.max,
          data.humidity,
          data.windSpeed
        )
      ),
      yAxis: 1,
    },
    {
      name: "Temperature",
      type: "line",
      data: futureWeather.map((data) => data.temperature.max),
      yAxis: 0,
    },
  ];

  const handleModalSubmit = () => {
    setShowModal(false);
    fetchData();
  };
  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Please enter your location
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Your country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              onClick={handleModalSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* Today's Data */}
      {currentWeather && (
        <div className="px-8 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Today's Weather Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col bg-blue-500 rounded-lg p-4 shadow-md">
              <div className="text-sm font-semibold">
                Last Updated: {currentWeather.localtime}
              </div>
              <div className="text-sm font-semibold">
                Current Time: {currentWeather.time}
              </div>
              <div className="text-sm font-semibold">
                Country: {currentWeather.country}
              </div>
              <div className="text-sm font-semibold">
                City: {currentWeather.name}
              </div>
            </div>
            <div className="flex flex-col bg-blue-500 rounded-lg p-4 shadow-md">
              <div className="text-sm font-semibold">
                Weather: {currentWeather.condition}
              </div>
              <div className="text-sm font-semibold">
                Temperature: {currentWeather.temperature}°C
              </div>
              <div className="text-sm font-semibold">
                Humidity: {currentWeather.humidity}%
              </div>
              <div className="text-sm font-semibold">
                Wind: {currentWeather.windSpeed} km/h
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex  px-8 py-4 justify-center">
        {/* Theme Toggle Button */}
        <button
          className="m-4 p-2 rounded-full bg-yellow-500 text-white"
          onClick={toggleTheme}
        >
          {darkTheme ? (
            <FiSun className="w-6 h-6" />
          ) : (
            <FiMoon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Button Group */}
      <div className="flex justify-center mb-4">
        {/* Button Group */}
        {/* Button Group */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-full ${
              displayTable
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } mr-4 shadow-md focus:outline-none`}
            onClick={() => {
              setDisplayTable(true);
              setDisplayMap(false); // Ensure map is hidden when switching to table
              setDisplayGraph(false); // Ensure graph is hidden when switching to table
            }}
          >
            Table
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              !displayTable && !displayMap
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } mr-4 shadow-md focus:outline-none`}
            onClick={() => {
              setDisplayGraph(true);
              setDisplayTable(false); // Ensure table is hidden when switching to graph
              setDisplayMap(false); // Ensure map is hidden when switching to graph
            }}
          >
            Graph
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              displayMap
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } shadow-md focus:outline-none`}
            onClick={() => {
              setDisplayMap(true);
              setDisplayTable(false); // Ensure table is hidden when switching to map
              setDisplayGraph(false); // Ensure graph is hidden when switching to map
            }}
          >
            Map
          </button>
        </div>
      </div>

      {/* Display Table or Chart or Map*/}
      <div className="flex flex-col items-center">
        {displayTable ? (
          <div className="w-full sm:w-3/4 p-4 border border-gray-200">
            <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
              Future Weather Data
            </h1>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-500">
                  <th className="p-2 border">Day</th>
                  <th className="p-2 border">Weather</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Power Output (MW/h)</th>
                  <th className="p-2 border">Temperature (°C)</th>
                  <th className="p-2 border">Humidity (%)</th>
                  <th className="p-2 border">Wind Speed (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {futureWeather.map((dayData, index) => (
                  <tr key={index} className="hover:bg-blue-500">
                    <td className="p-2 border">
                      {daysOfWeek[new Date(dayData.date).getDay()]}
                    </td>
                    <td className="p-3 border flex items-center text-center">
                      <TiWeatherPartlySunny className="text-xl text-yellow-500 mr-1" />
                      <span className="text-sm">{dayData.condition}</span>
                    </td>
                    <td className="p-2 border">
                      {new Date(dayData.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      <div className="flex items-center justify-center">
                        <FaBolt className="text-xl text-blue-500 mr-1" />
                        <span className="text-sm">
                          {calculateSolarPowerOutput(
                            dayData.temperature.max,
                            dayData.humidity,
                            dayData.windSpeed
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="p-2 border text-center">
                      {dayData.temperature.max}
                    </td>
                    <td className="p-2 border text-center">
                      {dayData.humidity}
                    </td>
                    <td className="p-2 border text-center">
                      {dayData.windSpeed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {/* Display Graph */}
        {displayGraph && (
          <div className="w-full sm:w-3/4 p-4">
            <Chart options={options} series={series} type="line" height={400} />
          </div>
        )}
        {/* Display Map */}
        {displayMap && (
          <div className="w-full sm:w-3/4 p-4">
            {/* Integrate Google Maps here to show the location */}
            <iframe
              title="Location Map"
              width="100%"
              height="400"
              frameBorder="1"
              style={{ border: 2 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyANBtUA7xd_c0W5ehy0Dewe9899RZMXkRg&q=${city},${country}`}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
