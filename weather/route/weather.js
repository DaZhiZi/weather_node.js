const { 
    log,
    getNowWeather,
    getForecastWeather,
} = require('./../crawler')

const now = {
    path: '/api/now',
    method: 'post',
    func: function(request, response) {
        let data = request.body
        let city = data.city
        let n = getNowWeather(city)
        response.send(n)
    }
}

const forecast = {
    path: '/api/forecast',
    method: 'post',
    func: function(request, response) {
        let data = request.body
        console.log(data)
        let city = data.city
        let f = getForecastWeather(city)
        response.send(f)
    }
}

const routes = [
    now,
    forecast,
]

module.exports.routes = routes
