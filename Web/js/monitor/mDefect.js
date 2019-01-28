// Get a database reference to projects
var db = firebase.database();

// get id
var userId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchDefects(userId);
	}else{
		//
	}
});

function fetchDefects(userId){
	firebase.database().ref('/Pending/' + userId).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
	var defectList = document.getElementById('defectList');
	defectList.innerHTML = '';

	if (defectObject){
    var keys = Object.keys(defectObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = defectObject[keys[i]];
      var defectID = currentObject.id;
      var defectTitleEdit = defectID+currentObject.title;
      var defectDescEdit = defectID+currentObject.description+"1";
      var defectCliNameEdit = defectID+currentObject.name;
      var defectCliNumEdit = defectID+currentObject.number;
      var defectCliEmailEdit = defectID+currentObject.email;
      var defectLocationEdit = defectID+currentObject.location;
      var defectDateEdit = defectID+currentObject.date;
      var defectNotesEdit = defectID+currentObject.notes+"1";

    defectList.innerHTML +='<div class="col-md-6">' +
    							'<div class="well box-style-2" id="\''+defectID+'\'">'+
								'<h6>Defect ID: ' + currentObject.id + '</h6>' +
								'<h3>' + '<input id="\''+defectTitleEdit+'\'" value="'+currentObject.title+'" class="text-capitalize title-size" readonly required>' + '</h3>'+
								'<h5>' + "Description: " + '<input id="\''+defectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+defectDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-user col-md-6 ">'+ " " +'<input id="\''+defectCliNameEdit+'\'" value="'+currentObject.name+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-earphone col-md-6">' + " " +'<input id="\''+defectCliNumEdit+'\'" type="number" value="'+currentObject.number+'" readonly required>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-envelope col-md-6">' + " " +'<input id="\''+defectCliEmailEdit+'\'" type="email" value="'+currentObject.email+'"  readonly required>' + "</span>" +
								'<br></br>' +
								'<span class="glyphicon glyphicon-flag col-md-6">' + " " +'<input id="\''+defectLocationEdit+'\'" value="'+currentObject.location+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+defectNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="enterDefect(\''+defectID+'\')" class="btn btn-success">Enter</a>' + " " + 
							  	'</div>' +
								'</div>';
    }
    }else {
		defectList.innerHTML ='<div class="col-md-12">'+
								'<h4 class="text-center">There are no defect yet.' +
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function enterDefect(defId) {
	var value1 = defId;
	//var value2 = defTitle;
	
  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    //localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mDefectAddOn.html" ;
    
}