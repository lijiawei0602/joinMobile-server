var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
var port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log('WANTED Start Success on ' + port);
});

var verCode = require('./models/login/verCode.js');
var login = require('./models/login/login.js');
var getInfo = require('./models/login/info.js');

var add = require('./models/server/add.js');
var all = require('./models/server/all.js');
var check = require('./models/server/check.js');
var returnInf = require('./models/server/returnInf.js');
var update = require('./models/server/update.js');
var iDelete = require('./models/server/delete.js');
var mailer = require("./models/server/mailer.js");

var json = function(res, err, result){
	if(err){
		res.jsonp({
			error: true,
			result: result,
		});
	}else{
		res.jsonp({
			error: false,
			result: result,
		});
	}
};

// -------------- session ----------------- //
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  name: 'session_from_qd',
  cookie: {maxAge: 8000000},
  resave: true,
  saveUninitialized: false,
}));

app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// --------------- 获取信息 --------------- //
app.use('/mail', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var object = {
    to:req.query.to,
    subject:req.query.subject,
    text:req.query.text,
  };
  var mobile = req.query.mobile;
  mailer(object, mobile, function(err, result){
    console.log(object);
    json(res, err, result);
  });
});

// --------------- 获取信息 --------------- //
app.use('/getInfo', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var username = req.query.username;
  var password = req.query.password;
  var session = req.query.session;
  var realName = req.query.realName;
  getInfo(username, password, session, realName, req, function(err, result){
    json(res, err, result);
  });
});

// --------------- 登录 --------------- //
app.use('/login', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
	var username = req.query.username;
  var password = req.query.password;
  var session = req.query.session;
  var verCode = req.query.verCode;
  login(username, password, verCode, session, req, function(err, result){
    json(res, err, result);
  });
});

// --------------- 验证码 --------------- //
app.use('/verCode', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
	verCode(function(err, result){
		json(res, err, result);
	});
});



// ----- 检查接口 ----- //
app.use('/check', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var num = req.query.num;
  check(num, req, function(err, result){
    json(res, err, result);
  });
});

// -----  管理接口 ----- //
app.use('/all', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var mobile = req.query.mobile;
  all(mobile, function(err, result){
    json(res, err, result);
  });
});

// -----  添加接口 ----- //
app.use('/add', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var newData = req.query.newData;
  add(newData, req, function(err, result){
    json(res, err, result);
  });
});

// -----  更新接口 ----- //
app.use('/update', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var num = req.query.num;
  var newData = req.query.newData;
  var mobile = req.query.mobile;
  update(num, newData, mobile, function(err, result){
    json(res, err, result);
  });
});

// -----  看信息接口 ----- //
app.use('/returnInf', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var num = req.query.num;
  returnInf(num, req, function(err, result){
    json(res, err, result);
  });
});

// -----  删除接口 ----- //
app.use('/delete', function(req, res){
  res.header("Access-Control-Allow-Credentials", "true");
  var num = req.query.num;
  var mobile = req.query.mobile;
  iDelete(num, mobile, function(err, result){
    json(res, err, result);
  });
});