var fs = require('fs')

var GPlayConverter = require('./GooglePlayConverter')

var file = fs.readFileSync('/Users/tshah/Documents/Else/t27/kindlehigh/Play Books Notes/Notes from _Become An Idea Machine_ Because Ideas Are The Currency Of The 21st Century_.html')

var play = new GPlayConverter(file)

console.log(play.getJSON())

