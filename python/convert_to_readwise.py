import pandas as pd
import json
import glob
columns = ["Highlight","Title","Author","URL","Note","Location"]

# for sample of the input json look at any json in the root of the `results` folder

def convert_to_readwise_df(json_files):
    """Convert the internal json format to a readwise compatible dataframe

    Args:
        json_files (List[str]): list of json files

    Returns:
        pd.DataFrame: dataframe with columns as required by readwise
    """
    df_data = []
    for file in json_files:
        with open(file) as f:
            data = json.load(f)
            title = data['volume']['title']
            author = ", ".join(data['volume']['authors'])
            for entry in data['highlights']:
                highlight = entry['content']
                location = entry['location']
                notes = ""
                if "notes" in entry:
                    for note in notes:
                        notes = notes+"\n"+note
                df_data.append([highlight,title,author,"",notes,location])
    df = pd.DataFrame(df_data,columns = columns)
    return df

if __name__ == "__main__":
    json_files = glob.glob("../results/*.json")
    df = convert_to_readwise_df(json_files)
    df.to_csv("tarang_readwise.csv",index=False)

