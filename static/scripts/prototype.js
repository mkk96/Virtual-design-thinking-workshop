function proffun(parameter) 
{
    var data=JSON.parse(parameter)
    var len=data["data"].length
    string=""
    for(i=0;i<len;i++)
    {
      string+=data["data"][i]["chat"]+"\n"
    }
    document.getElementById("chat").innerHTML = string;
}
var socket;
$(document).ready(function(){
  socket = io.connect('http://' + '127.0.0.1' + ':' + 8000);

  socket.on('status', function(data) {
    $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
  });
  
  socket.on('message', function(data) {
    $('#chat').val($('#chat').val() + data.msg + '\n');
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
  });

  $('#send').click(function(e) {
    console.log("Chat called")
    text = $('#text').val();
    //$('#text').val('');
    //console.log("text:"+text);
    socket.emit('text', {msg: text});
  });
});
/*setTimeout(function(){
  window.location.reload()
}, 30000);*/