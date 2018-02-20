var loginForm, overlay, registerForm;

window.onload = function(){
  loginForm = document.getElementsByClassName("login-form")[0];
  registerForm = document.getElementsByClassName("register-form")[0];
  overlay = document.getElementsByClassName("overlay")[0];
}

document.addEventListener("click", function (event) {
  //click is outside of the forms
  if(!loginForm.contains(event.target) && event.target.innerHTML !== "Login" 
     && !registerForm.contains(event.target) && event.target.innerHTML !== "Register"){
    loginForm.style.display = "none"; 
    overlay.style.display = "none";
    registerForm.style.display = "none";
    for(var i = 0; i < 3; i++) document.getElementsByClassName("btn")[i].style.display = "initial";
  }
});

function buttonPressed(event) {
  var which = event.innerHTML;
  if(which === "Login") loginForm.style.display = "block";
  if(which === "Register") registerForm.style.display = "block";
  for(var i = 0; i < 3; i++) document.getElementsByClassName("btn")[i].style.display = "none";
  overlay.style.display = "block";
  // alert(document.getElementsByClassName("login-form")[0]);
}

