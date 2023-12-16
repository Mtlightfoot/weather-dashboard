// TODO

// 1. When user search for a city in the input, call weather API and show the result in the HTML
// ..... A) Add event listener to form submit
// ..... B) Get the user input value
// ..... C) Build the API query url based on the user input value
// ..... D) Call the API and render the result in the HTML
// ............ a) Get the city name and show it in the main weather forecast card
// ............ b) Get the first weather forecast item and get the following values: date, temperature, wind speed, humidity, icon
// ............ c) Render those values to the main card
// ............ d) Loop through all weathers array and get the following values: date, temperature, wind speed, humidity, icon
// ............ e) Render those values to the smaller card
// 2. When user search for a city, store it in local storage
// 3. On initial page load, load the search history and show it as a list in the HTML
// ..... A) 
// ..... B) Built the API query URL based on the history stored in local storage
// ..... C) Call the API and render the result in the HTML
// 4. When user clicks on the search history, call weather API and show the result in the HTML
// 5. CSS

const submitButton = $('.search-button');
const searchInput = $('#search-input');
const cityNameHeader = $('.city-name-header');
const currentTemperatureHeader = $('.current-temperature');
const currentWindSpeedHeader = $('.current-wind-speed');
const currentHumidityHeader = $('.current-humidity');
const todaysIcon = $('.todays-icon');
const forecasts = $('.forecasts');
const forecast = $('#forecast');
const cityHistory = $('#history');
const fiveDay = $('.fiveDay');
const clearButton = $('.clearBtn');

let previousCities = JSON.parse(localStorage.getItem('local-history'));
if (previousCities === null) {
    previousCities = [];
} else {
    clearButton.removeAttr('hidden');
    previousCities.forEach((city) => {
        const cityButton = $('<button>');
        cityButton.text(city);
        cityButton.addClass('btn mt-3 btn-secondary historyBtn');
        cityHistory.prepend(cityButton);
        cityButton.on('click', function (event) {
            event.preventDefault();
            chooseCity(this.textContent);

        })
    })
}

function chooseCity(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=5b24cae96a98f68f0e09599b72878057";

    fetch(queryURL)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // City Name 
            const cityName = data.city.name;
            const currentWeatherIcon = data.list[0].weather[0].icon;
            const currentWeatherIconLink = "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png";
            $('.current-icon').attr('src', currentWeatherIconLink);

            const todaysDate = dayjs().format('D/M/YYYY');
            cityNameHeader.text(`${cityName} ${todaysDate}`);

            // Current Temperature
            const currentTemperature = data.list[0].main.temp;
            currentTemperatureHeader.text(`Temp: ${currentTemperature} °C`);

            // Current Wind Speed
            const currentWind = data.list[0].wind.speed;
            currentWindSpeedHeader.text(`Wind: ${currentWind} KPH`);

            // Current Humidity
            const currentHumidity = data.list[0].main.humidity;
            currentHumidityHeader.text(`Humidity: ${currentHumidity}%`);

            let middayArray = [];

            for (let i = 0; i < data.list.length; i++) {
                let eachMidday = data.list[i].dt_txt.substring(10);
                let arrayContainsMidday = (eachMidday.indexOf("12:00:00") > -1);
                if (arrayContainsMidday) {
                    middayArray.push(data.list[i]);
                }
            }

            forecast.addClass('border-top');
            fiveDay.removeAttr('hidden');

            forecasts.empty();

            middayArray.forEach((day) => {

                const div = $('<div>');
                div.addClass('col forecast-card');
                forecasts.append(div);

                // Date for each day
                const date = day.dt_txt.substring(0, 10);
                const dateHeading = $('<h4>');
                dateHeading.text(dayjs(date).format('D/M/YYYY'));
                div.append(dateHeading);

                // Icon for each day
                const icon = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
                const img = $('<img>');
                img.attr('src', icon);
                div.append(img);

                // Temperature for each day
                const temp = day.main.temp;
                const tempText = $('<p>');
                tempText.text(`Temp: ${temp} °C`);
                div.append(tempText);

                // Wind Speed for each day
                const wind = day.wind.speed;
                const windText = $('<p>');
                windText.text(`Wind: ${wind} KPH`);
                div.append(windText);

                // Humidity for each day
                const humidity = day.main.humidity;
                const humidityText = $('<p>');
                humidityText.text(`Humidity: ${humidity}%`);
                div.append(humidityText);
            })

            const cityLowercase = city.toLowerCase();

            // Button creation for history of searched cities
            console.log(previousCities)

            if (previousCities.includes(cityLowercase) === false) {
                const cityButton = $('<button>');
                cityButton.text(city);
                cityButton.addClass('btn mt-3 btn-secondary historyBtn');
                cityHistory.prepend(cityButton);
                previousCities.push(cityLowercase);
                cityButton.on('click', function (event) {
                    event.preventDefault();
                    chooseCity(this.textContent);
                })
            }

            localStorage.setItem("local-history", JSON.stringify(previousCities));

        })
}

submitButton.on('click', function (event) {
    event.preventDefault();
    const userCityInput = searchInput.val();
    chooseCity(userCityInput);
    clearButton.removeAttr('hidden');
});

clearButton.on('click', function (event) {
    event.preventDefault();
    clearButton.attr("hidden", "hidden");
    localStorage.clear();
    cityHistory.empty();
});