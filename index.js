const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const apiKey = "##########";
var app = express();
app.use(bodyParser.urlencoded({extended:"true"}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/",function(req,res){
    var city = req.body.city;
    var geoCodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    https.get(geoCodeURL, function(response){
        response.on("data", function(data){
            var parsedData = JSON.parse(data);
            var lat = parsedData[0].lat
            var lon = parsedData[0].lon
            urlWeather = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,daily,hourly&appid="+apiKey+"&units=metric"
            https.get(urlWeather,function(response){
                response.on("data", function(data){
                    var parsedWeatherData = JSON.parse(data);
                    var temp = parsedWeatherData.current.temp
                    var icon = parsedWeatherData.current.weather[0].icon
                    var description = parsedWeatherData.current.weather[0].main
                    res.write("<p> Weather is:" +description +"</p>");
                    res.write("<h1> It is "+temp+" °C in "+city+"</h1>");
                    res.write("<img src='http://openweathermap.org/img/wn/"+icon+"@2x.png'>")
                    res.send()
                })
            } )
        })
    })
})

app.listen(3000);