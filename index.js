const httpProxy = require('http-proxy');
const finalhandler = require('finalhandler')
const morgan = require('morgan')
const fs = require('fs')

// Create the proxy server
const proxy = httpProxy.createProxyServer({});

// Setup Morgan
const Logger = morgan('tiny')


class Server {
    server = null
    options = null
    create(options) {
        this.options = options

        if (!this.options.localPort || !this.options.target) {
            throw Error('Please provide localProd (-p) and target (-t)')
        }



        // TLS Setup
        const http_options = {
            key: fs.existsSync(this.options.tlsKey) ? fs.readFileSync(this.options.tlsKey, 'utf8') : null,
            cert: fs.existsSync(this.options.tlsCert) ? fs.readFileSync(this.options.tlsCert, 'utf8') : null
        }

        let http = null
        if (http_options.key && http_options.cert) {
            http = require('https')
        } else {
            http = require('http')
        }


        // Create the local server
        this.server = http.createServer(http_options, function (req, res) {
            try {
                const done = finalhandler(req, res)
                Logger(req, res, function (err) {
                    if (err) return done(err)
                    proxy.web(req, res, { changeOrigin: true, target: this.options.target });
                })
            } catch (error) {
                console.log(error);
            }
        })

        return this
    }

    init() {
        this.server.listen(this.options.localPort)
        this.server.on('listening', () => {
            console.log(
                `Proxy server is listening for port ${this.options.localPort}\n`,
                `Forwarded To: ${this.options.target}`
            );
        })
    }
}

module.exports = Server