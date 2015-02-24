/**
 * Created by GuoJunjun on 19.08.14.
 */

var textFile = 'junjunguofiles/quotations.txt';

var quotesArray = [];
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
        //console.log("else: generate quotes....");
        //generateQuotes();
    }
}


function generateQuotes() {
    //console.log("activ generate quotes: quotes array length: " + jokes.length);
    for (var i = 0; i < quotesArray.length; i++) {
        //console.log(jokes[i]);
        var theQuotation = quotesArray[i].split("#");
        //console.log(theQuotation.length);
        var newElementL = document.createElement("li");
        var newElementP = document.createElement("p");
        var newElementH = document.createElement("h5");
        //var quotationText = document.createTextNode(theQuotation[1]);
        var quotationAuthor = document.createTextNode(" - " + theQuotation[0]);
        // use innerHTML
        //newElementP.appendChild(quotationText);
        newElementP.innerHTML = theQuotation[1];
        newElementH.appendChild(quotationAuthor);
        newElementL.appendChild(newElementP);
        newElementL.appendChild(newElementH);
        document.getElementById("quotes").appendChild(newElementL);
    }
}
loadFile();