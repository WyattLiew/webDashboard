var submitBtn = document.getElementById("referenceSubmitBtn");
var submitProgress = document.getElementById("submitProgress");
var trackingForm = document.getElementById("tracking-form");
var contentContainer = document.getElementById("contentContainer");
var defectsHeader = document.getElementById("defectsHeader");
var progressHeader = document.getElementById("progressHeader");
/* Show more images var */
var MoreImgElement = document.getElementById("detailsHolder");
var MoreImgCol;
var Moreimage;
var currentRow;


/*Login progress*/

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    let currentUser = firebase.auth().currentUser.uid;
    retrieveData(currentUser);

	}else{
		window.location='index.html';
	}
});

/*
 Home page reference ID part 1 
*/

function refSubmitclick() {
  var referenceID = document.getElementById("referenceIdText").value;
  var progress = document.getElementById("progress").checked;
  var defects = document.getElementById("defects").checked;

  if (referenceID !="" && progress == true) {
    submitBtn.style.display="none";
    submitProgress.style.display="inline-block";
    queryProgressDatabase(referenceID);
  }else if (referenceID !="" && defects ==true) {
    submitBtn.style.display="none";
    submitProgress.style.display="inline-block";
    queryDefectsDatabase(referenceID);
  }else{
    alert("Please check your reference id");
     submitBtn.style.display="inline-block";
  }
}

/* Defect details   */
function queryDefectsDatabase(referenceID){
  firebase.database().ref('/Defect Add On/' + referenceID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();

    trackingForm.style.display="none";
    contentContainer.classList.remove('hidden');
    var element = document.getElementById("contentHolder");
    element.innerHTML = "";
    var keys = Object.keys(defectObject);
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      var imageID = currentObject.id;
      var visibility = currentObject.visibility;
      // check visibility true || false
    if(visibility){
	element.innerHTML+='<div class="col-md-4">' +
						'<div class="well box-style-2">'+
		                '<img src="'+currentObject.imgURL+'"class="contentImage"">' +
		                '<h3 class="text-capitalize">' + currentObject.defect + '</h3>' +
		                '<p><span class="glyphicon glyphicon-time">' + " " + currentObject.date + '</span></p>' +
		                '<p><span class="glyphicon glyphicon-comment">' + " " + currentObject.notes + '</p>' +
		                '<a href="#" onclick="selectImages(\''+imageID+'\')" data-toggle="modal" data-target="#clientShowMore" class="btn btn-success">See more</a>';
		             }
       }
      
      submitBtn.style.display="inline-block";
      defectsHeader.style.display="inline-flex";

  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error : Please check your reference ID, it's case sensitive.");
     submitBtn.style.display="inline-block";
     submitProgress.style.display="none";
     trackingForm.style.display="block";
     contentContainer.classList.add('hidden');
  });
}

/* Defect Image show more when clicked */
function selectImages(id){
  firebase.database().ref('/Defect add on image/' + id).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    var keys = Object.keys(defectObject);

    // Hide images function //
    removeElement();
    // Show images //
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      
      if(i % 3 == 0){
          MoreImgCurrentRow = document.createElement("div");
          MoreImgCurrentRow.classList.add("row");
          MoreImgElement.append(MoreImgCurrentRow);
      }
      
      MoreImgCol = document.createElement("div");
      MoreImgCol.classList.add("col-lg-4");
      Moreimage = document.createElement("img");
      Moreimage.src = currentObject.imgURL;
      Moreimage.id  = currentObject.id;
      Moreimage.classList.add("contentImage");

      MoreImgCol.appendChild(Moreimage);
      MoreImgCurrentRow.append(MoreImgCol);
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// Hide images //
function removeElement(){
    while(MoreImgElement.hasChildNodes()){
    MoreImgElement.removeChild(MoreImgElement.firstChild);
  }
}



// Progress Add on //
function queryProgressDatabase(referenceID){
  firebase.database().ref('/Projects Add On/' + referenceID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();

     var element = document.getElementById("contentHolder");
     element.innerHTML = "";
     contentContainer.classList.remove('hidden');

    trackingForm.style.display="none";
    var keys = Object.keys(defectObject);

    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];

      var imageID = currentObject.id;
      var visibility = currentObject.visibility;
      // check visibility true || false
    if(visibility){
	element.innerHTML+='<div class="col-md-4">' +
						'<div class="well box-style-2">'+
		                '<img src="'+currentObject.imgURL+'"class="contentImage"">' +
		                '<h3 class="text-capitalize">' + currentObject.status + '</h3>' +
		                '<p><span class="glyphicon glyphicon-time">' + " " + currentObject.date + '</span></p>' +
		                '<p><span class="glyphicon glyphicon-comment">' + " " + currentObject.notes + '</p>' +
		                '<a href="#" onclick="selectProgressImages(\''+imageID+'\')" data-toggle="modal" data-target="#clientShowMore" class="btn btn-success">See more</a>';
		             }
    }
    submitBtn.style.display="inline-block";
      progressHeader.style.display="inline-flex";
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : Please check your reference ID, it's case sensitive.");
    submitBtn.style.display="inline-block";
    submitProgress.style.display="none";
     trackingForm.style.display="block";
     contentContainer.classList.add('hidden');
  });
}


/* Progress Image show more when clicked */
function selectProgressImages(id){
  firebase.database().ref('/Project add on image/' + id).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    var keys = Object.keys(defectObject);

    // Hide images function //
    removeElement();
    // Show images //
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      
      if(i % 3 == 0){
          MoreImgCurrentRow = document.createElement("div");
          MoreImgCurrentRow.classList.add("row");
          MoreImgElement.append(MoreImgCurrentRow);
      }
      
      MoreImgCol = document.createElement("div");
      MoreImgCol.classList.add("col-lg-4");
      Moreimage = document.createElement("img");
      Moreimage.src = currentObject.imgURL;
      Moreimage.id  = currentObject.id;
      Moreimage.classList.add("contentImage");

      MoreImgCol.appendChild(Moreimage);
      MoreImgCurrentRow.append(MoreImgCol);
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

