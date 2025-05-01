import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from "prop-types";

/*Images*/
import clearIcon from "./assets/clear.png";
import cloudyIcon from "./assets/cloudy.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import thunderstormIcon from "./assets/thunderstorm.png";
import thunderstormrainIcon from "./assets/thunderstormrain.png";
import showerrainIcon from "./assets/showerrain.png";
import brokencloudsIcon from "./assets/brokenclouds.png";

const WeatherDetails = ({ icon, temp, city, country, lat, log, wind, humidity }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="image" height={150} />
      </div>
    </>
  )
}
WeatherDetails.propTypes={
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  wind : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  log : PropTypes.number.isRequired,
}
function App() {
  let api_key = "5eb7dc5c5c51bd435914ff6425e02fb4"
  const [text, setText] = useState("London")
  const [icon, setIcon] = useState(cloudyIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [wind, setWind] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [citynotfound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudyIcon,
    "02n": cloudyIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": brokencloudsIcon,
    "04n": brokencloudsIcon,
    "09d": showerrainIcon,
    "09n": showerrainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": thunderstormIcon,
    "11n": thunderstormIcon,
    "11d": thunderstormrainIcon,
    "11n": thunderstormrainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      if (data.cod === "404") {
        setCityNotFound(true)
        setLoading(false)
        return;
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || clearIcon)
      setCityNotFound(false)
    } catch (error) {
      console.error("An Error Occurred:", error.message)
      setError("An error occurred while fetching weather data.")
    } finally {
      setLoading(false)
    }
  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input
            type="text"
            className="cityInput"
            placeholder='Search City'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className='search-icon' onClick={() => search()} >
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {citynotfound && !loading && <div className="city-not-found">City Not Found. Please try again.</div>}

        {!loading && !citynotfound && (
          <>
            <WeatherDetails
              icon={icon}
              temp={temp}
              city={city}
              country={country}
              lat={lat}
              log={log}
              wind={wind}
              humidity={humidity}
            />
            <div className="temp">{temp}°C</div>
            <div className="location">{city}</div>
            <div className="country">{country}</div>
            <div className="cord">
              <div>
                <span className='lat'>latitude</span>
                <span>{lat}</span>
              </div>
              <div>
                <span className='log'>longitude</span>
                <span>{log}</span>
              </div>
            </div>
            <div className='data-container'>
              <div className="element">
                <img src={humidityIcon} alt="humidity" className='icon' height={50} width={50} />
                <div className="data">
                  <div className="humidity-percent">{humidity} %</div>
                  <div className="text">Humidity</div>
                </div>
              </div>
              <div className="element">
                <img src={windIcon} alt="wind" className='icon' height={60} width={60} />
                <div className="data">
                  <div className="wind-percent">{wind} km/h</div>
                  <div className="text">Wind Speed</div>
                </div>
              </div>
            </div>
            <p className='copyright'>
        Designed by <span>Srinila</span>
      </p>

          </>
        )}
      </div>
    </>
  )
}

export default App
