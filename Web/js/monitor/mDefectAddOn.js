// Get a database reference to projects
var db = firebase.database();

// get id
var defectId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchDefDetails(defectId);
	}else{
		//
	}
});

// Fetch defect details
function fetchDefDetails(defectId){
	firebase.database().ref('/Defect Add On/' + defectId).once('value').then(function(snapshot){
    var defDetailsObject = snapshot.val();
	var defDetailsList = document.getElementById('defDetailsList');
	defDetailsList.innerHTML = '';

	if (defDetailsObject){
    var keys = Object.keys(defDetailsObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = defDetailsObject[keys[i]];
      var defDetailsID = currentObject.id;
      var defDetailsTitleEdit = defDetailsID + currentObject.defect;
      var defDetailsStatusEdit = defDetailsID+currentObject.status;
      var defDetailsVisibilityEdit = defDetailsID + currentObject.visibility;
      var defDetailsImageURLEdit = defDetailsID + currentObject.imgURL; 
      var defDetailsDateEdit = defDetailsID+currentObject.date;
      var defDetailsNotesEdit = defDetailsID+currentObject.notes+"1";
      var defDetailsSelectStatusEdit = defDetailsID + "Status";
      var defDetailsEveryoneLabel = defDetailsID + "LEveryone";
      var defDetailsUserOnlyLabel = defDetailsID + "LMenbers";
      var defDetailsEveryoneEdit = defDetailsID + "Everyone";
      var defDetailsUserOnlyEdit = defDetailsID + "Members";

    defDetailsList.innerHTML +='<div class="col-md-6">' +
    							'<div class="well box-style-2" id="\''+defDetailsID+'\'">'+
								'<h6>Defect Add On ID: ' + currentObject.id + '</h6>' +
								'<img src="'+currentObject.imgURL+'"class="img-thumbnail contentImage">' +
								'<h3>' + '<input id="\''+defDetailsTitleEdit+'\'" value="'+currentObject.defect+'" class="text-capitalize" readonly required>' + '</h3>'+
								'<h6>' + '<input id="\''+defDetailsStatusEdit+'\'" value="'+currentObject.status+'" class="text-capitalize" readonly required>' +
								'<select id="\''+defDetailsSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h6>' +
								//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+defDetailsDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+defDetailsVisibilityEdit+'\'" type="text" value="'+getVisibility(currentObject.visibility)+'" class="text-uppercase" readonly required>' + 
								'<label id="\''+defDetailsEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsEveryoneEdit+'\'" name="\''+defDetailsID+"visibility"+'\'" checked>Everyone </label>' +
								'<label id="\''+defDetailsUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsUserOnlyEdit+'\'" name="\''+defDetailsID+"visibility"+'\'">Menbers</label></span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+defDetailsNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="selectDefDetailsImages(\''+defDetailsID+'\')" data-toggle="modal" data-target="#defDetailsShowMore" class="btn btn-success">Show more</a>' + " " + 
							  	'</div>' +
								'</div>';
    }
	}else {
		defDetailsList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no Add on yet.' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

/* Progress Image show more when clicked */
function selectDefDetailsImages(defDetailsId){
  firebase.database().ref('/Defect add on image/' + defDetailsId).once('value').then(function(snapshot){
    var defDetailsImageObject = snapshot.val();
    var defDetailsImageList = document.getElementById('defDetailsImageDetails');
    var keys = Object.keys(defDetailsImageObject);

    // Hide images //
    defDetailsImageList.innerHTML ="";

    // Show images //
    for (var i = 0; i < keys.length; i++){

     var currentObject = defDetailsImageObject[keys[i]];

     var defDetailsImageURLEdit = currentObject.imgURL; 
    
    defDetailsImageList.innerHTML +='<img src="'+defDetailsImageURLEdit+'" class="img-thumbnail">';

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