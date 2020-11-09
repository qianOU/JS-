// 注sign参数为访问get_login_page得到的url返回的json格式中的"formtoken"值
// appid的值隐藏在主页的html中  <script type="text/javascript" src="http://static.sso.baofeng.net/js/sso.min.js?appid=8637"></script>

callback = null;
_=null;
function get_login_page(appid=8637){
var str1 = "jQuery" + ("1.12.4" + Math.random()).replace(/\D/g, "")
Pt = +new Date;
str1 +=  "_" + Pt++;
callback = str1;
str1 += "&_=" + Pt++;
_ = Pt;
var str2 = 'https://sso.baofeng.com/new/user/get_login_page?appid='+appid+'&callback=';
return (str2 + str1)
}

function getparam(){
// get_login_page();
return [callback,_];
}
console.log(get_login_page())
console.log(getparam())