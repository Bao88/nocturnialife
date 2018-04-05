window.onload = function(){

//   Submit form to server
  let submit = document.getElementById("searchForm");
  let content = document.getElementById("content");
  submit.addEventListener("submit", function ( event ) {
    event.preventDefault();
    
    var query = event.target.elements[0].value;
    if(query){
      fetch("/search", {
        body: JSON.stringify({"location": query}),
        method: "POST",
        credentials: "include",
          headers: {'Content-Type':'application/json'}
      }).then( function ( response ) {
        return response.json();
      }).then( function (data){
        if(data.err){
          console.log(data);
        } else {
          
          let local = data.response.groups[0].items;
          // let local = data.response;
          console.log(local);
          let element = "";
          
          for(let i = 0; i < local.length; i++){
            element = addPlace(local[i]); 
            content.innerHTML += element;
          }
        }
      });
    }
    
    this.reset();
  });
    
  // alert(submit);
    // event.preventDefault();
}

// Experimenting using innerHTML and string to create and add new objects to the DOM
function addPlace(placeInfo){
  let photo = placeInfo.venue.photos.groups[0].items[0];
  let reason = placeInfo.tips[0].text;
  let structure = "<div class='contentElement'>";
  structure += "<a target='_blank' href='" + placeInfo.venue.url + "'><h1>" + placeInfo.venue.name + "</h1></a>";
  structure += "<img src='" + photo.prefix + 100 + photo.suffix + "' alt='Photo bar' height='100' width='100'>";
  structure += "<div>" + reason + "</div>";
  structure += "</div>";
  return structure;
}
