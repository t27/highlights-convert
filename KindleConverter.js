const cheerio = require("cheerio");

/**
 * Convert email HTML into JSON
 * @param {String} html
 * @returns {Object}
 */
const Converter = function (html) {
    this.html = html;
    this.$ = cheerio.load(this.html);
};

/**
 * Determine whether the given HTML is a valid Kindle notes export
 * @returns {Boolean}
 */
Converter.prototype.valid = function () {
    if (this.html) {
        const notes = this.$(".noteText");
        return notes.length > 0;
    }

    return false;
};

/**
 * Parse the HTML to pull out the volume's title, author, and highlights
 * @returns {Object}
 */
Converter.prototype.getJSON = function () {
    const titleEl = this.$(".bookTitle");
    const authorEl = this.$(".authors");
    const title = titleEl.text().trim();
    const authors = authorEl
        .text()
        .split(";")
        .map(s => s.trim());

    return {
        volume: {
            title: title,
            authors: authors
        },
        highlights: this.highlights()
    };
};

/**
 * Gets the Section heading for the given node, if available
 * @param {Node} elem 
 * @returns {String} Section/Chapter Heading
 */
Converter.prototype.getHeading = function (elem) {
    while (elem.prev != null && !(elem.prev.attribs && elem.prev.attribs.class && elem.prev.attribs.class === "sectionHeading")) {
        elem = elem.prev
    }
    if (elem.prev == null) {
        return ""
    }
    elem = elem.prev
    var v = elem.children[0].data.trim()
    return v
}

/**
 * Parse the highlights and notes from the HTML
 * @returns {Array} highlights
 */
Converter.prototype.highlights = function () {
    const headings = this.$(".noteHeading");
    let highlights = [];

    headings.each((index, el) => {
        const heading = cheerio(el);
        const color = heading
            .find("span[class^='highlight_']")
            .text()
            .trim();
        const text = heading.text().trim();
        const section = this.getHeading(el)
        // Check if there is a "Location #" in the line (used to store the location of the object)
        var location = text.match(/location\s(\d*)/i);
        // If location is not found, try "Page"
        if (!location) {
            location = text.match(/>\sPage\s(\d *)/i);
        }

        if (location) {
            if (text.match(/^Note -/i)) {
                // We're making the assumption that notes are only added on top of
                // a highlight. When that's the case, the exported file will include
                // the note directly after the text it's added on.
                if (highlights.length) {
                    const highlight = highlights[highlights.length - 1];
                    highlight.notes = this.highlightContent(location[1], color, el, section);
                }
            } else {
                highlights = highlights.concat(
                    this.highlightContent(location[1], color, el, section)
                );
            }
        }
    });

    return highlights;
};

/**
 * Find the next note text after the given element
 * @param  {String} location - The highlight location
 * @param  {String} color
 * @param  {Node} el
 * @param  {String} section - section heading
 * @return {Array} The parsed highlight objects
 */
Converter.prototype.highlightContent = function (location, color, el, section) {
    let highlights = [];
    const nextEl = cheerio(el).next();

    if (nextEl.hasClass("noteText")) {
        const highlight = {
            color: color,
            content: cheerio(nextEl)
                .text()
                .trim(),
            location: location,
            chapter: section
        };

        highlights.push(highlight);

        if (nextEl.next().hasClass("noteText"))
            highlights = highlights.concat(
                this.highlightContent(location, color, nextEl)
            );
    }

    return highlights;
};

module.exports = Converter;
