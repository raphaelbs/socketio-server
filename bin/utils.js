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
	users = {},
	goptions,
	fns = {
		print: print,
		initSocketIo: initSocketIo,
		initRoom: initRoom,
		mySocketIo : mySocketIo,
		users: users
	};
	
/**
 * Print messages in console. Only available with options.debug.
 * @param  {string} msg [message to display]
 * @param  {boolean} err [tag for error]
 */
function print(msg, err){
	(!goptions || !goptions.debug) && return;
	var header = '[socketio-server] ';
	if(err) return console.error(header + msg);
	return console.log(header + msg);
}

/**
 * socketio-server initializer.
 * @param  {object} http [server object (usually comes from express)]
 */
function initSocketIo(http){
	goptions && goptions.socketIoParams && print('initializing lib with custom socketIo parameters.');
	(!goptions || !goptions.socketIoParams) && print('initializing lib with default socketIo parameters.');
	var socketIoParams = (goptions && goptions.socketIoParams) || {origins:'localhost:* http://localhost:*'};
	mySocketIo = io(http, socketIoParams);
	for(var socketRoom in users){
		initRoom(socketRoom);
	}
}

/**
 * socketio-server room initializer.
 * @param  {string} socketRoom [socket room to initialize]
 */
function initRoom(socketRoom){
	users[socketRoom] = {};
	if(mySocketIo) {
		print('initializing socket room ' + socketRoom);
		mySocketIo.of(socketRoom).on('connection', trackUsers(users[socketRoom]));
	}
}

/**
 * Keeps track of the user by name and socket.id.
 * @param  {array} users [array of indexed users]
 * @return {function(socket)}       [the onConnected socket event function callback]
 */
function trackUsers(users){
	users['index-index-index-index'] = {};
	var index = users['index-index-index-index'];
	return function(socket){
		socket.on('login', function(data){
			print('usuario [' + data.name + '] conectado');
			users[data.name] = socket;
			index[socket.id] = data.name;
		});
		socket.on('disconnect', function(){
			delete users[index[socket.id]];
		});
	};
}
