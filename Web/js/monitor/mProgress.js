// Get a database reference to projects
var db = firebase.database();

// get id
var projId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchProgress(projId);
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
      var progressStatusEdit = progressID+currentObject.status;
      var progressVisibilityEdit = progressID + currentObject.visibility;
      // var progressImageURLEdit = progressID + currentObject.imgURL; 
      var progressDateEdit = progressID+currentObject.date;
      var progressNotesEdit = progressID+currentObject.notes+"1";
      var progressSelectStatusEdit = progressID + "Status";
      var progressEveryoneLabel = progressID + "LEveryone";
      var progressUserOnlyLabel = progressID + "LMenbers";
      var progressEveryoneEdit = progressID + "Everyone";
      var progressUserOnlyEdit = progressID + "Members";

checkImage(progressID,progressStatusEdit,progressVisibilityEdit,progressDateEdit,progressNotesEdit,progressSelectStatusEdit,progressEveryoneLabel,progressUserOnlyLabel,progressEveryoneEdit,progressUserOnlyEdit,currentObject.status,currentObject.notes,currentObject.visibility,currentObject.date);
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
function checkImage(progressID,progressStatusEdit,progressVisibilityEdit,progressDateEdit,progressNotesEdit,progressSelectStatusEdit,progressEveryoneLabel,progressUserOnlyLabel,progressEveryoneEdit,progressUserOnlyEdit,status,notes,visibility,date) {
  var progressImageURLEdit = 'https://firebasestorage.googleapis.com/v0/b/mproject-sharedb.appspot.com/o/Profile%20Picture%2Fempty.jpg?alt=media&token=572e9479-e896-4104-a90b-4a60ad70083d';
  firebase.database().ref('/Project add on image/' + progressID).once('value').then(function(snapshot){
 var progressImageObject = snapshot.val();
 var imagekeys = Object.keys(progressImageObject);

    var currentImageObject = progressImageObject[imagekeys[0]];
     
    progressImageURLEdit = currentImageObject.imgURL; 

        progressList.innerHTML +='<div class="col-md-6">' +
                  '<div class="well box-style-2" id="\''+progressID+'\'">'+
                '<h6>Progress ID: ' + progressID + '</h6>' +
                '<img src="'+progressImageURLEdit+'"class="img-thumbnail contentImage">' +
                '<h3>' + '<input id="\''+progressStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>' +
                '<select id="\''+progressSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h3>' +
                //'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
                '<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</span>' +
                '<br></br>' +
                '<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
                '<label id="\''+progressEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressEveryoneEdit+'\'" name="\''+progressID+"visibility"+'\'" checked>Everyone </label>' +
                '<label id="\''+progressUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressUserOnlyEdit+'\'" name="\''+progressID+"visibility"+'\'">Menbers</label></span>' +
                '<br></br>' +
                '<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+progressNotesEdit+'\'" value="'+notes+'"  readonly>' + '</span>' +
                '<br></br>' +
                '<a href="#" onclick="selectProgressImages(\''+progressID+'\')" data-toggle="modal" data-target="#progressShowMore" class="btn btn-success">Show more</a>' + " " + 
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