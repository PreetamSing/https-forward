# https-forward 
[![NPM](https://img.shields.io/badge/release-stable-green)](https://www.npmjs.com/package/@shankha/https-forward) 
[![NPM](https://img.shields.io/badge/version-v0.0.1-green)](https://www.npmjs.com/package/@shankha/https-forward)
[![NPM](https://img.shields.io/badge/node-14-green)](https://img.shields.io/badge/node-14-green)


Simple proxy forward for incoming HTTP/HTTPs requests. Built for node.js/io.js.
*Node: Make sure you are using node version 14 or higher

## Installation

```
npm install @shankha/https-forward -g
```

## API

NodeJS usage
```js
const Server = require('@shankha/https-forward')

new Server().create({
    target: "https://127.0.0.1",    // ex: For remote servers https://example.com
    localPort: 9000,
    tlsKey: <path/to/ssl/key>,      // Optional
    tlsCert: <path/to/ssl/cert>     // Optional
}).init()

```

CLI usage
```bash
https-forward -c ./<path/to/configuration/file>
https-forward --config ./<path/to/configuration/file>

or

https-forward -p 3000 -t https://example.com
https-forward --port 3000 --target https://example.com

```

CLI with SSL
```bash
https-forward -p 3000 -t https://example.com --key <path/to/ssl/key> --cert <path/to/ssl/cert>
```

Run with PM2

- Create config file https-forward-config.json
```
{
    "target": "http://xxxx-xxxx-xxxx-xxxx.ngrok.io",
    "localPort": 5000,
    "tlsKey": "/path/to/key.pem",
    "tlsCert": "/path/to/cert.pem",
}
```

- Create a bash script https-forward.sh
```bash
#!/usr/bin/bash
https-forward -c ./https-forward.json
```

- All Done, Now you need to run you PM2
```
pm2 start https-forward.sh
```



## USE CASE
This package is a simple but powerful tool to forward all the incoming http or https requests to some other server.
Now you can use this package in various ways.

#### You can run your main server to port 8080 (let's say') but you can expose another port to the client. 
Lets say your actual server is running on port 1220, but you can map the port to port let's say 80. This is how you are exposing only port 80 but in reality your application is running on port 1220. How cool is that. Now you can run some statistical thing or can add more security features before sending the request without hampering the main server code.
```
https-forward -p 1220 -t http://127.0.0.1:80
```

#### You can tunnel your remote server to your local machine
When you are developing the backend and your frontend team members are also using the remote server URL as there BaseURL. But some time you might have the feeling that if the frontenders role out a build with a BaseURL the connected to your local machine. Yes you can do this by setting up ngrok in your system. But once you restart your machine, your ngrok public url will be changed. Now you need to ask the frontenders again to give you a build with the new ngrok url. And I think they will get mad at this point!

So here is you solution, you can tunnel your remote server to your local machine using the ngrok url and the frontend app can still use it the remote server url. This way you can tunnel your remote server any time and you are not relying on your frontend team 
members.

*Note: You can use any of the localport tunnelling software like ngrok, localhost.run etc. 
```
https-forward -p 1220 -t http://xxxx-xxxx-xxxx-xxxx.ngrok.io
```


## License

MIT - Shankhadeep Das