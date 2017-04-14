var appid = 'gp9NTUgupgFI4MR2Ha6Y93Qd-gzGzoHsz';
var appkey = '1DpyxUsDN5YHkRTS6VkEk83F';
AV.init({//数据储存初始化
	  appId: appid,
	  appKey: appkey,
	  region: 'cn'
});

function setCookie(name, value, days) { 
//建立cookie方法
	var len = arguments.length; 
	if (len == 2) {
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + 24*60*60*1000); 
	    document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString() + ';path=/'; 
	} else if (len == 3) {
		var exp = new Date();
		exp.setTime(exp.getTime() + days*60*60*1000);
		document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString() + ';path=/';
	} else {
		alert('SetCookie参数错误!');
	}
} 

$('#registe-btn').click(function(){
	// LeanCloud - 注册	
  	var usname = $('#registe-name').val();
    var passwd = $('#registe-pswd').val();
    $('#log-name').val(usname);
	var user = new AV.User();
	user.setUsername(usname);
	user.setPassword(passwd);
//	user.setEmail(email);
	user.signUp().then(function (loginedUser) {
		// 注册成功，跳转到商品 list 页面
		console.log(loginedUser.id);
		var log_id = loginedUser.id;
		alert("注册成功！");
		setCookie('login_id',log_id);
	}, (function (error) {
		alert("账号已经注册！");
		$('.login-con').css('display','block');
		$('.registe-con').css('display','none');
//	    alert(JSON.stringify(error));
	}));
});

$('#log-btn').click(function(){
	var logname = $('#log-name').val();
	var logpw = $('#log-pswd').val();
	// LeanCloud - 登录
	AV.User.logIn(logname, logpw).then(function (loginedUser) {
	    // 登录成功，跳转到商品 list 页面
	    alert("成功！");
		setTimeout(function(){
			window.location.href = '/im.html?url='+window.location.href;
		},1000)
	}, function (error) {
		alert("账号与密码不符！");
//		alert(JSON.stringify(error));
	});
});