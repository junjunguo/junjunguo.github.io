/**
 * Created by GuoJunjun on 29.12.14. JunjunGuo.com
 *
 */

var textFile = './junjunguofiles/quotations.txt';

var quotesArray = [], n, index;
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
        console.log("total quotes : " + quotesArray.length);
        generateQuotes();
    } else {
        quotesArray = "Wonder is the beginning of wisdom.    <br>Socrates";
        totalQuotes = quotesArray.length;
    }
}


function generateQuotes() {
    n = quotesArray.length;
    if (n == 0) {
        loadFile();
    }
    index = Math.floor(Math.random() * (n));
    console.log("n: " + n + " index " + index);
    var theQuotation = quotesArray[index].split("#");
    quotesArray.splice(index, 1);
    var thequote = document.getElementById("anewquote");
    thequote.innerHTML = "<p>" + theQuotation[1] + "</p><h5> - " + theQuotation[0] + "</h5>";
}
loadFile();

var changeQuotes = document.getElementById("anewquote");
changeQuotes.onclick = function () {
    window.open("#banner","_self");

    generateQuotes();
}
