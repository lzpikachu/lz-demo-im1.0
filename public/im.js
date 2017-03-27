var Realtime = AV.Realtime;
var TextMessage = AV.TextMessage;
var realtime = new Realtime({
appId: 'ymfg02o4PikTPeVdFJnTIyrn-gzGzoHsz',
region: 'cn', //美国节点为 "us"
// pushOfflineMessages: true,
});

function getCookie(name) { 
	//取cookie
    var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
} 

$(function(){
	//计算出窗口高度按百分比设置div
//	var winheight = $(window).height();
//	var divheight = winheight*8.3/10;
//	var chatheight = winheight*6.3/10;
//	var inputdivheight = winheight*1.3/10;
//	var inputheight = winheight*0.8/10;
	var test= document.getElementById("textarea");  
	$('.left-chat-div').css("height","765px");
	$('.right-chat-div').css("height","576px");
	$('.input-chat').css("height","120px");
	$('#textarea').css("height","65px");
    test.onkeydown = function(e){  
        send(e);  
    }
    function send(e){  
        //禁用textarea的回车换行
        var code;  
        if (!e) var  e = window.event;  
        if (e.keyCode) code = e.keyCode;  
        else if (e.which) code = e.which;  
        if(code==13 && window.event){  
            e.returnValue = false;  
            }else if(code==13){ 
                e.preventDefault();  
        }  
    }  
});

$(document).keydown(function(event){
	//按下enter发送消息
	var txt = $("#textarea").val();//获取输入的内容
	if(txt == ""){
		return;
	}
    else if(event.keyCode==13){
        $("#send-btn").click(); 
    } 
}); 

$('#textarea').bind('input propertychange', function(event) {
	//监听输入框是否有值，来改变按钮可用状态
	if($(this).val() ==""){
		$(".input-chat").css("border","solid 1px #ccc");
		$("#send-btn").attr("disabled", true); 	
	}else{
		$(".input-chat").css("border","solid 1px #1c86ee");
		$("#send-btn").attr("disabled", false); 		
	}
});


//Tom 用自己的名字作为clientId，获取AVIMClient对象实例
//var lianjie = realtime.createIMClient(name);
//未读条数
// lianjie.then(function(client){
//   client.on('unreadmessages', function unreadMessagesEventHandler(payload, conversation) {
//       console.log(payload);
//       console.log(conversation);
//       // {
//       //   count: 4,
//       //   lastMessageId: "UagNXHK0RHqIvM_VB7Injg",
//       //   lastMessageTimestamp: [object Date],
//       // }
//     })
// })

// lianjie.then(function(tom){
//   tom.close().then(function() {
//     console.log(name + '退出登录');
//   }).catch(console.error.bind(console));
// })
var name = getCookie('login_id');
$(function(){
	//将用户名放左边头上
	$('.navlefttxt').text(name);
});

realtime.createIMClient(name).then(function(tom) {
    var query = tom.getQuery();
    return query.limit(10).containsMembers([name]).withLastMessagesRefreshed(true).find();//查询最近10条回话withLastMessagesRefreshed(true)作用返回最后一条消息
//  return query.withMembers(['Jerry']).find();
//  return query.withLastMessagesRefreshed(true).find();
   	// 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列limit(条数)
}).then(function(conversations) {
    	conversations.map(function(conversation) {
// 	    console.log(conversation.lastMessageAt.toString(), conversation.members);//日期和对话
// 	    console.log(conversation.members);
        var lastmessage = conversation.lastMessage._lctext;//最后一条消息内容
        var todate = conversation.lastMessageAt;//最后一条消息时间
	    var year = todate.getFullYear();//获取年
	    var month = todate.getMonth()+1;//获取月
	    var dat = todate.getDate();//获取日
	    var huors = todate.getHours() < 10 ? "0" + todate.getHours() : todate.getHours();//获取小时数
	    var minutes = todate.getMinutes() < 10 ? "0" + todate.getMinutes() : todate.getMinutes();//获取分钟数
	    var seconds = todate.getSeconds() < 10 ? "0" + todate.getSeconds() : todate.getSeconds();//获取秒数
        var sendtime = month+"月"+dat+"日"+huors+":"+minutes+":"+seconds;//历史消息时间
   	    var arr = conversation.members;
	    for (var i=0; i<arr.length; i++){
         var conver = arr[i];
//          var len = $(".mui-table-view-cell[data-name='"+conver+"']").length;
         if(conver != name ){
//          	console.log(arr[i]);
         $(".left-chat-div").append("<div class='mui-table-view-cell' data-name='"+arr[i]+"' data-id='"+conversation.id+"'>"+"<span class='mui-icon mui-icon-contact'>"+arr[i]+"</span>"+"<span class='left-list-time'>"+sendtime+"</span>"+"<div class='last-text'>"+lastmessage+"</div>"+"</div>");
         }
	    }
     // $(".left-chat-div").append($("<div class='mui-table-view-cell' data-name='"+arr[0]+"' data-id='"+conversation.id+"'>"+"<span class='mui-icon mui-icon-contact'>"+arr[0]+"</span></div>"));
   	   });
   }).then(function(zt){
        $('.mui-table-view').find('p').remove();//加载完成移除加载小图标
        $('.mui-table-view-cell:eq(0)').trigger('click');////左侧加载后，默认点击第一个对话
    }).catch(console.error.bind(console));


$("#send-btn").click(function(){
	var posttxt = $("#textarea").val();//获取输入的内容
	// Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
    realtime.createIMClient(name).then(function(tom) {
        // 创建与Jerry之间的对话
        return tom.createConversation({
        members: [''+$('#user_name').val()+''],//发给谁
//      name: 'Tom & Jerry',//谁和谁的对话
        transient: false,
        // pinned: true,//置顶
        unique: true,//unique - 是否创建唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话。该值默认为 false。
    });
  }).then(function(conversation) {
  // 发送消息
//  console.log(conversation);
  return conversation.send(new AV.TextMessage(posttxt));//回调函数
  }).then(function(message) {
  	    var todate = message.timestamp;
	    var year = todate.getFullYear();//获取年
	    var month = todate.getMonth()+1;//获取月
	    var dat = todate.getDate();//获取日
	    var huors = todate.getHours() < 10 ? "0" + todate.getHours() : todate.getHours();//获取小时数
	    var minutes = todate.getMinutes() < 10 ? "0" + todate.getMinutes() : todate.getMinutes();//获取分钟数
	    var seconds = todate.getSeconds() < 10 ? "0" + todate.getSeconds() : todate.getSeconds();//获取秒数
        var sendtime = month+"月"+dat+"日"+huors+":"+minutes+":"+seconds;//历史消息时间
//	console.log(conversation.id + ' name: ' + conversation.name);
    $(".right-chat-div").append("<li class='right-send-time'><span>"+sendtime+"<li class='right-send-chat'>"+"<span class='send-txt'>"+posttxt+"</span>"+"</li>");//将发送的内容加到视窗中
    $('.right-chat-div').scrollTop( $('.right-chat-div')[0].scrollHeight );//使滚动条始终在最下端，显示最后发的消息
    $("#textarea").val('');//发送就清空输入框
    $('.input-chat').css("border","solid 1px #ccc");//有值边框变色
	$("#send-btn").attr("disabled", true); 	
  }).catch(console.error);
});

// Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
// Jerry 登录
realtime.createIMClient(name).then(function(jerry) {//接受消息
    jerry.on('message', function(message, conversation) {
    	var lastmessage = conversation.lastMessage._lctext;//最后一条消息
        var todate = conversation.lastMessageAt;//最后一条消息时间
    	var todate = message.timestamp;
	    var year = todate.getFullYear();//获取年
	    var month = todate.getMonth()+1;//获取月
	    var dat = todate.getDate();//获取日
	    var huors = todate.getHours() < 10 ? "0" + todate.getHours() : todate.getHours();//获取小时数
	    var minutes = todate.getMinutes() < 10 ? "0" + todate.getMinutes() : todate.getMinutes();//获取分钟数
	    var seconds = todate.getSeconds() < 10 ? "0" + todate.getSeconds() : todate.getSeconds();//获取秒数
        var sendtime = month+"月"+dat+"日"+huors+":"+minutes+":"+seconds;//历史消息时间
if (message.cid == $('#user_id').val()) { //////判断如果当前窗口是对应用户，右侧窗口加消息
      $(".right-chat-div").append("<li class='left-get-time'><span>"+sendtime+"<li class='left-get-chat'>"+"<span class='get-txt'>"+message.text+"</span>"+"</li>");//将发送的内容加到视窗中
      $('.right-chat-div').scrollTop( $('.right-chat-div')[0].scrollHeight );//使滚动条始终在最下端，显示最后的消息
      return ;
    }
    var deo = $(".mui-table-view-cell[data-name='"+message.from+"']");
    if(deo.length > 0){

      var i_span = deo.children('.mui-badge').text();
      if (i_span == '') {
        i_span = 1;
         deo.append("<span class='mui-badge mui-badge-primary'>"+1+"</span>");
         deo.children(".left-list-time").text(sendtime);
         deo.children(".last-text").text(lastmessage);
      }
      else{
        i_span++;
        deo.children('.mui-badge').text(i_span);
        deo.children(".left-list-time").text(sendtime);
        deo.children(".last-text").text(lastmessage);
      }
    }
    else{
      	$(".left-chat-div").append($("<div class='mui-table-view-cell' data-id='"+message.cid+"' data-name='"+message.from+"'>"+"<span class='mui-icon mui-icon-contact'>"+message.from+"</span>"+"<span class='left-list-time'>"+sendtime+"</span>"+"<div class='last-text'>"+lastmessage+"</div>"+"<span class='mui-badge mui-badge-primary'>1</span></div>"));
        deo = $(".mui-table-view-cell[data-name='"+message.from+"']");
    }
    t_up(deo);
  }).on('unreadmessages', function unreadMessagesEventHandler(payload, conversation) {
//      console.log('---------------------------');
//      console.log(payload);
        console.log(conversation);
        var deo = $(".mui-table-view-cell[data-id='"+conversation.id+"']");
        var unreadnum = conversation.unreadMessagesCount;
        if(!isNaN(unreadnum)){
        	//不是数字返回
        	return;
        }
        else if (unreadnum == 0){
        	//为0返回
        	return;
        }
        deo.append("<span class='mui-badge mui-badge-primary'>"+unreadnum+"</span>");//将未读数量角标加到上面去
        deo.click(function(){
        	    deo.children('.mui-badge').remove();//点击相应对话移除角标
        });
        // {
        //   count: 4,
        //   lastMessageId: "UagNXHK0RHqIvM_VB7Injg",
        //   lastMessageTimestamp: [object Date],
        // }
      })
    ;
}).catch(console.error);


function t_up(cla){
  cla.remove();
  $('.mui-table-view').after(cla);
}


$(document).on('click','.mui-table-view-cell',function(event){
	//点击获取聊天记录
	var creat = realtime.createIMClient(name);
	var id = $(this).attr('data-id');
  if (id == $('#user_id').val()) {
  	//判断点击id是否是同一个，只执行一次请求历史记录
    return;
  }
  $('#user_id').val(id);
  $('#user_name').val($(this).attr('data-name'));
	var sender = $(this).attr('data-name');
	$(this).addClass('leftdiv-addclass').siblings().removeClass('leftdiv-addclass');//左侧列表点击背景色
    $(this).children('.mui-badge').remove();//点击相应对话移除角标
	$(".right-chat-div").find("li").remove();//当点击左侧客户移除聊天窗口内容
	$(".sender").text(sender);//发信人名字显示在上方
    creat.then(function(tom) {
	//获取历史记录
    var query = tom.getQuery();//查询方法
    return query.limit(1).containsMembers([name]).find();
}).then(function(conversations) {
    conversations.map(function(conversation) {
    	//获取全部的对话详情
//  	console.log(conversation.members);
    	creat.then(function(tom) {
    		var CONVERSATION_ID = id;
	   	    tom.getConversation(CONVERSATION_ID).then(function(conversation) {
	   	    	conversation.markAsRead().then(function(conversation) {
                    //点击对话已标记为已读'
                }).catch(console.error.bind(console));
	   	    	//查询相应对话id的聊天记录
//          console.log(conversation);
            conversation.queryMessages({
            	//选出聊天记录并限制条数
                limit: 20, // limit 取值范围 1~1000，默认 20
            }).then(function(messages) {
            	//取聊天具体内容
	           // console.log(messages);
	            for(var i=0; i<messages.length; i++){
	            	//循环遍历返回值
//	            	console.log(messages[i].timestamp);//时间戳
	                var todate = messages[i].timestamp;
	                var year = todate.getFullYear();//获取年
	                var month = todate.getMonth()+1;//获取月
	                var dat = todate.getDate();//获取日
	                var today = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
	                var week = today[todate.getDay()]; //将阿拉伯数字转成汉字星期几
	                var huors = todate.getHours() < 10 ? "0" + todate.getHours() : todate.getHours();//获取小时数
	                var minutes = todate.getMinutes() < 10 ? "0" + todate.getMinutes() : todate.getMinutes();//获取分钟数
	                var seconds = todate.getSeconds() < 10 ? "0" + todate.getSeconds() : todate.getSeconds();//获取秒数
//	                var foot = "<span>"+"日期:  "+"</span>";
//	                console.log(month+"月"+dat+"日"+week+huors+":"+minutes+":"+seconds);
//	                $('.footer').append(foot,year+"年"+month+"月"+dat+"日"+week+huors+minutes+seconds);
                    var messfrom = messages[i].from;//发信人
                    var messtxt = messages[i]._lctext;//聊天历史内容
                    var sendtime = month+"月"+dat+"日"+huors+":"+minutes+":"+seconds;//历史消息时间
                    if(messfrom != name){
                    	$(".right-chat-div").append("<li class='left-get-time'><span>"+sendtime+"</span></li>"+"<li class='left-get-chat'>"+"<span class='get-txt'>"+messtxt+"</span>"+"</li>");//将客户历史的会话显示在div中
                    	$('.right-chat-div').scrollTop( $('.right-chat-div')[0].scrollHeight );//使滚动条始终在最下端，显示最后的消息
                    }else{
                     	$(".right-chat-div").append("<li class='right-send-time'><span>"+sendtime+"</span></li>"+"<li class='right-send-chat'>"+"<span class='send-txt'>"+messtxt+"</span>"+"</li>");//将客服历史的会话显示在div中
                     	$('.right-chat-div').scrollTop( $('.right-chat-div')[0].scrollHeight );//使滚动条始终在最下端，显示最后的消息
                    }
	           }
               // 最新的十条消息，按时间增序排列
            }).then(function(zt){
            	    $('.right-chat-div').find('p').remove();
            })
        })
      })
   	});
   }).catch(console.error);
   event.preventDefault(); //阻止冒泡
})

//实时监控网络状态，断网提示并重连
realtime.on('disconnect', function() {
  mui.toast('网络连接已断开');
});
realtime.on('reconnect', function() {
  mui.toast('网络连接已恢复');
});