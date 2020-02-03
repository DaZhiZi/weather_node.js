var crawler = require('./../Crawler')

var now = {
    path: '/api/now',
    method: 'post',
    func: function(request, response) {
        var data = request.body
        var city = data.city
        var n = crawler.getNowWeather(city)
        response.send(n)
    }
}

var forecast = {
    path: '/api/forecast',
    method: 'post',
    func: function(request, response) {
        var data = request.body
        console.log(data)
        var city = data.city
        var f = crawler.getForecastWeather(city)
        response.send(f)
    }
}

var routes = [
    now,
    forecast,
]

module.exports.routes = routes
