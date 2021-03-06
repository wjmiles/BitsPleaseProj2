﻿
"use strict";

//global variables
var accountArray;
var topicArray;
var suggestionArray;
var logOnAttempts = 0;

//logIn.html
//checks DB for employeeId and password and stores employeeId in localStorage for reference on other html pages
function logOn(employeeId, password) {

    document.getElementById("logOnButton").innerHTML = "Processing...";
    document.getElementById("alertId").innerHTML = "";

    localStorage.clear();
    
    if (employeeId === "" ||
        password === "") {
        document.getElementById("alertId").innerHTML = "Please enter an ID and Password";
        document.getElementById("password").value = "";
        document.getElementById("logOnButton").innerHTML = "Log On";
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
                    localStorage.setItem("badge", accountArray[0].badge);
                    localStorage.setItem("admin", accountArray[0].admin);
                    document.getElementById("employeeId").value = "";
                    document.getElementById("password").value = "";
                    window.open("../html/main.html", "_self");
                }
                else {
                    document.getElementById("alertId").innerHTML = "Sign in Failed";
                    document.getElementById("password").value = "";
                    document.getElementById("logOnButton").innerHTML = "Log On";
                }
            }
        });
    }
}

//main.html
//profile.html
//submission.html
function logOff() {
    localStorage.clear();
    window.open("../html/logIn.html", "_self");
}

//main.html
//initalizes main.html for employee
function loadMain() {
    //window.setInterval(refreshTopicList, 7000);
    showName();
    loadSuggestions();
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

// suggestion.html
// initializes suugestion.html for employee
function loadSuggestionPage(topicID) {
    populateSuggestions(topicID);
    showName();
    getBadge(topicID);
}

//submission.html
//stores topic 
function storeTopic() {

    document.getElementById("submitTopicButtonId").innerHTML = "Processing...";

    var topicTitle, category, location, comment;

    topicTitle = document.getElementById("topicTitle").value;
    category = document.getElementById("category").value;
    location = document.getElementById("location").value;
    comment = document.getElementById("comment").value;

    if (topicTitle === "" || comment === "" || location === "Location") {
        console.log("Please fill in all information.");
        document.getElementById("submitTopicButtonId").innerHTML = "Submit";
    }
    else {
        addTopicToDatabase(topicTitle, category, location, comment);

        document.getElementById("topicTitle").value = "";
        document.getElementById("category").value = "default";
        document.getElementById("location").value = "Location";
        document.getElementById("comment").value = "";
    }
    
}

//submission.html
//adds the topic to the database
function addTopicToDatabase(topicTitle, category, location, comment) {

    let storedParam = localStorage.getItem("employeeId");

    let webMethod = "../BPP2.asmx/SubmitTopic";
    let parameters = "{\"employeeId\":\"" + encodeURI(storedParam) +
                     "\",\"topicTitle\":\"" + encodeURI(topicTitle) +
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
            console.log(parameters);
            window.open("../html/main.html", "_self");
        },
        error: function (e) {
            //alert("Probably didn't work :(");
            //console.log(parameters);
        }
    });
}

//submission.html
//adds comment to the db
function addCommentToDB(topicId) {

    document.getElementById("submitCommentButtonId").innerHTML = "Processing...";

    let storedParam = localStorage.getItem("employeeId");

    if (document.getElementById("commentTextArea").value !== "") {
        var comment = document.getElementById("commentTextArea").value;
    }
    else {
        console.log("Enter a comment");
        document.getElementById("submitCommentButtonId").innerHTML = "Submit";
        return;
    }

    console.log(topicId);
    console.log(comment);

    let webMethod = "../BPP2.asmx/SubmitComment";
    let parameters = "{\"topicId\":\"" + encodeURI(topicId) +
                     "\",\"employeeId\":\"" + encodeURI(storedParam) +
                     "\",\"comment\":\"" + encodeURI(comment) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log("Might of worked");
            location.reload();
        },
        error: function (e) {
            console.log("Probably Not!");
        }
    });
}

//main.html
//profile.html
//submission.html
//displays employee information in header
function showName() {
    if (localStorage.length === 0) {
        window.open("../html/logIn.html", "_self");
    }
    else {
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
    var password;

    password = document.getElementById("passwordId").value;

    var storedParam = localStorage.getItem("employeeId");
    var webMethod = "../BPP2.asmx/UpdatePassword";
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

// suggestion.html
// determin the user can get which badge
function getBadge(topicID) {

    var storedParam = localStorage.getItem("employeeId");
    var badgeId = localStorage.getItem("badge");
    var webMethod = "../BPP2.asmx/GetAccount";
    var parameters = "{\"employeeId\":\"" + encodeURI(storedParam)
        + "\", \"badge\":\"" + encodeURI(badgeId) + "\"}";


    var relevanceCount;
    $.ajax({
        type: "POST",
        url: "../BPP2.asmx/GetTopics",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                topicArray = msg.d;
                for (let i = 0; i < topicArray.length; i++) {
                    if (topicArray[i].Title !== null) {
                        if (topicID == topicArray[i].TopicID) {
                            relevanceCount = topicArray[i].Relevance;
                            //console.log(topicArray[i].Relevance);
                            //console.log(relevanceCount);
                        }
                    }
                }// get relevanceCounter
                console.log("relevantCount: " + relevanceCount);

                // get original badgeId
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
                                badgeId = accountArray[i].badge;
                                console.log("original badge: " + accountArray[i].badge);
                                //console.log(badgeId);
                            }
                        }
                        console.log("original badgeId: " + badgeId);

                        // update badgeId
                        $.ajax({
                            type: "POST",
                            url: "../BPP2.asmx/GetBadge",
                            data: parameters,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (msg) {
                                if (relevanceCount > 20 && relevanceCount < 50)
                                    badgeId = 1;
                                else if (relevanceCount >= 50)
                                    badgeId = 2;
                                else
                                    badgeId = 0;
                                //badge = 2;
                                console.log("after badgeId: " + badgeId);
                                localStorage.setItem("badge", badgeId);
                            }

                        });

                    }
                });
            }
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
                        if (accountArray[i].badge === 1)
                            document.getElementById("badgeImg").src = "../images/1.png";
                        else if (accountArray[i].badge === 2)
                            document.getElementById("badgeImg").src = "../images/2.png";
                        else if (accountArray[i].badge === 3)
                            document.getElementById("badgeImg").src = "../images/3.png";
                        else if (accountArray[i].badge === 4)
                            document.getElementById("badgeImg").src = "../images/4.png";
                        else if (accountArray[i].badge === 5)
                            document.getElementById("badgeImg").src = "../images/5.png";
                        else
                            document.getElementById("badgeId").innerHTML = "";
                    }
                    console.log(document.getElementById("badgeImg").src);
                }
            }
        }
    });
}

//main.html
//displays topics in suggestion box
function GetTopics(selectObject) {

    document.getElementById("category").value = "Category";
    document.getElementById("location").value = "All";

    //var adminStatus = localStorage.getItem("admin");
    var value = selectObject.value;
    var list = document.getElementById('topicsContainer');
    list.innerHTML = "";

    if (value === "least") {
        $.ajax({
            type: "POST",
            url: "../BPP2.asmx/GetTopicsReverse",
            //data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d.length > 0) {
                    topicArray = msg.d;
                    for (let i = 0; i < topicArray.length; i++) {
                        if (topicArray[i].Title !== null) {
                            var liNode = document.createElement('li');
                            if (localStorage.getItem("admin") === "1") {
                                if (topicArray[i].Removed === 0) {
                                    if (topicArray[i].Resolved === 1) {
                                        //console.log(topicArray[i].Title);
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                                        list.appendChild(liNode);
                                    }
                                    else {
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button>"
                                            + "&nbsp;<button onclick='removeTopic(" + topicArray[i].TopicID + ")'><b>Remove</b></button>";
                                        list.appendChild(liNode);
                                    }
                                }
                                if (topicArray[i].Removed === 1) {
                                    liNode.innerHTML = topicArray[i].Relevance
                                        + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><strike>" + topicArray[i].Title + "</strike></button> ";
                                    list.appendChild(liNode);
                                }
                            }
                            else {
                                if (topicArray[i].Removed === 0) {
                                    if (topicArray[i].Resolved === 1) {
                                        //console.log(topicArray[i].Title);
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                                        list.appendChild(liNode);
                                    }
                                    else {
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button> ";
                                        list.appendChild(liNode);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    else {
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
                            if (localStorage.getItem("admin") === "1") {
                                if (topicArray[i].Removed === 0) {
                                    if (topicArray[i].Resolved === 1) {
                                        //console.log(topicArray[i].Title);
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                                        list.appendChild(liNode);
                                    }
                                    else {
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button>"
                                            + "&nbsp;<button onclick='removeTopic(" + topicArray[i].TopicID + ")'><b>Remove</b></button>";
                                        list.appendChild(liNode);
                                    }
                                }
                                if (topicArray[i].Removed === 1) {
                                    liNode.innerHTML = topicArray[i].Relevance
                                        + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><strike>" + topicArray[i].Title + "</strike></button> ";
                                    list.appendChild(liNode);
                                }
                            }
                            else {
                                if (topicArray[i].Removed === 0) {
                                    if (topicArray[i].Resolved === 1) {
                                        //console.log(topicArray[i].Title);
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                                        list.appendChild(liNode);
                                    }
                                    else {
                                        liNode.innerHTML = topicArray[i].Relevance
                                            + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button> ";
                                        list.appendChild(liNode);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

//main.html
//function to filter topics
function FilterTopics(locationValue) {
    if (locationValue.value == 'All') {
        document.getElementById('refreshButtonId').click();
    }

    document.getElementById("category").value = "Category";
    document.getElementById("relevance").value = "most";

    var location;
    var list = document.getElementById('topicsContainer');
    list.innerHTML = "";
    location = locationValue.value;

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
                        if (topicArray[i].Resolved === 1) {
                            console.log(topicArray[i].Title);
                            liNode.innerHTML = topicArray[i].Relevance
                                + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                            if (location === topicArray[i].Location && topicArray[i].Removed === 0) {
                                list.appendChild(liNode);
                            }
                        }
                        else {
                            liNode.innerHTML = topicArray[i].Relevance
                                + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button> ";
                            if (location === topicArray[i].Location && topicArray[i].Removed === 0) {
                                list.appendChild(liNode);
                            }
                        }
                    }
                }
            }
        }
    });
}

//main.html
//function to filter topic by category
function FilterTopicsCategory(categoryValue) {
    if (categoryValue.value == 'Category') {
        document.getElementById('refreshButtonId').click();
    }

    document.getElementById("location").value = "All";
    document.getElementById("relevance").value = "most";

    var category;
    var list = document.getElementById('topicsContainer');
    list.innerHTML = "";
    category = categoryValue.value;

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
                        if (topicArray[i].Resolved === 1) {
                            console.log(topicArray[i].Title);
                            liNode.innerHTML = topicArray[i].Relevance
                                + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'><b>" + topicArray[i].Title + "</b></button> ";
                            if (category === topicArray[i].Category && topicArray[i].Removed === 0) {
                                list.appendChild(liNode);
                            }
                        }
                        else {
                            liNode.innerHTML = topicArray[i].Relevance
                                + "&nbsp;<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "<button onclick='relevance(" + topicArray[i].TopicID + ", " + topicArray[i].Relevance + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                + "&nbsp;<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button> ";
                            if (category === topicArray[i].Category && topicArray[i].Removed === 0) {
                                list.appendChild(liNode);
                            }
                        }
                    }
                }
            }
        }
    });
}

//main.html
//shows topics in suggestion box on page load
function loadSuggestions() {
    document.getElementById('refreshButtonId').click();
    GetTopics(this);
}

//main.html
//opens suggestion.html and passes it topic data
function newSuggestion(topicID) {
    console.log('New Suggestion function triggered with: ' + topicID);

    window.open("../html/suggestion.html?" + topicID);
}

//main.html
//opens submission.html
function newTopic() {
    document.getElementById("newTopicButtonId").innerHTML = "Processing...";
    window.open("../html/submission.html", "_self");
}

//suggestion.html
//populates fields with topic data
function populateSuggestions(topicID) {
    var list = document.getElementById("viewComments");
    var commentCounter = 0;
    list.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "../BPP2.asmx/GetSuggestions",
        //data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                suggestionArray = msg.d;
                for (let i = 0; i < suggestionArray.length; i++) {
                    if (suggestionArray[i].SuggestionID !== null) {
                        if (topicID == suggestionArray[i].TopicID) {
                            var pageSuggestion = suggestionArray[i].SuggestionContent;
                            var pageSuggestionAgreement = suggestionArray[i].SuggestionAgreementCounter;
                            var user = suggestionArray[i].EmployeeID;
                            var liNode = document.createElement('li');
                            if (localStorage.getItem("admin") === "1") {
                                if (suggestionArray[i].Removed === 0) {
                                    if (suggestionArray[i].Solution === 1) {
                                        liNode.innerHTML = user + ": <b>" + pageSuggestion + "</b>&nbsp;&nbsp;"
                                            + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;" + pageSuggestionAgreement;
                                        list.appendChild(liNode);
                                    }
                                    else {
                                        liNode.innerHTML = user + ": " + pageSuggestion + "&nbsp;&nbsp;"
                                            + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                            + "&nbsp;" + pageSuggestionAgreement
                                            + "&nbsp;<button onclick='makeSolution(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].TopicID + ")'><b>Solution</b></button>"
                                            + "&nbsp;<button onclick='removeSuggestion(" + suggestionArray[i].SuggestionID + ")'><b>Remove</b></button>";
                                        list.appendChild(liNode);
                                    }
                                }
                                else if (suggestionArray[i].Removed === 1) {
                                    liNode.innerHTML = user + ": <strike>" + pageSuggestion + "</strike>&nbsp;&nbsp;"
                                        + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                        + "&nbsp;" + pageSuggestionAgreement;
                                    list.appendChild(liNode);
                                }
                            }
                            else {
                                if (suggestionArray[i].Removed === 0) {
                                    if (commentCounter === 0) {
                                        if (suggestionArray[i].Solution === 1) {
                                            liNode.innerHTML = "<b>" + pageSuggestion + "</b>&nbsp;&nbsp;"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "&nbsp;" + pageSuggestionAgreement;
                                            list.appendChild(liNode);
                                            commentCounter += 1;
                                        }

                                        else {
                                            liNode.innerHTML = pageSuggestion + "&nbsp;&nbsp;"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "&nbsp;" + pageSuggestionAgreement;
                                            list.appendChild(liNode);
                                            commentCounter += 1;
                                        }
                                    }
                                    else if (commentCounter > 0) {
                                        if (suggestionArray[i].Solution === 1) {
                                            liNode.innerHTML = user + ": <b>" + pageSuggestion + "</b>&nbsp;&nbsp;"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "&nbsp;" + pageSuggestionAgreement;
                                            list.appendChild(liNode);
                                            commentCounter += 1;
                                        }
                                        else {
                                            liNode.innerHTML = user + ": " + pageSuggestion + "&nbsp;&nbsp;"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + 1 + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "<button onclick='agree(" + suggestionArray[i].SuggestionID + ", " + suggestionArray[i].SuggestionAgreementCounter + ", " + -1 + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"
                                                + "&nbsp;" + pageSuggestionAgreement;
                                            list.appendChild(liNode);
                                            commentCounter += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
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
                        if (topicID == topicArray[i].TopicID) {
                            var pageTopic = topicArray[i].Title;
                            document.getElementById('topicTitle').innerHTML = pageTopic;
                        }
                    }
                }
            }
        }
    });


}

//main.html
//relevance change
function relevance(topicId, relevance, change) {
    //console.log(topicId + " " + relevance + " " + change);
    let newRelevance = relevance + change;
    //console.log(newRelevance);

    let webMethod = "../BPP2.asmx/UpdateRelevance";
    let parameters = "{\"topicId\":\"" + encodeURI(topicId) +
        "\",\"newRelevance\":\"" + encodeURI(newRelevance) + "\" }";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
            loadSuggestions();
        }
    });
}

//suggestion.html
//agree change
function agree(suggestionId, agree, change) {
    console.log(suggestionId + " " + agree + " " + change);

    let newAgree = agree + change;

    let webMethod = "../BPP2.asmx/UpdateAgree";
    let parameters = "{\"suggestionId\":\"" + encodeURI(suggestionId) +
        "\",\"newAgree\":\"" + encodeURI(newAgree) + "\" }";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
            location.reload();
        }
    });
}

function removeTopic(topicId) {
    //console.log("remove " + topicId);

    let webMethod = "../BPP2.asmx/RemoveTopic";
    let parameters = "{\"topicId\":\"" + encodeURI(topicId) + "\" }";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
            location.reload();
        }
    });
}

function makeSolution(suggestionId, topicId) {
    //console.log("Solution " + suggestionId);

    let webMethod1 = "../BPP2.asmx/MakeResolved";
    let parameters1 = "{\"topicId\":\"" + encodeURI(topicId) + "\" }";
    //alert("MakeResolved " + topicId);
    $.ajax({
        type: "POST",
        url: webMethod1,
        data: parameters1,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
        }
    });

    let webMethod0 = "../BPP2.asmx/MakeSolution";
    let parameters0 = "{\"suggestionId\":\"" + encodeURI(suggestionId) + "\" }";

    $.ajax({
        type: "POST",
        url: webMethod0,
        data: parameters0,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
            location.reload();
        }
    });


}

function removeSuggestion(suggestionId) {
    //console.log("Remove " + suggestionId);

    let webMethod = "../BPP2.asmx/RemoveSuggestion";
    let parameters = "{\"suggestionId\":\"" + encodeURI(suggestionId) + "\" }";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log("yay");
            location.reload();
        }
    });
}

//main.html
//checks if topics list nees to be refreshed
function refreshTopicList() {
    console.log('checking if refresh needed');
    if (document.getElementById("category").value == "Category" && document.getElementById("location").value == "All") {
        $.ajax({
            type: "POST",
            url: "../BPP2.asmx/GetTopics",
            //data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d.length > 0) {
                    topicArray = msg.d;
                    var dbCount = topicArray.length;
                    var pageCount = document.getElementById("topicsContainer").getElementsByTagName("li").length;

                    //console.log('db: ' + dbCount + ' current: ' + pageCount);

                    if (dbCount !== pageCount) {
                        //console.log('refreshing list');
                        document.getElementById('refreshButtonId').click();
                    }
                }
            }
        });
    }
    else {
        let category = document.getElementById("category").value;
        let location = document.getElementById("location").value;

        let parameters = "{\"category\":\"" + encodeURI(category) +
            "\",\"location\":\"" + encodeURI(location) + "\" }";

        $.ajax({
            type: "POST",
            url: "../BPP2.asmx/GetTopicsFiltered",
            data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d.length > 0) {
                    topicArray = msg.d;
                    var dbCount = topicArray.length;
                    var pageCount = document.getElementById("topicsContainer").getElementsByTagName("li").length;

                    //console.log('db: ' + dbCount + ' current: ' + pageCount);

                    if (dbCount !== pageCount) {
                        //console.log('refreshing list');
                        document.getElementById('refreshButtonId').click();
                    }
                }
            }
        });
    }
}
