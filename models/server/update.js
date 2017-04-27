// ----- 更新 ----- //

var mongo = require('./mongoConfig.js');


var update = function(num, newData, mobile, callback){
  if(mobile != ""){
    callback(true, "no permission");
    return;
  }
  if(!num){
    callback(true, "no parameter");
    return;
  }
  if(!newData){
    callback(true, "no parameter");
    return;
  }
  mongo.update(num, newData, function(err, result){
    if(err){
      console.log(err, result);
    }

    if(callback){
      callback(false, 'update success');
    }
  });
};

module.exports = update;