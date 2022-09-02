
from numpy import load
import json
import codecs
# load array
data = load('age.npy')
# print the array

print(data)
lists = data.tolist()
json_str = json.dumps(lists)
json_file = "file.json" 
json.dump(lists, codecs.open(json_file, 'w', encoding='utf-8'), sort_keys=True, indent=4)