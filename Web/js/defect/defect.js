
// Get a database reference to defects
var db = firebase.database();
var newDefectRef = db.ref("Pending");
var newDefDetailsRef = db.ref("Defect Add On");
var defDetailsAddonImages = db.ref("Defect add on image"); 
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
    
    fetchDefects(UID);
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

document.getElementById('defectInputForm').addEventListener('submit',saveDefect);
projSubmitProgress = document.getElementById("submitProgress");
projAddBtn = document.getElementById("add-btn");

function saveDefect(e){
	var defTitle = document.getElementById('defectTitleInput').value;
	// var defDesc = document.getElementById('defectDescInput').value;
	var defCliName = document.getElementById('defectCliNameInput').value;
	var defCliNum = document.getElementById('defectCliNumInput').value;
	var defCliEmail = document.getElementById('defectCliEmailInput').value;
	var defLocation = document.getElementById('defectLocationInput').value;
	var defDate = document.getElementById('defectDateInput').value;
	// var defNotes = document.getElementById('defectNotesInput').value;
	var defectId = newDefectRef.push().key;
	

	var defect = {
		date: defDate,
		// description: defDesc,
		email: defCliEmail,
		id: defectId,
		location: defLocation,
		name: defCliName,
		// notes: defNotes,
		number: defCliNum,
		title: defTitle
	}

	e.preventDefault();

	if (defTitle !="" && defTitle.length >1 && 
		defCliName.length >1 && defCliName !="" && 
		defCliNum !="" && defCliEmail !="" &&
		defLocation !="" && defDate !="") {
		// Show progress
		//projSubmitProgress.style.display="inline-block";
		//projAddBtn.style.display="none";

		// save data to firebase
		newDefectRef.child(UID).child(defectId).set(defect,function(error) {
			if (error) {
				alert("Error!:" +error);
			} else {
				// Reset field
				document.getElementById('defectInputForm').reset();
				// retrieve data
				fetchDefects(UID);
				//alert("Save Successfully!");
				var defAlert = document.getElementById("def-green-alert1");
				defAlert.classList.remove("hidden");
				//projSubmitProgress.style.display="none";
				//projAddBtn.style.display="inline-block";
			}
		});
	} 
}

function fetchDefects(UID){
	firebase.database().ref('/Pending/' + UID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
	var defectList = document.getElementById('defectList');
	var progressPagination = document.getElementById('progressPagination');

	list =[];
	PageNumbers=[];
	progressPagination.innerHTML = "";
	defectList.innerHTML = '';

	if (defectObject){
    var keys = Object.keys(defectObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = defectObject[keys[i]];
      var defectID = currentObject.id;

      var info = {
      	defectID:currentObject.id,
      defectTitleEdit:defectID+currentObject.title,
      // var projectDescEdit = projectID+currentObject.description+"1";
      defectCliNameEdit:defectID+currentObject.name,
      defectCliNumEdit:defectID+currentObject.number,
      defectCliEmailEdit:defectID+currentObject.email,
      defectLocationEdit:defectID+currentObject.location,
      defectDateEdit:defectID+currentObject.date,
      // var projectNotesEdit = projectID+currentObject.notes+"1";
      	name:currentObject.name,
      	number:currentObject.number,
      	email:currentObject.email,
      	date:currentObject.date,
      	location:currentObject.location,
      	title:currentObject.title
	};

       list.push(info);

      // defectList.innerHTML +='<div class="col-md-6">' +
    		// 					'<div class="well box-style-2" id="\''+defectID+'\'">'+
						// 		'<h6>Defect ID: ' + currentObject.id + '</h6>' +
						// 		'<h3>' + '<input id="\''+defectTitleEdit+'\'" value="'+currentObject.title+'" class="text-capitalize title-size" readonly required>' + '</h3>'+
						// 		// '<h5>' + "Description: " + '<input id="\''+defectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
						// 		'<input id="\''+defectDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + 
						// 		'<br></br>' +
						// 		'<div>'+
						// 		'<p>'+
						// 		'<a data-toggle="collapse" href="'+"#"+defectID+defectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
						// 		'</p>'+
						// 		'<div class="collapse" id="'+defectID+defectID+'">'+
  				// 				'<div class="card card-body">'+
  				// 				'<span class="glyphicon glyphicon-user"></span>' + " " +''+
  				// 				'<input id="\''+defectCliNameEdit+'\'" value="'+currentObject.name+'"  readonly required>'+
  				// 				'<br></br>' +
  				// 				'<span class="glyphicon glyphicon-earphone"></span>' + " " +''+
  				// 				'<input id="\''+defectCliNumEdit+'\'" type="number" value="'+currentObject.number+'" readonly required>'+
  				// 				'<br></br>' +
  				// 				'<span class="glyphicon glyphicon-envelope"></span>' + " " +''+
  				// 				'<input id="\''+defectCliEmailEdit+'\'" type="email" value="'+currentObject.email+'"  readonly required>' + "</span>" +
  				// 				'<br></br>' +
  				// 				'<span class="glyphicon glyphicon-flag"></span>' + " " +''+
  				// 				'<input id="\''+defectLocationEdit+'\'" value="'+currentObject.location+'"  readonly required>' + '</span>' +
  				// 				'<br></br>' +
  				// 				'</div>'+
						// 		'</div>'+
						// 		'</div>'+
						// 		'<a href="#" onclick="enterDefect(\''+defectID+'\',\''+currentObject.title+'\')" class="a btn btn-success">Enter</a>' + " " + 
						// 		'<a href="#" onclick="saveEdit(\''+defectID+'\',\''+defectTitleEdit+'\',\''+defectCliNameEdit+'\',\''+defectCliNumEdit+'\',\''+defectCliEmailEdit+'\',\''+defectLocationEdit+'\',\''+defectDateEdit+'\')" class="a btn btn-success">Save</a>' + " " + 
						// 		'<a href="#" onclick="cancelEdit(\''+defectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
						// 		'<div class="b btn-group action-btn">' +
						// 		'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
						// 		'<ul class="dropdown-menu">' +
						// 	    '<li><a href="#" onclick="editDefect(\''+defectID+'\')">Edit</a></li>'+
						// 	    '<li role="separator" class="divider"></li>'+
						// 	    '<li><a href="#" onclick="deleteDefect(\''+defectID+'\')" >Delete</a></li>' +
						// 	  	'</ul>'+
						// 	  	'</div>' +
						// 	  	'</div>' +
						// 		'</div>';
    }

     var listslice = list.slice(
     	 indexOfFirstDevice,
      indexOfLastDevice
     	);
    listslice.map(function(item,index) {
		defectList.innerHTML +='<div class="col-md-4">' +
    							'<div class="card card-body box-style-2" id="\''+item.defectID+'\'">'+
								'<h6>Defect ID: ' + item.defectID + '</h6>' +
								'<h3>' + '<input id="\''+item.defectTitleEdit+'\'" value="'+item.title+'" class="text-capitalize title-size" readonly required>' + '</h3>'+
								// '<h5>' + "Description: " + '<input id="\''+defectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<input id="\''+item.defectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
								
								'<div>'+
								'<p>'+
								'<a data-toggle="collapse" href="'+"#"+item.defectID+item.defectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
								'</p>'+
								'<div class="collapse pb-3" id="'+item.defectID+item.defectID+'">'+
  								'<div class="card card-body">'+
  								'<i class="fa fa-user pb-3">' + " " +''+
  								'<input id="\''+item.defectCliNameEdit+'\'" value="'+item.name+'"  readonly required></i>'+
  								
  								'<i class="fa fa-phone pb-3">' + " " +''+
  								'<input id="\''+item.defectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required></i>'+
  								
  								'<i class="fa fa-envelope pb-3">' + " " +''+
  								'<input id="\''+item.defectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</i>" +
  								
  								'<i class="fa fa-flag pb-3">' + " " +''+
  								'<input id="\''+item.defectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</i>' +
  								
  								'</div>'+
								'</div>'+
								'</div>'+
								'<a href="#" onclick="enterDefect(\''+item.defectID+'\',\''+item.title+'\')" class="a btn btn-success my-3">Enter</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+item.defectID+'\',\''+item.defectTitleEdit+'\',\''+item.defectCliNameEdit+'\',\''+item.defectCliNumEdit+'\',\''+item.defectCliEmailEdit+'\',\''+item.defectLocationEdit+'\',\''+item.defectDateEdit+'\')" class="a btn btn-success mb-3">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+item.defectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="b btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a class="dropdown-item" href="#" onclick="editDefect(\''+item.defectID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a class="dropdown-item" href="#" onclick="deleteDefect(\''+item.defectID+'\')" >Delete</a></li>' +
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
		defectList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no defect yet.' +
								'<a class="btn btn-link" data-toggle="modal" data-target="#addDefect">Create one</a></h4>' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function deleteDefect(defId) {
	var UID = firebase.auth().currentUser.uid;
	var result = confirm("Are you sure to delete this item?\nYou will not be able to recover this information!");
	if (result) {
    //Logic to delete the item
    newDefectRef.child(UID).child(defId).remove()
  		.then(function() {
  		// Remove image add on
  		newDefDetailsRef.child(defId).remove();
  		//defDetailsAddonImages.child(defDetailsId).remove();
    	//alert("Remove succeeded.");
    	var defAlert = document.getElementById("def-green-alert2");
		defAlert.classList.remove("hidden");
    	fetchDefects(UID);
  	})
  		.catch(function(error) {
    	console.log("Remove failed: " + error.message);
  	});
	}

}

function editDefect(defId) {
	var form = document.getElementById('\''+defId+'\'');

	var client = document.getElementById(`${defId+defId}`);
	client.classList.add("show");

	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=false;
	}
	form.classList.add("invert");
}

function cancelEdit(defId) {
	var form = document.getElementById('\''+defId+'\'');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
	fetchDefects(UID);
}

function saveEdit(defId,defectTitleEdit,defectCliNameEdit,defectCliNumEdit,defectCliEmailEdit,
	defectLocationEdit,defectDateEdit) {
	var UID = firebase.auth().currentUser.uid;
	var form = document.getElementById('\''+defId+'\'');
	var defTitle = document.getElementById('\''+defectTitleEdit+'\'').value;
	// var defDesc = document.getElementById('\''+defectDescEdit+'\'').value;
	var defCliName = document.getElementById('\''+defectCliNameEdit+'\'').value;
	var defCliNum = document.getElementById('\''+defectCliNumEdit+'\'').value;
	var defCliEmail = document.getElementById('\''+defectCliEmailEdit+'\'').value;
	var defLocation = document.getElementById('\''+defectLocationEdit+'\'').value;
	var defDate = document.getElementById('\''+defectDateEdit+'\'').value;
	// var defNotes = document.getElementById('\''+defectNotesEdit+'\'').value;


	var defect = {
		date: defDate,
		// description: defDesc,
		email: defCliEmail,
		id: defId,
		location: defLocation,
		name: defCliName,
		// notes: defNotes,
		number: defCliNum,
		title: defTitle
	}

	

	if (defTitle !="" && defCliName !="" && 
		defCliNum !="" && defCliEmail !="" &&
		defLocation !="" && defDate !="") {

		var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(reg.test(defCliEmail) == false) {
			alert('Invalid email address');
			defCliEmail.focus();
			return false;
		}else {
			// save data to firebase
			newDefectRef.child(UID).child(defId).set(defect,function(error) {
			if (error) {
				alert("Error!");
			} else {
				// retrieve data
				fetchDefects(UID);
				var defAlert = document.getElementById("def-green-alert3");
				defAlert.classList.remove("hidden");
			}
		});

		}
	}
}

function enterDefect(defId,defTitle) {
	var value1 = defId;
	var value2 = defTitle;
	
  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "defectAddOnList.html" ;
    
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
	defectList.innerHTML ='';

	//calculate page
	indexOfLastDevice = currentDevice * devicesPerPage;
	indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

	//re-run html
	var listslice = list.slice(
     	indexOfFirstDevice,
      	indexOfLastDevice
     	);

    listslice.map(function(item,index) {
defectList.innerHTML +='<div class="col-md-4">' +
    							'<div class="card card-body box-style-2" id="\''+item.defectID+'\'">'+
								'<h6>Defect ID: ' + item.defectID + '</h6>' +
								'<h3>' + '<input id="\''+item.defectTitleEdit+'\'" value="'+item.title+'" class="text-capitalize title-size" readonly required>' + '</h3>'+
								// '<h5>' + "Description: " + '<input id="\''+defectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<input id="\''+item.defectDateEdit+'\'" type="Date" value="'+item.date+'"  readonly required>' + 
								
								'<div>'+
								'<p>'+
								'<a data-toggle="collapse" href="'+"#"+item.defectID+item.defectID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Client Details</a>'+
								'</p>'+
								'<div class="collapse pb-3" id="'+item.defectID+item.defectID+'">'+
  								'<div class="card card-body">'+
  								'<i class="fa fa-user pb-3">' + " " +''+
  								'<input id="\''+item.defectCliNameEdit+'\'" value="'+item.name+'"  readonly required></i>'+
  								
  								'<i class="fa fa-phone pb-3">' + " " +''+
  								'<input id="\''+item.defectCliNumEdit+'\'" type="number" value="'+item.number+'" readonly required></i>'+
  								
  								'<i class="fa fa-envelope pb-3">' + " " +''+
  								'<input id="\''+item.defectCliEmailEdit+'\'" type="email" value="'+item.email+'"  readonly required>' + "</i>" +
  								
  								'<i class="fa fa-flag pb-3">' + " " +''+
  								'<input id="\''+item.defectLocationEdit+'\'" value="'+item.location+'"  readonly required>' + '</i>' +
  								
  								'</div>'+
								'</div>'+
								'</div>'+
								'<a href="#" onclick="enterDefect(\''+item.defectID+'\',\''+item.title+'\')" class="a btn btn-success my-3">Enter</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+item.defectID+'\',\''+item.defectTitleEdit+'\',\''+item.defectCliNameEdit+'\',\''+item.defectCliNumEdit+'\',\''+item.defectCliEmailEdit+'\',\''+item.defectLocationEdit+'\',\''+item.defectDateEdit+'\')" class="a btn btn-success mb-3">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+item.defectID+'\')" class="a btn btn-danger">cancel</a>' + " " + 
								'<div class="b btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a class="dropdown-item" href="#" onclick="editDefect(\''+item.defectID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a class="dropdown-item" href="#" onclick="deleteDefect(\''+item.defectID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';
});
}