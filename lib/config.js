var cjson = require('cjson');
var path = require('path');
var fs = require('fs');
var helpers = require('./helpers');

require('colors');

exports.read = function() {
  var mupJsonPath = path.resolve('mup.json');
  if(fs.existsSync(mupJsonPath)) {
    var mupJson = cjson.load(mupJsonPath);

    //validating servers
    if(!mupJson.servers || mupJson.servers.length == 0) {
      mupErrorLog('server information does not exist');
    } else {
      mupJson.servers.forEach(function(server) {
        if(!server.host){
          mupErrorLog('server host does not exist');
        } else if(!server.username){
          mupErrorLog('server username does not exist');
        } else if(!server.password && !server.pem){
          mupErrorLog('server password or pem does not exist');
        } else if(!mupJson.app) {
          mupErrorLog('path to app does not exist');
        }

        //rewrite ~ with $HOME
        if(server.pem) {
          server.pem = server.pem.replace('~', process.env.HOME);
        } else {
          //hint mup bin script to check whether sshpass installed or not
          mupJson._passwordExists = true;
        }
      });
    }

    //initialize env
    mupJson.env = mupJson.env || {};

    return mupJson;
  } else {
    console.error('mup.json file not exists'.red.bold);
    helpers.printHelp();
    process.exit(1);
  }
};

function mupErrorLog(message) {
  var errorMessage = 'invalid mup.json: ' + message;
  console.error(errorMessage.red.bold);
  process.exit(1);
}