
const fs = require("fs")
const path = require('path');
const KindleConverter = require("./KindleConverter");
const GPlayConverter = require('./GooglePlayConverter')
const glob = require('glob')
KindleNotes = "./raw/KindleHighlightsExports/*.html"
PlayBooksNotes = "./raw/Play Books Notes/*.html"

function convertAllKindleFiles() {
    glob(KindleNotes, function (er, files) {
        if (er) {
            console.log(er);
            return;
        } else {
            files.forEach(element => {
                let f = fs.readFileSync(element)
                const kindleConverter = new KindleConverter(f)
                if(!saveJson(kindleConverter)) {
                    console.log("No notes found for ", element);
                }
            });
        }
    })
}

function convertAllPlayBooksFiles () {
    glob(PlayBooksNotes, function (er, files) {
        if (er) {
            console.log(er);
            return;
        } else {
            files.forEach(element => {
                let f = fs.readFileSync(element)
                const playConverter = new GPlayConverter(f)
                if(!saveJson(playConverter, element)){
                    console.log("No notes found for ", element);
                }
            });
        }
    })
}

function saveJson(converter) {
    if (converter.valid) {
        let res = converter.getJSON()
        console.log(res.volume.title);
        fs.writeFileSync("results/" + res.volume.title + ".json", JSON.stringify(res, null, 2))
        return true
    } else {
        return false
    }
}
convertAllPlayBooksFiles()
convertAllKindleFiles()
/** Test Functions */

function testSingleKindleFile() {
    file = "/Users/tshah/Documents/Else/t27/kindlehigh/raw/KindleHighlights/tsaongaf.html"
    const kfile = fs.readFileSync(file)
    const kindleConverter = new KindleConverter(kfile);

    if (kindleConverter.valid) {
        let v = kindleConverter.getJSON()
        console.log(v.volume.title);
        fs.writeFileSync("test.json", JSON.stringify(v, null, 2))
    } else {
        console.log("Invalid content. Expected an HTML file with Kindle notes.");
    }
}


function testSinglePlayFile() {
    var gfile = fs.readFileSync('/Users/tshah/Documents/Else/t27/kindlehigh/raw/Play Books Notes/Notes from _Shoe Dog_.html')
    var playConverter = new GPlayConverter(gfile)
    if (playConverter.valid) {
        var v = playConverter.getJSON()
        console.log(v.volume.title)
        fs.writeFileSync("test2.json", JSON.stringify(v, null, 2))
    } else {
        console.log("Invalid content. Expected an HTML with Google Play Books highlights.");
    }
}
