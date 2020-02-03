var log = console.log.bind(console, '*** ')

var e = function(sel) {
    return document.querySelector(sel)
}

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var insertNow = function(now) {
    var tmp = e('.now-tmp')
    var city = e('.now-city')
    var cond = e('.now-cond')
    var windDir = e('.now-windDir')
    var windSc = e('.now-windSc')
    var hum = e('.now-hum')
    var fl = e('.now-fl')
    tmp.innerHTML = now.tmp
    cond.innerHTML = now.cond
    city.innerHTML = now.city
    windDir.innerHTML = now.windDir
    windSc.innerHTML = now.windSc
    hum.innerHTML = now.hum
    fl.innerHTML = now.fl
}

var now = function(city='') {
    var request = {
        method: 'POST',
        url: '/api/now',
        data: JSON.stringify({city: city}),
        contentType: 'application/json',
        callback: function(response) {
            var now = JSON.parse(response)
            insertNow(now)
        }
    }
    ajax(request)
}

var insertToday = function(today) {
    var cond = e('.today-cond')
    var tmpMax = e('.today-tmpMax')
    var tmpMin = e('.today-tmpMin')
    cond.innerHTML = today.cond
    tmpMax.innerHTML = today.tmpMax + '°'
    tmpMin.innerHTML = today.tmpMin + '°'
}

var insertChart = function(max, min) {
    var forecast = e('#id-weather-forecast')
    var myChart = echarts.init(forecast)
    option = {
        title: {
            text: '未来两天气温变化',
            left: 15,
            textStyle:{
                fontWeight:'normal',
                fontSize:16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            left: 15,
            data:['最高气温','最低气温'],
            textStyle:{
                fontSize:12,
            },
            padding: [
                32,  // 上
                0, // 右
                0,  // 下
                0, // 左
            ]
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            splitLine:{//网格线
                    show: true,
                    lineStyle:{
                        color:['#b1b1b1'],
                        type:'dashed'
                    }
                },
            data: ['今天','明天','后天'],
            axisTick:{
                show: false,
            }
        },
        yAxis: {
            splitLine:{//网格线
                    show: true,
                    lineStyle:{
                        color:['#b1b1b1'],
                        type:'dashed'
                    }
                },
            axisLabel: {
                show: false,
                formatter: '{value} °'
            },
            axisTick:{
                show: false,
            }
        },
        series: [
            {
                name:'最高气温',
                type:'line',
                data:max,
                label: {
    				normal: {
    					show: true,
    					position: 'top',
                        textStyle: {
						    fontSize: 16,
						}
    				}
    			}
            },
            {
                name:'最低气温',
                type:'line',
                data:min,
                markPoint: {
                    data: [
                        {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                label: {
    				normal: {
    					show: true,
    					position: 'top',
                        textStyle: {
						    fontSize: 16,
						}
    				}
    			}
            }
        ]
    }
    myChart.setOption(option)
}

var insertForecast = function(f) {
    var maxArr = []
    var minArr = []
    for (var i = 0; i < f.length; i++) {
        var x = f[i]
        var max = x.tmpMax
        var min = x.tmpMin
        maxArr.push(max)
        minArr.push(min)
    }
    insertChart(maxArr, minArr)
}

var forecast = function(city='') {
    var request = {
        method: 'POST',
        url: '/api/forecast',
        data: JSON.stringify({city: city}),
        contentType: 'application/json',
        callback: function(response) {
            var f = JSON.parse(response)
            var today = f[0]
            insertToday(today)
            insertForecast(f)
        }
    }
    ajax(request)
}

var search = function(city) {
    now(city)
    forecast(city)
}

var bindSearch = function() {
    var btn = e('.search-btn')
    btn.addEventListener('click', function() {
        var input = e('.search-input')
        var city = input.value
        search(city)
        var s = e('#id-weather-search')
        s.classList.add('hide')
        input.value = ''
    })
}

var bindSildeUp = function() {
    var body = e('body')
    var startY
    var endY
    body.addEventListener('touchstart', function(event) {
        startY = event.touches[0].pageY
    })
    body.addEventListener('touchend', function(event) {
        endY = event.changedTouches[0].pageY
        var dy = startY - endY
        if (dy > 0) {
            var s = e('#id-weather-search')
            s.classList.remove('hide')
        }
    })
}

var bindSildeDown = function() {
    var body = e('body')
    var startY
    var endY
    body.addEventListener('touchstart', function(event) {
        startY = event.touches[0].pageY
    })
    body.addEventListener('touchend', function(event) {
        endY = event.changedTouches[0].pageY
        var dy = startY - endY
        if (dy < 0) {
            var s = e('#id-weather-search')
            s.classList.add('hide')
        }
    })
}

var main = function() {
    bindSearch()
    bindSildeUp()
    bindSildeDown()
}

main()
