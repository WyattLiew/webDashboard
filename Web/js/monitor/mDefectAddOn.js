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
var defTitle = localStorage.getItem("objectToPass");
var defectId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchDefDetails(defectId);

    var titleName = document.getElementById("titleName");
titleName.innerHTML = '<h3>'+defTitle+'</h3>';
	}else{
		window.location='index.html';
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
      
      var progressInfo = {
       defDetailsID:currentObject.id,
   defDetailsTitleEdit:defDetailsID + currentObject.defect,
      defDetailsStatusEdit:defDetailsID+currentObject.status,
      defDetailsVisibilityEdit:defDetailsID + currentObject.visibility,
      // var defDetailsImageURLEdit = defDetailsID + currentObject.imgURL; 
      defDetailsDateEdit:defDetailsID+currentObject.date,
      defDetailsNotesEdit:defDetailsID+currentObject.notes+"1",
      defDetailsSelectStatusEdit:defDetailsID + "Status",
      defDetailsEveryoneLabel:defDetailsID + "LEveryone",
      defDetailsUserOnlyLabel:defDetailsID + "LMenbers",
      defDetailsEveryoneEdit:defDetailsID + "Everyone",
      defDetailsUserOnlyEdit:defDetailsID + "Members",
        status:currentObject.status,
        notes:currentObject.notes,
        visibility:currentObject.visibility,
        date:currentObject.date,
        defect:currentObject.defect,
        updatedtime:currentObject.updatedtime
  };

 list.push(progressInfo);

      // checkImage(defDetailsID,defDetailsTitleEdit,defDetailsStatusEdit,defDetailsVisibilityEdit,defDetailsDateEdit,defDetailsNotesEdit,defDetailsSelectStatusEdit,defDetailsEveryoneLabel,defDetailsUserOnlyLabel,defDetailsEveryoneEdit,defDetailsUserOnlyEdit,currentObject.status,currentObject.notes,currentObject.visibility,currentObject.date,currentObject.defect);


    }

    var listslice = list.slice(
       indexOfFirstDevice,
      indexOfLastDevice
      );
    listslice.map(function(item,index) {
      checkImage(item.defDetailsID,item.defDetailsTitleEdit,item.defDetailsStatusEdit,item.defDetailsVisibilityEdit,item.defDetailsDateEdit,item.defDetailsNotesEdit,item.defDetailsSelectStatusEdit,item.defDetailsEveryoneLabel,item.defDetailsUserOnlyLabel,item.defDetailsEveryoneEdit,item.defDetailsUserOnlyEdit,item.status,item.notes,item.visibility,item.date,item.defect,item.updatedtime);
    });


    // pagination
    for (let i = 1; i <= Math.ceil(list.length / devicesPerPage); i++) {
    PageNumbers.push(i);
  }
    var progressPagination = document.getElementById('progressPagination');
    progressPagination.innerHTML = '';

  PageNumbers.map(function(item,index){
    progressPagination.innerHTML += 
      '<li class="page-item" id="\''+item+'\'"><a class="page-link" href="#" onclick="pagination(\''+item+'\',\''+PageNumbers.length+'\')">'+item+'</a></li>';
  });

  var active = document.getElementById('\''+1+'\'');
  active.classList.add("active");

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

// check Image
function checkImage(defDetailsID,defDetailsTitleEdit,defDetailsStatusEdit,defDetailsVisibilityEdit,defDetailsDateEdit,defDetailsNotesEdit,defDetailsSelectStatusEdit,defDetailsEveryoneLabel,defDetailsUserOnlyLabel,defDetailsEveryoneEdit,defDetailsUserOnlyEdit,status,notes,visibility,date,defect,updatedtime) {
  var defDetailsImageURLEdit = 'https://firebasestorage.googleapis.com/v0/b/mproject-sharedb.appspot.com/o/Profile%20Picture%2Fempty.jpg?alt=media&token=572e9479-e896-4104-a90b-4a60ad70083d';
  firebase.database().ref('/Defect add on image/' + defDetailsID).once('value').then(function(snapshot){
    var defDetailsImageObject = snapshot.val();
 var imagekeys = Object.keys(defDetailsImageObject);

    var currentImageObject = defDetailsImageObject[imagekeys[0]];
     
      defDetailsImageURLEdit = currentImageObject.imgURL; 

      defDetailsList.innerHTML +='<div class="col-md-4">' +
                 '<div class="card card-body box-style-2" id="\''+defDetailsID+'\'">'+
                '<h6>Defect ID: ' + defDetailsID + '</h6>' +
                '<img src="'+defDetailsImageURLEdit+'"class="img-thumbnail contentImage">' +
                '<h3 class="pt-2">' + '<input id="\''+defDetailsTitleEdit+'\'" value="'+defect+'" class="text-capitalize" readonly required>' + '</h3>'+
                ''+ (status === "completed" ? '<h6>' + '<input id="\''+defDetailsStatusEdit+'\'" value="'+status+'" class="text-capitalize" readonly required>'+'</h6>': '<h6>'+'<input id="\''+defDetailsStatusEdit+'\'" value="In progress" class="text-capitalize" readonly required>'+'</h6>')+''+
                '<select id="\''+defDetailsSelectStatusEdit+'\'" class="hidden"> <option id="\''+defDetailsSelectStatusEdit+'\'5" value="5%">5%</option><option id="\''+defDetailsSelectStatusEdit+'\'25" value="25%">25%</option><option id="\''+defDetailsSelectStatusEdit+'\'50" value="50%">50%</option><option id="\''+defDetailsSelectStatusEdit+'\'75" value="75%">75%</option><option id="\''+defDetailsSelectStatusEdit+'\'100" value="completed">Completed</option></select></h6>' +
                '<div class="progress">'+
                ''+ (status === "completed" ? '<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>' : '<div class="progress-bar" role="progressbar" style="width: '+status+';" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">'+status+'</div>') +''+
                '</div>'+
                //'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
                '<i class="fa fa-calendar py-3">' +" "+ '<input id="\''+defDetailsDateEdit+'\'" type="Date" value="'+date+'"  readonly required>' + '</i>' +

                '<i class="fa fa-eye pb-3">' + " " +'<input id="\''+defDetailsVisibilityEdit+'\'" type="text" value="'+getVisibility(visibility)+'" class="text-uppercase" readonly required>' + 
                '<label id="\''+defDetailsEveryoneLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsEveryoneEdit+'\'" name="\''+defDetailsID+"visibility"+'\'" checked>Everyone </label>' +
                '<label id="\''+defDetailsUserOnlyLabel+'\'" class="radio-inline hidden"><input type="radio" id="\''+defDetailsUserOnlyEdit+'\'" name="\''+defDetailsID+"visibility"+'\'">Menbers</label></i>' +

                '<i class="fa fa-comment pb-3">' + " " +''+
                '<input class="" id="\''+defDetailsNotesEdit+'\'" value="'+notes+'"  readonly></i>'+
                '<div id="\''+defDetailsNotesEdit+defDetailsID+'\'">'+
                '<p>'+
                '<a data-toggle="collapse" href="'+"#"+defDetailsID+'" role="button" aria-expanded="false" aria-controls="collapseExample">Read more</a>'+
                '</p>'+
                '<div class="collapse" id="'+defDetailsID+'">'+
                  '<div class="card card-body">'+notes+'</div>'+
                '</div>'+
                '</div>'+
                
                '<a href="#" onclick="selectDefDetailsImages(\''+defDetailsID+'\')" data-toggle="modal" data-target="#defDetailsShowMore" class="a btn btn-success my-3">Show more</a>' + " " + 
                  '<div>'+ 
                  '<h6 class="">Last modified on '+updatedtime+'</h6>'+
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
  defDetailsList.innerHTML ='';

  //calculate page
  indexOfLastDevice = currentDevice * devicesPerPage;
  indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

  //re-run html
  var listslice = list.slice(
      indexOfFirstDevice,
        indexOfLastDevice
      );

    listslice.map(function(item,index) {
      checkImage(item.defDetailsID,item.defDetailsTitleEdit,item.defDetailsStatusEdit,item.defDetailsVisibilityEdit,item.defDetailsDateEdit,item.defDetailsNotesEdit,item.defDetailsSelectStatusEdit,item.defDetailsEveryoneLabel,item.defDetailsUserOnlyLabel,item.defDetailsEveryoneEdit,item.defDetailsUserOnlyEdit,item.status,item.notes,item.visibility,item.date,item.defect,item.updatedtime);
    });

}