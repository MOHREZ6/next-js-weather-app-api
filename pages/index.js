import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [time, setTime] = useState('');

  const apiKey = "97cdbdcd15f7bd360eaf5695cc26bcf9";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?id=524901&units=metric&q=";

  const fetchWeather = async () => {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    setWeatherData(data);

    const { lat, lon } = data.coord;
    const TimeApiKey = "RLSGXSRRNDO3";
    const TimeZonesUrl = "https://api.timezonedb.com/v2.1/get-time-zone?format=json";
    const timeZoneResponse = await fetch(
      TimeZonesUrl +
      `&key=${TimeApiKey}` +
      `&by=position&lat=${lat}` +
      `&lng=${lon}`
    );
    const timeZoneData = await timeZoneResponse.json();
    const timeZone = new Date(timeZoneData.formatted);
    setTime(timeZone.toLocaleTimeString());

    setInterval(() => {
      timeZone.setSeconds(timeZone.getSeconds() + 1);
      setTime(timeZone.toLocaleTimeString());
    }, 1000);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <p className="text-center text-3xl pb-3.5">Weather App</p>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            placeholder="enter your city"
            spellCheck="false"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
              <div className="text-6xl"><i className="fas fa-cloud"></i></div>
              <div className="ml-4 text-6xl">{Math.round(weatherData.main.temp)}°C</div>
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
                <p className="border-b border-b-2 border-teal-500">Wind speed</p>
                <p>{weatherData.wind.speed} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
