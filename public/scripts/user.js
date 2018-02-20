var overlay, submit, containerBtns;
var cacheMyData = null;
var cacheAllData = null;

window.onload = function(){
  fetch('/who', {
    method: "GET",
    credentials: "include"      //Send with cookie so server knows we are a authenticated user
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data);
    document.getElementById("display-name").innerHTML = data.name;
  });
  
  overlay = document.getElementsByClassName("overlay")[0];
  containerBtns = document.getElementById("containerBtns");
  // console.log(containerBtns.children);
 
  
//   Submit form to server
  submit = document.getElementById("create-form");
  submit.addEventListener("submit", function ( event ) {
    event.preventDefault();
    
    var list = event.target.elements;
    var data = [list[0].value, []], obj = {};
    for(var i = 1; i < list.length-1;i++){
      data[1].push(list[i].value);
      // obj[i] = 0;
    }
    // data[2].push(obj);
    // console.log(data);
    fetch('/create', {
      body: JSON.stringify(data),
      method: "POST",
      headers: {'Content-Type':'application/json'},
      credentials: "include"      //Send with cookie so server knows we are a authenticated user
    }).then(function(response) {
      return response;
    }).then(function(response) {
      if(response.status === 500){
        alert("A poll with the same question has already been created, try another question!");
      } else {
        document.getElementById("x").click();
      }
    }).catch(function(error) {
        console.log("error" + error);
    });
  });
  // alert(submit);
    // event.preventDefault();
}



function createPoll(event){
  document.getElementById("form").style.display = "block";
  var form = document.getElementById("create-form");
  form.reset();
}

function myPoll () {
  var data = {name: document.getElementById("display-name").innerHTML};
  fetch('/mypoll', {
      body: JSON.stringify(data),
      method: "POST",
      headers: {'Content-Type':'application/json'}
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    var content = document.getElementById("content");
    content.innerHTML = "";
    var element, link, id;
    cacheMyData = data;
    for(var i = 0; i < data.length; i++){
      // element = document.createElement("a");
      // element.setAttribute("href", "/poll/" + data[i]._id);
      // element.innerHTML = data[i].poll[0];
      // content.appendChild(element);
      element = document.createElement("div");
      element.setAttribute("id", data[i]._id);
      element.setAttribute("onclick", "getPoll(this)");
      element.innerHTML = data[i].poll[0];
      content.appendChild(element);
    }
  });
}

function getPoll(event){
   fetch('/poll/'+event.id, {
        method: "GET",
        redirect: 'follow'
    }).then(response => { 
      console.log(response);
     window.location = response.url;
    }).catch(function(err) {
      console.log(err + " url: " + event.id);
    });
}

function allPolls () {
  fetch('/allpolls', {
        method: "GET"
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      var content = document.getElementById("content");
      content.innerHTML = "";
      var element;
      // cacheMyData = data;
      for(var i = 0; i < data.length; i++){
        element = document.createElement("div");
        element.setAttribute("id", data[i]._id);
        element.setAttribute("onclick", "getPoll(this)");
        element.innerHTML = data[i].poll[0];
        content.appendChild(element);
      }
    });
}

function buttonPressed(event) {
  event.preventDefault;
  var which = event.innerHTML;
  console.log(which);
  var form = document.getElementById("form-content");
  var length = form.childNodes.length-2;    // There seems to be "    " Text objects
  if(which === "+"){
    var inputElement = document.createElement("INPUT");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", "choice"+length);
    inputElement.setAttribute("id", "choice"+length);
    inputElement.setAttribute("placeholder", "Choice "+length);
    inputElement.setAttribute("class", "form-input createinput");
    form.appendChild(inputElement);
  } else if(which === "-" && length !== 1) {   //Make sure the user can't remove "nothing"
    console.log(form.lastElementChild);
    form.removeChild(form.lastElementChild);
  } else if(which === "X"){
    document.getElementById("form").style.display = "none";
  } else {
    alert("You can't remove something that doesn't exists!"); 
  }
}
