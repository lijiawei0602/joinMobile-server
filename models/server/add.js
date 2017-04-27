// ----- 添加 ----- //

var mongo = require('./mongoConfig.js');
var mailer = require("./mailer.js");

var add = function(newData, req, callback){

  function iEscape(iString){
    return iString.replace(/[<>&"]/g, function(words){
      return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[words];
    });
  }

  if(!req.session.cookie){
    callback(true, "without login");
    return;
  }else{
    if(newData){
      mongo.findNum(newData.num, function(err, result){
        if(err){
          console.log(err, result);
        }
        // console.log(req.session.sex, req.session.name, newData);
        // ----- 是否存在 ----- //
        if(result.length === 0){         // ---- 不存在 ---- //
          if(req.session.num != newData.num){
            callback(true, "wrong num");
            return;
          }
          if(req.session.name != newData.name){
            callback(true, "wrong name");
            return;
          }
          if((req.session.num == newData.num) || (req.session.name = newData.name)){

          // ------ 后台正则 ------ //
          var nameRe = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/;
          var numRe = /^[0-9]*$/;
          var telRe = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
          var mailRe = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
          var groupRe = /\b(Web|Android|iOS)\b/;
          var messageRe = /^[^<>\/]+$/;


          if(!nameRe.test(newData.name)){
            callback(true, "name err");
          }
          else if(!numRe.test(newData.num)){
            callback(true, "name err");
          }
          else if(!telRe.test(newData.tel)){
            callback(true, "tel err");
          }
          else if(!mailRe.test(newData.mail)){
            callback(true, "mail err");
          }
          else if(!groupRe.test(newData.group)){
            callback(true, "group err");
          }
          // else if(!messageRe.test(newData.message)){
          //   callback(true, "留言不合法");
          // }
          else if(newData.state){
            callback(true, "state err");
          }
          else{
            newData.name = req.session.name;
            newData.num = req.session.num;
            newData.class = req.session.class;
            newData.sex = req.session.sex;
            newData.tel = iEscape(newData.tel);
            newData.message = iEscape(newData.message);
            newData.mail = iEscape(newData.mail);
            newData.group = iEscape(newData.group);

            //不存在再添加
            mongo.add(newData, function(err, result){
              if(err){
                callback(true, err);
              }else{
                if(callback){
                  //报名成功后发送报名成功信息邮件
                  var mobile = "xiyou3gfz155**//";
                  var data = {
                    to: newData.mail,
                    subject:"西邮移动应用开发实验室——纳新",
                    text:"同学您好，恭喜您报名成功啦！请随时关注实验室纳新网页与所填邮箱的状态更新，查看一面面试时间。（请及时完成纳新笔试题目）"
                  };

                  mailer(data, mobile , function(err,result){
                    if(err){
                      console.log(err);
                    }else{
                      console.log("send success");
                    }
                  });

                  callback(false, 'add success');
                }
              }
            });

          }
        }

        }else{      // 如果学号存在即已报名
          callback(true, "aleady in");
        }
      });
    }else{
      callback(true, "without data");
    }
  }
  
};



module.exports = add;