// GLOBAL VARS
let currentDate = moment().format('LL'); // grabs current date from m.js in mmmm dd, yyyy format
let formattedCurrentDate = moment().format("YYYY-MM-DD"); // creates current date in YYYY-MM-DD format (for TM API)

let userCity;

$("#todays-date").text(currentDate); // this changes the DOM's current date

//Getting the date for the ticketmaster widget
var todayDate = moment().format("YYYY-MM-DD");
console.log(todayDate)
var addDay = moment().add(1, "days").format("YYYY-MM-DD");
console.log(addDay);



// Call to Rob's TM API js
// function renderTMEvents(startDate, startTime, endDate, endTime, city, state, postalCode, countryCode, radius, maxEvents) {
//     console.log(startDate);
//     console.log(city);
// };


// Call to Carrie's Spotify API js
let clientId = "db62643fda74460eb21d4ea74fddb8ce";
let redirectUri = "https:%2F%2Fcplank.github.io%2FToday-s-Play%2F";


userCity = localStorage.getItem("location");
formattedCurrentDate = localStorage.getItem("date");



// function when user submits location
function userAction() {

    userCity = $("#user-input").val().trim(); // grab user input for City


    $("#widgets").removeClass("hidden"); // shows widget section
    $('html,body').animate({ // animate scroll to widget div
        scrollTop: $("#widgets").offset().top
    }, 'slow');

    let userTMEvents = [];
    userTMEvents = renderTMEvents(formattedCurrentDate, "", formattedCurrentDate, "", userCity, "", "", "", "", "");

    $("#todays-date").val("");
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
};



// CALLBACK LOADS TO WIDGETS SECTION
window.onload = function () {
    $('html,body').animate({ // animate page to scroll to about section
        scrollTop: $("#widgets").offset().top
    });
};




// when user presses enter key
$("#user-input").keydown(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        userAction();
        $("#user-input").val("");
    };
});

// when user clicks enter button
$('#enter-button').click(function (event) {
    userAction();
    $("#user-input").val("");
});

// when user clicks about button
$('#about-button').click(function (event) {
    $("#about-container").removeClass("hidden"); // shows about section
    $('html,body').animate({ // animate page to scroll to about section
        scrollTop: $("#about-container").offset().top
    }, 'slow');
});



// -------------------------------- BACK TO TOP BUTTON STUFF
var link = document.getElementById("back-to-top");
var amountScrolled = 250;

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }

}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

window.addEventListener('scroll', function (e) {
    if (window.scrollY > amountScrolled) {
        addClass(link, 'show');
    } else {
        removeClass(link, 'show');
    }
});

$('#back-to-top').click(function (event) {  // when start button is clicked
    $('html,body').animate({ // animate page to scroll to top
        scrollTop: $("#top").offset().top
    }, 'slow');
});

//Using javascript to make the ticketmaster widget
function inputTodayDate() {

}
function addDayInWidget() {

    let spotyWidgy = '<div w-type="event-discovery" w-tmapikey="HuptMNvrDLaDMhz8Y5NOpg5s7hvSDucs" w-googleapikey="AIzaSyAt-7vjGZ8A-EuZhf1F_AJCUkGU3Zsky_o" w-keyword="" w-theme="listviewthumbnails" w-colorscheme="dark" w-width="350" w-height="600" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="25" w-city="Seattle" w-period="custom" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="custom" w-titlelink="off" w-sorting="groupByName" w-id="id_o1oh7a" w-countrycode="US" w-source="" w-classificationname="music" w-startdatetime=' + addDay + ' w-enddatetime=' + addDay + ' w-latlong=""></div>'

    $('#spotifywidgethole').html(spotyWidgy);


}

inputTodayDate()
addDayInWidget()








// to populate spotify playlists (for each instance) 


// let tmParams = formattedCurrentDate + " " + userCity;

// This also works, doesn't scroll
// $(document).ready(function(){
//     window.location.hash = '#widgets';
// })










