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
var userId = localStorage.getItem("idToPass");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchDefects(userId);
	}else{
		window.location='index.html';
	}
});

function fetchDefects(userId){
	firebase.database().ref('/Pending/' + userId).once('value').then(function(snapshot){
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
    }

     var listslice = list.slice(
       indexOfFirstDevice,
      indexOfLastDevice
      );
    listslice.map(function(item,index) {
    defectList.innerHTML +='<div class="col-md-6">' +
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
                '<a href="#" onclick="enterDefect(\''+item.defectID+'\',\''+item.title+'\')" class="btn btn-success">Enter</a>' + " " + 
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
								'</div>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function enterDefect(defId,defTitle) {
	var value1 = defId;
	var value2 = defTitle;
	
  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mDefectAddOn.html" ;
    
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
defectList.innerHTML +='<div class="col-md-6">' +
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
                '<a href="#" onclick="enterDefect(\''+item.defectID+'\',\''+item.title+'\')" class="btn btn-success">Enter</a>' + " " + 
                  '</div>' +
                '</div>';
});
}