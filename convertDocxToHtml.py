
import glob
import os
docxFiles = glob.glob("./raw/Play Books Notes/*.docx")

for f in docxFiles:
    name,ext = os.path.splitext(f)
    cmd = f'pandoc -f docx -t html5 -o "{name}.html" "{name}.docx"'
    r = os.system(cmd)
    print(r)
