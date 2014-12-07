const PARSE = require('parse').Parse;
const config = require('./config');
const i18n = require('i18n');
const crypto = require('crypto');

exports.randomString = function randomString(len) {
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const rand = new Buffer(len);
	const bytes = crypto.randomBytes(len);
	for (var i = 0; i < bytes.length; i++) {
		rand[i] = characters[bytes[i] % characters.length].charCodeAt(0);
	}
	return rand.toString('utf8');
};

