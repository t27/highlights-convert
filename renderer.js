const fs = require("fs")
const Mustache = require("mustache")

let f = JSON.parse(fs.readFileSync("/Users/tshah/Documents/Else/t27/kindlehigh/results/How Will You Measure Your Life?.json").toString())
console.log(f.volume)

let template = "Title: {{title}} \nAuthor: \
{{#authors}} \
{{.}}; \
{{/authors}}"

function getBookTitleTemplate(bookVolume) {
    let title = `Title: ${bookVolume.title}`
    let authors = ''
    if(bookVolume.authors.length>1) {
        authors = "Author: "
    } else {
        authors = "Authors: "
    }
    bookVolume.authors.forEach(author => {
        authors += `${author};`
    });
    return title+"\n"+authors

}



let res = Mustache.render(template,f.volume)

console.log(res)