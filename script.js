$(function () {
  var apiKey = "59265ab185cc1f72e9ec2b2cdaa55519";
  var city = "Las+Vegas";
  var lat = "36.17";
  var lon = "-115.14";
  var queryURL1 =  "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
  var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minute,hourly,alerts&appid=" + apiKey;
  $.ajax({
    url: queryURL1,
    method: "GET"
  }).then(function (current) {
    console.log(current);
    $.ajax({
      url: queryURL2,
      method: "GET"
    }).then(function(multiDay){
      console.log(multiDay);
    });
  });
});