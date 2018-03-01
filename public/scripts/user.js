var overlay, submit, containerBtns;
var cacheMyData = null;
var cacheAllData = null;

window.onload = function(){
//   Submit form to server
  let submit = document.getElementById("search-form");
  submit.addEventListener("submit", function ( event ) {
    event.preventDefault();
    
    let list = event.target.elements;
    let obj = {search: list[0].value};

    fetch('/search', {
      body: JSON.stringify(obj),
      method: "POST",
      headers: {'Content-Type':'application/json'},
      credentials: "include"      //Send with cookie so server knows we are a authenticated user
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      if(response.status === 500){
        alert("Searching failed!");
      } else {
        alert(response.ok);
      }
    }).catch(function(error) {
        console.log("error" + error);
    });
  });
}
