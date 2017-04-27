// ----- 登录 ----- //

var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');


var login = function(username, password, verCode, session, req, callback){
  if(!username || !password || !verCode || !session || !req){
    callback(false, "no data");
    return;
  }
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; 
  var base64DecodeChars = new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, 
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, 
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1); 
  function base64decode(str) { 
    var c1, c2, c3, c4; 
    var i, len, out; 

        len = str.length; 
        i = 0; 
        out = ""; 
        while(i < len) { 
        /* c1 */ 
        do { 
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; 
        } while(i < len && c1 == -1); 
        if(c1 == -1) 
            break; 

        /* c2 */ 
        do { 
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; 
        } while(i < len && c2 == -1); 
        if(c2 == -1) 
            break; 

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4)); 

        /* c3 */ 
        do { 
            c3 = str.charCodeAt(i++) & 0xff; 
            if(c3 == 61) 
            return out; 
            c3 = base64DecodeChars[c3]; 
        } while(i < len && c3 == -1); 
        if(c3 == -1) 
            break; 

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2)); 

        /* c4 */ 
        do { 
            c4 = str.charCodeAt(i++) & 0xff; 
            if(c4 == 61) 
            return out; 
            c4 = base64DecodeChars[c4]; 
        } while(i < len && c4 == -1); 
        if(c4 == -1) 
            break; 
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4); 
        } 
        return out;
    }
    password = base64decode(password);


	if(username === '' || password === ''){
		callback('Account Error');
		return;
	}

	var options = {
		url: 'http://222.24.62.120/default2.aspx',
		method: 'POST',
		form: {
			'__VIEWSTATE':'dDwtNTE2MjI4MTQ7Oz5O9kSeYykjfN0r53Yqhqckbvd83A==',
      'txtUserName':username,
      'Textbox1':'',
      'TextBox2':password,
      'txtSecretCode':verCode,
      'RadioButtonList1':'%D1%A7%C9%FA',
      'Button1':'',
      'lbLanguage':'',
      'hidPdrs':'',
      'hidsc':'',
		},
		headers: {
      'Host': '222.24.62.120',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Origin': 'http://222.24.62.120',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': 'http://222.24.62.120/default2.aspx',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
      'Cookie': session,
		}
	};

	request(options, function(err, res, body){
		if(err){
			callback(true, 'Server Error');
			return;
		}
    body = iconv.decode(body, "GB2312").toString();
		var ifSuccess = body.indexOf('Object moved');
    
		if(ifSuccess == -1){
			callback(true, 'Please check your password or vercode');
			return;
		}else{
      getRealName(username, password, session, req, callback);
    }
	});
};


var getRealName = function(username, password, session, req, callback){
  var options = {
    url: "http://222.24.62.120/xs_main.aspx?xh=" + username,
    method: "GET",
    encoding: null,
    headers: {
      Referer: "http://222.24.62.120/",
      Cookie: session
    },
  };

  request(options, function(err, res, body){
    if(err){
      console.log(err);
      return;
    }

    body = iconv.decode(body, "GB2312");
    var $ = cheerio.load(body);
    var name = $("#xhxm").text().replace("同学","");

    req.session.num = username;
    req.session.name = name;

    realName = name;

    callback(false, {
      name: name,
      message: "login success",
    });
  });

};



module.exports = login;