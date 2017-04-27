// ----- 查找所有 ----- //

var mongo = require('./mongoConfig.js');

var all = function(mobile, callback){
  if(mobile != ""){
    callback(true, "no permission");
    return;
  }
  mongo.findAll(function(err, result){
    if(err){
      console.log(err, result);
    }
    if(callback){
      callback(false, result);
    }
  });
};

module.exports = all;