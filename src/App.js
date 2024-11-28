import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '67df0ed306003120d9149d1c1876fbd9';

function App() {
  const [city, setCity] = useState('Toronto');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      const forecastResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      );

      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      const forecastData = await forecastResponse.json();

      setWeather(data);
      setForecast(forecastData.list.slice(0, 5));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
      setForecast([]);
    }
  };

  

  return (
    <div className="app">
      <div className="left-panel">
        {weather && (
          <div className="current-weather">
            <p>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <h2>
              {weather.name} {Math.round(weather.main.temp - 273.15)}°C
            </h2>
            <p>{weather.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
          </div>
        )}
      </div>
      <div className="right-panel">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <div className="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>
                {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                  weekday: 'short',
                })}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="forecast-icon"
              />
              <p>{Math.round(day.main.temp - 273.15)}°C</p>
            </div>
          ))}
        </div>
        {weather && (
          <div className="details-box">
            <p>UV Index: {weather.uvi || 'N/A'}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>
            <p>Population: {weather.population || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
