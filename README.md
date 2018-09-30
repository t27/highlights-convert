# highlights-convert

Conversion scripts for Google Play Books(Exported to Drive) and Kindle Email export(HTML)

## Google Play Books highlights/notes conversion

1. Sync all your highlights to Google Drive, google ensures that your highlights are synced in the docx format
2. Use Pandoc to convert the docx to html
    `pandoc -f docx -t html -o file.html file.docx`
3. Then use the GooglePlayConverter class to convert to json


## Kindle Highlights/Notes conversion

1. Using the Android or iOS apps, export your notes to an email. The kindle app attaches a html file of your highlights
2. Use this html file and the KindleConverter module to convert the highlights to json

Special thanks to @sawyerh for the kindle-email-to-json package, from which the Kindle Converter was derived
