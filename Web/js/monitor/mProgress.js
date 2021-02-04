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
var projTitle = localStorage.getItem("objectToPass");
var projId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchProgress(projId);

    var titleName = document.getElementById("titleName");
titleName.innerHTML = '<h3>'+projTitle+'</h3>';
	}else{
		window.location='index.html';
	}
});

// Fetch progress
function fetchProgress(projId){
	firebase.database().ref('/Projects Add On/' + projId).once('value').then(function(snapshot){
    var progressObject = snapshot.val();
	var progressList = document.getElementById('progressList');
	progressList.innerHTML = '';

	if (progressObject){
    var keys = Object.keys(progressObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = progressObject[keys[i]];
      var progressID = currentObject.id;

      var progressInfo = {
        progressID:currentObject.id,
        progressTitleEdit:progressID + currentObject.title,
        progressStatusEdit:progressID+currentObject.status,
        progressVisibilityEdit:progressID + currentObject.visibility,
      // var progressImageURLEdit = progressID + currentObject.imgURL; 
        progressDateEdit:progressID+currentObject.date,
        progressNotesEdit:progressID+currentObject.notes+"1",
        progressSelectStatusEdit:progressID + "Status",
        progressEveryoneLabel:progressID + "LEveryone",
        progressUserOnlyLabel:progressID + "LMembers",
        progressEveryoneEdit:progressID + "Everyone",
        progressUserOnlyEdit:progressID + "Members",
        status:currentObject.status,
        notes:currentObject.notes,
        visibility:currentObject.visibility,
        date:currentObject.date,
        title:currentObject.title,
        updatedtime:currentObject.updatedtime

  };

 list.push(progressInfo);

// checkImage(progressID,progressStatusEdit,progressVisibilityEdit,progressDateEdit,progressNotesEdit,progressSelectStatusEdit,progressEveryoneLabel,progressUserOnlyLabel,progressEveryoneEdit,progressUserOnlyEdit,currentObject.status,currentObject.notes,currentObject.visibility,currentObject.date);
    // progressList.innerHTML +='<div class="col-md-6">' +
    // 							'<div class="well box-style-2" id="\''+progressID+'\'">'+
				// 				'<h6>Progress ID: ' + currentObject.id + '</h6>' +
				// 				'<img src="'+currentObject.imgURL+'"class="img-thumbnail contentImage">' +
				// 				'<h3>' + '<input id="\''+progressStatusEdit+'\'" value="'+currentObject.status+'" class="text-capitalize" readonly required>' +
				// 				'<select id="\''+progressSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h3>' +
				// 				//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
				// 				'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
				// 				'<br></br>' +
				// 				'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+getVisibility(currentObject.visibility)+'" class="text-uppercase" readonly required>' + 
				// 				'<label id="\''+progressEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressEveryoneEdit+'\'" name="\''+progressID+"visibility"+'\'" checked>Everyone </label>' +
				// 				'<label id="\''+progressUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressUserOnlyEdit+'\'" name="\''+progressID+"visibility"+'\'">Menbers</label></span>' +
				// 				'<br></br>' +
				// 				'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+progressNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
				// 				'<br></br>' +
				// 				'<a href="#" onclick="selectProgressImages(\''+progressID+'\')" data-toggle="modal" data-target="#progressShowMore" class="btn btn-success">Show more</a>' + " " + 
				// 			  	'</div>' +
				// 				'</div>';
    }

    var listslice = list.slice(
       indexOfFirstDevice,
      indexOfLastDevice
      );
    listslice.map(function(item,index) {
      checkImage(item.progressID,item.progressTitleEdit,item.progressStatusEdit,item.progressVisibilityEdit,item.progressDateEdit,item.progressNotesEdit,item.progressSelectStatusEdit,item.progressEveryoneLabel,item.progressUserOnlyLabel,item.progressEveryoneEdit,item.progressUserOnlyEdit,item.status,item.notes,item.visibility,item.date,item.title,item.updatedtime);
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
		progressList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no progress yet.' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

// check Image
function checkImage(progressID,progressTitleEdit,progressStatusEdit,progressVisibilityEdit,progressDateEdit,progressNotesEdit,progressSelectStatusEdit,progressEveryoneLabel,progressUserOnlyLabel,progressEveryoneEdit,progressUserOnlyEdit,status,notes,visibility,date,title,updatedtime) {
  var progressImageURLEdit = 'https://firebasestorage.googleapis.com/v0/b/mproject-sharedb.appspot.com/o/Profile%20Picture%2Fempty.jpg?alt=media&token=572e9479-e896-4104-a90b-4a60ad70083d';
  firebase.database().ref('/Project add on image/' + progressID).once('value').then(function(snapshot){
 var progressImageObject = snapshot.val();
 var imagekeys = Object.keys(progressImageObject);

    var currentImageObject = progressImageObject[imagekeys[0]];
     
    progressImageURLEdit = currentImageObject.imgURL; 

        progressList.innerHTML +='<div class="col-md-4">' +
                  '<div class="well box-style-2" id="\''+progressID+'\'">'+
                '<h6>Progress ID: ' + progressID + '</h6>' +
                '<img src="'+progressImageURLEdit+'"class="img-thumbnail contentImage">' +
                '<h3>' + '<input id="\''+progressTitleEdit+'\'" value="'+title+'" class="text-capitalize" readonly required>' + '</h3>'+
                ''+ (status === "completed" ? '<h6>' + '<input id="\''+progressStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>'+'</h6>': '<h6>'+'<input id="\''+progressStatusEdit+'\'" value="In progress" class="text-capitalize" readonly required>'+'</h6>')+''+
                '<select id="\''+progressSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h6>' +
                '<div class="progress">'+
                ''+ (status === "completed" ? '<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>' : '<div class="progress-bar" role="progressbar" style="width: '+status+';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">'+status+'</div>') +''+
                '</div>'+
                //'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
                '<span class="glyphicon glyphicon-time">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</span>' +
                '<br></br>' +
                '<span class="glyphicon glyphicon-eye-open">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
                '<label id="\''+progressEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressEveryoneEdit+'\'" name="\''+progressID+"visibility"+'\'" checked>Everyone </label>' +
                '<label id="\''+progressUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressUserOnlyEdit+'\'" name="\''+progressID+"visibility"+'\'">Menbers</label></span>' +
                '<br></br>' +
                '<span class="glyphicon glyphicon-comment "></span>' + " " +''+
                '<input class="" id="\''+progressNotesEdit+'\'" value="'+notes+'"  readonly>'+
                '<div id="\''+progressNotesEdit+progressID+'\'">'+
                '<p>'+
                '<a data-toggle="collapse" href="'+"#"+progressID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Read more</a>'+
                '</p>'+
                '<div class="collapse" id="'+progressID+'">'+
                  '<div class="card card-body">'+notes+'</div>'+
                '</div>'+
                '</div>'+
                '<br></br>' +
                '<a href="#" onclick="selectProgressImages(\''+progressID+'\')" data-toggle="modal" data-target="#progressShowMore" class="btn btn-success">Show more</a>' + " " +
                '<div>'+ 
                  '<h6>Last modified on '+updatedtime+'</h6>'+
                  '</div>'+ 
                  '</div>' +
                '</div>';
      }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error:[Project retrieve image] " +errorMessage);
  });
}

/* Progress Image show more when clicked */
function selectProgressImages(progressId){
  firebase.database().ref('/Project add on image/' + progressId).once('value').then(function(snapshot){
    var progressImageObject = snapshot.val();
    var progressImageList = document.getElementById('progressImageDetails');
    var keys = Object.keys(progressImageObject);

    // Hide images //
    progressImageList.innerHTML ="";

    // Show images //
    for (var i = 0; i < keys.length; i++){

     var currentObject = progressImageObject[keys[i]];

     var progressImageURLEdit = currentObject.imgURL; 
    
    progressImageList.innerHTML +='<img src="'+progressImageURLEdit+'" class="img-thumbnail">';

}
    
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// get visibility status
function getVisibility (visibility) {
	var x = "Everyone";
	var y = "Members";
	if (visibility) {
		return x;
	}else{
		return y;
	}
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
  progressList.innerHTML ='';

  //calculate page
  indexOfLastDevice = currentDevice * devicesPerPage;
  indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

  //re-run html
  var listslice = list.slice(
      indexOfFirstDevice,
        indexOfLastDevice
      );

    listslice.map(function(item,index) {
      checkImage(item.progressID,item.progressStatusEdit,item.progressVisibilityEdit,item.progressDateEdit,item.progressNotesEdit,item.progressSelectStatusEdit,item.progressEveryoneLabel,item.progressUserOnlyLabel,item.progressEveryoneEdit,item.progressUserOnlyEdit,item.status,item.notes,item.visibility,item.date);
    });

}