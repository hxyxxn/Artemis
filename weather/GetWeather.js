const fetch = require("node-fetch");
const LocationSearch = require("./LocationSearch");
const Weather = require("./Weather");
const HelperFunctions = require("../HelperFunctions");
const WeatherEmbed = require("./WeatherEmbed");

module.exports = {
  getWeather: async (args) => {
    let currentLocation = await LocationSearch.returnCoordinates(args);
    if (currentLocation === undefined) { return; }
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&appid=${process.env.OPENWEATHERMAP}`)
      .then((unparsedJSON) => unparsedJSON.json())
      .then((info) => {
        const currentWeather = new Weather(currentLocation.formattedAddress, HelperFunctions.capitalise(info.weather[0].description),
          info.main.temp, info.main.humidity, info.wind.speed,
          info.clouds.all, info.weather[0].icon);
        return WeatherEmbed.embed(currentLocation, currentWeather, info.weather[0].icon[2]);
      })
      .catch((error) => {
        console.log(`getWeather error: ${error}`);
        console.log(error);
      });
  },
}
