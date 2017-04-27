// ----- mongo配置 ---- //

var mongoose = require('mongoose');

var options = {
  server: {
    auto_reconnect: true,
  }
};
mongoose.connect('mongodb://localhost/wanted', options, function(err, res){
  if(err){
    console.log(err);
  }
});
mongoose.connection.on('connected', function(){
  console.log('WANTED Connection Success');
});

var mongooseSchema = new mongoose.Schema({
  name: {type: String},   //名字
  num: {type: String},    //学号
  class: {type: String},  //班级
  sex: {type: String},    //性别
  tel: {type: Number},    //电话
  message: {type: String},//留言
  mail: {type: String},   //邮箱
  group: {type: String},  //方向
  state: {type: String},  //状态
});
var db = mongoose.connection;

// ----- 添加静态方法 ----- //
mongooseSchema.statics.findbyId = function(num, callback){
  return this
    .model('wanted')
    .find({num: num}, callback);
};

var mongooseModel = db.model('wanted', mongooseSchema);

// ----- 找所有 ----- //
var findAll = function(callback){
  mongooseModel.find({}, {
    name: 1,
    num: 1,
    class: 1,
    sex: 1,
    tel: 1,
    mail: 1,
    message: 1,
    group: 1,
    state: 1,
    }, 
  callback);
};

// ----- 找学号 ----- //
var findNum = function(num, callback){
  mongooseModel.findbyId(num, function(error, result){
    if(error){
      console.log(error);
      callback('Server Error', error);
      return;
    }
    callback(false, result);
  });
};


// ----- 添加 ----- //
var add = function(doc, callback){
  mongooseModel.create(doc, function(error){
    if(error){
      callback(true, error);
    }else{
      if(callback){
        callback();
      }
    }
  });
};

// ----- 修改 ----- //
var update = function(num, newData, callback){
  mongooseModel.update(
    {num: num},
    {$set: newData},
    {upset: true},
    function(err){
      if(err){
        console.log(err);
      }
      if(callback){
        callback();
      }
    }
  );
};

// ----- 删除 ----- //
var iDelete = function(num, callback){
  mongooseModel.remove(
    {num: num},
    function(err){
      if(err){
        console.log(err);
      }
      if(callback){
        callback();
      }
    }
  );
};


exports.iDelete = iDelete;
exports.findAll = findAll;
exports.findNum = findNum;
exports.update = update;
exports.add = add;