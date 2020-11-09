var navigator = {};
        function i(e, t, n) {
            null != e && ("number" == typeof e ? this.fromNumber(e, t, n) : null == t && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, t))
        }
        function r() {
            return new i(null)
        }
        function o(e, t, n, i, r, o) {
            for (; --o >= 0; ) {
                var s = t * this[e++] + n[i] + r;
                r = Math.floor(s / 67108864),
                n[i++] = 67108863 & s
            }
            return r
        }
        function s(e, t, n, i, r, o) {
            for (var s = 32767 & t, a = t >> 15; --o >= 0; ) {
                var u = 32767 & this[e]
                  , l = this[e++] >> 15
                  , c = a * u + l * s;
                u = s * u + ((32767 & c) << 15) + n[i] + (1073741823 & r),
                r = (u >>> 30) + (c >>> 15) + a * l + (r >>> 30),
                n[i++] = 1073741823 & u
            }
            return r
        }
        function a(e, t, n, i, r, o) {
            for (var s = 16383 & t, a = t >> 14; --o >= 0; ) {
                var u = 16383 & this[e]
                  , l = this[e++] >> 14
                  , c = a * u + l * s;
                u = s * u + ((16383 & c) << 14) + n[i] + r,
                r = (u >> 28) + (c >> 14) + a * l,
                n[i++] = 268435455 & u
            }
            return r
        }
        function u(e) {
            return ce.charAt(e)
        }
        function l(e, t) {
            var n = de[e.charCodeAt(t)];
            return null == n ? -1 : n
        }
        function c(e) {
            for (var t = this.t - 1; t >= 0; --t)
                e[t] = this[t];
            e.t = this.t,
            e.s = this.s
        }
        function d(e) {
            this.t = 1,
            this.s = e < 0 ? -1 : 0,
            e > 0 ? this[0] = e : e < -1 ? this[0] = e + this.DV : this.t = 0
        }
        function f(e) {
            var t = r();
            return t.fromInt(e),
            t
        }
        function p(e, t) {
            var n;
            if (16 == t)
                n = 4;
            else if (8 == t)
                n = 3;
            else if (256 == t)
                n = 8;
            else if (2 == t)
                n = 1;
            else if (32 == t)
                n = 5;
            else {
                if (4 != t)
                    return void this.fromRadix(e, t);
                n = 2
            }
            this.t = 0,
            this.s = 0;
            for (var r = e.length, o = !1, s = 0; --r >= 0; ) {
                var a = 8 == n ? 255 & e[r] : l(e, r);
                a < 0 ? "-" == e.charAt(r) && (o = !0) : (o = !1,
                0 == s ? this[this.t++] = a : s + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s,
                this[this.t++] = a >> this.DB - s) : this[this.t - 1] |= a << s,
                (s += n) >= this.DB && (s -= this.DB))
            }
            8 == n && 0 != (128 & e[0]) && (this.s = -1,
            s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)),
            this.clamp(),
            o && i.ZERO.subTo(this, this)
        }
        function h() {
            for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e; )
                --this.t
        }
        function m(e) {
            if (this.s < 0)
                return "-" + this.negate().toString(e);
            var t;
            if (16 == e)
                t = 4;
            else if (8 == e)
                t = 3;
            else if (2 == e)
                t = 1;
            else if (32 == e)
                t = 5;
            else {
                if (4 != e)
                    return this.toRadix(e);
                t = 2
            }
            var n, i = (1 << t) - 1, r = !1, o = "", s = this.t, a = this.DB - s * this.DB % t;
            if (s-- > 0)
                for (a < this.DB && (n = this[s] >> a) > 0 && (r = !0,
                o = u(n)); s >= 0; )
                    a < t ? (n = (this[s] & (1 << a) - 1) << t - a,
                    n |= this[--s] >> (a += this.DB - t)) : (n = this[s] >> (a -= t) & i,
                    a <= 0 && (a += this.DB,
                    --s)),
                    n > 0 && (r = !0),
                    r && (o += u(n));
            return r ? o : "0"
        }
        function g() {
            var e = r();
            return i.ZERO.subTo(this, e),
            e
        }
        function v() {
            return this.s < 0 ? this.negate() : this
        }
        function y(e) {
            var t = this.s - e.s;
            if (0 != t)
                return t;
            var n = this.t;
            if (0 != (t = n - e.t))
                return this.s < 0 ? -t : t;
            for (; --n >= 0; )
                if (0 != (t = this[n] - e[n]))
                    return t;
            return 0
        }
        function b(e) {
            var t, n = 1;
            return 0 != (t = e >>> 16) && (e = t,
            n += 16),
            0 != (t = e >> 8) && (e = t,
            n += 8),
            0 != (t = e >> 4) && (e = t,
            n += 4),
            0 != (t = e >> 2) && (e = t,
            n += 2),
            0 != (t = e >> 1) && (e = t,
            n += 1),
            n
        }
        function x() {
            return this.t <= 0 ? 0 : this.DB * (this.t - 1) + b(this[this.t - 1] ^ this.s & this.DM)
        }
        function w(e, t) {
            var n;
            for (n = this.t - 1; n >= 0; --n)
                t[n + e] = this[n];
            for (n = e - 1; n >= 0; --n)
                t[n] = 0;
            t.t = this.t + e,
            t.s = this.s
        }
        function C(e, t) {
            for (var n = e; n < this.t; ++n)
                t[n - e] = this[n];
            t.t = Math.max(this.t - e, 0),
            t.s = this.s
        }
        function T(e, t) {
            var n, i = e % this.DB, r = this.DB - i, o = (1 << r) - 1, s = Math.floor(e / this.DB), a = this.s << i & this.DM;
            for (n = this.t - 1; n >= 0; --n)
                t[n + s + 1] = this[n] >> r | a,
                a = (this[n] & o) << i;
            for (n = s - 1; n >= 0; --n)
                t[n] = 0;
            t[s] = a,
            t.t = this.t + s + 1,
            t.s = this.s,
            t.clamp()
        }
        function k(e, t) {
            t.s = this.s;
            var n = Math.floor(e / this.DB);
            if (n >= this.t)
                return void (t.t = 0);
            var i = e % this.DB
              , r = this.DB - i
              , o = (1 << i) - 1;
            t[0] = this[n] >> i;
            for (var s = n + 1; s < this.t; ++s)
                t[s - n - 1] |= (this[s] & o) << r,
                t[s - n] = this[s] >> i;
            i > 0 && (t[this.t - n - 1] |= (this.s & o) << r),
            t.t = this.t - n,
            t.clamp()
        }
        function E(e, t) {
            for (var n = 0, i = 0, r = Math.min(e.t, this.t); n < r; )
                i += this[n] - e[n],
                t[n++] = i & this.DM,
                i >>= this.DB;
            if (e.t < this.t) {
                for (i -= e.s; n < this.t; )
                    i += this[n],
                    t[n++] = i & this.DM,
                    i >>= this.DB;
                i += this.s
            } else {
                for (i += this.s; n < e.t; )
                    i -= e[n],
                    t[n++] = i & this.DM,
                    i >>= this.DB;
                i -= e.s
            }
            t.s = i < 0 ? -1 : 0,
            i < -1 ? t[n++] = this.DV + i : i > 0 && (t[n++] = i),
            t.t = n,
            t.clamp()
        }
        function S(e, t) {
            var n = this.abs()
              , r = e.abs()
              , o = n.t;
            for (t.t = o + r.t; --o >= 0; )
                t[o] = 0;
            for (o = 0; o < r.t; ++o)
                t[o + n.t] = n.am(0, r[o], t, o, 0, n.t);
            t.s = 0,
            t.clamp(),
            this.s != e.s && i.ZERO.subTo(t, t)
        }
        function N(e) {
            for (var t = this.abs(), n = e.t = 2 * t.t; --n >= 0; )
                e[n] = 0;
            for (n = 0; n < t.t - 1; ++n) {
                var i = t.am(n, t[n], e, 2 * n, 0, 1);
                (e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, i, t.t - n - 1)) >= t.DV && (e[n + t.t] -= t.DV,
                e[n + t.t + 1] = 1)
            }
            e.t > 0 && (e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1)),
            e.s = 0,
            e.clamp()
        }
        function D(e, t, n) {
            var o = e.abs();
            if (!(o.t <= 0)) {
                var s = this.abs();
                if (s.t < o.t)
                    return null != t && t.fromInt(0),
                    void (null != n && this.copyTo(n));
                null == n && (n = r());
                var a = r()
                  , u = this.s
                  , l = e.s
                  , c = this.DB - b(o[o.t - 1]);
                c > 0 ? (o.lShiftTo(c, a),
                s.lShiftTo(c, n)) : (o.copyTo(a),
                s.copyTo(n));
                var d = a.t
                  , f = a[d - 1];
                if (0 != f) {
                    var p = f * (1 << this.F1) + (d > 1 ? a[d - 2] >> this.F2 : 0)
                      , h = this.FV / p
                      , m = (1 << this.F1) / p
                      , g = 1 << this.F2
                      , v = n.t
                      , y = v - d
                      , x = null == t ? r() : t;
                    for (a.dlShiftTo(y, x),
                    n.compareTo(x) >= 0 && (n[n.t++] = 1,
                    n.subTo(x, n)),
                    i.ONE.dlShiftTo(d, x),
                    x.subTo(a, a); a.t < d; )
                        a[a.t++] = 0;
                    for (; --y >= 0; ) {
                        var w = n[--v] == f ? this.DM : Math.floor(n[v] * h + (n[v - 1] + g) * m);
                        if ((n[v] += a.am(0, w, n, y, 0, d)) < w)
                            for (a.dlShiftTo(y, x),
                            n.subTo(x, n); n[v] < --w; )
                                n.subTo(x, n)
                    }
                    null != t && (n.drShiftTo(d, t),
                    u != l && i.ZERO.subTo(t, t)),
                    n.t = d,
                    n.clamp(),
                    c > 0 && n.rShiftTo(c, n),
                    u < 0 && i.ZERO.subTo(n, n)
                }
            }
        }
        function j(e) {
            var t = r();
            return this.abs().divRemTo(e, null, t),
            this.s < 0 && t.compareTo(i.ZERO) > 0 && e.subTo(t, t),
            t
        }
        function A(e) {
            this.m = e
        }
        function _(e) {
            return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e
        }
        function L(e) {
            return e
        }
        function q(e) {
            e.divRemTo(this.m, null, e)
        }
        function H(e, t, n) {
            e.multiplyTo(t, n),
            this.reduce(n)
        }
        function M(e, t) {
            e.squareTo(t),
            this.reduce(t)
        }
        function O() {
            if (this.t < 1)
                return 0;
            var e = this[0];
            if (0 == (1 & e))
                return 0;
            var t = 3 & e;
            return t = t * (2 - (15 & e) * t) & 15,
            t = t * (2 - (255 & e) * t) & 255,
            t = t * (2 - ((65535 & e) * t & 65535)) & 65535,
            t = t * (2 - e * t % this.DV) % this.DV,
            t > 0 ? this.DV - t : -t
        }
        function I(e) {
            this.m = e,
            this.mp = e.invDigit(),
            this.mpl = 32767 & this.mp,
            this.mph = this.mp >> 15,
            this.um = (1 << e.DB - 15) - 1,
            this.mt2 = 2 * e.t
        }
        function B(e) {
            var t = r();
            return e.abs().dlShiftTo(this.m.t, t),
            t.divRemTo(this.m, null, t),
            e.s < 0 && t.compareTo(i.ZERO) > 0 && this.m.subTo(t, t),
            t
        }
        function P(e) {
            var t = r();
            return e.copyTo(t),
            this.reduce(t),
            t
        }
        function R(e) {
            for (; e.t <= this.mt2; )
                e[e.t++] = 0;
            for (var t = 0; t < this.m.t; ++t) {
                var n = 32767 & e[t]
                  , i = n * this.mpl + ((n * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
                for (n = t + this.m.t,
                e[n] += this.m.am(0, i, e, t, 0, this.m.t); e[n] >= e.DV; )
                    e[n] -= e.DV,
                    e[++n]++
            }
            e.clamp(),
            e.drShiftTo(this.m.t, e),
            e.compareTo(this.m) >= 0 && e.subTo(this.m, e)
        }
        function F(e, t) {
            e.squareTo(t),
            this.reduce(t)
        }
        function W(e, t, n) {
            e.multiplyTo(t, n),
            this.reduce(n)
        }
        function $() {
            return 0 == (this.t > 0 ? 1 & this[0] : this.s)
        }
        function z(e, t) {
            if (e > 4294967295 || e < 1)
                return i.ONE;
            var n = r()
              , o = r()
              , s = t.convert(this)
              , a = b(e) - 1;
            for (s.copyTo(n); --a >= 0; )
                if (t.sqrTo(n, o),
                (e & 1 << a) > 0)
                    t.mulTo(o, s, n);
                else {
                    var u = n;
                    n = o,
                    o = u
                }
            return t.revert(n)
        }
        function U(e, t) {
            var n;
            return n = e < 256 || t.isEven() ? new A(t) : new I(t),
            this.exp(e, n)
        }
        function X() {
            this.i = 0,
            this.j = 0,
            this.S = new Array
        }
        function V(e) {
            var t, n, i;
            for (t = 0; t < 256; ++t)
                this.S[t] = t;
            for (n = 0,
            t = 0; t < 256; ++t)
                n = n + this.S[t] + e[t % e.length] & 255,
                i = this.S[t],
                this.S[t] = this.S[n],
                this.S[n] = i;
            this.i = 0,
            this.j = 0
        }
        function J() {
            var e;
            return this.i = this.i + 1 & 255,
            this.j = this.j + this.S[this.i] & 255,
            e = this.S[this.i],
            this.S[this.i] = this.S[this.j],
            this.S[this.j] = e,
            this.S[e + this.S[this.i] & 255]
        }
        function Z() {
            return new X
        }
        function G(e) {
            pe[he++] ^= 255 & e,
            pe[he++] ^= e >> 8 & 255,
            pe[he++] ^= e >> 16 & 255,
            pe[he++] ^= e >> 24 & 255,
            he >= me && (he -= me)
        }
        function Y() {
            G((new Date).getTime())
        }
        function Q() {
            if (null == fe) {
                for (Y(),
                fe = Z(),
                fe.init(pe),
                he = 0; he < pe.length; ++he)
                    pe[he] = 0;
                he = 0
            }
            return fe.next()
        }
        function K(e) {
            var t;
            for (t = 0; t < e.length; ++t)
                e[t] = Q()
        }
        function ee() {}
        function te(e, t) {
            return new i(e,t)
        }
        function ne(e, t) {
            if (t < e.length + 11)
                return alert("Message too long for RSA"),
                null;
            for (var n = new Array, r = e.length - 1; r >= 0 && t > 0; ) {
                var o = e.charCodeAt(r--);
                o < 128 ? n[--t] = o : o > 127 && o < 2048 ? (n[--t] = 63 & o | 128,
                n[--t] = o >> 6 | 192) : (n[--t] = 63 & o | 128,
                n[--t] = o >> 6 & 63 | 128,
                n[--t] = o >> 12 | 224)
            }
            n[--t] = 0;
            for (var s = new ee, a = new Array; t > 2; ) {
                for (a[0] = 0; 0 == a[0]; )
                    s.nextBytes(a);
                n[--t] = a[0]
            }
            return n[--t] = 2,
            n[--t] = 0,
            new i(n)
        }
        function ie() {
            this.n = null,
            this.e = 0,
            this.d = null,
            this.p = null,
            this.q = null,
            this.dmp1 = null,
            this.dmq1 = null,
            this.coeff = null
        }
        function re(e, t) {
            null != e && null != t && e.length > 0 && t.length > 0 ? (this.n = te(e, 16),
            this.e = parseInt(t, 16)) : alert("Invalid RSA public key")
        }
        function oe(e) {
            return e.modPowInt(this.e, this.n)
        }
        function se(e) {
            var t = ne(e, this.n.bitLength() + 7 >> 3);
            if (null == t)
                return null;
            var n = this.doPublic(t);
            if (null == n)
                return null;
            var i = n.toString(16);
            return 0 == (1 & i.length) ? i : "0" + i
        }
        var ae;
        "Microsoft Internet Explorer" == navigator.appName ? (i.prototype.am = s,
        ae = 30) : "Netscape" != navigator.appName ? (i.prototype.am = o,
        ae = 26) : (i.prototype.am = a,
        ae = 28),
        i.prototype.DB = ae,
        i.prototype.DM = (1 << ae) - 1,
        i.prototype.DV = 1 << ae;
        i.prototype.FV = Math.pow(2, 52),
        i.prototype.F1 = 52 - ae,
        i.prototype.F2 = 2 * ae - 52;
        var ue, le, ce = "0123456789abcdefghijklmnopqrstuvwxyz", de = new Array;
        for (ue = "0".charCodeAt(0),
        le = 0; le <= 9; ++le)
            de[ue++] = le;
        for (ue = "a".charCodeAt(0),
        le = 10; le < 36; ++le)
            de[ue++] = le;
        for (ue = "A".charCodeAt(0),
        le = 10; le < 36; ++le)
            de[ue++] = le;
        A.prototype.convert = _,
        A.prototype.revert = L,
        A.prototype.reduce = q,
        A.prototype.mulTo = H,
        A.prototype.sqrTo = M,
        I.prototype.convert = B,
        I.prototype.revert = P,
        I.prototype.reduce = R,
        I.prototype.mulTo = W,
        I.prototype.sqrTo = F,
        i.prototype.copyTo = c,
        i.prototype.fromInt = d,
        i.prototype.fromString = p,
        i.prototype.clamp = h,
        i.prototype.dlShiftTo = w,
        i.prototype.drShiftTo = C,
        i.prototype.lShiftTo = T,
        i.prototype.rShiftTo = k,
        i.prototype.subTo = E,
        i.prototype.multiplyTo = S,
        i.prototype.squareTo = N,
        i.prototype.divRemTo = D,
        i.prototype.invDigit = O,
        i.prototype.isEven = $,
        i.prototype.exp = z,
        i.prototype.toString = m,
        i.prototype.negate = g,
        i.prototype.abs = v,
        i.prototype.compareTo = y,
        i.prototype.bitLength = x,
        i.prototype.mod = j,
        i.prototype.modPowInt = U,
        i.ZERO = f(0),
        i.ONE = f(1),
        X.prototype.init = V,
        X.prototype.next = J;
        var fe, pe, he, me = 256;
        if (null == pe) {
            pe = new Array,
            he = 0;
            var ge;
            if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto) {
                var ve = window.crypto.random(32);
                for (ge = 0; ge < ve.length; ++ge)
                    pe[he++] = 255 & ve.charCodeAt(ge)
            }
            for (; he < me; )
                ge = Math.floor(65536 * Math.random()),
                pe[he++] = ge >>> 8,
                pe[he++] = 255 & ge;
            he = 0,
            Y()
        }
        ee.prototype.nextBytes = K,
        ie.prototype.doPublic = oe,
        ie.prototype.setPublic = re,
        ie.prototype.encrypt = se;
        var ye = new ie;
        ye.setPublic("f526533dec83f07c038684e84301ab64eb6c1ee5b0a6d58220b8ee0d5f43ede2a1c01995aaf4160b7b5e9979e6d16181d3d973e9d08d712d9113a1a384267eb93fd35435e671e25a2a8acd98c714719bf0bf2c3a2fbcc1282a8f49dfdf275870b6b1c896f27a3b4f450134f30e97e842c44adf3c4de15ec495a91734ffa91269", "010001");

          var  rsa = function(e) {
                return ye.encrypt(e)
            }
        
console.log(rsa('111111'))