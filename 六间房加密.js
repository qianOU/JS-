//注deviceId: WHJMrwNw1k%2FEfyQir6Ssz%2Fo1KebPbc%2B%2FvFVsZv%2BGOghr5JzEFI3srTxLi0nYikgposC87ajF71lt7RM%2F4NNvYHi9u5vsPQH90xNLrnR5uWfm4CVSac4KR5ZCCf1UjlEyV5lTGsgtlZp1jaedLrJ40Vfa79AB5aW6MwD%2BFREsGp1a3Ygbfz%2B4tYCQfNpeUZct8P%2BGO218J15iSErQCd6TfLhFOQB3sf95avm2k%2FzkOSJmImiBq5SwrdcEGo1C1q60eR%2B2MeD4N9o8Fg%2FYMjg0N8QTLkdsIGHEN3gDem5meak8%3D1487582755342
//为设备信息是不变参数
function test(pwd,servertime,nonce){
return encode("" + encode(encode(pwd) + servertime) + nonce);
}
var encode  = function(a) {
            return hex_sha1(a)
        };
var a = function(a, c) {
            var d = (a & 65535) + (c & 65535);
            return (a >> 16) + (c >> 16) + (d >> 16) << 16 | d & 65535
        };
var hex_sha1 = function(b) {
            for (var c = [], d = 0; d < 8 * b.length; d += 8)
                c[d >> 5] |= (b.charCodeAt(d / 8) & 255) << 24 - d % 32;
            b = 8 * b.length;
            c[b >> 5] |= 128 << 24 - b % 32;
            c[(b + 64 >> 9 << 4) + 15] = b;
            for (var b = Array(80), d = 1732584193, e = -271733879, h = -1732584194, f = 271733878, g = -1009589776, j = 0; j < c.length; j += 16) {
                for (var k = d, l = e, o = h, p = f, q = g, i = 0; 80 > i; i++) {
                    b[i] = 16 > i ? c[j + i] : (b[i - 3] ^ b[i - 8] ^ b[i - 14] ^ b[i - 16]) << 1 | (b[i - 3] ^ b[i - 8] ^ b[i - 14] ^ b[i - 16]) >>> 31;
                    var m = d << 5 | d >>> 27, n;
                    n = 20 > i ? e & h | ~e & f : 40 > i ? e ^ h ^ f : 60 > i ? e & h | e & f | h & f : e ^ h ^ f;
                    m = a(a(m, n), a(a(g, b[i]), 20 > i ? 1518500249 : 40 > i ? 1859775393 : 60 > i ? -1894007588 : -899497514));
                    g = f;
                    f = h;
                    h = e << 30 | e >>> 2;
                    e = d;
                    d = m
                }
                d = a(d, k);
                e = a(e, l);
                h = a(h, o);
                f = a(f, p);
                g = a(g, q)
            }
            c = [d, e, h, f, g];
            b = "";
            for (d = 0; d < 4 * c.length; d++)
                b += "0123456789abcdef".charAt(c[d >> 2] >> 8 * (3 - d % 4) + 4 & 15) + "0123456789abcdef".charAt(c[d >> 2] >> 8 * (3 - d % 4) & 15);
            return b
        }