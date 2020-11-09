var algorithm = (function () {
    var SNRSA = (function () {
        var rsaFonts = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var rsaFontArray = rsaFonts.split("");

        function BigInteger(a, b, c) {
            if (a != null)
                if ("number" == typeof a) this.fromNumber(a, b, c);
                else if (b == null && "string" != typeof a) this.fromString(a, 256);
            else this.fromString(a, b);
        }

        function nbi() {
            return new BigInteger(null);
        }

        function am1(i, x, w, j, c, n) {
            while (--n >= 0) {
                var v = x * this[i++] + w[j] + c;
                c = Math.floor(v / 0x4000000);
                w[j++] = v & 0x3ffffff;
            }
            return c;
        }

        function am2(i, x, w, j, c, n) {
            var xl = x & 0x7fff,
                xh = x >> 15;
            while (--n >= 0) {
                var l = this[i] & 0x7fff;
                var h = this[i++] >> 15;
                var m = xh * l + h * xl;
                l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
                c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
                w[j++] = l & 0x3fffffff;
            }
            return c;
        }

        function am3(i, x, w, j, c, n) {
            var xl = x & 0x3fff,
                xh = x >> 14;
            while (--n >= 0) {
                var l = this[i] & 0x3fff;
                var h = this[i++] >> 14;
                var m = xh * l + h * xl;
                l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
                c = (l >> 28) + (m >> 14) + xh * h;
                w[j++] = l & 0xfffffff;
            }
            return c;
        }

        BigInteger.prototype.am = am1;
        var dbits = 26;


        BigInteger.prototype.DB = dbits;
        BigInteger.prototype.DM = ((1 << dbits) - 1);
        BigInteger.prototype.DV = (1 << dbits);

        var BI_FP = 52;
        BigInteger.prototype.FV = Math.pow(2, BI_FP);
        BigInteger.prototype.F1 = BI_FP - dbits;
        BigInteger.prototype.F2 = 2 * dbits - BI_FP;


        var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
        var BI_RC = new Array();
        var rr, vv;
        rr = "0".charCodeAt(0);
        for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
        rr = "a".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
        rr = "A".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

        function int2char(n) {
            return BI_RM.charAt(n);
        }

        function intAt(s, i) {
            var c = BI_RC[s.charCodeAt(i)];
            return (c == null) ? -1 : c;
        }


        function bnpCopyTo(r) {
            for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
            r.t = this.t;
            r.s = this.s;
        }


        function bnpFromInt(x) {
            this.t = 1;
            this.s = (x < 0) ? -1 : 0;
            if (x > 0) this[0] = x;
            else if (x < -1) this[0] = x + DV;
            else this.t = 0;
        }


        function nbv(i) {
            var r = nbi();
            r.fromInt(i);
            return r;
        }


        function bnpFromString(s, b) {
            var k;
            if (b == 16) k = 4;
            else if (b == 8) k = 3;
            else if (b == 256) k = 8;
            else if (b == 2) k = 1;
            else if (b == 32) k = 5;
            else if (b == 4) k = 2;
            else {
                this.fromRadix(s, b);
                return;
            }
            this.t = 0;
            this.s = 0;
            var i = s.length,
                mi = false,
                sh = 0;
            while (--i >= 0) {
                var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-") mi = true;
                    continue;
                }
                mi = false;
                if (sh == 0)
                    this[this.t++] = x;
                else if (sh + k > this.DB) {
                    this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                    this[this.t++] = (x >> (this.DB - sh));
                } else
                    this[this.t - 1] |= x << sh;
                sh += k;
                if (sh >= this.DB) sh -= this.DB;
            }
            if (k == 8 && (s[0] & 0x80) != 0) {
                this.s = -1;
                if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
            this.clamp();
            if (mi) BigInteger.ZERO.subTo(this, this);
        }


        function bnpClamp() {
            var c = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == c) --this.t;
        }


        function bnToString(b) {
            if (this.s < 0) return "-" + this.negate().toString(b);
            var k;
            if (b == 16) k = 4;
            else if (b == 8) k = 3;
            else if (b == 2) k = 1;
            else if (b == 32) k = 5;
            else if (b == 4) k = 2;
            else return this.toRadix(b);
            var km = (1 << k) - 1,
                d, m = false,
                r = "",
                i = this.t;
            var p = this.DB - (i * this.DB) % k;
            if (i-- > 0) {
                if (p < this.DB && (d = this[i] >> p) > 0) {
                    m = true;
                    r = int2char(d);
                }
                while (i >= 0) {
                    if (p < k) {
                        d = (this[i] & ((1 << p) - 1)) << (k - p);
                        d |= this[--i] >> (p += this.DB - k);
                    } else {
                        d = (this[i] >> (p -= k)) & km;
                        if (p <= 0) {
                            p += this.DB;
                            --i;
                        }
                    }
                    if (d > 0) m = true;
                    if (m) r += int2char(d);
                }
            }
            return m ? r : "0";
        }


        function bnNegate() {
            var r = nbi();
            BigInteger.ZERO.subTo(this, r);
            return r;
        }


        function bnAbs() {
            return (this.s < 0) ? this.negate() : this;
        }


        function bnCompareTo(a) {
            var r = this.s - a.s;
            if (r != 0) return r;
            var i = this.t;
            r = i - a.t;
            if (r != 0) return r;
            while (--i >= 0)
                if ((r = this[i] - a[i]) != 0) return r;
            return 0;
        }


        function nbits(x) {
            var r = 1,
                t;
            if ((t = x >>> 16) != 0) {
                x = t;
                r += 16;
            }
            if ((t = x >> 8) != 0) {
                x = t;
                r += 8;
            }
            if ((t = x >> 4) != 0) {
                x = t;
                r += 4;
            }
            if ((t = x >> 2) != 0) {
                x = t;
                r += 2;
            }
            if ((t = x >> 1) != 0) {
                x = t;
                r += 1;
            }
            return r;
        }


        function bnBitLength() {
            if (this.t <= 0) return 0;
            return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
        }


        function bnpDLShiftTo(n, r) {
            var i;
            for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
            for (i = n - 1; i >= 0; --i) r[i] = 0;
            r.t = this.t + n;
            r.s = this.s;
        }


        function bnpDRShiftTo(n, r) {
            for (var i = n; i < this.t; ++i) r[i - n] = this[i];
            r.t = Math.max(this.t - n, 0);
            r.s = this.s;
        }


        function bnpLShiftTo(n, r) {
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << cbs) - 1;
            var ds = Math.floor(n / this.DB),
                c = (this.s << bs) & this.DM,
                i;
            for (i = this.t - 1; i >= 0; --i) {
                r[i + ds + 1] = (this[i] >> cbs) | c;
                c = (this[i] & bm) << bs;
            }
            for (i = ds - 1; i >= 0; --i) r[i] = 0;
            r[ds] = c;
            r.t = this.t + ds + 1;
            r.s = this.s;
            r.clamp();
        }


        function bnpRShiftTo(n, r) {
            r.s = this.s;
            var ds = Math.floor(n / this.DB);
            if (ds >= this.t) {
                r.t = 0;
                return;
            }
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << bs) - 1;
            r[0] = this[ds] >> bs;
            for (var i = ds + 1; i < this.t; ++i) {
                r[i - ds - 1] |= (this[i] & bm) << cbs;
                r[i - ds] = this[i] >> bs;
            }
            if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
            r.t = this.t - ds;
            r.clamp();
        }


        function bnpSubTo(a, r) {
            var i = 0,
                c = 0,
                m = Math.min(a.t, this.t);
            while (i < m) {
                c += this[i] - a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            if (a.t < this.t) {
                c -= a.s;
                while (i < this.t) {
                    c += this[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += this.s;
            } else {
                c += this.s;
                while (i < a.t) {
                    c -= a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c -= a.s;
            }
            r.s = (c < 0) ? -1 : 0;
            if (c < -1) r[i++] = this.DV + c;
            else if (c > 0) r[i++] = c;
            r.t = i;
            r.clamp();
        }


        function bnpMultiplyTo(a, r) {
            var x = this.abs(),
                y = a.abs();
            var i = x.t;
            r.t = i + y.t;
            while (--i >= 0) r[i] = 0;
            for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
            r.s = 0;
            r.clamp();
            if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
        }


        function bnpSquareTo(r) {
            var x = this.abs();
            var i = r.t = 2 * x.t;
            while (--i >= 0) r[i] = 0;
            for (i = 0; i < x.t - 1; ++i) {
                var c = x.am(i, x[i], r, 2 * i, 0, 1);
                if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                    r[i + x.t] -= x.DV;
                    r[i + x.t + 1] = 1;
                }
            }
            if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
            r.s = 0;
            r.clamp();
        }


        function bnpDivRemTo(m, q, r) {
            var pm = m.abs();
            if (pm.t <= 0) return;
            var pt = this.abs();
            if (pt.t < pm.t) {
                if (q != null) q.fromInt(0);
                if (r != null) this.copyTo(r);
                return;
            }
            if (r == null) r = nbi();
            var y = nbi(),
                ts = this.s,
                ms = m.s;
            var nsh = this.DB - nbits(pm[pm.t - 1]);
            if (nsh > 0) {
                pm.lShiftTo(nsh, y);
                pt.lShiftTo(nsh, r);
            } else {
                pm.copyTo(y);
                pt.copyTo(r);
            }
            var ys = y.t;
            var y0 = y[ys - 1];
            if (y0 == 0) return;
            var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
            var d1 = this.FV / yt,
                d2 = (1 << this.F1) / yt,
                e = 1 << this.F2;
            var i = r.t,
                j = i - ys,
                t = (q == null) ? nbi() : q;
            y.dlShiftTo(j, t);
            if (r.compareTo(t) >= 0) {
                r[r.t++] = 1;
                r.subTo(t, r);
            }
            BigInteger.ONE.dlShiftTo(ys, t);
            t.subTo(y, y); //
            while (y.t < ys) y[y.t++] = 0;
            while (--j >= 0) {

                var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
                if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                    y.dlShiftTo(j, t);
                    r.subTo(t, r);
                    while (r[i] < --qd) r.subTo(t, r);
                }
            }
            if (q != null) {
                r.drShiftTo(ys, q);
                if (ts != ms) BigInteger.ZERO.subTo(q, q);
            }
            r.t = ys;
            r.clamp();
            if (nsh > 0) r.rShiftTo(nsh, r);
            if (ts < 0) BigInteger.ZERO.subTo(r, r);
        }


        function bnMod(a) {
            var r = nbi();
            this.abs().divRemTo(a, null, r);
            if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
            return r;
        }

        function Classic(m) {
            this.m = m;
        }

        function cConvert(x) {
            if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
            else return x;
        }

        function cRevert(x) {
            return x;
        }

        function cReduce(x) {
            x.divRemTo(this.m, null, x);
        }

        function cMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
        }

        function cSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
        }

        Classic.prototype.convert = cConvert;
        Classic.prototype.revert = cRevert;
        Classic.prototype.reduce = cReduce;
        Classic.prototype.mulTo = cMulTo;
        Classic.prototype.sqrTo = cSqrTo;


        function bnpInvDigit() {
            if (this.t < 1) return 0;
            var x = this[0];
            if ((x & 1) == 0) return 0;
            var y = x & 3;
            y = (y * (2 - (x & 0xf) * y)) & 0xf;
            y = (y * (2 - (x & 0xff) * y)) & 0xff;
            y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
            y = (y * (2 - x * y % this.DV)) % this.DV;
            return (y > 0) ? this.DV - y : -y;
        }


        function Montgomery(m) {
            this.m = m;
            this.mp = m.invDigit();
            this.mpl = this.mp & 0x7fff;
            this.mph = this.mp >> 15;
            this.um = (1 << (m.DB - 15)) - 1;
            this.mt2 = 2 * m.t;
        }


        function montConvert(x) {
            var r = nbi();
            x.abs().dlShiftTo(this.m.t, r);
            r.divRemTo(this.m, null, r);
            if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
            return r;
        }


        function montRevert(x) {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }


        function montReduce(x) {
            while (x.t <= this.mt2)
                x[x.t++] = 0;
            for (var i = 0; i < this.m.t; ++i) {

                var j = x[i] & 0x7fff;
                var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;

                j = i + this.m.t;
                x[j] += this.m.am(0, u0, x, i, 0, this.m.t);

                while (x[j] >= x.DV) {
                    x[j] -= x.DV;
                    x[++j]++;
                }
            }
            x.clamp();
            x.drShiftTo(this.m.t, x);
            if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
        }


        function montSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
        }


        function montMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
        }

        Montgomery.prototype.convert = montConvert;
        Montgomery.prototype.revert = montRevert;
        Montgomery.prototype.reduce = montReduce;
        Montgomery.prototype.mulTo = montMulTo;
        Montgomery.prototype.sqrTo = montSqrTo;


        function bnpIsEven() {
            return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
        }


        function bnpExp(e, z) {
            if (e > 0xffffffff || e < 1) return BigInteger.ONE;
            var r = nbi(),
                r2 = nbi(),
                g = z.convert(this),
                i = nbits(e) - 1;
            g.copyTo(r);
            while (--i >= 0) {
                z.sqrTo(r, r2);
                if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
                else {
                    var t = r;
                    r = r2;
                    r2 = t;
                }
            }
            return z.revert(r);
        }


        function bnModPowInt(e, m) {
            var z;
            if (e < 256 || m.isEven()) z = new Classic(m);
            else z = new Montgomery(m);
            return this.exp(e, z);
        }


        BigInteger.prototype.copyTo = bnpCopyTo;
        BigInteger.prototype.fromInt = bnpFromInt;
        BigInteger.prototype.fromString = bnpFromString;
        BigInteger.prototype.clamp = bnpClamp;
        BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
        BigInteger.prototype.drShiftTo = bnpDRShiftTo;
        BigInteger.prototype.lShiftTo = bnpLShiftTo;
        BigInteger.prototype.rShiftTo = bnpRShiftTo;
        BigInteger.prototype.subTo = bnpSubTo;
        BigInteger.prototype.multiplyTo = bnpMultiplyTo;
        BigInteger.prototype.squareTo = bnpSquareTo;
        BigInteger.prototype.divRemTo = bnpDivRemTo;
        BigInteger.prototype.invDigit = bnpInvDigit;
        BigInteger.prototype.isEven = bnpIsEven;
        BigInteger.prototype.exp = bnpExp;


        BigInteger.prototype.toString = bnToString;
        BigInteger.prototype.negate = bnNegate;
        BigInteger.prototype.abs = bnAbs;
        BigInteger.prototype.compareTo = bnCompareTo;
        BigInteger.prototype.bitLength = bnBitLength;
        BigInteger.prototype.mod = bnMod;
        BigInteger.prototype.modPowInt = bnModPowInt;


        BigInteger.ZERO = nbv(0);
        BigInteger.ONE = nbv(1);


        function rng_get_byte() {
            return Math.floor(65536 * Math.random()) & 255;
        }


        function rng_get_bytes(ba) {
            var i;
            for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
        }

        function SecureRandom() {}

        SecureRandom.prototype.nextBytes = rng_get_bytes;

        function parseBigInt(str, r) {
            return new BigInteger(str, r);
        }

        function linebrk(s, n) {
            var ret = "";
            var i = 0;
            while (i + n < s.length) {
                ret += s.substring(i, i + n) + "\n";
                i += n;
            }
            return ret + s.substring(i, s.length);
        }

        function byte2Hex(b) {
            if (b < 0x10)
                return "0" + b.toString(16);
            else
                return b.toString(16);
        }


        function pkcs1pad2(s, n) {
            if (n < s.length + 11) {

                return null;
            }
            var ba = new Array();
            var i = s.length - 1;
            while (i >= 0 && n > 0) {
                var c = s.charCodeAt(i--);
                if (c < 128) {
                    ba[--n] = c;
                } else if ((c > 127) && (c < 2048)) {
                    ba[--n] = (c & 63) | 128;
                    ba[--n] = (c >> 6) | 192;
                } else {
                    ba[--n] = (c & 63) | 128;
                    ba[--n] = ((c >> 6) & 63) | 128;
                    ba[--n] = (c >> 12) | 224;
                }
            }
            ba[--n] = 0;
            var rng = new SecureRandom();
            var x = new Array();
            while (n > 2) {
                x[0] = 0;
                while (x[0] == 0) rng.nextBytes(x);
                ba[--n] = x[0];
            }
            ba[--n] = 2;
            ba[--n] = 0;

            var bi = new BigInteger(ba);

            var hbi = bi.toString(16);
            log_pkcs1pad2 = ' hbi(hbi.length=' + hbi.length + '  s=' + s + ')=' + hbi + '\n ' + ba.length;

            return bi;
        }
        var log_pkcs1pad2 = "";


        function RSAKey() {
            this.n = null;
            this.e = 0;
            this.d = null;
            this.p = null;
            this.q = null;
            this.dmp1 = null;
            this.dmq1 = null;
            this.coeff = null;
        }


        function RSASetPublic(N, E) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = parseBigInt(N, 16);
                this.e = parseInt(E, 16);
            }
        }


        function RSADoPublic(x) {
            return x.modPowInt(this.e, this.n);
        }


        function RSAEncrypt(text) {
            var nbytes = (this.n.bitLength() + 7) >> 3;

            var m = pkcs1pad2(text, nbytes);

            if (m == null) return null;
            var c = this.doPublic(m);
            if (c == null) return null;
            var h = c.toString(16);
            var hexret = h;

            if ((h.length & 1) != 0) hexret = "0" + hexret;
            while (hexret.length < nbytes * 2) hexret = "0" + hexret;
            return hexret;
        }

        RSAKey.prototype.doPublic = RSADoPublic;

        RSAKey.prototype.setPublic = RSASetPublic;
        RSAKey.prototype.encrypt = RSAEncrypt;


        function hexToBase64(hexStr) {
            for (var i = 0, j = 0, len = hexStr.length / 3, base64 = []; i < len; ++i) {
                var a = hexStr.charCodeAt(j++),
                    b = hexStr.charCodeAt(j++),
                    c = hexStr.charCodeAt(j++);
                if ((a | b | c) > 255) throw new Error("String contains an invalid character");
                base64[base64.length] = rsaFontArray[a >> 2] + rsaFontArray[((a << 4) & 63) | (b >> 4)] +
                    (isNaN(b) ? "=" : rsaFontArray[((b << 2) & 63) | (c >> 6)]) +
                    (isNaN(b + c) ? "=" : rsaFontArray[c & 63]);
            }
            return base64.join("");
        };

        var encryptToHex = function (key, str) {
            if (str == undefined || str == null || str == "") {
                return "";
            }
            var oneRsa = new RSAKey();
            oneRsa.setPublic(key, "010001");
            var hexStr = oneRsa.encrypt(str);
            return hexToBase64((String.fromCharCode.apply(null,
                hexStr.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))));
        }

        return {
            encryptToHex: encryptToHex
        }
    })()

    var SNCRYPTO = (function () {


        //core
        var CryptoJS = CryptoJS || (function (Math, undefined) {

            var create = Object.create || (function () {
                function F() {};

                return function (obj) {
                    var subtype;

                    F.prototype = obj;

                    subtype = new F();

                    F.prototype = null;

                    return subtype;
                };
            }());


            var C = {};


            var C_lib = C.lib = {};


            var Base = C_lib.Base = (function () {


                return {

                    extend: function (overrides) {

                        var subtype = create(this);


                        if (overrides) {
                            subtype.mixIn(overrides);
                        }


                        if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                            subtype.init = function () {
                                subtype.$super.init.apply(this, arguments);
                            };
                        }


                        subtype.init.prototype = subtype;


                        subtype.$super = this;

                        return subtype;
                    },


                    create: function () {
                        var instance = this.extend();
                        instance.init.apply(instance, arguments);

                        return instance;
                    },


                    init: function () {},


                    mixIn: function (properties) {
                        for (var propertyName in properties) {
                            if (properties.hasOwnProperty(propertyName)) {
                                this[propertyName] = properties[propertyName];
                            }
                        }


                        if (properties.hasOwnProperty('toString')) {
                            this.toString = properties.toString;
                        }
                    },


                    clone: function () {
                        return this.init.prototype.extend(this);
                    }
                };
            }());

            var WordArray = C_lib.WordArray = Base.extend({

                init: function (words, sigBytes) {
                    words = this.words = words || [];

                    if (sigBytes != undefined) {
                        this.sigBytes = sigBytes;
                    } else {
                        this.sigBytes = words.length * 4;
                    }
                },


                toString: function (encoder) {
                    return (encoder || Hex).stringify(this);
                },


                concat: function (wordArray) {

                    var thisWords = this.words;
                    var thatWords = wordArray.words;
                    var thisSigBytes = this.sigBytes;
                    var thatSigBytes = wordArray.sigBytes;


                    this.clamp();


                    if (thisSigBytes % 4) {

                        for (var i = 0; i < thatSigBytes; i++) {
                            var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                        }
                    } else {

                        for (var i = 0; i < thatSigBytes; i += 4) {
                            thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                        }
                    }
                    this.sigBytes += thatSigBytes;


                    return this;
                },


                clamp: function () {
                    // Shortcuts
                    var words = this.words;
                    var sigBytes = this.sigBytes;

                    // Clamp
                    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                    words.length = Math.ceil(sigBytes / 4);
                },

                /**
                 * Creates a copy of this word array.
                 *
                 * @return {WordArray} The clone.
                 *
                 * @example
                 *
                 *     var clone = wordArray.clone();
                 */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone.words = this.words.slice(0);

                    return clone;
                },

                /**
                 * Creates a word array filled with random bytes.
                 *
                 * @param {number} nBytes The number of random bytes to generate.
                 *
                 * @return {WordArray} The random word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.random(16);
                 */
                random: function (nBytes) {
                    var words = [];

                    var r = (function (m_w) {
                        var m_w = m_w;
                        var m_z = 0x3ade68b1;
                        var mask = 0xffffffff;

                        return function () {
                            m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                            m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                            var result = ((m_z << 0x10) + m_w) & mask;
                            result /= 0x100000000;
                            result += 0.5;
                            return result * (Math.random() > .5 ? 1 : -1);
                        }
                    });

                    for (var i = 0, rcache; i < nBytes; i += 4) {
                        var _r = r((rcache || Math.random()) * 0x100000000);

                        rcache = _r() * 0x3ade67b7;
                        words.push((_r() * 0x100000000) | 0);
                    }

                    return new WordArray.init(words, nBytes);
                }
            });

            /**
             * Encoder namespace.
             */
            var C_enc = C.enc = {};

            /**
             * Hex encoding strategy.
             */
            var Hex = C_enc.Hex = {
                /**
                 * Converts a word array to a hex string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The hex string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var hexChars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        hexChars.push((bite >>> 4).toString(16));
                        hexChars.push((bite & 0x0f).toString(16));
                    }

                    return hexChars.join('');
                },

                /**
                 * Converts a hex string to a word array.
                 *
                 * @param {string} hexStr The hex string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                 */
                parse: function (hexStr) {
                    // Shortcut
                    var hexStrLength = hexStr.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < hexStrLength; i += 2) {
                        words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                    }

                    return new WordArray.init(words, hexStrLength / 2);
                }
            };

            /**
             * Latin1 encoding strategy.
             */
            var Latin1 = C_enc.Latin1 = {
                /**
                 * Converts a word array to a Latin1 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Latin1 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var latin1Chars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        latin1Chars.push(String.fromCharCode(bite));
                    }

                    return latin1Chars.join('');
                },

                /**
                 * Converts a Latin1 string to a word array.
                 *
                 * @param {string} latin1Str The Latin1 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                 */
                parse: function (latin1Str) {
                    // Shortcut
                    var latin1StrLength = latin1Str.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < latin1StrLength; i++) {
                        words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                    }

                    return new WordArray.init(words, latin1StrLength);
                }
            };

            /**
             * UTF-8 encoding strategy.
             */
            var Utf8 = C_enc.Utf8 = {
                /**
                 * Converts a word array to a UTF-8 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-8 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    try {
                        return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                    } catch (e) {
                        throw new Error('Malformed UTF-8 data');
                    }
                },

                /**
                 * Converts a UTF-8 string to a word array.
                 *
                 * @param {string} utf8Str The UTF-8 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                 */
                parse: function (utf8Str) {
                    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                }
            };

            /**
             * Abstract buffered block algorithm template.
             *
             * The property blockSize must be implemented in a concrete subtype.
             *
             * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
             */
            var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
                /**
                 * Resets this block algorithm's data buffer to its initial state.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm.reset();
                 */
                reset: function () {
                    // Initial values
                    this._data = new WordArray.init();
                    this._nDataBytes = 0;
                },

                /**
                 * Adds new data to this block algorithm's buffer.
                 *
                 * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm._append('data');
                 *     bufferedBlockAlgorithm._append(wordArray);
                 */
                _append: function (data) {
                    // Convert string to WordArray, else assume WordArray already
                    if (typeof data == 'string') {
                        data = Utf8.parse(data);
                    }

                    // Append
                    this._data.concat(data);
                    this._nDataBytes += data.sigBytes;
                },

                /**
                 * Processes available data blocks.
                 *
                 * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                 *
                 * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                 *
                 * @return {WordArray} The processed data.
                 *
                 * @example
                 *
                 *     var processedData = bufferedBlockAlgorithm._process();
                 *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                 */
                _process: function (doFlush) {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;
                    var dataSigBytes = data.sigBytes;
                    var blockSize = this.blockSize;
                    var blockSizeBytes = blockSize * 4;

                    // Count blocks ready
                    var nBlocksReady = dataSigBytes / blockSizeBytes;
                    if (doFlush) {
                        // Round up to include partial blocks
                        nBlocksReady = Math.ceil(nBlocksReady);
                    } else {
                        // Round down to include only full blocks,
                        // less the number of blocks that must remain in the buffer
                        nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                    }

                    // Count words ready
                    var nWordsReady = nBlocksReady * blockSize;

                    // Count bytes ready
                    var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                    // Process blocks
                    if (nWordsReady) {
                        for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                            // Perform concrete-algorithm logic
                            this._doProcessBlock(dataWords, offset);
                        }

                        // Remove processed words
                        var processedWords = dataWords.splice(0, nWordsReady);
                        data.sigBytes -= nBytesReady;
                    }

                    // Return processed words
                    return new WordArray.init(processedWords, nBytesReady);
                },

                /**
                 * Creates a copy of this object.
                 *
                 * @return {Object} The clone.
                 *
                 * @example
                 *
                 *     var clone = bufferedBlockAlgorithm.clone();
                 */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone._data = this._data.clone();

                    return clone;
                },

                _minBufferSize: 0
            });

            /**
             * Abstract hasher template.
             *
             * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
             */
            var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 */
                cfg: Base.extend(),

                /**
                 * Initializes a newly created hasher.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                 *
                 * @example
                 *
                 *     var hasher = CryptoJS.algo.SHA256.create();
                 */
                init: function (cfg) {
                    // Apply config defaults
                    this.cfg = this.cfg.extend(cfg);

                    // Set initial values
                    this.reset();
                },

                /**
                 * Resets this hasher to its initial state.
                 *
                 * @example
                 *
                 *     hasher.reset();
                 */
                reset: function () {
                    // Reset data buffer
                    BufferedBlockAlgorithm.reset.call(this);

                    // Perform concrete-hasher logic
                    this._doReset();
                },

                /**
                 * Updates this hasher with a message.
                 *
                 * @param {WordArray|string} messageUpdate The message to append.
                 *
                 * @return {Hasher} This hasher.
                 *
                 * @example
                 *
                 *     hasher.update('message');
                 *     hasher.update(wordArray);
                 */
                update: function (messageUpdate) {
                    // Append
                    this._append(messageUpdate);

                    // Update the hash
                    this._process();

                    // Chainable
                    return this;
                },

                /**
                 * Finalizes the hash computation.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} messageUpdate (Optional) A final message update.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @example
                 *
                 *     var hash = hasher.finalize();
                 *     var hash = hasher.finalize('message');
                 *     var hash = hasher.finalize(wordArray);
                 */
                finalize: function (messageUpdate) {
                    // Final message update
                    if (messageUpdate) {
                        this._append(messageUpdate);
                    }

                    // Perform concrete-hasher logic
                    var hash = this._doFinalize();

                    return hash;
                },

                blockSize: 512 / 32,

                /**
                 * Creates a shortcut function to a hasher's object interface.
                 *
                 * @param {Hasher} hasher The hasher to create a helper for.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                 */
                _createHelper: function (hasher) {
                    return function (message, cfg) {
                        return new hasher.init(cfg).finalize(message);
                    };
                },

                /**
                 * Creates a shortcut function to the HMAC's object interface.
                 *
                 * @param {Hasher} hasher The hasher to use in this HMAC helper.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                 */
                _createHmacHelper: function (hasher) {
                    return function (message, key) {
                        return new C_algo.HMAC.init(hasher, key).finalize(message);
                    };
                }
            });

            /**
             * Algorithm namespace.
             */
            var C_algo = C.algo = {};

            return C;
        }(Math));

        //enc-base64
        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var C_enc = C.enc;

            /**
             * Base64 encoding strategy.
             */
            var Base64 = C_enc.Base64 = {
                /**
                 * Converts a word array to a Base64 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Base64 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;
                    var map = this._map;

                    // Clamp excess bits
                    wordArray.clamp();

                    // Convert
                    var base64Chars = [];
                    for (var i = 0; i < sigBytes; i += 3) {
                        var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                        var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                        var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                        for (var j = 0;
                            (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                            base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                        }
                    }

                    // Add padding
                    var paddingChar = map.charAt(64);
                    if (paddingChar) {
                        while (base64Chars.length % 4) {
                            base64Chars.push(paddingChar);
                        }
                    }

                    return base64Chars.join('');
                },

                /**
                 * Converts a Base64 string to a word array.
                 *
                 * @param {string} base64Str The Base64 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
                 */
                parse: function (base64Str) {
                    // Shortcuts
                    var base64StrLength = base64Str.length;
                    var map = this._map;
                    var reverseMap = this._reverseMap;

                    if (!reverseMap) {
                        reverseMap = this._reverseMap = [];
                        for (var j = 0; j < map.length; j++) {
                            reverseMap[map.charCodeAt(j)] = j;
                        }
                    }

                    // Ignore padding
                    var paddingChar = map.charAt(64);
                    if (paddingChar) {
                        var paddingIndex = base64Str.indexOf(paddingChar);
                        if (paddingIndex !== -1) {
                            base64StrLength = paddingIndex;
                        }
                    }

                    // Convert
                    return parseLoop(base64Str, base64StrLength, reverseMap);

                },

                _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
            };

            function parseLoop(base64Str, base64StrLength, reverseMap) {
                var words = [];
                var nBytes = 0;
                for (var i = 0; i < base64StrLength; i++) {
                    if (i % 4) {
                        var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                        var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                        words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                        nBytes++;
                    }
                }
                return WordArray.create(words, nBytes);
            }
        }());

        //md5
        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Constants table
            var T = [];

            // Compute constants
            (function () {
                for (var i = 0; i < 64; i++) {
                    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
                }
            }());

            /**
             * MD5 hash algorithm.
             */
            var MD5 = C_algo.MD5 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0x67452301, 0xefcdab89,
                        0x98badcfe, 0x10325476
                    ]);
                },

                _doProcessBlock: function (M, offset) {
                    // Swap endian
                    for (var i = 0; i < 16; i++) {
                        // Shortcuts
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];

                        M[offset_i] = (
                            (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                            (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                        );
                    }

                    // Shortcuts
                    var H = this._hash.words;

                    var M_offset_0 = M[offset + 0];
                    var M_offset_1 = M[offset + 1];
                    var M_offset_2 = M[offset + 2];
                    var M_offset_3 = M[offset + 3];
                    var M_offset_4 = M[offset + 4];
                    var M_offset_5 = M[offset + 5];
                    var M_offset_6 = M[offset + 6];
                    var M_offset_7 = M[offset + 7];
                    var M_offset_8 = M[offset + 8];
                    var M_offset_9 = M[offset + 9];
                    var M_offset_10 = M[offset + 10];
                    var M_offset_11 = M[offset + 11];
                    var M_offset_12 = M[offset + 12];
                    var M_offset_13 = M[offset + 13];
                    var M_offset_14 = M[offset + 14];
                    var M_offset_15 = M[offset + 15];

                    // Working varialbes
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];

                    // Computation
                    a = FF(a, b, c, d, M_offset_0, 7, T[0]);
                    d = FF(d, a, b, c, M_offset_1, 12, T[1]);
                    c = FF(c, d, a, b, M_offset_2, 17, T[2]);
                    b = FF(b, c, d, a, M_offset_3, 22, T[3]);
                    a = FF(a, b, c, d, M_offset_4, 7, T[4]);
                    d = FF(d, a, b, c, M_offset_5, 12, T[5]);
                    c = FF(c, d, a, b, M_offset_6, 17, T[6]);
                    b = FF(b, c, d, a, M_offset_7, 22, T[7]);
                    a = FF(a, b, c, d, M_offset_8, 7, T[8]);
                    d = FF(d, a, b, c, M_offset_9, 12, T[9]);
                    c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                    b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                    a = FF(a, b, c, d, M_offset_12, 7, T[12]);
                    d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                    c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                    b = FF(b, c, d, a, M_offset_15, 22, T[15]);

                    a = GG(a, b, c, d, M_offset_1, 5, T[16]);
                    d = GG(d, a, b, c, M_offset_6, 9, T[17]);
                    c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                    b = GG(b, c, d, a, M_offset_0, 20, T[19]);
                    a = GG(a, b, c, d, M_offset_5, 5, T[20]);
                    d = GG(d, a, b, c, M_offset_10, 9, T[21]);
                    c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                    b = GG(b, c, d, a, M_offset_4, 20, T[23]);
                    a = GG(a, b, c, d, M_offset_9, 5, T[24]);
                    d = GG(d, a, b, c, M_offset_14, 9, T[25]);
                    c = GG(c, d, a, b, M_offset_3, 14, T[26]);
                    b = GG(b, c, d, a, M_offset_8, 20, T[27]);
                    a = GG(a, b, c, d, M_offset_13, 5, T[28]);
                    d = GG(d, a, b, c, M_offset_2, 9, T[29]);
                    c = GG(c, d, a, b, M_offset_7, 14, T[30]);
                    b = GG(b, c, d, a, M_offset_12, 20, T[31]);

                    a = HH(a, b, c, d, M_offset_5, 4, T[32]);
                    d = HH(d, a, b, c, M_offset_8, 11, T[33]);
                    c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                    b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                    a = HH(a, b, c, d, M_offset_1, 4, T[36]);
                    d = HH(d, a, b, c, M_offset_4, 11, T[37]);
                    c = HH(c, d, a, b, M_offset_7, 16, T[38]);
                    b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                    a = HH(a, b, c, d, M_offset_13, 4, T[40]);
                    d = HH(d, a, b, c, M_offset_0, 11, T[41]);
                    c = HH(c, d, a, b, M_offset_3, 16, T[42]);
                    b = HH(b, c, d, a, M_offset_6, 23, T[43]);
                    a = HH(a, b, c, d, M_offset_9, 4, T[44]);
                    d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                    c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                    b = HH(b, c, d, a, M_offset_2, 23, T[47]);

                    a = II(a, b, c, d, M_offset_0, 6, T[48]);
                    d = II(d, a, b, c, M_offset_7, 10, T[49]);
                    c = II(c, d, a, b, M_offset_14, 15, T[50]);
                    b = II(b, c, d, a, M_offset_5, 21, T[51]);
                    a = II(a, b, c, d, M_offset_12, 6, T[52]);
                    d = II(d, a, b, c, M_offset_3, 10, T[53]);
                    c = II(c, d, a, b, M_offset_10, 15, T[54]);
                    b = II(b, c, d, a, M_offset_1, 21, T[55]);
                    a = II(a, b, c, d, M_offset_8, 6, T[56]);
                    d = II(d, a, b, c, M_offset_15, 10, T[57]);
                    c = II(c, d, a, b, M_offset_6, 15, T[58]);
                    b = II(b, c, d, a, M_offset_13, 21, T[59]);
                    a = II(a, b, c, d, M_offset_4, 6, T[60]);
                    d = II(d, a, b, c, M_offset_11, 10, T[61]);
                    c = II(c, d, a, b, M_offset_2, 15, T[62]);
                    b = II(b, c, d, a, M_offset_9, 21, T[63]);

                    // Intermediate hash value
                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                    var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                    var nBitsTotalL = nBitsTotal;
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                        (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
                    );
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                        (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
                    );

                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var hash = this._hash;
                    var H = hash.words;

                    // Swap endian
                    for (var i = 0; i < 4; i++) {
                        // Shortcut
                        var H_i = H[i];

                        H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                            (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                    }

                    // Return final computed hash
                    return hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            function FF(a, b, c, d, x, s, t) {
                var n = a + ((b & c) | (~b & d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function GG(a, b, c, d, x, s, t) {
                var n = a + ((b & d) | (c & ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function HH(a, b, c, d, x, s, t) {
                var n = a + (b ^ c ^ d) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function II(a, b, c, d, x, s, t) {
                var n = a + (c ^ (b | ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.MD5('message');
             *     var hash = CryptoJS.MD5(wordArray);
             */
            C.MD5 = Hasher._createHelper(MD5);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacMD5(message, key);
             */
            C.HmacMD5 = Hasher._createHmacHelper(MD5);
        }(Math));

        //evpkdf
        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var WordArray = C_lib.WordArray;
            var C_algo = C.algo;
            var MD5 = C_algo.MD5;

            /**
             * This key derivation function is meant to conform with EVP_BytesToKey.
             * www.openssl.org/docs/crypto/EVP_BytesToKey.html
             */
            var EvpKDF = C_algo.EvpKDF = Base.extend({
                /**
                 * Configuration options.
                 *
                 * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                 * @property {Hasher} hasher The hash algorithm to use. Default: MD5
                 * @property {number} iterations The number of iterations to perform. Default: 1
                 */
                cfg: Base.extend({
                    keySize: 128 / 32,
                    hasher: MD5,
                    iterations: 1
                }),

                /**
                 * Initializes a newly created key derivation function.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                 *
                 * @example
                 *
                 *     var kdf = CryptoJS.algo.EvpKDF.create();
                 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
                 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
                 */
                init: function (cfg) {
                    this.cfg = this.cfg.extend(cfg);
                },

                /**
                 * Derives a key from a password.
                 *
                 * @param {WordArray|string} password The password.
                 * @param {WordArray|string} salt A salt.
                 *
                 * @return {WordArray} The derived key.
                 *
                 * @example
                 *
                 *     var key = kdf.compute(password, salt);
                 */
                compute: function (password, salt) {
                    // Shortcut
                    var cfg = this.cfg;

                    // Init hasher
                    var hasher = cfg.hasher.create();

                    // Initial values
                    var derivedKey = WordArray.create();

                    // Shortcuts
                    var derivedKeyWords = derivedKey.words;
                    var keySize = cfg.keySize;
                    var iterations = cfg.iterations;

                    // Generate key
                    while (derivedKeyWords.length < keySize) {
                        if (block) {
                            hasher.update(block);
                        }
                        var block = hasher.update(password).finalize(salt);
                        hasher.reset();

                        // Iterations
                        for (var i = 1; i < iterations; i++) {
                            block = hasher.finalize(block);
                            hasher.reset();
                        }

                        derivedKey.concat(block);
                    }
                    derivedKey.sigBytes = keySize * 4;

                    return derivedKey;
                }
            });

            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             * @param {Object} cfg (Optional) The configuration options to use for this computation.
             *
             * @return {WordArray} The derived key.
             *
             * @static
             *
             * @example
             *
             *     var key = CryptoJS.EvpKDF(password, salt);
             *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
             *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
             */
            C.EvpKDF = function (password, salt, cfg) {
                return EvpKDF.create(cfg).compute(password, salt);
            };
        }());

        //cipher-core
        CryptoJS.lib.Cipher || (function (undefined) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var WordArray = C_lib.WordArray;
            var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var Base64 = C_enc.Base64;
            var C_algo = C.algo;
            var EvpKDF = C_algo.EvpKDF;

            /**
             * Abstract base cipher template.
             *
             * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
             * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
             * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
             * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
             */
            var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 *
                 * @property {WordArray} iv The IV to use for this operation.
                 */
                cfg: Base.extend(),

                /**
                 * Creates this cipher in encryption mode.
                 *
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {Cipher} A cipher instance.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
                 */
                createEncryptor: function (key, cfg) {
                    return this.create(this._ENC_XFORM_MODE, key, cfg);
                },

                /**
                 * Creates this cipher in decryption mode.
                 *
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {Cipher} A cipher instance.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
                 */
                createDecryptor: function (key, cfg) {
                    return this.create(this._DEC_XFORM_MODE, key, cfg);
                },

                /**
                 * Initializes a newly created cipher.
                 *
                 * @param {number} xformMode Either the encryption or decryption transormation mode constant.
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
                 */
                init: function (xformMode, key, cfg) {
                    // Apply config defaults
                    this.cfg = this.cfg.extend(cfg);

                    // Store transform mode and key
                    this._xformMode = xformMode;
                    this._key = key;

                    // Set initial values
                    this.reset();
                },

                /**
                 * Resets this cipher to its initial state.
                 *
                 * @example
                 *
                 *     cipher.reset();
                 */
                reset: function () {
                    // Reset data buffer
                    BufferedBlockAlgorithm.reset.call(this);

                    // Perform concrete-cipher logic
                    this._doReset();
                },

                /**
                 * Adds data to be encrypted or decrypted.
                 *
                 * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
                 *
                 * @return {WordArray} The data after processing.
                 *
                 * @example
                 *
                 *     var encrypted = cipher.process('data');
                 *     var encrypted = cipher.process(wordArray);
                 */
                process: function (dataUpdate) {
                    // Append
                    this._append(dataUpdate);

                    // Process available blocks
                    return this._process();
                },

                /**
                 * Finalizes the encryption or decryption process.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
                 *
                 * @return {WordArray} The data after final processing.
                 *
                 * @example
                 *
                 *     var encrypted = cipher.finalize();
                 *     var encrypted = cipher.finalize('data');
                 *     var encrypted = cipher.finalize(wordArray);
                 */
                finalize: function (dataUpdate) {
                    // Final data update
                    if (dataUpdate) {
                        this._append(dataUpdate);
                    }

                    // Perform concrete-cipher logic
                    var finalProcessedData = this._doFinalize();

                    return finalProcessedData;
                },

                keySize: 128 / 32,

                ivSize: 128 / 32,

                _ENC_XFORM_MODE: 1,

                _DEC_XFORM_MODE: 2,

                /**
                 * Creates shortcut functions to a cipher's object interface.
                 *
                 * @param {Cipher} cipher The cipher to create a helper for.
                 *
                 * @return {Object} An object with encrypt and decrypt shortcut functions.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
                 */
                _createHelper: (function () {
                    function selectCipherStrategy(key) {
                        if (typeof key == 'string') {
                            return PasswordBasedCipher;
                        } else {
                            return SerializableCipher;
                        }
                    }

                    return function (cipher) {
                        return {
                            encrypt: function (message, key, cfg) {
                                return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                            },

                            decrypt: function (ciphertext, key, cfg) {
                                return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                            }
                        };
                    };
                }())
            });

            /**
             * Abstract base stream cipher template.
             *
             * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
             */
            var StreamCipher = C_lib.StreamCipher = Cipher.extend({
                _doFinalize: function () {
                    // Process partial blocks
                    var finalProcessedBlocks = this._process(!!'flush');

                    return finalProcessedBlocks;
                },

                blockSize: 1
            });

            /**
             * Mode namespace.
             */
            var C_mode = C.mode = {};

            /**
             * Abstract base block cipher mode template.
             */
            var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
                /**
                 * Creates this mode for encryption.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
                 */
                createEncryptor: function (cipher, iv) {
                    return this.Encryptor.create(cipher, iv);
                },

                /**
                 * Creates this mode for decryption.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
                 */
                createDecryptor: function (cipher, iv) {
                    return this.Decryptor.create(cipher, iv);
                },

                /**
                 * Initializes a newly created mode.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
                 */
                init: function (cipher, iv) {
                    this._cipher = cipher;
                    this._iv = iv;
                }
            });

            /**
             * Cipher Block Chaining mode.
             */
            var CBC = C_mode.CBC = (function () {
                /**
                 * Abstract base CBC mode.
                 */
                var CBC = BlockCipherMode.extend();

                /**
                 * CBC encryptor.
                 */
                CBC.Encryptor = CBC.extend({
                    /**
                     * Processes the data block at offset.
                     *
                     * @param {Array} words The data words to operate on.
                     * @param {number} offset The offset where the block starts.
                     *
                     * @example
                     *
                     *     mode.processBlock(data.words, offset);
                     */
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        // XOR and encrypt
                        xorBlock.call(this, words, offset, blockSize);
                        cipher.encryptBlock(words, offset);

                        // Remember this block to use with next block
                        this._prevBlock = words.slice(offset, offset + blockSize);
                    }
                });

                /**
                 * CBC decryptor.
                 */
                CBC.Decryptor = CBC.extend({
                    /**
                     * Processes the data block at offset.
                     *
                     * @param {Array} words The data words to operate on.
                     * @param {number} offset The offset where the block starts.
                     *
                     * @example
                     *
                     *     mode.processBlock(data.words, offset);
                     */
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        // Remember this block to use with next block
                        var thisBlock = words.slice(offset, offset + blockSize);

                        // Decrypt and XOR
                        cipher.decryptBlock(words, offset);
                        xorBlock.call(this, words, offset, blockSize);

                        // This block becomes the previous block
                        this._prevBlock = thisBlock;
                    }
                });

                function xorBlock(words, offset, blockSize) {
                    // Shortcut
                    var iv = this._iv;

                    // Choose mixing block
                    if (iv) {
                        var block = iv;

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    } else {
                        var block = this._prevBlock;
                    }

                    // XOR blocks
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= block[i];
                    }
                }

                return CBC;
            }());

            /**
             * Padding namespace.
             */
            var C_pad = C.pad = {};

            /**
             * PKCS #5/7 padding strategy.
             */
            var Pkcs7 = C_pad.Pkcs7 = {
                /**
                 * Pads data using the algorithm defined in PKCS #5/7.
                 *
                 * @param {WordArray} data The data to pad.
                 * @param {number} blockSize The multiple that the data should be padded to.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
                 */
                pad: function (data, blockSize) {
                    // Shortcut
                    var blockSizeBytes = blockSize * 4;

                    // Count padding bytes
                    var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                    // Create padding word
                    var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

                    // Create padding
                    var paddingWords = [];
                    for (var i = 0; i < nPaddingBytes; i += 4) {
                        paddingWords.push(paddingWord);
                    }
                    var padding = WordArray.create(paddingWords, nPaddingBytes);

                    // Add padding
                    data.concat(padding);
                },

                /**
                 * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
                 *
                 * @param {WordArray} data The data to unpad.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     CryptoJS.pad.Pkcs7.unpad(wordArray);
                 */
                unpad: function (data) {
                    // Get number of padding bytes from last byte
                    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                    // Remove padding
                    data.sigBytes -= nPaddingBytes;
                }
            };

            /**
             * Abstract base block cipher template.
             *
             * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
             */
            var BlockCipher = C_lib.BlockCipher = Cipher.extend({
                /**
                 * Configuration options.
                 *
                 * @property {Mode} mode The block mode to use. Default: CBC
                 * @property {Padding} padding The padding strategy to use. Default: Pkcs7
                 */
                cfg: Cipher.cfg.extend({
                    mode: CBC,
                    padding: Pkcs7
                }),

                reset: function () {
                    // Reset cipher
                    Cipher.reset.call(this);

                    // Shortcuts
                    var cfg = this.cfg;
                    var iv = cfg.iv;
                    var mode = cfg.mode;

                    // Reset block mode
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        var modeCreator = mode.createEncryptor;
                    } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                        var modeCreator = mode.createDecryptor;
                        // Keep at least one block in the buffer for unpadding
                        this._minBufferSize = 1;
                    }

                    if (this._mode && this._mode.__creator == modeCreator) {
                        this._mode.init(this, iv && iv.words);
                    } else {
                        this._mode = modeCreator.call(mode, this, iv && iv.words);
                        this._mode.__creator = modeCreator;
                    }
                },

                _doProcessBlock: function (words, offset) {
                    this._mode.processBlock(words, offset);
                },

                _doFinalize: function () {
                    // Shortcut
                    var padding = this.cfg.padding;

                    // Finalize
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        // Pad data
                        padding.pad(this._data, this.blockSize);

                        // Process final blocks
                        var finalProcessedBlocks = this._process(!!'flush');
                    } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                        // Process final blocks
                        var finalProcessedBlocks = this._process(!!'flush');

                        // Unpad data
                        padding.unpad(finalProcessedBlocks);
                    }

                    return finalProcessedBlocks;
                },

                blockSize: 128 / 32
            });

            var CipherParams = C_lib.CipherParams = Base.extend({

                init: function (cipherParams) {
                    this.mixIn(cipherParams);
                },


                toString: function (formatter) {
                    return (formatter || this.formatter).stringify(this);
                }
            });


            var C_format = C.format = {};


            var OpenSSLFormatter = C_format.OpenSSL = {

                stringify: function (cipherParams) {

                    var ciphertext = cipherParams.ciphertext;
                    var salt = cipherParams.salt;


                    if (salt) {
                        var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
                    } else {
                        var wordArray = ciphertext;
                    }

                    return wordArray.toString(Base64);
                },

                parse: function (openSSLStr) {

                    var ciphertext = Base64.parse(openSSLStr);


                    var ciphertextWords = ciphertext.words;


                    if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {

                        var salt = WordArray.create(ciphertextWords.slice(2, 4));

                        ciphertextWords.splice(0, 4);
                        ciphertext.sigBytes -= 16;
                    }

                    return CipherParams.create({
                        ciphertext: ciphertext,
                        salt: salt
                    });
                }
            };


            var SerializableCipher = C_lib.SerializableCipher = Base.extend({

                cfg: Base.extend({
                    format: OpenSSLFormatter
                }),


                encrypt: function (cipher, message, key, cfg) {

                    cfg = this.cfg.extend(cfg);


                    var encryptor = cipher.createEncryptor(key, cfg);
                    var ciphertext = encryptor.finalize(message);

                    var cipherCfg = encryptor.cfg;


                    return CipherParams.create({
                        ciphertext: ciphertext,
                        key: key,
                        iv: cipherCfg.iv,
                        algorithm: cipher,
                        mode: cipherCfg.mode,
                        padding: cipherCfg.padding,
                        blockSize: cipher.blockSize,
                        formatter: cfg.format
                    });
                },

                decrypt: function (cipher, ciphertext, key, cfg) {

                    cfg = this.cfg.extend(cfg);


                    ciphertext = this._parse(ciphertext, cfg.format);

                    var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

                    return plaintext;
                },


                _parse: function (ciphertext, format) {
                    if (typeof ciphertext == 'string') {
                        return format.parse(ciphertext, this);
                    } else {
                        return ciphertext;
                    }
                }
            });


            var C_kdf = C.kdf = {};


            var OpenSSLKdf = C_kdf.OpenSSL = {

                execute: function (password, keySize, ivSize, salt) {

                    if (!salt) {
                        salt = WordArray.random(64 / 8);
                    }


                    var key = EvpKDF.create({
                        keySize: keySize + ivSize
                    }).compute(password, salt);


                    var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
                    key.sigBytes = keySize * 4;


                    return CipherParams.create({
                        key: key,
                        iv: iv,
                        salt: salt
                    });
                }
            };


            var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({

                cfg: SerializableCipher.cfg.extend({
                    kdf: OpenSSLKdf
                }),

                encrypt: function (cipher, message, password, cfg) {

                    cfg = this.cfg.extend(cfg);


                    var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);


                    cfg.iv = derivedParams.iv;


                    var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);


                    ciphertext.mixIn(derivedParams);

                    return ciphertext;
                },


                decrypt: function (cipher, ciphertext, password, cfg) {

                    cfg = this.cfg.extend(cfg);


                    ciphertext = this._parse(ciphertext, cfg.format);


                    var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);


                    cfg.iv = derivedParams.iv;


                    var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

                    return plaintext;
                }
            });
        }());


        CryptoJS.mode.ECB = (function () {
            var ECB = CryptoJS.lib.BlockCipherMode.extend();

            ECB.Encryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.encryptBlock(words, offset);
                }
            });

            ECB.Decryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.decryptBlock(words, offset);
                }
            });

            return ECB;
        }());


        //aes
        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var BlockCipher = C_lib.BlockCipher;
            var C_algo = C.algo;

            // Lookup tables
            var SBOX = [];
            var INV_SBOX = [];
            var SUB_MIX_0 = [];
            var SUB_MIX_1 = [];
            var SUB_MIX_2 = [];
            var SUB_MIX_3 = [];
            var INV_SUB_MIX_0 = [];
            var INV_SUB_MIX_1 = [];
            var INV_SUB_MIX_2 = [];
            var INV_SUB_MIX_3 = [];

            // Compute lookup tables
            (function () {
                // Compute double table
                var d = [];
                for (var i = 0; i < 256; i++) {
                    if (i < 128) {
                        d[i] = i << 1;
                    } else {
                        d[i] = (i << 1) ^ 0x11b;
                    }
                }

                // Walk GF(2^8)
                var x = 0;
                var xi = 0;
                for (var i = 0; i < 256; i++) {
                    // Compute sbox
                    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
                    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
                    SBOX[x] = sx;
                    INV_SBOX[sx] = x;

                    // Compute multiplication
                    var x2 = d[x];
                    var x4 = d[x2];
                    var x8 = d[x4];

                    // Compute sub bytes, mix columns tables
                    var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
                    SUB_MIX_0[x] = (t << 24) | (t >>> 8);
                    SUB_MIX_1[x] = (t << 16) | (t >>> 16);
                    SUB_MIX_2[x] = (t << 8) | (t >>> 24);
                    SUB_MIX_3[x] = t;

                    // Compute inv sub bytes, inv mix columns tables
                    var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
                    INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
                    INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
                    INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
                    INV_SUB_MIX_3[sx] = t;

                    // Compute next counter
                    if (!x) {
                        x = xi = 1;
                    } else {
                        x = x2 ^ d[d[d[x8 ^ x2]]];
                        xi ^= d[d[xi]];
                    }
                }
            }());

            // Precomputed Rcon lookup
            var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

            /**
             * AES block cipher algorithm.
             */
            var AES = C_algo.AES = BlockCipher.extend({
                _doReset: function () {
                    // Skip reset of nRounds has been set before and key did not change
                    if (this._nRounds && this._keyPriorReset === this._key) {
                        return;
                    }

                    // Shortcuts
                    var key = this._keyPriorReset = this._key;
                    var keyWords = key.words;
                    var keySize = key.sigBytes / 4;

                    // Compute number of rounds
                    var nRounds = this._nRounds = keySize + 6;

                    // Compute number of key schedule rows
                    var ksRows = (nRounds + 1) * 4;

                    // Compute key schedule
                    var keySchedule = this._keySchedule = [];
                    for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                        if (ksRow < keySize) {
                            keySchedule[ksRow] = keyWords[ksRow];
                        } else {
                            var t = keySchedule[ksRow - 1];

                            if (!(ksRow % keySize)) {
                                // Rot word
                                t = (t << 8) | (t >>> 24);

                                // Sub word
                                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                                // Mix Rcon
                                t ^= RCON[(ksRow / keySize) | 0] << 24;
                            } else if (keySize > 6 && ksRow % keySize == 4) {
                                // Sub word
                                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                            }

                            keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                        }
                    }

                    // Compute inv key schedule
                    var invKeySchedule = this._invKeySchedule = [];
                    for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                        var ksRow = ksRows - invKsRow;

                        if (invKsRow % 4) {
                            var t = keySchedule[ksRow];
                        } else {
                            var t = keySchedule[ksRow - 4];
                        }

                        if (invKsRow < 4 || ksRow <= 4) {
                            invKeySchedule[invKsRow] = t;
                        } else {
                            invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                        }
                    }
                },

                encryptBlock: function (M, offset) {
                    this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
                },

                decryptBlock: function (M, offset) {
                    // Swap 2nd and 4th rows
                    var t = M[offset + 1];
                    M[offset + 1] = M[offset + 3];
                    M[offset + 3] = t;

                    this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

                    // Inv swap 2nd and 4th rows
                    var t = M[offset + 1];
                    M[offset + 1] = M[offset + 3];
                    M[offset + 3] = t;
                },

                _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
                    // Shortcut
                    var nRounds = this._nRounds;

                    // Get input, add round key
                    var s0 = M[offset] ^ keySchedule[0];
                    var s1 = M[offset + 1] ^ keySchedule[1];
                    var s2 = M[offset + 2] ^ keySchedule[2];
                    var s3 = M[offset + 3] ^ keySchedule[3];

                    // Key schedule row counter
                    var ksRow = 4;

                    // Rounds
                    for (var round = 1; round < nRounds; round++) {
                        // Shift rows, sub bytes, mix columns, add round key
                        var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                        var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                        var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                        var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                        // Update state
                        s0 = t0;
                        s1 = t1;
                        s2 = t2;
                        s3 = t3;
                    }

                    // Shift rows, sub bytes, add round key
                    var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
                    var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
                    var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
                    var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

                    // Set output
                    M[offset] = t0;
                    M[offset + 1] = t1;
                    M[offset + 2] = t2;
                    M[offset + 3] = t3;
                },

                keySize: 256 / 32
            });

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
             */
            C.AES = BlockCipher._createHelper(AES);
        }());

        //sha256
        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Initialization and round constants tables
            var H = [];
            var K = [];

            // Compute constants
            (function () {
                function isPrime(n) {
                    var sqrtN = Math.sqrt(n);
                    for (var factor = 2; factor <= sqrtN; factor++) {
                        if (!(n % factor)) {
                            return false;
                        }
                    }

                    return true;
                }

                function getFractionalBits(n) {
                    return ((n - (n | 0)) * 0x100000000) | 0;
                }

                var n = 2;
                var nPrime = 0;
                while (nPrime < 64) {
                    if (isPrime(n)) {
                        if (nPrime < 8) {
                            H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                        }
                        K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                        nPrime++;
                    }

                    n++;
                }
            }());

            // Reusable object
            var W = [];

            /**
             * SHA-256 hash algorithm.
             */
            var SHA256 = C_algo.SHA256 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init(H.slice(0));
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcut
                    var H = this._hash.words;

                    // Working variables
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];
                    var e = H[4];
                    var f = H[5];
                    var g = H[6];
                    var h = H[7];

                    // Computation
                    for (var i = 0; i < 64; i++) {
                        if (i < 16) {
                            W[i] = M[offset + i] | 0;
                        } else {
                            var gamma0x = W[i - 15];
                            var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                                ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                (gamma0x >>> 3);

                            var gamma1x = W[i - 2];
                            var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                (gamma1x >>> 10);

                            W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                        }

                        var ch = (e & f) ^ (~e & g);
                        var maj = (a & b) ^ (a & c) ^ (b & c);

                        var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                        var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

                        var t1 = h + sigma1 + ch + K[i] + W[i];
                        var t2 = sigma0 + maj;

                        h = g;
                        g = f;
                        f = e;
                        e = (d + t1) | 0;
                        d = c;
                        c = b;
                        b = a;
                        a = (t1 + t2) | 0;
                    }

                    // Intermediate hash value
                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                    H[4] = (H[4] + e) | 0;
                    H[5] = (H[5] + f) | 0;
                    H[6] = (H[6] + g) | 0;
                    H[7] = (H[7] + h) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Return final computed hash
                    return this._hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA256('message');
             *     var hash = CryptoJS.SHA256(wordArray);
             */
            C.SHA256 = Hasher._createHelper(SHA256);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA256(message, key);
             */
            C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        }(Math));

        var factor = function (len) {
            len = len || 16;
            var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
            var maxSize = chars.length;
            var letters = '';
            for (i = 0; i < len; i++) {
                letters += chars.charAt(Math.floor(Math.random() * maxSize));
            }
            return letters;
        }



        var aesEncrypt = function (key, data) {
            var keyBase = CryptoJS.enc.Utf8.parse(key);
            var wordBase = CryptoJS.enc.Utf8.parse(data);
            var encrypted = CryptoJS.AES.encrypt(wordBase, keyBase, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.ciphertext.toString().toUpperCase();
        }

        var aesDecrypt = function (key, str) {
            var keyBase = CryptoJS.enc.Utf8.parse(key);
            var strHex = CryptoJS.enc.Hex.parse(str);
            var strBase64 = CryptoJS.enc.Base64.stringify(strHex);
            var decrypted = CryptoJS.AES.decrypt(strBase64, keyBase, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }


        var md5Encrypt = function (str,type) {
            // return CryptoJS.MD5(str);
            if (type && type.toUpperCase() == "BASE64") {
                return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(str));
            }
            return CryptoJS.MD5(str).toString();
        }

        var sha256Encrypt = function (str, type) {
            if (type && type.toUpperCase() == "BASE64") {
                return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(str));
            }
            return CryptoJS.SHA256(str).toString();
        }


        return {
            factor: factor,
            aesEncrypt: aesEncrypt,
            aesDecrypt: aesDecrypt,
            md5Encrypt: md5Encrypt,
            sha256Encrypt: sha256Encrypt
        }
    }());

    var uuidfour = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    var uuid = function (str) {
        str = str ? str : "";
        return (uuidfour() + str + uuidfour() + str + uuidfour() + str + uuidfour() + str + uuidfour() + str + uuidfour() + str + uuidfour() + str + uuidfour());
    }


    return {
        AES: {
            factor: SNCRYPTO.factor,
            encrypt: SNCRYPTO.aesEncrypt,
            decrypt: SNCRYPTO.aesDecrypt
        },
        RSA: SNRSA.encryptToHex,
        MD5: SNCRYPTO.md5Encrypt,
        SHA256: SNCRYPTO.sha256Encrypt,
        UUID: uuid
    }
}())

	var rsaKey = "c0f835b00b02ad2ccca6554c4d68c5785704d129cd913d815db471f423986913d24ddebf5888be8e9cdbbd40e3d610f2812395b7235b845828798cee90a72dd18612f40808c8fcb19943693579dba43fa30c476b2323bce816202f1279128753549559d7d0f19a54e9dfa0f2c3fbc043725e6923ebe6fb96b065c526801b3e7c5fe3ff7b062e6a2aad11016abbba76a9ab6ea17227520d10a6c71285321140f26dcdfbb5e28973eabfeca820ff9471660fc0841fe8ae23fd74568ec06e7efe7d86ef622f2cf1ff4fbede104f4b87acbdfa5b64e725cb2bda4ca994b7642cd85205e07324eac6aec2f92ef312218f9633cf391d1523538fec69538d642daed5b3";



		var public_key = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMEiFzRCUEPDiwio3TEJnosYSNPkas4PGAzS22He4uqB+d4+xHk5NFIelYZnFNTbx2co7mLbfAl3KuV7ujhm8ccCAwEAAQ==";
 var navigator = {}, window={};
    var bE;
    var n = 244837814094590;
    var aV = ((n & 16777215) == 15715070);
    function bf(z, t, L) {
        if (z != null) {
            if ("number" == typeof z) {
                this.fromNumber(z, t, L)
            } else {
                if (t == null && "string" != typeof z) {
                    this.fromString(z, 256)
                } else {
                    this.fromString(z, t)
                }
            }
        }
    }
    function bm() {
        return new bf(null)
    }
    function a7(bX, t, z, bW, bZ, bY) {
        while (--bY >= 0) {
            var L = t * this[bX++] + z[bW] + bZ;
            bZ = Math.floor(L / 67108864);
            z[bW++] = L & 67108863
        }
        return bZ
    }
    function a6(bX, b2, b3, bW, b0, t) {
        var bZ = b2 & 32767
          , b1 = b2 >> 15;
        while (--t >= 0) {
            var L = this[bX] & 32767;
            var bY = this[bX++] >> 15;
            var z = b1 * L + bY * bZ;
            L = bZ * L + ((z & 32767) << 15) + b3[bW] + (b0 & 1073741823);
            b0 = (L >>> 30) + (z >>> 15) + b1 * bY + (b0 >>> 30);
            b3[bW++] = L & 1073741823
        }
        return b0
    }
    function a5(bX, b2, b3, bW, b0, t) {
        var bZ = b2 & 16383
          , b1 = b2 >> 14;
        while (--t >= 0) {
            var L = this[bX] & 16383;
            var bY = this[bX++] >> 14;
            var z = b1 * L + bY * bZ;
            L = bZ * L + ((z & 16383) << 14) + b3[bW] + b0;
            b0 = (L >> 28) + (z >> 14) + b1 * bY;
            b3[bW++] = L & 268435455
        }
        return b0
    }
    if (aV && (navigator.appName == "Microsoft Internet Explorer")) {
        bf.prototype.am = a6;
        bE = 30
    } else {
        if (aV && (navigator.appName != "Netscape")) {
            bf.prototype.am = a7;
            bE = 26
        } else {
            bf.prototype.am = a5;
            bE = 28
        }
    }
    bf.prototype.DB = bE;
    bf.prototype.DM = ((1 << bE) - 1);
    bf.prototype.DV = (1 << bE);
    var bQ = 52;
    bf.prototype.FV = Math.pow(2, bQ);
    bf.prototype.F1 = bQ - bE;
    bf.prototype.F2 = 2 * bE - bQ;
    var a = "0123456789abcdefghijklmnopqrstuvwxyz";
    var g = new Array();
    var aH, E;
    aH = "0".charCodeAt(0);
    for (E = 0; E <= 9; ++E) {
        g[aH++] = E
    }
    aH = "a".charCodeAt(0);
    for (E = 10; E < 36; ++E) {
        g[aH++] = E
    }
    aH = "A".charCodeAt(0);
    for (E = 10; E < 36; ++E) {
        g[aH++] = E
    }
    function Y(t) {
        return a.charAt(t)
    }
    function aX(z, t) {
        var L = g[z.charCodeAt(t)];
        return (L == null) ? -1 : L
    }
    function d(z) {
        for (var t = this.t - 1; t >= 0; --t) {
            z[t] = this[t]
        }
        z.t = this.t;
        z.s = this.s
    }
    function h(t) {
        this.t = 1;
        this.s = (t < 0) ? -1 : 0;
        if (t > 0) {
            this[0] = t
        } else {
            if (t < -1) {
                this[0] = t + this.DV
            } else {
                this.t = 0
            }
        }
    }
    function bi(t) {
        var z = bm();
        z.fromInt(t);
        return z
    }
    function bI(bZ, z) {
        var bW;
        if (z == 16) {
            bW = 4
        } else {
            if (z == 8) {
                bW = 3
            } else {
                if (z == 256) {
                    bW = 8
                } else {
                    if (z == 2) {
                        bW = 1
                    } else {
                        if (z == 32) {
                            bW = 5
                        } else {
                            if (z == 4) {
                                bW = 2
                            } else {
                                this.fromRadix(bZ, z);
                                return
                            }
                        }
                    }
                }
            }
        }
        this.t = 0;
        this.s = 0;
        var bY = bZ.length
          , L = false
          , bX = 0;
        while (--bY >= 0) {
            var t = (bW == 8) ? bZ[bY] & 255 : aX(bZ, bY);
            if (t < 0) {
                if (bZ.charAt(bY) == "-") {
                    L = true
                }
                continue
            }
            L = false;
            if (bX == 0) {
                this[this.t++] = t
            } else {
                if (bX + bW > this.DB) {
                    this[this.t - 1] |= (t & ((1 << (this.DB - bX)) - 1)) << bX;
                    this[this.t++] = (t >> (this.DB - bX))
                } else {
                    this[this.t - 1] |= t << bX
                }
            }
            bX += bW;
            if (bX >= this.DB) {
                bX -= this.DB
            }
        }
        if (bW == 8 && (bZ[0] & 128) != 0) {
            this.s = -1;
            if (bX > 0) {
                this[this.t - 1] |= ((1 << (this.DB - bX)) - 1) << bX
            }
        }
        this.clamp();
        if (L) {
            bf.ZERO.subTo(this, this)
        }
    }
    function bA() {
        var t = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == t) {
            --this.t
        }
    }
    function u(z) {
        if (this.s < 0) {
            return "-" + this.negate().toString(z)
        }
        var L;
        if (z == 16) {
            L = 4
        } else {
            if (z == 8) {
                L = 3
            } else {
                if (z == 2) {
                    L = 1
                } else {
                    if (z == 32) {
                        L = 5
                    } else {
                        if (z == 4) {
                            L = 2
                        } else {
                            return this.toRadix(z)
                        }
                    }
                }
            }
        }
        var bX = (1 << L) - 1, b0, t = false, bY = "", bW = this.t;
        var bZ = this.DB - (bW * this.DB) % L;
        if (bW-- > 0) {
            if (bZ < this.DB && (b0 = this[bW] >> bZ) > 0) {
                t = true;
                bY = Y(b0)
            }
            while (bW >= 0) {
                if (bZ < L) {
                    b0 = (this[bW] & ((1 << bZ) - 1)) << (L - bZ);
                    b0 |= this[--bW] >> (bZ += this.DB - L)
                } else {
                    b0 = (this[bW] >> (bZ -= L)) & bX;
                    if (bZ <= 0) {
                        bZ += this.DB;
                        --bW
                    }
                }
                if (b0 > 0) {
                    t = true
                }
                if (t) {
                    bY += Y(b0)
                }
            }
        }
        return t ? bY : "0"
    }
    function bC() {
        var t = bm();
        bf.ZERO.subTo(this, t);
        return t
    }
    function bB() {
        return (this.s < 0) ? this.negate() : this
    }
    function bN(t) {
        var L = this.s - t.s;
        if (L != 0) {
            return L
        }
        var z = this.t;
        L = z - t.t;
        if (L != 0) {
            return (this.s < 0) ? -L : L
        }
        while (--z >= 0) {
            if ((L = this[z] - t[z]) != 0) {
                return L
            }
        }
        return 0
    }
    function q(z) {
        var bW = 1, L;
        if ((L = z >>> 16) != 0) {
            z = L;
            bW += 16
        }
        if ((L = z >> 8) != 0) {
            z = L;
            bW += 8
        }
        if ((L = z >> 4) != 0) {
            z = L;
            bW += 4
        }
        if ((L = z >> 2) != 0) {
            z = L;
            bW += 2
        }
        if ((L = z >> 1) != 0) {
            z = L;
            bW += 1
        }
        return bW
    }
    function bt() {
        if (this.t <= 0) {
            return 0
        }
        return this.DB * (this.t - 1) + q(this[this.t - 1] ^ (this.s & this.DM))
    }
    function bv(L, z) {
        var t;
        for (t = this.t - 1; t >= 0; --t) {
            z[t + L] = this[t]
        }
        for (t = L - 1; t >= 0; --t) {
            z[t] = 0
        }
        z.t = this.t + L;
        z.s = this.s
    }
    function a2(L, z) {
        for (var t = L; t < this.t; ++t) {
            z[t - L] = this[t]
        }
        z.t = Math.max(this.t - L, 0);
        z.s = this.s
    }
    function s(b0, bW) {
        var z = b0 % this.DB;
        var t = this.DB - z;
        var bY = (1 << t) - 1;
        var bX = Math.floor(b0 / this.DB), bZ = (this.s << z) & this.DM, L;
        for (L = this.t - 1; L >= 0; --L) {
            bW[L + bX + 1] = (this[L] >> t) | bZ;
            bZ = (this[L] & bY) << z
        }
        for (L = bX - 1; L >= 0; --L) {
            bW[L] = 0
        }
        bW[bX] = bZ;
        bW.t = this.t + bX + 1;
        bW.s = this.s;
        bW.clamp()
    }
    function bT(bZ, bW) {
        bW.s = this.s;
        var bX = Math.floor(bZ / this.DB);
        if (bX >= this.t) {
            bW.t = 0;
            return
        }
        var z = bZ % this.DB;
        var t = this.DB - z;
        var bY = (1 << z) - 1;
        bW[0] = this[bX] >> z;
        for (var L = bX + 1; L < this.t; ++L) {
            bW[L - bX - 1] |= (this[L] & bY) << t;
            bW[L - bX] = this[L] >> z
        }
        if (z > 0) {
            bW[this.t - bX - 1] |= (this.s & bY) << t
        }
        bW.t = this.t - bX;
        bW.clamp()
    }
    function bs(z, bW) {
        var L = 0
          , bX = 0
          , t = Math.min(z.t, this.t);
        while (L < t) {
            bX += this[L] - z[L];
            bW[L++] = bX & this.DM;
            bX >>= this.DB
        }
        if (z.t < this.t) {
            bX -= z.s;
            while (L < this.t) {
                bX += this[L];
                bW[L++] = bX & this.DM;
                bX >>= this.DB
            }
            bX += this.s
        } else {
            bX += this.s;
            while (L < z.t) {
                bX -= z[L];
                bW[L++] = bX & this.DM;
                bX >>= this.DB
            }
            bX -= z.s
        }
        bW.s = (bX < 0) ? -1 : 0;
        if (bX < -1) {
            bW[L++] = this.DV + bX
        } else {
            if (bX > 0) {
                bW[L++] = bX
            }
        }
        bW.t = L;
        bW.clamp()
    }
    function bJ(z, bW) {
        var t = this.abs()
          , bX = z.abs();
        var L = t.t;
        bW.t = L + bX.t;
        while (--L >= 0) {
            bW[L] = 0
        }
        for (L = 0; L < bX.t; ++L) {
            bW[L + t.t] = t.am(0, bX[L], bW, L, 0, t.t)
        }
        bW.s = 0;
        bW.clamp();
        if (this.s != z.s) {
            bf.ZERO.subTo(bW, bW)
        }
    }
    function au(L) {
        var t = this.abs();
        var z = L.t = 2 * t.t;
        while (--z >= 0) {
            L[z] = 0
        }
        for (z = 0; z < t.t - 1; ++z) {
            var bW = t.am(z, t[z], L, 2 * z, 0, 1);
            if ((L[z + t.t] += t.am(z + 1, 2 * t[z], L, 2 * z + 1, bW, t.t - z - 1)) >= t.DV) {
                L[z + t.t] -= t.DV;
                L[z + t.t + 1] = 1
            }
        }
        if (L.t > 0) {
            L[L.t - 1] += t.am(z, t[z], L, 2 * z, 0, 1)
        }
        L.s = 0;
        L.clamp()
    }
    function a9(b3, b0, bZ) {
        var b9 = b3.abs();
        if (b9.t <= 0) {
            return
        }
        var b1 = this.abs();
        if (b1.t < b9.t) {
            if (b0 != null) {
                b0.fromInt(0)
            }
            if (bZ != null) {
                this.copyTo(bZ)
            }
            return
        }
        if (bZ == null) {
            bZ = bm()
        }
        var bX = bm()
          , z = this.s
          , b2 = b3.s;
        var b8 = this.DB - q(b9[b9.t - 1]);
        if (b8 > 0) {
            b9.lShiftTo(b8, bX);
            b1.lShiftTo(b8, bZ)
        } else {
            b9.copyTo(bX);
            b1.copyTo(bZ)
        }
        var b5 = bX.t;
        var L = bX[b5 - 1];
        if (L == 0) {
            return
        }
        var b4 = L * (1 << this.F1) + ((b5 > 1) ? bX[b5 - 2] >> this.F2 : 0);
        var cc = this.FV / b4
          , cb = (1 << this.F1) / b4
          , ca = 1 << this.F2;
        var b7 = bZ.t
          , b6 = b7 - b5
          , bY = (b0 == null) ? bm() : b0;
        bX.dlShiftTo(b6, bY);
        if (bZ.compareTo(bY) >= 0) {
            bZ[bZ.t++] = 1;
            bZ.subTo(bY, bZ)
        }
        bf.ONE.dlShiftTo(b5, bY);
        bY.subTo(bX, bX);
        while (bX.t < b5) {
            bX[bX.t++] = 0
        }
        while (--b6 >= 0) {
            var bW = (bZ[--b7] == L) ? this.DM : Math.floor(bZ[b7] * cc + (bZ[b7 - 1] + ca) * cb);
            if ((bZ[b7] += bX.am(0, bW, bZ, b6, 0, b5)) < bW) {
                bX.dlShiftTo(b6, bY);
                bZ.subTo(bY, bZ);
                while (bZ[b7] < --bW) {
                    bZ.subTo(bY, bZ)
                }
            }
        }
        if (b0 != null) {
            bZ.drShiftTo(b5, b0);
            if (z != b2) {
                bf.ZERO.subTo(b0, b0)
            }
        }
        bZ.t = b5;
        bZ.clamp();
        if (b8 > 0) {
            bZ.rShiftTo(b8, bZ)
        }
        if (z < 0) {
            bf.ZERO.subTo(bZ, bZ)
        }
    }
    function bh(t) {
        var z = bm();
        this.abs().divRemTo(t, null, z);
        if (this.s < 0 && z.compareTo(bf.ZERO) > 0) {
            t.subTo(z, z)
        }
        return z
    }
    function aT(t) {
        this.m = t
    }
    function aI(t) {
        if (t.s < 0 || t.compareTo(this.m) >= 0) {
            return t.mod(this.m)
        } else {
            return t
        }
    }
    function c(t) {
        return t
    }
    function V(t) {
        t.divRemTo(this.m, null, t)
    }
    function p(t, L, z) {
        t.multiplyTo(L, z);
        this.reduce(z)
    }
    function aF(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    aT.prototype.convert = aI;
    aT.prototype.revert = c;
    aT.prototype.reduce = V;
    aT.prototype.mulTo = p;
    aT.prototype.sqrTo = aF;
    function ab() {
        if (this.t < 1) {
            return 0
        }
        var t = this[0];
        if ((t & 1) == 0) {
            return 0
        }
        var z = t & 3;
        z = (z * (2 - (t & 15) * z)) & 15;
        z = (z * (2 - (t & 255) * z)) & 255;
        z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
        z = (z * (2 - t * z % this.DV)) % this.DV;
        return (z > 0) ? this.DV - z : -z
    }
    function K(t) {
        this.m = t;
        this.mp = t.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << (t.DB - 15)) - 1;
        this.mt2 = 2 * t.t
    }
    function by(t) {
        var z = bm();
        t.abs().dlShiftTo(this.m.t, z);
        z.divRemTo(this.m, null, z);
        if (t.s < 0 && z.compareTo(bf.ZERO) > 0) {
            this.m.subTo(z, z)
        }
        return z
    }
    function bl(t) {
        var z = bm();
        t.copyTo(z);
        this.reduce(z);
        return z
    }
    function bV(t) {
        while (t.t <= this.mt2) {
            t[t.t++] = 0
        }
        for (var L = 0; L < this.m.t; ++L) {
            var z = t[L] & 32767;
            var bW = (z * this.mpl + (((z * this.mph + (t[L] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
            z = L + this.m.t;
            t[z] += this.m.am(0, bW, t, L, 0, this.m.t);
            while (t[z] >= t.DV) {
                t[z] -= t.DV;
                t[++z]++
            }
        }
        t.clamp();
        t.drShiftTo(this.m.t, t);
        if (t.compareTo(this.m) >= 0) {
            t.subTo(this.m, t)
        }
    }
    function ac(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    function bz(t, L, z) {
        t.multiplyTo(L, z);
        this.reduce(z)
    }
    K.prototype.convert = by;
    K.prototype.revert = bl;
    K.prototype.reduce = bV;
    K.prototype.mulTo = bz;
    K.prototype.sqrTo = ac;
    function ad() {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
    }
    function am(b0, b1) {
        if (b0 > 4294967295 || b0 < 1) {
            return bf.ONE
        }
        var bZ = bm()
          , L = bm()
          , bY = b1.convert(this)
          , bX = q(b0) - 1;
        bY.copyTo(bZ);
        while (--bX >= 0) {
            b1.sqrTo(bZ, L);
            if ((b0 & (1 << bX)) > 0) {
                b1.mulTo(L, bY, bZ)
            } else {
                var bW = bZ;
                bZ = L;
                L = bW
            }
        }
        return b1.revert(bZ)
    }
    function aG(L, t) {
        var bW;
        if (L < 256 || t.isEven()) {
            bW = new aT(t)
        } else {
            bW = new K(t)
        }
        return this.exp(L, bW)
    }
    bf.prototype.copyTo = d;
    bf.prototype.fromInt = h;
    bf.prototype.fromString = bI;
    bf.prototype.clamp = bA;
    bf.prototype.dlShiftTo = bv;
    bf.prototype.drShiftTo = a2;
    bf.prototype.lShiftTo = s;
    bf.prototype.rShiftTo = bT;
    bf.prototype.subTo = bs;
    bf.prototype.multiplyTo = bJ;
    bf.prototype.squareTo = au;
    bf.prototype.divRemTo = a9;
    bf.prototype.invDigit = ab;
    bf.prototype.isEven = ad;
    bf.prototype.exp = am;
    bf.prototype.toString = u;
    bf.prototype.negate = bC;
    bf.prototype.abs = bB;
    bf.prototype.compareTo = bN;
    bf.prototype.bitLength = bt;
    bf.prototype.mod = bh;
    bf.prototype.modPowInt = aG;
    bf.ZERO = bi(0);
    bf.ONE = bi(1);
    function f() {
        var t = bm();
        this.copyTo(t);
        return t
    }
    function b() {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV
            } else {
                if (this.t == 0) {
                    return -1
                }
            }
        } else {
            if (this.t == 1) {
                return this[0]
            } else {
                if (this.t == 0) {
                    return 0
                }
            }
        }
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
    }
    function bF() {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24
    }
    function ag() {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16
    }
    function aU(t) {
        return Math.floor(Math.LN2 * this.DB / Math.log(t))
    }
    function aZ() {
        if (this.s < 0) {
            return -1
        } else {
            if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
                return 0
            } else {
                return 1
            }
        }
    }
    function I(t) {
        if (t == null) {
            t = 10
        }
        if (this.signum() == 0 || t < 2 || t > 36) {
            return "0"
        }
        var bW = this.chunkSize(t);
        var L = Math.pow(t, bW);
        var bZ = bi(L)
          , b0 = bm()
          , bY = bm()
          , bX = "";
        this.divRemTo(bZ, b0, bY);
        while (b0.signum() > 0) {
            bX = (L + bY.intValue()).toString(t).substr(1) + bX;
            b0.divRemTo(bZ, b0, bY)
        }
        return bY.intValue().toString(t) + bX
    }
    function av(b1, bY) {
        this.fromInt(0);
        if (bY == null) {
            bY = 10
        }
        var bW = this.chunkSize(bY);
        var bX = Math.pow(bY, bW)
          , L = false
          , t = 0
          , b0 = 0;
        for (var z = 0; z < b1.length; ++z) {
            var bZ = aX(b1, z);
            if (bZ < 0) {
                if (b1.charAt(z) == "-" && this.signum() == 0) {
                    L = true
                }
                continue
            }
            b0 = bY * b0 + bZ;
            if (++t >= bW) {
                this.dMultiply(bX);
                this.dAddOffset(b0, 0);
                t = 0;
                b0 = 0
            }
        }
        if (t > 0) {
            this.dMultiply(Math.pow(bY, t));
            this.dAddOffset(b0, 0)
        }
        if (L) {
            bf.ZERO.subTo(this, this)
        }
    }
    function aP(bW, L, bY) {
        if ("number" == typeof L) {
            if (bW < 2) {
                this.fromInt(1)
            } else {
                this.fromNumber(bW, bY);
                if (!this.testBit(bW - 1)) {
                    this.bitwiseTo(bf.ONE.shiftLeft(bW - 1), ak, this)
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0)
                }
                while (!this.isProbablePrime(L)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > bW) {
                        this.subTo(bf.ONE.shiftLeft(bW - 1), this)
                    }
                }
            }
        } else {
            var z = new Array()
              , bX = bW & 7;
            z.length = (bW >> 3) + 1;
            L.nextBytes(z);
            if (bX > 0) {
                z[0] &= ((1 << bX) - 1)
            } else {
                z[0] = 0
            }
            this.fromString(z, 256)
        }
    }
    function aK() {
        var z = this.t
          , L = new Array();
        L[0] = this.s;
        var bW = this.DB - (z * this.DB) % 8, bX, t = 0;
        if (z-- > 0) {
            if (bW < this.DB && (bX = this[z] >> bW) != (this.s & this.DM) >> bW) {
                L[t++] = bX | (this.s << (this.DB - bW))
            }
            while (z >= 0) {
                if (bW < 8) {
                    bX = (this[z] & ((1 << bW) - 1)) << (8 - bW);
                    bX |= this[--z] >> (bW += this.DB - 8)
                } else {
                    bX = (this[z] >> (bW -= 8)) & 255;
                    if (bW <= 0) {
                        bW += this.DB;
                        --z
                    }
                }
                if ((bX & 128) != 0) {
                    bX |= -256
                }
                if (t == 0 && (this.s & 128) != (bX & 128)) {
                    ++t
                }
                if (t > 0 || bX != this.s) {
                    L[t++] = bX
                }
            }
        }
        return L
    }
    function bG(t) {
        return (this.compareTo(t) == 0)
    }
    function W(t) {
        return (this.compareTo(t) < 0) ? this : t
    }
    function bu(t) {
        return (this.compareTo(t) > 0) ? this : t
    }
    function aJ(z, bY, bW) {
        var L, bX, t = Math.min(z.t, this.t);
        for (L = 0; L < t; ++L) {
            bW[L] = bY(this[L], z[L])
        }
        if (z.t < this.t) {
            bX = z.s & this.DM;
            for (L = t; L < this.t; ++L) {
                bW[L] = bY(this[L], bX)
            }
            bW.t = this.t
        } else {
            bX = this.s & this.DM;
            for (L = t; L < z.t; ++L) {
                bW[L] = bY(bX, z[L])
            }
            bW.t = z.t
        }
        bW.s = bY(this.s, z.s);
        bW.clamp()
    }
    function o(t, z) {
        return t & z
    }
    function bO(t) {
        var z = bm();
        this.bitwiseTo(t, o, z);
        return z
    }
    function ak(t, z) {
        return t | z
    }
    function aS(t) {
        var z = bm();
        this.bitwiseTo(t, ak, z);
        return z
    }
    function aa(t, z) {
        return t ^ z
    }
    function B(t) {
        var z = bm();
        this.bitwiseTo(t, aa, z);
        return z
    }
    function i(t, z) {
        return t & ~z
    }
    function aD(t) {
        var z = bm();
        this.bitwiseTo(t, i, z);
        return z
    }
    function T() {
        var z = bm();
        for (var t = 0; t < this.t; ++t) {
            z[t] = this.DM & ~this[t]
        }
        z.t = this.t;
        z.s = ~this.s;
        return z
    }
    function aN(z) {
        var t = bm();
        if (z < 0) {
            this.rShiftTo(-z, t)
        } else {
            this.lShiftTo(z, t)
        }
        return t
    }
    function R(z) {
        var t = bm();
        if (z < 0) {
            this.lShiftTo(-z, t)
        } else {
            this.rShiftTo(z, t)
        }
        return t
    }
    function bc(t) {
        if (t == 0) {
            return -1
        }
        var z = 0;
        if ((t & 65535) == 0) {
            t >>= 16;
            z += 16
        }
        if ((t & 255) == 0) {
            t >>= 8;
            z += 8
        }
        if ((t & 15) == 0) {
            t >>= 4;
            z += 4
        }
        if ((t & 3) == 0) {
            t >>= 2;
            z += 2
        }
        if ((t & 1) == 0) {
            ++z
        }
        return z
    }
    function aq() {
        for (var t = 0; t < this.t; ++t) {
            if (this[t] != 0) {
                return t * this.DB + bc(this[t])
            }
        }
        if (this.s < 0) {
            return this.t * this.DB
        }
        return -1
    }
    function bj(t) {
        var z = 0;
        while (t != 0) {
            t &= t - 1;
            ++z
        }
        return z
    }
    function ao() {
        var L = 0
          , t = this.s & this.DM;
        for (var z = 0; z < this.t; ++z) {
            L += bj(this[z] ^ t)
        }
        return L
    }
    function aL(z) {
        var t = Math.floor(z / this.DB);
        if (t >= this.t) {
            return (this.s != 0)
        }
        return ((this[t] & (1 << (z % this.DB))) != 0)
    }
    function U(L, z) {
        var t = bf.ONE.shiftLeft(L);
        this.bitwiseTo(t, z, t);
        return t
    }
    function a1(t) {
        return this.changeBit(t, ak)
    }
    function ah(t) {
        return this.changeBit(t, i)
    }
    function aO(t) {
        return this.changeBit(t, aa)
    }
    function S(z, bW) {
        var L = 0
          , bX = 0
          , t = Math.min(z.t, this.t);
        while (L < t) {
            bX += this[L] + z[L];
            bW[L++] = bX & this.DM;
            bX >>= this.DB
        }
        if (z.t < this.t) {
            bX += z.s;
            while (L < this.t) {
                bX += this[L];
                bW[L++] = bX & this.DM;
                bX >>= this.DB
            }
            bX += this.s
        } else {
            bX += this.s;
            while (L < z.t) {
                bX += z[L];
                bW[L++] = bX & this.DM;
                bX >>= this.DB
            }
            bX += z.s
        }
        bW.s = (bX < 0) ? -1 : 0;
        if (bX > 0) {
            bW[L++] = bX
        } else {
            if (bX < -1) {
                bW[L++] = this.DV + bX
            }
        }
        bW.t = L;
        bW.clamp()
    }
    function bg(t) {
        var z = bm();
        this.addTo(t, z);
        return z
    }
    function aA(t) {
        var z = bm();
        this.subTo(t, z);
        return z
    }
    function bH(t) {
        var z = bm();
        this.multiplyTo(t, z);
        return z
    }
    function bU() {
        var t = bm();
        this.squareTo(t);
        return t
    }
    function bd(t) {
        var z = bm();
        this.divRemTo(t, z, null);
        return z
    }
    function bP(t) {
        var z = bm();
        this.divRemTo(t, null, z);
        return z
    }
    function bk(t) {
        var L = bm()
          , z = bm();
        this.divRemTo(t, L, z);
        return new Array(L,z)
    }
    function e(t) {
        this[this.t] = this.am(0, t - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp()
    }
    function aR(z, t) {
        if (z == 0) {
            return
        }
        while (this.t <= t) {
            this[this.t++] = 0
        }
        this[t] += z;
        while (this[t] >= this.DV) {
            this[t] -= this.DV;
            if (++t >= this.t) {
                this[this.t++] = 0
            }
            ++this[t]
        }
    }
    function Z() {}
    function bw(t) {
        return t
    }
    function bK(t, L, z) {
        t.multiplyTo(L, z)
    }
    function ai(t, z) {
        t.squareTo(z)
    }
    Z.prototype.convert = bw;
    Z.prototype.revert = bw;
    Z.prototype.mulTo = bK;
    Z.prototype.sqrTo = ai;
    function Q(t) {
        return this.exp(t, new Z())
    }
    function aQ(t, bX, bW) {
        var L = Math.min(this.t + t.t, bX);
        bW.s = 0;
        bW.t = L;
        while (L > 0) {
            bW[--L] = 0
        }
        var z;
        for (z = bW.t - this.t; L < z; ++L) {
            bW[L + this.t] = this.am(0, t[L], bW, L, 0, this.t)
        }
        for (z = Math.min(t.t, bX); L < z; ++L) {
            this.am(0, t[L], bW, L, 0, bX - L)
        }
        bW.clamp()
    }
    function a0(t, bW, L) {
        --bW;
        var z = L.t = this.t + t.t - bW;
        L.s = 0;
        while (--z >= 0) {
            L[z] = 0
        }
        for (z = Math.max(bW - this.t, 0); z < t.t; ++z) {
            L[this.t + z - bW] = this.am(bW - z, t[z], L, 0, 0, this.t + z - bW)
        }
        L.clamp();
        L.drShiftTo(1, L)
    }
    function bR(t) {
        this.r2 = bm();
        this.q3 = bm();
        bf.ONE.dlShiftTo(2 * t.t, this.r2);
        this.mu = this.r2.divide(t);
        this.m = t
    }
    function H(t) {
        if (t.s < 0 || t.t > 2 * this.m.t) {
            return t.mod(this.m)
        } else {
            if (t.compareTo(this.m) < 0) {
                return t
            } else {
                var z = bm();
                t.copyTo(z);
                this.reduce(z);
                return z
            }
        }
    }
    function bM(t) {
        return t
    }
    function D(t) {
        t.drShiftTo(this.m.t - 1, this.r2);
        if (t.t > this.m.t + 1) {
            t.t = this.m.t + 1;
            t.clamp()
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (t.compareTo(this.r2) < 0) {
            t.dAddOffset(1, this.m.t + 1)
        }
        t.subTo(this.r2, t);
        while (t.compareTo(this.m) >= 0) {
            t.subTo(this.m, t)
        }
    }
    function aM(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    function x(t, L, z) {
        t.multiplyTo(L, z);
        this.reduce(z)
    }
    bR.prototype.convert = H;
    bR.prototype.revert = bM;
    bR.prototype.reduce = D;
    bR.prototype.mulTo = x;
    bR.prototype.sqrTo = aM;
    function N(b4, bZ) {
        var b2 = b4.bitLength(), b0, bW = bi(1), b7;
        if (b2 <= 0) {
            return bW
        } else {
            if (b2 < 18) {
                b0 = 1
            } else {
                if (b2 < 48) {
                    b0 = 3
                } else {
                    if (b2 < 144) {
                        b0 = 4
                    } else {
                        if (b2 < 768) {
                            b0 = 5
                        } else {
                            b0 = 6
                        }
                    }
                }
            }
        }
        if (b2 < 8) {
            b7 = new aT(bZ)
        } else {
            if (bZ.isEven()) {
                b7 = new bR(bZ)
            } else {
                b7 = new K(bZ)
            }
        }
        var b3 = new Array()
          , bY = 3
          , b5 = b0 - 1
          , L = (1 << b0) - 1;
        b3[1] = b7.convert(this);
        if (b0 > 1) {
            var ca = bm();
            b7.sqrTo(b3[1], ca);
            while (bY <= L) {
                b3[bY] = bm();
                b7.mulTo(ca, b3[bY - 2], b3[bY]);
                bY += 2
            }
        }
        var b1 = b4.t - 1, b8, b6 = true, bX = bm(), b9;
        b2 = q(b4[b1]) - 1;
        while (b1 >= 0) {
            if (b2 >= b5) {
                b8 = (b4[b1] >> (b2 - b5)) & L
            } else {
                b8 = (b4[b1] & ((1 << (b2 + 1)) - 1)) << (b5 - b2);
                if (b1 > 0) {
                    b8 |= b4[b1 - 1] >> (this.DB + b2 - b5)
                }
            }
            bY = b0;
            while ((b8 & 1) == 0) {
                b8 >>= 1;
                --bY
            }
            if ((b2 -= bY) < 0) {
                b2 += this.DB;
                --b1
            }
            if (b6) {
                b3[b8].copyTo(bW);
                b6 = false
            } else {
                while (bY > 1) {
                    b7.sqrTo(bW, bX);
                    b7.sqrTo(bX, bW);
                    bY -= 2
                }
                if (bY > 0) {
                    b7.sqrTo(bW, bX)
                } else {
                    b9 = bW;
                    bW = bX;
                    bX = b9
                }
                b7.mulTo(bX, b3[b8], bW)
            }
            while (b1 >= 0 && (b4[b1] & (1 << b2)) == 0) {
                b7.sqrTo(bW, bX);
                b9 = bW;
                bW = bX;
                bX = b9;
                if (--b2 < 0) {
                    b2 = this.DB - 1;
                    --b1
                }
            }
        }
        return b7.revert(bW)
    }
    function aB(L) {
        var z = (this.s < 0) ? this.negate() : this.clone();
        var bZ = (L.s < 0) ? L.negate() : L.clone();
        if (z.compareTo(bZ) < 0) {
            var bX = z;
            z = bZ;
            bZ = bX
        }
        var bW = z.getLowestSetBit()
          , bY = bZ.getLowestSetBit();
        if (bY < 0) {
            return z
        }
        if (bW < bY) {
            bY = bW
        }
        if (bY > 0) {
            z.rShiftTo(bY, z);
            bZ.rShiftTo(bY, bZ)
        }
        while (z.signum() > 0) {
            if ((bW = z.getLowestSetBit()) > 0) {
                z.rShiftTo(bW, z)
            }
            if ((bW = bZ.getLowestSetBit()) > 0) {
                bZ.rShiftTo(bW, bZ)
            }
            if (z.compareTo(bZ) >= 0) {
                z.subTo(bZ, z);
                z.rShiftTo(1, z)
            } else {
                bZ.subTo(z, bZ);
                bZ.rShiftTo(1, bZ)
            }
        }
        if (bY > 0) {
            bZ.lShiftTo(bY, bZ)
        }
        return bZ
    }
    function aj(bW) {
        if (bW <= 0) {
            return 0
        }
        var L = this.DV % bW
          , z = (this.s < 0) ? bW - 1 : 0;
        if (this.t > 0) {
            if (L == 0) {
                z = this[0] % bW
            } else {
                for (var t = this.t - 1; t >= 0; --t) {
                    z = (L * z + this[t]) % bW
                }
            }
        }
        return z
    }
    function bS(z) {
        var bY = z.isEven();
        if ((this.isEven() && bY) || z.signum() == 0) {
            return bf.ZERO
        }
        var bX = z.clone()
          , bW = this.clone();
        var L = bi(1)
          , t = bi(0)
          , b0 = bi(0)
          , bZ = bi(1);
        while (bX.signum() != 0) {
            while (bX.isEven()) {
                bX.rShiftTo(1, bX);
                if (bY) {
                    if (!L.isEven() || !t.isEven()) {
                        L.addTo(this, L);
                        t.subTo(z, t)
                    }
                    L.rShiftTo(1, L)
                } else {
                    if (!t.isEven()) {
                        t.subTo(z, t)
                    }
                }
                t.rShiftTo(1, t)
            }
            while (bW.isEven()) {
                bW.rShiftTo(1, bW);
                if (bY) {
                    if (!b0.isEven() || !bZ.isEven()) {
                        b0.addTo(this, b0);
                        bZ.subTo(z, bZ)
                    }
                    b0.rShiftTo(1, b0)
                } else {
                    if (!bZ.isEven()) {
                        bZ.subTo(z, bZ)
                    }
                }
                bZ.rShiftTo(1, bZ)
            }
            if (bX.compareTo(bW) >= 0) {
                bX.subTo(bW, bX);
                if (bY) {
                    L.subTo(b0, L)
                }
                t.subTo(bZ, t)
            } else {
                bW.subTo(bX, bW);
                if (bY) {
                    b0.subTo(L, b0)
                }
                bZ.subTo(t, bZ)
            }
        }
        if (bW.compareTo(bf.ONE) != 0) {
            return bf.ZERO
        }
        if (bZ.compareTo(z) >= 0) {
            return bZ.subtract(z)
        }
        if (bZ.signum() < 0) {
            bZ.addTo(z, bZ)
        } else {
            return bZ
        }
        if (bZ.signum() < 0) {
            return bZ.add(z)
        } else {
            return bZ
        }
    }
    var az = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
    var k = (1 << 26) / az[az.length - 1];
    function bL(bY) {
        var bX, L = this.abs();
        if (L.t == 1 && L[0] <= az[az.length - 1]) {
            for (bX = 0; bX < az.length; ++bX) {
                if (L[0] == az[bX]) {
                    return true
                }
            }
            return false
        }
        if (L.isEven()) {
            return false
        }
        bX = 1;
        while (bX < az.length) {
            var z = az[bX]
              , bW = bX + 1;
            while (bW < az.length && z < k) {
                z *= az[bW++]
            }
            z = L.modInt(z);
            while (bX < bW) {
                if (z % az[bX++] == 0) {
                    return false
                }
            }
        }
        return L.millerRabin(bY)
    }
    function aE(bY) {
        var bZ = this.subtract(bf.ONE);
        var L = bZ.getLowestSetBit();
        if (L <= 0) {
            return false
        }
        var b0 = bZ.shiftRight(L);
        bY = (bY + 1) >> 1;
        if (bY > az.length) {
            bY = az.length
        }
        var z = bm();
        for (var bX = 0; bX < bY; ++bX) {
            z.fromInt(az[Math.floor(Math.random() * az.length)]);
            var b1 = z.modPow(b0, this);
            if (b1.compareTo(bf.ONE) != 0 && b1.compareTo(bZ) != 0) {
                var bW = 1;
                while (bW++ < L && b1.compareTo(bZ) != 0) {
                    b1 = b1.modPowInt(2, this);
                    if (b1.compareTo(bf.ONE) == 0) {
                        return false
                    }
                }
                if (b1.compareTo(bZ) != 0) {
                    return false
                }
            }
        }
        return true
    }
    bf.prototype.chunkSize = aU;
    bf.prototype.toRadix = I;
    bf.prototype.fromRadix = av;
    bf.prototype.fromNumber = aP;
    bf.prototype.bitwiseTo = aJ;
    bf.prototype.changeBit = U;
    bf.prototype.addTo = S;
    bf.prototype.dMultiply = e;
    bf.prototype.dAddOffset = aR;
    bf.prototype.multiplyLowerTo = aQ;
    bf.prototype.multiplyUpperTo = a0;
    bf.prototype.modInt = aj;
    bf.prototype.millerRabin = aE;
    bf.prototype.clone = f;
    bf.prototype.intValue = b;
    bf.prototype.byteValue = bF;
    bf.prototype.shortValue = ag;
    bf.prototype.signum = aZ;
    bf.prototype.toByteArray = aK;
    bf.prototype.equals = bG;
    bf.prototype.min = W;
    bf.prototype.max = bu;
    bf.prototype.and = bO;
    bf.prototype.or = aS;
    bf.prototype.xor = B;
    bf.prototype.andNot = aD;
    bf.prototype.not = T;
    bf.prototype.shiftLeft = aN;
    bf.prototype.shiftRight = R;
    bf.prototype.getLowestSetBit = aq;
    bf.prototype.bitCount = ao;
    bf.prototype.testBit = aL;
    bf.prototype.setBit = a1;
    bf.prototype.clearBit = ah;
    bf.prototype.flipBit = aO;
    bf.prototype.add = bg;
    bf.prototype.subtract = aA;
    bf.prototype.multiply = bH;
    bf.prototype.divide = bd;
    bf.prototype.remainder = bP;
    bf.prototype.divideAndRemainder = bk;
    bf.prototype.modPow = N;
    bf.prototype.modInverse = bS;
    bf.prototype.pow = Q;
    bf.prototype.gcd = aB;
    bf.prototype.isProbablePrime = bL;
    bf.prototype.square = bU;
    function bp() {
        this.i = 0;
        this.j = 0;
        this.S = new Array()
    }
    function af(bX) {
        var bW, z, L;
        for (bW = 0; bW < 256; ++bW) {
            this.S[bW] = bW
        }
        z = 0;
        for (bW = 0; bW < 256; ++bW) {
            z = (z + this.S[bW] + bX[bW % bX.length]) & 255;
            L = this.S[bW];
            this.S[bW] = this.S[z];
            this.S[z] = L
        }
        this.i = 0;
        this.j = 0
    }
    function be() {
        var z;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        z = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = z;
        return this.S[(z + this.S[this.i]) & 255]
    }
    bp.prototype.init = af;
    bp.prototype.next = be;
    function P() {
        return new bp()
    }
    var y = 256;
    var j;
    var l;
    var C;
    if (l == null) {
        l = new Array();
        C = 0;
        var ba;
        if (window.crypto && window.crypto.getRandomValues) {
            var a8 = new Uint32Array(256);
            window.crypto.getRandomValues(a8);
            for (ba = 0; ba < a8.length; ++ba) {
                l[C++] = a8[ba] & 255
            }
        }
        var F = function(z) {
            this.count = this.count || 0;
            if (this.count >= 256 || C >= y) {
                if (window.removeEventListener) {
                    window.removeEventListener("mousemove", F, false)
                } else {
                    if (window.detachEvent) {
                        window.detachEvent("onmousemove", F)
                    }
                }
                return
            }
            try {
                var t = z.x + z.y;
                l[C++] = t & 255;
                this.count += 1
            } catch (L) {}
        };
        if (window.addEventListener) {
            window.addEventListener("mousemove", F, false)
        } else {
            if (window.attachEvent) {
                window.attachEvent("onmousemove", F)
            }
        }
    }
    function bb() {
        if (j == null) {
            j = P();
            while (C < y) {
                var t = Math.floor(65536 * Math.random());
                l[C++] = t & 255
            }
            j.init(l);
            for (C = 0; C < l.length; ++C) {
                l[C] = 0
            }
            C = 0
        }
        return j.next()
    }
    function aY(z) {
        var t;
        for (t = 0; t < z.length; ++t) {
            z[t] = bb()
        }
    }
    function G() {}
    G.prototype.nextBytes = aY;
    function w(z, t) {
        return new bf(z,t)
    }
    function m(L, bW) {
        var t = "";
        var z = 0;
        while (z + bW < L.length) {
            t += L.substring(z, z + bW) + "\n";
            z += bW
        }
        return t + L.substring(z, L.length)
    }
    function br(t) {
        if (t < 16) {
            return "0" + t.toString(16)
        } else {
            return t.toString(16)
        }
    }
    function bD(bW, bZ) {
        if (bZ < bW.length + 11) {
            console.error("Message too long for RSA");
            return null
        }
        var bY = new Array();
        var L = bW.length - 1;
        while (L >= 0 && bZ > 0) {
            var bX = bW.charCodeAt(L--);
            if (bX < 128) {
                bY[--bZ] = bX
            } else {
                if ((bX > 127) && (bX < 2048)) {
                    bY[--bZ] = (bX & 63) | 128;
                    bY[--bZ] = (bX >> 6) | 192
                } else {
                    bY[--bZ] = (bX & 63) | 128;
                    bY[--bZ] = ((bX >> 6) & 63) | 128;
                    bY[--bZ] = (bX >> 12) | 224
                }
            }
        }
        bY[--bZ] = 0;
        var z = new G();
        var t = new Array();
        while (bZ > 2) {
            t[0] = 0;
            while (t[0] == 0) {
                z.nextBytes(t)
            }
            bY[--bZ] = t[0]
        }
        bY[--bZ] = 2;
        bY[--bZ] = 0;
        return new bf(bY)
    }
    function A() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }
    function an(z, t) {
        if (z != null && t != null && z.length > 0 && t.length > 0) {
            this.n = w(z, 16);
            this.e = parseInt(t, 16)
        } else {
            console.error("Invalid RSA public key")
        }
    }
    function bq(t) {
        return t.modPowInt(this.e, this.n)
    }
    function al(L) {
        var t = bD(L, (this.n.bitLength() + 7) >> 3);
        if (t == null) {
            return null
        }
        var bW = this.doPublic(t);
        if (bW == null) {
            return null
        }
        var z = bW.toString(16);
        if ((z.length & 1) == 0) {
            return z
        } else {
            return "0" + z
        }
    }
    A.prototype.doPublic = bq;
    A.prototype.setPublic = an;
    A.prototype.encrypt = al;
    function bo(bW, bY) {
        var t = bW.toByteArray();
        var L = 0;
        while (L < t.length && t[L] == 0) {
            ++L
        }
        if (t.length - L != bY - 1 || t[L] != 2) {
            return null
        }
        ++L;
        while (t[L] != 0) {
            if (++L >= t.length) {
                return null
            }
        }
        var z = "";
        while (++L < t.length) {
            var bX = t[L] & 255;
            if (bX < 128) {
                z += String.fromCharCode(bX)
            } else {
                if ((bX > 191) && (bX < 224)) {
                    z += String.fromCharCode(((bX & 31) << 6) | (t[L + 1] & 63));
                    ++L
                } else {
                    z += String.fromCharCode(((bX & 15) << 12) | ((t[L + 1] & 63) << 6) | (t[L + 2] & 63));
                    L += 2
                }
            }
        }
        return z
    }
    function aC(L, t, z) {
        if (L != null && t != null && L.length > 0 && t.length > 0) {
            this.n = w(L, 16);
            this.e = parseInt(t, 16);
            this.d = w(z, 16)
        } else {
            console.error("Invalid RSA private key")
        }
    }
    function O(bZ, bW, bX, L, z, t, b0, bY) {
        if (bZ != null && bW != null && bZ.length > 0 && bW.length > 0) {
            this.n = w(bZ, 16);
            this.e = parseInt(bW, 16);
            this.d = w(bX, 16);
            this.p = w(L, 16);
            this.q = w(z, 16);
            this.dmp1 = w(t, 16);
            this.dmq1 = w(b0, 16);
            this.coeff = w(bY, 16)
        } else {
            console.error("Invalid RSA private key")
        }
    }
    function ax(L, b2) {
        var z = new G();
        var bZ = L >> 1;
        this.e = parseInt(b2, 16);
        var bW = new bf(b2,16);
        for (; ; ) {
            for (; ; ) {
                this.p = new bf(L - bZ,1,z);
                if (this.p.subtract(bf.ONE).gcd(bW).compareTo(bf.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break
                }
            }
            for (; ; ) {
                this.q = new bf(bZ,1,z);
                if (this.q.subtract(bf.ONE).gcd(bW).compareTo(bf.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var b1 = this.p;
                this.p = this.q;
                this.q = b1
            }
            var b0 = this.p.subtract(bf.ONE);
            var bX = this.q.subtract(bf.ONE);
            var bY = b0.multiply(bX);
            if (bY.gcd(bW).compareTo(bf.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = bW.modInverse(bY);
                this.dmp1 = this.d.mod(b0);
                this.dmq1 = this.d.mod(bX);
                this.coeff = this.q.modInverse(this.p);
                break
            }
        }
    }
    function ay(t) {
        if (this.p == null || this.q == null) {
            return t.modPow(this.d, this.n)
        }
        var L = t.mod(this.p).modPow(this.dmp1, this.p);
        var z = t.mod(this.q).modPow(this.dmq1, this.q);
        while (L.compareTo(z) < 0) {
            L = L.add(this.p)
        }
        return L.subtract(z).multiply(this.coeff).mod(this.p).multiply(this.q).add(z)
    }
    function r(z) {
        var L = w(z, 16);
        var t = this.doPrivate(L);
        if (t == null) {
            return null
        }
        return bo(t, (this.n.bitLength() + 7) >> 3)
    }
    A.prototype.doPrivate = ay;
    A.prototype.setPrivate = aC;
    A.prototype.setPrivateEx = O;
    A.prototype.generate = ax;
    A.prototype.decrypt = r;
    (function() {
        var z = function(b3, b1, b2) {
            var bZ = new G();
            var bW = b3 >> 1;
            this.e = parseInt(b1, 16);
            var bY = new bf(b1,16);
            var b0 = this;
            var bX = function() {
                var b5 = function() {
                    if (b0.p.compareTo(b0.q) <= 0) {
                        var b8 = b0.p;
                        b0.p = b0.q;
                        b0.q = b8
                    }
                    var ca = b0.p.subtract(bf.ONE);
                    var b7 = b0.q.subtract(bf.ONE);
                    var b9 = ca.multiply(b7);
                    if (b9.gcd(bY).compareTo(bf.ONE) == 0) {
                        b0.n = b0.p.multiply(b0.q);
                        b0.d = bY.modInverse(b9);
                        b0.dmp1 = b0.d.mod(ca);
                        b0.dmq1 = b0.d.mod(b7);
                        b0.coeff = b0.q.modInverse(b0.p);
                        setTimeout(function() {
                            b2()
                        }, 0)
                    } else {
                        setTimeout(bX, 0)
                    }
                };
                var b6 = function() {
                    b0.q = bm();
                    b0.q.fromNumberAsync(bW, 1, bZ, function() {
                        b0.q.subtract(bf.ONE).gcda(bY, function(b7) {
                            if (b7.compareTo(bf.ONE) == 0 && b0.q.isProbablePrime(10)) {
                                setTimeout(b5, 0)
                            } else {
                                setTimeout(b6, 0)
                            }
                        })
                    })
                };
                var b4 = function() {
                    b0.p = bm();
                    b0.p.fromNumberAsync(b3 - bW, 1, bZ, function() {
                        b0.p.subtract(bf.ONE).gcda(bY, function(b7) {
                            if (b7.compareTo(bf.ONE) == 0 && b0.p.isProbablePrime(10)) {
                                setTimeout(b6, 0)
                            } else {
                                setTimeout(b4, 0)
                            }
                        })
                    })
                };
                setTimeout(b4, 0)
            };
            setTimeout(bX, 0)
        };
        A.prototype.generateAsync = z;
        var t = function(bX, b3) {
            var bW = (this.s < 0) ? this.negate() : this.clone();
            var b2 = (bX.s < 0) ? bX.negate() : bX.clone();
            if (bW.compareTo(b2) < 0) {
                var bZ = bW;
                bW = b2;
                b2 = bZ
            }
            var bY = bW.getLowestSetBit()
              , b0 = b2.getLowestSetBit();
            if (b0 < 0) {
                b3(bW);
                return
            }
            if (bY < b0) {
                b0 = bY
            }
            if (b0 > 0) {
                bW.rShiftTo(b0, bW);
                b2.rShiftTo(b0, b2)
            }
            var b1 = function() {
                if ((bY = bW.getLowestSetBit()) > 0) {
                    bW.rShiftTo(bY, bW)
                }
                if ((bY = b2.getLowestSetBit()) > 0) {
                    b2.rShiftTo(bY, b2)
                }
                if (bW.compareTo(b2) >= 0) {
                    bW.subTo(b2, bW);
                    bW.rShiftTo(1, bW)
                } else {
                    b2.subTo(bW, b2);
                    b2.rShiftTo(1, b2)
                }
                if (!(bW.signum() > 0)) {
                    if (b0 > 0) {
                        b2.lShiftTo(b0, b2)
                    }
                    setTimeout(function() {
                        b3(b2)
                    }, 0)
                } else {
                    setTimeout(b1, 0)
                }
            };
            setTimeout(b1, 10)
        };
        bf.prototype.gcda = t;
        var L = function(b0, bX, b3, b2) {
            if ("number" == typeof bX) {
                if (b0 < 2) {
                    this.fromInt(1)
                } else {
                    this.fromNumber(b0, b3);
                    if (!this.testBit(b0 - 1)) {
                        this.bitwiseTo(bf.ONE.shiftLeft(b0 - 1), ak, this)
                    }
                    if (this.isEven()) {
                        this.dAddOffset(1, 0)
                    }
                    var bZ = this;
                    var bY = function() {
                        bZ.dAddOffset(2, 0);
                        if (bZ.bitLength() > b0) {
                            bZ.subTo(bf.ONE.shiftLeft(b0 - 1), bZ)
                        }
                        if (bZ.isProbablePrime(bX)) {
                            setTimeout(function() {
                                b2()
                            }, 0)
                        } else {
                            setTimeout(bY, 0)
                        }
                    };
                    setTimeout(bY, 0)
                }
            } else {
                var bW = new Array()
                  , b1 = b0 & 7;
                bW.length = (b0 >> 3) + 1;
                bX.nextBytes(bW);
                if (b1 > 0) {
                    bW[0] &= ((1 << b1) - 1)
                } else {
                    bW[0] = 0
                }
                this.fromString(bW, 256)
            }
        };
        bf.prototype.fromNumberAsync = L
    }
    )();
    var a4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var J = "=";
    function ae(L) {
        var z;
        var bW;
        var t = "";
        for (z = 0; z + 3 <= L.length; z += 3) {
            bW = parseInt(L.substring(z, z + 3), 16);
            t += a4.charAt(bW >> 6) + a4.charAt(bW & 63)
        }
        if (z + 1 == L.length) {
            bW = parseInt(L.substring(z, z + 1), 16);
            t += a4.charAt(bW << 2)
        } else {
            if (z + 2 == L.length) {
                bW = parseInt(L.substring(z, z + 2), 16);
                t += a4.charAt(bW >> 2) + a4.charAt((bW & 3) << 4)
            }
        }
        while ((t.length & 3) > 0) {
            t += J
        }
        return t
    }
    function aW(bX) {
        var L = "";
        var bW;
        var t = 0;
        var z;
        for (bW = 0; bW < bX.length; ++bW) {
            if (bX.charAt(bW) == J) {
                break
            }
            v = a4.indexOf(bX.charAt(bW));
            if (v < 0) {
                continue
            }
            if (t == 0) {
                L += Y(v >> 2);
                z = v & 3;
                t = 1
            } else {
                if (t == 1) {
                    L += Y((z << 2) | (v >> 4));
                    z = v & 15;
                    t = 2
                } else {
                    if (t == 2) {
                        L += Y(z);
                        L += Y(v >> 2);
                        z = v & 3;
                        t = 3
                    } else {
                        L += Y((z << 2) | (v >> 4));
                        L += Y(v & 15);
                        t = 0
                    }
                }
            }
        }
        if (t == 1) {
            L += Y(z << 2)
        }
        return L
    }
    function M(bW) {
        var L = aW(bW);
        var z;
        var t = new Array();
        for (z = 0; 2 * z < L.length; ++z) {
            t[z] = parseInt(L.substring(2 * z, 2 * z + 2), 16)
        }
        return t
    }
    /*! asn1-1.0.2.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
    var at = at || {};
    at.env = at.env || {};
    var bn = at
      , aw = Object.prototype
      , ar = "[object Function]"
      , X = ["toString", "valueOf"];
    at.env.parseUA = function(bW) {
        var bX = function(b1) {
            var b2 = 0;
            return parseFloat(b1.replace(/\./g, function() {
                return (b2++ == 1) ? "" : "."
            }))
        }, b0 = navigator, bZ = {
            ie: 0,
            opera: 0,
            gecko: 0,
            webkit: 0,
            chrome: 0,
            mobile: null,
            air: 0,
            ipad: 0,
            iphone: 0,
            ipod: 0,
            ios: null,
            android: 0,
            webos: 0,
            caja: b0 && b0.cajaVersion,
            secure: false,
            os: null
        }, L = bW || (navigator && navigator.userAgent), bY = window && window.location, z = bY && bY.href, t;
        bZ.secure = z && (z.toLowerCase().indexOf("https") === 0);
        if (L) {
            if ((/windows|win32/i).test(L)) {
                bZ.os = "windows"
            } else {
                if ((/macintosh/i).test(L)) {
                    bZ.os = "macintosh"
                } else {
                    if ((/rhino/i).test(L)) {
                        bZ.os = "rhino"
                    }
                }
            }
            if ((/KHTML/).test(L)) {
                bZ.webkit = 1
            }
            t = L.match(/AppleWebKit\/([^\s]*)/);
            if (t && t[1]) {
                bZ.webkit = bX(t[1]);
                if (/ Mobile\//.test(L)) {
                    bZ.mobile = "Apple";
                    t = L.match(/OS ([^\s]*)/);
                    if (t && t[1]) {
                        t = bX(t[1].replace("_", "."))
                    }
                    bZ.ios = t;
                    bZ.ipad = bZ.ipod = bZ.iphone = 0;
                    t = L.match(/iPad|iPod|iPhone/);
                    if (t && t[0]) {
                        bZ[t[0].toLowerCase()] = bZ.ios
                    }
                } else {
                    t = L.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                    if (t) {
                        bZ.mobile = t[0]
                    }
                    if (/webOS/.test(L)) {
                        bZ.mobile = "WebOS";
                        t = L.match(/webOS\/([^\s]*);/);
                        if (t && t[1]) {
                            bZ.webos = bX(t[1])
                        }
                    }
                    if (/ Android/.test(L)) {
                        bZ.mobile = "Android";
                        t = L.match(/Android ([^\s]*);/);
                        if (t && t[1]) {
                            bZ.android = bX(t[1])
                        }
                    }
                }
                t = L.match(/Chrome\/([^\s]*)/);
                if (t && t[1]) {
                    bZ.chrome = bX(t[1])
                } else {
                    t = L.match(/AdobeAIR\/([^\s]*)/);
                    if (t) {
                        bZ.air = t[0]
                    }
                }
            }
            if (!bZ.webkit) {
                t = L.match(/Opera[\s\/]([^\s]*)/);
                if (t && t[1]) {
                    bZ.opera = bX(t[1]);
                    t = L.match(/Version\/([^\s]*)/);
                    if (t && t[1]) {
                        bZ.opera = bX(t[1])
                    }
                    t = L.match(/Opera Mini[^;]*/);
                    if (t) {
                        bZ.mobile = t[0]
                    }
                } else {
                    t = L.match(/MSIE\s([^;]*)/);
                    if (t && t[1]) {
                        bZ.ie = bX(t[1])
                    } else {
                        t = L.match(/Gecko\/([^\s]*)/);
                        if (t) {
                            bZ.gecko = 1;
                            t = L.match(/rv:([^\s\)]*)/);
                            if (t && t[1]) {
                                bZ.gecko = bX(t[1])
                            }
                        }
                    }
                }
            }
        }
        return bZ
    }
    ;
    at.env.ua = at.env.parseUA();
    at.isFunction = function(t) {
        return (typeof t === "function") || aw.toString.apply(t) === ar
    }
    ;
    at._IEEnumFix = (at.env.ua.ie) ? function(L, z) {
        var t, bX, bW;
        for (t = 0; t < X.length; t = t + 1) {
            bX = X[t];
            bW = z[bX];
            if (bn.isFunction(bW) && bW != aw[bX]) {
                L[bX] = bW
            }
        }
    }
    : function() {}
    ;
    at.extend = function(bW, bX, L) {
        if (!bX || !bW) {
            throw new Error("extend failed, please check that " + "all dependencies are included.")
        }
        var z = function() {}, t;
        z.prototype = bX.prototype;
        bW.prototype = new z();
        bW.prototype.constructor = bW;
        bW.superclass = bX.prototype;
        if (bX.prototype.constructor == aw.constructor) {
            bX.prototype.constructor = bX
        }
        if (L) {
            for (t in L) {
                if (bn.hasOwnProperty(L, t)) {
                    bW.prototype[t] = L[t]
                }
            }
            bn._IEEnumFix(bW.prototype, L)
        }
    }
    ;
    if (typeof KJUR == "undefined" || !KJUR) {
        KJUR = {}
    }
    if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) {
        KJUR.asn1 = {}
    }
    KJUR.asn1.ASN1Util = new function() {
        this.integerToByteHex = function(t) {
            var z = t.toString(16);
            if ((z.length % 2) == 1) {
                z = "0" + z
            }
            return z
        }
        ;
        this.bigIntToMinTwosComplementsHex = function(b0) {
            var bY = b0.toString(16);
            if (bY.substr(0, 1) != "-") {
                if (bY.length % 2 == 1) {
                    bY = "0" + bY
                } else {
                    if (!bY.match(/^[0-7]/)) {
                        bY = "00" + bY
                    }
                }
            } else {
                var t = bY.substr(1);
                var bX = t.length;
                if (bX % 2 == 1) {
                    bX += 1
                } else {
                    if (!bY.match(/^[0-7]/)) {
                        bX += 2
                    }
                }
                var bZ = "";
                for (var bW = 0; bW < bX; bW++) {
                    bZ += "f"
                }
                var L = new bf(bZ,16);
                var z = L.xor(b0).add(bf.ONE);
                bY = z.toString(16).replace(/^-/, "")
            }
            return bY
        }
        ;
        this.getPEMStringFromHex = function(t, z) {
            var bX = CryptoJS.enc.Hex.parse(t);
            var L = CryptoJS.enc.Base64.stringify(bX);
            var bW = L.replace(/(.{64})/g, "$1\r\n");
            bW = bW.replace(/\r\n$/, "");
            return "-----BEGIN " + z + "-----\r\n" + bW + "\r\n-----END " + z + "-----\r\n"
        }
    }
    ;
    KJUR.asn1.ASN1Object = function() {
        var L = true;
        var z = null;
        var bW = "00";
        var bX = "00";
        var t = "";
        this.getLengthHexFromValue = function() {
            if (typeof this.hV == "undefined" || this.hV == null) {
                throw "this.hV is null or undefined."
            }
            if (this.hV.length % 2 == 1) {
                throw "value hex must be even length: n=" + t.length + ",v=" + this.hV
            }
            var b1 = this.hV.length / 2;
            var b0 = b1.toString(16);
            if (b0.length % 2 == 1) {
                b0 = "0" + b0
            }
            if (b1 < 128) {
                return b0
            } else {
                var bZ = b0.length / 2;
                if (bZ > 15) {
                    throw "ASN.1 length too long to represent by 8x: n = " + b1.toString(16)
                }
                var bY = 128 + bZ;
                return bY.toString(16) + b0
            }
        }
        ;
        this.getEncodedHex = function() {
            if (this.hTLV == null || this.isModified) {
                this.hV = this.getFreshValueHex();
                this.hL = this.getLengthHexFromValue();
                this.hTLV = this.hT + this.hL + this.hV;
                this.isModified = false
            }
            return this.hTLV
        }
        ;
        this.getValueHex = function() {
            this.getEncodedHex();
            return this.hV
        }
        ;
        this.getFreshValueHex = function() {
            return ""
        }
    }
    ;
    KJUR.asn1.DERAbstractString = function(L) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
        var z = null;
        var t = null;
        this.getString = function() {
            return this.s
        }
        ;
        this.setString = function(bW) {
            this.hTLV = null;
            this.isModified = true;
            this.s = bW;
            this.hV = stohex(this.s)
        }
        ;
        this.setStringHex = function(bW) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = bW
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
        ;
        if (typeof L != "undefined") {
            if (typeof L["str"] != "undefined") {
                this.setString(L["str"])
            } else {
                if (typeof L["hex"] != "undefined") {
                    this.setStringHex(L["hex"])
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERAbstractTime = function(L) {
        KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
        var z = null;
        var t = null;
        this.localDateToUTC = function(bX) {
            utc = bX.getTime() + (bX.getTimezoneOffset() * 60000);
            var bW = new Date(utc);
            return bW
        }
        ;
        this.formatDate = function(b1, b3) {
            var bW = this.zeroPadding;
            var b2 = this.localDateToUTC(b1);
            var b4 = String(b2.getFullYear());
            if (b3 == "utc") {
                b4 = b4.substr(2, 2)
            }
            var b0 = bW(String(b2.getMonth() + 1), 2);
            var b5 = bW(String(b2.getDate()), 2);
            var bX = bW(String(b2.getHours()), 2);
            var bY = bW(String(b2.getMinutes()), 2);
            var bZ = bW(String(b2.getSeconds()), 2);
            return b4 + b0 + b5 + bX + bY + bZ + "Z"
        }
        ;
        this.zeroPadding = function(bX, bW) {
            if (bX.length >= bW) {
                return bX
            }
            return new Array(bW - bX.length + 1).join("0") + bX
        }
        ;
        this.getString = function() {
            return this.s
        }
        ;
        this.setString = function(bW) {
            this.hTLV = null;
            this.isModified = true;
            this.s = bW;
            this.hV = stohex(this.s)
        }
        ;
        this.setByDateValue = function(b0, b2, bX, bW, bY, bZ) {
            var b1 = new Date(Date.UTC(b0, b2 - 1, bX, bW, bY, bZ, 0));
            this.setByDate(b1)
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
    }
    ;
    at.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERAbstractStructured = function(z) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
        var t = null;
        this.setByASN1ObjectArray = function(L) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array = L
        }
        ;
        this.appendASN1Object = function(L) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array.push(L)
        }
        ;
        this.asn1Array = new Array();
        if (typeof z != "undefined") {
            if (typeof z["array"] != "undefined") {
                this.asn1Array = z["array"]
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERBoolean = function() {
        KJUR.asn1.DERBoolean.superclass.constructor.call(this);
        this.hT = "01";
        this.hTLV = "0101ff"
    }
    ;
    at.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERInteger = function(t) {
        KJUR.asn1.DERInteger.superclass.constructor.call(this);
        this.hT = "02";
        this.setByBigInteger = function(z) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(z)
        }
        ;
        this.setByInteger = function(L) {
            var z = new bf(String(L),10);
            this.setByBigInteger(z)
        }
        ;
        this.setValueHex = function(z) {
            this.hV = z
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
        ;
        if (typeof t != "undefined") {
            if (typeof t["bigint"] != "undefined") {
                this.setByBigInteger(t["bigint"])
            } else {
                if (typeof t["int"] != "undefined") {
                    this.setByInteger(t["int"])
                } else {
                    if (typeof t["hex"] != "undefined") {
                        this.setValueHex(t["hex"])
                    }
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERBitString = function(t) {
        KJUR.asn1.DERBitString.superclass.constructor.call(this);
        this.hT = "03";
        this.setHexValueIncludingUnusedBits = function(z) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = z
        }
        ;
        this.setUnusedBitsAndHexValue = function(z, bW) {
            if (z < 0 || 7 < z) {
                throw "unused bits shall be from 0 to 7: u = " + z
            }
            var L = "0" + z;
            this.hTLV = null;
            this.isModified = true;
            this.hV = L + bW
        }
        ;
        this.setByBinaryString = function(bW) {
            bW = bW.replace(/0+$/, "");
            var bX = 8 - bW.length % 8;
            if (bX == 8) {
                bX = 0
            }
            for (var bY = 0; bY <= bX; bY++) {
                bW += "0"
            }
            var bZ = "";
            for (var bY = 0; bY < bW.length - 1; bY += 8) {
                var L = bW.substr(bY, 8);
                var z = parseInt(L, 2).toString(16);
                if (z.length == 1) {
                    z = "0" + z
                }
                bZ += z
            }
            this.hTLV = null;
            this.isModified = true;
            this.hV = "0" + bX + bZ
        }
        ;
        this.setByBooleanArray = function(bW) {
            var L = "";
            for (var z = 0; z < bW.length; z++) {
                if (bW[z] == true) {
                    L += "1"
                } else {
                    L += "0"
                }
            }
            this.setByBinaryString(L)
        }
        ;
        this.newFalseArray = function(bW) {
            var z = new Array(bW);
            for (var L = 0; L < bW; L++) {
                z[L] = false
            }
            return z
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
        ;
        if (typeof t != "undefined") {
            if (typeof t["hex"] != "undefined") {
                this.setHexValueIncludingUnusedBits(t["hex"])
            } else {
                if (typeof t["bin"] != "undefined") {
                    this.setByBinaryString(t["bin"])
                } else {
                    if (typeof t["array"] != "undefined") {
                        this.setByBooleanArray(t["array"])
                    }
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
    KJUR.asn1.DEROctetString = function(t) {
        KJUR.asn1.DEROctetString.superclass.constructor.call(this, t);
        this.hT = "04"
    }
    ;
    at.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERNull = function() {
        KJUR.asn1.DERNull.superclass.constructor.call(this);
        this.hT = "05";
        this.hTLV = "0500"
    }
    ;
    at.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERObjectIdentifier = function(L) {
        var z = function(bW) {
            var bX = bW.toString(16);
            if (bX.length == 1) {
                bX = "0" + bX
            }
            return bX
        };
        var t = function(b1) {
            var b0 = "";
            var bX = new bf(b1,10);
            var bW = bX.toString(2);
            var bY = 7 - bW.length % 7;
            if (bY == 7) {
                bY = 0
            }
            var b3 = "";
            for (var bZ = 0; bZ < bY; bZ++) {
                b3 += "0"
            }
            bW = b3 + bW;
            for (var bZ = 0; bZ < bW.length - 1; bZ += 7) {
                var b2 = bW.substr(bZ, 7);
                if (bZ != bW.length - 7) {
                    b2 = "1" + b2
                }
                b0 += z(parseInt(b2, 2))
            }
            return b0
        };
        KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
        this.hT = "06";
        this.setValueHex = function(bW) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = bW
        }
        ;
        this.setValueOidString = function(bY) {
            if (!bY.match(/^[0-9.]+$/)) {
                throw "malformed oid string: " + bY
            }
            var bZ = "";
            var bW = bY.split(".");
            var b0 = parseInt(bW[0]) * 40 + parseInt(bW[1]);
            bZ += z(b0);
            bW.splice(0, 2);
            for (var bX = 0; bX < bW.length; bX++) {
                bZ += t(bW[bX])
            }
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = bZ
        }
        ;
        this.setValueName = function(bX) {
            if (typeof KJUR.asn1.x509.OID.name2oidList[bX] != "undefined") {
                var bW = KJUR.asn1.x509.OID.name2oidList[bX];
                this.setValueOidString(bW)
            } else {
                throw "DERObjectIdentifier oidName undefined: " + bX
            }
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
        ;
        if (typeof L != "undefined") {
            if (typeof L["oid"] != "undefined") {
                this.setValueOidString(L["oid"])
            } else {
                if (typeof L["hex"] != "undefined") {
                    this.setValueHex(L["hex"])
                } else {
                    if (typeof L["name"] != "undefined") {
                        this.setValueName(L["name"])
                    }
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
    KJUR.asn1.DERUTF8String = function(t) {
        KJUR.asn1.DERUTF8String.superclass.constructor.call(this, t);
        this.hT = "0c"
    }
    ;
    at.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERNumericString = function(t) {
        KJUR.asn1.DERNumericString.superclass.constructor.call(this, t);
        this.hT = "12"
    }
    ;
    at.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERPrintableString = function(t) {
        KJUR.asn1.DERPrintableString.superclass.constructor.call(this, t);
        this.hT = "13"
    }
    ;
    at.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERTeletexString = function(t) {
        KJUR.asn1.DERTeletexString.superclass.constructor.call(this, t);
        this.hT = "14"
    }
    ;
    at.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERIA5String = function(t) {
        KJUR.asn1.DERIA5String.superclass.constructor.call(this, t);
        this.hT = "16"
    }
    ;
    at.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
    KJUR.asn1.DERUTCTime = function(t) {
        KJUR.asn1.DERUTCTime.superclass.constructor.call(this, t);
        this.hT = "17";
        this.setByDate = function(z) {
            this.hTLV = null;
            this.isModified = true;
            this.date = z;
            this.s = this.formatDate(this.date, "utc");
            this.hV = stohex(this.s)
        }
        ;
        if (typeof t != "undefined") {
            if (typeof t["str"] != "undefined") {
                this.setString(t["str"])
            } else {
                if (typeof t["hex"] != "undefined") {
                    this.setStringHex(t["hex"])
                } else {
                    if (typeof t["date"] != "undefined") {
                        this.setByDate(t["date"])
                    }
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
    KJUR.asn1.DERGeneralizedTime = function(t) {
        KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, t);
        this.hT = "18";
        this.setByDate = function(z) {
            this.hTLV = null;
            this.isModified = true;
            this.date = z;
            this.s = this.formatDate(this.date, "gen");
            this.hV = stohex(this.s)
        }
        ;
        if (typeof t != "undefined") {
            if (typeof t["str"] != "undefined") {
                this.setString(t["str"])
            } else {
                if (typeof t["hex"] != "undefined") {
                    this.setStringHex(t["hex"])
                } else {
                    if (typeof t["date"] != "undefined") {
                        this.setByDate(t["date"])
                    }
                }
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
    KJUR.asn1.DERSequence = function(t) {
        KJUR.asn1.DERSequence.superclass.constructor.call(this, t);
        this.hT = "30";
        this.getFreshValueHex = function() {
            var L = "";
            for (var z = 0; z < this.asn1Array.length; z++) {
                var bW = this.asn1Array[z];
                L += bW.getEncodedHex()
            }
            this.hV = L;
            return this.hV
        }
    }
    ;
    at.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
    KJUR.asn1.DERSet = function(t) {
        KJUR.asn1.DERSet.superclass.constructor.call(this, t);
        this.hT = "31";
        this.getFreshValueHex = function() {
            var z = new Array();
            for (var L = 0; L < this.asn1Array.length; L++) {
                var bW = this.asn1Array[L];
                z.push(bW.getEncodedHex())
            }
            z.sort();
            this.hV = z.join("");
            return this.hV
        }
    }
    ;
    at.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
    KJUR.asn1.DERTaggedObject = function(t) {
        KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
        this.hT = "a0";
        this.hV = "";
        this.isExplicit = true;
        this.asn1Object = null;
        this.setASN1Object = function(z, L, bW) {
            this.hT = L;
            this.isExplicit = z;
            this.asn1Object = bW;
            if (this.isExplicit) {
                this.hV = this.asn1Object.getEncodedHex();
                this.hTLV = null;
                this.isModified = true
            } else {
                this.hV = null;
                this.hTLV = bW.getEncodedHex();
                this.hTLV = this.hTLV.replace(/^../, L);
                this.isModified = false
            }
        }
        ;
        this.getFreshValueHex = function() {
            return this.hV
        }
        ;
        if (typeof t != "undefined") {
            if (typeof t["tag"] != "undefined") {
                this.hT = t["tag"]
            }
            if (typeof t["explicit"] != "undefined") {
                this.isExplicit = t["explicit"]
            }
            if (typeof t["obj"] != "undefined") {
                this.asn1Object = t["obj"];
                this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)
            }
        }
    }
    ;
    at.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);
    (function(z) {
        var t = {}, L;
        t.decode = function(bW) {
            var bY;
            if (L === z) {
                var bZ = "0123456789ABCDEF"
                  , b3 = " \f\n\r\t\u00A0\u2028\u2029";
                L = [];
                for (bY = 0; bY < 16; ++bY) {
                    L[bZ.charAt(bY)] = bY
                }
                bZ = bZ.toLowerCase();
                for (bY = 10; bY < 16; ++bY) {
                    L[bZ.charAt(bY)] = bY
                }
                for (bY = 0; bY < b3.length; ++bY) {
                    L[b3.charAt(bY)] = -1
                }
            }
            var bX = []
              , b0 = 0
              , b2 = 0;
            for (bY = 0; bY < bW.length; ++bY) {
                var b1 = bW.charAt(bY);
                if (b1 == "=") {
                    break
                }
                b1 = L[b1];
                if (b1 == -1) {
                    continue
                }
                if (b1 === z) {
                    throw "Illegal character at offset " + bY
                }
                b0 |= b1;
                if (++b2 >= 2) {
                    bX[bX.length] = b0;
                    b0 = 0;
                    b2 = 0
                } else {
                    b0 <<= 4
                }
            }
            if (b2) {
                throw "Hex encoding incomplete: 4 bits missing"
            }
            return bX
        }
        ;
        window.Hex = t
    }
    )();
    (function(z) {
        var t = {}, L;
        t.decode = function(bW) {
            var bZ;
            if (L === z) {
                var bY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                  , b3 = "= \f\n\r\t\u00A0\u2028\u2029";
                L = [];
                for (bZ = 0; bZ < 64; ++bZ) {
                    L[bY.charAt(bZ)] = bZ
                }
                for (bZ = 0; bZ < b3.length; ++bZ) {
                    L[b3.charAt(bZ)] = -1
                }
            }
            var bX = [];
            var b0 = 0
              , b2 = 0;
            for (bZ = 0; bZ < bW.length; ++bZ) {
                var b1 = bW.charAt(bZ);
                if (b1 == "=") {
                    break
                }
                b1 = L[b1];
                if (b1 == -1) {
                    continue
                }
                if (b1 === z) {
                    throw "Illegal character at offset " + bZ
                }
                b0 |= b1;
                if (++b2 >= 4) {
                    bX[bX.length] = (b0 >> 16);
                    bX[bX.length] = (b0 >> 8) & 255;
                    bX[bX.length] = b0 & 255;
                    b0 = 0;
                    b2 = 0
                } else {
                    b0 <<= 6
                }
            }
            switch (b2) {
            case 1:
                throw "Base64 encoding incomplete: at least 2 bits missing";
            case 2:
                bX[bX.length] = (b0 >> 10);
                break;
            case 3:
                bX[bX.length] = (b0 >> 16);
                bX[bX.length] = (b0 >> 8) & 255;
                break
            }
            return bX
        }
        ;
        t.re = /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/;
        t.unarmor = function(bX) {
            var bW = t.re.exec(bX);
            if (bW) {
                if (bW[1]) {
                    bX = bW[1]
                } else {
                    if (bW[2]) {
                        bX = bW[2]
                    } else {
                        throw "RegExp out of sync"
                    }
                }
            }
            return t.decode(bX)
        }
        ;
       EncBase64 = t
    }
    )();
    (function(bY) {
        var z = 100
          , t = "\u2026"
          , L = {
            tag: function(b0, b1) {
                var bZ = document.createElement(b0);
                bZ.className = b1;
                return bZ
            },
            text: function(bZ) {
                return document.createTextNode(bZ)
            }
        };
        function bX(bZ, b0) {
            if (bZ instanceof bX) {
                this.enc = bZ.enc;
                this.pos = bZ.pos
            } else {
                this.enc = bZ;
                this.pos = b0
            }
        }
        bX.prototype.get = function(bZ) {
            if (bZ === bY) {
                bZ = this.pos++
            }
            if (bZ >= this.enc.length) {
                throw "Requesting byte offset " + bZ + " on a stream of length " + this.enc.length
            }
            return this.enc[bZ]
        }
        ;
        bX.prototype.hexDigits = "0123456789ABCDEF";
        bX.prototype.hexByte = function(bZ) {
            return this.hexDigits.charAt((bZ >> 4) & 15) + this.hexDigits.charAt(bZ & 15)
        }
        ;
        bX.prototype.hexDump = function(b3, bZ, b0) {
            var b2 = "";
            for (var b1 = b3; b1 < bZ; ++b1) {
                b2 += this.hexByte(this.get(b1));
                if (b0 !== true) {
                    switch (b1 & 15) {
                    case 7:
                        b2 += "  ";
                        break;
                    case 15:
                        b2 += "\n";
                        break;
                    default:
                        b2 += " "
                    }
                }
            }
            return b2
        }
        ;
        bX.prototype.parseStringISO = function(b2, bZ) {
            var b1 = "";
            for (var b0 = b2; b0 < bZ; ++b0) {
                b1 += String.fromCharCode(this.get(b0))
            }
            return b1
        }
        ;
        bX.prototype.parseStringUTF = function(b3, bZ) {
            var b1 = "";
            for (var b0 = b3; b0 < bZ; ) {
                var b2 = this.get(b0++);
                if (b2 < 128) {
                    b1 += String.fromCharCode(b2)
                } else {
                    if ((b2 > 191) && (b2 < 224)) {
                        b1 += String.fromCharCode(((b2 & 31) << 6) | (this.get(b0++) & 63))
                    } else {
                        b1 += String.fromCharCode(((b2 & 15) << 12) | ((this.get(b0++) & 63) << 6) | (this.get(b0++) & 63))
                    }
                }
            }
            return b1
        }
        ;
        bX.prototype.parseStringBMP = function(b4, b0) {
            var b3 = "";
            for (var b2 = b4; b2 < b0; b2 += 2) {
                var bZ = this.get(b2);
                var b1 = this.get(b2 + 1);
                b3 += String.fromCharCode((bZ << 8) + b1)
            }
            return b3
        }
        ;
        bX.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
        bX.prototype.parseTime = function(b2, b0) {
            var b1 = this.parseStringISO(b2, b0)
              , bZ = this.reTime.exec(b1);
            if (!bZ) {
                return "Unrecognized time: " + b1
            }
            b1 = bZ[1] + "-" + bZ[2] + "-" + bZ[3] + " " + bZ[4];
            if (bZ[5]) {
                b1 += ":" + bZ[5];
                if (bZ[6]) {
                    b1 += ":" + bZ[6];
                    if (bZ[7]) {
                        b1 += "." + bZ[7]
                    }
                }
            }
            if (bZ[8]) {
                b1 += " UTC";
                if (bZ[8] != "Z") {
                    b1 += bZ[8];
                    if (bZ[9]) {
                        b1 += ":" + bZ[9]
                    }
                }
            }
            return b1
        }
        ;
        bX.prototype.parseInteger = function(b4, b0) {
            var bZ = b0 - b4;
            if (bZ > 4) {
                bZ <<= 3;
                var b2 = this.get(b4);
                if (b2 === 0) {
                    bZ -= 8
                } else {
                    while (b2 < 128) {
                        b2 <<= 1;
                        --bZ
                    }
                }
                return "(" + bZ + " bit)"
            }
            var b3 = 0;
            for (var b1 = b4; b1 < b0; ++b1) {
                b3 = (b3 << 8) | this.get(b1)
            }
            return b3
        }
        ;
        bX.prototype.parseBitString = function(bZ, b0) {
            var b4 = this.get(bZ)
              , b2 = ((b0 - bZ - 1) << 3) - b4
              , b7 = "(" + b2 + " bit)";
            if (b2 <= 20) {
                var b6 = b4;
                b7 += " ";
                for (var b3 = b0 - 1; b3 > bZ; --b3) {
                    var b5 = this.get(b3);
                    for (var b1 = b6; b1 < 8; ++b1) {
                        b7 += (b5 >> b1) & 1 ? "1" : "0"
                    }
                    b6 = 0
                }
            }
            return b7
        }
        ;
        bX.prototype.parseOctetString = function(b3, b0) {
            var bZ = b0 - b3
              , b2 = "(" + bZ + " byte) ";
            if (bZ > z) {
                b0 = b3 + z
            }
            for (var b1 = b3; b1 < b0; ++b1) {
                b2 += this.hexByte(this.get(b1))
            }
            if (bZ > z) {
                b2 += t
            }
            return b2
        }
        ;
        bX.prototype.parseOID = function(b6, b0) {
            var b3 = ""
              , b5 = 0
              , b4 = 0;
            for (var b2 = b6; b2 < b0; ++b2) {
                var b1 = this.get(b2);
                b5 = (b5 << 7) | (b1 & 127);
                b4 += 7;
                if (!(b1 & 128)) {
                    if (b3 === "") {
                        var bZ = b5 < 80 ? b5 < 40 ? 0 : 1 : 2;
                        b3 = bZ + "." + (b5 - bZ * 40)
                    } else {
                        b3 += "." + ((b4 >= 31) ? "bigint" : b5)
                    }
                    b5 = b4 = 0
                }
            }
            return b3
        }
        ;
        function bW(b2, b3, b1, bZ, b0) {
            this.stream = b2;
            this.header = b3;
            this.length = b1;
            this.tag = bZ;
            this.sub = b0
        }
        bW.prototype.typeName = function() {
            if (this.tag === bY) {
                return "unknown"
            }
            var b1 = this.tag >> 6
              , bZ = (this.tag >> 5) & 1
              , b0 = this.tag & 31;
            switch (b1) {
            case 0:
                switch (b0) {
                case 0:
                    return "EOC";
                case 1:
                    return "BOOLEAN";
                case 2:
                    return "INTEGER";
                case 3:
                    return "BIT_STRING";
                case 4:
                    return "OCTET_STRING";
                case 5:
                    return "NULL";
                case 6:
                    return "OBJECT_IDENTIFIER";
                case 7:
                    return "ObjectDescriptor";
                case 8:
                    return "EXTERNAL";
                case 9:
                    return "REAL";
                case 10:
                    return "ENUMERATED";
                case 11:
                    return "EMBEDDED_PDV";
                case 12:
                    return "UTF8String";
                case 16:
                    return "SEQUENCE";
                case 17:
                    return "SET";
                case 18:
                    return "NumericString";
                case 19:
                    return "PrintableString";
                case 20:
                    return "TeletexString";
                case 21:
                    return "VideotexString";
                case 22:
                    return "IA5String";
                case 23:
                    return "UTCTime";
                case 24:
                    return "GeneralizedTime";
                case 25:
                    return "GraphicString";
                case 26:
                    return "VisibleString";
                case 27:
                    return "GeneralString";
                case 28:
                    return "UniversalString";
                case 30:
                    return "BMPString";
                default:
                    return "Universal_" + b0.toString(16)
                }
            case 1:
                return "Application_" + b0.toString(16);
            case 2:
                return "[" + b0 + "]";
            case 3:
                return "Private_" + b0.toString(16)
            }
        }
        ;
        bW.prototype.reSeemsASCII = /^[ -~]+$/;
        bW.prototype.content = function() {
            if (this.tag === bY) {
                return null
            }
            var b3 = this.tag >> 6
              , b0 = this.tag & 31
              , b2 = this.posContent()
              , bZ = Math.abs(this.length);
            if (b3 !== 0) {
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)"
                }
                var b1 = this.stream.parseStringISO(b2, b2 + Math.min(bZ, z));
                if (this.reSeemsASCII.test(b1)) {
                    return b1.substring(0, 2 * z) + ((b1.length > 2 * z) ? t : "")
                } else {
                    return this.stream.parseOctetString(b2, b2 + bZ)
                }
            }
            switch (b0) {
            case 1:
                return (this.stream.get(b2) === 0) ? "false" : "true";
            case 2:
                return this.stream.parseInteger(b2, b2 + bZ);
            case 3:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(b2, b2 + bZ);
            case 4:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(b2, b2 + bZ);
            case 6:
                return this.stream.parseOID(b2, b2 + bZ);
            case 16:
            case 17:
                return "(" + this.sub.length + " elem)";
            case 12:
                return this.stream.parseStringUTF(b2, b2 + bZ);
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 26:
                return this.stream.parseStringISO(b2, b2 + bZ);
            case 30:
                return this.stream.parseStringBMP(b2, b2 + bZ);
            case 23:
            case 24:
                return this.stream.parseTime(b2, b2 + bZ)
            }
            return null
        }
        ;
        bW.prototype.toString = function() {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]"
        }
        ;
        bW.prototype.print = function(b0) {
            if (b0 === bY) {
                b0 = ""
            }
            document.writeln(b0 + this);
            if (this.sub !== null) {
                b0 += "  ";
                for (var b1 = 0, bZ = this.sub.length; b1 < bZ; ++b1) {
                    this.sub[b1].print(b0)
                }
            }
        }
        ;
        bW.prototype.toPrettyString = function(b0) {
            if (b0 === bY) {
                b0 = ""
            }
            var b2 = b0 + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0) {
                b2 += "+"
            }
            b2 += this.length;
            if (this.tag & 32) {
                b2 += " (constructed)"
            } else {
                if (((this.tag == 3) || (this.tag == 4)) && (this.sub !== null)) {
                    b2 += " (encapsulates)"
                }
            }
            b2 += "\n";
            if (this.sub !== null) {
                b0 += "  ";
                for (var b1 = 0, bZ = this.sub.length; b1 < bZ; ++b1) {
                    b2 += this.sub[b1].toPrettyString(b0)
                }
            }
            return b2
        }
        ;
        bW.prototype.toDOM = function() {
            var b0 = L.tag("div", "node");
            b0.asn1 = this;
            var b6 = L.tag("div", "head");
            var b8 = this.typeName().replace(/_/g, " ");
            b6.innerHTML = b8;
            var b4 = this.content();
            if (b4 !== null) {
                b4 = String(b4).replace(/</g, "&lt;");
                var b3 = L.tag("span", "preview");
                b3.appendChild(L.text(b4));
                b6.appendChild(b3)
            }
            b0.appendChild(b6);
            this.node = b0;
            this.head = b6;
            var b7 = L.tag("div", "value");
            b8 = "Offset: " + this.stream.pos + "<br/>";
            b8 += "Length: " + this.header + "+";
            if (this.length >= 0) {
                b8 += this.length
            } else {
                b8 += (-this.length) + " (undefined)"
            }
            if (this.tag & 32) {
                b8 += "<br/>(constructed)"
            } else {
                if (((this.tag == 3) || (this.tag == 4)) && (this.sub !== null)) {
                    b8 += "<br/>(encapsulates)"
                }
            }
            if (b4 !== null) {
                b8 += "<br/>Value:<br/><b>" + b4 + "</b>";
                if ((typeof oids === "object") && (this.tag == 6)) {
                    var b1 = oids[b4];
                    if (b1) {
                        if (b1.d) {
                            b8 += "<br/>" + b1.d
                        }
                        if (b1.c) {
                            b8 += "<br/>" + b1.c
                        }
                        if (b1.w) {
                            b8 += "<br/>(warning!)"
                        }
                    }
                }
            }
            b7.innerHTML = b8;
            b0.appendChild(b7);
            var bZ = L.tag("div", "sub");
            if (this.sub !== null) {
                for (var b2 = 0, b5 = this.sub.length; b2 < b5; ++b2) {
                    bZ.appendChild(this.sub[b2].toDOM())
                }
            }
            b0.appendChild(bZ);
            b6.onclick = function() {
                b0.className = (b0.className == "node collapsed") ? "node" : "node collapsed"
            }
            ;
            return b0
        }
        ;
        bW.prototype.posStart = function() {
            return this.stream.pos
        }
        ;
        bW.prototype.posContent = function() {
            return this.stream.pos + this.header
        }
        ;
        bW.prototype.posEnd = function() {
            return this.stream.pos + this.header + Math.abs(this.length)
        }
        ;
        bW.prototype.fakeHover = function(bZ) {
            this.node.className += " hover";
            if (bZ) {
                this.head.className += " hover"
            }
        }
        ;
        bW.prototype.fakeOut = function(b0) {
            var bZ = / ?hover/;
            this.node.className = this.node.className.replace(bZ, "");
            if (b0) {
                this.head.className = this.head.className.replace(bZ, "")
            }
        }
        ;
        bW.prototype.toHexDOM_sub = function(b2, b1, b3, b4, bZ) {
            if (b4 >= bZ) {
                return
            }
            var b0 = L.tag("span", b1);
            b0.appendChild(L.text(b3.hexDump(b4, bZ)));
            b2.appendChild(b0)
        }
        ;
        bW.prototype.toHexDOM = function(b0) {
            var b3 = L.tag("span", "hex");
            if (b0 === bY) {
                b0 = b3
            }
            this.head.hexNode = b3;
            this.head.onmouseover = function() {
                this.hexNode.className = "hexCurrent"
            }
            ;
            this.head.onmouseout = function() {
                this.hexNode.className = "hex"
            }
            ;
            b3.asn1 = this;
            b3.onmouseover = function() {
                var b5 = !b0.selected;
                if (b5) {
                    b0.selected = this.asn1;
                    this.className = "hexCurrent"
                }
                this.asn1.fakeHover(b5)
            }
            ;
            b3.onmouseout = function() {
                var b5 = (b0.selected == this.asn1);
                this.asn1.fakeOut(b5);
                if (b5) {
                    b0.selected = null;
                    this.className = "hex"
                }
            }
            ;
            this.toHexDOM_sub(b3, "tag", this.stream, this.posStart(), this.posStart() + 1);
            this.toHexDOM_sub(b3, (this.length >= 0) ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
            if (this.sub === null) {
                b3.appendChild(L.text(this.stream.hexDump(this.posContent(), this.posEnd())))
            } else {
                if (this.sub.length > 0) {
                    var b4 = this.sub[0];
                    var b2 = this.sub[this.sub.length - 1];
                    this.toHexDOM_sub(b3, "intro", this.stream, this.posContent(), b4.posStart());
                    for (var b1 = 0, bZ = this.sub.length; b1 < bZ; ++b1) {
                        b3.appendChild(this.sub[b1].toHexDOM(b0))
                    }
                    this.toHexDOM_sub(b3, "outro", this.stream, b2.posEnd(), this.posEnd())
                }
            }
            return b3
        }
        ;
        bW.prototype.toHexString = function(bZ) {
            return this.stream.hexDump(this.posStart(), this.posEnd(), true)
        }
        ;
        bW.decodeLength = function(b2) {
            var b0 = b2.get()
              , bZ = b0 & 127;
            if (bZ == b0) {
                return bZ
            }
            if (bZ > 3) {
                throw "Length over 24 bits not supported at position " + (b2.pos - 1)
            }
            if (bZ === 0) {
                return -1
            }
            b0 = 0;
            for (var b1 = 0; b1 < bZ; ++b1) {
                b0 = (b0 << 8) | b2.get()
            }
            return b0
        }
        ;
        bW.hasContent = function(b0, bZ, b5) {
            if (b0 & 32) {
                return true
            }
            if ((b0 < 3) || (b0 > 4)) {
                return false
            }
            var b4 = new bX(b5);
            if (b0 == 3) {
                b4.get()
            }
            var b3 = b4.get();
            if ((b3 >> 6) & 1) {
                return false
            }
            try {
                var b2 = bW.decodeLength(b4);
                return ((b4.pos - b5.pos) + b2 == bZ)
            } catch (b1) {
                return false
            }
        }
        ;
        bW.decode = function(b6) {
            if (!(b6 instanceof bX)) {
                b6 = new bX(b6,0)
            }
            var b5 = new bX(b6)
              , b8 = b6.get()
              , b3 = bW.decodeLength(b6)
              , b2 = b6.pos - b5.pos
              , bZ = null;
            if (bW.hasContent(b8, b3, b6)) {
                var b0 = b6.pos;
                if (b8 == 3) {
                    b6.get()
                }
                bZ = [];
                if (b3 >= 0) {
                    var b1 = b0 + b3;
                    while (b6.pos < b1) {
                        bZ[bZ.length] = bW.decode(b6)
                    }
                    if (b6.pos != b1) {
                        throw "Content size is not correct for container starting at offset " + b0
                    }
                } else {
                    try {
                        for (; ; ) {
                            var b7 = bW.decode(b6);
                            if (b7.tag === 0) {
                                break
                            }
                            bZ[bZ.length] = b7
                        }
                        b3 = b0 - b6.pos
                    } catch (b4) {
                        throw "Exception while decoding undefined length content: " + b4
                    }
                }
            } else {
                b6.pos += b3
            }
            return new bW(b5,b2,b3,b8,bZ)
        }
        ;
        bW.test = function() {
            var b4 = [{
                value: [39],
                expected: 39
            }, {
                value: [129, 201],
                expected: 201
            }, {
                value: [131, 254, 220, 186],
                expected: 16702650
            }];
            for (var b1 = 0, bZ = b4.length; b1 < bZ; ++b1) {
                var b3 = 0
                  , b2 = new bX(b4[b1].value,0)
                  , b0 = bW.decodeLength(b2);
                if (b0 != b4[b1].expected) {
                    document.write("In test[" + b1 + "] expected " + b4[b1].expected + " got " + b0 + "\n")
                }
            }
        }
        ;
   ASN1 = bW
    }
    )();
    ASN1.prototype.getHexStringValue = function() {
        var t = this.toHexString();
        var L = this.header * 2;
        var z = this.length * 2;
        return t.substr(L, z)
    }
    ;
    A.prototype.parseKey = function(b1) {
        try {
            var b6 = 0;
            var bW = 0;
            var t = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var b5 = t.test(b1) ? Hex.decode(b1) : EncBase64.unarmor(b1);
            var bX = ASN1.decode(b5);
            if (bX.sub.length === 3) {
                bX = bX.sub[2].sub[0]
            }
            if (bX.sub.length === 9) {
                b6 = bX.sub[1].getHexStringValue();
                this.n = w(b6, 16);
                bW = bX.sub[2].getHexStringValue();
                this.e = parseInt(bW, 16);
                var z = bX.sub[3].getHexStringValue();
                this.d = w(z, 16);
                var b0 = bX.sub[4].getHexStringValue();
                this.p = w(b0, 16);
                var bZ = bX.sub[5].getHexStringValue();
                this.q = w(bZ, 16);
                var b3 = bX.sub[6].getHexStringValue();
                this.dmp1 = w(b3, 16);
                var b2 = bX.sub[7].getHexStringValue();
                this.dmq1 = w(b2, 16);
                var L = bX.sub[8].getHexStringValue();
                this.coeff = w(L, 16)
            } else {
                if (bX.sub.length === 2) {
                    var b7 = bX.sub[1];
                    var bY = b7.sub[0];
                    b6 = bY.sub[0].getHexStringValue();
                    this.n = w(b6, 16);
                    bW = bY.sub[1].getHexStringValue();
                    this.e = parseInt(bW, 16)
                } else {
                    return false
                }
            }
            return true
        } catch (b4) {
            return false
        }
    }
    ;
    A.prototype.getPrivateBaseKey = function() {
        var z = {
            "array": [new KJUR.asn1.DERInteger({
                "int": 0
            }), new KJUR.asn1.DERInteger({
                "bigint": this.n
            }), new KJUR.asn1.DERInteger({
                "int": this.e
            }), new KJUR.asn1.DERInteger({
                "bigint": this.d
            }), new KJUR.asn1.DERInteger({
                "bigint": this.p
            }), new KJUR.asn1.DERInteger({
                "bigint": this.q
            }), new KJUR.asn1.DERInteger({
                "bigint": this.dmp1
            }), new KJUR.asn1.DERInteger({
                "bigint": this.dmq1
            }), new KJUR.asn1.DERInteger({
                "bigint": this.coeff
            })]
        };
        var t = new KJUR.asn1.DERSequence(z);
        return t.getEncodedHex()
    }
    ;
    A.prototype.getPrivateBaseKeyB64 = function() {
        return ae(this.getPrivateBaseKey())
    }
    ;
    A.prototype.getPublicBaseKey = function() {
        var L = {
            "array": [new KJUR.asn1.DERObjectIdentifier({
                "oid": "1.2.840.113549.1.1.1"
            }), new KJUR.asn1.DERNull()]
        };
        var t = new KJUR.asn1.DERSequence(L);
        L = {
            "array": [new KJUR.asn1.DERInteger({
                "bigint": this.n
            }), new KJUR.asn1.DERInteger({
                "int": this.e
            })]
        };
        var bX = new KJUR.asn1.DERSequence(L);
        L = {
            "hex": "00" + bX.getEncodedHex()
        };
        var bW = new KJUR.asn1.DERBitString(L);
        L = {
            "array": [t, bW]
        };
        var z = new KJUR.asn1.DERSequence(L);
        return z.getEncodedHex()
    }
    ;
    A.prototype.getPublicBaseKeyB64 = function() {
        return ae(this.getPublicBaseKey())
    }
    ;
    A.prototype.wordwrap = function(L, t) {
        t = t || 64;
        if (!L) {
            return L
        }
        var z = "(.{1," + t + "})( +|$\n?)|(.{1," + t + "})";
        return L.match(RegExp(z, "g")).join("\n")
    }
    ;
    A.prototype.getPrivateKey = function() {
        var t = "-----BEGIN RSA PRIVATE KEY-----\n";
        t += this.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        t += "-----END RSA PRIVATE KEY-----";
        return t
    }
    ;
    A.prototype.getPublicKey = function() {
        var t = "-----BEGIN PUBLIC KEY-----\n";
        t += this.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        t += "-----END PUBLIC KEY-----";
        return t
    }
    ;
    A.prototype.hasPublicKeyProperty = function(t) {
        t = t || {};
        return (t.hasOwnProperty("n") && t.hasOwnProperty("e"))
    }
    ;
    A.prototype.hasPrivateKeyProperty = function(t) {
        t = t || {};
        return (t.hasOwnProperty("n") && t.hasOwnProperty("e") && t.hasOwnProperty("d") && t.hasOwnProperty("p") && t.hasOwnProperty("q") && t.hasOwnProperty("dmp1") && t.hasOwnProperty("dmq1") && t.hasOwnProperty("coeff"))
    }
    ;
    A.prototype.parsePropertiesFrom = function(t) {
        this.n = t.n;
        this.e = t.e;
        if (t.hasOwnProperty("d")) {
            this.d = t.d;
            this.p = t.p;
            this.q = t.q;
            this.dmp1 = t.dmp1;
            this.dmq1 = t.dmq1;
            this.coeff = t.coeff
        }
    }
    ;
    var bx = function(t) {
        A.call(this);
        if (t) {
            if (typeof t === "string") {
                this.parseKey(t)
            } else {
                if (this.hasPrivateKeyProperty(t) || this.hasPublicKeyProperty(t)) {
                    this.parsePropertiesFrom(t)
                }
            }
        }
    };
    bx.prototype = new A();
    bx.prototype.constructor = bx;
    var a3 = function(t) {
        t = t || {};
        this.default_key_size = parseInt(t.default_key_size) || 1024;
        this.default_public_exponent = t.default_public_exponent || "010001";
        this.log = t.log || false;
        this.key = null
    };
    a3.prototype.setKey = function(t) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.")
        }
        this.key = new bx(t)
    }
    ;
    a3.prototype.setPrivateKey = function(t) {
        this.setKey(t)
    }
    ;
    a3.prototype.setPublicKey = function(t) {
        this.setKey(t)
    }
    ;
    a3.prototype.decrypt = function(t) {
        try {
            return this.getKey().decrypt(aW(t))
        } catch (z) {
            return false
        }
    }
    ;
    a3.prototype.encrypt = function(t) {
        try {
            return ae(this.getKey().encrypt(t))
        } catch (z) {
            return false
        }
    }
    ;
    a3.prototype.getKey = function(t) {
        if (!this.key) {
            this.key = new bx();
            if (t && {}.toString.call(t) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, t);
                return
            }
            this.key.generate(this.default_key_size, this.default_public_exponent)
        }
        return this.key
    }
    ;
    a3.prototype.getPrivateKey = function() {
        return this.getKey().getPrivateKey()
    }
    ;
    a3.prototype.getPrivateKeyB64 = function() {
        return this.getKey().getPrivateBaseKeyB64()
    }
    ;
    a3.prototype.getPublicKey = function() {
        return this.getKey().getPublicKey()
    }
    ;
    a3.prototype.getPublicKeyB64 = function() {
        return this.getKey().getPublicBaseKeyB64()
    }
    ;
    a3.version = "2.3.1";



function getpwd2(pwd){
var jsEncrypt = new a3();
			jsEncrypt.setPublicKey(public_key);
			var pwd2 = jsEncrypt.encrypt(pwd);
return pwd2
}

// str1中只有shumeiDeviceId未破解原因是js混淆
var  str1 =  '{"service":"","loginTheme":"defaultTheme","oauth_redirect":"","trust_redirect":"","agentType":"pc","needVerifyCode":"","verifyCodeType":"","password2":"VkkCM1Ph66h5NrEfhbXfBiFpvjukWPqN0R7TVCtQ1JmaffEpOGTK09fhcauSVhCDIMWI31fw3KcfzuakzMTSGg==","bindCheck":"","isBindCheck":"","pcToken2":"THbUMC16df38c1457aCNU02ff","username":"13242345423","password":"","verifyCode":"","uuid":"449ea0bb-f2f4-436d-b28d-c339d1350797","sillerToken":"","shumeiDeviceId":"WC39ZUyXRgdGzlPABD35T25FvhJJu+iUh6o1Q7tvDInMuwksCUs/XKVTzqqOdg/1wlzQgcW1G7C/xuP/MJ0Rcl8RKxOvdsv/FXuxdxmAhoAyBfcBAsf1xNlX5pVVE247jkJlhk/gbBtr8WQCkkJTqhEZ8pCNkGi2yItb53rdVGDg9YK2Ud1L8fVe8lIFHzgXZAD9XWhrlL36KYQri2fi16njPDYyWgC7gqdu9EBJ7DB91cvionFIHc3ZLz3B3BTr3oliTdwC2z74=1487577677129","timestamp":"1571753019369"}';
function getsign(){
	var backendTimestamp = "1,571,750,835,382";
        //var timestamp = new Date().getTime() - (backendTimestamp ? backendTimestamp.replace(/,/g, '') : 0);
	var aeskey = algorithm.AES.factor(16);
	var rsaToAesKey = algorithm.RSA(rsaKey, aeskey);
//obj['timestamp'] = (new Date().getTime() + (timestamp - 0)).toString();	
	var aesData = algorithm.AES.encrypt(aeskey, str1);
serial = algorithm.SHA256('payload=' + aesData + '&key=' + rsaToAesKey + '&abc');
	
return 'sign = ' + serial + 'payload =' + aesData;
}
