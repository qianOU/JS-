function m(e) {
            var t = {
                outputUpper: !1,
                b64Pad: "=",
                shakeLen: -1
            };
            if (e = e || {},
            t.outputUpper = e.outputUpper || !1,
            !0 === e.hasOwnProperty("b64Pad") && (t.b64Pad = e.b64Pad),
            !0 === e.hasOwnProperty("shakeLen")) {
                if (0 != e.shakeLen % 8)
                    throw Error("shakeLen must be a multiple of 8");
                t.shakeLen = e.shakeLen
            }
            if ("boolean" != typeof t.outputUpper)
                throw Error("Invalid outputUpper formatting option");
            if ("string" != typeof t.b64Pad)
                throw Error("Invalid b64Pad formatting option");
            return t
        }
function v(e, t) {
            var n;
            switch (t) {
            case "UTF8":
            case "UTF16BE":
            case "UTF16LE":
                break;
            default:
                throw Error("encoding must be UTF8, UTF16BE, or UTF16LE")
            }
            switch (e) {
            case "HEX":
                n = s;
                break;
            case "TEXT":
                n = function(e, n, r) {
                    var a, i, o, s, c, u = [], l = [], d = 0;
                    u = n || [0];
                    if (o = (n = r || 0) >>> 3,
                    "UTF8" === t)
                        for (a = 0; a < e.length; a += 1)
                            for (l = [],
                            128 > (r = e.charCodeAt(a)) ? l.push(r) : 2048 > r ? (l.push(192 | r >>> 6),
                            l.push(128 | 63 & r)) : 55296 > r || 57344 <= r ? l.push(224 | r >>> 12, 128 | r >>> 6 & 63, 128 | 63 & r) : (a += 1,
                            r = 65536 + ((1023 & r) << 10 | 1023 & e.charCodeAt(a)),
                            l.push(240 | r >>> 18, 128 | r >>> 12 & 63, 128 | r >>> 6 & 63, 128 | 63 & r)),
                            i = 0; i < l.length; i += 1) {
                                for (s = (c = d + o) >>> 2; u.length <= s; )
                                    u.push(0);
                                u[s] |= l[i] << 8 * (3 - c % 4),
                                d += 1
                            }
                    else if ("UTF16BE" === t || "UTF16LE" === t)
                        for (a = 0; a < e.length; a += 1) {
                            for (r = e.charCodeAt(a),
                            "UTF16LE" === t && (r = (i = 255 & r) << 8 | r >>> 8),
                            s = (c = d + o) >>> 2; u.length <= s; )
                                u.push(0);
                            u[s] |= r << 8 * (2 - c % 4),
                            d += 2
                        }
                    return {
                        value: u,
                        binLen: 8 * d + n
                    }
                }
                ;
                break;
            case "B64":
                n = u;
                break;
            case "BYTES":
                n = c;
                break;
            case "ARRAYBUFFER":
                try {
                    n = new ArrayBuffer(0)
                } catch (e) {
                    throw Error("ARRAYBUFFER not supported by this environment")
                }
                n = l;
                break;
            default:
                throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER")
            }
            return n
        }
function D(e, t, n, r, a) {
            var i = (65535 & e) + (65535 & t) + (65535 & n) + (65535 & r) + (65535 & a);
            return ((e >>> 16) + (t >>> 16) + (n >>> 16) + (r >>> 16) + (a >>> 16) + (i >>> 16) & 65535) << 16 | 65535 & i
        }
  function g(e, t) {
            return e << t | e >>> 32 - t
        }
  function T(e, t, n) {
            return e & t ^ e & n ^ t & n
        }
  function R(e, t) {
            var n = (65535 & e) + (65535 & t);
            return ((e >>> 16) + (t >>> 16) + (n >>> 16) & 65535) << 16 | 65535 & n
        }
function G(e, t) {
            var n, r, a, i, o, s, c, u = [];
            for (n = t[0],
            r = t[1],
            a = t[2],
            i = t[3],
            o = t[4],
            c = 0; 80 > c; c += 1)
                u[c] = 16 > c ? e[c] : g(u[c - 3] ^ u[c - 8] ^ u[c - 14] ^ u[c - 16], 1),
                s = 20 > c ? D(g(n, 5), r & a ^ ~r & i, o, 1518500249, u[c]) : 40 > c ? D(g(n, 5), r ^ a ^ i, o, 1859775393, u[c]) : 60 > c ? D(g(n, 5), T(r, a, i), o, 2400959708, u[c]) : D(g(n, 5), r ^ a ^ i, o, 3395469782, u[c]),
                o = i,
                i = a,
                a = g(r, 30),
                r = n,
                n = s;
            return t[0] = R(n, t[0]),
            t[1] = R(r, t[1]),
            t[2] = R(a, t[2]),
            t[3] = R(i, t[3]),
            t[4] = R(o, t[4]),
            t
        }
        function H(e, t, n, r) {
            var a;
            for (a = 15 + (t + 65 >>> 9 << 4); e.length <= a; )
                e.push(0);
            for (e[t >>> 5] |= 128 << 24 - t % 32,
            t += n,
            e[a] = 4294967295 & t,
            e[a - 1] = t / 4294967296 | 0,
            t = e.length,
            a = 0; a < t; a += 16)
                r = G(e.slice(a, a + 16), r);
            return r
        }
        function q(e, t, n) {
            var r, a, i, s, c, u, l, d, f, p, h, m, v, g, b, y, E, O, F, z, G, H, q, V = [];
            if ("SHA-224" === n || "SHA-256" === n)
                p = 64,
                m = 1,
                H = Number,
                v = R,
                g = M,
                b = D,
                y = k,
                E = N,
                O = C,
                F = j,
                G = T,
                z = w,
                q = W;
            else {
                if ("SHA-384" !== n && "SHA-512" !== n)
                    throw Error("Unexpected error in SHA-2 implementation");
                p = 80,
                m = 2,
                H = o,
                v = L,
                g = U,
                b = B,
                y = x,
                E = P,
                O = S,
                F = I,
                G = A,
                z = _,
                q = Q
            }
            for (n = t[0],
            r = t[1],
            a = t[2],
            i = t[3],
            s = t[4],
            c = t[5],
            u = t[6],
            l = t[7],
            h = 0; h < p; h += 1)
                16 > h ? (f = h * m,
                d = e.length <= f ? 0 : e[f],
                f = e.length <= f + 1 ? 0 : e[f + 1],
                V[h] = new H(d,f)) : V[h] = g(E(V[h - 2]), V[h - 7], y(V[h - 15]), V[h - 16]),
                d = b(l, F(s), z(s, c, u), q[h], V[h]),
                f = v(O(n), G(n, r, a)),
                l = u,
                u = c,
                c = s,
                s = v(i, d),
                i = a,
                a = r,
                r = n,
                n = v(d, f);
            return t[0] = v(n, t[0]),
            t[1] = v(r, t[1]),
            t[2] = v(a, t[2]),
            t[3] = v(i, t[3]),
            t[4] = v(s, t[4]),
            t[5] = v(c, t[5]),
            t[6] = v(u, t[6]),
            t[7] = v(l, t[7]),
            t
        }
        function V(e, t) {
            var n, r, a, i, s = [], c = [];
            if (null !== e)
                for (r = 0; r < e.length; r += 2)
                    t[(r >>> 1) % 5][(r >>> 1) / 5 | 0] = F(t[(r >>> 1) % 5][(r >>> 1) / 5 | 0], new o((255 & e[r + 1]) << 24 | (65280 & e[r + 1]) << 8 | (16711680 & e[r + 1]) >>> 8 | e[r + 1] >>> 24,(255 & e[r]) << 24 | (65280 & e[r]) << 8 | (16711680 & e[r]) >>> 8 | e[r] >>> 24));
            for (n = 0; 24 > n; n += 1) {
                for (i = z("SHA3-"),
                r = 0; 5 > r; r += 1)
                    s[r] = F(t[r][0], t[r][1], t[r][2], t[r][3], t[r][4]);
                for (r = 0; 5 > r; r += 1)
                    c[r] = F(s[(r + 4) % 5], b(s[(r + 1) % 5], 1));
                for (r = 0; 5 > r; r += 1)
                    for (a = 0; 5 > a; a += 1)
                        t[r][a] = F(t[r][a], c[r]);
                for (r = 0; 5 > r; r += 1)
                    for (a = 0; 5 > a; a += 1)
                        i[a][(2 * r + 3 * a) % 5] = b(t[r][a], Y[r][a]);
                for (r = 0; 5 > r; r += 1)
                    for (a = 0; 5 > a; a += 1)
                        t[r][a] = F(i[r][a], new o(~i[(r + 1) % 5][a].a & i[(r + 2) % 5][a].a,~i[(r + 1) % 5][a].b & i[(r + 2) % 5][a].b));
                t[0][0] = F(t[0][0], K[n])
            }
            return t
        }



function z(e) {
            var t, n = [];
            if ("SHA-1" === e)
                n = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
            else if (0 === e.lastIndexOf("SHA-", 0))
                switch (n = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428],
                t = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
                e) {
                case "SHA-224":
                    break;
                case "SHA-256":
                    n = t;
                    break;
                case "SHA-384":
                    n = [new o(3418070365,n[0]), new o(1654270250,n[1]), new o(2438529370,n[2]), new o(355462360,n[3]), new o(1731405415,n[4]), new o(41048885895,n[5]), new o(3675008525,n[6]), new o(1203062813,n[7])];
                    break;
                case "SHA-512":
                    n = [new o(t[0],4089235720), new o(t[1],2227873595), new o(t[2],4271175723), new o(t[3],1595750129), new o(t[4],2917565137), new o(t[5],725511199), new o(t[6],4215389547), new o(t[7],327033209)];
                    break;
                default:
                    throw Error("Unknown SHA variant")
                }
            else {
                if (0 !== e.lastIndexOf("SHA3-", 0) && 0 !== e.lastIndexOf("SHAKE", 0))
                    throw Error("No SHA variants supported");
                for (e = 0; 5 > e; e += 1)
                    n[e] = [new o(0,0), new o(0,0), new o(0,0), new o(0,0), new o(0,0)]
            }
            return n
        }


function i(e,t,n){
            var r, a, i, o, s, c, u, l, g, b = 0, y = [], E = 0, O = !1, w = [], _ = [], T = !1, A = !1;
            if (r = (n = n || {}).encoding || "UTF8",
            g = n.numRounds || 1,
            i = v(t, r),
            g !== parseInt(g, 10) || 1 > g)
                throw Error("numRounds must a integer >= 1");
            if ("SHA-1" === e)
                s = 512,
                c = G,
                u = H,
                o = 160,
                l = function(e) {
                    return e.slice()
                }
                ;
            else if (0 === e.lastIndexOf("SHA-", 0))
                if (c = function(t, n) {
                    return q(t, n, e)
                }
                ,
                u = function(t, n, r, a) {
                    var i, o;
                    if ("SHA-224" === e || "SHA-256" === e)
                        i = 15 + (n + 65 >>> 9 << 4),
                        o = 16;
                    else {
                        if ("SHA-384" !== e && "SHA-512" !== e)
                            throw Error("Unexpected error in SHA-2 implementation");
                        i = 31 + (n + 129 >>> 10 << 5),
                        o = 32
                    }
                    for (; t.length <= i; )
                        t.push(0);
                    for (t[n >>> 5] |= 128 << 24 - n % 32,
                    n += r,
                    t[i] = 4294967295 & n,
                    t[i - 1] = n / 4294967296 | 0,
                    r = t.length,
                    n = 0; n < r; n += o)
                        a = q(t.slice(n, n + o), a, e);
                    if ("SHA-224" === e)
                        t = [a[0], a[1], a[2], a[3], a[4], a[5], a[6]];
                    else if ("SHA-256" === e)
                        t = a;
                    else if ("SHA-384" === e)
                        t = [a[0].a, a[0].b, a[1].a, a[1].b, a[2].a, a[2].b, a[3].a, a[3].b, a[4].a, a[4].b, a[5].a, a[5].b];
                    else {
                        if ("SHA-512" !== e)
                            throw Error("Unexpected error in SHA-2 implementation");
                        t = [a[0].a, a[0].b, a[1].a, a[1].b, a[2].a, a[2].b, a[3].a, a[3].b, a[4].a, a[4].b, a[5].a, a[5].b, a[6].a, a[6].b, a[7].a, a[7].b]
                    }
                    return t
                }
                ,
                l = function(e) {
                    return e.slice()
                }
                ,
                "SHA-224" === e)
                    s = 512,
                    o = 224;
                else if ("SHA-256" === e)
                    s = 512,
                    o = 256;
                else if ("SHA-384" === e)
                    s = 1024,
                    o = 384;
                else {
                    if ("SHA-512" !== e)
                        throw Error("Chosen SHA variant is not supported");
                    s = 1024,
                    o = 512
                }
            else {
                if (0 !== e.lastIndexOf("SHA3-", 0) && 0 !== e.lastIndexOf("SHAKE", 0))
                    throw Error("Chosen SHA variant is not supported");
                var C = 6;
                if (c = V,
                l = function(e) {
                    var t, n = [];
                    for (t = 0; 5 > t; t += 1)
                        n[t] = e[t].slice();
                    return n
                }
                ,
                "SHA3-224" === e)
                    s = 1152,
                    o = 224;
                else if ("SHA3-256" === e)
                    s = 1088,
                    o = 256;
                else if ("SHA3-384" === e)
                    s = 832,
                    o = 384;
                else if ("SHA3-512" === e)
                    s = 576,
                    o = 512;
                else if ("SHAKE128" === e)
                    s = 1344,
                    o = -1,
                    C = 31,
                    A = !0;
                else {
                    if ("SHAKE256" !== e)
                        throw Error("Chosen SHA variant is not supported");
                    s = 1088,
                    o = -1,
                    C = 31,
                    A = !0
                }
                u = function(e, t, n, r, a) {
                    var i, o = C, c = [], u = (n = s) >>> 5, l = 0, d = t >>> 5;
                    for (i = 0; i < d && t >= n; i += u)
                        r = V(e.slice(i, i + u), r),
                        t -= n;
                    for (e = e.slice(i),
                    t %= n; e.length < u; )
                        e.push(0);
                    for (e[(i = t >>> 3) >> 2] ^= o << 24 - i % 4 * 8,
                    e[u - 1] ^= 128,
                    r = V(e, r); 32 * c.length < a && (e = r[l % 5][l / 5 | 0],
                    c.push((255 & e.b) << 24 | (65280 & e.b) << 8 | (16711680 & e.b) >> 8 | e.b >>> 24),
                    !(32 * c.length >= a)); )
                        c.push((255 & e.a) << 24 | (65280 & e.a) << 8 | (16711680 & e.a) >> 8 | e.a >>> 24),
                        0 == 64 * (l += 1) % n && V(null, r);
                    return c
                }
            }
            a = z(e),
            this.setHMACKey = function(t, n, i) {
                var l;
                if (!0 === O)
                    throw Error("HMAC key already set");
                if (!0 === T)
                    throw Error("Cannot set HMAC key after calling update");
                if (!0 === A)
                    throw Error("SHAKE is not supported for HMAC");
                if (t = (n = v(n, r = (i || {}).encoding || "UTF8")(t)).binLen,
                n = n.value,
                i = (l = s >>> 3) / 4 - 1,
                l < t / 8) {
                    for (n = u(n, t, 0, z(e), o); n.length <= i; )
                        n.push(0);
                    n[i] &= 4294967040
                } else if (l > t / 8) {
                    for (; n.length <= i; )
                        n.push(0);
                    n[i] &= 4294967040
                }
                for (t = 0; t <= i; t += 1)
                    w[t] = 909522486 ^ n[t],
                    _[t] = 1549556828 ^ n[t];
                a = c(w, a),
                b = s,
                O = !0
            }
            ,
            this.update = function(e) {
                var t, n, r, o = 0, u = s >>> 5;
                for (e = (t = i(e, y, E)).binLen,
                n = t.value,
                t = e >>> 5,
                r = 0; r < t; r += u)
                    o + s <= e && (a = c(n.slice(r, r + u), a),
                    o += s);
                b += o,
                y = n.slice(o >>> 5),
                E = e % s,
                T = !0
            }
            ,
            this.getHash = function(t, n) {
                var r, i, s, c;
                if (!0 === O)
                    throw Error("Cannot call getHash after setting HMAC key");
                if (s = m(n),
                !0 === A) {
                    if (-1 === s.shakeLen)
                        throw Error("shakeLen must be specified in options");
                    o = s.shakeLen
                }
                switch (t) {
                case "HEX":
                    r = function(e) {
                        return d(e, o, s)
                    }
                    ;
                    break;
                case "B64":
                    r = function(e) {
                        return f(e, o, s)
                    }
                    ;
                    break;
                case "BYTES":
                    r = function(e) {
                        return p(e, o)
                    }
                    ;
                    break;
                case "ARRAYBUFFER":
                    try {
                        i = new ArrayBuffer(0)
                    } catch (e) {
                        throw Error("ARRAYBUFFER not supported by this environment")
                    }
                    r = function(e) {
                        return h(e, o)
                    }
                    ;
                    break;
                default:
                    throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER")
                }
                for (c = u(y.slice(), E, b, l(a), o),
                i = 1; i < g; i += 1)
                    !0 === A && 0 != o % 32 && (c[c.length - 1] &= 4294967040 << 24 - o % 32),
                    c = u(c, o, 0, z(e), o);
                return r(c)
            }
            ,
            this.getHMAC = function(t, n) {
                var r, i, v, g;
                if (!1 === O)
                    throw Error("Cannot call getHMAC without first setting HMAC key");
                switch (v = m(n),
                t) {
                case "HEX":
                    r = function(e) {
                        return d(e, o, v)
                    }
                    ;
                    break;
                case "B64":
                    r = function(e) {
                        return f(e, o, v)
                    }
                    ;
                    break;
                case "BYTES":
                    r = function(e) {
                        return p(e, o)
                    }
                    ;
                    break;
                case "ARRAYBUFFER":
                    try {
                        r = new ArrayBuffer(0)
                    } catch (e) {
                        throw Error("ARRAYBUFFER not supported by this environment")
                    }
                    r = function(e) {
                        return h(e, o)
                    }
                    ;
                    break;
                default:
                    throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")
                }
                return i = u(y.slice(), E, b, l(a), o),
                g = c(_, z(e)),
                r(g = u(i, o, s, g, o))
            }
        }

t = {captcha: "vxyh",
lang: "en",
password: "111111111",
refSource: "other_https://www.zhihu.com/signin?next=%2F",
username: "+8613262523878",
utmSource: undefined
};

        function d(e, t, n) {
            var r, a, i = "";
            for (t /= 8,
            r = 0; r < t; r += 1)
                a = e[r >>> 2] >>> 8 * (3 - r % 4),
                i += "0123456789abcdef".charAt(a >>> 4 & 15) + "0123456789abcdef".charAt(15 & a);
            return n.outputUpper ? i.toUpperCase() : i
        }
function test(e,o){
var n = Date.now()
          , r = new i("SHA-1","TEXT");
        return r.setHMACKey("d1b964811afb40118a12068ff74a12f4", "TEXT"),
        r.update(e),
        r.update(o),
        r.update("com.zhihu.web"),
        r.update(String(n)),
        Object.assign({
            clientId: e,
            grantType: o,
            timestamp: n,
            source: "com.zhihu.web",
            signature: r.getHMAC("HEX")
        }, t)
}
console.log(test("c3cef7c66a1843f8b3a9e6a1e3160e20","password"));