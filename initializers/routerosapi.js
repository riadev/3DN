var rosapi = require('mikronode');

exports.routerosapi = function(api, next){

  api.routerosapi = {};

  api.routerosapi._start = function(api, next){
   
    next();
  };

  api.routerosapi._stop =  function(api, next){
    next();
  };

  next();
}