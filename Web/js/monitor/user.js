
// Get a database reference to projects
var db = firebase.database();

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchUsers();
	}else{
		//
	}
});

function fetchUsers(){
	firebase.database().ref('/Users/').once('value').then(function(snapshot){
    var userObject = snapshot.val();
	var userList = document.getElementById('userList');
	userList.innerHTML = '<tr>'+
               			 	'<th>'+"Name"+'</th>'+
               			 	'<th>'+"Email"+'</th>'+
                			'<th>'+"Number"+'</th>'+
                			'<th>'+"Role"+'</th>'+
             				'</tr>';
	if (userObject){
    var keys = Object.keys(userObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = userObject[keys[i]];
      var userID = currentObject.id;
      var userNameEdit = userID+currentObject.name;
      var userNumEdit = userID+currentObject.phone;
      var userEmailEdit = userID+currentObject.email;
      var userRoleAdminEdit = currentObject.isAdmin;
      var userRoleMemberEdit = userID+currentObject.isMember;
      var userRoleEdit = "";

      if (userRoleAdminEdit == true){
      	userRoleEdit = "Admin"
      }else {
      	userRoleEdit = "Member";
      }

    userList.innerHTML +='<td>'+ currentObject.name+'</td>'+'<td>'+ currentObject.email+'</td>'+'<td>'+currentObject.phone+'</td>'+
     								'<td>'+ userRoleEdit+'</td>' +
                    '<td><a href="#" onclick="enterProject(\''+userID+'\')" class="btn btn-success">Project</a></td>'+
                    '<td><a href="#" onclick="enterDefect(\''+userID+'\')" class="btn btn-info">Defect</a></td>';
    }
    userList.innerHTML += '</tr>';

    }else {
		userList.innerHTML ='<tr>'+
               			 	'<th>'+"Name"+'</th>'+
               			 	'<th>'+"Email"+'</th>'+
                			'<th>'+"Number"+'</th>'+
                			'<th>'+"Role"+'</th>'+
             				'</tr>';
	}
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

// enter to project page
function enterProject(userId) {
	var value1 = userId;
	console.log(userId);
  	//var queryString = "?para=" + value1;

  	// passing title to progressList page //
    //localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mProject.html";

    
}

// enter to defect page
function enterDefect(userId) {
  var value1 = userId;
  console.log(userId);
    //var queryString = "?para=" + value1;

    // passing title to progressList page //
    //localStorage.setItem('objectToPass',value2);
    // passing proID to progressList page //
    localStorage.setItem('idToPass',value1);

    location.href = "mDefect.html";

    
}