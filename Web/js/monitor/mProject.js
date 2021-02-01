
// Get a database reference to projects
var db = firebase.database();

// get id
var userId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchProjects(userId);
	}else{
		window.location='index.html';
	}
});


function fetchProjects(userId){
	firebase.database().ref('/Projects/' + userId).once('value').then(function(snapshot){
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
								'<h3>' + '<input id="\''+projectTitleEdit+'\'" value="'+currentObject.title+'" class="text-capitalize title-size" readonly required>' + '</h3>' +
								'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+projectDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-user col-md-6 ">'+ " " +'<input id="\''+projectCliNameEdit+'\'" value="'+currentObject.name+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-earphone col-md-6">' + " " +'<input id="\''+projectCliNumEdit+'\'" type="number" value="'+currentObject.number+'" readonly required>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-envelope col-md-6">' + " " +'<input id="\''+projectCliEmailEdit+'\'" type="email" value="'+currentObject.email+'"  readonly required>' + "</span>" +
								'<br></br>' +
								'<span class="glyphicon glyphicon-flag col-md-6">' + " " +'<input id="\''+projectLocationEdit+'\'" value="'+currentObject.location+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+projectNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="enterProject(\''+projectID+'\',\''+currentObject.title+'\')" class="btn btn-success">Enter</a>' + " " + 
							  	'</div>' +
								'</div>';
    }
    }else {
		projectList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no project yet.' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function enterProject(projId) {
	var value1 = projId;

  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    //localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mProgress.html";

    
}