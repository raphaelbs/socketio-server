var io = require('socket.io');

/**
 * Utility funcitons.
 * @param  {object} options [options]
 * @return {[type]}         [description]
 */
module.exports = function(options){
	goptions = options;
	return fns;
};

var mySocketIo,
	events = {},
	rooms = {},
	goptions,
	printStack = [],
	fns = {
		print: print,
		initSocketIo: initSocketIo,
		initRoom: initRoom,
		getSocketIo : function(){ return mySocketIo; },
		getRoom: function(room) { return rooms[room]; }
	};

/**
 * Check the options.debug and/or stash everyelse.
 * @param  {string} msg [message to display]
 * @param  {boolean} err [tag for error]
 */
function print(msg, err, lazy){
	if((!goptions || !goptions.debug) && lazy) {
		printStack.push({msg: msg, err: err});
		return;
	}else{
		while(printStack.length > 0){
			var obj = printStack.shift();
			if(obj) doPrint(obj.msg, obj.err);
		}
	}
	doPrint(msg, err);
}

/**
 * Print messages in console. Only available with options.debug.
 * @param  {string} msg [message to display]
 * @param  {boolean} err [tag for error]
 */
function doPrint(msg, err){
	var header = '[socketio-server] ';
	if(err) return console.error(header + msg);
	return console.log(header + msg);
}

/**
 * socketio-server initializer.
 * @param  {object} http [server object (usually comes from express)]
 */
function initSocketIo(http){
	var socketIoParams = (goptions && goptions.socketIoParams) || {origins:'localhost:* http://localhost:*'};
	mySocketIo = io(http, socketIoParams);
	goptions && goptions.socketIoParams && print('lib initialized with custom socketIo parameters...', 0, 1);
	(!goptions || !goptions.socketIoParams) && print('lib initialized with default socketIo parameters...', 0, 1);
	for(var socketRoom in rooms){
		initRoom(socketRoom);
	}
}

/**
 * socketio-server room initializer.
 * @param  {string} socketRoom [socket room to initialize]
 */
function initRoom(socketRoom, eventsParams){
	rooms[socketRoom] = {};
	if(eventsParams) events[socketRoom] = eventsParams;
	if(mySocketIo) {
		print('socket room [' + socketRoom + '] openned!');
		mySocketIo.of(socketRoom).on('connection', trackUsers(rooms[socketRoom], events[socketRoom]));
	}else {
		print('stacking room [' + socketRoom + '] for lazy initialization');
	}
}

/**
 * Keeps track of the user by name and socket.id.
 * @param  {array} rooms [array of indexed rooms]
 * @return {function(socket)}       [the onConnected socket event function callback]
 */
function trackUsers(ids, events){
	var id = 'current-socket-room-user-index';
	ids[id] = {};
	var index = ids[id];
	return function(socket){
		socket.on('register', function(data){
			events && events['connect'] && events['connect'](data, socket);
			print('user [' + data + '] connected!');
			ids[data] = socket;
			index[socket.id] = data;
		});
		socket.on('disconnect', function(){
			print('lost connection with [' + index[socket.id] + '] :(');
			delete ids[index[socket.id]];
			delete index[socket.id];
		});
	};
}
