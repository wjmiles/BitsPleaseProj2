
"use strict";

//global variables
var accountArray;
var logOnAttempts = 0;

//logIn.html
//checks DB for employeeId and password and stores employeeId in localStorage for reference on other html pages
function logOn(employeeId, password) {

    //let alert = document.getElementById(alertId);
    
    if (employeeId === "" ||
        password === "") {
        if (logOnAttempts === 0) {
            let para = document.createElement("p");
            let node = document.createTextNode("Please enter an ID and Password.");
            para.appendChild(node);
            let element = document.getElementById("alertId");
            element.appendChild(para);
            logOnAttempts += 1;
        }
        document.getElementById("password").value = "";
    }
    else {
        let webMethod = "../BPP2.asmx/LogOn";
        let parameters = "{\"employeeId\":\"" + encodeURI(employeeId) + "\",\"password\":\"" + encodeURI(password) + "\"}";

        $.ajax({
            type: "POST",
            url: webMethod,
            data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d.length > 0) {
                    accountArray = msg.d;
                    localStorage.setItem("employeeId", accountArray[0].employeeId);
                    window.open("../html/main.html", "_self");
                }
                else {
                    console.log(employeeId);
                    console.log(password);
                    alert("Sign In Failed");
                    document.getElementById("password").value = "";
                }
            }
        });
    }
}

//main.html
//initalizes main.html for employee
function loadMain() {
    showName();
}

//profile.html
//initializes profile.html for employee
function loadProfile() {
    showName();
    showInfo();
}

//submission.html
//initializes submission.html for employee
function loadSubmission() {
    showName();
}

//main.html
//profile.html
//submission.html
//displays employee information in header
function showName() {
    let storedParam = localStorage.getItem("employeeId");

    let webMethod = "../BPP2.asmx/GetAccount";
    let parameters = "{\"employeeId\":\"" + encodeURI(storedParam) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                accountArray = msg.d;
                for (let i = 0; i < accountArray.length; i++) {
                    if (accountArray[i].employeeId !== null) {
                        document.getElementById("userNameId").innerHTML = accountArray[i].firstName + " " +
                            accountArray[i].lastName;
                    }
                }
            }
        }
    });
}


// profile.html
// displays the employeeId in profile page
// employeeId cannot be changed
function showInfo() {
    let storedParam = localStorage.getItem("employeeId");

    let webMethod = "../BPP2.asmx/GetAccount";
    let parameters = "{\"employeeId\":\"" + encodeURI(storedParam) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                accountArray = msg.d;
                for (let i = 0; i < accountArray.length; i++) {
                    if (accountArray[i].employeeId !== null) {
                        document.getElementById("employeeId").innerHTML = accountArray[i].employeeId;
                        document.getElementById("firstNameId").innerHTML = accountArray[i].firstName;
                        document.getElementById("lastNameId").innerHTML = accountArray[i].lastName;
                        document.getElementById("positionId").innerHTML = accountArray[i].position;
                        document.getElementById("departmentId").innerHTML = accountArray[i].department;
                        document.getElementById("locationId").innerHTML = accountArray[i].location;
                        console.log(accountArray[i].employeeId);
                    }
                }
            }
        }
    });

}

//profile.html
//loads user info to edited
function loadAccountInfo() {
    var storedParam = localStorage.getItem("employeeId");
    var webMethod = "../BPP2.asmx/GetAccount";
    var parameters = "{\"employeeId\":\"" + encodeURI(storedParam) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                accountArray = msg.d;
                for (var i = 0; i < accountArray.length; i++) {
                    var acct;
                    document.getElementById("passwordId").value = accountArray[i].password;
                }
            }
        }
    });
}

//profile.html
//updates the user info in the DB
function editAccountInfo() {
    var password

    password = document.getElementById("passwordId").value;

    var storedParam = localStorage.getItem("employeeId");
    var webMethod = "../BPP2.asmx/EditUser";
    var parameters = "{\"employeeId\":\"" + encodeURI(storedParam) +
        "\",\"password\":\"" + encodeURI(password) + "\" }";
    console.log(parameters);



    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            loadAccountInfo();
        }
    });
}
