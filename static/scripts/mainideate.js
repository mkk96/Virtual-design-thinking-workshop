let currentPage2 = "ideate";
localStorage.clear();
const notesContainer2 = document.getElementById("app3");
const addNote2Button2 = notesContainer2.querySelector(".add-note3");
function database2()
{
  temp=[]
  fetch('http://127.0.0.1:8000/read',{method:'POST',body:currentPage2})
  .then(results=>results.json())
  .then(data=>{
    len=data.length
    for(i=0;i<len;i++)
    {
      const noteElement2 = createnoteElement2(data[i].id, data[i].content);
      notesContainer2.insertBefore(noteElement2, addNote2Button2);
      temp.push({id:data[i].id,content:data[i].content});
    }
    localStorage.setItem("stickynotes-notes", JSON.stringify(temp))
  })
}
database2();
setTimeout(function(){
    window.location.reload()
}, 30000);
getNotes2().forEach((note) => {
  const noteElement2 = createnoteElement2(note.id, note.content);
  notesContainer2.insertBefore(noteElement2, addNote2Button2);
});
addNote2Button2.addEventListener("click", () => addNote2());

function getNotes2() {
  return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}
function saveNotes1(notes) {
  data={
    "note":notes,
    "stage":currentPage2
  }
  fetch('http://127.0.0.1:8000/add',{method:'POST',body:JSON.stringify(data)})
  .then(results=>results.json())
  localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createnoteElement2(id, content) {
  const element = document.createElement("textarea");

  element.classList.add("note");
  element.value = content;
  element.placeholder = "Empty Sticky Note";

  element.addEventListener("change", () => {
    updateNote2(id, element.value);
  });

  element.addEventListener("dblclick", () => {
    const doDelete = confirm(
      "Are you sure you wish to delete this sticky note?"
    );

    if (doDelete) {
      fetch('http://127.0.0.1:8000/delete',{method:'POST',body:id})
      deleteNote2(id, element);
    }
  });

  return element;
}

function addNote2() {
  const notes = getNotes2();
  const noteObject = {
    id: Math.floor(Math.random() * 10000000),
    content: ""
  };
  const noteElement2 = createnoteElement2(noteObject.id, noteObject.content);
  notesContainer2.insertBefore(noteElement2, addNote2Button2);
  notes.push(noteObject);
  saveNotes1(notes);
}

function updateNote2(id, newContent) {
  const notes = getNotes2();
  const targetNote = notes.filter((note) => note.id == id)[0];
  targetNote.content = newContent;
  saveNotes1(notes);
}

function deleteNote2(id, element) {
  const notes = getNotes2().filter((note) => note.id != id);

  saveNotes1(notes);
  notesContainer2.removeChild(element);
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