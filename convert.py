import json

with open('./netflix.json') as f:
    data = json.load(f)



for key in data:
    add_str = { "index" : { "_id": key} }

    with open('elastic_netflix.json', 'a') as json_file:
        json.dump(add_str, json_file)
        json_file.write("\n")
        json.dump(data[key], json_file)
        json_file.write("\n")
