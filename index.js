
file = "tsaongaf.html"

var fs = require("fs")
const Converter = require("./KindleConverter");

const kfile = fs.readFileSync(file)

const converter = new Converter(kfile);

if (converter.valid) {
    console.log(converter.getJSON());
} else {
    console.log("Invalid content. Expected an HTML attachment with Kindle notes.");
}

var GPlayConverter = require('./GooglePlayConverter')

var file = fs.readFileSync('/Users/tshah/Documents/Else/t27/kindlehigh/Play Books Notes/Notes from _Become An Idea Machine_ Because Ideas Are The Currency Of The 21st Century_.html')

var play = new GPlayConverter(file)

if(play.valid) {
    console.log(play.getJSON())
} else {
    console.log("Invalid content. Expected an HTML attachment with Kindle notes.");
}
