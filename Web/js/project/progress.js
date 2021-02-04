
// Get a database reference to projects
var db = firebase.database();
var newProgressRef = db.ref("Projects Add On");
var progressAddonImages = db.ref("Project add on image"); 
var storage = firebase.storage();
var progressStorageRef = storage.ref("Projects Add On");
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

// get data from project page //
//var queryString = decodeURIComponent(window.location.search);
//queryString = queryString.substring(6);

var projTitle = localStorage.getItem("objectToPass");
var queryString = localStorage.getItem("idToPass");

// check user log in status //
firebase.auth().onAuthStateChanged(function(user){
if (user) {
	//user is signed in
UID = firebase.auth().currentUser.uid;
fetchProgress(queryString);
var titleName = document.getElementById("titleName");
titleName.innerHTML = '<h3>'+projTitle+'</h3>';

}else{
	window.location='index.html';
}
});

// progress add button
document.getElementById('progressInputForm').addEventListener('submit',saveProgress);
progressSubmitProgress = document.getElementById("submitProgress");
progressAddBtn = document.getElementById("progress-add-btn");

function saveProgress(e){
var UID = firebase.auth().currentUser.uid;
var progressTitle = document.getElementById('progressTitleInput').value;
var progressStatus= document.getElementById('progressStatus').value;
var progressDate = document.getElementById('progressDateInput').value;
var progressNotes = document.getElementById('progressNotesInput').value;
var vEveryone = document.getElementById("progressEveryone").checked;
var vUserOnly = document.getElementById("progressUserOnly").checked;
var newDate = new Date();
var progressId = newProgressRef.push().key;
var visibility = true;

if (vEveryone == true) {
	visibility = true;
}else{
	visibility = false;
}

var updatedtime =newDate.getDate()+"/"+(newDate.getMonth()+1)+"/"+newDate.getUTCFullYear()+ " at " +newDate.getHours()+":"+ newDate.getMinutes() ;

// input file
var selectedFile = document.querySelector('#progressUploadImages').files[0];
var selectedFileLength = document.querySelector('#progressUploadImages').files.length;

// get file name && timestamp
// var fullPath = document.getElementById("progressUploadImages").files[0].name;
// var filename;
// if (fullPath) {
//     filename = fullPath + " (" + Date.now() + ")";
// }

var progress = {
	title:progressTitle,
	visibility: visibility,
	date: progressDate,
	id: progressId,
	notes: progressNotes,
	status: progressStatus,
	updatedtime:updatedtime
}


e.preventDefault();
if (selectedFileLength<=5) {

if (selectedFile != null && progressDate !="" && selectedFile.type.match('image')) {
	// Show progress
		progressSubmitProgress.style.display="inline-block";
		progressAddBtn.style.display="none";

	// Upload image to firebase storage //
	// var uploadImage = progressStorageRef.child(UID).child(projTitle).child(progressId).child(filename).put(selectedFile);
	
	// uploadImage.on('state_changed', function(snapshot){

	// }, function(error){
	// 	let errorMessage = error.message;
	// 	alert("Error!:" +errorMessage);
		
	// }, function() {
		//Handle successful uploads on complete
		//For instance, get the download URL: https// firebasestorage.googleapis.com/...
		//var downloadURL = uploadImage.snapshot.downloadURL;

		/**Get URL Function**/
		// uploadImage.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		// progress.imgURL = downloadURL;

		// save data to firebase
		newProgressRef.child(queryString).child(progressId).set(progress,function(error) {
		if (error) {
			let errorMessage = error.message;
			alert("Error!:[New Progress]" +errorMessage);
			// Stop progress
			progressSubmitProgress.style.display="none";
			progressAddBtn.style.display="inline-block";
		} else {
			// Reset field
			document.getElementById('progressInputForm').reset();
			// retrieve data
			// fetchProgress(queryString);
			//alert("Save Successfully!");
			var progressAlert = document.getElementById("progress-green-alert1");
			progressAlert.classList.remove("hidden");

			// Stop progress
			progressSubmitProgress.style.display="none";
			progressAddBtn.style.display="inline-block";
		}
	// });
	// });
	});

	// input file
	var selectedFiles = document.querySelector('#progressUploadImages').files;
	var count = 0;
	var fileLength = selectedFiles.length;
	
	for (var i = 0; i < selectedFiles.length;i++) {
		var file = selectedFiles[i];
		// get file name && timestamp
		var fullPaths = document.getElementById("progressUploadImages").files[i].name;
		var filenames = "";
		if (fullPaths) {
		    filenames = fullPaths +" (" + Date.now() + ")";
		}
if (selectedFiles[i].type.match('image')){
	//Add Image data
	count++;
	addImageData(progressId,filenames,selectedFiles[i],count,fileLength);

}
	}
}else{
	alert("Please check your image type");
} 
}else {
	alert("You can only upload a maximum of 5 images");
}
}

// Add Image Data
function addImageData(progressId,filenames,selectedFiles,count,fileLength) {
	var uploadImages = progressStorageRef.child(UID).child(queryString).child(progressId)
		.child(filenames).put(selectedFiles).then(function(snapshot){
			
			// add imgurl to progress json
		var url = snapshot.ref.getDownloadURL().then(function(urls){
			var imageUrls = urls;
		 	 var imageId = progressAddonImages.push().key;

			progressAddonImages.child(progressId).child(imageId).set({
				id:imageId,
				imgURL:imageUrls,
				filename:filenames
			}, function(error) {
		    if (error) {
		      alert("Error![Adding Images]:" +errorMessage);
		    } else {
		      // Data saved successfully!
		      if(count==fileLength) {
		      	// retrieve data
				fetchProgress(queryString);
				selectProgressImages(progressId);
		      }
		    }
		});
	// }
		});
	});
}

// Fetch progress
function fetchProgress(queryString){
	firebase.database().ref('/Projects Add On/' + queryString).once('value').then(function(snapshot){
    var progressObject = snapshot.val();
	var progressList = document.getElementById('progressList');
	var progressPagination = document.getElementById('progressPagination');
	var progressTable = document.getElementById('progressTable');
	var progressInfo = {};
	
	list =[];
	PageNumbers=[];
	progressList.innerHTML = '';
	progressPagination.innerHTML = "";
	progressTable.innerHTML = '<tr>'+
    '<th>Image</th>'+
     '<th>Title</th>'+
    '<th>Status</th>'+
    '<th>Date</th>'+
    '<th>Notes</th>'+
  '</tr>';
	
	if (progressObject){
    var keys = Object.keys(progressObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = progressObject[keys[i]];

      var progressID = currentObject.id;
      // var progressStatusEdit = progressID+currentObject.status;
      // var progressVisibilityEdit = progressID + currentObject.visibility;
      // // var progressImageURLEdit = progressID + currentObject.imgURL; 
      // var progressDateEdit = progressID+currentObject.date;
      // var progressNotesEdit = progressID+currentObject.notes+"1";
      // var progressSelectStatusEdit = progressID + "Status";
      // var progressEveryoneLabel = progressID + "LEveryone";
      // var progressUserOnlyLabel = progressID + "LMembers";
      // var progressEveryoneEdit = progressID + "Everyone";
      // var progressUserOnlyEdit = progressID + "Members";

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
								'<h4 class="text-center">No Data.' +
								'<a class="btn btn-link" data-toggle="modal" data-target="#addProgress">Create one</a></h4>' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error:[Project retrieve data] " +errorMessage);
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
								'<h6>Progress ID: ' +progressID+ '</h6>' +
								'<img src="'+progressImageURLEdit+'"class="img-thumbnail contentImage">' +
								'<h3>' + '<input id="\''+progressTitleEdit+'\'" value="'+title+'" class="text-capitalize" readonly required>' + '</h3>'+
								''+ (status === "completed" ? '<h6>' + '<input id="\''+progressStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>'+'</h6>': '<h6>'+'<input id="\''+progressStatusEdit+'\'" value="In progress" class="text-capitalize" readonly required>'+'</h6>')+''+
								'<select id="\''+progressSelectStatusEdit+'\'" class="hidden"><option id="\''+progressSelectStatusEdit+'\'5" value="5%">5%</option><option id="\''+progressSelectStatusEdit+'\'25" value="25%">25%</option><option id="\''+progressSelectStatusEdit+'\'50" value="50%">50%</option><option id="\''+progressSelectStatusEdit+'\'75" value="75%">75%</option><option id="\''+progressSelectStatusEdit+'\'100" value="completed">Completed</option></select></h6>' +
								'<div class="progress">'+
								''+ (status === "completed" ? '<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>' : '<div class="progress-bar" role="progressbar" style="width: '+status+';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">'+status+'</div>') +''+
								'</div>'+
								//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time ">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-eye-open ">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
								'<label id="\''+progressEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressEveryoneEdit+'\'" name="\''+progressID+"visibility"+'\'" checked>Everyone </label>' +
								'<label id="\''+progressUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressUserOnlyEdit+'\'" name="\''+progressID+"visibility"+'\'">Members</label></span>' +
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
								'<a href="#" onclick="selectProgressImages(\''+progressID+'\')" data-toggle="modal" data-target="#progressShowMore" class="a btn btn-success">Show more</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+progressID+'\', \''+progressEveryoneEdit+'\',\''+progressUserOnlyEdit+'\',\''+progressSelectStatusEdit+'\',\''+progressDateEdit+'\',\''+progressNotesEdit+'\',\''+progressTitleEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+progressID+'\',\''+progressVisibilityEdit+'\',\''+progressEveryoneLabel+'\',\''+progressUserOnlyLabel+'\',\''+progressStatusEdit+'\',\''+progressSelectStatusEdit+'\',\''+progressNotesEdit+progressID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProgress(\''+progressID+'\',\''+progressVisibilityEdit+'\',\''+progressEveryoneLabel+'\',\''+progressUserOnlyLabel+'\',\''+progressStatusEdit+'\',\''+progressSelectStatusEdit+'\',\''+progressNotesEdit+progressID+'\',\''+status+'\',\''+visibility+'\',\''+progressEveryoneEdit+'\',\''+progressUserOnlyEdit+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProgress(\''+progressID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'<div>'+ 
							  	'<h6>Last modified on '+updatedtime+'</h6>'+
							  	'</div>'+
							  	'</div>' +
								'</div>';	

    	// progressList.innerHTML +='<div class="col-md-4">' +
    	// 						'<div class="well box-style-2" id="\''+progressID+'\'">'+
					// 			'<h6>Progress ID: ' +progressID+ '</h6>' +
					// 			'<img src="'+progressImageURLEdit+'"class="img-thumbnail contentImage">' +
					// 			'<h3>' + '<input id="\''+progressStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>' +
					// 			'<select id="\''+progressSelectStatusEdit+'\'" class="hidden"> <option value="completed">Completed</option> <option value="in progress">In progress</option> <option value="deferred">Deferred</option></select></h3>' +
					// 			//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
					// 			'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</span>' +
					// 			'<br></br>' +
					// 			'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
					// 			'<label id="\''+progressEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressEveryoneEdit+'\'" name="\''+progressID+"visibility"+'\'" checked>Everyone </label>' +
					// 			'<label id="\''+progressUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+progressUserOnlyEdit+'\'" name="\''+progressID+"visibility"+'\'">Members</label></span>' +
					// 			'<br></br>' +
					// 			'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+progressNotesEdit+'\'" value="'+notes+'"  readonly>' + '</span>' +
					// 			'<br></br>' +
					// 			'<a href="#" onclick="selectProgressImages(\''+progressID+'\')" data-toggle="modal" data-target="#progressShowMore" class="a btn btn-success">Show more</a>' + " " + 
					// 			'<a href="#" onclick="saveEdit(\''+progressID+'\', \''+progressEveryoneEdit+'\',\''+progressUserOnlyEdit+'\',\''+progressSelectStatusEdit+'\',\''+progressDateEdit+'\',\''+progressNotesEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
					// 			'<a href="#" onclick="cancelEdit(\''+progressID+'\',\''+progressVisibilityEdit+'\',\''+progressEveryoneLabel+'\',\''+progressUserOnlyLabel+'\',\''+progressStatusEdit+'\',\''+progressSelectStatusEdit+'\')" class="a btn btn-danger">cancel</a>' + " " + 
					// 			'<div class="btn-group action-btn">' +
					// 			'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
					// 			'<ul class="dropdown-menu">' +
					// 		    '<li><a href="#" onclick="editProgress(\''+progressID+'\',\''+progressVisibilityEdit+'\',\''+progressEveryoneLabel+'\',\''+progressUserOnlyLabel+'\',\''+progressStatusEdit+'\',\''+progressSelectStatusEdit+'\')">Edit</a></li>'+
					// 		    '<li role="separator" class="divider"></li>'+
					// 		    '<li><a href="#" onclick="deleteProgress(\''+progressID+'\')" >Delete</a></li>' +
					// 		  	'</ul>'+
					// 		  	'</div>' +
					// 		  	'</div>' +
					// 			'</div>';	

			progressTable.innerHTML += 
  '<tr>'+
     '<td width="300" height="300"><img src="'+progressImageURLEdit+'" width="150" /></td>'+
     '<td>'+title+'</td>'+
    '<td>'+status+'</td>'+
    '<td>'+date+'</td>'+
    '<td>'+notes+'</td>'+
     '</tr>';


			}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error:[Project retrieve image] " +errorMessage);
  });
}

// Delete progress
function deleteProgress(progressId) {
	var result = confirm("Are you sure to delete this item?\nYou will not be able to recover this information!");
	if (result) {
    //Logic to delete the item
    newProgressRef.child(queryString).child(progressId).remove()
  		.then(function() {
  		progressAddonImages.child(progressId).remove();
    	//alert("Remove succeeded.");
    	var progressAlert = document.getElementById("progress-green-alert2");
		progressAlert.classList.remove("hidden");
    	fetchProgress(queryString);
  	})
  		.catch(function(error) {
    	alert("Remove failed: " + error.message);
  	});
		// Create a reference to the file to delete
		var desertRef = progressStorageRef.child(`${UID}/${queryString}/${progressId}/`)

		desertRef.listAll().then(function (result) {
            result.items.forEach(function (file) {
              file.delete();
            });
        }).catch(function (error) {
            // Handle any errors
           alert("Remove image failed: " + error.message);
        });

  // 		// Create a reference to the file to delete
		// var desertRef = progressStorageRef.child(`${UID}/${projTitle}/${progressId}/logo.png (1611814328718)`);

		// // Delete the file
		// desertRef.delete().then(() => {
		//   // File deleted successfully
		// }).catch((error) => {
		//   // Uh-oh, an error occurred!
		//   alert("Remove image failed: " + error.message);
		// });
	}

}
	

// Edit progress
function editProgress(progressId,visibility,vEveryone,vUserOnly,progressStatusView,progressStatusEdit,readmore,status,checkVisibility,progressEveryoneEdit,progressUserOnlyEdit) {
	var form = document.getElementById('\''+progressId+'\'');
	var ipt = form.getElementsByTagName('input');

	var s = document.getElementById('\''+progressStatusView+'\'');
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
	var vProgressStatus = document.getElementById('\''+progressStatusEdit+'\'');
	vEveryoneEdit.classList.remove("hidden");
	vUserOnlyEdit.classList.remove("hidden");
	vProgressStatus.classList.remove("hidden");
	var readmore = document.getElementById('\''+readmore+'\'');
	readmore.classList.add("hidden");


	var in_5 = document.getElementById('\''+progressStatusEdit+'\'5');
	var in_25 = document.getElementById('\''+progressStatusEdit+'\'25');
	var in_50 = document.getElementById('\''+progressStatusEdit+'\'50');
	var in_75 = document.getElementById('\''+progressStatusEdit+'\'75');
	var completed = document.getElementById('\''+progressStatusEdit+'\'100');
	var everyone = document.getElementById('\''+progressEveryoneEdit+'\'');
	var useronly = document.getElementById('\''+progressUserOnlyEdit+'\'');
	switch(status) {
		case '5%':
		in_5.selected = true;
		break;
		case '25%':
		in_25.selected = true;
		break;
		case '50%':
		in_50.selected = true;
		break;
		case '75%':
		in_75.selected = true;
		break;
		case 'completed':
		completed.selected = true;
		break;
		default:
		console.log(`Sorry, we are out of ${status}.`);
	}
	switch(checkVisibility) {
		case 'true':
		everyone.checked = true;
		break;
		case 'false':
		useronly.checked = true;
		break;
		default:
		console.log(`Sorry, we are out of ${checkVisibility}.`);
	}
	
}

// cancel edit
function cancelEdit(progressId,visibility,vEveryone,vUserOnly,progressStatusView,progressStatusEdit,readmore) {
	var s = document.getElementById('\''+progressStatusView+'\'');
	s.classList.remove("hidden");

	var v = document.getElementById('\''+visibility+'\'');
	v.classList.remove("hidden");
	var form = document.getElementById('\''+progressId+'\'');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
	var vEveryoneEdit = document.getElementById('\''+vEveryone+'\'');
	var vUserOnlyEdit = document.getElementById('\''+vUserOnly+'\'');
	var vProgressStatus = document.getElementById('\''+progressStatusEdit+'\'');
	vEveryoneEdit.classList.add("hidden");
	vUserOnlyEdit.classList.add("hidden");
	vProgressStatus.classList.add("hidden");
	// fetchProgress(queryString);
	var readmore = document.getElementById('\''+readmore+'\'');
	readmore.classList.remove("hidden");
}

// save edit
function saveEdit(progressID,progressEveryoneEdit,progressUserOnlyEdit,progressStatusEdit,progressDateEdit,progressNotesEdit,progressTitleEdit) {
	var form = document.getElementById('\''+progressID+'\'');
	var progressEveryone = document.getElementById('\''+progressEveryoneEdit+'\'').checked;
	var progressUserOnly = document.getElementById('\''+progressUserOnlyEdit+'\'').checked;
	var progressStatus = document.getElementById('\''+progressStatusEdit+'\'').value;
	var progressDate = document.getElementById('\''+progressDateEdit+'\'').value;
	var progressNotes = document.getElementById('\''+progressNotesEdit+'\'').value;
	var progressTitle = document.getElementById('\''+progressTitleEdit+'\'').value;
	var newDate = new Date();
	var updatedtime =newDate.getDate()+"/"+(newDate.getMonth()+1)+"/"+newDate.getUTCFullYear()+ " at " +newDate.getHours()+":"+ newDate.getMinutes() ;

	var visibility = true;

	if (progressEveryone == true) {
		visibility = true;
	}else{
		visibility = false;
	}

	var progress = {
	title:progressTitle,
	visibility: visibility,
	date: progressDate,
	id: progressID,
	// imgURL: imageURL,
	notes: progressNotes,
	status: progressStatus,
	updatedtime:updatedtime
}

	

	if (progressDate !="" && progressTitle !="") {


			// save data to firebase
			newProgressRef.child(queryString).child(progressID).set(progress,function(error) {
			if (error) {
				alert("Error!");
			} else {
				// retrieve data
				fetchProgress(queryString);
				var progressAlert = document.getElementById("progress-green-alert3");
				progressAlert.classList.remove("hidden");
			}
		});
	}
}

/* Progress Image show more when clicked */
function selectProgressImages(progressId){
  firebase.database().ref('/Project add on image/' + progressId).once('value').then(function(snapshot){
    var progressImageObject = snapshot.val();
    var progressImageList = document.getElementById('progressImageDetails');
    var keys = Object.keys(progressImageObject);

    // Hide images //
    progressImageList.innerHTML ='<div class="form-group">'+
                '<label for="progressUploadAddOnImages">Upload Images * (Image Only)</label>'+
                '<input type="file" class="upload-group" id="progressUploadAddOnImages" required multiple>'+
                '<br>'+
                '<a href="#"class="btn btn-success" onclick="addProgressImages(\''+progressId+'\',\''+keys.length+'\')">'+'Add</a>'+'</div>'+'<br>' +
             '</div>';

    // Show images //
    for (var i = 0; i < keys.length; i++){

     var currentObject = progressImageObject[keys[i]];

     var progressImageId = currentObject.id;

     var progressImageURLEdit = currentObject.imgURL; 

     var progressImageFilename = currentObject.filename;
    
    progressImageList.innerHTML += '<div>'+
    '<img src="'+progressImageURLEdit+'" class="img-thumbnail contentImage">'+
    '<h6>Filename: ' +progressImageFilename+ '</h6>' +
    '<a href="#"class="btn btn-danger" onclick="deleteProgressImages(\''+progressId+'\',\''+progressImageFilename+'\',\''+progressImageId+'\',\''+keys.length+'\')">'+'Delete</a>'+'</div>'+'<br>' ;

}
    
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// Add progress Image individually
function addProgressImages(progressId,keys){
	// input file
	var selectedFiles = document.querySelector('#progressUploadAddOnImages').files;
	var selectedFile = document.querySelector('#progressUploadAddOnImages').files[0];
	var count = 0;
	var fileLength = selectedFiles.length;

	if(fileLength<=5 && keys<=5) {
	if (selectedFile != null && selectedFile.type.match('image')) {

	for (var i = 0; i < selectedFiles.length;i++) {
		var file = selectedFiles[i];
		// get file name && timestamp
		var fullPaths = document.getElementById("progressUploadAddOnImages").files[i].name;
		var filenames = "";
		if (fullPaths) {
		    filenames = fullPaths +" (" + Date.now() + ")";
		}
if (selectedFiles[i].type.match('image')){
	//Add Image data
	count++;
	addImageData(progressId,filenames,selectedFiles[i],count,fileLength);

} else {
	alert("Please check your image type");
}
}
}else{
	alert("Please check your image type");
} 
} else {
	alert("You can only upload a maximum of 5 images");
}
}

// Delete progress Image individually
function deleteProgressImages(progressId,filename,id,keys) {
		if (keys > 1) {
	    // Create a reference to the file to delete
		var desertRef = progressStorageRef.child(`${UID}/${queryString}/${progressId}/${filename}`);
		// Delete the file
		desertRef.delete().then(() => {
			progressAddonImages.child(progressId).child(id).remove();
			fetchProgress(queryString);
			selectProgressImages(progressId);
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