$(document).ready(function () {

    // Firebase
    var config = {
        apiKey: "AIzaSyAuYnUE3VfpnPSlZTyOOUNVjZ0qxzeIXiQ",
        authDomain: "trainscheduler-eacd4.firebaseapp.com",
        databaseURL: "https://trainscheduler-eacd4.firebaseio.com",
        projectId: "trainscheduler-eacd4",
        storageBucket: "",
        messagingSenderId: "110147082513"
    };

    firebase.initializeApp(config);

    var database = firebase.database();


    // function for adding train user input
    var addTrain = function (event) {

        // keeps the page from reloading on the button click
        event.preventDefault();

        // form fields to connect with variables (remove whitespace) 
        var train = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var first = $("#firstTrain").val().trim();
        var frequency = $("#frequency").val().trim();


        // push form field to database (Firebase)
        database.ref().push({
            train: train,
            destination: destination,
            first: first,
            frequency: frequency
        });

        // clear form values after push
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");

    }

    // moment JS calculations
    database.ref().on("child_added", function (snapshot) {
        var a = snapshot.val();
        var firstTime = moment(a.first, "HH:mm").subtract(10, "years").format("x");

        if (firstTime >= 0) {
            firstTrain = firstTime * -1;
        } else {
            firstTrain = firstTime;
        }

        var minsDifferent = moment().diff(moment.unix(firstTrain), "minutes");
        var minsAway = minsDifferent % a.frequency;
        var nextArrival = moment().add(minsAway, "m").format("HH:mm");

        // create new table elements from Firebase
        var newTableRow = $("<tr>");

        var newTrain = $("<td>");
        newTrain.html(snapshot.val().train);
        newTableRow.append(newTrain);

        var newDestination = $("<td>");
        newDestination.html(snapshot.val().destination);
        newTableRow.append(newDestination);

        var newFrequency = $("<td>");
        newFrequency.html(snapshot.val().frequency);
        newTableRow.append(newFrequency);

        var newNextArrival = $("<td>");
        newNextArrival.html(nextArrival);
        newTableRow.append(newNextArrival);

        var newMinutesAway = $("<td>");
        newMinutesAway.html(minsAway);
        newTableRow.append(newMinutesAway);

        $("#trainTable").append(newTableRow);

    }, function (error) {
        console.log("Errors Handled: " + error.code);
    });


    $("#submitBtn").on("click", addTrain);


});