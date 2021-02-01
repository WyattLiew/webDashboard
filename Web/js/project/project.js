
// Get a database reference to projects
var db = firebase.database();
var newProjectRef = db.ref("Projects");
var newProgressRef = db.ref("Projects Add On");
var progressAddonImages = db.ref("Project add on image");
var newClientRef = db.ref("Clients");
var UID;

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
	var projDesc = document.getElementById('projectDescInput').value;
	var projCliName = document.getElementById('projectCliNameInput').value;
	var projCliNum = document.getElementById('projectCliNumInput').value;
	var projCliEmail = document.getElementById('projectCliEmailInput').value;
	var projLocation = document.getElementById('projectLocationInput').value;
	var projDate = document.getElementById('projectDateInput').value;
	var projNotes = document.getElementById('projectNotesInput').value;
	var projectId = newProjectRef.push().key;
	var clientId = newClientRef.push().key;

	var project = {
		clientID: clientId,
		date: projDate,
		description: projDesc,
		email: projCliEmail,
		id: projectId,
		location: projLocation,
		name: projCliName,
		notes: projNotes,
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
	projectList.innerHTML = '';
	if (projectObject){
    var keys = Object.keys(projectObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = projectObject[keys[i]];
      var projectID = currentObject.id;
      var clientId = currentObject.clientID;
      var projectTitleEdit = projectID+currentObject.title;
      var projectDescEdit = projectID+currentObject.description+"1";
      var projectCliNameEdit = projectID+currentObject.name;
      var projectCliNumEdit = projectID+currentObject.number;
      var projectCliEmailEdit = projectID+currentObject.email;
      var projectLocationEdit = projectID+currentObject.location;
      var projectDateEdit = projectID+currentObject.date;
      var projectNotesEdit = projectID+currentObject.notes+"1";

    projectList.innerHTML +='<div class="col-md-6">' +
    							'<div class="well box-style-2" id="\''+projectID+'\'">'+
								'<h6>Project ID: ' + currentObject.id + '</h6>' +
								'<h3>' + '<input id="\''+projectTitleEdit+'\'" value="'+currentObject.title+'"  class="text-capitalize title-size" readonly required>' + '</h3>'+
								'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-12">'+" "+ '<input id="\''+projectDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-user col-md-12">'+ " " +'<input id="\''+projectCliNameEdit+'\'" value="'+currentObject.name+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-earphone col-md-12">' + " " +'<input id="\''+projectCliNumEdit+'\'" type="number" value="'+currentObject.number+'" readonly required>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-envelope col-md-12">' + " " +'<input id="\''+projectCliEmailEdit+'\'" type="email" value="'+currentObject.email+'"  readonly required>' + "</span>" +
								'<br></br>' +
								'<span class="glyphicon glyphicon-flag col-md-12">' + " " +'<input id="\''+projectLocationEdit+'\'" value="'+currentObject.location+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-12">' + " " +'<input id="\''+projectNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="enterProject(\''+projectID+'\',\''+currentObject.title+'\')" class="a btn btn-success">Enter</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+projectID+'\', \''+clientId+'\',\''+projectTitleEdit+'\',\''+projectDescEdit+'\',\''+projectCliNameEdit+'\',\''+projectCliNumEdit+'\',\''+projectCliEmailEdit+'\',\''+projectLocationEdit+'\',\''+projectDateEdit+'\',\''+projectNotesEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+projectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProject(\''+projectID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+projectID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';
    }
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

function saveEdit(projId,clientId,projectTitleEdit,projectDescEdit,projectCliNameEdit,projectCliNumEdit,projectCliEmailEdit,
	projectLocationEdit,projectDateEdit,projectNotesEdit) {
	var UID = firebase.auth().currentUser.uid;
	var form = document.getElementById('\''+projId+'\'');
	var projTitle = document.getElementById('\''+projectTitleEdit+'\'').value;
	var projDesc = document.getElementById('\''+projectDescEdit+'\'').value;
	var projCliName = document.getElementById('\''+projectCliNameEdit+'\'').value;
	var projCliNum = document.getElementById('\''+projectCliNumEdit+'\'').value;
	var projCliEmail = document.getElementById('\''+projectCliEmailEdit+'\'').value;
	var projLocation = document.getElementById('\''+projectLocationEdit+'\'').value;
	var projDate = document.getElementById('\''+projectDateEdit+'\'').value;
	var projNotes = document.getElementById('\''+projectNotesEdit+'\'').value;


	var project = {
		clientID: clientId,
		date: projDate,
		description: projDesc,
		email: projCliEmail,
		id: projId,
		location: projLocation,
		name: projCliName,
		notes: projNotes,
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
