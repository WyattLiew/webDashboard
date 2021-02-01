
// Get a database reference to defects
var db = firebase.database();
var newDefDetailsRef = db.ref("Defect Add On");
var defDetailsAddonImages = db.ref("Defect add on image"); 
var storage = firebase.storage();
var defDetailsStorageRef = storage.ref("Defect Add On");
var UID;

// get data from defect page //
//var queryString = decodeURIComponent(window.location.search);
//queryString = queryString.substring(6);

var defTitle = localStorage.getItem("objectToPass");
var queryString = localStorage.getItem("idToPass");

// check user log in status //
firebase.auth().onAuthStateChanged(function(user){
if (user) {
	//user is signed in
UID = firebase.auth().currentUser.uid;

fetchDefDetails(queryString);
}else{
	window.location='index.html';
}
});

// defect details add button
document.getElementById('defDetailsInputForm').addEventListener('submit', saveDefDetails);
defDetailsSubmitProgress = document.getElementById("submitDefDetails");
defDetailsAddBtn = document.getElementById("defDetails-add-btn");

function saveDefDetails(e){
var UID = firebase.auth().currentUser.uid;
var defDetailsTitle = document.getElementById('defDetailsTitleInput').value;
var defDetailsStatus= document.getElementById('defDetailsStatus').value;
var defDetailsDate = document.getElementById('defDetailsDateInput').value;
var defDetailsNotes = document.getElementById('defDetailsNotesInput').value;
var vEveryone = document.getElementById("defDetailsEveryone").checked;
var vUserOnly = document.getElementById("defDetailsUserOnly").checked;
var defDetailsId = newDefDetailsRef.push().key;
var visibility = true;

if (vEveryone == true) {
	visibility = true;
}else{
	visibility = false;
}

// input file
var selectedFile = document.querySelector('#defDetailsUploadImages').files[0];

// get file name && timestamp
var fullPath = document.getElementById("defDetailsUploadImages").files[0].name;
var filename;
if (fullPath) {
    filename = fullPath + " (" + Date.now() + ")";
}

var defDetails = {
	defect: defDetailsTitle,
	visibility: visibility,
	date: defDetailsDate,
	id: defDetailsId,
	imgURL: "",
	notes: defDetailsNotes,
	status: defDetailsStatus
}


e.preventDefault();

if (defDetailsTitle!="" && selectedFile != null && defDetailsDate !="" && selectedFile.type.match('image')) {
	// Show progress
		defDetailsSubmitProgress.style.display="inline-block";
		defDetailsAddBtn.style.display="none";

	// Upload image to firebase storage //
	var uploadImage = defDetailsStorageRef.child(UID).child(defTitle).child(defDetailsId).child(filename).put(selectedFile);
	
	uploadImage.on('state_changed', function(snapshot){

	}, function(error){
		let errorMessage = error.message;
		alert("Error!:" +errorMessage);
		
	}, function() {
		//Handle successful uploads on complete
		//For instance, get the download URL: https// firebasestorage.googleapis.com/...
		//var downloadURL = uploadImage.snapshot.downloadURL;
		uploadImage.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		defDetails.imgURL = downloadURL;

		// save data to firebase
		newDefDetailsRef.child(queryString).child(defDetailsId).set(defDetails,function(error) {
		if (error) {
			let errorMessage = error.message;
			alert("Error!:" +errorMessage);
			// Stop progress
			defDetailsSubmitProgress.style.display="none";
			defDetailsAddBtn.style.display="inline-block";
		} else {
			// Reset field
			document.getElementById('defDetailsInputForm').reset();
			// retrieve data
			fetchDefDetails(queryString);
			//alert("Save Successfully!");
			var defDetailsAlert = document.getElementById("defDetails-green-alert1");
			defDetailsAlert.classList.remove("hidden");

			// Stop progress
			defDetailsSubmitProgress.style.display="none";
			defDetailsAddBtn.style.display="inline-block";
		}
	});
	});
	});

	// input file
	var selectedFiles = document.querySelector('#defDetailsUploadImages').files;

	for (var i = 0; i < selectedFiles.length;i++) {
		var files = selectedFiles[i];
		// get file name && timestamp
		var fullPaths = document.getElementById("defDetailsUploadImages").files[i].name;
		var filenames = "";
		if (fullPaths) {
		    filenames = fullPaths +" (" + Date.now() + ")";
		}
		// check file image type
		if (selectedFiles[i].type.match('image')){
		var uploadImages = defDetailsStorageRef.child(UID).child(defTitle).child(defDetailsId)
		.child(filenames).put(selectedFiles[i]).then(function(snapshot){
		
		// add imgurl to defect details json
		var url = snapshot.ref.getDownloadURL().then(function(urls){

			var imageUrls = urls;
		 	 var imageId = defDetailsAddonImages.push().key;
		 	// save Add on image data to firebase
		 	defDetailsAddonImages.child(defDetailsId).child(imageId).set({
			id: imageId,
			imgURL: imageUrls
		}, function(error) {
		    if (error) {
		      alert("Error!:" +errorMessage);
		    } else {
		      // Data saved successfully!
		    }
		});
	});
	});
	}else{
			alert("Please check your image type");
		}
	}
}else{
	alert("Please check your image type");
} 
}

// Fetch defect details
function fetchDefDetails(queryString){
	firebase.database().ref('/Defect Add On/' + queryString).once('value').then(function(snapshot){
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
								'<a href="#" onclick="saveEdit(\''+defDetailsID+'\', \''+defDetailsEveryoneEdit+'\',\''+defDetailsUserOnlyEdit+'\',\''+defDetailsSelectStatusEdit+'\',\''+defDetailsDateEdit+'\',\''+defDetailsNotesEdit+'\',\''+currentObject.imgURL+'\',\''+defDetailsTitleEdit+'\')" class="btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+defDetailsID+'\')" class="btn btn-danger">cancel</a>' + " " + 
								'<div class="btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editDefDetails(\''+defDetailsID+'\',\''+defDetailsVisibilityEdit+'\',\''+defDetailsEveryoneLabel+'\',\''+defDetailsUserOnlyLabel+'\',\''+defDetailsStatusEdit+'\',\''+defDetailsSelectStatusEdit+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteDefDetails(\''+defDetailsID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';
    }
	}else {
		defDetailsList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no Add on yet.' +
								'<a class="btn btn-link" data-toggle="modal" data-target="#addDefDetails">Create one</a></h4>' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

// Delete defDetails
function deleteDefDetails(defDetailsId) {
	var result = confirm("Are you sure to delete this item?\nYou will not be able to recover this information!");
	if (result) {
    //Logic to delete the item
    newDefDetailsRef.child(queryString).child(defDetailsId).remove()
  		.then(function() {
  		defDetailsAddonImages.child(defDetailsId).remove();
    	//alert("Remove succeeded.");
    	var defDetailsAlert = document.getElementById("defDetails-green-alert2");
		defDetailsAlert.classList.remove("hidden");
    	fetchDefDetails(queryString);
  	})
  		.catch(function(error) {
    	alert("Remove failed: " + error.message);
  	});
	}

}

// Edit defDetails
function editDefDetails(defDetailsId,visibility,vEveryone,vUserOnly,defDetailsStatusView,defDetailsStatusEdit) {
	var form = document.getElementById('\''+defDetailsId+'\'');
	var ipt = form.getElementsByTagName('input');

	var s = document.getElementById('\''+defDetailsStatusView+'\'');
	s.classList.add("hidden");

	var v = document.getElementById('\''+visibility+'\'');
	v.classList.add("hidden");

	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=false;
	}
	form.classList.add("invert");

	var vEveryoneEdit = document.getElementById('\''+vEveryone+'\'');
	var vUserOnlyEdit = document.getElementById('\''+vUserOnly+'\'');
	var vProgressStatus = document.getElementById('\''+defDetailsStatusEdit+'\'');
	vEveryoneEdit.classList.remove("hidden");
	vUserOnlyEdit.classList.remove("hidden");
	vProgressStatus.classList.remove("hidden");
}

// cancel edit
function cancelEdit(defDetailsId) {
	var form = document.getElementById('\''+defDetailsId+'\'');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
	fetchdefDetails(queryString);
}

// save edit
function saveEdit(defDetailsID,defDetailsEveryoneEdit,defDetailsUserOnlyEdit,defDetailsStatusEdit,defDetailsDateEdit,defDetailsNotesEdit,imageURL,defDetailsTitleEdit) {
	var form = document.getElementById('\''+defDetailsID+'\'');
	var defDetailsEveryone = document.getElementById('\''+defDetailsEveryoneEdit+'\'').checked;
	var defDetailsUserOnly = document.getElementById('\''+defDetailsUserOnlyEdit+'\'').checked;
	var defDetailsStatus = document.getElementById('\''+defDetailsStatusEdit+'\'').value;
	var defDetailsDate = document.getElementById('\''+defDetailsDateEdit+'\'').value;
	var defDetailsNotes = document.getElementById('\''+defDetailsNotesEdit+'\'').value;
	var defDetailsTitle = document.getElementById('\''+defDetailsTitleEdit+'\'').value;

	var visibility = true;

	if (defDetailsEveryone == true) {
		visibility = true;
	}else{
		visibility = false;
	}

	var defDetails = {
	defect: defDetailsTitle,
	visibility: visibility,
	date: defDetailsDate,
	id: defDetailsID,
	imgURL: imageURL,
	notes: defDetailsNotes,
	status: defDetailsStatus
}

	

	if (defDetailsDate !="" && defDetailsTitle !="") {


			// save data to firebase
			newDefDetailsRef.child(queryString).child(defDetailsID).set(defDetails,function(error) {
			if (error) {
				alert("Error!");
			} else {
				// retrieve data
				fetchDefDetails(queryString);
				var defDetailsAlert = document.getElementById("defDetails-green-alert3");
				defDetailsAlert.classList.remove("hidden");
			}
		});
	}
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