const log = function() {
    console.log.apply(console, arguments)
}
// const Weather = function () {
//     this.city = ''
// }
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

const catchUrl = function(url) {
    let request = require('sync-request')
    let r = request('GET', url)
    let body = r.getBody('utf-8')
    let body_2 = JSON.parse(body)
    log('body_2', body_2)
    return body_2
}

const getNowWeather = function(city="wuhan") { // 现在的 天气
    let url = `https://free-api.heweather.com/v5/now?city=${city}&key=286564901ae341f38e5753fa99bfe769`
    let data = catchUrl(url)
    let now = data.HeWeather5[0].now
    // log('data', data)
    let n  = new Weather()
    n.city = data.HeWeather5[0].basic.city
    n.tmp = now.tmp + '°'
    n.cond = now.cond.txt
    n.windDir = now.wind.dir
    n.windSc = now.wind.sc
    n.hum = now.hum + "%"
    n.fl = now.fl + '°'
    return n
}

const getForecastWeather = function(city="wuhan") { // 将来的 天气
    let url = `https://free-api.heweather.com/v5/forecast?city=${city}&key=286564901ae341f38e5753fa99bfe769`
    let data = catchUrl(url)
    let forecast = data.HeWeather5[0].daily_forecast
    let forecastArr = []
    for (let i = 0; i < forecast.length; i++) {
        let f = forecast[i]
        let w = new Weather()
        w.city = data.HeWeather5[0].basic.city
        w.data = f.data
        w.tmpMax = f.tmp.max
        w.tmpMin = f.tmp.min
        w.cond = f.cond.txt_d
        forecastArr.push(w)
    }
    return forecastArr
}

// module.exports.getNowWeather = getNowWeather
// module.exports.getForecastWeather = getForecastWeather
module.exports = {
    log,
    getNowWeather,
    getForecastWeather,
}