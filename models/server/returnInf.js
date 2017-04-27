// ----- 返回查找信息 ----- //

var mongo = require('./mongoConfig.js');

var returnInf = function(num, req, callback){
  if(num != req.session.num){
    callback(true, "without login");
    return;
  }
  if(!num){
    callback(true, "no parameter");
    return;
  }
  mongo.findNum(num, function(err, result){
    if(err){
      console.log(err, result);
    }

    if(callback){
      callback(false, {
        name: result[0].name,
        state: result[0].state,
        group: result[0].group,
      });
    }
  });
};

module.exports = returnInf;