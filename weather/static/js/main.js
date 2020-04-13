const log = console.log.bind(console, '*** ')

const e = function(sel) {
    return document.querySelector(sel)
}

const ajax = function(request) {
    let r = new XMLHttpRequest()
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

const insertNow = function(now) {
    let tmp = e('.now-tmp')
    let city = e('.now-city')
    let cond = e('.now-cond')
    let windDir = e('.now-windDir')
    let windSc = e('.now-windSc')
    let hum = e('.now-hum')
    let fl = e('.now-fl')
    tmp.innerHTML = now.tmp
    cond.innerHTML = now.cond
    city.innerHTML = now.city
    windDir.innerHTML = now.windDir
    windSc.innerHTML = now.windSc
    hum.innerHTML = now.hum
    fl.innerHTML = now.fl
}

const now = function(city='') {
    let request = {
        method: 'POST',
        url: '/api/now',
        data: JSON.stringify({city: city}),
        contentType: 'application/json',
        callback: function(response) {
            log('response', response, typeof response)
            let now = JSON.parse(response)
            insertNow(now)
        }
    }
    ajax(request)
}

const insertToday = function(today) {
    let cond = e('.today-cond')
    let tmpMax = e('.today-tmpMax')
    let tmpMin = e('.today-tmpMin')
    cond.innerHTML = today.cond
    tmpMax.innerHTML = today.tmpMax + '°'
    tmpMin.innerHTML = today.tmpMin + '°'
}

const insertChart = function(max, min) {
    let forecast = e('#id-weather-forecast')
    let myChart = echarts.init(forecast)
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

const insertForecast = function(f) {
    let maxArr = []
    let minArr = []
    for (let i = 0; i < f.length; i++) {
        let x = f[i]
        let max = x.tmpMax
        let min = x.tmpMin
        maxArr.push(max)
        minArr.push(min)
    }
    insertChart(maxArr, minArr)
}

const forecast = function(city='') {
    let request = {
        method: 'POST',
        url: '/api/forecast',
        data: JSON.stringify({city: city}),
        contentType: 'application/json',
        callback: function(response) {
            let f = JSON.parse(response)
            let today = f[0]
            insertToday(today)
            insertForecast(f)
        }
    }
    ajax(request)
}

const search = function(city) {
    now(city)
    forecast(city)
}

const bindSearch = function() {
    let btn = e('.search-btn')
    btn.addEventListener('click', function() {
        let input = e('.search-input')
        let city = input.value
        search(city)
        let s = e('#id-weather-search')
        s.classList.add('hide')
        input.value = ''
    })
}

const bindSildeUp = function() {
    let body = e('body')
    let startY
    let endY
    body.addEventListener('touchstart', function(event) {
        startY = event.touches[0].pageY
    })
    body.addEventListener('touchend', function(event) {
        endY = event.changedTouches[0].pageY
        let dy = startY - endY
        if (dy > 0) {
            let s = e('#id-weather-search')
            s.classList.remove('hide')
        }
    })
}

const bindSildeDown = function() {
    let body = e('body')
    let startY
    let endY
    body.addEventListener('touchstart', function(event) {
        startY = event.touches[0].pageY
    })
    body.addEventListener('touchend', function(event) {
        endY = event.changedTouches[0].pageY
        let dy = startY - endY
        if (dy < 0) {
            let s = e('#id-weather-search')
            s.classList.add('hide')
        }
    })
}

const main = function() {
    bindSearch()

    bindSildeUp()
    bindSildeDown()
}

main()
