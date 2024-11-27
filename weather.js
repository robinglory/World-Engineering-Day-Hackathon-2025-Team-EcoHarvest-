const apiKey = "a5e46d51c95c211c26bf3b9aeb066ad3"; // Your API Key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDetails = document.getElementById("weather-details");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

async function fetchWeather(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.cod === 200) {
      displayWeather(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Failed to fetch weather data. Please try again later.");
  }
}

function displayWeather(data) {
  weatherDetails.classList.remove("hidden");

  document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById("weather-description").textContent = `Description: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `Wind Speed: ${data.wind.speed} m/s`;
}
