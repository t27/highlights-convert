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
        // console.log(res.volume.title);
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

if (process.argv.length < 3) {
    console.log("Need an argument after index.js, for example \"index.js 1\"")
}
if (process.argv.length > 3) {
    console.log("You're not running this command using run.sh[cant have more than 1 arg]")
}


step = parseInt(process.argv[2])

if (step == 1) {
    // Step 1
    convertAllPlayBooksFiles()
    convertAllKindleFiles()
} else if (step == 2) {
    // Step 2
    chapterWiseIndexing()
} else if (step == 3) {
    // Step3 
    createJekyllData()
} else {
    console.log("only 1,2,3 are valid argument")
}



// NOTE: Currently the steps need to be executed in separate calls to index.json due to async ops

//Test
// testSingleKindleFile()

/** Test Functions */

function testSingleKindleFile() {
    file = "/home/tarang/Code/highlights-convert/raw/KindleHighlights/Sapiens A Brief History of Humankind - Notebook.html"
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