$(function () {
  var apiKey = "59265ab185cc1f72e9ec2b2cdaa55519";
  var city = "";
  var lat = "";
  var lon = "";
  var searchHistory = [];

  function buttoning() {
    for (var i = 0; i < (searchHistory.length); i++) { //for each city in the history make a button
      var cname = searchHistory[i];
      var newbutton = $("<button class='btn btn-dark btn-lg'>" + cname + "</button>");
      $("#pastSearch").append(newbutton);
      $("#pastsearch").last().on("click", search(searchHistory[i]));
    }
  }
  var load = localStorage.getItem("citySave"); //if there is local storage, load it to the page
  if (load !== null) {
    searchHistory = JSON.parse(load);
    $("#pastSearch").text();
    search(searchHistory[0]);
  }
  //click button, start search
  $("#searchBtn").on("click", function () {
    city = $("#cityText").val().replace(/ /, "+");
    search(city);
  });

  function search(city) {
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    $.ajax({
      url: queryURL1, // Get Search info for city
      method: "GET"
    }).then(function (current) {
      lat = current.coord.lat;
      lon = current.coord.lon;
      var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minute,hourly,alerts&units=imperial&appid=" + apiKey;
      $.ajax({
        url: queryURL2, // Pass location to 5 day forecast and get info
        method: "GET"
      }).then(function (multiDay) {
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
        $("#info").empty();
        $("#info").html("<ul><li>Current Temperature: " + tempNow + "</li><li> High: " + tempHigh + ", Low: " + tempLow + "</li><li>Outside: " + conditions + "</li><li>Wind Speed: " + windSpeed + "MPH</li><li>Humidity: " + humidity + "%</li><li id='uvIndex'>UV Index: " + uvIdx + "</li></ul>");

        function fiveDay(idx) {
          var mtemp = multiDay.daily[idx].temp.day;
          var mhum = multiDay.daily[idx].humidity;
          var micon = multiDay.daily[idx].weather[0].icon;
          var mdate = multiDay.daily[idx].dt;
          var timeConv = (mdate) * 1000;
          var dateObject = new Date(timeConv);
          var humanDateFormat = dateObject.toLocaleString();
          $("#day" + idx).html("<img src='http://openweathermap.org/img/wn/" + micon + "@2x.png' alt='weather icon'><p>" + humanDateFormat + "</p><ul><li>High Temp: " + mtemp + "</li><li>Humidity: " + mhum + "%</li></ul>");
        }
        for (var i = 0; i < 5; i++) {
          fiveDay(i);
        }
        if ((searchHistory.includes(current.name)) == false) { //check if city is not on list
          searchHistory.push(current.name);
          localStorage.setItem("citySave", JSON.stringify(searchHistory)); //save list to local storage
          $("#pastSearch").empty();
        }
      });
    });
  }
  buttoning();
});