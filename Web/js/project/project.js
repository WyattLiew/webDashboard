
// Get a database reference to projects
var db = firebase.database();
var newProjectRef = db.ref("Projects");
var newProgressRef = db.ref("Projects Add On");
var progressAddonImages = db.ref("Project add on image");
var newClientRef = db.ref("Clients");
var UID;

//pagination
var list = [];
var currentDevice =1;
var activePage = 1;
var devicesPerPage = 20;
var indexOfLastDevice = currentDevice * devicesPerPage;
var indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

 var PageNumbers = [];
 var active = activePage;

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    UID = firebase.auth().currentUser.uid;
    
    fetchProjects(UID);
	}else{
		window.location='index.html';
	}
});


//document.getElementById('formBtn').addEventListener('click',showForm);
//var Textinput = document.getElementById('projForm');

// function showForm(e){
// 	if (Textinput.style.display === "none") {
// 	Textinput.style.display="block";
// 	}else{
// 		Textinput.style.display="none";
// 	}
// }

document.getElementById('projectInputForm').addEventListener('submit',saveProject);
projSubmitProgress = document.getElementById("submitProgress");
projAddBtn = document.getElementById("add-btn");

function saveProject(e){
	var projTitle = document.getElementById('projectTitleInput').value;
	// var projDesc = document.getElementById('projectDescInput').value;
	var projCliName = document.getElementById('projectCliNameInput').value;
	var projCliNum = document.getElementById('projectCliNumInput').value;
	var projCliEmail = document.getElementById('projectCliEmailInput').value;
	var projLocation = document.getElementById('projectLocationInput').value;
	var projDate = document.getElementById('projectDateInput').value;
	// var projNotes = document.getElementById('projectNotesInput').value;
	var projectId = newProjectRef.push().key;
	var clientId = newClientRef.push().key;

	var project = {
		clientID: clientId,
		date: projDate,
		// description: projDesc,
		email: projCliEmail,
		id: projectId,
		location: projLocation,
		name: projCliName,
		// notes: projNotes,
		number: projCliNum,
		title: projTitle
	}

	var client = {
		email: projCliEmail,
		id: clientId,
		location: projLocation,
		name: projCliName,
		number: projCliNum
	}

	e.preventDefault();

	if (projTitle !="" && projTitle.length >1 && 
		projCliName.length >1 && projCliName !="" && 
		projCliNum !="" && projCliEmail !="" &&
		projLocation !="" && projDate !="") {
		// Show progress
		//projSubmitProgress.style.display="inline-block";
		//projAddBtn.style.display="none";

		// save data to firebase
		newProjectRef.child(UID).child(projectId).set(project,function(error) {
			if (error) {
				alert("Error!:" +error);
			} else {
				// Reset field
				document.getElementById('projectInputForm').reset();
				// retrieve data
				fetchProjects(UID);
				//alert("Save Successfully!");
				var projAlert = document.getElementById("proj-green-alert1");
				projAlert.classList.remove("hidden");
				//projSubmitProgress.style.display="none";
				//projAddBtn.style.display="inline-block";
			}
		});
		// save client details to firebase
		newClientRef.child(clientId).set(client);
	} 
}

function fetchProjects(UID){
	firebase.database().ref('/Projects/' + UID).once('value').then(function(snapshot){
    var projectObject = snapshot.val();
	var projectList = document.getElementById('projectList');
	var progressPagination = document.getElementById('progressPagination');

	list =[];
	PageNumbers=[];
	progressPagination.innerHTML = "";
	projectList.innerHTML = '';
	if (projectObject){
    var keys = Object.keys(projectObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = projectObject[keys[i]];
      var projectID = currentObject.id;
      

      var info = {
      	projectID:currentObject.id,
		clientId:currentObject.clientID,
      projectTitleEdit:projectID+currentObject.title,
      // var projectDescEdit = projectID+currentObject.description+"1";
      projectCliNameEdit:projectID+currentObject.name,
      projectCliNumEdit:projectID+currentObject.number,
      projectCliEmailEdit:projectID+currentObject.email,
      projectLocationEdit:projectID+currentObject.location,
      projectDateEdit:projectID+currentObject.date,
      // var projectNotesEdit = projectID+currentObject.notes+"1";
      	name:currentObject.name,
      	number:currentObject.number,
      	email:currentObject.email,
      	date:currentObject.date,
      	location:currentObject.location,
      	title:currentObject.title
	};

       list.push(info);
    }

    var listslice = list.slice(
     	 indexOfFirstDevice,
      indexOfLastDevice
     	);
    listslice.map(function(item,index) {
    	projectList.innerHTML +='<div class="col-md-4">' +
    							'<div class="well box-style-2" id="\''+item.projectID+'\'">'+
								'<h6>Project ID: ' + item.projectID + '</h6>' +
								'<h3>' + '<input id="\''+item.projectTitleEdit+'\'" value="'+item.title+'"  class="text-capitalize title-size" readonly required>' + '</h3>'+
								'<input id="\''+item.projectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
								'<br></br>' +
								'<div>'+
								'<p>'+
								'<a data-toggle="collapse" href="'+"#"+item.projectID+item.projectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
								'</p>'+
								'<div class="collapse" id="'+item.projectID+item.projectID+'">'+
  								'<div class="card card-body">'+
  								'<span class="glyphicon glyphicon-user"></span>' + " " +''+
  								'<input id="\''+item.projectCliNameEdit+'\'" value="'+item.name+'"  readonly required>'+
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-earphone"></span>' + " " +''+
  								'<input id="\''+item.projectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required>'+
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-envelope"></span>' + " " +''+
  								'<input id="\''+item.projectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</span>" +
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-flag"></span>' + " " +''+
  								'<input id="\''+item.projectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</span>' +
  								'<br></br>' +
  								'</div>'+
								'</div>'+
								'</div>'+
								'<a href="#" onclick="enterProject(\''+item.projectID+'\',\''+item.title+'\')" class="a btn btn-success">Enter</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+item.projectID+'\', \''+item.clientId+'\',\''+item.projectTitleEdit+'\',\''+item.projectCliNameEdit+'\',\''+item.projectCliNumEdit+'\',\''+item.projectCliEmailEdit+'\',\''+item.projectLocationEdit+'\',\''+item.projectDateEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+item.projectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="b btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProject(\''+item.projectID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+item.projectID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';
   	});


    // pagination
    for (let i = 1; i <= Math.ceil(list.length / devicesPerPage); i++) {
    PageNumbers.push(i);
  }

	PageNumbers.map(function(item,index){
		progressPagination.innerHTML += 
      '<li class="page-item" id="\''+item+'\'"><a class="page-link" href="#" onclick="pagination(\''+item+'\',\''+PageNumbers.length+'\')">'+item+'</a></li>';
	});

	var active = document.getElementById('\''+1+'\'');
	active.classList.add("active");

    }else {
		projectList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no project yet.' +
								'<a class="btn btn-link" data-toggle="modal" data-target="#addProject">Create one</a></h4>' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function deleteProject(projId) {
	var UID = firebase.auth().currentUser.uid;
	var result = confirm("Are you sure to delete this item?\nYou will not be able to recover this information!");
	if (result) {
    //Logic to delete the item
    newProjectRef.child(UID).child(projId).remove()
  		.then(function() {
  		// Remove image add on
  		newProgressRef.child(projId).remove();
  		//progressAddonImages.child(progressId).remove();

    	//alert("Remove succeeded.");
    	var projAlert = document.getElementById("proj-green-alert2");
		projAlert.classList.remove("hidden");
    	fetchProjects(UID);
  	})
  		.catch(function(error) {
    	console.log("Remove failed: " + error.message);
  	});
	}

}

function editProject(projId) {
	var form = document.getElementById('\''+projId+'\'');

	var client = document.getElementById(`${projId+projId}`);
	client.classList.add("in");

	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=false;
	}
	form.classList.add("invert");
}

function cancelEdit(projId) {
	var form = document.getElementById('\''+projId+'\'');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
	fetchProjects(UID);
}

function saveEdit(projId,clientId,projectTitleEdit,projectCliNameEdit,projectCliNumEdit,projectCliEmailEdit,
	projectLocationEdit,projectDateEdit) {
	var UID = firebase.auth().currentUser.uid;
	var form = document.getElementById('\''+projId+'\'');
	var projTitle = document.getElementById('\''+projectTitleEdit+'\'').value;
	// var projDesc = document.getElementById('\''+projectDescEdit+'\'').value;
	var projCliName = document.getElementById('\''+projectCliNameEdit+'\'').value;
	var projCliNum = document.getElementById('\''+projectCliNumEdit+'\'').value;
	var projCliEmail = document.getElementById('\''+projectCliEmailEdit+'\'').value;
	var projLocation = document.getElementById('\''+projectLocationEdit+'\'').value;
	var projDate = document.getElementById('\''+projectDateEdit+'\'').value;
	// var projNotes = document.getElementById('\''+projectNotesEdit+'\'').value;


	var project = {
		clientID: clientId,
		date: projDate,
		// description: projDesc,
		email: projCliEmail,
		id: projId,
		location: projLocation,
		name: projCliName,
		// notes: projNotes,
		number: projCliNum,
		title: projTitle
	}

	var client = {
		email: projCliEmail,
		id: clientId,
		location: projLocation,
		name: projCliName,
		number: projCliNum
	}

	

	if (projTitle !="" && projCliName !="" && 
		projCliNum !="" && projCliEmail !="" &&
		projLocation !="" && projDate !="") {

		var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(reg.test(projCliEmail) == false) {
			alert('Invalid email address');
			projCliEmail.focus();
			return false;
		}else {
			// save data to firebase
			newProjectRef.child(UID).child(projId).set(project,function(error) {
			if (error) {
				alert("Error!");
			} else {
				// retrieve data
				fetchProjects(UID);
				var projAlert = document.getElementById("proj-green-alert3");
				projAlert.classList.remove("hidden");
			}
		});
			// save client details to firebase
			newClientRef.child(clientId).set(client);

		}
	}
}

function enterProject(projId,projTitle) {
	var value1 = projId;
	var value2 = projTitle;

  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "progressList.html";

    
}


function pagination(number,totalPage) {
	//change page number
	currentDevice = number;
	activePage = number;

for (var i = 1; i <= totalPage; i++) {
	if(i==number){
	var active = document.getElementById('\''+number+'\'');
	active.classList.add("active");
	}else {
 	var active = document.getElementById('\''+i+'\'');
	active.classList.remove("active");
	}
}

	//clear html
	projectList.innerHTML ='';

	//calculate page
	indexOfLastDevice = currentDevice * devicesPerPage;
	indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

	//re-run html
	var listslice = list.slice(
     	indexOfFirstDevice,
      	indexOfLastDevice
     	);

    listslice.map(function(item,index) {
projectList.innerHTML +='<div class="col-md-4">' +
    							'<div class="well box-style-2" id="\''+item.projectID+'\'">'+
								'<h6>Project ID: ' + item.projectID + '</h6>' +
								'<h3>' + '<input id="\''+item.projectTitleEdit+'\'" value="'+item.title+'"  class="text-capitalize title-size" readonly required>' + '</h3>'+
								'<input id="\''+item.projectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
								'<br></br>' +
								'<div>'+
								'<p>'+
								'<a data-toggle="collapse" href="'+"#"+item.projectID+item.projectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
								'</p>'+
								'<div class="collapse" id="'+item.projectID+item.projectID+'">'+
  								'<div class="card card-body">'+
  								'<span class="glyphicon glyphicon-user"></span>' + " " +''+
  								'<input id="\''+item.projectCliNameEdit+'\'" value="'+item.name+'"  readonly required>'+
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-earphone"></span>' + " " +''+
  								'<input id="\''+item.projectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required>'+
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-envelope"></span>' + " " +''+
  								'<input id="\''+item.projectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</span>" +
  								'<br></br>' +
  								'<span class="glyphicon glyphicon-flag"></span>' + " " +''+
  								'<input id="\''+item.projectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</span>' +
  								'<br></br>' +
  								'</div>'+
								'</div>'+
								'</div>'+
								'<a href="#" onclick="enterProject(\''+item.projectID+'\',\''+item.title+'\')" class="a btn btn-success">Enter</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+item.projectID+'\', \''+item.clientId+'\',\''+item.projectTitleEdit+'\',\''+item.projectCliNameEdit+'\',\''+item.projectCliNumEdit+'\',\''+item.projectCliEmailEdit+'\',\''+item.projectLocationEdit+'\',\''+item.projectDateEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+item.projectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="b btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProject(\''+item.projectID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+item.projectID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';   	});

}