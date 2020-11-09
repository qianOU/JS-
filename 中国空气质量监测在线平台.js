function Base64() {
    _2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        this.encode = function(a) {
            var c, d, e, f, g, h, i, b = "",
                j = 0;
            for (a = _29(a); j < a.length;)
                c = a.charCodeAt(j++),
                d = a.charCodeAt(j++),
                e = a.charCodeAt(j++),
                f = c >> 2,
                g = (3 & c) << 4 | d >> 4,
                h = (15 & d) << 2 | e >> 6,
                i = 63 & e,
                isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64),
                b = b + _2.charAt(f) + _2.charAt(g) + _2.charAt(h) + _2.charAt(i);
            return b
        },
        this.decode = function(a) {
            var c, d, e, f, g, h, i, b = "",
                j = 0;
            for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); j < a.length;)
                f = _2.indexOf(a.charAt(j++)),
                g = _2.indexOf(a.charAt(j++)),
                h = _2.indexOf(a.charAt(j++)),
                i = _2.indexOf(a.charAt(j++)),
                c = f << 2 | g >> 4,
                d = (15 & g) << 4 | h >> 2,
                e = (3 & h) << 6 | i,
                b += String.fromCharCode(c),
                64 != h && (b += String.fromCharCode(d)),
                64 != i && (b += String.fromCharCode(e));
            return b = _27(b)
        },
        _29 = function(a) {
            var b, c, d;
            for (a = a.replace(/\r\n/g, "\n"),
                b = "",
                c = 0; c < a.length; c++)
                d = a.charCodeAt(c),
                128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(192 | d >> 6),
                    b += String.fromCharCode(128 | 63 & d)) : (b += String.fromCharCode(224 | d >> 12),
                    b += String.fromCharCode(128 | 63 & d >> 6),
                    b += String.fromCharCode(128 | 63 & d));
            return b
        },
        _27 = function(a) {
            for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;)
                d = a.charCodeAt(c),
                128 > d ? (b += String.fromCharCode(d),
                    c++) : d > 191 && 224 > d ? (c2 = a.charCodeAt(c + 1),
                    b += String.fromCharCode((31 & d) << 6 | 63 & c2),
                    c += 2) : (c2 = a.charCodeAt(c + 1),
                    c3 = a.charCodeAt(c + 2),
                    b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3),
                    c += 3);
            return b
        }
}

function hex_md5(a) {
    return binl2hex(core_md5(str2binl(a), a.length * chrsz))
}

function b64_md5(a) {
    return binl2b64(core_md5(str2binl(a), a.length * chrsz))
}

function str_md5(a) {
    return binl2str(core_md5(str2binl(a), a.length * chrsz))
}

function hex_hmac_md5(a, b) {
    return binl2hex(core_hmac_md5(a, b))
}

function b64_hmac_md5(a, b) {
    return binl2b64(core_hmac_md5(a, b))
}

function str_hmac_md5(a, b) {
    return binl2str(core_hmac_md5(a, b))
}

function md5_vm_test() {
    return "900150983cd24fb0d6963f7d28e17f72" == hex_md5("abc")
}

function core_md5(a, b) {
    var c, d, e, f, g, h, i, j, k;
    for (a[b >> 5] |= 128 << b % 32,
        a[(b + 64 >>> 9 << 4) + 14] = b,
        c = 1732584193,
        d = -271733879,
        e = -1732584194,
        f = 271733878,
        g = 0; g < a.length; g += 16)
        h = c,
        i = d,
        j = e,
        k = f,
        c = md5_ff(c, d, e, f, a[g + 0], 7, -680876936),
        f = md5_ff(f, c, d, e, a[g + 1], 12, -389564586),
        e = md5_ff(e, f, c, d, a[g + 2], 17, 606105819),
        d = md5_ff(d, e, f, c, a[g + 3], 22, -1044525330),
        c = md5_ff(c, d, e, f, a[g + 4], 7, -176418897),
        f = md5_ff(f, c, d, e, a[g + 5], 12, 1200080426),
        e = md5_ff(e, f, c, d, a[g + 6], 17, -1473231341),
        d = md5_ff(d, e, f, c, a[g + 7], 22, -45705983),
        c = md5_ff(c, d, e, f, a[g + 8], 7, 1770035416),
        f = md5_ff(f, c, d, e, a[g + 9], 12, -1958414417),
        e = md5_ff(e, f, c, d, a[g + 10], 17, -42063),
        d = md5_ff(d, e, f, c, a[g + 11], 22, -1990404162),
        c = md5_ff(c, d, e, f, a[g + 12], 7, 1804603682),
        f = md5_ff(f, c, d, e, a[g + 13], 12, -40341101),
        e = md5_ff(e, f, c, d, a[g + 14], 17, -1502002290),
        d = md5_ff(d, e, f, c, a[g + 15], 22, 1236535329),
        c = md5_gg(c, d, e, f, a[g + 1], 5, -165796510),
        f = md5_gg(f, c, d, e, a[g + 6], 9, -1069501632),
        e = md5_gg(e, f, c, d, a[g + 11], 14, 643717713),
        d = md5_gg(d, e, f, c, a[g + 0], 20, -373897302),
        c = md5_gg(c, d, e, f, a[g + 5], 5, -701558691),
        f = md5_gg(f, c, d, e, a[g + 10], 9, 38016083),
        e = md5_gg(e, f, c, d, a[g + 15], 14, -660478335),
        d = md5_gg(d, e, f, c, a[g + 4], 20, -405537848),
        c = md5_gg(c, d, e, f, a[g + 9], 5, 568446438),
        f = md5_gg(f, c, d, e, a[g + 14], 9, -1019803690),
        e = md5_gg(e, f, c, d, a[g + 3], 14, -187363961),
        d = md5_gg(d, e, f, c, a[g + 8], 20, 1163531501),
        c = md5_gg(c, d, e, f, a[g + 13], 5, -1444681467),
        f = md5_gg(f, c, d, e, a[g + 2], 9, -51403784),
        e = md5_gg(e, f, c, d, a[g + 7], 14, 1735328473),
        d = md5_gg(d, e, f, c, a[g + 12], 20, -1926607734),
        c = md5_hh(c, d, e, f, a[g + 5], 4, -378558),
        f = md5_hh(f, c, d, e, a[g + 8], 11, -2022574463),
        e = md5_hh(e, f, c, d, a[g + 11], 16, 1839030562),
        d = md5_hh(d, e, f, c, a[g + 14], 23, -35309556),
        c = md5_hh(c, d, e, f, a[g + 1], 4, -1530992060),
        f = md5_hh(f, c, d, e, a[g + 4], 11, 1272893353),
        e = md5_hh(e, f, c, d, a[g + 7], 16, -155497632),
        d = md5_hh(d, e, f, c, a[g + 10], 23, -1094730640),
        c = md5_hh(c, d, e, f, a[g + 13], 4, 681279174),
        f = md5_hh(f, c, d, e, a[g + 0], 11, -358537222),
        e = md5_hh(e, f, c, d, a[g + 3], 16, -722521979),
        d = md5_hh(d, e, f, c, a[g + 6], 23, 76029189),
        c = md5_hh(c, d, e, f, a[g + 9], 4, -640364487),
        f = md5_hh(f, c, d, e, a[g + 12], 11, -421815835),
        e = md5_hh(e, f, c, d, a[g + 15], 16, 530742520),
        d = md5_hh(d, e, f, c, a[g + 2], 23, -995338651),
        c = md5_ii(c, d, e, f, a[g + 0], 6, -198630844),
        f = md5_ii(f, c, d, e, a[g + 7], 10, 1126891415),
        e = md5_ii(e, f, c, d, a[g + 14], 15, -1416354905),
        d = md5_ii(d, e, f, c, a[g + 5], 21, -57434055),
        c = md5_ii(c, d, e, f, a[g + 12], 6, 1700485571),
        f = md5_ii(f, c, d, e, a[g + 3], 10, -1894986606),
        e = md5_ii(e, f, c, d, a[g + 10], 15, -1051523),
        d = md5_ii(d, e, f, c, a[g + 1], 21, -2054922799),
        c = md5_ii(c, d, e, f, a[g + 8], 6, 1873313359),
        f = md5_ii(f, c, d, e, a[g + 15], 10, -30611744),
        e = md5_ii(e, f, c, d, a[g + 6], 15, -1560198380),
        d = md5_ii(d, e, f, c, a[g + 13], 21, 1309151649),
        c = md5_ii(c, d, e, f, a[g + 4], 6, -145523070),
        f = md5_ii(f, c, d, e, a[g + 11], 10, -1120210379),
        e = md5_ii(e, f, c, d, a[g + 2], 15, 718787259),
        d = md5_ii(d, e, f, c, a[g + 9], 21, -343485551),
        c = safe_add(c, h),
        d = safe_add(d, i),
        e = safe_add(e, j),
        f = safe_add(f, k);
    return Array(c, d, e, f)
}

function md5_cmn(a, b, c, d, e, f) {
    return safe_add(bit_rol(safe_add(safe_add(b, a), safe_add(d, f)), e), c)
}

function md5_ff(a, b, c, d, e, f, g) {
    return md5_cmn(b & c | ~b & d, a, b, e, f, g)
}

function md5_gg(a, b, c, d, e, f, g) {
    return md5_cmn(b & d | c & ~d, a, b, e, f, g)
}

function md5_hh(a, b, c, d, e, f, g) {
    return md5_cmn(b ^ c ^ d, a, b, e, f, g)
}

function md5_ii(a, b, c, d, e, f, g) {
    return md5_cmn(c ^ (b | ~d), a, b, e, f, g)
}

function core_hmac_md5(a, b) {
    var d, e, f, g, c = str2binl(a);
    for (c.length > 16 && (c = core_md5(c, a.length * chrsz)),
        d = Array(16),
        e = Array(16),
        f = 0; 16 > f; f++)
        d[f] = 909522486 ^ c[f],
        e[f] = 1549556828 ^ c[f];
    return g = core_md5(d.concat(str2binl(b)), 512 + b.length * chrsz),
        core_md5(e.concat(g), 640)
}

function safe_add(a, b) {
    var c = (65535 & a) + (65535 & b),
        d = (a >> 16) + (b >> 16) + (c >> 16);
    return d << 16 | 65535 & c
}

function bit_rol(a, b) {
    return a << b | a >>> 32 - b
}

function str2binl(a) {
    var d, b = Array(),
        c = (1 << chrsz) - 1;
    for (d = 0; d < a.length * chrsz; d += chrsz)
        b[d >> 5] |= (a.charCodeAt(d / chrsz) & c) << d % 32;
    return b
}

function binl2str(a) {
    var d, b = "",
        c = (1 << chrsz) - 1;
    for (d = 0; d < 32 * a.length; d += chrsz)
        b += String.fromCharCode(a[d >> 5] >>> d % 32 & c);
    return b
}

function binl2hex(a) {
    var d, b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",
        c = "";
    for (d = 0; d < 4 * a.length; d++)
        c += b.charAt(15 & a[d >> 2] >> 8 * (d % 4) + 4) + b.charAt(15 & a[d >> 2] >> 8 * (d % 4));
    return c
}

function binl2b64(a) {
    var d, e, f, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        c = "";
    for (d = 0; d < 4 * a.length; d += 3)
        for (e = (255 & a[d >> 2] >> 8 * (d % 4)) << 16 | (255 & a[d + 1 >> 2] >> 8 * ((d + 1) % 4)) << 8 | 255 & a[d + 2 >> 2] >> 8 * ((d + 2) % 4),
            f = 0; 4 > f; f++)
            c += 8 * d + 6 * f > 32 * a.length ? b64pad : b.charAt(63 & e >> 6 * (3 - f));
    return c
}

function encode_param(a) {
    var b = new Base64;
    return b.encode(a)
}

function encode_secret() {
    var b, a = appId;
    for (b = 0; b < arguments.length; b++)
        a += arguments[b];
    return a = a.replace(/\s/g, ""),
        hex_md5(a)
}

function decode_result(a) {
    var b = new Base64;
    return b.decode(b.decode(b.decode(a)))
}
var hexcase = 0,
    b64pad = "",
    chrsz = 8,
    appId = "a01901d3caba1f362d69474674ce477f";
var hexcase = 0;
var b64pad = "";

function hex_md5(s) {
    return rstr2hex(rstr_md5(str2rstr_utf8(s)))
}

function b64_md5(s) {
    return rstr2b64(rstr_md5(str2rstr_utf8(s)))
}

function any_md5(s, e) {
    return rstr2any(rstr_md5(str2rstr_utf8(s)), e)
}

function hex_hmac_md5(k, d) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function b64_hmac_md5(k, d) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
}

function any_hmac_md5(k, d, e) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e)
}

function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}

function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
}

function rstr_hmac_md5(key, data) {
    var bkey = rstr2binl(key);
    if (bkey.length > 16)
        bkey = binl_md5(bkey, key.length * 8);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
}

function rstr2hex(input) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for (var i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F)
    }
    return output
}

function rstr2b64(input) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8)
                output += b64pad;
            else
                output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F)
        }
    }
    return output
}

function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var i, j, q, x, quotient;
    var dividend = Array(Math.ceil(input.length / 2));
    for (i = 0; i < dividend.length; i++) {
        dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1)
    }
    var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for (j = 0; j < full_length; j++) {
        quotient = Array();
        x = 0;
        for (i = 0; i < dividend.length; i++) {
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0)
                quotient[quotient.length] = q
        }
        remainders[j] = x;
        dividend = quotient
    }
    var output = "";
    for (i = remainders.length - 1; i >= 0; i--)
        output += encoding.charAt(remainders[i]);
    return output
}

function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            output += String.fromCharCode(x);
        else if (x <= 0x7FF)
            output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return output
}

function str2rstr_utf16le(input) {
    var output = "";
    for (var i = 0; i < input.length; i++)
        output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    return output
}

function str2rstr_utf16be(input) {
    var output = "";
    for (var i = 0; i < input.length; i++)
        output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    return output
}

function rstr2binl(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++)
        output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return output
}

function binl2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    return output
}

function binl_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd)
    }
    return Array(a, b, c, d)
}

function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF)
}

function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}
var CryptoJS = CryptoJS || function(h, r) {
    var k = {},
        l = k.lib = {},
        n = function() {},
        f = l.Base = {
            extend: function(a) {
                n.prototype = this;
                var b = new n;
                a && b.mixIn(a);
                b.hasOwnProperty("init") || (b.init = function() {
                    b.s.init.apply(this, arguments)
                });
                b.init.prototype = b;
                b.s = this;
                return b
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var b in a)
                    a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        j = l.WordArray = f.extend({
            init: function(a, b) {
                a = this.words = a || [];
                this.sigBytes = b != r ? b : 4 * a.length
            },
            toString: function(a) {
                return (a || s).stringify(this)
            },
            concat: function(a) {
                var b = this.words,
                    d = a.words,
                    c = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (c % 4)
                    for (var e = 0; e < a; e++)
                        b[c + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((c + e) % 4);
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4)
                        b[c + e >>> 2] = d[e >>> 2];
                else
                    b.push.apply(b, d);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    b = this.sigBytes;
                a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4);
                a.length = h.ceil(b / 4)
            },
            clone: function() {
                var a = f.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var b = [], d = 0; d < a; d += 4)
                    b.push(4294967296 * h.random() | 0);
                return new j.init(b, a)
            }
        }),
        m = k.enc = {},
        s = m.Hex = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var d = [], c = 0; c < a; c++) {
                    var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function(a) {
                for (var b = a.length, d = [], c = 0; c < b; c += 2)
                    d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - 4 * (c % 8);
                return new j.init(d, b / 2)
            }
        },
        p = m.Latin1 = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var d = [], c = 0; c < a; c++)
                    d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255));
                return d.join("")
            },
            parse: function(a) {
                for (var b = a.length, d = [], c = 0; c < b; c++)
                    d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4);
                return new j.init(d, b)
            }
        },
        t = m.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(p.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data")
                }
            },
            parse: function(a) {
                return p.parse(unescape(encodeURIComponent(a)))
            }
        },
        q = l.BufferedBlockAlgorithm = f.extend({
            reset: function() {
                this._3 = new j.init;
                this._19 = 0
            },
            _11: function(a) {
                "string" == typeof a && (a = t.parse(a));
                this._3.concat(a);
                this._19 += a.sigBytes
            },
            _4: function(a) {
                var b = this._3,
                    d = b.words,
                    c = b.sigBytes,
                    e = this.blockSize,
                    f = c / (4 * e),
                    f = a ? h.ceil(f) : h.max((f | 0) - this._20, 0);
                a = f * e;
                c = h.min(4 * a, c);
                if (a) {
                    for (var g = 0; g < a; g += e)
                        this._23(d, g);
                    g = d.splice(0, a);
                    b.sigBytes -= c
                }
                return new j.init(g, c)
            },
            clone: function() {
                var a = f.clone.call(this);
                a._3 = this._3.clone();
                return a
            },
            _20: 0
        });
    l.Hasher = q.extend({
        cfg: f.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            q.reset.call(this);
            this._7()
        },
        update: function(a) {
            this._11(a);
            this._4();
            return this
        },
        finalize: function(a) {
            a && this._11(a);
            return this._10()
        },
        blockSize: 16,
        _5: function(a) {
            return function(b, d) {
                return (new a.init(d)).finalize(b)
            }
        },
        _30: function(a) {
            return function(b, d) {
                return (new u.HMAC.init(a, d)).finalize(b)
            }
        }
    });
    var u = k.algo = {};
    return k
}(Math);
(function() {
    var h = CryptoJS,
        j = h.lib.WordArray;
    h.enc.Base64 = {
        stringify: function(b) {
            var e = b.words,
                f = b.sigBytes,
                c = this._17;
            b.clamp();
            b = [];
            for (var a = 0; a < f; a += 3)
                for (var d = (e[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++)
                    b.push(c.charAt(d >>> 6 * (3 - g) & 63));
            if (e = c.charAt(64))
                for (; b.length % 4;)
                    b.push(e);
            return b.join("")
        },
        parse: function(b) {
            var e = b.length,
                f = this._17,
                c = f.charAt(64);
            c && (c = b.indexOf(c),
                -1 != c && (e = c));
            for (var c = [], a = 0, d = 0; d < e; d++)
                if (d % 4) {
                    var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4),
                        h = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4);
                    c[a >>> 2] |= (g | h) << 24 - 8 * (a % 4);
                    a++
                }
            return j.create(c, a)
        },
        _17: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
CryptoJS.lib.Cipher || function(u) {
    var g = CryptoJS,
        f = g.lib,
        k = f.Base,
        l = f.WordArray,
        q = f.BufferedBlockAlgorithm,
        r = g.enc.Base64,
        v = g.algo.EvpKDF,
        n = f.Cipher = q.extend({
            cfg: k.extend(),
            createEncryptor: function(a, b) {
                return this.create(this._12, a, b)
            },
            createDecryptor: function(a, b) {
                return this.create(this._33, a, b)
            },
            init: function(a, b, c) {
                this.cfg = this.cfg.extend(c);
                this._16 = a;
                this._13 = b;
                this.reset()
            },
            reset: function() {
                q.reset.call(this);
                this._7()
            },
            process: function(a) {
                this._11(a);
                return this._4()
            },
            finalize: function(a) {
                a && this._11(a);
                return this._10()
            },
            keySize: 4,
            ivSize: 4,
            _12: 1,
            _33: 2,
            _5: function(a) {
                return {
                    encrypt: function(b, c, d) {
                        return ("string" == typeof c ? s : j).encrypt(a, b, c, d)
                    },
                    decrypt: function(b, c, d) {
                        return ("string" == typeof c ? s : j).decrypt(a, b, c, d)
                    }
                }
            }
        });
    f.StreamCipher = n.extend({
        _10: function() {
            return this._4(!0)
        },
        blockSize: 1
    });
    var m = g.mode = {},
        t = function(a, b, c) {
            var d = this._18;
            d ? this._18 = u : d = this._14;
            for (var e = 0; e < c; e++)
                a[b + e] ^= d[e]
        },
        h = (f.BlockCipherMode = k.extend({
            createEncryptor: function(a, b) {
                return this.Encryptor.create(a, b)
            },
            createDecryptor: function(a, b) {
                return this.Decryptor.create(a, b)
            },
            init: function(a, b) {
                this._8 = a;
                this._18 = b
            }
        })).extend();
    h.Encryptor = h.extend({
        processBlock: function(a, b) {
            var c = this._8,
                d = c.blockSize;
            t.call(this, a, b, d);
            c.encryptBlock(a, b);
            this._14 = a.slice(b, b + d)
        }
    });
    h.Decryptor = h.extend({
        processBlock: function(a, b) {
            var c = this._8,
                d = c.blockSize,
                e = a.slice(b, b + d);
            c.decryptBlock(a, b);
            t.call(this, a, b, d);
            this._14 = e
        }
    });
    m = m.CBC = h;
    h = (g.pad = {}).Pkcs7 = {
        pad: function(a, b) {
            for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, e = [], f = 0; f < c; f += 4)
                e.push(d);
            c = l.create(e, c);
            a.concat(c)
        },
        unpad: function(a) {
            a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
        }
    };
    f.BlockCipher = n.extend({
        cfg: n.cfg.extend({
            mode: m,
            padding: h
        }),
        reset: function() {
            n.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._16 == this._12)
                var c = a.createEncryptor;
            else
                c = a.createDecryptor,
                this._20 = 1;
            this._31 = c.call(a, this, b && b.words)
        },
        _23: function(a, b) {
            this._31.processBlock(a, b)
        },
        _10: function() {
            var a = this.cfg.padding;
            if (this._16 == this._12) {
                a.pad(this._3, this.blockSize);
                var b = this._4(!0)
            } else
                b = this._4(!0),
                a.unpad(b);
            return b
        },
        blockSize: 4
    });
    var p = f.CipherParams = k.extend({
            init: function(a) {
                this.mixIn(a)
            },
            toString: function(a) {
                return (a || this.formatter).stringify(this)
            }
        }),
        m = (g.format = {}).OpenSSL = {
            stringify: function(a) {
                var b = a.ciphertext;
                a = a.salt;
                return (a ? l.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(r)
            },
            parse: function(a) {
                a = r.parse(a);
                var b = a.words;
                if (1398893684 == b[0] && 1701076831 == b[1]) {
                    var c = l.create(b.slice(2, 4));
                    b.splice(0, 4);
                    a.sigBytes -= 16
                }
                return p.create({
                    ciphertext: a,
                    salt: c
                })
            }
        },
        j = f.SerializableCipher = k.extend({
            cfg: k.extend({
                format: m
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                var e = a.createEncryptor(c, d);
                b = e.finalize(b);
                e = e.cfg;
                return p.create({
                    ciphertext: b,
                    key: c,
                    iv: e.iv,
                    algorithm: a,
                    mode: e.mode,
                    padding: e.padding,
                    blockSize: a.blockSize,
                    formatter: d.format
                })
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._15(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext)
            },
            _15: function(a, b) {
                return "string" == typeof a ? b.parse(a, this) : a
            }
        }),
        g = (g.kdf = {}).OpenSSL = {
            execute: function(a, b, c, d) {
                d || (d = l.random(8));
                a = v.create({
                    keySize: b + c
                }).compute(a, d);
                c = l.create(a.words.slice(b), 4 * c);
                a.sigBytes = 4 * b;
                return p.create({
                    key: a,
                    iv: c,
                    salt: d
                })
            }
        },
        s = f.PasswordBasedCipher = j.extend({
            cfg: j.cfg.extend({
                kdf: g
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                c = d.kdf.execute(c, a.keySize, a.ivSize);
                d.iv = c.iv;
                a = j.encrypt.call(this, a, b, c.key, d);
                a.mixIn(c);
                return a
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._15(b, d.format);
                c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
                d.iv = c.iv;
                return j.decrypt.call(this, a, b, c.key, d)
            }
        })
}();
CryptoJS.mode.ECB = function() {
    var a = CryptoJS.lib.BlockCipherMode.extend();
    a.Encryptor = a.extend({
        processBlock: function(a, b) {
            this._8.encryptBlock(a, b)
        }
    });
    a.Decryptor = a.extend({
        processBlock: function(a, b) {
            this._8.decryptBlock(a, b)
        }
    });
    return a
}();
(function(E) {
    function h(a, f, g, j, p, h, k) {
        a = a + (f & g | ~f & j) + p + k;
        return (a << h | a >>> 32 - h) + f
    }

    function k(a, f, g, j, p, h, k) {
        a = a + (f & j | g & ~j) + p + k;
        return (a << h | a >>> 32 - h) + f
    }

    function l(a, f, g, j, h, k, l) {
        a = a + (f ^ g ^ j) + h + l;
        return (a << k | a >>> 32 - k) + f
    }

    function n(a, f, g, j, h, k, l) {
        a = a + (g ^ (f | ~j)) + h + l;
        return (a << k | a >>> 32 - k) + f
    }
    for (var r = CryptoJS, q = r.lib, F = q.WordArray, s = q.Hasher, q = r.algo, a = [], t = 0; 64 > t; t++)
        a[t] = 4294967296 * E.abs(E.sin(t + 1)) | 0;
    q = q.MD5 = s.extend({
        _7: function() {
            this._9 = new F.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _23: function(m, f) {
            for (var g = 0; 16 > g; g++) {
                var j = f + g,
                    p = m[j];
                m[j] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360
            }
            var g = this._9.words,
                j = m[f + 0],
                p = m[f + 1],
                q = m[f + 2],
                r = m[f + 3],
                s = m[f + 4],
                t = m[f + 5],
                u = m[f + 6],
                v = m[f + 7],
                w = m[f + 8],
                x = m[f + 9],
                y = m[f + 10],
                z = m[f + 11],
                A = m[f + 12],
                B = m[f + 13],
                C = m[f + 14],
                D = m[f + 15],
                b = g[0],
                c = g[1],
                d = g[2],
                e = g[3],
                b = h(b, c, d, e, j, 7, a[0]),
                e = h(e, b, c, d, p, 12, a[1]),
                d = h(d, e, b, c, q, 17, a[2]),
                c = h(c, d, e, b, r, 22, a[3]),
                b = h(b, c, d, e, s, 7, a[4]),
                e = h(e, b, c, d, t, 12, a[5]),
                d = h(d, e, b, c, u, 17, a[6]),
                c = h(c, d, e, b, v, 22, a[7]),
                b = h(b, c, d, e, w, 7, a[8]),
                e = h(e, b, c, d, x, 12, a[9]),
                d = h(d, e, b, c, y, 17, a[10]),
                c = h(c, d, e, b, z, 22, a[11]),
                b = h(b, c, d, e, A, 7, a[12]),
                e = h(e, b, c, d, B, 12, a[13]),
                d = h(d, e, b, c, C, 17, a[14]),
                c = h(c, d, e, b, D, 22, a[15]),
                b = k(b, c, d, e, p, 5, a[16]),
                e = k(e, b, c, d, u, 9, a[17]),
                d = k(d, e, b, c, z, 14, a[18]),
                c = k(c, d, e, b, j, 20, a[19]),
                b = k(b, c, d, e, t, 5, a[20]),
                e = k(e, b, c, d, y, 9, a[21]),
                d = k(d, e, b, c, D, 14, a[22]),
                c = k(c, d, e, b, s, 20, a[23]),
                b = k(b, c, d, e, x, 5, a[24]),
                e = k(e, b, c, d, C, 9, a[25]),
                d = k(d, e, b, c, r, 14, a[26]),
                c = k(c, d, e, b, w, 20, a[27]),
                b = k(b, c, d, e, B, 5, a[28]),
                e = k(e, b, c, d, q, 9, a[29]),
                d = k(d, e, b, c, v, 14, a[30]),
                c = k(c, d, e, b, A, 20, a[31]),
                b = l(b, c, d, e, t, 4, a[32]),
                e = l(e, b, c, d, w, 11, a[33]),
                d = l(d, e, b, c, z, 16, a[34]),
                c = l(c, d, e, b, C, 23, a[35]),
                b = l(b, c, d, e, p, 4, a[36]),
                e = l(e, b, c, d, s, 11, a[37]),
                d = l(d, e, b, c, v, 16, a[38]),
                c = l(c, d, e, b, y, 23, a[39]),
                b = l(b, c, d, e, B, 4, a[40]),
                e = l(e, b, c, d, j, 11, a[41]),
                d = l(d, e, b, c, r, 16, a[42]),
                c = l(c, d, e, b, u, 23, a[43]),
                b = l(b, c, d, e, x, 4, a[44]),
                e = l(e, b, c, d, A, 11, a[45]),
                d = l(d, e, b, c, D, 16, a[46]),
                c = l(c, d, e, b, q, 23, a[47]),
                b = n(b, c, d, e, j, 6, a[48]),
                e = n(e, b, c, d, v, 10, a[49]),
                d = n(d, e, b, c, C, 15, a[50]),
                c = n(c, d, e, b, t, 21, a[51]),
                b = n(b, c, d, e, A, 6, a[52]),
                e = n(e, b, c, d, r, 10, a[53]),
                d = n(d, e, b, c, y, 15, a[54]),
                c = n(c, d, e, b, p, 21, a[55]),
                b = n(b, c, d, e, w, 6, a[56]),
                e = n(e, b, c, d, D, 10, a[57]),
                d = n(d, e, b, c, u, 15, a[58]),
                c = n(c, d, e, b, B, 21, a[59]),
                b = n(b, c, d, e, s, 6, a[60]),
                e = n(e, b, c, d, z, 10, a[61]),
                d = n(d, e, b, c, q, 15, a[62]),
                c = n(c, d, e, b, x, 21, a[63]);
            g[0] = g[0] + b | 0;
            g[1] = g[1] + c | 0;
            g[2] = g[2] + d | 0;
            g[3] = g[3] + e | 0
        },
        _10: function() {
            var a = this._3,
                f = a.words,
                g = 8 * this._19,
                j = 8 * a.sigBytes;
            f[j >>> 5] |= 128 << 24 - j % 32;
            var h = E.floor(g / 4294967296);
            f[(j + 64 >>> 9 << 4) + 15] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
            f[(j + 64 >>> 9 << 4) + 14] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
            a.sigBytes = 4 * (f.length + 1);
            this._4();
            a = this._9;
            f = a.words;
            for (g = 0; 4 > g; g++)
                j = f[g],
                f[g] = (j << 8 | j >>> 24) & 16711935 | (j << 24 | j >>> 8) & 4278255360;
            return a
        },
        clone: function() {
            var a = s.clone.call(this);
            a._9 = this._9.clone();
            return a
        }
    });
    r.MD5 = s._5(q);
    r.HmacMD5 = s._30(q)
})(Math);
(function() {
    for (var q = CryptoJS, x = q.lib.BlockCipher, r = q.algo, j = [], y = [], z = [], A = [], B = [], C = [], s = [], u = [], v = [], w = [], g = [], k = 0; 256 > k; k++)
        g[k] = 128 > k ? k << 1 : k << 1 ^ 283;
    for (var n = 0, l = 0, k = 0; 256 > k; k++) {
        var f = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4,
            f = f >>> 8 ^ f & 255 ^ 99;
        j[n] = f;
        y[f] = n;
        var t = g[n],
            D = g[t],
            E = g[D],
            b = 257 * g[f] ^ 16843008 * f;
        z[n] = b << 24 | b >>> 8;
        A[n] = b << 16 | b >>> 16;
        B[n] = b << 8 | b >>> 24;
        C[n] = b;
        b = 16843009 * E ^ 65537 * D ^ 257 * t ^ 16843008 * n;
        s[f] = b << 24 | b >>> 8;
        u[f] = b << 16 | b >>> 16;
        v[f] = b << 8 | b >>> 24;
        w[f] = b;
        n ? (n = t ^ g[g[g[E ^ t]]],
            l ^= g[g[l]]) : n = l = 1
    }
    var F = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        r = r.AES = x.extend({
            _7: function() {
                for (var c = this._13, e = c.words, a = c.sigBytes / 4, c = 4 * ((this._26 = a + 6) + 1), b = this._32 = [], h = 0; h < c; h++)
                    if (h < a)
                        b[h] = e[h];
                    else {
                        var d = b[h - 1];
                        h % a ? 6 < a && 4 == h % a && (d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255]) : (d = d << 8 | d >>> 24,
                            d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255],
                            d ^= F[h / a | 0] << 24);
                        b[h] = b[h - a] ^ d
                    }
                e = this._34 = [];
                for (a = 0; a < c; a++)
                    h = c - a,
                    d = a % 4 ? b[h] : b[h - 4],
                    e[a] = 4 > a || 4 >= h ? d : s[j[d >>> 24]] ^ u[j[d >>> 16 & 255]] ^ v[j[d >>> 8 & 255]] ^ w[j[d & 255]]
            },
            encryptBlock: function(c, e) {
                this._6(c, e, this._32, z, A, B, C, j)
            },
            decryptBlock: function(c, e) {
                var a = c[e + 1];
                c[e + 1] = c[e + 3];
                c[e + 3] = a;
                this._6(c, e, this._34, s, u, v, w, y);
                a = c[e + 1];
                c[e + 1] = c[e + 3];
                c[e + 3] = a
            },
            _6: function(c, e, a, b, h, d, j, m) {
                for (var n = this._26, f = c[e] ^ a[0], g = c[e + 1] ^ a[1], k = c[e + 2] ^ a[2], p = c[e + 3] ^ a[3], l = 4, t = 1; t < n; t++)
                    var q = b[f >>> 24] ^ h[g >>> 16 & 255] ^ d[k >>> 8 & 255] ^ j[p & 255] ^ a[l++],
                        r = b[g >>> 24] ^ h[k >>> 16 & 255] ^ d[p >>> 8 & 255] ^ j[f & 255] ^ a[l++],
                        s = b[k >>> 24] ^ h[p >>> 16 & 255] ^ d[f >>> 8 & 255] ^ j[g & 255] ^ a[l++],
                        p = b[p >>> 24] ^ h[f >>> 16 & 255] ^ d[g >>> 8 & 255] ^ j[k & 255] ^ a[l++],
                        f = q,
                        g = r,
                        k = s;
                q = (m[f >>> 24] << 24 | m[g >>> 16 & 255] << 16 | m[k >>> 8 & 255] << 8 | m[p & 255]) ^ a[l++];
                r = (m[g >>> 24] << 24 | m[k >>> 16 & 255] << 16 | m[p >>> 8 & 255] << 8 | m[f & 255]) ^ a[l++];
                s = (m[k >>> 24] << 24 | m[p >>> 16 & 255] << 16 | m[f >>> 8 & 255] << 8 | m[g & 255]) ^ a[l++];
                p = (m[p >>> 24] << 24 | m[f >>> 16 & 255] << 16 | m[g >>> 8 & 255] << 8 | m[k & 255]) ^ a[l++];
                c[e] = q;
                c[e + 1] = r;
                c[e + 2] = s;
                c[e + 3] = p
            },
            keySize: 8
        });
    q.AES = x._5(r)
})();
(function() {
    function j(b, c) {
        var a = (this._0 >>> b ^ this._1) & c;
        this._1 ^= a;
        this._0 ^= a << b
    }

    function l(b, c) {
        var a = (this._1 >>> b ^ this._0) & c;
        this._0 ^= a;
        this._1 ^= a << b
    }
    var h = CryptoJS,
        e = h.lib,
        n = e.WordArray,
        e = e.BlockCipher,
        g = h.algo,
        q = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
        p = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
        r = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
        s = [{
            "0": 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
        }, {
            "0": 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
        }, {
            "0": 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
        }, {
            "0": 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
        }, {
            "0": 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
        }, {
            "0": 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
        }, {
            "0": 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
        }, {
            "0": 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
        }],
        t = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
        m = g.DES = e.extend({
            _7: function() {
                for (var b = this._13.words, c = [], a = 0; 56 > a; a++) {
                    var f = q[a] - 1;
                    c[a] = b[f >>> 5] >>> 31 - f % 32 & 1
                }
                b = this._25 = [];
                for (f = 0; 16 > f; f++) {
                    for (var d = b[f] = [], e = r[f], a = 0; 24 > a; a++)
                        d[a / 6 | 0] |= c[(p[a] - 1 + e) % 28] << 31 - a % 6,
                        d[4 + (a / 6 | 0)] |= c[28 + (p[a + 24] - 1 + e) % 28] << 31 - a % 6;
                    d[0] = d[0] << 1 | d[0] >>> 31;
                    for (a = 1; 7 > a; a++)
                        d[a] >>>= 4 * (a - 1) + 3;
                    d[7] = d[7] << 5 | d[7] >>> 27
                }
                c = this._28 = [];
                for (a = 0; 16 > a; a++)
                    c[a] = b[15 - a]
            },
            encryptBlock: function(b, c) {
                this._6(b, c, this._25)
            },
            decryptBlock: function(b, c) {
                this._6(b, c, this._28)
            },
            _6: function(b, c, a) {
                this._0 = b[c];
                this._1 = b[c + 1];
                j.call(this, 4, 252645135);
                j.call(this, 16, 65535);
                l.call(this, 2, 858993459);
                l.call(this, 8, 16711935);
                j.call(this, 1, 1431655765);
                for (var f = 0; 16 > f; f++) {
                    for (var d = a[f], e = this._0, h = this._1, g = 0, k = 0; 8 > k; k++)
                        g |= s[k][((h ^ d[k]) & t[k]) >>> 0];
                    this._0 = h;
                    this._1 = e ^ g
                }
                a = this._0;
                this._0 = this._1;
                this._1 = a;
                j.call(this, 1, 1431655765);
                l.call(this, 8, 16711935);
                l.call(this, 2, 858993459);
                j.call(this, 16, 65535);
                j.call(this, 4, 252645135);
                b[c] = this._0;
                b[c + 1] = this._1
            },
            keySize: 2,
            ivSize: 2,
            blockSize: 2
        });
    h.DES = e._5(m);
    g = g.TripleDES = e.extend({
        _7: function() {
            var b = this._13.words;
            this._24 = m.createEncryptor(n.create(b.slice(0, 2)));
            this._21 = m.createEncryptor(n.create(b.slice(2, 4)));
            this._22 = m.createEncryptor(n.create(b.slice(4, 6)))
        },
        encryptBlock: function(b, c) {
            this._24.encryptBlock(b, c);
            this._21.decryptBlock(b, c);
            this._22.encryptBlock(b, c)
        },
        decryptBlock: function(b, c) {
            this._22.decryptBlock(b, c);
            this._21.encryptBlock(b, c);
            this._24.decryptBlock(b, c)
        },
        keySize: 6,
        ivSize: 2,
        blockSize: 2
    });
    h.TripleDES = e._5(g)
})();
const aes_server_key = "tGFsbXNwewZlcg==";
const aes_server_iv = "w9VydmVswewexbQ==";
const aes_client_key = "WksdsdflFweFZ==";
const aes_client_iv = "klsfw9nsp=";
const des_key = "ssfefwksdjskdsj==";
const des_iv = "skzlkpoi=";
const aes_local_key = 'emhlbnFpcGFsbWtleQ==';
const aes_local_iv = 'emhlbnFpcGFsbWl2';
var BASE64 = {
    encrypt: function(text) {
        var b = new Base64();
        return b.encode(text)
    },
    decrypt: function(text) {
        var b = new Base64();
        return b.decode(text)
    }
};
var DES = {
    encrypt: function(text, key, iv) {
        var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
        var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        var result = CryptoJS.DES.encrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString()
    },
    decrypt: function(text, key, iv) {
        var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
        var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        var result = CryptoJS.DES.decrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString(CryptoJS.enc.Utf8)
    }
};
var AES = {
    encrypt: function(text, key, iv) {
        var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
        var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        var result = CryptoJS.AES.encrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString()
    },
    decrypt: function(text, key, iv) {
        var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
        var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        var result = CryptoJS.AES.decrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString(CryptoJS.enc.Utf8)
    }
};
var localStorageUtil = {
    save: function(name, value) {
        var text = JSON.stringify(value);
        text = BASE64.encrypt(text);
        text = AES.encrypt(text, aes_local_key, aes_local_iv);
        try {
            localStorage.setItem(name, text)
        } catch (oException) {
            if (oException.name === 'QuotaExceededError') {
                console.log('超出本地存储限额！');
                localStorage.clear();
                localStorage.setItem(name, text)
            }
        }
    },
    check: function(name) {
        return localStorage.getItem(name)
    },
    getValue: function(name) {
        var text = localStorage.getItem(name);
        var result = null;
        if (text) {
            text = AES.decrypt(text, aes_local_key, aes_local_iv);
            text = BASE64.decrypt(text);
            result = JSON.parse(text)
        }
        return result
    },
    remove: function(name) {
        localStorage.removeItem(name)
    }
};

function getDataFromLocalStorage(key, period) {
    if (typeof period === 'undefined') {
        period = 0
    }
    var d = DES.encrypt(key);
    d = BASE64.encrypt(key);
    var data = localStorageUtil.getValue(key);
    if (data) {
        const time = data.time;
        const current = new Date().getTime();
        if (new Date().getHours() >= 0 && new Date().getHours() < 5 && period > 1) {
            period = 1
        }
        if (current - (period * 60 * 60 * 1000) > time) {
            data = null
        }
        if (new Date().getHours() >= 5 && new Date(time).getDate() !== new Date().getDate() && period === 24) {
            data = null
        }
    }
    return data
}

function ObjectSort(obj) {
    var newObject = {};
    Object.keys(obj).sort().map(function(key) {
        newObject[key] = obj[key]
    });
    return newObject
}

function decodeData(data) {
    data = AES.decrypt(data, aes_server_key, aes_server_iv);
    data = DES.decrypt(data, des_key, des_iv);
    data = BASE64.decrypt(data);
    return data
}
var getParam = (function() {
    function ObjectSort(obj) {
        var newObject = {};
        Object.keys(obj).sort().map(function(key) {
            newObject[key] = obj[key]
        });
        return newObject
    }
    return function(method, obj) {
        var appId = '1a45f75b824b2dc628d5955356b5ef18';
        var clienttype = 'WEB';
        var timestamp = new Date().getTime();
        var param = {
            appId: appId,
            method: method,
            timestamp: timestamp,
            clienttype: clienttype,
            object: obj,
            secret: hex_md5(appId + method + timestamp + clienttype + JSON.stringify(ObjectSort(obj)))
        };
        param = BASE64.encrypt(JSON.stringify(param));
        return AES.encrypt(param, aes_client_key, aes_client_iv)
    }
})();

function getServerData(method, object, callback, period) {
    const key = hex_md5(method + JSON.stringify(object));
    const data = getDataFromLocalStorage(key, period);
    if (!data) {
        var param = getParam(method, object);
        $.ajax({
            url: '../apinew/aqistudyapi.php',
            data: {
                d: param
            },
            type: "post",
            success: function(data) {
                data = decodeData(data);
                obj = JSON.parse(data);
                if (obj.success) {
                    if (period > 0) {
                        obj.result.time = new Date().getTime();
                        localStorageUtil.save(key, obj.result)
                    }
                    callback(obj.result)
                } else {
                    console.log(obj.errcode, obj.errmsg)
                }
            }
        })
    } else {
        callback(data)
    }
}
// 用于请求具体的加密字段所需要的参数 url https://www.aqistudy.cn/apinew/aqistudyapi.php，返回·加密的text
function getparm(method, obj) {
        var appId = '1a45f75b824b2dc628d5955356b5ef18';
        var clienttype = 'WEB';
        var timestamp = new Date().getTime();
        var param = {
            appId: appId,
            method: method,
            timestamp: timestamp,
            clienttype: clienttype,
            object: obj,
            secret: hex_md5(appId + method + timestamp + clienttype + JSON.stringify(ObjectSort(obj)))
        };
        param = BASE64.encrypt(JSON.stringify(param));
        return AES.encrypt(param, aes_client_key, aes_client_iv)
    }

// d = getparm(method = "GETDATA", obj = {city: "青岛"});
// console.log(d,'\n');

function decodeData(data) {
    data = AES.decrypt(data, aes_server_key, aes_server_iv);
    data = DES.decrypt(data, des_key, des_iv);
    data = BASE64.decrypt(data);
    obj = JSON.parse(data);
// console.log(obj)
    text = JSON.stringify(obj.result);
    return text
}


// text = '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';
text = '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';
console.log(decodeData(text))