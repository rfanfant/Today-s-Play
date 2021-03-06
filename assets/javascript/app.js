//Getting the date for the ticketmaster widget
var todayDate = moment().format("YYYY-MM-DD");
console.log(todayDate)
var addDay = moment().add(1, "days").format("YYYY-MM-DD");
console.log(addDay);


// GLOBAL VARS
let currentDate = moment().format('LL'); // grabs current date from m.js in mmmm dd, yyyy format

// Getting userCity input in app.js file from local storage
$("#todays-date").text(currentDate); // this changes the DOM's current date





// Call to Rob's TM API js
// function renderTMEvents(startDate, startTime, endDate, endTime, city, state, postalCode, countryCode, radius, maxEvents) {
//     console.log(startDate);
//     console.log(city);
// };


// Call to Carrie's Spotify API js
// let clientId = "db62643fda74460eb21d4ea74fddb8ce";
// let redirectUri = "https:%2F%2Fcplank.github.io%2FToday-s-Play%2F";


userCity = localStorage.getItem("location");
formattedCurrentDate = localStorage.getItem("date");




// ROBS STUFF
// TMArtistObject contains information about one performing artist

// Array of Artists 
var TMEvents = [];

// jQuery(document).ready(function () {
////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT!!! set "var debug = true" when debugging, else set it to false           //////
////////////////////////////////////////////////////////////////////////////////////////////
var debug = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////
//  parseEvents(resultArray, parseString) - parses the parseString based on "," separator. Push result //
//          into resultArray                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function parseEvents(resultArray, parseString) {
    let partsArray = parseString.split(',');
    for (let i = 0; i < partsArray.length; i++) {
        {
            resultArray.push(partsArray[i]);
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  createEvents(param events) - parses the Ticket Master response into an array of TMArtistObjects    //
//             contained in the TMEVents array                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function createEvents(events) {

    // called to create events from the TM AJAX call/response
    // So we now iterate through response, grabbing information about
    // individual artists playing in the events

    for (var i = 0; i < events.page.totalElements; i++) {
        //We found events so  loop though picking up artists
        // TODO: One more loop needed to recurse through warm up bands
        var TMArtistObject = {
            eventName: "",
            artistName: "",
            allArtists: [],
            spanMultipleDays: "",
            eventDate: "",
            eventTime: "",
            eventID: "",
            onSaleStatus: "",
            venueName: "",
            venueStreetAddress1: "",
            venueCity: "",
            venueState: "",
            venueZipCode: "",
            artistURL: [],
            genre: "",
        };

        // create a single artist object and push into the TM Events array
        var newArtist = TMArtistObject;

        TMEvents.push(newArtist);

        // try to pick up the warm up bands as well..
        // we need to put it in a try/catch block because the 
        // XML data isn't the same for all artists, therefore 
        // events._embedded.events[i]._embedded.attraction might
        // not exists for all artists
        try {
            if (events._embedded.events[i]._embedded.attractions.length)
                arrayLength = events._embedded.events[i]._embedded.attractions.length;
            else
                arrayLength = o;

            //console.log(events._embedded.events[i]._embedded.attractions[0].name);
            if (arrayLength) {
                for (var x = 0; x < arrayLength; x++) {
                    var attractions = events._embedded.events[i]._embedded.attractions[x].name;
                    console.log(attractions);
                    parseEvents(TMEvents[i].allArtists, attractions);
                }
            }
            else {
                parseEvents(TMEvents[i].allArtists, events._embedded.events[i].name);
            }
        }
        catch{

            // log to console that we had an exception but do nothing about the 
            // exception. We therefore need to update allArtists with event name
            console.log("FYI: exception occured reading TM response...no big deal as it might be expected");
            parseEvents(TMEvents[i].allArtists, events._embedded.events[i].name);
        }

        TMEvents[i].eventName = events._embedded.events[i].name;
        TMEvents[i].artistName = events._embedded.events[i].name;
        TMEvents[i].spanMultipleDays = events._embedded.events[i].dates.spanMultipleDays;
        TMEvents[i].eventDate = events._embedded.events[i].dates.start.localDate;
        TMEvents[i].eventTime = events._embedded.events[i].dates.start.localTime;
        TMEvents[i].onSaleStatus = events._embedded.events[i].dates.status.code;
        TMEvents[i].eventID = events._embedded.events[i].id;
        TMEvents[i].venueName = events._embedded.events[i]._embedded.venues[0].name;
        TMEvents[i].venueStreetAddress1 = events._embedded.events[i]._embedded.venues[0].address.line1;
        TMEvents[i].venueCity = events._embedded.events[i]._embedded.venues[0].city;
        TMEvents[i].venueState = events._embedded.events[i]._embedded.venues[0].state.stateCode;
        TMEvents[i].venueZipCode = events._embedded.events[i]._embedded.venues[0].postalCode;
        TMEvents[i].genre = events._embedded.events[i].classifications[0].genre.name;
        // retrieve every image from the main event
        for (let n = 0; n < events._embedded.events[i].images.length; n++) {
            TMEvents[i].artistURL.push(events._embedded.events[i].images[n].url);
        }
    }
    return TMEvents;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// renderTMEvents() - primary API into TM Events API
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderTMEvents(startDate, startTime, endDate, endTime, city, state, postalCode, countryCode, radius, maxEvents) {

    // We are expecting a valid date and city or else stop....TODO: return a valid error code
    if ((!startDate) || (!endDate) || (!city)) {
        alert("Fatal Error - no date  or city passed into renderTMEvents");
    }

    // Initialize time to 24 hours if not passed in
    if (!startTime) {
        startTime = "00:00:00";
    }

    if (!endTime) {
        endTime = "23:59:59";
    }

    if (!radius) {
        radius = 150;

    }

    // maximum number of events we want returned from Ticket Master event query
    if (!maxEvents) {
        maxEvents = "30";
    }

    // construct the TM localStartDateTime needed for the search event TM API
    var localStartDateTime = "&localStartDateTime=" + startDate + "T" + startTime + "," + endDate + "T" + endTime;
    //var endDateTime = "&localStartEndDateTime=" + endDate + "T" + endTime + "Z";

    // always looking for music events for this app.
    var classificationId = "&classificationId=KZFzniwnSyZfZ7v7nJ";

    //URL into TM API'
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?size=" + maxEvents + "&apikey=uFdFU8rGqFvKCkO5Jurt2VUNq9H1Wcsx";
    var queryString = url + localStartDateTime + classificationId + countryCode;

    // construct the appropriate parameters needed for TM
    if (city) {
        queryString = queryString + "&city=" + city;
    }
    if (radius) {
        queryString = queryString + "&radius=" + radius;
    }
    if (postalCode) {
        queryString = queryString + "&postalCode=" + postalCode;
    }
    if (state) {
        queryString = queryString + "&state=" + state;
    }

    // console log the queryString
    console.log(queryString);

    // make the AJAX call into TM
    $.ajax({
        type: "GET",
        url: queryString,
        async: true,
        dataType: "json",
        success: function (response) {
            // we are here if the AJAX call is successful
            console.log(response);
            var events = createEvents(response);
            // return TMEvents;
            // console.log(TMEvents);

            let artistNames = [];
            for (let i = 0; i < events.length; i++) {
                artistNames.push(events[i].artistName);
                // makePlaylist(encodeURIComponent(events[i].artistName))
            }

            makePlaylist(makeArtistNameWorkForSpotify(artistNames));
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
            // TODO: return an error code for now just setTMEvent to empty
            TMEvents = "";
            console.log(err);
        }
    });
};





// function when user submits location
function userAction() {

    userCity = $("#user-input").val().trim(); // grab user input for City


    $("#widgets").removeClass("hidden"); // shows widget section
    $('html,body').animate({ // animate scroll to widget div
        scrollTop: $("#widgets").offset().top
    }, 'slow');

    let formattedCurrentDate = moment().format("YYYY-MM-DD"); // creates current date in YYYY-MM-DD format (for TM API)
    renderTMEvents(formattedCurrentDate, "", formattedCurrentDate, "", userCity, "", "", "", "", "") //.then(function (data) {
    // console.log(data);
    //})

    console.log(TMEvents);



    $("#todays-date").val("");
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-public%20user-read-private%20user-read-email&response_type=token&state=123`;
};



// CALLBACK LOADS TO WIDGETS SECTION
window.onload = function () {
    $('html,body').animate({ // animate page to scroll to about section
        scrollTop: $("#widgets").offset().top
    });

    // when we hit the page, do this right away, but only if we're on the callback page.
    if (window.location.href.indexOf("callback") > -1) {
        renderTMEvents(formattedCurrentDate, "", formattedCurrentDate, "", userCity, "", "", "", "", "") //.then(function (data) {
    }
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
//Adding in user input for city in widget (+ userCity +)
function inputTodayDate() {

}
function addDayInWidget() {

    let spotyWidgy = '<div w-type="event-discovery" w-tmapikey="HuptMNvrDLaDMhz8Y5NOpg5s7hvSDucs" w-googleapikey="AIzaSyAt-7vjGZ8A-EuZhf1F_AJCUkGU3Zsky_o" w-keyword="" w-theme="listviewthumbnails" w-colorscheme="dark" w-width="350" w-height="500" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="25" w-city='+ userCity + ' w-period="custom" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="custom" w-titlelink="off" w-sorting="groupByName" w-id="id_o1oh7a" w-countrycode="US" w-source="" w-classificationname="music" w-startdatetime=' + addDay + ' w-enddatetime=' + addDay + ' w-latlong=""></div>'

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









