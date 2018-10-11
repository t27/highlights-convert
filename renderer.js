const fs = require("fs")
const Mustache = require("mustache")

let f = JSON.parse(fs.readFileSync("/Users/tshah/Documents/Else/t27/kindlehigh/results/How Will You Measure Your Life?.json").toString())
console.log(f.volume)

let template = "Title: {{title}} \nAuthor: \
{{#authors}} \
{{.}}; \
{{/authors}}"




let res = Mustache.render(template,f.volume)

console.log(res)