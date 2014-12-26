/**
 * Created by junjun on 25.12.14.
 */



function shuffleList() { // shuffle nrlist and return a list with objects ready for slides
    var list = [			//  Images id numbers
        77233663, 105836333, 109199045, 109172199, 92464442, 92464435, 55717739, 77835786, 107909681, 51569735,
        108930464,
        109049207, 109100961, 106397977, 92401424
    ]

    var copy = [], n = list.length, index;
    while (n) {
        index = Math.floor(Math.random() * (n--));
        copy.push('http://static.panoramio.com/photos/large/' + list[index] + '.jpg');
        list.splice(index, 1);
    }
    return copy;
}


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
        counter++;
        showImage();
    });
    $('.prevslide').on('click', function () {
        counter--;
        showImage();
    });

    showImage();
}

//run the script:
slideShow();