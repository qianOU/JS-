import requests
import re



class Login(object):
	"""docstring for login"""
	def __init__(self, base_url,login_url):
		self.url = base_url
		self.login_url = login_url
		self.headers =  {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
		}
		self.patten = re.compile(r'_token" value="(\w+)"')
		self.session = requests.session()
		self._token = self.get_token()

	def get_token(self):
		response = self.session.get(self.url, headers=self.headers, timeout=5)
		if response.status_code == 200:
			response.encoding = response.apparent_encoding
			try:
				return self.patten.search(response.text).group(1)
			except:
				raise ValueError('没有匹配到_token')

	def post(self):
		data = {
		'_token':self._token,
		'email': '2865965645@qq.com',
		'password': '19980222'
		}
		response = self.session.post(self.login_url, headers=self.headers, data=data, timeout=5, allow_redirects=False)
		if response.status_code == 302:
			try:
				return  response.headers['Location']
			except:
				raise KeyError('重定向发生错误')



	def login(self):
		self.first_page =  self.post()
		if self.first_page:
			print('登录成功')
			self.session.get(self.first_page, headers=self.headers, timeout=5)
		else:
			print('登录失败')


	def get_test_page(self, test_url):
		response = self.session.get(test_url, headers=self.headers, timeout=5)
		if response.status_code == 200:
			response.encoding = response.apparent_encoding
			print(response.text)
			return response.text

def resolution(text):
	result = re.compile(r'class="col-md-1">.*?(\d+)',re.S).findall(text)
	result = (int(i) for i in result)
	return sum(result)

def test(url):
	base_url =  'http://glidedsky.com/level/crawler-basic-1'
	login_url = 'http://glidedsky.com/login'
	obj = Login(base_url, login_url)
	obj.login()
	text = obj.get_test_page(url)
	# process of resolve the questions
	answer = resolution(text)
	print(answer)
	return answer

test('http://glidedsky.com/level/web/crawler-basic-2?page=2')

