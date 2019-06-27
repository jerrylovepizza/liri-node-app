// node axios, Node-Spotify-API, Moment, DotEnv (external package) installed
require('dotenv').config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');
moment().format();
// node fs (built in) referred
var fs = require("fs");


//////////////////////////// Node Commands & API Query ////////////////////////////
var newAsk = process.argv[2];
var newSearch = process.argv.slice(3);
var newSearchInQuery = newSearch.join("+");
var bitUrl = "https://rest.bandsintown.com/artists/" + newSearchInQuery + "/events?app_id=codingbootcamp";
var omdbUrl = "http://www.omdbapi.com/?t=" + newSearchInQuery + "&y=&plot=short&apikey=trilogy";
// console.log("--API Query: " + bitUrl);
// console.log("--API Query: " + omdbUrl);


//////////////////////////// Function ////////////////////////////

// ============== Spotify ==============
function spotifySearch() {

    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);

    var searchSong = newSearch;
    if (newSearch.length < 1) {
        searchSong = "The Sign Ace of Base";
    }
    spotify.search({ type: 'track', query: searchSong }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("\n       " + data.tracks.items[0].artists[0].name + " - < " + data.tracks.items[0].name + " >");
        console.log("\n  ☁ ♬☁☁☁☁☁☁☁ ♯☁☁☁☁☁☁☁☁☁ MUSIC ♪ ☁☁☁ ♬☁☁☁☁☁☁☁ ♩☁☁☁☁☁☁☁☁ ");
        console.log("   ♪ Artist: " + data.tracks.items[0].artists[0].name);
        console.log("   ♪ Album Name: " + data.tracks.items[0].album.name);
        console.log("   ♪ preview-link: " + data.tracks.items[0].album.external_urls.spotify);
        console.log("  ☁☁☁☁☁ ♬☁☁☁☁☁☁☁☁ ♩☁☁☁☁☁☁☁ ♫☁☁☁☁☁☁☁☁☁ ♯☁☁☁☁☁☁☁☁☁ ♭☁☁☁☁ ");
        console.log("\n   © Liri App by Renjie Dai \n");
    });
}

// ============== BandInTown axios call ==============
function bitSearch() {
    axios.get(bitUrl).then(
        function (response) {
            console.log("\n                     " + response.data[0].lineup);
            console.log("\n  ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ ♥ Event ♥ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ ");
            console.log("   ♠  Name of the Venue: " + response.data[0].venue.name);
            console.log("   ♣  Venue  location  : " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("   ♦  Date of the Event: " + moment(response.data[0].datetime).format('L') + " (MM/DD/YYYY)");
            console.log("  ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡ ");
            console.log("\n   © Liri App by Renjie Dai \n");
        }
    );
}
// ============== OMDB axios call ==============
function omdbSearch() {
    axios.get(omdbUrl).then(
        function (response) {
            console.log("\n                       " + response.data.Title + "  (" + response.data.Year + ")");
            console.log("\n  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ◂ 𝕄 𝕆 𝕍 𝕀 𝔼 ▸ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ");
            console.log("   ◂▸  IMDB Rating: " + response.data.imdbRating);
            console.log("   ◂▸  Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("   ◂▸  Country: " + response.data.Country);
            console.log("   ◂▸  Language: " + response.data.Language);
            console.log("   ◂▸  Actors: " + response.data.Actors);
            console.log("   ◂▸  Plot: " + response.data.Plot);
            console.log("  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ");
            console.log("\n   © Liri App by Renjie Dai \n");
        }
    );
}

//////////////////////////// Call Function ////////////////////////////
if (newAsk === "spotify-this-song") {
    spotifySearch();
}
else if (newAsk === "concert-this") {
    bitSearch();
}
else if (newAsk === "movie-this" && newSearch.length > 0) {
    omdbSearch();
}
else if (newAsk === "movie-this" && !newSearch.length > 0) {
    omdbUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
    omdbSearch();
}
else if (newAsk === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { return console.log(error); }
        console.log(data);
        var dataArr = data.split('"');
        newAsk = dataArr[0];
        newSearch = dataArr[1];
        spotifySearch();
    });
}

//////////////////////////// Log Bonus ////////////////////////////
var searchTxt = newSearch;
if (newSearch.length < 1) {
    searchTxt = "None"
}
var addText = ' • Command: "' + newAsk + '"  Search: "' + searchTxt + '"  (' + moment().format('lll') + ')' + '\r\n';
fs.appendFile("log.txt", addText, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('"✎ log has updated!"');
    }
});