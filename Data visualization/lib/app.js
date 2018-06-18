
var accessToken = null;
var genresz = [];
var myChart = "";


function error(msg) {
    info(msg);
}

function info(msg) {
    $("#info").text(msg);
}

function authorizeUser() {
    var client_id = '220d59021bb44e909f81964bb3251f5c';
    var redirect_uri = 'http://localhost:8000';
    var redirect_uri = 'http://student.howest.be/simon.gemmel/webadvanced/opdracht2/index.html';
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

var list = [];
var genresObj = {};

function printartists(artists){


var i = 0;

    _.each(artists.artists.items, function(item) {
        var genres = [];


        for(var i = 0; i< item.genres.length; i++){
            genres[i] = item.genres[i];
        }
        for(var i = 0; i<genres.length; i++){
            if (genres[i]  !== undefined && genres[i] != "" && genres[i] != " ") {

                list.push(genres[i]);

            }
        }

    });

    if (artists.artists.next) {
        callSpotify(artists.artists.next, {}, function(artists) {
            printartists(artists);
        });
    }
else{
        test(list);
    }

}

function test(list){


    list.sort();

    var current = null;
    var count = 0;


    for(var i = 0; i< list.length; i++){
        if(list[i] != current){
            if(count>0){
                genresObj[current] = count;


            }
            current = list[i];
            count = 1;
        }
        else{
            count ++;
        }

    }
    if(count>0){
        genresObj[current] = count;

    }
    bereken2(genresObj);

}

function bereken2(input){

    var keySorted = [];
    keySorted.length = 0;

    for (var genre in input){
        keySorted.push([genre, input[genre]]);
        keySorted.sort(function(a,b){return b[1]-a[1]})
    }



    pieValues(keySorted);

}


function pieValues(genres){


var colorArray = [];
    colorArray.push("#004C73","#334F78","#8DB0BF","#9DB0BF","#B6D9A4","#B6D998","#F0A534","#F0A565");


if(genres.length < 4){
    var pieData = [];
    var count = 0;
    for (var i=0; i<genres.length; i++){



           pieData.push({
               value: genres[i][1],
               color:colorArray[count],
               highlight: colorArray[count+1],
               label: genres[i][0]
           });

        count ++;
        count ++;

    }



}
    else{

    var pieData = [
        {
            value: genres[0][1],
            color:"#004C73",
            highlight: "#334F78",
            label: genres[0][0]
        },
        {
            value: genres[1][1],
            color: "#8DB0BF",
            highlight: "#9DB0BF",
            label: genres[1][0]
        },
        {
            value: genres[2][1],
            color: "#B6D9A4",
            highlight: "#B6D998",
            label: genres[2][0]
        },
        {
            value: genres[3][1],
            color: "#F0A534",
            highlight: "#F0A565",
            label:  genres[3][0]
        },
        {
            value: genres[4][1],
            color: "#924101",
            highlight: "#AD4D01",
            label:  genres[4][0]
        },
        {
            value: 1,
            color: "#7c7c7c",
            highlight: "#686262",
            label:  "other"
        }

    ];
}


    displayPie(pieData);
}


function displayPie(pieData){

    var ctx = document.getElementById("chart-area").getContext("2d");
    myChart = new Chart(ctx).Pie(pieData,{ animateRotate : true});

    document.getElementById("legend").innerHTML= myChart.generateLegend();
    document.getElementById("legendSmall").innerHTML= myChart.generateLegend();

    var ctx2 = document.getElementById("chart-area");
    ctx2.onclick = function(evt){
        var activePoints = myChart.getSegmentsAtEvent(evt);

        genre = activePoints[0].label;
if(genre==="other"){

    displaySecondPie();
    list2 = [];
    genresObj2 = {};
    myChart.destroy();


}else{
    getArtists(genre);
    $('#modal').prop('checked',true);
    setTimeout(
        function()
        {
            $('.modal label').show("fade");
            $('.modal input').show("fade");
        }, 400);

}
}





    }

function displaySecondPie(){

    fetchSavedartists(function(data) {
        if (data) {
            printartists2(data);
        }
    });

}

var list2 = [];
var genresObj2 = {};

function printartists2(artists){


    var i = 0;

    _.each(artists.artists.items, function(item) {
        var genres = [];


        for(var i = 0; i< item.genres.length; i++){
            genres[i] = item.genres[i];
        }
        for(var i = 0; i<genres.length; i++){
            if (genres[i]  !== undefined && genres[i] != "" && genres[i] != " ") {

                list2.push(genres[i]);

            }
        }

    });

    if (artists.artists.next) {
        callSpotify(artists.artists.next, {}, function(artists) {
            printartists2(artists);
        });
    }
    else{

        test2(list2);
    }

}

function test2(list){


    list.sort();

    var current = null;
    var count = 0;


    for(var i = 0; i< list.length; i++){
        if(list[i] != current){
            if(count>0){
                genresObj2[current] = count;


            }
            current = list[i];
            count = 1;
        }
        else{
            count ++;
        }

    }
    if(count>0){
        genresObj2[current] = count;

    }

    bereken22(genresObj2);

}

function bereken22(input){

    var keySorted = [];

    for (var genre in input){
        keySorted.push([genre, input[genre]]);
        keySorted.sort(function(a,b){return b[1]-a[1]})
    }

    for(var i = 0; i<5; i++){
        keySorted.shift();
    }




    pieValues2(keySorted);

}


function pieValues2(genres){


    var colorArray = [];
    colorArray.push("#004C73","#334F78","#8DB0BF","#9DB0BF","#B6D9A4","#B6D998","#F0A534","#F0A565");



        var pieData = [];
        var count = 0;
        for (var i=0; i<genres.length; i++){



            pieData.push({
                value: genres[i][1],
                color:colorArray[count],
                highlight: colorArray[count+1],
                label: genres[i][0]
            });

            count ++;
            count ++;
            if (count >= 7){
                count = 0;
            }

        }

    pieData.push({
        value: 1,
        color:"#7c7c7c",
        highlight: "#686262",
        label: "other"
    });






    displayPie3(pieData);
}

function displayPie3(pieData){

    var ctx = document.getElementById("chart-area").getContext("2d");
    myChart = new Chart(ctx).Pie(pieData,{ animateRotate : true});

    document.getElementById("legend").innerHTML= myChart.generateLegend();
    document.getElementById("legendSmall").innerHTML= myChart.generateLegend();


    var ctx2 = document.getElementById("chart-area");

    //$(".back").show( "fade" );

    ctx2.onclick = function(evt){
        var activePoints = myChart.getSegmentsAtEvent(evt);

        genre = activePoints[0].label;
        if(genre==="other"){

            displayFirstPie();
            list= [];
            genresObj={};
            myChart.destroy();


        }else{
            getArtists(genre);
            $('#modal').prop('checked',true);
            setTimeout(
                function()
                {
                    $('.modal label').show("fade");
                    $('.modal input').show("fade");
                }, 400);

        }
    }

}





function displayFirstPie(){

    fetchSavedartists(function(data) {
        if (data) {
            printartists(data);
        }
    });

}


var listArtists = [];
var listImage = [];
var listPop = [];
function getArtists(input){
listArtists = [];
    listImage = [];
    listPop=[];

        fetchSavedartists(function(data) {
            if (data) {
                getArtists2(data, input);
            }
        });



}


var check = "";

function getArtists2(artists, genre){


    _.each(artists.artists.items, function(item) {

        var genres = [];


        for(var i = 0; i< item.genres.length; i++){
            genres[i] = item.genres[i];
        }
        for(var i = 0; i<genres.length; i++){
            if (genres[i]  !== undefined && genres[i] != "" && genres[i] != " ") {
                if(genres[i]===genre){
                    listArtists.push(item.name);
                    listImage.push(item.images[0].url);
                    listPop.push(item.popularity);
                }



            }
        }

    });

    if (artists.artists.next) {
        callSpotify(artists.artists.next, {}, function(artists) {
            getArtists2(artists, genre);
        });
    }
    else{




        showArtists(listArtists, genre, listImage, listPop);




    }



}


function checkbox(checked){
if(checked.checked!==true){
    $('.modal label').hide();
    $('.modal input').hide();


    var titel = $("#titel");
    var content = $("#content");
    var contents= $("#modal_boks");

    titel.text("");
    contents.empty();

}
}


function showArtists(artists, genre, image, pop){
var titel = $("#titel");
    var content = $("#content");
    var contents= $("#modal_boks");



    titel.text(genre);
    for(var i = 0; i<artists.length; i++){

       contents.append("<div class='artiesten'> <figure class='inner'> <figcaption class='titles'>"+artists[i]+"</figcaption><img class='img' alt="+artists[i] +" src="+ listImage[i]+" /><figcaption><span class='spanz'>Popularity</span><hr><div class='bar'><div class='"+pop[i]+"'> <span class='span'>"+pop[i]+"%</span> </div> </div>  </figcaption></figure></div>") ;



    }



    content.text(artists);

for (var i = 0; i< artists.length; i++){
    var pops = $("."+pop[i]);
var width= pop[i]*2;


    pops.css("width",width);
    pops.css("position","absolute");
    pops.css("height","28px");
    pops.css("background-color","#73BF94");


}





}



$(document).ready(function() {









    //function() {
    var args = parseArgs();
    if ('access_token' in args) {
        $("#title").show();
        $("#go").hide();
        $("#info").hide();
        //$("body").attr('data-vide-bg','');
        $("body").removeAttr("data-vide-bg");
        $("body").removeAttr("data-vide-options");

        $("body").css('background','#EC6F66');
        $("body").css('background','-webkit-linear-gradient(to left, #EC6F66 , #F3A183)');
        $("body").css('background','linear-gradient(to left, #EC6F66 , #F3A183)');




        accessToken = args['access_token'];
        fetchSavedartists(function(data) {
            if (data) {
                printartists(data);
            } else {
                error("Trouble getting your saved artists");
            }
        });

    }else{
        $("#go").show();
        $("#go").on('click', function() {
            authorizeUser();
        });
    }
    //}
});




