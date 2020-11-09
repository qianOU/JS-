E = function() {
        var t = function r() {
            for (var r = 1 * new Date, t = 0; r == 1 * new Date; )
                t++;
            return r.toString(16) + t.toString(16)
        }
          , e = function() {
            return Math.random().toString(16).replace(".", "")
        }
          , n = function i() {
            function t(t, e) {
                var n, i = 0;
                for (n = 0; n < e.length; n++)
                    i |= r[n] << 8 * n;
                return t ^ i
            }
            var i, e, n ="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36", r = [], o = 0;
            for (i = 0; i < n.length; i++)
                e = n.charCodeAt(i),
                r.unshift(255 & e),
                r.length >= 4 && (o = t(o, r),
                r = []);
            return r.length > 0 && (o = t(o, r)),
            o.toString(16)
        };
        return function() {
            var r = String(7768 * 1366);
            r = r && /\d{5,}/.test(r) ? r.toString(16) : String(31242 * Math.random()).replace(".", "").slice(0, 8);
            var i = t() + "-" + e() + "-" + n() + "-" + r + "-" + t();
            return i ? i : (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15)
        }
    }()
function test(aa,bb){

	cc = E();

        return  cc;

}