var io = require('socket.io');
var utils;

/**
 * A tool to easily create and use SocketIO-Rooms inside nodejs-express-routes.
 * @param  {[type]} param   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
module.exports = function(param, options){
	if(!utils) utils = require('./bin/utils')(options);
	if(typeof param === 'object') return utils.initSocketIo(param);

	if(!param) param = '/';
	if(typeof param === 'string') utils.initRoom(param);

	return function(userName, callback){
		if(!utils.mySocketIo) return utils.print('socket desconected! Socketio-server was initialized?', 1);
		if(!utils.users[param]) utils.initRoom(param);
		if(typeof userName !== 'string' || typeof callback !== 'function')
			return callback('incorrect parameters; should be function(userName, function(err, socket))');
		if(!users[param][userName]) return callback('user not connected!');
		if(users[param][userName]) return callback(null, users[param][userName]);
	};
};
