const config = require('../lib/config');
const PARSE = require('parse').Parse;


exports.getInstance = function getInstance() {
    PARSE.initialize(config('PARSE_APPID'), config('PARSE_JAVASCRIPTKEY'), config('PARSE_MASTERKEY'));
    PARSE.Cloud.useMasterKey();
    return PARSE;
};