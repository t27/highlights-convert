
var fs = require('fs')


let f = JSON.parse(fs.readFileSync("/Users/tshah/Documents/Else/t27/kindlehigh/results/chapterSplits/The Rosie Project: A Novel.json").toString())


function chapterWiseSplitJson(bookdata) {
    let result = {}
    result.volume = bookdata.volume
    let highlights = bookdata.highlights
    chapterHighlights = {}
    currentChapter = "None"
    currentChapterIndex = 0
    highlights.forEach(element => {
        if(element.chapter){
            if(element.chapter != currentChapter) {
                currentChapter = element.chapter
                currentChapterIndex +=1
            }
            if (chapterHighlights[currentChapter] == undefined) {
                chapterHighlights[currentChapter] = {
                    "index":0,
                    "highlights": []
                }
            }
            chapterHighlights[currentChapter].index = currentChapterIndex
            chapterHighlights[currentChapter].highlights.push(element)
        }
    });

    result.chapterHighlights = chapterHighlights
    return result
}

function createJekyllCollectionFiles(bookdata) {
    let title = bookdata.volume.title
    let authors = bookdata.volume.authors.join(", ")
    let mdContent = ""
    let chapterTitles = Object.keys(bookdata.chapterHighlights)
    // Add markdown highlight, with location and color(custom html embedded in md)
    // Add Notes beneath theh highlights, probably as code blocks
    chapterTitles.forEach(chapterTitle => {
        mdContent+= `\n## ${chapterTitle}`
        let highlights = bookdata.chapterHighlights[chapterTitle].highlights
        highlights.forEach(highlight => {
            mdContent += `\n\n > ${highlight.content}\n`
            if(highlight.notes) {
                let notes = highlight.notes
                if(typeof notes === "string") {
                    mdContent += `\n\nNotes:\`${notes}\`\n`
                } else {
                    mdContent+= "\nNotes:"
                    notes.forEach(element => {
                        mdContent +=`\n\n\`${element.content}\`\n`
                    });
                }
            }
            mdContent += `\n| Location: ${highlight.location} |`
            if(highlight.color) {
                mdContent += ` \n Color: ${highlight.color} |`
            }
            if(highlight.date) {
                mdContent += ` \n Date: ${highlight.date} |`
            }

            mdContent+="\n<br>"
        });
        mdContent += "\n\n----------\n<br><br>\n"
    });
    let jekyllFile = `---\nlayout: highlight\ntitle: \"${title}\"\nauthors: \"${authors}\"\n---\n\n${mdContent}`
    // console.log(jekyllFile)
    return jekyllFile
}
exports.chapterWiseSplitJson = chapterWiseSplitJson
exports.createJekyllCollectionFiles = createJekyllCollectionFiles