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
setTimeout(function(){
  window.location.reload()
}, 30000);

/***********************************sticky*********************** */
let currentPage = "test";
localStorage.clear();
const notesContainer = document.getElementById("app4");
const addNoteButton = notesContainer.querySelector(".add-note4");

function database()
{
  temp=[]
  fetch('http://127.0.0.1:8000/read',{method:'POST',body:currentPage})
  .then(results=>results.json())
  .then(data=>{
    len=data.length
    for(i=0;i<len;i++)
    {
      const noteElement = createNoteElement(data[i].id, data[i].content);
      notesContainer.insertBefore(noteElement, addNoteButton);
      temp.push({id:data[i].id,content:data[i].content});
    }
    localStorage.setItem("stickynotes-notes", JSON.stringify(temp))
  })
}
database();
getNotes().forEach((note) => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.insertBefore(noteElement, addNoteButton);
});
addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
  return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}
function saveNotes(notes) {
  data={
    "note":notes,
    "stage":currentPage
  }
  fetch('http://127.0.0.1:8000/add',{method:'POST',body:JSON.stringify(data)})
  .then(results=>results.json())
  localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
  const element = document.createElement("textarea");

  element.classList.add("note");
  element.value = content;
  element.placeholder = "Empty Sticky Note";

  element.addEventListener("change", () => {
    updateNote(id, element.value);
  });

  element.addEventListener("dblclick", () => {
    const doDelete = confirm(
      "Are you sure you wish to delete this sticky note?"
    );

    if (doDelete) {
      fetch('http://127.0.0.1:8000/delete',{method:'POST',body:id})
      deleteNote(id, element);
    }
  });

  return element;
}

function addNote() {
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: ""
  };
  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.insertBefore(noteElement, addNoteButton);
  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id == id)[0];
  targetNote.content = newContent;
  saveNotes(notes);
}

function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id != id);

  saveNotes(notes);
  notesContainer.removeChild(element);
}