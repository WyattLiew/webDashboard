
// Get a database reference to projects
var db = firebase.database();

//pagination
var list = [];
var currentDevice =1;
var activePage = 1;
var devicesPerPage = 20;
var indexOfLastDevice = currentDevice * devicesPerPage;
var indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

 var PageNumbers = [];
 var active = activePage;

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
    // 

    var listslice = list.slice(
       indexOfFirstDevice,
      indexOfLastDevice
      );
    listslice.map(function(item,index) {
      projectList.innerHTML +='<div class="col-md-4">' +
                  '<div class="card card-body box-style-2" id="\''+item.projectID+'\'">'+
                '<h6>Project ID: ' + item.projectID + '</h6>' +
                '<h3>' + '<input id="\''+item.projectTitleEdit+'\'" value="'+item.title+'"  class="text-capitalize title-size" readonly required>' + '</h3>'+
                '<input id="\''+item.projectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
                
                '<div>'+
                '<p>'+
                '<a data-toggle="collapse" href="'+"#"+item.projectID+item.projectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
                '</p>'+
                '<div class="collapse pb-3" id="'+item.projectID+item.projectID+'">'+
                  '<div class="card card-body">'+
                  '<i class="fa fa-user pb-3">' + " " +''+
                  '<input id="\''+item.projectCliNameEdit+'\'" value="'+item.name+'"  readonly required></i>'+
                  
                  '<i class="fa fa-phone pb-3">' + " " +''+
                  '<input id="\''+item.projectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required></i>'+
                  
                  '<i class="fa fa-envelope pb-3">' + " " +''+
                  '<input id="\''+item.projectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</i>" +
                  
                  '<i class="fa fa-flag pb-3">' + " " +''+
                  '<input id="\''+item.projectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</i>' +
                  
                  '</div>'+
                '</div>'+
                '</div>'+
                '<a href="#" onclick="enterProject(\''+item.projectID+'\',\''+item.title+'\')" class="btn btn-success">Enter</a>' + " " + 
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
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function enterProject(projId,projTitle) {
	var value1 = projId;
	var value2 = projTitle;

  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mProgress.html";

    
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
                  '<div class="card card-body box-style-2" id="\''+item.projectID+'\'">'+
                '<h6>Project ID: ' + item.projectID + '</h6>' +
                '<h3>' + '<input id="\''+item.projectTitleEdit+'\'" value="'+item.title+'"  class="text-capitalize title-size" readonly required>' + '</h3>'+
                '<input id="\''+item.projectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
                
                '<div>'+
                '<p>'+
                '<a data-toggle="collapse" href="'+"#"+item.projectID+item.projectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
                '</p>'+
                '<div class="collapse pb-3" id="'+item.projectID+item.projectID+'">'+
                  '<div class="card card-body">'+
                  '<i class="fa fa-user pb-3">' + " " +''+
                  '<input id="\''+item.projectCliNameEdit+'\'" value="'+item.name+'"  readonly required></i>'+
                  
                  '<i class="fa fa-phone pb-3">' + " " +''+
                  '<input id="\''+item.projectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required></i>'+
                  
                  '<i class="fa fa-envelope pb-3">' + " " +''+
                  '<input id="\''+item.projectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</i>" +
                  
                  '<i class="fa fa-flag pb-3">' + " " +''+
                  '<input id="\''+item.projectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</i>' +
                  
                  '</div>'+
                '</div>'+
                '</div>'+
                '<a href="#" onclick="enterProject(\''+item.projectID+'\',\''+item.title+'\')" class="btn btn-success">Enter</a>' + " " + 
                  '</div>' +
                '</div>';
});

}