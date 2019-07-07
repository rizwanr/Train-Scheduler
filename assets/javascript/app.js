const firebaseConfig = {
  apiKey: 'AIzaSyBeOmDulsAurEvu9B2z-CyecEB5fbCuK5s',
  authDomain: 'rizwan-renesa-uoft.firebaseapp.com',
  databaseURL: 'https://rizwan-renesa-uoft.firebaseio.com',
  projectId: 'rizwan-renesa-uoft',
  storageBucket: 'rizwan-renesa-uoft.appspot.com',
  messagingSenderId: '601087263147',
  appId: '1:601087263147:web:e242a16615900bea'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var empty;

//get the reference to the database
var database = firebase.database();

$('#add-train-btn').on('click', function(event) {
  event.preventDefault();

  var trainName = $('#train-name-input')
    .val()
    .trim();

  var destination = $('#destination-name-input')
    .val()
    .trim();

  var firstTrainTime = $('#military-time-input')
    .val()
    .trim();

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, 'HH:mm').subtract(1, 'years');
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm'));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  console.log('DIFFERENCE IN TIME: ' + diffTime);

  var tfrequency = $('#frequency-input')
    .val()
    .trim();

  // Time apart (remainder)
  var tremainder = diffTime % tfrequency;
  console.log(tremainder);

  // Minute Until Train
  var tMinutesTillTrain = tfrequency - tremainder;
  console.log('MINUTES TILL TRAIN: ' + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
  console.log('ARRIVAL TIME: ' + moment(nextTrain).format('hh:mm'));

  // Code for handling the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    tfrequency: tfrequency,
    nextTrain: nextTrain.toString(),
    tMinutesTillTrain: tMinutesTillTrain.toString()
  });
});

// Firebase watcher .on("child_added"
database.ref().on(
  'child_added',
  function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Change the HTML to reflect
    var colTrainName = $('<td>').text(sv.trainName);
    var colDestination = $('<td>').text(sv.destination);
    var frequency = $('<td>').text(sv.tfrequency);
    var colNextArrival = $('<td>').text(sv.nextTrain);
    var colMinutesAway = $('<td>').text(sv.tMinutesTillTrain);

    var tableRow = $('<tr>').append(
      colTrainName,
      colDestination,
      frequency,
      colNextArrival,
      colMinutesAway
    );

    $('tbody').append(tableRow);

    // Handle the errors
  },
  function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  }
);
