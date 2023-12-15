


function chooseCity(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=5b24cae96a98f68f0e09599b72878057";

    fetch(queryURL)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

chooseCity("london");