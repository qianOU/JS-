screen = {height:768,width:1366}
r = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
var a =  function () {
                var t = function() {
                    for (var t = 1 * new Date, e = 0; t == 1 * new Date; )
                        e++;
                    return t.toString(16) + e.toString(16)
                }
                  , e = function() {
                    return Math.random().toString(16).replace(".", "")
                }
                  , n = function(t) {
                    function e(t, e) {
                        var n, i = 0;
                        for (n = 0; n < e.length; n++)
                            i |= s[n] << 8 * n;
                        return t ^ i
                    }
                    var n, i, o = r, s = [], a = 0;
                    for (n = 0; n < o.length; n++)
                        i = o.charCodeAt(n),
                        s.unshift(255 & i),
                        s.length >= 4 && (a = e(a, s),
                        s = []);
                    return s.length > 0 && (a = e(a, s)),
                    a.toString(16)
                };
                return function() {
                    var i = (screen.height * screen.width).toString(16);
                    return t() + "-" + e() + "-" + n() + "-" + i + "-" + t()
                }
            }()

function test(r){
return ' zhugeDid  : ' + a()  + '   ||        zhugeSid  : ' + 1 * new Date
}

