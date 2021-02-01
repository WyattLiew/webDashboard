
firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    queryProjectDatabase(UID);
    queryDefectDatabase(UID);
    checkAdmin(UID);
	}else{
    window.location='index.html';
	}
});

function checkAdmin(currentUser){
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot){
    var usersObject = snapshot.val();
    
    var isAdmin = snapshot.child("isAdmin").val();
    if(isAdmin == true){
      document.getElementById("paging-users").classList.remove("hidden");
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });
}

// shortcut change page button
document.getElementById("paging-defects").addEventListener('click', changePageToDefects);

function changePageToDefects () {

	window.location.href = "defectList.html" ;
}
// shortcut change page button
document.getElementById("paging-users").addEventListener('click', changePageToUsers);

function changePageToUsers () {

  window.location.href = "monitoring.html" ;
}
/* Project overview   */
function queryProjectDatabase(UID){
  firebase.database().ref('/Projects/' + UID).once('value').then(function(snapshot){
    var projectObject = snapshot.val();

   var overviewProj = document.getElementById("overviewProj");
   var overviewClient = document.getElementById("overviewClient");
   var clientDetails = document.getElementById("clientDetails");
   overviewClient.innerHTML= "";
   overviewProj.innerHTML = "";
   clientDetails.innerHTML = '<tr>'+
               			 	'<th>'+"Name"+'</th>'+
               			 	'<th>'+"Email"+'</th>'+
                			'<th>'+"Number"+'</th>'+
                			'<th>'+"Project title"+'</th>'+
             				'</tr>';
    if (projectObject) {
    var keys = Object.keys(projectObject);
   
     overviewProj.innerHTML = '<h2 id="overviewProj"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>'+" " + keys.length +'</h2>';
     overviewClient.innerHTML = '<h2 id="overviewClient"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' +" " + keys.length +'</h2>';
     for (var i = 0; i < keys.length; i++){
     	var currentObject = projectObject[keys[i]];

     	clientDetails.innerHTML += '<td>'+ currentObject.name+'</td>'+'<td>'+ currentObject.email+'</td>'+'<td>'+ currentObject.number+'</td>'+
     								'<td>'+ currentObject.title+'</td>';				
     }
     clientDetails.innerHTML += '</tr>';
}else {
	overviewProj.innerHTML = '<h2 id="overviewProj"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>'+" " + "0" +'</h2>';
	overviewClient.innerHTML = '<h2 id="overviewClient"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' +" " + "0" +'</h2>';
	clientDetails.innerHTML = '<tr>'+
               			 	'<th>'+"Name"+'</th>'+
               			 	'<th>'+"Email"+'</th>'+
                			'<th>'+"Number"+'</th>'+
                			'<th>'+"Project title"+'</th>'+
             				'</tr>';
}
       

  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
  });
}

/* Defect overview   */
function queryDefectDatabase(UID){
  firebase.database().ref('/Pending/' + UID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    var overviewDef = document.getElementById("overviewDef");
    overviewDef.innerHTML = "";
if (defectObject) {
    var keys = Object.keys(defectObject);
    overviewDef.innerHTML = '<h2 id="overviewProj"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'+" " + keys.length +'</h2>';
}else{

   	overviewDef.innerHTML = '<h2 id="overviewProj"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'+" " + "0" +'</h2>';
}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
  });
}