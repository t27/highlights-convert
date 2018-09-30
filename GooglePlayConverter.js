const cheerio = require("cheerio");

/**
 * To convert the google play books docx file(stored in your google drive) to html5, use pandoc
 * pandoc -f docx -t html -o file.html file.docx
 */

 
/**
 * Convert google play books HTML into JSON
 * @param {String} html
 * @returns {Object}
 */
const Converter = function (html) {
    this.html = html;
    this.$ = cheerio.load(this.html);
};

/**
 * Determine whether the given HTML is a valid notes export
 * @returns {Boolean}
 */
Converter.prototype.valid = function () {
    if (this.html) {
        const notes = this.$(".noteshighlights");
        return notes.length > 0;
    }
    return false;
};

/**
 * Parse the HTML to pull out the volume's title, author, and highlights
 * @returns {Object}
 */
Converter.prototype.getJSON = function () {
    const title = this.$('h1').contents().first().text().trim();
    const authors = this.$('p').contents().first().text().trim();

    return {
        volume: {
            title: title.split("\n").map(item => item.trim()).join(' '),
            authors: authors
        },
        highlights: this.highlights()
    };
};

/**
 * Parse the highlights and notes from the HTML
 * @returns {Array} highlights
 */
Converter.prototype.highlights = function () {
    hlelems = this.$('tr.odd > td > table')

    var parentElems = this.$('body > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)')
    var location = this.$('body > table > tbody > tr > td > table > tbody > tr > td:nth-child(3)')
    var highlights = []
    for (var i = 0; i < parentElems.length; i++) {
        var elem = parentElems[i]
        var locn = this.getChildData(location[i])
        // console.log(elem.children.length)
        var children = this.cleanChildren(elem.children)
        children.push(locn)
        highlights.push(children)
        // console.log(children)
    }
    // console.log(highlights)
    var finalResult = []
    for (var i = 0; i < highlights.length; i++) {
        var highlightJSON = {}
        var length = highlights[i].length
        var content = highlights[i][0][0].split("\n").map(item => item.trim()).join(' ')
        highlightJSON["content"] = content;
        highlightJSON["date"] = highlights[i][length - 2][0]
        highlightJSON["location"] = highlights[i][length - 1][0]
        if (highlights[i][length - 1][1].length > 0) {
            highlightJSON["locationlink"] = highlights[i][length - 1][1]
        }
        if (length > 3) {
            highlightJSON["notes"] = highlights[i][length - 3][0]
        }
        finalResult.push(highlightJSON)
    }
    return finalResult;
};

Converter.prototype.getChildData = function (elem, extraData) {
    var link = extraData || ''
    if (elem.name == 'a') { // if its a link
        link = elem.attribs.href
    }
    if (elem.nodeType != 3) {
        return this.getChildData(elem.children[0], link)
    } else {
        return [elem.data, extraData]
    }
}

Converter.prototype.cleanChildren = function(children) {
    var cleaned = []
    children.forEach(element => {
        var data = this.getChildData(element)
        if (data[0].trim().length > 0) {
            cleaned.push(data)
        }
    });
    return cleaned;
}


module.exports = Converter;
