window.onload = function(){
  var object = JSON.parse(document.getElementById("object").innerHTML);
  fetch('/who', {
    method: "GET",
    credentials: "include"      //Send with cookie so server knows we are a authenticated user
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data.name);
    console.log(object.username);
    document.getElementById("display-name").innerHTML = data.name;
    if(data.name === "Guest" || data.name !== object.username) document.getElementsByClassName("intro-container")[0].style.display = "none";
    else {
      var button = document.createElement("button");
      button.setAttribute("class", "btn create");
      button.setAttribute("onclick", "createPoll(this)");
      button.innerHTML = "Modify Poll";
      document.body.appendChild(button);

      createForm(object);
      
      var button = document.createElement("button");
      button.setAttribute("class", "btn delete");
      button.setAttribute("onclick", "removePoll(this)");
      button.innerHTML = "Remove Poll";
      document.getElementsByClassName("intro-container")[0].appendChild(button);
      
       //   Submit the modified form to server
      var submit = document.getElementById("create-form");
      submit.addEventListener("submit", function ( event ) {
        event.preventDefault();

        var list = event.target.elements;
        var data = [list[0].value, []], obj = {};
        
        for(var i = 1; i < list.length-1;i++){
          data[1].push(list[i].value);
        }
        
        obj.id = object._id;
        obj.question = list[0].value;
        obj.options = data[1];

        fetch('/modifypoll', {
          body: JSON.stringify(obj),
          method: "POST",
          headers: {'Content-Type':'application/json'},
          credentials: "include"      //Send with cookie so server knows we are a authenticated user
        }).then(function(response) {
          return response.json();
        }).then(function(response) {
          if(response.status === 500){
            alert("Error!");
          } else {
            location.reload();
          }
        }).catch(function(error) {
            console.log("error" + error);
        });
      });
    }
  });
  
  createFormPoll(object);
  createChart(object);
  
//   Submit answer to server
  var form = document.getElementById("poll-form");
  form.addEventListener("submit", function ( event ) {
    event.preventDefault();
    var list = event.target.elements;
    var index = -1;
    
//     Atleast 1 option have to be selected
    for(var i = 0; i < list.length;i++){
      if(list[i].checked === true){
       index = i; 
      }
    }
    
    if(index === -1){
     alert("Choose one option, then retry!"); 
    } else {
      fetch('/updatepoll', {
        body: JSON.stringify({id: object._id, index: index}),
        method: "POST",
        headers: {'Content-Type':'application/json'},
        credentials: "include"      //Send with cookie so server knows we are a authenticated user
      }).then(function(response) {
        if(response.status === 201) return null;
        return response.json();
      }).then(function(response) {
        if(response === null){
          alert("Only 1 votes from each user/ip address is possible!");
        } else {
          // console.log(response);
          createChart(response);
        }
      }).catch(function(error) {
          console.log("error" + error);
      });
    }
  });
}


function removePoll(event){
  var object = JSON.parse(document.getElementById("object").innerHTML);
   fetch('/removepoll', {
        body: JSON.stringify({id: object._id}),
        method: "POST",
        headers: {'Content-Type':'application/json'},
        credentials: "include"      //Send with cookie so server knows we are a authenticated user
      }).then(function(response) {
        if(response.status === 201) return null;
        return response.json();
      }).then(function(response) {
        if(response === null){
          alert("Can't remove the poll!");
        } else {
          window.location.replace('https://votenex.glitch.me/');
        }
      }).catch(function(error) {
          console.log("error" + error);
    });
}

function createOptions(object){
  var form = document.document.getElementById("form");
  var label, input, span;
  for(var i = 0; i < object.poll[1].length; i++) {
    label = document.createElement("label");

    input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "select");
    input.setAttribute("value", object.poll[1][i]);
    
    span = document.createElement("span");
    span.innerHTML = object.poll[1][i];
    
    label.appendChild(input);
    label.appendChild(span);
    form.appendChild(label);
  }  
}


function createFormPoll(object){
  var poll = document.getElementById("poll");

  var label, input, span, header, submit;
  var form = document.createElement("form");
  form.setAttribute("id", "poll-form");
  form.setAttribute("action", "/updatepoll");
  form.setAttribute("method", "POST");
  for(var i = 0; i < object.poll[1].length; i++) {
    label = document.createElement("label");

    input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "select");
    input.setAttribute("value", object.poll[1][i]);
    
    span = document.createElement("span");
    span.innerHTML = object.poll[1][i];
    
    label.appendChild(input);
    label.appendChild(span);
    form.appendChild(label);
  }
  header = document.createElement("h1");
  header.innerHTML = object.poll[0];
  
  submit = document.createElement("input");
  submit.setAttribute("id", "submit");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "Submit");
  
  form.appendChild(submit);
  poll.appendChild(header);
  poll.appendChild(form); 
}

function createForm(data){
  var form = document.createElement("div");
  form.setAttribute("id", "form");
  console.log(data);  
  var options = "";
  for(var i = 0; i < data.poll[1].length; i++){
    options += '<input class="form-input createinput" type="text" name="choice1' +i+1+ '" id="choice' +i+1+ '" placeholder="Choice ' +i+1+ '" required="" value="' +data.poll[1][i]+ '">'
  }
  var html = `
    <div class="center">
      <h1>Modify Poll</h1>
       <button id="x" class="create-btn" onclick="buttonPressed(this)">X</button>
       <div id="interact-btns">
        <button id="remove" class="create-btn" onclick="buttonPressed(this)">-</button>
        <button id="add" class="create-btn" onclick="buttonPressed(this)">+</button>
      </div>
      <form id="create-form" action="/updatepoll" method="post">
        <input class="form-input createinput" style="height: 30px; background: rgba(0, 0, 0, 0.3);"  type="text" name="question" placeholder="What is your question?" required="" value="` + data.poll[0] + `" disabled>
        <div id="form-content">`+options+`
          
        </div>
        <div>
          <input id="submit" class="form-input" type="submit" value="Modify">
        </div>
      </form>
    `;
    form.innerHTML = html.trim();
    document.body.appendChild(form);
}

// Google chart
function createChart(mydata){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var array = [];
    var votes;
    array.push(["answer", "votes"]);
    for(var i = 0; i < mydata.poll[1].length; i++){
      votes = typeof(mydata.votes[i]) === "undefined" ? 0 : mydata.votes[i];
      array.push([mydata.poll[1][i], votes]);
    }
    
    var data = google.visualization.arrayToDataTable(array);

    var options = {
      title: mydata.poll[0],
       titleTextStyle: {
        fontName: "inherit", // i.e. 'Times New Roman'
        fontSize: "18", // 12, 18 whatever you want (don't specify px)
      },
      legend:{textStyle:{fontSize:'12', fontName: "inherit"}},
      tooltip:{textStyle:{fontSize:'12', fontName:'inherit'}},
      backgroundColor: "transparent"
    };

    var chart = new google.visualization.PieChart(document.getElementById('chart'));
    chart.draw(data, options);
  }
}

function createPoll(event){
  document.getElementById("form").style.display = "block";
  var object = JSON.parse(document.getElementById("object").innerHTML);
  var options = "";
  for(var i = 0; i < object.poll[1].length; i++){
    options += '<input class="form-input createinput" type="text" name="choice1' +i+1+ '" id="choice' +i+1+ '" placeholder="Choice ' +i+1+ '" required="" value="' +object.poll[1][i]+ '">'
  }
  var html = `<input class="form-input createinput" style="height: 30px; background: rgba(0, 0, 0, 0.3);"  type="text" name="question" placeholder="What is your question?" required="" value="` + object.poll[0] + `" disabled>
        <div id="form-content">`+options+`
          
        </div>
        <div>
          <input id="submit" class="form-input" type="submit" value="Modify">
        </div>`;
  
  var form = document.getElementById("create-form");
  form.reset();
  form.innerHTML = html.trim();
}

function buttonPressed(event) {
  event.preventDefault;
  var which = event.innerHTML;
  console.log(which);
  var form = document.getElementById("form-content"), temp;
  var length = form.childNodes.length;    // There seems to be "    " Text objects
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

