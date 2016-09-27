var utils;

/**
 * A tool to easily create and use SocketIO-Rooms inside nodejs-express-routes.
 * @param  {object || string} param   [http object server or string room name]
 * @param  {object} options [description]
 * @return {function}         [function(userName, function(err, socket));
 								the exposed function to use the client
								socket when needed]
 */
module.exports = function(param, options){
	if(!utils || options) utils = require('./bin/utils')(options);
	if(typeof param === 'object') return utils.initSocketIo(param);

	if(!param) param = '/';
	if(typeof param === 'string') utils.initRoom(param, options);

	return function(id, callback){
		if(!utils.getSocketIo()) return callback('socket desconected! Socketio-server was initialized?');
		if(!utils.getRoom(param)) utils.initRoom(param);
		if(typeof id !== 'string' || typeof callback !== 'function')
			return callback('incorrect parameters; should be function(id, function(err, socket))');
		if(!utils.getRoom(param)[id]) return callback('id not connected!');
		if(utils.getRoom(param)[id]) return callback(null, utils.getRoom(param)[id]);
	};
};
