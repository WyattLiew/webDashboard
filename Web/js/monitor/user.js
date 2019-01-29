// Initialize Firebase
        var config = {
          apiKey: "AIzaSyB-rXLOd4NDJgb1zPmi7c6QW4Z7g_plQ4s",
          authDomain: "mproject-sharedb.firebaseapp.com",
          databaseURL: "https://mproject-sharedb.firebaseio.com",
          projectId: "mproject-sharedb",
          storageBucket: "mproject-sharedb.appspot.com",
          messagingSenderId: "809141665249"
        };
        // secondaryApp for create user without auto log in 
     var  secondaryApp = firebase.initializeApp(config,"Secondary");


// Get a database reference to projects
var db = firebase.database();
var newUserRef = db.ref("Users");

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    var UID = firebase.auth().currentUser.uid;
    
    fetchUsers();
	}else{
		//
	}
});

//  create user button
document.getElementById('userInputForm').addEventListener('submit',createUser);

function createUser(e) {
      var userName= document.getElementById('userNameInput').value;
      var userNum = document.getElementById('userNumInput').value;
      var userEmail = document.getElementById('userEmailInput').value;
      var userPassword = document.getElementById('userPasswordInput').value;
      var roleAdmin = document.getElementById("userRoleAdmin").checked;
      var roleMember = document.getElementById("userRoleMember").checked;
      var roleClient = document.getElementById("userRoleClient").checked;
      var isAdmin = false;
      var isMember = true;

      if (roleAdmin == true) {
          isAdmin = true;
          isMember = true;
      }else if (roleMember == true){
          isAdmin = false;
          isMember = true;
      }else {
        isAdmin = false;
          isMember = false;
      }

    e.preventDefault();
    if (userName !="" && userName.length >1 && 
    userNum.length >1 && userEmail !="" && 
    userNum !="" ) {
      // secondaryApp for create user without auto log in 
    secondaryApp.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(firebaseUser) {
 
    var userId = firebaseUser.user.uid;

      var user = {
      email: userEmail,
      id: userId,
      isAdmin: isAdmin,
      isMember: isMember,
      name: userName,
      phone: userNum
  }

  // save data to firebase
    newUserRef.child(userId).set(user,function(error) {
      if (error) {
        
      } else {
        // Reset field
        document.getElementById('userInputForm').reset();
        secondaryApp.auth().signOut();
        // retrieve data
        fetchUsers();
        alert("Create Successfully!");
       // var projAlert = document.getElementById("proj-green-alert1");
        //projAlert.classList.remove("hidden");
        //projSubmitProgress.style.display="none";
        //projAddBtn.style.display="inline-block";
        var auth = firebase.auth();
        var emailAddress = userEmail;

        auth.sendPasswordResetEmail(emailAddress).then(function() {
          // Email sent.
        }).catch(function(error) {
          // An error happened.
          alert(error.message);
        });


      }
    });
}).catch(function(error){
  if(error){
          // Handle Errors here.
        switch (error.code){
          case "EMAIL_TAKEN":
          alert("The new user account cannot be created because the email is already in use.");
          break;
          case "INVALID_EMAIL":
        alert("The specified email is not a valid email.");
        break;
      default:
      var errorMessage = error.message;
        alert("Error creating user:" + errorMessage);
        }
  }
});
}else {
  alert("Please make sure user name,phone number and email address are correct!");
}

}

function fetchUsers(){
	firebase.database().ref('/Users/').once('value').then(function(snapshot){
    var userObject = snapshot.val();
  //user list
	var userList = document.getElementById('userList');
  userList.innerHTML = '<tr>'+
                      '<th>'+"Name"+'</th>'+
                      '<th>'+"Email"+'</th>'+
                      '<th>'+"Number"+'</th>'+
                      '<th>'+"Role"+'</th>'+
                    '</tr>';
  //client list
  var clientList = document.getElementById('clientList');
  clientList.innerHTML = '<tr>'+
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
      var userRoleAdminLabel = currentObject.isAdmin;
      var userRoleMemberLabel = currentObject.isMember;
      var userRoleEdit = "";

      if (userRoleAdminLabel == true){
      	userRoleEdit = "Admin"
      }else if (userRoleMemberLabel == true) {
      	userRoleEdit = "Member";
      }else {
        userRoleEdit = "Client";
      }

      if(userRoleEdit == "Admin" || userRoleEdit == "Member"){
    userList.innerHTML +='<td>'+ currentObject.name+'</td>'+'<td>'+ currentObject.email+'</td>'+'<td>'+currentObject.phone+'</td>'+
     								'<td>'+ userRoleEdit+'</td>' +
                    '<td><a href="#" onclick="enterProject(\''+userID+'\')" class="btn btn-sm btn-success">Project</a></td>'+
                    '<td><a href="#" onclick="enterDefect(\''+userID+'\')" class="btn btn-sm btn-info">Defect</a></td>' +
                    '<td><a href="#" onclick="editUser(\''+userID+'\')" class="btn btn-sm btn-warning" data-toggle="modal" data-target="#userEdit">Edit</a></td>';
    }else {
      clientList.innerHTML +='<td>'+ currentObject.name+'</td>'+'<td>'+ currentObject.email+'</td>'+'<td>'+currentObject.phone+'</td>'+
                    '<td>'+ userRoleEdit+'</td>' +
                    '<td><a href="#" onclick="editClient(\''+userID+'\')" class="btn btn-sm btn-warning" data-toggle="modal" data-target="#clientEdit">Edit</a></td>';

    }
    }
    userList.innerHTML += '</tr>';
    clientList.innerHTML += '</tr>';

    }else {
		userList.innerHTML ='<tr>'+
               			 	'<th>'+"Name"+'</th>'+
               			 	'<th>'+"Email"+'</th>'+
                			'<th>'+"Number"+'</th>'+
                			'<th>'+"Role"+'</th>'+
             				'</tr>';
    clientList.innerHTML ='<tr>'+
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


// edit user
function editUser(userId){
  firebase.database().ref('/Users/' + userId).once('value').then(function(snapshot){
    var userObject = snapshot.val();
  var userEditList = document.getElementById('userEditList');
  userEditList.innerHTML = "";
  if (userObject){
    var keys = Object.keys(userObject);

    var userEditId = userObject.id;
    var userNameEdit = userEditId + userObject.name;
    var userNumEdit = userEditId + userObject.phone;
    var userEmailEdit = userEditId + userObject.email;
    var userRoleAdmin = userEditId + "Admin";
    var userRoleMember = userEditId + "Member";

      userEditList.innerHTML += '<div class="form-group">' +
                              '<label for="userNameEdit">Name *</label>' +
                              '<input type="text" class="form-control" id="\''+userNameEdit+'\'" value="'+userObject.name+'" placeholder="Enter name here ..." required>' +
                              '</div>' +
                              '<div class="form-group">' +
                              '<label for="userNumEdit">Contact number *</label>' +
                              '<input type="number" class="form-control" id="\''+userNumEdit+'\'" value="'+userObject.phone+'" placeholder="Enter contact number here ..." required>' +
                              '</div>' +
                              '<div class="form-group">' +
                              '<label for="userEmailEdit">Email *</label>' +
                              '<input type="email" class="form-control" id="\''+userEmailEdit+'\'" value="'+userObject.email+'" disabled>' +
                              '</div>' ;
    if (userObject.isAdmin == true) {
      userEditList.innerHTML += '<div class="form-group">' +
                              '<label for="userRoleInput">Role *</label><br>' +
                              '<label for="userRoleAdmin" class="radio-inline"><input type="radio" id="\''+userRoleAdmin+'\'" name="admin" checked>Admin </label>' +
                              '<label for="userRoleMember" class="radio-inline"><input type="radio" id="\''+userRoleMember+'\'" name="admin">Member </label>' +
                              '</div>';
                              }else {
      userEditList.innerHTML += '<div class="form-group">' +
                              '<label for="userRoleInput">Role *</label><br>' +
                              '<label for="userRoleAdmin" class="radio-inline"><input type="radio" id="\''+userRoleAdmin+'\'" name="admin" >Admin </label>' +
                              '<label for="userRoleMember" class="radio-inline"><input type="radio" id="\''+userRoleMember+'\'" name="admin" checked>Member </label>' +
                              '</div>';
                              }
      userEditList.innerHTML += '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                                '<button type="button" onclick="saveUser(\''+userEditId+'\',\''+userNameEdit+'\',\''+userNumEdit+'\',\''+userEmailEdit+'\',\''+userRoleAdmin+'\',\''+userRoleMember+'\')"  class="btn btn-primary">Save changes</button>'+
                                '</div>';
    

    }else {
    userEditList.innerHTML = "";
  }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

// save user only
function saveUser(userId,userName,userNum,userEmail,userRoleAdmin,userRoleMember) {
    //get value 
    var roleAdmin = document.getElementById('\''+userRoleAdmin+'\'').checked;
    var roleMember = document.getElementById('\''+userRoleMember+'\'').checked;
    var userNameEdit = document.getElementById('\''+userName+'\'').value;
    var userNumEdit = document.getElementById('\''+userNum+'\'').value;
    var userEmailEdit = document.getElementById('\''+userEmail+'\'').value;
    var isAdmin = false;
    var isMember = true;

      if (roleAdmin == true) {
          isAdmin = true;
          isMember = true;
      }else {
        isAdmin = false;
          isMember = true;
      }

      var user = {
      email: userEmailEdit,
      id: userId,
      isAdmin: isAdmin,
      isMember: isMember,
      name: userNameEdit,
      phone: userNumEdit
  }

if (userName !="" && userName.length >1 && 
    userNum.length >1 && userEmail !="" && 
    userNum !="" ) {
    // save data to firebase
    newUserRef.child(userId).set(user,function(error) {
      if (error) {
        alert(error.message);
      } else {
        // retrieve data
        fetchUsers();
        alert("Edit Successfully!");
       // var projAlert = document.getElementById("proj-green-alert1");
        //projAlert.classList.remove("hidden");
        //projSubmitProgress.style.display="none";
        //projAddBtn.style.display="inline-block";
      }
    });
  }else {
    alert("Please make sure user name,phone number and email address are correct!");
  }
}

// edit client
function editClient(userId){
  firebase.database().ref('/Users/' + userId).once('value').then(function(snapshot){
    var userObject = snapshot.val();
  var clientEditList = document.getElementById('clientEditList');
  clientEditList.innerHTML = "";
  if (userObject){
    var keys = Object.keys(userObject);

    var userEditId = userObject.id;
    var userNameEdit = userEditId + userObject.name;
    var userNumEdit = userEditId + userObject.phone;
    var userEmailEdit = userEditId + userObject.email;
    var userRoleAdmin = userEditId + "Admin";
    var userRoleMember = userEditId + "Member";

      clientEditList.innerHTML += '<div class="form-group">' +
                              '<label for="userNameEdit">Name *</label>' +
                              '<input type="text" class="form-control" id="\''+userNameEdit+'\'" value="'+userObject.name+'" placeholder="Enter name here ..." required>' +
                              '</div>' +
                              '<div class="form-group">' +
                              '<label for="userNumEdit">Contact number *</label>' +
                              '<input type="number" class="form-control" id="\''+userNumEdit+'\'" value="'+userObject.phone+'" placeholder="Enter contact number here ..." required>' +
                              '</div>' +
                              '<div class="form-group">' +
                              '<label for="userEmailEdit">Email *</label>' +
                              '<input type="email" class="form-control" id="\''+userEmailEdit+'\'" value="'+userObject.email+'" disabled>' +
                              '</div>' ;
      clientEditList.innerHTML += '<div class="form-group">' +
                              '<label for="userRoleInput">Role *</label><br>' +
                              '<label for="userRoleAdmin" class="radio-inline"><input type="radio" id="\''+userRoleMember+'\'" name="Member" checked disabled>Client </label>' +
                              '</div>';
      clientEditList.innerHTML += '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                                '<button type="button" onclick="saveClient(\''+userEditId+'\',\''+userNameEdit+'\',\''+userNumEdit+'\',\''+userEmailEdit+'\',\''+userRoleMember+'\')"  class="btn btn-primary">Save changes</button>'+
                                '</div>';
    

    }else {
    clientEditList.innerHTML = "";
  }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error: " +errorMessage);
  });
}

// save client only
function saveClient(userId,userName,userNum,userEmail,userRoleMember) {
    //get value 
    var roleMember = document.getElementById('\''+userRoleMember+'\'').checked;
    var userNameEdit = document.getElementById('\''+userName+'\'').value;
    var userNumEdit = document.getElementById('\''+userNum+'\'').value;
    var userEmailEdit = document.getElementById('\''+userEmail+'\'').value;
    var isAdmin = false;
    var isMember = false;

      if (roleMember == true) {
          isAdmin = false;
          isMember = false;
      }

      var user = {
      email: userEmailEdit,
      id: userId,
      isAdmin: isAdmin,
      isMember: isMember,
      name: userNameEdit,
      phone: userNumEdit
  }

if (userName !="" && userName.length >1 && 
    userNum.length >1 && userEmail !="" && 
    userNum !="" ) {
    // save data to firebase
    newUserRef.child(userId).set(user,function(error) {
      if (error) {
        alert(error.message);
      } else {
        // retrieve data
        fetchUsers();
        alert("Edit Successfully!");
       // var projAlert = document.getElementById("proj-green-alert1");
        //projAlert.classList.remove("hidden");
        //projSubmitProgress.style.display="none";
        //projAddBtn.style.display="inline-block";
      }
    });
  }else {
    alert("Please make sure user name,phone number and email address are correct!");
  }
}