// ----- 检查接口 ----- //

var mongo = require('./mongoConfig.js');

var check = function(num, req, callback){
  // console.log(num, req.session.num);
  if(num != req.session.num){
    callback(true, "without login");
    return;
  }
  mongo.findNum(num, function(err, result){
    if(err){
      console.log(err, result);
    }

    // ----- 是否存在 ----- //
    if(result.length === 0){
      callback(false, {
        message: "without sign",
        name: req.session.name,
      });
    }else{
      callback(false, "sign up");
    }
  });
};

module.exports = check;