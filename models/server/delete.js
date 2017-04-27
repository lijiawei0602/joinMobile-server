// ----- 删除接口 ----- //

var mongo = require('./mongoConfig.js');

var iDelete = function(num, mobile, callback){
  if(mobile != ""){
    callback(true, "no permission");
    return;
  }
  if(!num){
    callback(true, "no parameter");
    return;
  }
  mongo.iDelete(num, function(err, result){
    if(err){
      console.log(err, result);
    }

    if(callback){
      callback(false, "delete success");
    }
  });
};

module.exports = iDelete;