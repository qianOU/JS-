import re
def encrypt(first_file:'混淆文件', encrypt:'解密文件', array_name : '数组名字'， array: '数组内容') -> '完成':
	string = open(first_file, 'r', encoding='utf8').read()
	# array_name = ''

	# array = 'array'

	index =  0
	patten = re.compile(r'%s\[(?P<f>\d+)\]' %array_name)
	while True:
		mat = patten.search(string, index)
		if not mat:
			break
		string = re.sub(patten, array[mat.group(1)],re.S)
		index = mat.end(0)

	with open('解密后的文件.js','w+',encoding='utf8') as f:
		f.write(string)


