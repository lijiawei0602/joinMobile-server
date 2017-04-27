var nodemailer = require('nodemailer');

var config = {
  host: 'smtp.exmail.qq.com',
  port: 25,
  auth: {
    user: 'join@xiyoumobile.com',
    pass: ''
  }
};
    
var transporter = nodemailer.createTransport(config);

var sendmail = function(mail,callback){
  // 发送邮件
  transporter.sendMail(mail, function(error, info){                          
    if(error){
      console.log(error);
    }else{
      callback(false, "send success");
    }
  });
};

var mailer = function(object, mobile, callback){
  if(mobile != ""){
    callback(true, "no permission");
    return;
  }
  if(!object.to && !object.subject && !object.text){
    callback(true, "please check your inf");
    return;
  }
  
  var data = {
    from: 'join@xiyoumobile.com',
    to: object.to,
    subject: object.subject,
    text: object.text,
  };
  sendmail(data, function(err,result){
    if(!err){
      callback(false, "send success");
    }
  });
};

module.exports = mailer;
