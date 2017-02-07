/**
 * Created by GuoJunjun on 07/03/16. <junjunguo.com>
 *
 */
var freader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var photoList;
var fcount  = 0; // slider fcount
var furlList;
/**
 * load saved txt file
 * @param textFile
 */
function loadMyFile(textFile) {
    freader.open('get', textFile, true);
    freader.onreadystatechange = toJSONobject;
    freader.send(null);
}
/**
 * cast to jsonString variable if succeed
 */
function toJSONobject() {
    if (freader.readyState == 4) {
        if (rawData) { // testing only: rawData
            photoList = JSON.parse(freader.responseText).photoset.photo;
            loadJSON();
        } else {
            var image     = new Image();
            furlList      = shuffleFList(JSON.parse(freader.responseText).photos);
            image.src     = furlList[0].url;
            image.onload  = function () {
                //console.info("Image loaded !");
                loadFimgs();
            };
            image.onerror = function () {
                //console.error("Cannot load image");
            }
        }
    } else {
        // error occurred
    }
}

/**
 * Load json file to new json file: url + tile
 */
function loadJSON() {
    //var photos = "";// string
    var jsonString = '{ "photos" : ['; // json string
    //for (var j in photoList) {
    for (var i = 0; i < photoList.length; i++) {
        //console.log(photoList[i]);
        var j = photoList[i];
        //https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg
        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        var url = "https://farm" + j.farm + ".staticflickr.com/" + j.server + "/" + j.id + "_" + j.secret + "_b.jpg";
        jsonString += '{ "url":"' + url + '", "title":"' + j.title + '" },';

    }
    jsonString = jsonString.slice(0, -1);
    jsonString += ']}';
    console.log("\n" + jsonString);
    furlList = shuffleFList(JSON.parse(jsonString).photos);
    loadFimgs();
}


/**
 * Load images to htmllist
 */
function loadFimgs() {
    $("#my-carousel-flickr").carousel(0);
    var fhtml = '';
    for (var i = 0; i < 6; i++) {
        var j = (fcount * 6 + i) % (furlList.length);
        if (i == 0) {
            fhtml +=
                '<div class="item active animated ' + animate() + '">';
        } else {
            fhtml +=
                '<div class="item">';
        }
        fhtml +=
            '   <img src="' + furlList[j].url +
            '" alt="photo: ' + furlList[j].title + '">' +
            '   <div class="carousel-caption">';

        if (i == 5) {
            fhtml +=
                '<div>' +
                '   <h4 class="animated fadeInDownBig"><a href="https://www.flickr.com/photos/guojunjun/albums/72157646082323705" class="icon fa-flickr">' +
                '       View my photo gallery at Flickr</a></h4>' +
                '   <h2 class="animated flip"><a id="flickr-next" class="icon fa-forward"> Next slider</a></h2>' +
                '</div>';
        }

        fhtml +=
            '       <p class="animated ' + animate() + '">' + furlList[j].title + '</p>' +
            '   </div>' +
            '</div>';
    }
    document.getElementById("my-flickr-slides").innerHTML = fhtml;
    fcount++;
    document.getElementById("flickr-next").addEventListener("click", loadFimgs);
}

/**
 * Shuffle a list
 *
 * @param list
 * @returns {Array}
 */
function shuffleFList(list) {
    var copy = [], index, n = list.length;
    while (n) {
        index = Math.floor(Math.random() * (n--));
        copy.push(list[index]);
        list.splice(index, 1);
    }
    return copy;
}
// --------- use handled json  ---------
var flickrTextfil = './2016/img/myflickrphotos.txt';
// --------- use raw data from flickr
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=54f8af3fd039bb7376cf5f26eef23522&photoset_id=72157646082323705&user_id=125412181%40N03&format=json&nojsoncallback=1&auth_token=72157665498906476-54d9a084cb5ad53e&api_sig=ad4abc6185cd1771d61e4d399a24c625";
// --------- use downloaded raw data
var flickrTextfilRaw = './2016/img/myflickrrawphotos.txt';
var rawData          = false;

loadMyFile(flickrTextfil);