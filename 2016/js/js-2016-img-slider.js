/**
 * Created by GuoJunjun on 06/03/16. <junjunguo.com>
 *
 */


var textfilpanoramio = './2016/img/mypanoramiophotos.txt';

var readerp = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var pcount  = 0; // slider pcount
var pimgList;

/**
 * load saved txt file
 * @param textFile
 */
function loadJSONfile(textFile) {
    readerp.open('get', textFile, true);
    readerp.onreadystatechange = getJSONobject;
    readerp.send(null);
}
/**
 * cast to jsonString variable if succeed
 */
function getJSONobject() {
    if (readerp.readyState == 4) {
        pimgList = shufflePList(JSON.parse(readerp.responseText).photos);

        var image     = new Image();
        image.src     = "http://static.panoramio.com/photos/large/" + pimgList[0].id + ".jpg";
        // image.src     = "../images/bg/" + pimgList[0].id + ".jpg";
        image.onload  = function () {
            //console.info("Image loaded !");
            loadPimgs();
        };
        image.onerror = function () {
            //console.error("Cannot load image");
        }

    } else {
        // error occurred
    }
}

/**
 * Load images to htmllist
 */
function loadPimgs() {
    $("#my-carousel").carousel(0);
    var slideHtml = '';
    for (i = 0; i < 6; i++) {
        var j = (pcount * 6 + i) % (pimgList.length);
        if (i == 0) {
            slideHtml +=
                '<div class="item active animated ' + animate() + '">';
        } else {
            slideHtml +=
                '<div class="item">';
        }
        slideHtml +=
            '   <img src="http://static.panoramio.com/photos/large/' + pimgList[j].id +
            '.jpg" alt="photo: ' + pimgList[j].title + '">' +
            '            <div class="carousel-caption">';

        if (i == 5) {
            slideHtml +=
                '<div>' +
                '   <h4 class="animated shake"><a href="http://www.panoramio.com/user/2481456" class="icon fa-picture-o">' +
                '       View my photo gallery at Panoramio</a></h4>' +
                '   <h2 class="animated flip"><a id="panoramio-next" class="icon fa-forward"> Next slider</a></h2>' +
                '</div>';
        }

        slideHtml +=
            '       <p class="animated ' + animate() + '">' + pimgList[j].title + '</p>' +
            '   </div>' +
            '</div>';
    }
    document.getElementById("my-slides").innerHTML = "";
    document.getElementById("my-slides").innerHTML = slideHtml;
    pcount++;
    document.getElementById("panoramio-next").addEventListener("click", loadPimgs);
}

/**
 * Shuffle a list
 *
 * @param list
 * @returns {Array}
 */
function shufflePList(list) {
    var copy = [], index, n = list.length;
    while (n) {
        index = Math.floor(Math.random() * (n--));
        copy.push(list[index]);
        list.splice(index, 1);
    }
    return copy;
}
/**
 * get a random file: path: ./doc/   ;  total files 7
 * @returns {string}
 */
function getRandomFile() {
    return './doc/myphotos' + Math.floor(Math.random() * (7)) + '.txt';
}

loadJSONfile(textfilpanoramio);

/*
 original
 large
 medium (default value)
 small
 thumbnail
 square
 mini_square
 */

// browser height:
//
//$("img").css("max-height", '"' + $(window).height() + 'px"');
//
//console.log('"' + $(window).height() + 'px"');