let currentPaged = "define";
localStorage.clear();
const notesContainerd = document.getElementById("app2");
const addNotedButtond = notesContainerd.querySelector(".add-note2");
function databased()
{
  temp=[]
  fetch('http://127.0.0.1:8000/read',{method:'POST',body:currentPaged})
  .then(results=>results.json())
  .then(data=>{
    len=data.length
    for(i=0;i<len;i++)
    {
      const noteElementd = createNoteElementd(data[i].id, data[i].content);
      notesContainerd.insertBefore(noteElementd, addNotedButtond);
      temp.push({id:data[i].id,content:data[i].content});
    }
    localStorage.setItem("stickynotes-notes", JSON.stringify(temp))
  })
}
databased();
setTimeout(function(){
  window.location.reload()
}, 30000);
getNotesd().forEach((note) => {
  const noteElementd = createNoteElementd(note.id, note.content);
  notesContainerd.insertBefore(noteElementd, addNotedButtond);
});
addNotedButtond.addEventListener("click", () => addNoted());

function getNotesd() {
  return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}
function saveNotesd(notes) {
  data={
    "note":notes,
    "stage":currentPaged
  }
  fetch('http://127.0.0.1:8000/add',{method:'POST',body:JSON.stringify(data)})
  .then(results=>results.json())
  localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElementd(id, content) {
  const element = document.createElement("textarea");

  element.classList.add("note");
  element.value = content;
  element.placeholder = "Empty Sticky Note";

  element.addEventListener("change", () => {
    updateNoted(id, element.value);
  });

  element.addEventListener("dblclick", () => {
    const doDelete = confirm(
      "Are you sure you wish to delete this sticky note?"
    );

    if (doDelete) {
      fetch('http://127.0.0.1:8000/delete',{method:'POST',body:id})
      deleteNoted(id, element);
    }
  });

  return element;
}

function addNoted() {
  const notes = getNotesd();
  const noteObject = {
    id: Math.floor(Math.random() * 1000000),
    content: ""
  };
  const noteElementd = createNoteElementd(noteObject.id, noteObject.content);
  notesContainerd.insertBefore(noteElementd, addNotedButtond);
  notes.push(noteObject);
  saveNotesd(notes);
}

function updateNoted(id, newContent) {
  const notes = getNotesd();
  const targetNote = notes.filter((note) => note.id == id)[0];
  targetNote.content = newContent;
  saveNotesd(notes);
}

function deleteNoted(id, element) {
  const notes = getNotesd().filter((note) => note.id != id);

  saveNotesd(notes);
  notesContainerd.removeChild(element);
}
/**********************************chat**************************** */
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