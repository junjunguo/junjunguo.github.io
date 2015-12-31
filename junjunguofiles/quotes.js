/**
 * Created by GuoJunjun on 19.08.14.
 */

var textFile = 'junjunguofiles/quotations.txt';

var quotesArray = [];
var reader      = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

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
        var element_li               = document.createElement("li");
        var element_blockquote       = document.createElement("blockquote");
        element_blockquote.className = element_blockquote.className + " wow fadeInUp";
        var element_p                = document.createElement("p");
        var element_footer           = document.createElement("footer");
        var element_cite             = document.createElement("cite");
        var quotationAuthor = document.createTextNode(theQuotation[0]);
        // use innerHTML
        //newElementP.appendChild(quotationText);
        element_p.innerHTML = theQuotation[1];
        element_cite.appendChild(quotationAuthor);
        element_footer.appendChild(element_cite);
        //element_footer.appendChild(quotationAuthor);
        element_blockquote.appendChild(element_p);
        element_blockquote.appendChild(element_footer);
        element_li.appendChild(element_blockquote);
        document.getElementById("quotes").appendChild(element_li);
    }
}
loadFile();

// load js/wow.min.js
var wow = new WOW(
    {
        boxClass:        'wow',      // animated element css class (default is wow)
        animateClass:    'animated', // animation css class (default is animated)
        offset:          0,          // distance to the element when triggering the animation (default is 0)
        mobile:          true,       // trigger animations on mobile devices (default is true)
        live:            true,       // act on asynchronously loaded content (default is true)
        callback:        function (box) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null // optional scroll container selector, otherwise use window
    }
);
wow.init();