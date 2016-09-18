# socketio-server
A tool to easily create and use SocketIO-Rooms inside nodejs-express-routes.

#### Please Note

This package was built upon the great [socket.io](https://www.npmjs.com/package/socket.io).
Know the [api](https://www.npmjs.com/package/socket.io#api) especially the [socket](https://www.npmjs.com/package/socket.io#socket) section to get the best out of it.

---

## Installation

use your http server as parameter

```javascript
var http = require('http');
require('socketio-server')(http, {debug: true});
```

or your server instance of express

```javascript
var http = require('http');
var server = http.createServer(app);
require('socketio-server')(server, {debug: true});
```

---

## Usage

In the client of your application, the first step is to emit an event named **_register_** with an identifier that you keep track. In the example bellow I've used my username as the identifier:

```javascript
// this can be found laying in some Angular directive frontend application

// an socket for the room 'chat'
let socket = io.connect('http://localhost:3000/chat');
socket.on('connect', function(socket){
    // here's the 'register' call
    socket.emit('register', 'raphaelbs');

    // ... any other event assign
    socket.on('foo', function(bar){
        console.log(bar);
    });
});
```

And inside the Node server, the socket of the registered identifier can be retrieved at any time using the  

```javascript
var express = require('express');
var router = express.Router();
var socket = require('socketio-server');
var chatRoom = socket('chat');

router.get('/', function(req, res) {
    // using the common identifier we can retrieve the correcty socket inside the router
	chatRoom('raphaelbs', function(err, socket){
		if(err) return console.error(err);
		// this socket instance is an socket.io socket
		var bar = 10;
		// only the event 'foo' of 'raphaelbs' will receive this 'bar'
		socket.emit('foo', bar);
	});
});

module.exports = router;

```

---

## Reference

### require('socketio-server')([params](#constructor-argument-params)[, [options](#constructor-argument-options)])
>_return [function(id, callback)](#requiresocketio-serverroom-nameid-callback)_

The main entry point of this module.

***

#### Constructor argument: params
> type _string_ or _object_

If you need to initialize the module, you should supply the server as argument:
```javascript
var http = require('http');
var server = http.createServer(app);
require('socketio-server')(server, {debug: true});
```

If you are in the **use** stage, the _params_ argument could serve as **Room identifier**:
```javascript
var socket = require('socketio-server');
var chatRoom = socket('chat'); //creates (if not created) and exposes a room named 'chat'
var mainRoom = socket(); //creates (if not created) and exposes the default '/' room
```

#### Constructor argument: options
> type _object_

key | description | type | default
--- | --- | --- | ---
*debug* | Enable verbosity for debuggin (very handy) | boolean | false

***

### require('socketio-server')('room name')(id, callback)

This function is the goal of the module. Within this function, you can specifically get the socket of the desired ID defined in your client-side.

#### id
> type string

The identifier of the socket that you want to retrieve.

#### callback
> type function(err, socket)

This callback function exposes a [socket](https://www.npmjs.com/package/socket.io#socket) object relative to the identifier above.

---

## Dependencies

socket.io

---

## Contact-me
* [Email](mailto:raphael.b.souza@hotmail.com)
* [Facebook](https://facebook.com/raphaelbs)
* [GitHub](https://github.com/raphaelbs)
* [NPM](https://npmjs.com/~raphaelbs)

---

## License

MIT
