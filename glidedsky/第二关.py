import requests
import re
import threading,queue,math,numpy


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
            return response.text

def resolution(text):
    result = re.compile(r'class="col-md-1">.*?(\d+)',re.S).findall(text)
    result = (int(i) for i in result)
    t = sum(result)
    print(t)
    return t



def solution2(obj, start, end):
  result = 0
  for page in range(math.ceil(start),math.floor(end+1)):
      url = 'http://glidedsky.com/level/web/crawler-basic-2?page=' + str(page)
      text = obj.get_test_page(url)
      result += resolution(text)
  a.put(result)
##        a.put(0)
##        print(math.ceil(start),math.floor(end+1))

if __name__ == "__main__":
    base_url =  'http://glidedsky.com/level/crawler-basic-1'
    login_url = 'http://glidedsky.com/login'
    obj = Login(base_url, login_url)
    obj.login()
    url  = 'http://glidedsky.com/level/web/crawler-basic-2'
    text = obj.get_test_page(url)
    a = queue.Queue()
    a.put(resolution(text))
    # a = queue.Queue()
    b = numpy.array(range(2,1001))
    quants = numpy.quantile(b,[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])
    print(quants)
    for start in range(10):
##            solution2(obj, quants[start],quants[start+1])
      fun = threading.Thread(target=solution2, args=(obj, quants[start],quants[start+1]))
      fun.start()
    fun.join()
    result = 0
    while True:
        print('输出活跃的线程数',threading.active_count()) 
        if a.qsize() == 11:
            while not a.empty():
                result += a.get()
                print('result=',result)
            break
    print('最终结果是',result)


    2871855
