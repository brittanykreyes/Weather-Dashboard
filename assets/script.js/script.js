document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '3a0638f327f17df983c673c21bbe04e4';
    // Button to get weather and forecast
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    getWeatherBtn.addEventListener('click', getWeatherAndForecast);
    // Load search history from localStorage
    loadSearchHistory();
    // Function to fetch Current Weather and Forecast
    function getWeatherAndForecast() {
        const city = document.getElementById('cityInput').value.trim();
        if (city === '') {
            alert('Please enter a city name.');
            return;
        }
        // API URLs to get current weather and forecast in Fahrenheit
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                console.log(`${city} Current Weather:`, data);
                displayCurrentWeather(data);
            });
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log(`${city} Forecast Data:`, data);
                displayForecast(data);
                addToSearchHistory(city);
            });
    }
    // Function to display current weather
    function displayCurrentWeather(data) {
        const currentWeather = document.getElementById('currentWeather');
        currentWeather.innerHTML = '';
        const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');
        weatherCard.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <img src="${weatherIcon}" alt="Weather Icon">
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Description: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
        `;
        currentWeather.appendChild(weatherCard);
    }
    // Function to display forecast data
    function displayForecast(data) {
        const forecastWeather = document.getElementById('forecastWeather');
        forecastWeather.innerHTML = '';
        // Loop through the forecast data
        for (let i = 0; i < data.list.length; i += 8) { // Increment by 8 to get once per day
            const dailyForecast = data.list[i]; // Take the forecast data for once per day
            // Getting Forecast Icon
            const weatherIcon = `http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`;
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            const dateTime = new Date(dailyForecast.dt * 1000);
            const date = dateTime.toLocaleDateString();
            const temperature = dailyForecast.main.temp;
            const description = dailyForecast.weather[0].description;
            const windSpeed = dailyForecast.wind.speed;
            const humidity = dailyForecast.main.humidity;
            // Create forecast item
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p><strong>Date:</strong> ${date}</p>
                <img src="${weatherIcon}" alt="Weather Icon">
                <p><strong>Temperature:</strong> ${temperature} °F</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} mph</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
            `;
            forecastCard.appendChild(forecastItem);
            forecastWeather.appendChild(forecastCard);
        }
    }
    // Function to add city to search history
    function addToSearchHistory(city) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateSearchHistory();
        }
    }
    // Function to load search history from localStorage
    function loadSearchHistory() {
        updateSearchHistory();
        const historyList = document.getElementById('historyList');
        historyList.addEventListener('click', function(event) {
            if (event.target.tagName === 'LI') {
                const city = event.target.textContent;
                document.getElementById('cityInput').value = city;
                getWeatherAndForecast();
            }
        });
    }
    // Function to update search history in the DOM
    function updateSearchHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.forEach(city => {
            const historyItem = document.createElement('li');
            historyItem.textContent = city;
            historyList.appendChild(historyItem);
        });
    }
});