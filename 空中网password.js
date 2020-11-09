//
// 用python提前获取encrypt的第二个参数
// 
// import requests,time
// session = requests.session()
// url = 'https://sso.kongzhong.com/ajaxLogin?j=j&jsonp=j&service=https://passport.kongzhong.com/&_=' + str(int(time.time()*1000))
// headers = {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
//     'Referer': 'https://passport.kongzhong.com/login',
//     'Sec-Fetch-Mode': 'no-cors',
// }
// print(url)
// res = session.get('https://passport.kongzhong.com/login',headers=headers,timeout=5)
// res = session.get(url,headers=headers,timeout=5)
// res.encoding = res.apparent_encoding
// print(res.status_code,res.text)



    var encrypt = function(str, pwd) {
        if (pwd == null || pwd.length <= 0) {
            return null
        }
        ;var prand = "";
        for (var i = 0; i < pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString()
        }
        ;var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        var incr = Math.ceil(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        if (mult < 2) {
            return null
        }
        ;var salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while (prand.length > 10) {
            var a = prand.substring(0, 1);
            var b = prand.substring(10, prand.length);
            if (b.length > 10) {
                prand = b
            } else {
                prand = (parseInt(a) + parseInt(b)).toString()
            }
        }
        ;prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for (var i = 0; i < str.length; i++) {
            enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if (enc_chr < 16) {
                enc_str += "0" + enc_chr.toString(16)
            } else
                enc_str += enc_chr.toString(16);
            prand = (mult * prand + incr) % modu
        }
        ;salt = salt.toString(16);
        while (salt.length < 8)
            salt = "0" + salt;
        enc_str += salt;
        return enc_str
    }

w  = encrypt('11111111',"199EB8E648CF4C66192E9D75D0E2AC3C");
console.log(w)