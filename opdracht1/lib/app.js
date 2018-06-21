"use strict";
var accessToken = null;
var CLIENT_ID="314479084606-tdpqs6jjpv9dt2d1848fpfrmmbom18pd.apps.googleusercontent.com";
var SCOPES=["https://www.googleapis.com/auth/calendar"];
var artiestCalendar = "";
var locatieCalendar = "";
var startDatumCalendar ="";
var eindDatumCalendar ="";

var namenArray = [];
var startDatumsArray = [];
var locatiesArray = [];
var count = 0;

var ID = 0;

function error(msg) {
    info(msg);
}

function info(msg) {
    $("#info").text(msg);
}

function authorizeUser() {
    var client_id = '2aa48123a3524aaea134c2983f6a6e50';
    var redirect_uri = 'http://localhost:8000';
    var redirect_uri = 'http://student.howest.be/simon.gemmel/webadvanced/opdracht1/index.html';
    var url = 'https://accounts.spotify.com/authorize?client_id=' +
        client_id + '&response_type=token' +
        '&scope=user-library-read user-follow-read' + '&redirect_uri=' +
        encodeURIComponent(redirect_uri);
    document.location = url;
}

function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}

function fetchSavedartists(callback) {
    var url = 'https://api.spotify.com/v1/me/following?type=artist';
    callSpotify(url, {}, callback);
}

function callSpotify(url, data, callback) {
    $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            callback(r);
        },
        error: function(r) {
            callback(null);
        }
    });
}

var table = "<table>";
var tables = "<table>";
var Tour = "";

function printartists(artists) {
    var ni = document.getElementById('opvulling');
    var ni2 = document.getElementById('opvulling2');
    var titel = document.getElementById('titel');
    if (Tour.length < 1) {
        ni2.innerHTML += "<h1>Alle artiesten:</h1>";
        titel.innerHTML = "<h1>Op tour in jouw buurt:</h1>";
        Tour = "eenmaal";
    }
    _.each(artists.artists.items, function(item) {
        var artistName = item.name;
        var artistImage = item.images[0];
        var bandsInTown = 'http://api.bandsintown.com/artists/' +
            artistName +
            '/events/search.json?api_version=2.0&app_id=SimonGemmelAPI&location=use_geoip&radius=50';
        var naam = [];
        var ticket = [];
        var datum = [];
        var status = [];
        var datum2 = [];
        var locaties = [];
        var artiestUrl = item.uri;

        console.log(bandsInTown);
        $.ajax({
            type: "GET",
            url: bandsInTown,
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    naam[i] = data[i].title;
                    ticket[i] = data[i].ticket_url;
                    datum[i] = data[i].formatted_datetime;
                    datum2[i]= data[i].datetime;
                    locaties[i] = data[i].formatted_location;
                    status[i] = data[i].ticket_status;


                }
                functie(naam, ticket, datum, status, datum2, locaties);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status);
                console.log("Te veel requests");
            },
            dataType: "jsonp"
        });
        var x = document.createElement("IMG");
        x.setAttribute("src", artistImage.url);
        x.setAttribute("width", "300");
        x.setAttribute("alt", artistName);
        function functie(data, ticket, datum, status, datum2, locaties) {
            ni2.innerHTML +=
                "<div id='box-1' class='box' onclick='specifiekeArtiest(\"" +
                artistName + "\")'><img id='" + artistName +
                "' src=" + artistImage.url +
                " /><span class='caption simple-caption'><p>" +
                artistName + "</p></span></div> ";
            if (naam.length >= 1) {
                table += "<tr><th><a href=" + artiestUrl + "> " +
                artistName + "</a>";
                table += "</th></tr>";
                for (var i = 0; i < naam.length; i++) {
                    var url = "'" + ticket[i] + "'";
                    table += "<tr><td>" + naam[i];
                    table += "&nbsp; | &nbsp;" + datum[i] +
                    "</td>";
                    if (status[i] = "available") {
                        table += "<td>" +
                        '<div id="koop"> <a href=' + url +
                        ' class="tickets" target="_blank">Koop tickets</a> </div></td>';
                    } else {
                        table += "<td>" +
                        ' Uitverkocht! </td>';
                    }
                    namenArray.push(artistName);
                    startDatumsArray.push(datum2[i]);
                    locatiesArray.push(locaties[i]);

                    table+= '<td><input type="button" id="' + count + '" class="calendar" value="&#128197 Opslaan in kalender" onclick="authorizeGoogle($(this));"></td></tr>';
                    count++;

                }
            } else {
                titel.innerHTML =
                    "<h1>Geen artiesten op tour in jouw buurt:</h1>"
            }
            functieTable(table);
        }

        function functieTable(table) {
            table += "</table>";
            ni.innerHTML = table;
        }
    });

}
var value = "";
var date = "";
var e = "";
var selectThis = "";

function filter() {
    var elementsToTrigger = $([$('.cd-filter-trigger'), $('.cd-filter'), $(
        '.cd-tab-filter'), $('.cd-gallery')]);
    elementsToTrigger.each(function() {
        $(this).toggleClass('filter-is-visible', 'false');
    });
    value = document.getElementById('value').value;
    e = document.getElementById('selectThis');
    selectThis = e.options[e.selectedIndex].value;
    date = document.getElementById('date').value;
    tables = "<table>";
    fetchSavedartists(function(data) {
        if (data) {
            printartists2(data);
        }
    });
    $("#value").prop('value', '');
}

function printartists2(artists) {
    var pi = document.getElementById('filterResultaat');
    var titel = document.getElementById('titel2');
    Tour = "";
    pi.innerHTML = "";
    $("#OpTour").css("display", "none");
    titel.innerHTML = "<h1>Op tour in " + value + ":</h1>";
    Tour = "eenmaal";
    _.each(artists.artists.items, function(item) {
        var artistNames = item.name;
        var artistImages = item.images[0];
        var bandsInTowns = 'http://api.bandsintown.com/artists/' +
            artistNames +
            '/events/search.json?api_version=2.0&app_id=SimonGemmelAPI&location=' +
            value + '&date=' + date + '&radius=' + selectThis;
        console.log(bandsInTowns);
        var naams = [];
        var tickets = [];
        var datums = [];
        var statuss = [];
        var artiestUrls = item.uri;
        var datum2 = [];
        var locaties = [];

        $.ajax({
            type: "GET",
            url: bandsInTowns,
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    naams[i] = data[i].title;
                    tickets[i] = data[i].ticket_url;
                    datums[i] = data[i].formatted_datetime;
                    statuss[i] = data.ticket_status;
                    datum2[i]= data[i].datetime;
                    locaties[i] = data[i].formatted_location;
                }
                functie(naams, tickets, datums, statuss, datum2, locaties);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status);
                console.log("Te veel requests");
            },
            dataType: "jsonp"
        });

        function functie(naams, tickets, datums, statuss, datum2, locaties) {
            if (naams.length >= 1) {
                tables += "<tr><th><a href=" + artiestUrls +
                "> " + artistNames + "</a>";
                tables += "</th></tr>";
                for (var i = 0; i < naams.length; i++) {
                    var urls = "'" + tickets[i] + "'";
                    tables += "<tr><td>" + naams[i];
                    tables += "&nbsp; | &nbsp;" + datums[i] +
                    "</td>";
                    if (statuss[i] = "available") {
                        tables += "<td>" +
                        '<div id="koop"> <a href=' + urls +
                        ' class="tickets" target="_blank">Koop tickets</a> </div></td>';
                    } else {
                        tables += "<td>" +
                        ' Uitverkocht! </td>';
                    }
                    
                    namenArray.push(artistNames);
                    startDatumsArray.push(datum2[i]);
                    locatiesArray.push(locaties[i]);

                    tables+= '<td><input type="button" id="' + count + '" class="calendar" value="&#128197 Opslaan in kalender" onclick="authorizeGoogle($(this));"></td></tr>';
                    count++;
                }
                functieTable(tables);
            } else if (naams.length = 0) {
                titel.innerHTML = "<h1>Geen optredens in " +
                value + " gevonden.</h1>"
            }
        }

        function functieTable(tables) {
            tables += "</table>";
            pi.innerHTML = tables;
        }
    });
}

function specifiekeArtiest(data) {
    var artistNames = data;
    var pi = document.getElementById('filterResultaat');
    var titel = document.getElementById('titel2');
    Tour = "";
    pi.innerHTML = "";
    // ni2.innerHTML="";
    $("#OpTour").css("display", "none");
    if (Tour.length < 1) {
        titel.innerHTML = "<h1>Tourdata voor:</h1>";
        Tour = "eenmaal";
    }
    var naams = [];
    var tickets = [];
    var datums = [];
    var statuss = [];
    var datum2 = [];
    var locaties = [];
    var artiestUrls = data.uri;
    tables = "<table>";
    var bandsInTown = 'http://api.bandsintown.com/artists/' + data +
        '/events.json?api_version=2.0&app_id=SimonGemmelAPI';
    $.ajax({
        type: "GET",
        url: bandsInTown,
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                naams[i] = data[i].title;
                tickets[i] = data[i].ticket_url;
                datums[i] = data[i].formatted_datetime;
                statuss[i] = data.ticket_status;
                datum2[i]= data[i].datetime;
                locaties[i] = data[i].formatted_location;
            }
            functie(naams, tickets, datums, statuss, datum2, locaties);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.status);
            console.log("Te veel requests");
        },
        dataType: "jsonp"
    });

    function functie(naams, tickets, datums, statuss, datum2, locaties) {
        if (naams.length >= 1) {
            //console.log(naam);
            tables += "<tr><th><a href=" + artiestUrls + "> " +
            artistNames + "</a>";
            tables += "</th></tr>"
            for (var i = 0; i < naams.length; i++) {
                var urls = "'" + tickets[i] + "'";
                tables += "<tr><td>" + naams[i];
                tables += "&nbsp; | &nbsp;" + datums[i] + "</td>";
                tables += "<td>" + '<div id="koop"> <a href=' + urls +
                ' class="tickets" target="_blank">Koop tickets</a> </div></td>';
                namenArray.push(artistNames);
                startDatumsArray.push(datum2[i]);
                locatiesArray.push(locaties[i]);

                tables+= '<td><input type="button" id="' + count + '"  class="calendar" value="&#128197 Opslaan in kalender" onclick="authorizeGoogle($(this));"></td></tr>';
                count++;

            }
            functieTable(tables);
        } else {
            titel.innerHTML = "<h1>" + artistNames +
            " is niet op tour.</h1>"
        }
    }

    function functieTable(tables) {
        tables += "</table>";
        pi.innerHTML = tables;
    }
}




function authorizeGoogle(caller) {
    ID = caller.attr('id');
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},handleAuthResult);
    return false;
}

function handleAuthResult(authResult){

  
    if(authResult && !authResult.error){
        loadCalendarAPI();

    }else{
        alert("Probleem met connecteren naar Google!");
    }
}


function loadCalendarAPI(){
    gapi.client.load("calendar","v3",SaveConcerts);
}

function SaveConcerts(){
    
    var startDatumCalendar2 = new Date(startDatumsArray[ID].toString());
    eindDatumCalendar = new Date(startDatumCalendar2.toString());
    eindDatumCalendar.setHours(eindDatumCalendar.getHours()+3);
    var event = {'summary':namenArray[ID],
    'location':locatiesArray[ID],
    'start':{
        'dateTime':new Date(startDatumCalendar2).toISOString(),
        'timeZone':'Europe/Brussels'
    },
        'end':{
            'dateTime':new Date(startDatumsArray[ID]).toISOString(),
        'timeZone':'Europe/Brussels'},
        'reminders':{
            'useDefault':true
    }};
    console.log(event);
    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    request.execute(function(event) {


        setTimeout( function() {

            var notification = new NotificationFx({
                message : '<span class="icon icon-calendar"></span><p>Het optreden van '+namenArray[ID]+' is toegevoegd in uw Google Calendar!</p>',
                layout : 'attached',
                effect : 'bouncyflip',
                type : 'notice'

            });


            notification.show();

        }, 1200 );

    });
}

$(document).ready(function() {
    //function() {
    var args = parseArgs();
    if ('access_token' in args) {
        accessToken = args['access_token'];
        $("#go").hide();
        $(".cd-filter-trigger").css('display', 'block');
        $("body").css('background-image', 'none');
        $(".menu ul li a").css('color', 'black');
        $("#test").css('display', 'none');
        $("html").css('background', ' #cccccc');
        $("#achtergrond").css("display", "block");
        $(".menu-navigation-basic a").css("color", "#000");
        $(".menu-navigation-basic a").css("text-shadow", "none");
        $(".menu-navigation-basic a:hover").css("border-bottom",
            "solid 2px #000");
        $(".menu-navigation-basic a:hover").css("color", "#000");
        fetchSavedartists(function(data) {
            if (data) {
                printartists(data);
            } else {
                error("Trouble getting your saved artists");
            }
        });
    } else {
        $("#go").show();
        $("#go").on('click', function() {
            authorizeUser();
        });
    }
});