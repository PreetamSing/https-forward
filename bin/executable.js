#!/usr/bin/env node

const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const Server = require('../index.js')



let configFilePath = args['c'] ? args['c'] : args['config']
configFilePath = configFilePath ? configFilePath : './https-port-forward.json'
let configuration = fs.existsSync(configFilePath) ? fs.readFileSync(configFilePath, 'utf8') : null

try {
    configuration = JSON.parse(configuration)
} catch (error) {
    throw Error('Invalid Config File.')
}


let target = null
let localPort = null
let tlsKey = null
let tlsCert = null

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


new Server().create({
    target,
    localPort,
    tlsKey,
    tlsCert
}).init()