# https-forward [![NPM](https://img.shields.io/badge/release-stable-green)](https://www.npmjs.org/package/https-forward) [![NPM](https://img.shields.io/badge/version-v0.0.1-green)](https://www.npmjs.org/package/https-forward)


Simple proxy forward for incoming HTTP/HTTPs requests. Built for node.js/io.js.

## Installation

```
npm install https-forward
```

## API

NodeJS usage
```js
const Server = require('https-forward')

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

## License

MIT - Shankhadeep Das