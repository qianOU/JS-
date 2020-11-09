import requests
import execjs
import re


string = """
function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "") val = str.charCodeAt(i).toString(16);
        else val += str.charCodeAt(i).toString(16);
    }
    return val;
}
var screen ={},document={},window=this;
 screen.width = 1440;
 screen.height = 900;
var screendate = screen.width + "," + screen.height;
var data = "srcurl=" + stringToHex("http://www.300600900.cn/") ;
var verify = stringToHex(screendate);
"""

def process_cookies():
    url = 'http://www.300600900.cn/'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763",
    }
    s = requests.session()
    res = s.get(url,headers=headers,timeout=5)
    res = s.get('http://www.300600900.cn/?security_verify_data=313336362c373638',headers=headers,timeout=5)
    print(requests.utils.dict_from_cookiejar(res.cookies))
    node = execjs.compile(string)
    data =  node.eval('data')
    print(data)
    name, value = data.split('=')
    # cookies = 'srcurl=687474703a2f2f7777772e3330303630303930302e636e2f'
    # headers['Cookie'] = cookies
    res =  s.get(url, headers=headers,cookies={name:value},timeout=5)
    res.encoding = res.apparent_encoding
    print(res.text.encode('utf8').decode('utf8'))
process_cookies()