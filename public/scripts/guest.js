var loginForm, overlay, registerForm;

window.onload = function(){
  loginForm = document.getElementsByClassName("login-form")[0];
  registerForm = document.getElementsByClassName("register-form")[0];
  overlay = document.getElementsByClassName("overlay")[0];
  
  fetch('/allpolls', {
        method: "GET"
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      // console.log(data);
      var content = document.getElementById("content");
      content.innerHTML = "";
      var element;
      for(var i = 0; i < data.length; i++){
        element = document.createElement("div");
        element.setAttribute("id", data[i]._id);
        element.setAttribute("onclick", "getPoll(this)");
        element.innerHTML = data[i].poll[0];
        content.appendChild(element);
      }
    });
  // console.log("YOLO");
}

document.addEventListener("click", function (event) {
  //click is outside of the forms
  if(!loginForm.contains(event.target) && event.target.innerHTML !== "Login" 
     && !registerForm.contains(event.target) && event.target.innerHTML !== "Register"){
    loginForm.style.display = "none"; 
    overlay.style.display = "none";
    registerForm.style.display = "none";
    for(var i = 0; i < 2; i++) document.getElementsByClassName("btn")[i].style.display = "initial";
  }
});

function getPoll(event){
   // alert(event.id); 
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

function buttonPressed(event) {
  var which = event.innerHTML;
  if(which === "Login") loginForm.style.display = "block";
  if(which === "Register") registerForm.style.display = "block";
  for(var i = 0; i < 2; i++) document.getElementsByClassName("btn")[i].style.display = "none";
  overlay.style.display = "block";
}

