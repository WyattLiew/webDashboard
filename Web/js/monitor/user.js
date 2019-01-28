
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
                    '<td><div class="btn-group action-btn">' +
                    '<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
                    '<ul class="dropdown-menu">' +
                    '<li><a href="#" onclick="enterProject(\''+userID+'\')">Project</a></li>'+
                    '<li role="separator" class="divider"></li>'+
                    '<li><a href="#" onclick="enterDefect(\''+userID+'\')" >Defect</a></li>' +
                    '</ul>'+
                    '</div>' +
                    '</td>' + " " ;	
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