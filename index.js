const fs = require("fs")
const path = require('path');
const slugify = require('@sindresorhus/slugify');
const KindleConverter = require("./KindleConverter");
const GPlayConverter = require('./GooglePlayConverter')
const postProcessJson = require('./postProcessJson')
const glob = require('glob')
KindleNotes = "./raw/KindleHighlights/*.html"
PlayBooksNotes = "./raw/Play Books Notes/*.html"
ResultDir = "./results/"

function convertAllKindleFiles() {
    glob(KindleNotes, function (er, files) {
        if (er) {
            console.log("Error during Kindle file conversion")
            console.log(er);
            return;
        } else {
            files.forEach(element => {
                let f = fs.readFileSync(element)
                const kindleConverter = new KindleConverter(f)
                if (!saveJson(kindleConverter)) {
                    console.log("No notes found for ", element);
                }
            });
        }
    })
}

function convertAllPlayBooksFiles() {
    glob(PlayBooksNotes, function (er, files) {
        if (er) {
            console.log("Error during PlayBooks file conversion")
            console.log(er);
            return;
        } else {
            files.forEach(element => {
                let f = fs.readFileSync(element)
                const playConverter = new GPlayConverter(f)
                if (!saveJson(playConverter, element)) {
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
        fs.writeFileSync(ResultDir + res.volume.title + ".json", JSON.stringify(res, null, 2))
        return true
    } else {
        return false
    }
}

function chapterWiseIndexing() {
    glob(ResultDir + "*.json", function (er, files) {
        if (er) {
            console.log("Error during chapterIndexing")
            console.log(er)
            return
        }
        files.forEach(rawJsonFile => {
            let rawJson = JSON.parse(fs.readFileSync(rawJsonFile).toString())
            let chapterJson = postProcessJson.chapterWiseSplitJson(rawJson)
            let targetDir = ResultDir + "chapterSplits/"
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }
            filename = rawJsonFile.substring(rawJsonFile.lastIndexOf('/') + 1)
            fs.writeFileSync(targetDir + filename, JSON.stringify(chapterJson, null, 2))

        });
    })
}

function createJekyllData() {
    glob(ResultDir + "chapterSplits/*.json", function (er, files) {
        if (er) {
            console.log("Error during chapterIndexing")
            console.log(er)
            return
        }
        files.forEach(rawJsonFile => {
            let rawJson = JSON.parse(fs.readFileSync(rawJsonFile).toString())
            let jekyllFile = postProcessJson.createJekyllCollectionFiles(rawJson)
            let targetDir = ResultDir + "jekyllCollection/"
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir);
            }
            filename = rawJsonFile.substring(rawJsonFile.lastIndexOf('/') + 1)
            filename = slugify(filename.split('.').slice(0, -1).join())
            fs.writeFileSync(targetDir + filename + ".md", jekyllFile)
        });
    })
}

// Step 1
// convertAllPlayBooksFiles()
// convertAllKindleFiles()

// Step 2
// chapterWiseIndexing()

// Step3 
createJekyllData()

// NOTE: Currently the steps need to be executed in separate calls to index.json due to async ops

//Test
// testSingleKindleFile()

/** Test Functions */

function testSingleKindleFile() {
    file = "/Users/tshah/Documents/Else/t27/kindlehigh/raw/KindleHighlights/Seven Brief Lessons on Physics - Notebook.html"
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