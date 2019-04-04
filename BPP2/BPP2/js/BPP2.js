
"use strict";

//global variables
var accountArray;
var topicArray;
var suggestionArray;
var logOnAttempts = 0;

//logIn.html
//checks DB for employeeId and password and stores employeeId in localStorage for reference on other html pages
function logOn(employeeId, password) {

    localStorage.clear();
    
    if (employeeId === "" ||
        password === "") {
        document.getElementById("alertId").innerHTML = "Please enter an ID and Password";
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
                    document.getElementById("employeeId").value = "";
                    document.getElementById("password").value = "";
                    window.open("../html/main.html", "_self");
                }
                else {
                    document.getElementById("alertId").innerHTML = "Sign in Failed";
                    document.getElementById("password").value = "";
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

//submission.html
//stores topic 
function storeTopic() {
    var topicTitle, category, location, comment;

    topicTitle = document.getElementById("topicTitle").value;
    category = document.getElementById("category").value;
    location = document.getElementById("location").value;
    comment = document.getElementById("comment").value;

    if (topicTitle === "" || comment === "" || location === "Location") {
        console.log("Please fill in all information.");
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
        },
        error: function (e) {
            alert("Probably didn't work :(");
            //console.log(parameters);
        }
    });
}

//submission.html
//adds comment to the db
function addCommentToDB(topicId, comment) {
    alert(topicId);
    alert(comment);

    let webMethod = "../BPP2/SubmitComment";
    let parameters = "{\"topicId\":\"" + encodeURI(topicId) +
                     "\",\"comment\":\"" + encodeURI(comment) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log("Might of worked");
            window.open("../html/main.html", "_self");
        },
        error: function (e) {
            console.log("Probaably Not!");
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

                            liNode.innerHTML = "<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button>: " + " "
                                             + "Relevance: " + topicArray[i].Relevance + " "
                                             + "<button onclick='relevanceUp(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>" 
                                             + "<button onclick='relevanceDown(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"; 

                            list.appendChild(liNode);
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

                            liNode.innerHTML = "<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button>: " + " "
                                             + "Relevance: " + topicArray[i].Relevance + " "
                                             + "<button onclick='relevanceUp(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>" 
                                             + "<button onclick='relevanceDown(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>"; 

                            list.appendChild(liNode);
                        }
                    }
                }
            }
        });
    }
}

//main.html
//function to filter topics
function FilterTopics(locationValue, categoryValue) {
    var location, category;
    var list = document.getElementById('topicsContainer');
    list.innerHTML = "";
    location = locationValue.value;
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

                        liNode.innerHTML = "<button onclick='newSuggestion(" + topicArray[i].TopicID + ")'>" + topicArray[i].Title + "</button>: " + " "
                                         + "Relevance: " + topicArray[i].Relevance + " "
                                         + "<button onclick='relevanceUp(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.png' alt='Thumbs Up' height='17'>" + "</button>" 
                            + "<button onclick='relevanceDown(" + topicArray[i].TopicID + ")'>" + "<img src='../images/2.5.png' alt='Thumbs Up' height='17'>" + "</button>";
                        if (location === topicArray[i].Location || category === topicArray[i].Category) {
                                list.appendChild(liNode);
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
    window.open("../html/submission.html", "_self");
}

//suggestion.html
//populates fields with topic data
function populateSuggestions(topicID) {
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
                    if (suggestionArray[i].SuggestionID !== null) {
                        if (topicID === suggestionArray[i].TopicID) {
                            var pageSuggestion = suggestionArray[i].SuggestionContent;
                            document.getElementById('viewComments').innerHTML = pageSuggestion;
                        }
                    }
                }
            }
        }
    });
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
                    if (suggestionArray[i].Title !== null) {
                        if (topicID === topicArray[i].TopicID) {
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
//relevance +1
function relevanceUp(topicId) {
    console.log(topicId + "Up");
}

//main.html
//relevance -1
function relevanceDown(topicId) {
    console.log(topicId + "Down");
}