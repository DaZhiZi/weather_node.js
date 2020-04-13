// 引入 express 并且创建一个 express 实例赋值给 app
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const log = console.log.bind(console)

app.use(bodyParser.json())
// 配置静态文件
app.use(express.static('static'))

const registerRoutes = function (app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}
/*
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

const routeWeather = require('./route/weather')
registerRoutes(app, routeWeather.routes)

 */
const importRoutes = (app, routeModules) => {
    for (let v of routeModules) {
        let routeModule = v
        let route = require(routeModule)
        registerRoutes(app, route.routes)
    }
}

const routeModules = [
    './route/index',
    './route/weather',
]
importRoutes(app, routeModules)

/*
listen 函数的第一个参数是我们要监听的端口
这个端口是要浏览器输入的
默认的端口是 80
所以如果你监听 80 端口的话，浏览器就不需要输入端口了
但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
 */
const server = app.listen(8081, () => {
    let host = server.address().address
    let port = server.address().port
    let msg = `应用实例，访问地址为 http://${host}:${port}`
    log('msg', msg)
})
