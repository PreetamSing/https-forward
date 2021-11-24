const httpProxy = require('http-proxy');
const finalhandler = require('finalhandler')
const morgan = require('morgan')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))

let target = null
let localPort = null
let tlsKey = null
let tlsCert = null

let configFilePath = args['c'] ? args['c'] : args['config']
configFilePath = configFilePath ? configFilePath : './https-port-forward.json'
let configuration = fs.existsSync(configFilePath) ? fs.readFileSync(configFilePath, 'utf8') : null

try{
    configuration = JSON.parse(configuration)
}catch(error){
    throw Error('Invalid Config File.')
}

if (configuration) {
    target = configuration.target ? configuration.target : null
    localPort = configuration.localPort ? configuration.localPort : null
    tlsKey = configuration.key ? configuration.key : null
    tlsCert = configuration.cert ? configuration.cert : null
}


target = (args['t'] ? args['t'] : args['target']) ? (args['t'] ? args['t'] : args['target']) : target
localPort = (args['p'] ? args['p'] : args['port']) ? (args['p'] ? args['p'] : args['port']) : localPort
tlsKey = args['key'] ? args['key'] : tlsKey
tlsCert = args['cert'] ? args['cert'] : tlsCert


if(!localPort || !target){
    throw Error('Define localProd (-p) and target (-t)')
}


// TLS Setup
const http_options = {
    key: fs.existsSync(tlsKey) ? fs.readFileSync(tlsKey, 'utf8') : null,
    cert: fs.existsSync(tlsCert) ? fs.readFileSync(tlsCert, 'utf8') : null
}

let http = null
if (http_options.key && http_options.cert) {
    http = require('https')
} else {
    http = require('http')
}

// Create the proxy server
const proxy = httpProxy.createProxyServer({});

// Setup Morgan
const Logger = morgan('tiny')

// Create the local server
const server = http.createServer(http_options, function (req, res) {
    try {
        const done = finalhandler(req, res)
        Logger(req, res, function (err) {
            if (err) return done(err)
            proxy.web(req, res, { changeOrigin: true, target });
        })
    } catch (error) {
        console.log(error);
    }
})

server.listen(localPort)
server.on('listening', () => {
    console.log(configuration)
    console.log(
        `Proxy server is listening for port ${localPort}\n`,
        `Forwarded To: ${target}`
    );
})

module.exports = server