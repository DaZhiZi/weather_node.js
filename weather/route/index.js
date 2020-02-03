const sendHtml = function(path, response) {
    let fs = require('fs')
    let options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        response.send(data)
    })
}

const index = {
    path: '/',
    method: 'get',
    func: function(request, response) {
        let path = 'index.html'
        sendHtml(path, response)
    }
}

const routes = [
    index,
]

module.exports.routes = routes
