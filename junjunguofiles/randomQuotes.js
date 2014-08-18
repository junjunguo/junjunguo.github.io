/**
 * Created by junjun on 17.08.14.
 */

var textFile = 'junjunguofiles/myQuotes.txt';

console.log(textFile);

var quotesArray = [];
var totalQuotes = 0;
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile() {
    reader.open('get', textFile, true);
    reader.onreadystatechange = displayContents;
    reader.send(null);
}


function displayContents() {
    if (reader.readyState == 4) {
        quotesArray = reader.responseText.split("\n");
        totalQuotes = quotesArray.length;
        //console.log(reader.responseText);
        console.log("quotes array length: " + quotesArray.length);
        console.log("if generate quotes....");
        generateQuotes();
    } else {
        quotesArray = "Wonder is the beginning of wisdom.    <br>Socrates";
        totalQuotes = quotesArray.length;
        console.log("else: generate quotes....");
        generateQuotes();
    }
}


loadFile();

function generateQuotes() {
    var randomQuotes = Math.floor(Math.random() * totalQuotes);
    //console.log("................"+quotesArray[0]);
    console.log("total Quotes: " + totalQuotes + " random quotes: " + randomQuotes);
    var el = document.getElementById('myquotes');
    el.innerHTML = quotesArray[randomQuotes];
}


var changeImageP = document.getElementById("prevslide");
changeImageP.onclick = function () {
    generateQuotes();
}

var changeImageN = document.getElementById("nextslide");
changeImageN.onclick = function () {
    generateQuotes();
}

var changeQuotes = document.getElementById("myquotes");
changeQuotes.onclick = function () {
    generateQuotes();
}