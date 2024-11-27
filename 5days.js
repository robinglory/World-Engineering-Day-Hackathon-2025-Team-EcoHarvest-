const apiKey = '9c5b06314e5f087305407c70127ab986';
        const city = 'Yangon';
        const currentWeatherUrl = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather
        async function fetchCurrentWeather() {
            try {
                const response = await fetch(currentWeatherUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const iconClass = getWeatherIcon(data.weather[0].icon);
                document.getElementById('current-weather').innerHTML = `
                    <h3>Current Weather in ${data.name}, ${data.sys.country}</h3>
                    <i class="wi ${iconClass}" style="font-size: 64px;"></i>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Condition: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
            } catch (error) {
                console.error('Error fetching current weather:', error);
                document.getElementById('current-weather').innerHTML = `<p>Error fetching current weather: ${error.message}</p>`;
            }
        }

        // Fetch 5-day forecast
        async function fetchForecast() {
            try {
                const response = await fetch(forecastUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                const dailyForecasts = groupForecastByDay(data.list);

                let forecastHTML = '<h3>5-Day Forecast</h3>';
                dailyForecasts.forEach(day => {
                    const iconClass = getWeatherIcon(day.weather[0].icon);
                    forecastHTML += `
                        <div class="forecast-day">
                            <h4>${day.date}</h4>
                            <i class="wi ${iconClass}" style="font-size: 48px;"></i>
                            <p>Avg Temp: ${day.avgTemp}°C</p>
                            <p>Condition: ${day.weather[0].description}</p>
                        </div>
                    `;
                });

                document.getElementById('forecast').innerHTML = forecastHTML;
            } catch (error) {
                console.error('Error fetching forecast:', error);
                document.getElementById('forecast').innerHTML = `<p>Error fetching forecast: ${error.message}</p>`;
            }
        }

        // Group forecast data by day
        function groupForecastByDay(list) {
            const days = {};
            list.forEach(item => {
                const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                if (!days[date]) {
                    days[date] = {
                        date: date,
                        temps: [],
                        weather: item.weather,
                    };
                }
                days[date].temps.push(item.main.temp);
            });

            return Object.values(days).map(day => ({
                date: day.date,
                avgTemp: (day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length).toFixed(1),
                weather: day.weather
            }));
        }

        // Map OpenWeatherMap icons to Weather Icons classes
        function getWeatherIcon(iconCode) {
            const iconMap = {
                "01d": "wi-day-sunny",
                "01n": "wi-night-clear",
                "02d": "wi-day-cloudy",
                "02n": "wi-night-cloudy",
                "03d": "wi-cloud",
                "03n": "wi-cloud",
                "04d": "wi-cloudy",
                "04n": "wi-cloudy",
                "09d": "wi-showers",
                "09n": "wi-showers",
                "10d": "wi-day-rain",
                "10n": "wi-night-rain",
                "11d": "wi-thunderstorm",
                "11n": "wi-thunderstorm",
                "13d": "wi-snow",
                "13n": "wi-snow",
                "50d": "wi-fog",
                "50n": "wi-fog"
            };
            return iconMap[iconCode] || "wi-na";
        }

        // Initialize weather data fetching
        fetchCurrentWeather();
        fetchForecast();