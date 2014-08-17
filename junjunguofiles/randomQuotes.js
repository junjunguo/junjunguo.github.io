/**
 * Created by junjun on 17.08.14.
 */

var textFile = 'junjunguofiles/myQuotes.txt';

console.log(textFile);


var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile() {
    reader.open('get', textFile, true);
    reader.onreadystatechange = displayContents;
    reader.send(null);
}

function displayContents() {
    if (reader.readyState == 4) {
        console.log(reader.responseText);
        var quotesArray = reader.responseText.split("\n");
        var totalQuotes = quotesArray.length;
        var randomQuotes = Math.floor(Math.random() * totalQuotes);
        console.log("................"+quotesArray[0]);
        console.log("total Quotes: "+totalQuotes+" random quotes: "+randomQuotes);

        var el = document.getElementById('myquotes');
        el.innerHTML = quotesArray[randomQuotes];
    }
}
loadFile();
