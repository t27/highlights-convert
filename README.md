# highlights-convert

I maintain this project to convert my Kindle highlights to a webpage, and a few intermediate dataformats(that are easier to parse in code).

The raw formate(Kindle HTML export format) to a JSON and a HTML webpage, which is further exported to a Jekyll website which can be found here http://tarangshah.com/books.

I also had a few old books I read on Google Play Books that exported highlights in MS Word format. There is a parser for that as well.

## Content of the project

1. Conversion scripts for Google Play Books(Exported to Drive) and Kindle Email export(HTML)
    - `index.js` has the main code
    - The main classes for parsing are in `KindleConvert.js` and `GooglePlayConverter.js`
    - `renderer.js` and `postProcessJson.js` are used for the final document generation tasks
2.  <details>
    <summary>Raw and intermediate highlight files</summary>
        {these were essentially text files and quite small in size, github seemed like the perfect place to store these files. You can find them in the "Raw" and "Results" folders}
    </details>

## Google Play Books highlights/notes conversion

1. Sync all your highlights to Google Drive, google ensures that your highlights are synced in the docx format
2. Use Pandoc to convert the docx to html
    `pandoc -f docx -t html -o file.html file.docx`
3. Then use the GooglePlayConverter class to convert to json


## Kindle Highlights/Notes conversion

1. Using the Kindle Android or iOS apps, for each book, export your notes to an email. The kindle app attaches an html file of your highlights
2. Use this html file and the KindleConverter module to convert the highlights to json

Special thanks to @sawyerh for the kindle-email-to-json package, from which the Kindle Converter was derived. I added location, page number and other small parsing updates, mainly for notes etc.

# Instructions

1. Copy the Raw files in the `raw` directory
2. Run `./run.sh`
3. Once you have the jekyll data(bunch of `.md` files in results/jekyllCollection) copy them to the jekyll website(https://github.com/t27/books/ in the `_highlights` folder)
4. the updated highlights should now be available at tarangshah.com/books