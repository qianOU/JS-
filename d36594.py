import requests
import re
import execjs

first_page = 'https://d36594.com/#'
login_url = 'https://d36594.com/login'
home = 'https://d36594.com/home'
rmb = 'https://d36594.com/member/home?json=1'

session = requests.session()
headers = {
	'accept-encoding': 'gzip, deflate, br',
	'accept-language': 'zh-CN,zh;q=0.9',
	'upgrade-insecure-requests': '1',
	'cache-control': 'no-cache',
	'pragma': 'no-cache',
	'referer': 'https://d36594.com/',
	'sec-fetch-mode': 'navigate',
	'sec-fetch-site': 'none',
	'sec-fetch-user': '?1',
	'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
}

TOKEN='eyJpdiI6IkpJUE0wdjNyRHBNbDFJXC9SQmdDNTJ3PT0iLCJ2YWx1ZSI6IkRkTlFLYitSQm1MQ2lnMU5RcnFNNGpuWE5IOHY1TlF1RTg3dVREdXk5MkRtQXhZNUVPRW90cUliWGFTd2JEdDYyK0xvXC9SZzdjUGFOaHlRZEV6R1BrQT09IiwibWFjIjoiMjRiYThhMmFjZDE3N2ZjNmM1NDg2M2I5MmRmOTBkNGI3MjY3Yjk4OWJkOWFiZGJmNWEwZTM0OTI4MGM1NzM1MiJ9; vanguard_session=eyJpdiI6Ik95dnZ5ZjZvaWhWNnNaU2NtOUUwaVE9PSIsInZhbHVlIjoiS3JyQkVFRnphNTVVOTdvNGhyNDhYRkR2M2JPZ2lzMVdyclZkWGtJeUZNeW1RMHYxcVlINVwvSVwvakd0UjFcL1oxaUM1TTV2QndISHNUWE81bFFMNGYrU1E9PSIsIm1hYyI6IjBiMmQ5MGJhYTZhOWY1NWZlZDEwOTE5NWVkNTQ0ZDg4MmYxYjEzYTAwYjQ2ODFhYzI3MzYxMjUxNTVmMTVmOTYifQ%3D%3D'.replace('%3D','=')
cookies = {'cookie':'visid_incap_1773749=OZ+K0kSyQCSgGMlCJTELBmclcl0AAAAAQUIPAAAAAABQRRh01R5hU9PQSMXgKt7e; Hm_lvt_488ded3ebeb1bab8cca3cc77674816d2=1567761870; incap_ses_462_1773749=5YU8Z1jiGzwdmpspi1tpBoU8cl0AAAAAkbj5cyoLSGwQqf4nZMv3lA==; boscookietest=4363280; Hm_lpvt_488ded3ebeb1bab8cca3cc77674816d2=1567768294; XSRF-TOKEN=eyJpdiI6IkpJUE0wdjNyRHBNbDFJXC9SQmdDNTJ3PT0iLCJ2YWx1ZSI6IkRkTlFLYitSQm1MQ2lnMU5RcnFNNGpuWE5IOHY1TlF1RTg3dVREdXk5MkRtQXhZNUVPRW90cUliWGFTd2JEdDYyK0xvXC9SZzdjUGFOaHlRZEV6R1BrQT09IiwibWFjIjoiMjRiYThhMmFjZDE3N2ZjNmM1NDg2M2I5MmRmOTBkNGI3MjY3Yjk4OWJkOWFiZGJmNWEwZTM0OTI4MGM1NzM1MiJ9; vanguard_session=eyJpdiI6Ik95dnZ5ZjZvaWhWNnNaU2NtOUUwaVE9PSIsInZhbHVlIjoiS3JyQkVFRnphNTVVOTdvNGhyNDhYRkR2M2JPZ2lzMVdyclZkWGtJeUZNeW1RMHYxcVlINVwvSVwvakd0UjFcL1oxaUM1TTV2QndISHNUWE81bFFMNGYrU1E9PSIsIm1hYyI6IjBiMmQ5MGJhYTZhOWY1NWZlZDEwOTE5NWVkNTQ0ZDg4MmYxYjEzYTAwYjQ2ODFhYzI3MzYxMjUxNTVmMTVmOTYifQ%3D%3D'}
response = session.get(first_page,cookies=cookies,headers=headers,timeout=5)

if response.status_code == 200:
	# print(response.text)
	str1 = re.compile(r"token_get[\s]=[\s]'(.*?)'",re.S)
	_token = re.search(str1, response.text).group(1)
	str2 = re.compile(r" publickey[\s]=[\s]'(.*?)'",re.S)
	publickey = re.search(str2, response.text).group(1)
	str3 = re.compile(r'/gdcode_([\d]+)',re.S)
	try:
		gdcode = re.search(str3, response.text).group(0)
	except:
		gdcode = None

if gdcode:
	gdcodeurl = 'https://d36594.com' + gdcode

print('_token已经获取值为 ',_token)
print('publickey已经获取值为 ',publickey)

text = open('w.js','r',encoding='utf8').read()
obj = execjs.compile(text)

cookies = {
	'cookies':'XSRF-TOKEN=eyJpdiI6Im9CaEp4Y0t5Y2hDXC92am9xQ1FtK1RnPT0iLCJ2YWx1ZSI6IkxjcjM3b1ZcL0xsQjVST1ZQbERQQmFPc1IwNFJuNjRyVVhXdTFcL0JVN0g2aVBDanBkQnV2TmZKXC9WM0QwdnVZQmpKV0pUYXJVMXUyMEpMYjhHK0RXa3JnPT0iLCJtYWMiOiJkMGUxOGYyMGU5YTgyZTJhY2QyNTZhYzQ5NTlmNGZiODI1NzI4YTY4MTc1YWI1MTY5ODc0ZDM1YzBhMjg5ZDFiIn0%3D; vanguard_session=eyJpdiI6ImVQSzNsMWsxeUltQVNOY0dnYTY0WXc9PSIsInZhbHVlIjoiaWVsWTZFcDFjMlwvK2VVcDZRbzdYM0duNXVwbFpjSHdBZnN0ZW1qYVNpdWJnZnRoK2gwcFFlNlRjNWE3NlUyaVBmSTd2eU9nUkVDTzNaXC95WW1mbFlUZz09IiwibWFjIjoiNDZhMzZhNGU2MDE1OTc2NmY2M2MwMzE3YWI2ZDhjZTcyMGY4ODhmMDA4Y2VjNjU3OTVmNGY5MDY1YTFiOWVlMCJ9; boscookietest=7311340',
}


headers = {
'Accept': '*/*',
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Origin': 'https://d36594.com',
'Referer': 'https://d36594.com/',
'Sec-Fetch-Mode': 'cors',
'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
'X-Requested-With': 'XMLHttpRequest',
}

def login(username, password,):
	data = {
	'_token':_token,
	'fr_username' : obj.call('getencrypt',username,publickey),
	'fr_password' : obj.call('getencrypt',password,publickey),
	'encrypt' : '1',
	'rememberMe':'',
	'isApp': 0,
	'json':1,
	}
	response= session.post(login_url,headers=headers, data=data,timeout=5)
	if 'fail' in response.text and '1' in response.text:
		flag = 1
		print('需要输入验证码')
		return False
		# headers = {
		# 	'cache-control': 'no-cache',
		# 	'accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
		# 	'accept-encoding': 'gzip, deflate, br',
		# 	'accept-language': 'zh-CN,zh;q=0.9',
		# 	'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
		# 	'pragma': 'no-cache',
		# 	'referer': 'https://d36594.com/',
		# 	'sec-fetch-mode': 'cors',
		# 	'sec-fetch-site': 'same-origin',
		# 	'x-requested-with': 'XMLHttpRequest',
		# 	}
		# response = session.get(gdcodeurl, headers=headers,timeout=5)
		# if response.status_code == 200:
		# 	with open('code.png','wb') as f:
		# 		f.write(response.text)
		# 	code = input('请输入验证码: ')
		# 	data['fr_gdcode'] = code
		pass

	return True

def Home():
	headers = {
	'x-xsrf-token':TOKEN,
	'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
	'pragma': 'no-cache',
	'referer': 'https://d36594.com/',
	'sec-fetch-mode': 'cors',
	'sec-fetch-site': 'same-origin',
	'accept': 'application/json, text/plain, */*',
	'accept-encoding': 'gzip, deflate, br',
	'accept-language': 'zh-CN,zh;q=0.9',
	'cache-control': 'no-cache',
	}
	response = session.get(home,headers=headers, timeout=5)
	if '我的最爱' in response.text:
		print('登录成功')
	else:
		print('登录失败')


def getrmb():
	headers = {
		'cache-control': 'no-cache',
		'accept': '*/*',
		'accept-encoding': 'gzip, deflate, br',
		'accept-language': 'zh-CN,zh;q=0.9',
		'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
		'pragma': 'no-cache',
		'referer': 'https://d36594.com/',
		'sec-fetch-mode': 'cors',
		'sec-fetch-site': 'same-origin',
		'x-requested-with': 'XMLHttpRequest',
		}
	# response = session.get('https://d36594.com/home?json=1',headers=headers,timeout=5)

	# url = 'https://d36594.com/apis/msgcount'
	# response = session.get(url,headers=headers,timeout=5)

	response = session.get(rmb, headers=headers,timeout=5)
	if response.status_code == 200:
		try:
			target = re.search(r'"wallet":"(.*?)"', response.text).group(1)
			print('余额为 %s 元' %target)
		except:
			print('未获取到余额信息')
	else:
		print('未获取到余额信息')


def main():
	if login('13262523878','11111111'):
		Home()
		getrmb()

main()

