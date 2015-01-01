/**
 * Created by GuoJunjun on 25.12.14. JunjunGuo.com
 */


/**
 * shuffle inner list and return a photo address list
 * @returns {Array}
 */
function shuffleList() { // shuffle nrlist and return a list with objects ready for slides
    var list = [			//  Images id numbers
        77233663, 105836333, 109199045, 109172199, 92464442, 92464435, 55717739, 77835786, 107909681, 51569735,
        108930464, 109049207, 109100961, 106397977, 106419102, 77835780, 51569745, 78491829, 49428516, 43143230,
        42462727, 106397984, 100920020, 100920022
    ]

    var copy = [], n = list.length, index;
    while (n) {
        index = Math.floor(Math.random() * (n--));
        copy.push('http://static.panoramio.com/photos/large/' + list[index] + '.jpg');
        list.splice(index, 1);
    }
    return copy;
}

/**
 * add the image to #header as background image
 * @param theImg
 */
function addImage(theImg) {
    document.getElementById("header").style.backgroundImage = "url('" + theImg + "')";
}

function slideShow() {
    var counter = 0; // to keep track of current slide
    var slides = shuffleList(); // a collection of all of the slides

    var showImage = function () {
// calculates the actual index of the element to show
        var theImage = Math.abs(counter % slides.length);
        addImage(slides[theImage]);
    };

// add click events to prev &amp; next buttons
    $('.nextslide').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter++;
        showImage();
    });
    $('.prevslide').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter--;
        showImage();
    });
    // logo click
    $('#logo').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter = Math.floor(Math.random() * slides.length);
        showImage();
    });


    showImage();
}

//run the script:
slideShow();