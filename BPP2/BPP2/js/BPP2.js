
"use strict";

//global variables
var accountArray;
var topicArray;
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
    showBadges();
}

//submission.html
//initializes submission.html for employee
function loadSubmission() {
    showName();
}

//submission.html
//stores topic 
function storeTopic() {

    var topicTitle, category, location, comment;

    topicTitle = document.getElementById("topicTitle").value;
    category = document.getElementById("category").value;
    location = document.getElementById("location").value;
    comment = document.getElementById("comment").value;

    addTopicToDatabase(topicTitle, category, location, comment);

    document.getElementById("topicTitle").value = "";
    document.getElementById("category").value = "";
    document.getElementById("location").value = "";
    document.getElementById("comment").value = "";
}

//submission.html
//adds the topic to the database
function addTopicToDatabase(topicTitle, category, location, comment) {
    var webMethod = "../BPPP2.asmx/SubmitTopic";
    var parameters = "{\"topicTitle\":\"" + encodeURI(topicTitle) +
                     "\",\"category\":\"" + encodeURI(category) +
                     "\",\"location\":\"" + encodeURI(location) +
                     "\",\"comment\":\"" + encodeURI(comment) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert("Might of worked! :)");
            //console.log(parameters);
        },
        error: function (e) {
            alert("Probably didn't work :(");
            //console.log(parameters);
        }
    });
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

// profile.html
// show badges the user has earned
function showBadges() {
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
                        if (accountArray[i].badge == 1)
                            document.getElementById("badgeImg").src = "../images/1.png";
                        else if (accountArray[i].badge == 2)
                            document.getElementById("badgeImg").src = "../images/2.png";
                        else if (accountArray[i].badge == 3)
                            document.getElementById("badgeImg").src = "../images/3.png";
                        else if (accountArray[i].badge == 4)
                            document.getElementById("badgeImg").src = "../images/4.png";
                        else if (accountArray[i].badge == 5)
                            document.getElementById("badgeImg").src = "../images/5.png";
                    }
                    console.log(document.getElementById("badgeImg").src);
                }
            }
        }
    });
}

//main.html
//displays topics in suggestion box
function GetTopics() {
    var list = document.getElementById('topicsContainer');
    list.innerHTML = "";

    $.ajax({
        type: "POST",
        url: "../BPP2.asmx/GetTopics",
        //data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                topicArray = msg.d;
                for (let i = 0; i < topicArray.length; i++) {
                    if (topicArray[i].Title !== null) {
                        var liNode = document.createElement('li');
                        liNode.innerHTML = "Title: " + topicArray[i].Title + " " + "Relevance: " + topicArray[i].Relevance;
                        list.appendChild(liNode);
                    }
                }
            }
        }
    })
}