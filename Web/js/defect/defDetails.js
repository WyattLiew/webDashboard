
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
// var fullPath = document.getElementById("defDetailsUploadImages").files[0].name;
// var filename;
// if (fullPath) {
//     filename = fullPath + " (" + Date.now() + ")";
// }

var defDetails = {
	defect: defDetailsTitle,
	visibility: visibility,
	date: defDetailsDate,
	id: defDetailsId,
	notes: defDetailsNotes,
	status: defDetailsStatus
}


e.preventDefault();

if (defDetailsTitle!="" && selectedFile != null && defDetailsDate !="" && selectedFile.type.match('image')) {
	// Show progress
		defDetailsSubmitProgress.style.display="inline-block";
		defDetailsAddBtn.style.display="none";

	// Upload image to firebase storage //
	// var uploadImage = defDetailsStorageRef.child(UID).child(defTitle).child(defDetailsId).child(filename).put(selectedFile);
	
	// uploadImage.on('state_changed', function(snapshot){

	// }, function(error){
	// 	let errorMessage = error.message;
	// 	alert("Error!:" +errorMessage);
		
	// }, function() {
		//Handle successful uploads on complete
		//For instance, get the download URL: https// firebasestorage.googleapis.com/...
		//var downloadURL = uploadImage.snapshot.downloadURL;
		// uploadImage.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		// defDetails.imgURL = downloadURL;

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
			// fetchDefDetails(queryString);
			//alert("Save Successfully!");
			var defDetailsAlert = document.getElementById("defDetails-green-alert1");
			defDetailsAlert.classList.remove("hidden");

			// Stop progress
			defDetailsSubmitProgress.style.display="none";
			defDetailsAddBtn.style.display="inline-block";
		}
	// });
	// });
	});

	// input file
	var selectedFiles = document.querySelector('#defDetailsUploadImages').files;
	var count = 0;
	var fileLength = selectedFiles.length;

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
			//Add Image data
			count++;
			addImageData(defDetailsId,filenames,selectedFiles[i],count,fileLength);	
	}
	}
}else{
	alert("Please check your image type");
} 
}

// Add Image Data
function addImageData(defDetailsId,filenames,selectedFiles,count,fileLength) {
	var uploadImages = defDetailsStorageRef.child(UID).child(defTitle).child(defDetailsId)
		.child(filenames).put(selectedFiles).then(function(snapshot){
		
		// add imgurl to defect details json
		var url = snapshot.ref.getDownloadURL().then(function(urls){

			var imageUrls = urls;
		 	 var imageId = defDetailsAddonImages.push().key;
		 	// save Add on image data to firebase
		 	defDetailsAddonImages.child(defDetailsId).child(imageId).set({
			id: imageId,
			imgURL: imageUrls,
			filename:filenames
		}, function(error) {
		    if (error) {
		      alert("Error!:" +errorMessage);
		    } else {
		      // Data saved successfully!
		      fetchDefDetails(queryString);
		      selectDefDetailsImages(defDetailsId);
		    }
		});
	});
	});
}

// Fetch defect details
function fetchDefDetails(queryString){
	firebase.database().ref('/Defect Add On/' + queryString).once('value').then(function(snapshot){
    var defDetailsObject = snapshot.val();
	var defDetailsList = document.getElementById('defDetailsList');
	var defectTable = document.getElementById('defectTable');
	defDetailsList.innerHTML = '';

	defectTable.innerHTML = '<tr>'+
    '<th>Image</th>'+
    '<th>Title</th>'+
    '<th>Status</th>'+
    '<th>Date</th>'+
    '<th>Notes</th>'+
  '</tr>';

	if (defDetailsObject){
    var keys = Object.keys(defDetailsObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = defDetailsObject[keys[i]];
      var defDetailsID = currentObject.id;
      var defDetailsTitleEdit = defDetailsID + currentObject.defect;
      var defDetailsStatusEdit = defDetailsID+currentObject.status;
      var defDetailsVisibilityEdit = defDetailsID + currentObject.visibility;
      // var defDetailsImageURLEdit = defDetailsID + currentObject.imgURL; 
      var defDetailsDateEdit = defDetailsID+currentObject.date;
      var defDetailsNotesEdit = defDetailsID+currentObject.notes+"1";
      var defDetailsSelectStatusEdit = defDetailsID + "Status";
      var defDetailsEveryoneLabel = defDetailsID + "LEveryone";
      var defDetailsUserOnlyLabel = defDetailsID + "LMenbers";
      var defDetailsEveryoneEdit = defDetailsID + "Everyone";
      var defDetailsUserOnlyEdit = defDetailsID + "Members";

      checkImage(defDetailsID,defDetailsTitleEdit,defDetailsStatusEdit,defDetailsVisibilityEdit,defDetailsDateEdit,defDetailsNotesEdit,defDetailsSelectStatusEdit,defDetailsEveryoneLabel,defDetailsUserOnlyLabel,defDetailsEveryoneEdit,defDetailsUserOnlyEdit,currentObject.status,currentObject.notes,currentObject.visibility,currentObject.date,currentObject.defect);

    // defDetailsList.innerHTML +='<div class="col-md-6">' +
    // 							'<div class="well box-style-2" id="\''+defDetailsID+'\'">'+
				// 				'<h6>Defect Add On ID: ' + currentObject.id + '</h6>' +
				// 				'<img src="'+currentObject.imgURL+'"class="img-thumbnail contentImage">' +
				// 				'<h3>' + '<input id="\''+defDetailsTitleEdit+'\'" value="'+currentObject.defect+'" class="text-capitalize" readonly required>' + '</h3>'+
				// 				'<h6>' + '<input id="\''+defDetailsStatusEdit+'\'" value="'+currentObject.status+'" class="text-capitalize" readonly required>' +
				// 				'<select id="\''+defDetailsSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h6>' +
				// 				//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
				// 				'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+defDetailsDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
				// 				'<br></br>' +
				// 				'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+defDetailsVisibilityEdit+'\'" type="text" value="'+getVisibility(currentObject.visibility)+'" class="text-uppercase" readonly required>' + 
				// 				'<label id="\''+defDetailsEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsEveryoneEdit+'\'" name="\''+defDetailsID+"visibility"+'\'" checked>Everyone </label>' +
				// 				'<label id="\''+defDetailsUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsUserOnlyEdit+'\'" name="\''+defDetailsID+"visibility"+'\'">Menbers</label></span>' +
				// 				'<br></br>' +
				// 				'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+defDetailsNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
				// 				'<br></br>' +
				// 				'<a href="#" onclick="selectDefDetailsImages(\''+defDetailsID+'\')" data-toggle="modal" data-target="#defDetailsShowMore" class="btn btn-success">Show more</a>' + " " + 
				// 				'<a href="#" onclick="saveEdit(\''+defDetailsID+'\', \''+defDetailsEveryoneEdit+'\',\''+defDetailsUserOnlyEdit+'\',\''+defDetailsSelectStatusEdit+'\',\''+defDetailsDateEdit+'\',\''+defDetailsNotesEdit+'\',\''+currentObject.imgURL+'\',\''+defDetailsTitleEdit+'\')" class="btn btn-success">Save</a>' + " " + 
				// 				'<a href="#" onclick="cancelEdit(\''+defDetailsID+'\')" class="btn btn-danger">cancel</a>' + " " + 
				// 				'<div class="btn-group action-btn">' +
				// 				'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
				// 				'<ul class="dropdown-menu">' +
				// 			    '<li><a href="#" onclick="editDefDetails(\''+defDetailsID+'\',\''+defDetailsVisibilityEdit+'\',\''+defDetailsEveryoneLabel+'\',\''+defDetailsUserOnlyLabel+'\',\''+defDetailsStatusEdit+'\',\''+defDetailsSelectStatusEdit+'\')">Edit</a></li>'+
				// 			    '<li role="separator" class="divider"></li>'+
				// 			    '<li><a href="#" onclick="deleteDefDetails(\''+defDetailsID+'\')" >Delete</a></li>' +
				// 			  	'</ul>'+
				// 			  	'</div>' +
				// 			  	'</div>' +
				// 				'</div>';
    }
	}else {
		defDetailsList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">No Data.' +
								'<a class="btn btn-link" data-toggle="modal" data-target="#addDefDetails">Create one</a></h4>' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error:[Defect retrieve data] " +errorMessage);
  });
}

// check Image
function checkImage(defDetailsID,defDetailsTitleEdit,defDetailsStatusEdit,defDetailsVisibilityEdit,defDetailsDateEdit,defDetailsNotesEdit,defDetailsSelectStatusEdit,defDetailsEveryoneLabel,defDetailsUserOnlyLabel,defDetailsEveryoneEdit,defDetailsUserOnlyEdit,status,notes,visibility,date,defect) {
	var defDetailsImageURLEdit = 'https://firebasestorage.googleapis.com/v0/b/mproject-sharedb.appspot.com/o/Profile%20Picture%2Fempty.jpg?alt=media&token=572e9479-e896-4104-a90b-4a60ad70083d';
	firebase.database().ref('/Defect add on image/' + defDetailsID).once('value').then(function(snapshot){
    var defDetailsImageObject = snapshot.val();
 var imagekeys = Object.keys(defDetailsImageObject);

    var currentImageObject = defDetailsImageObject[imagekeys[0]];
     
    	defDetailsImageURLEdit = currentImageObject.imgURL; 

    	 defDetailsList.innerHTML +='<div class="col-md-6">' +
    							'<div class="well box-style-2" id="\''+defDetailsID+'\'">'+
								'<h6>Defect Add On ID: ' + defDetailsID + '</h6>' +
								'<img src="'+defDetailsImageURLEdit+'"class="img-thumbnail contentImage">' +
								'<h3>' + '<input id="\''+defDetailsTitleEdit+'\'" value="'+defect+'" class="text-capitalize" readonly required>' + '</h3>'+
								'<h6>' + '<input id="\''+defDetailsStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>' +
								'<select id="\''+defDetailsSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h6>' +
								//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+defDetailsDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+defDetailsVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
								'<label id="\''+defDetailsEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsEveryoneEdit+'\'" name="\''+defDetailsID+"visibility"+'\'" checked>Everyone </label>' +
								'<label id="\''+defDetailsUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsUserOnlyEdit+'\'" name="\''+defDetailsID+"visibility"+'\'">Menbers</label></span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+defDetailsNotesEdit+'\'" value="'+notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="selectDefDetailsImages(\''+defDetailsID+'\')" data-toggle="modal" data-target="#defDetailsShowMore" class="a btn btn-success">Show more</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+defDetailsID+'\', \''+defDetailsEveryoneEdit+'\',\''+defDetailsUserOnlyEdit+'\',\''+defDetailsSelectStatusEdit+'\',\''+defDetailsDateEdit+'\',\''+defDetailsNotesEdit+'\',\''+defDetailsTitleEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+defDetailsID+'\',\''+defDetailsVisibilityEdit+'\',\''+defDetailsEveryoneLabel+'\',\''+defDetailsUserOnlyLabel+'\',\''+defDetailsStatusEdit+'\',\''+defDetailsSelectStatusEdit+'\')" class="a btn btn-danger">cancel</a>' + " " + 
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

		defectTable.innerHTML += '<tr>'+
     '<td width="300" height="200"><img src="'+defDetailsImageURLEdit+'" width="150" /></td>'+
     '<td>\''+defect+'\'</td>'+
    '<td>\''+status+'\'</td>'+
    '<td>\''+date+'\'</td>'+
    '<td>\''+notes+'\'</td>'+
     '</tr>';
			}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error:[Project retrieve image] " +errorMessage);
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
  		// Create a reference to the file to delete
		var desertRef = defDetailsStorageRef.child(`${UID}/${defTitle}/${defDetailsId}/`)

		desertRef.listAll().then(function (result) {
            result.items.forEach(function (file) {
              file.delete();
            });
        }).catch(function (error) {
            // Handle any errors
           alert("Remove image failed: " + error.message);
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
function cancelEdit(defDetailsId,visibility,vEveryone,vUserOnly,defDetailsStatusView,defDetailsStatusEdit) {
	var s = document.getElementById('\''+defDetailsStatusView+'\'');
	s.classList.remove("hidden");

	var v = document.getElementById('\''+visibility+'\'');
	v.classList.remove("hidden");
	var form = document.getElementById('\''+defDetailsId+'\'');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
	var vEveryoneEdit = document.getElementById('\''+vEveryone+'\'');
	var vUserOnlyEdit = document.getElementById('\''+vUserOnly+'\'');
	var vProgressStatus = document.getElementById('\''+defDetailsStatusEdit+'\'');
	vEveryoneEdit.classList.add("hidden");
	vUserOnlyEdit.classList.add("hidden");
	vProgressStatus.classList.add("hidden");
	// fetchDefDetails(queryString);
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
	// imgURL: imageURL,
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
    defDetailsImageList.innerHTML ='<div class="form-group">'+
                '<label for="defDetailsUploadAddOnImages">Upload Images * (Image Only)</label>'+
                '<input type="file" class="upload-group" id="defDetailsUploadAddOnImages" required multiple>'+
                '<br>'+
                '<a href="#"class="btn btn-success" onclick="addDefectImages(\''+defDetailsId+'\')">'+'Add</a>'+'</div>'+'<br>' +
             '</div>';

    // Show images //
    for (var i = 0; i < keys.length; i++){

     var currentObject = defDetailsImageObject[keys[i]];

     var defDetailsImageURLEdit = currentObject.imgURL; 

     var defDetailsImageId = currentObject.id;

     var defDetailsImageFilename = currentObject.filename;
    
    defDetailsImageList.innerHTML +='<div>'+
    '<img src="'+defDetailsImageURLEdit+'" class="img-thumbnail contentImage">'+
    '<h6>Filename: ' +defDetailsImageFilename+ '</h6>' +
    '<a href="#"class="btn btn-danger" onclick="deleteDefectImages(\''+defDetailsId+'\',\''+defDetailsImageFilename+'\',\''+defDetailsImageId+'\',\''+keys.length+'\')">'+'Delete</a>'+'</div>'+'<br>' ;

}
    
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// Add progress Image individually
function addDefectImages(defDetailsId){
	// input file
	var selectedFiles = document.querySelector('#defDetailsUploadAddOnImages').files;
	var selectedFile = document.querySelector('#defDetailsUploadAddOnImages').files[0];
	var count = 0;
	var fileLength = selectedFiles.length;

	if (selectedFile != null && selectedFile.type.match('image')) {

	for (var i = 0; i < selectedFiles.length;i++) {
		var file = selectedFiles[i];
		// get file name && timestamp
		var fullPaths = document.getElementById("defDetailsUploadAddOnImages").files[i].name;
		var filenames = "";
		if (fullPaths) {
		    filenames = fullPaths +" (" + Date.now() + ")";
		}
if (selectedFiles[i].type.match('image')){
	//Add Image data
	count++;
	addImageData(defDetailsId,filenames,selectedFiles[i],count,fileLength);

} else {
	alert("Please check your image type");
}
}
}else{
	alert("Please check your image type");
} 
}

// Delete progress Image individually
function deleteDefectImages(defDetailsId,filename,id,keys) {
		if (keys > 1) {
	    // Create a reference to the file to delete
		var desertRef = defDetailsStorageRef.child(`${UID}/${defTitle}/${defDetailsId}/${filename}`);
		// Delete the file
		desertRef.delete().then(() => {
			defDetailsAddonImages.child(defDetailsId).child(id).remove();
			fetchDefDetails(queryString);
			selectDefDetailsImages(defDetailsId);
		  // File deleted successfully
		}).catch((error) => {
		  // Uh-oh, an error occurred!
		  alert("Remove image failed: " + error.message);
		});
	} else {
		alert("Image unable to delete.")
	}
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