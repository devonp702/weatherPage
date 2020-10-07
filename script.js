$(function () {
  var apiKey = "59265ab185cc1f72e9ec2b2cdaa55519";
  var city = "";
  var lat = "";
  var lon = "";
  $("#searchBtn").on("click", function () {
    city = $("#cityText").val().replace(/ /, "+");
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    $.ajax({
      url: queryURL1,
      method: "GET"
    }).then(function (current) {
      lat = current.coord.lat;
      lon = current.coord.lon;
      var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minute,hourly,alerts&units=imperial&appid=" + apiKey;
      $.ajax({
        url: queryURL2,
        method: "GET"
      }).then(function (multiDay) {
        console.log(current);
        console.log(multiDay);
        $("#cityDisplay").text(current.name);
        $("#nowDisplay").html("");
        $("#viewNow").attr("src", "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@4x.png")
        var unixTime = (current.dt) * 1000;
        var dateObject = new Date(unixTime);
        var humanDateFormat = dateObject.toLocaleString();
        $("#date").text(humanDateFormat);
        var tempNow = current.main.temp;
        var tempHigh = current.main.temp_max;
        var tempLow = current.main.temp_min;
        var conditions = current.weather[0].description;
        var windSpeed = current.wind.speed; // in mph
        var humidity = current.main.humidity; // percent
        var uvIdx = multiDay.daily[0].uvi;
        $("#info").html("<ul><li>Current Temperature: " + tempNow + "</li><li> High: " + tempHigh + ", Low: " + tempLow + "</li><li>Outside: " + conditions + "</li><li>Wind Speed: " + windSpeed + "MPH</li><li>Humidity: " + humidity + "%</li><li id='uvIndex'>UV Index: " + uvIdx + "</li></ul>");
      });
    });
  });
});