import Background from "/components/BackgroundImage";
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      const data = await response.json();
      setWeatherData(data);
      console.log(data);

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
        .slice(0, 6);
      setForecastData(dailyForecasts);

      const { lat, lon } = data.coord;
      const TimeApiKey = "RLSGXSRRNDO3";
      const TimeZonesUrl =
        "https://api.timezonedb.com/v2.1/get-time-zone?format=json";

      const timeZoneResponse = await fetch(
        TimeZonesUrl +
          `&key=${TimeApiKey}` +
          `&by=position&lat=${lat}` +
          `&lng=${lon}`
      );
      const timeZoneData = await timeZoneResponse.json();
      const timeZone = new Date(timeZoneData.formatted);
      setTime(timeZone.toLocaleTimeString());

      intervalRef.current = setInterval(() => {
        timeZone.setSeconds(timeZone.getSeconds() + 1);
        setTime(timeZone.toLocaleTimeString());
      }, 1000);
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative bg-gray-100 flex items-center justify-center h-screen">
      <Background />
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-10">
        <p className="text-center text-3xl pb-3.5">Weather App</p>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            placeholder="Enter your city"
            spellCheck="false"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
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
        {weatherData && (
          <div className="text-center mb-4">
            <p className="text-gray-600">{time}</p>
            <div className="flex items-center justify-center text-gray-600">
              <div className="text-6xl">
                <i className="fas fa-cloud"></i>
              </div>
              <div className="ml-4 text-6xl">
                {Math.round(weatherData.main.temp)}°C
              </div>
            </div>
            <p className="text-xl mt-2">{weatherData.weather[0].description}</p>
            <div className="flex justify-between mt-4">
              <div>
                <p className="border-b border-b-2 border-teal-500">Humidity</p>
                <p>{weatherData.main.humidity}%</p>
              </div>
              <div>
                <p className="font-bold">{weatherData.name}</p>
              </div>
              <div>
                <p className="border-b border-b-2 border-teal-500">
                  Wind speed
                </p>
                <p>{weatherData.wind.speed} km/h</p>
              </div>
            </div>
          </div>
        )}
        {forecastData.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mt-6">3-Day Forecast</h2>
            <div className="grid grid-cols-3 gap-4">
              {forecastData.map((forecast, index) => (
                <div key={index} className="text-center p-2 border rounded-lg">
                  <p>{new Date(forecast.dt_txt).toLocaleString()}</p>
                  <p>{Math.round(forecast.main.temp)}°C</p>
                  <p>{forecast.weather[0].description}</p>
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
