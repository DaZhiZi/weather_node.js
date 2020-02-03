var log = function() {
    console.log.apply(console, arguments)
}

// 定义一个类，每次获取天气可以写入
class Weather {
    constructor() {
        this.city = ''
        this.data = ''
        this.tmp = ''
        this.cond = ''
        this.windDir = ''
        this.windSc = ''
        this.hum = ''
        this.fl = ''
    }
}

var catchUrl = function(url) {
    var request = require('sync-request')
    var r = request('GET', url)
    var body = r.getBody('utf-8')
    var body_2 = JSON.parse(body)
    log('body_2', body_2)
    return body_2
}

var getNowWeather = function(city="guangzhou") {
    var url = `https://free-api.heweather.com/v5/now?city=${city}&key=286564901ae341f38e5753fa99bfe769`
    var n = catchUrl(url)
    var now = n.HeWeather5[0].now
    var nowWeather = new Weather()
    nowWeather.city = n.HeWeather5[0].basic.city
    nowWeather.tmp = now.tmp + '°'
    nowWeather.cond = now.cond.txt
    nowWeather.windDir = now.wind.dir
    nowWeather.windSc = now.wind.sc
    nowWeather.hum = now.hum + "%"
    nowWeather.fl = now.fl + '°'
    return nowWeather
}

var getForecastWeather = function(city="guangzhou") {
    var url = `https://free-api.heweather.com/v5/forecast?city=${city}&key=286564901ae341f38e5753fa99bfe769`
    var n = catchUrl(url)
    var forecast = n.HeWeather5[0].daily_forecast
    var forecastArr = []
    for (var i = 0; i < forecast.length; i++) {
        var f = forecast[i]
        var w = new Weather()
        w.city = n.HeWeather5[0].basic.city
        w.data = f.data
        w.tmpMax = f.tmp.max
        w.tmpMin = f.tmp.min
        w.cond = f.cond.txt_d
        forecastArr.push(w)
    }
    return forecastArr
}

module.exports.getNowWeather = getNowWeather
module.exports.getForecastWeather = getForecastWeather
