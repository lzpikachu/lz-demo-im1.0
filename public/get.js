var Realtime = AV.Realtime;
var TextMessage = AV.TextMessage;
var realtime = new Realtime({
  appId: 'ymfg02o4PikTPeVdFJnTIyrn-gzGzoHsz',
  region: 'cn', //美国节点为 "us"
});
// Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
// Jerry 登录
realtime.createIMClient('lol').then(function(jerry) {
  jerry.on('message', function(message, conversation) {
    console.log('Message received: ' + message.text);
    var get = $('.get').val(message.text);
  });
}).catch(console.error);

$(".send-btn").click(function(){
	var posttxt = $(".post").val();//获取输入的内容
	// Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
    realtime.createIMClient('test119').then(function(tom) {
        // 创建与Jerry之间的对话
        return tom.createConversation({
        members: ['testkefu'],//发给谁
//      name: 'Tom & Jerry',//谁和谁的对话
        transient: false,
        pinned: true,//置顶
        unique: true,//unique - 是否创建唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话。该值默认为 false。
    });
  }).then(function(conversation) {
  // 发送消息
//  console.log(conversation);
  return conversation.send(new AV.TextMessage(posttxt));//回调函数
  }).then(function(message) {
  	   
  }).catch(console.error);
});