import json
import os
from pathlib import Path
import re
p = Path('.')
dirs=[x for x in p.iterdir() if x.is_dir()]
kandk={}
for i in dirs:
	os.chdir(str(i))
	dirs2=[x for x in p.iterdir() if x.is_dir()]
	layers={}
	for j in dirs2:	
		
		sliceArray=[]
		os.chdir(str(j))
		files=[x for x in p.iterdir() if x.is_file()]
		for k in files:
			if not str(k).startswith("."):
				f = open(str(k))
				contents=f.read()
				#print k,contents
				m = re.search('coords="([^"]*)',str(contents))
				if m:
					region =m.group(1).split(",")
					region =[int(ii.strip())/1.54296875 for ii in region]
					sliceArray.append(region)
		layers[str(j)]=sliceArray
		os.chdir("..")	
	kandk[str(i)]=layers
	#print str(i)	
	os.chdir("..")
print json.dumps(kandk)