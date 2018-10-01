
var fs = require("fs")
var KindleConverter = require("./KindleConverter");
var GPlayConverter = require('./GooglePlayConverter')


file = "/Users/tshah/Documents/Else/t27/kindlehigh/raw/KindleHighlights/tsaongaf.html"
var kfile = fs.readFileSync(file)
var kindleConverter = new KindleConverter(kfile);
if (kindleConverter.valid) {
    console.log(kindleConverter.getJSON());
} else {
    console.log("Invalid content. Expected an HTML file with Kindle notes.");
}

var gfile = fs.readFileSync('/Users/tshah/Documents/Else/t27/kindlehigh/raw/Play Books Notes/Notes from _Shoe Dog_.html')
var playConverter = new GPlayConverter(gfile)
if(playConverter.valid) {
    console.log(playConverter.getJSON())
} else {
    console.log("Invalid content. Expected an HTML with Google Play Books highlights.");
}
