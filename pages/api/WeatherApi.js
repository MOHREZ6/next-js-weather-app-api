import CityBackground from "./CityBackground.js";
import Clock from "./Clock";
import { useState, useEffect, useRef } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [time, setTime] = useState("");
  const intervalRef = useRef(null);

  const apiKey = "97cdbdcd15f7bd360eaf5695cc26bcf9";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const forecastApiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

  const fetchWeather = async () => {
    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      const data = await response.json();
      setWeatherData(data);
      // console.log(data);

      const forecastResponse = await fetch(
        forecastApiUrl + city + `&appid=${apiKey}`
      );
      const forecastData = await forecastResponse.json();

      const dailyForecasts = forecastData.list
        .filter(
          (item) =>
            item.dt_txt.includes("12:00:00") ||
            item.dt_txt.includes("09:00:00") ||
            item.dt_txt.includes("15:00:00")
        )
        .slice(0, 3);
      setForecastData(dailyForecasts);
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  return (
    <div className="relative bg-gray-100 flex flex-col   items-center justify-center h-screen  ">
      <CityBackground city={city} />

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2  rounded-lg shadow-lg p-6 w-96 z-10  bg-white	 bg-opacity-80 mt-20">
        <p className="text-center text-3xl pb-3.5">Weather App</p>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            placeholder="Enter your city"
            spellCheck="false"
            className="placeholder-black appearance-none bg-transparent border-none w-full   mr-3 py-1 px-2 leading-tight focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fetchWeather();
              }
            }}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            onClick={fetchWeather}
          >
            Search
          </button>
        </div>
      </div>
      <div
        className={`rounded-lg p-6 w-96 z-10 mt-40 ${
          weatherData ? "bg-white bg-opacity-80" : ""
        }`}
      >
        {weatherData && (
          <div className="text-center mb-4   	">
            <Clock lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
            <div className="flex items-center justify-center text-gray-600">
              <div className="text-6xl">
                <i className="fas fa-cloud"></i>
              </div>
              <div className="ml-4 text-center	">
                <p className="text-black 	 text-[24px]	 font-semibold	 mr-7			">
                  {Math.round(weatherData.main.temp)}°C
                </p>
              </div>
            </div>
            <p className=" text-[20px] mt-2  mr-1	">
              {weatherData.weather[0].description}
            </p>
            <div className="flex justify-between mt-4">
              <div>
                <p className="border-b border-b-2 border-teal-500 pb-1	">
                  Humidity
                </p>
                <p>{weatherData.main.humidity}%</p>
              </div>
              <div>
                <p className="text-[20px] ml-2	">{weatherData.name}</p>
              </div>
              <div>
                <p className="border-b border-b-2 border-teal-500 pb-1	">
                  Wind speed
                </p>
                <p>{weatherData.wind.speed} km/h</p>
              </div>
            </div>
          </div>
        )}
        {forecastData.length > 0 && (
          <div className="text-center	 border-t-2 border-teal-500	mt-2  ">
            <div className="grid grid-cols-3 gap-4">
              {forecastData.map((forecast, index) => (
                <div key={index} className="text-center  pt-1   ">
                  <p className="text-[20px]">
                    {Math.round(forecast.main.temp)}°C
                  </p>
                  <p>{forecast.weather[0].description}</p>
                  <p>
                    {new Date(forecast.dt_txt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    {new Date(forecast.dt_txt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
