var T = {}, t= undefined;
    var d = []
        , h = T.document
        , c = d.slice
        , g = d.concat
        , s = d.push
        , l = d.indexOf
        , n = {}
        , u = n.toString
        , m = n.hasOwnProperty
        , S = {}
        , e = "1.12.4"
        , E = function(e, t) {
        return new E.fn.init(e,t)
    }
        , r = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        , i = /^-ms-/
        , o = /-([\da-z])/gi
        , a = function(e, t) {
        return t.toUpperCase()
    };
    function v(e) {
        var t = !!e && "length"in e && e.length
            , n = E.type(e);
        return "function" !== n && !E.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    E.fn = E.prototype = {
        jquery: e,
        constructor: E,
        selector: "",
        length: 0,
        toArray: function() {
            return c.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : c.call(this)
        },
        pushStack: function(e) {
            var t = E.merge(this.constructor(), e);
            return t.prevObject = this,
                t.context = this.context,
                t
        },
        each: function(e) {
            return E.each(this, e)
        },
        map: function(n) {
            return this.pushStack(E.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(c.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
                , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: s,
        sort: d.sort,
        splice: d.splice
    },
        E.extend = E.fn.extend = function() {
            var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, l = arguments.length, u = !1;
            for ("boolean" == typeof a && (u = a,
                a = arguments[s] || {},
                s++),
                 "object" == typeof a || E.isFunction(a) || (a = {}),
                 s === l && (a = this,
                     s--); s < l; s++)
                if (null != (i = arguments[s]))
                    for (r in i)
                        e = a[r],
                        a !== (n = i[r]) && (u && n && (E.isPlainObject(n) || (t = E.isArray(n))) ? (o = t ? (t = !1,
                            e && E.isArray(e) ? e : []) : e && E.isPlainObject(e) ? e : {},
                            a[r] = E.extend(u, o, n)) : void 0 !== n && (a[r] = n));
            return a
        }
        ,
        E.extend({
            expando: "jQuery" + (e + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === E.type(e)
            },
            isArray: Array.isArray || function(e) {
                return "array" === E.type(e)
            }
            ,
            isWindow: function(e) {
                return null != e && e == e.window
            },
            isNumeric: function(e) {
                var t = e && e.toString();
                return !E.isArray(e) && 0 <= t - parseFloat(t) + 1
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            },
            isPlainObject: function(e) {
                var t;
                if (!e || "object" !== E.type(e) || e.nodeType || E.isWindow(e))
                    return !1;
                try {
                    if (e.constructor && !m.call(e, "constructor") && !m.call(e.constructor.prototype, "isPrototypeOf"))
                        return !1
                } catch (d) {
                    return !1
                }
                if (!S.ownFirst)
                    for (t in e)
                        return m.call(e, t);
                for (t in e)
                    ;
                return void 0 === t || m.call(e, t)
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[u.call(e)] || "object" : typeof e
            },
            globalEval: function(e) {
                e && E.trim(e) && (T.execScript || function(e) {
                        T.eval.call(T, e)
                    }
                )(e)
            },
            camelCase: function(e) {
                return e.replace(i, "ms-").replace(o, a)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function(e, t) {
                var n, r = 0;
                if (v(e))
                    for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                        ;
                else
                    for (r in e)
                        if (!1 === t.call(e[r], r, e[r]))
                            break;
                return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(r, "")
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (v(Object(e)) ? E.merge(n, "string" == typeof e ? [e] : e) : s.call(n, e)),
                    n
            },
            inArray: function(e, t, n) {
                var r;
                if (t) {
                    if (l)
                        return l.call(t, e, n);
                    for (r = t.length,
                             n = n ? n < 0 ? Math.max(0, r + n) : n : 0; n < r; n++)
                        if (n in t && t[n] === e)
                            return n
                }
                return -1
            },
            merge: function(e, t) {
                for (var n = +t.length, r = 0, i = e.length; r < n; )
                    e[i++] = t[r++];
                if (n != n)
                    for (; void 0 !== t[r]; )
                        e[i++] = t[r++];
                return e.length = i,
                    e
            },
            grep: function(e, t, n) {
                for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                    !t(e[i], i) !== a && r.push(e[i]);
                return r
            },
            map: function(e, t, n) {
                var r, i, o = 0, a = [];
                if (v(e))
                    for (r = e.length; o < r; o++)
                        null != (i = t(e[o], o, n)) && a.push(i);
                else
                    for (o in e)
                        null != (i = t(e[o], o, n)) && a.push(i);
                return g.apply([], a)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, r, i;
                return "string" == typeof t && (i = e[t],
                    t = e,
                    e = i),
                    E.isFunction(e) ? (n = c.call(arguments, 2),
                        (r = function() {
                                return e.apply(t || this, n.concat(c.call(arguments)))
                            }
                        ).guid = e.guid = e.guid || E.guid++,
                        r) : void 0
            },
            now: function() {
                return +new Date
            },
            support: S
        }),
    "function" == typeof Symbol && (E.fn[Symbol.iterator] = d[Symbol.iterator]),
        E.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
            n["[object " + t + "]"] = t.toLowerCase()
        });
    var f = function(n) {
        var e, h, b, o, i, g, d, m, _, l, u, x, C, a, k, v, s, c, y, T = "sizzle" + 1 * new Date, w = n.document, S = 0, r = 0, E = ie(), f = ie(), A = ie(), p = function(e, t) {
            return e === t && (u = !0),
                0
        }, L = {}.hasOwnProperty, t = [], I = t.pop, $ = t.push, j = t.push, D = t.slice, N = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, M = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", O = "[\\x20\\t\\r\\n\\f]", P = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", R = "\\[" + O + "*(" + P + ")(?:" + O + "*([*^$|!~]?=)" + O + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + P + "))|)" + O + "*\\]", B = ":(" + P + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + R + ")*)|.*)\\)|)", F = new RegExp(O + "+","g"), H = new RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$","g"), U = new RegExp("^" + O + "*," + O + "*"), q = new RegExp("^" + O + "*([>+~]|" + O + ")" + O + "*"), W = new RegExp("=" + O + "*([^\\]'\"]*?)" + O + "*\\]","g"), z = new RegExp(B), V = new RegExp("^" + P + "$"), X = {
            ID: new RegExp("^#(" + P + ")"),
            CLASS: new RegExp("^\\.(" + P + ")"),
            TAG: new RegExp("^(" + P + "|[*])"),
            ATTR: new RegExp("^" + R),
            PSEUDO: new RegExp("^" + B),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)","i"),
            bool: new RegExp("^(?:" + M + ")$","i"),
            needsContext: new RegExp("^" + O + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)","i")
        }, G = /^(?:input|select|textarea|button)$/i, J = /^h\d$/i, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Q = /[+~]/, Y = /'|\\/g, ee = new RegExp("\\\\([\\da-f]{1,6}" + O + "?|(" + O + ")|.)","ig"), te = function(e, t, n) {
            var r = "0x" + t - 65536;
            return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        }, ne = function() {
            x()
        };
        try {
            j.apply(t = D.call(w.childNodes), w.childNodes),
                t[w.childNodes.length].nodeType
        } catch (be) {
            j = {
                apply: t.length ? function(e, t) {
                        $.apply(e, D.call(t))
                    }
                    : function(e, t) {
                        for (var n = e.length, r = 0; e[n++] = t[r++]; )
                            ;
                        e.length = n - 1
                    }
            }
        }
        function re(e, t, n, r) {
            var i, o, a, s, l, u, c, d, f = t && t.ownerDocument, p = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== p && 9 !== p && 11 !== p)
                return n;
            if (!r && ((t ? t.ownerDocument || t : w) !== C && x(t),
                t = t || C,
                k)) {
                if (11 !== p && (u = Z.exec(e)))
                    if (i = u[1]) {
                        if (9 === p) {
                            if (!(a = t.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a),
                                    n
                        } else if (f && (a = f.getElementById(i)) && y(t, a) && a.id === i)
                            return n.push(a),
                                n
                    } else {
                        if (u[2])
                            return j.apply(n, t.getElementsByTagName(e)),
                                n;
                        if ((i = u[3]) && h.getElementsByClassName && t.getElementsByClassName)
                            return j.apply(n, t.getElementsByClassName(i)),
                                n
                    }
                if (h.qsa && !A[e + " "] && (!v || !v.test(e))) {
                    if (1 !== p)
                        f = t,
                            d = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((s = t.getAttribute("id")) ? s = s.replace(Y, "\\$&") : t.setAttribute("id", s = T),
                                 o = (c = g(e)).length,
                                 l = V.test(s) ? "#" + s : "[id='" + s + "']"; o--; )
                            c[o] = l + " " + he(c[o]);
                        d = c.join(","),
                            f = Q.test(e) && fe(t.parentNode) || t
                    }
                    if (d)
                        try {
                            return j.apply(n, f.querySelectorAll(d)),
                                n
                        } catch (E) {} finally {
                            s === T && t.removeAttribute("id")
                        }
                }
            }
            return m(e.replace(H, "$1"), t, n, r)
        }
        function ie() {
            var n = [];
            return function r(e, t) {
                return n.push(e + " ") > b.cacheLength && delete r[n.shift()],
                    r[e + " "] = t
            }
        }
        function oe(e) {
            return e[T] = !0,
                e
        }
        function ae(e) {
            var t ={};
            try {
                return !!e(t)
            } catch (h) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                    t = null
            }
        }
        function se(e, t) {
            for (var n = e.split("|"), r = n.length; r--; )
                b.attrHandle[n[r]] = t
        }
        function le(e, t) {
            var n = t && e
                , r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || 1 << 31) - (~e.sourceIndex || 1 << 31);
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function ue(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function ce(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function de(a) {
            return oe(function(o) {
                return o = +o,
                    oe(function(e, t) {
                        for (var n, r = a([], e.length, o), i = r.length; i--; )
                            e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                    })
            })
        }
        function fe(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        for (e in h = re.support = {},
            i = re.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            }
            ,
            x = re.setDocument = function(e) {
                var t, n, r = e ? e.ownerDocument || e : w;
                return r !== C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement,
                        k = !i(C),
                    (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", ne, !1) : n.attachEvent && n.attachEvent("onunload", ne)),
                        h.attributes = ae(function(e) {
                            return e.className = "i",
                                !e.getAttribute("className")
                        }),
                        h.getElementsByTagName = ae(function(e) {
                            return e.appendChild(C.createComment("")),
                                !e.getElementsByTagName("*").length
                        }),
                        h.getElementsByClassName = K.test(C.getElementsByClassName),
                        h.getById = ae(function(e) {
                            return a.appendChild(e).id = T,
                            !C.getElementsByName || !C.getElementsByName(T).length
                        }),
                        h.getById ? (b.find.ID = function(e, t) {
                                if ("undefined" != typeof t.getElementById && k) {
                                    var n = t.getElementById(e);
                                    return n ? [n] : []
                                }
                            }
                                ,
                                b.filter.ID = function(e) {
                                    var t = e.replace(ee, te);
                                    return function(e) {
                                        return e.getAttribute("id") === t
                                    }
                                }
                        ) : (delete b.find.ID,
                                b.filter.ID = function(e) {
                                    var n = e.replace(ee, te);
                                    return function(e) {
                                        var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                                        return t && t.value === n
                                    }
                                }
                        ),
                        b.find.TAG = h.getElementsByTagName ? function(e, t) {
                                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : h.qsa ? t.querySelectorAll(e) : void 0
                            }
                            : function(e, t) {
                                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                                if ("*" !== e)
                                    return o;
                                for (; n = o[i++]; )
                                    1 === n.nodeType && r.push(n);
                                return r
                            }
                        ,
                        b.find.CLASS = h.getElementsByClassName && function(e, t) {
                            return "undefined" != typeof t.getElementsByClassName && k ? t.getElementsByClassName(e) : void 0
                        }
                        ,
                        s = [],
                        v = [],
                    (h.qsa = K.test(C.querySelectorAll)) && (ae(function(e) {
                        a.appendChild(e).innerHTML = "<a id='" + T + "'></a><select id='" + T + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                        e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + O + "*(?:''|\"\")"),
                        e.querySelectorAll("[selected]").length || v.push("\\[" + O + "*(?:value|" + M + ")"),
                        e.querySelectorAll("[id~=" + T + "-]").length || v.push("~="),
                        e.querySelectorAll(":checked").length || v.push(":checked"),
                        e.querySelectorAll("a#" + T + "+*").length || v.push(".#.+[+~]")
                    }),
                        ae(function(e) {
                            var t = C.createElement("input");
                            t.setAttribute("type", "hidden"),
                                e.appendChild(t).setAttribute("name", "D"),
                            e.querySelectorAll("[name=d]").length && v.push("name" + O + "*[*^$|!~]?="),
                            e.querySelectorAll(":enabled").length || v.push(":enabled", ":disabled"),
                                e.querySelectorAll("*,:x"),
                                v.push(",.*:")
                        })),
                    (h.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ae(function(e) {
                        h.disconnectedMatch = c.call(e, "div"),
                            c.call(e, "[s!='']:x"),
                            s.push("!=", B)
                    }),
                        v = v.length && new RegExp(v.join("|")),
                        s = s.length && new RegExp(s.join("|")),
                        t = K.test(a.compareDocumentPosition),
                        y = t || K.test(a.contains) ? function(e, t) {
                                var n = 9 === e.nodeType ? e.documentElement : e
                                    , r = t && t.parentNode;
                                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                            }
                            : function(e, t) {
                                if (t)
                                    for (; t = t.parentNode; )
                                        if (t === e)
                                            return !0;
                                return !1
                            }
                        ,
                        p = t ? function(e, t) {
                                if (e === t)
                                    return u = !0,
                                        0;
                                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !h.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === w && y(w, e) ? -1 : t === C || t.ownerDocument === w && y(w, t) ? 1 : l ? N(l, e) - N(l, t) : 0 : 4 & n ? -1 : 1)
                            }
                            : function(e, t) {
                                if (e === t)
                                    return u = !0,
                                        0;
                                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                                if (!i || !o)
                                    return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : l ? N(l, e) - N(l, t) : 0;
                                if (i === o)
                                    return le(e, t);
                                for (n = e; n = n.parentNode; )
                                    a.unshift(n);
                                for (n = t; n = n.parentNode; )
                                    s.unshift(n);
                                for (; a[r] === s[r]; )
                                    r++;
                                return r ? le(a[r], s[r]) : a[r] === w ? -1 : s[r] === w ? 1 : 0
                            }
                ),
                    C
            }
            ,
            re.matches = function(e, t) {
                return re(e, null, null, t)
            }
            ,
            re.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== C && x(e),
                    t = t.replace(W, "='$1']"),
                h.matchesSelector && k && !A[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t)))
                    try {
                        var n = c.call(e, t);
                        if (n || h.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                            return n
                    } catch (o) {}
                return 0 < re(t, C, null, [e]).length
            }
            ,
            re.contains = function(e, t) {
                return (e.ownerDocument || e) !== C && x(e),
                    y(e, t)
            }
            ,
            re.attr = function(e, t) {
                (e.ownerDocument || e) !== C && x(e);
                var n = b.attrHandle[t.toLowerCase()]
                    , r = n && L.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !k) : void 0;
                return void 0 !== r ? r : h.attributes || !k ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
            }
            ,
            re.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }
            ,
            re.uniqueSort = function(e) {
                var t, n = [], r = 0, i = 0;
                if (u = !h.detectDuplicates,
                    l = !h.sortStable && e.slice(0),
                    e.sort(p),
                    u) {
                    for (; t = e[i++]; )
                        t === e[i] && (r = n.push(i));
                    for (; r--; )
                        e.splice(n[r], 1)
                }
                return l = null,
                    e
            }
            ,
            o = re.getText = function(e) {
                var t, n = "", r = 0, i = e.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof e.textContent)
                            return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling)
                            n += o(e)
                    } else if (3 === i || 4 === i)
                        return e.nodeValue
                } else
                    for (; t = e[r++]; )
                        n += o(t);
                return n
            }
            ,
            (b = re.selectors = {
                cacheLength: 50,
                createPseudo: oe,
                match: X,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(ee, te),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(ee, te),
                        "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || re.error(e[0]),
                                e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                                e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && re.error(e[0]),
                            e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return X.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && z.test(n) && (t = g(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                            e[2] = n.slice(0, t)),
                            e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(ee, te).toLowerCase();
                        return "*" === e ? function() {
                                return !0
                            }
                            : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                    },
                    CLASS: function(e) {
                        var t = E[e + " "];
                        return t || (t = new RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) && E(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(n, r, i) {
                        return function(e) {
                            var t = re.attr(e, n);
                            return null == t ? "!=" === r : !r || (t += "",
                                "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(F, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(h, e, t, g, m) {
                        var v = "nth" !== h.slice(0, 3)
                            , y = "last" !== h.slice(-4)
                            , w = "of-type" === e;
                        return 1 === g && 0 === m ? function(e) {
                                return !!e.parentNode
                            }
                            : function(e, t, n) {
                                var r, i, o, a, s, l, u = v !== y ? "nextSibling" : "previousSibling", c = e.parentNode, d = w && e.nodeName.toLowerCase(), f = !n && !w, p = !1;
                                if (c) {
                                    if (v) {
                                        for (; u; ) {
                                            for (a = e; a = a[u]; )
                                                if (w ? a.nodeName.toLowerCase() === d : 1 === a.nodeType)
                                                    return !1;
                                            l = u = "only" === h && !l && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (l = [y ? c.firstChild : c.lastChild],
                                    y && f) {
                                        for (p = (s = (r = (i = (o = (a = c)[T] || (a[T] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]) && r[2],
                                                 a = s && c.childNodes[s]; a = ++s && a && a[u] || (p = s = 0) || l.pop(); )
                                            if (1 === a.nodeType && ++p && a === e) {
                                                i[h] = [S, s, p];
                                                break
                                            }
                                    } else if (f && (p = s = (r = (i = (o = (a = e)[T] || (a[T] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]),
                                    !1 === p)
                                        for (; (a = ++s && a && a[u] || (p = s = 0) || l.pop()) && ((w ? a.nodeName.toLowerCase() !== d : 1 !== a.nodeType) || !++p || (f && ((i = (o = a[T] || (a[T] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [S, p]),
                                        a !== e)); )
                                            ;
                                    return (p -= m) === g || p % g == 0 && 0 <= p / g
                                }
                            }
                    },
                    PSEUDO: function(e, o) {
                        var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || re.error("unsupported pseudo: " + e);
                        return a[T] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                                b.setFilters.hasOwnProperty(e.toLowerCase()) ? oe(function(e, t) {
                                    for (var n, r = a(e, o), i = r.length; i--; )
                                        e[n = N(e, r[i])] = !(t[n] = r[i])
                                }) : function(e) {
                                    return a(e, 0, t)
                                }
                        ) : a
                    }
                },
                pseudos: {
                    not: oe(function(e) {
                        var r = []
                            , i = []
                            , s = d(e.replace(H, "$1"));
                        return s[T] ? oe(function(e, t, n, r) {
                            for (var i, o = s(e, null, r, []), a = e.length; a--; )
                                (i = o[a]) && (e[a] = !(t[a] = i))
                        }) : function(e, t, n) {
                            return r[0] = e,
                                s(r, null, n, i),
                                r[0] = null,
                                !i.pop()
                        }
                    }),
                    has: oe(function(t) {
                        return function(e) {
                            return 0 < re(t, e).length
                        }
                    }),
                    contains: oe(function(t) {
                        return t = t.replace(ee, te),
                            function(e) {
                                return -1 < (e.textContent || e.innerText || o(e)).indexOf(t)
                            }
                    }),
                    lang: oe(function(n) {
                        return V.test(n || "") || re.error("unsupported lang: " + n),
                            n = n.replace(ee, te).toLowerCase(),
                            function(e) {
                                var t;
                                do {
                                    if (t = k ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                        return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);return !1
                            }
                    }),
                    target: function(e) {
                        var t = n.location && n.location.hash;
                        return t && t.slice(1) === e.id
                    },
                    root: function(e) {
                        return e === a
                    },
                    focus: function(e) {
                        return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return !1 === e.disabled
                    },
                    disabled: function(e) {
                        return !0 === e.disabled
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex,
                        !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !b.pseudos.empty(e)
                    },
                    header: function(e) {
                        return J.test(e.nodeName)
                    },
                    input: function(e) {
                        return G.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: de(function() {
                        return [0]
                    }),
                    last: de(function(e, t) {
                        return [t - 1]
                    }),
                    eq: de(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: de(function(e, t) {
                        for (var n = 0; n < t; n += 2)
                            e.push(n);
                        return e
                    }),
                    odd: de(function(e, t) {
                        for (var n = 1; n < t; n += 2)
                            e.push(n);
                        return e
                    }),
                    lt: de(function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; 0 <= --r; )
                            e.push(r);
                        return e
                    }),
                    gt: de(function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; ++r < t; )
                            e.push(r);
                        return e
                    })
                }
            }).pseudos.nth = b.pseudos.eq,
            {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            })
            b.pseudos[e] = ue(e);
        for (e in {
            submit: !0,
            reset: !0
        })
            b.pseudos[e] = ce(e);
        function pe() {}
        function he(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function ge(s, e, t) {
            var l = e.dir
                , u = t && "parentNode" === l
                , c = r++;
            return e.first ? function(e, t, n) {
                    for (; e = e[l]; )
                        if (1 === e.nodeType || u)
                            return s(e, t, n)
                }
                : function(e, t, n) {
                    var r, i, o, a = [S, c];
                    if (n) {
                        for (; e = e[l]; )
                            if ((1 === e.nodeType || u) && s(e, t, n))
                                return !0
                    } else
                        for (; e = e[l]; )
                            if (1 === e.nodeType || u) {
                                if ((r = (i = (o = e[T] || (e[T] = {}))[e.uniqueID] || (o[e.uniqueID] = {}))[l]) && r[0] === S && r[1] === c)
                                    return a[2] = r[2];
                                if ((i[l] = a)[2] = s(e, t, n))
                                    return !0
                            }
                }
        }
        function me(i) {
            return 1 < i.length ? function(e, t, n) {
                    for (var r = i.length; r--; )
                        if (!i[r](e, t, n))
                            return !1;
                    return !0
                }
                : i[0]
        }
        function ve(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                u && t.push(s)));
            return a
        }
        function ye(h, g, m, v, y, e) {
            return v && !v[T] && (v = ye(v)),
            y && !y[T] && (y = ye(y, e)),
                oe(function(e, t, n, r) {
                    var i, o, a, s = [], l = [], u = t.length, c = e || function p(e, t, n) {
                        for (var r = 0, i = t.length; r < i; r++)
                            re(e, t[r], n);
                        return n
                    }(g || "*", n.nodeType ? [n] : n, []), d = !h || !e && g ? c : ve(c, s, h, n, r), f = m ? y || (e ? h : u || v) ? [] : t : d;
                    if (m && m(d, f, n, r),
                        v)
                        for (i = ve(f, l),
                                 v(i, [], n, r),
                                 o = i.length; o--; )
                            (a = i[o]) && (f[l[o]] = !(d[l[o]] = a));
                    if (e) {
                        if (y || h) {
                            if (y) {
                                for (i = [],
                                         o = f.length; o--; )
                                    (a = f[o]) && i.push(d[o] = a);
                                y(null, f = [], i, r)
                            }
                            for (o = f.length; o--; )
                                (a = f[o]) && -1 < (i = y ? N(e, a) : s[o]) && (e[i] = !(t[i] = a))
                        }
                    } else
                        f = ve(f === t ? f.splice(u, f.length) : f),
                            y ? y(null, t, f, r) : j.apply(t, f)
                })
        }
        function we(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, l = ge(function(e) {
                return e === i
            }, a, !0), u = ge(function(e) {
                return -1 < N(i, e)
            }, a, !0), c = [function(e, t, n) {
                var r = !o && (n || t !== _) || ((i = t).nodeType ? l(e, t, n) : u(e, t, n));
                return i = null,
                    r
            }
            ]; s < r; s++)
                if (t = b.relative[e[s].type])
                    c = [ge(me(c), t)];
                else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[T]) {
                        for (n = ++s; n < r && !b.relative[e[n].type]; n++)
                            ;
                        return ye(1 < s && me(c), 1 < s && he(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(H, "$1"), t, s < n && we(e.slice(s, n)), n < r && we(e = e.slice(n)), n < r && he(e))
                    }
                    c.push(t)
                }
            return me(c)
        }
        return pe.prototype = b.filters = b.pseudos,
            b.setFilters = new pe,
            g = re.tokenize = function(e, t) {
                var n, r, i, o, a, s, l, u = f[e + " "];
                if (u)
                    return t ? 0 : u.slice(0);
                for (a = e,
                         s = [],
                         l = b.preFilter; a; ) {
                    for (o in n && !(r = U.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                        s.push(i = [])),
                        n = !1,
                    (r = q.exec(a)) && (n = r.shift(),
                        i.push({
                            value: n,
                            type: r[0].replace(H, " ")
                        }),
                        a = a.slice(n.length)),
                        b.filter)
                        !(r = X[o].exec(a)) || l[o] && !(r = l[o](r)) || (n = r.shift(),
                            i.push({
                                value: n,
                                type: o,
                                matches: r
                            }),
                            a = a.slice(n.length));
                    if (!n)
                        break
                }
                return t ? a.length : a ? re.error(e) : f(e, s).slice(0)
            }
            ,
            d = re.compile = function(e, t) {
                var n, r = [], i = [], o = A[e + " "];
                if (!o) {
                    for (t || (t = g(e)),
                             n = t.length; n--; )
                        (o = we(t[n]))[T] ? r.push(o) : i.push(o);
                    (o = A(e, function a(m, v) {
                        var y = 0 < v.length
                            , w = 0 < m.length
                            , e = function(e, t, n, r, i) {
                            var o, a, s, l = 0, u = "0", c = e && [], d = [], f = _, p = e || w && b.find.TAG("*", i), h = S += null == f ? 1 : Math.random() || .1, g = p.length;
                            for (i && (_ = t === C || t || i); u !== g && null != (o = p[u]); u++) {
                                if (w && o) {
                                    for (a = 0,
                                         t || o.ownerDocument === C || (x(o),
                                             n = !k); s = m[a++]; )
                                        if (s(o, t || C, n)) {
                                            r.push(o);
                                            break
                                        }
                                    i && (S = h)
                                }
                                y && ((o = !s && o) && l--,
                                e && c.push(o))
                            }
                            if (l += u,
                            y && u !== l) {
                                for (a = 0; s = v[a++]; )
                                    s(c, d, t, n);
                                if (e) {
                                    if (0 < l)
                                        for (; u--; )
                                            c[u] || d[u] || (d[u] = I.call(r));
                                    d = ve(d)
                                }
                                j.apply(r, d),
                                i && !e && 0 < d.length && 1 < l + v.length && re.uniqueSort(r)
                            }
                            return i && (S = h,
                                _ = f),
                                c
                        };
                        return y ? oe(e) : e
                    }(i, r))).selector = e
                }
                return o
            }
            ,
            m = re.select = function(e, t, n, r) {
                var i, o, a, s, l, u = "function" == typeof e && e, c = !r && g(e = u.selector || e);
                if (n = n || [],
                1 === c.length) {
                    if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && h.getById && 9 === t.nodeType && k && b.relative[o[1].type]) {
                        if (!(t = (b.find.ID(a.matches[0].replace(ee, te), t) || [])[0]))
                            return n;
                        u && (t = t.parentNode),
                            e = e.slice(o.shift().value.length)
                    }
                    for (i = X.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                        !b.relative[s = a.type]); )
                        if ((l = b.find[s]) && (r = l(a.matches[0].replace(ee, te), Q.test(o[0].type) && fe(t.parentNode) || t))) {
                            if (o.splice(i, 1),
                                !(e = r.length && he(o)))
                                return j.apply(n, r),
                                    n;
                            break
                        }
                }
                return (u || d(e, c))(r, t, !k, n, !t || Q.test(e) && fe(t.parentNode) || t),
                    n
            }
            ,
            h.sortStable = T.split("").sort(p).join("") === T,
            h.detectDuplicates = !!u,
            x(),
            h.sortDetached = ae(function(e) {
                return 1 & e.compareDocumentPosition(C.createElement("div"))
            }),
        ae(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || se("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        h.attributes && ae(function(e) {
            return e.innerHTML = "<input/>",
                e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || se("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }),
        ae(function(e) {
            return null == e.getAttribute("disabled")
        }) || se(M, function(e, t, n) {
            var r;
            return n ? void 0 : !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
            re
    }(T);
    E.find = f,
        E.expr = f.selectors,
        E.expr[":"] = E.expr.pseudos,
        E.uniqueSort = E.unique = f.uniqueSort,
        E.text = f.getText,
        E.isXMLDoc = f.isXML,
        E.contains = f.contains;
    var p = function(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && E(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
        , y = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
        , w = E.expr.match.needsContext
        , A = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/
        , b = /^.[^:#\[\.,]*$/;
    function _(e, n, r) {
        if (E.isFunction(n))
            return E.grep(e, function(e, t) {
                return !!n.call(e, t, e) !== r
            });
        if (n.nodeType)
            return E.grep(e, function(e) {
                return e === n !== r
            });
        if ("string" == typeof n) {
            if (b.test(n))
                return E.filter(n, e, r);
            n = E.filter(n, e)
        }
        return E.grep(e, function(e) {
            return -1 < E.inArray(e, n) !== r
        })
    }
    E.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
            1 === t.length && 1 === r.nodeType ? E.find.matchesSelector(r, e) ? [r] : [] : E.find.matches(e, E.grep(t, function(e) {
                return 1 === e.nodeType
            }))
    }
        ,
        E.fn.extend({
            find: function(e) {
                var t, n = [], r = this, i = r.length;
                if ("string" != typeof e)
                    return this.pushStack(E(e).filter(function() {
                        for (t = 0; t < i; t++)
                            if (E.contains(r[t], this))
                                return !0
                    }));
                for (t = 0; t < i; t++)
                    E.find(e, r[t], n);
                return (n = this.pushStack(1 < i ? E.unique(n) : n)).selector = this.selector ? this.selector + " " + e : e,
                    n
            },
            filter: function(e) {
                return this.pushStack(_(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(_(this, e || [], !0))
            },
            is: function(e) {
                return !!_(this, "string" == typeof e && w.test(e) ? E(e) : e || [], !1).length
            }
        });
    var x, C = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (E.fn.init = function(e, t, n) {
            var r, i;
            if (!e)
                return this;
            if (n = n || x,
            "string" != typeof e)
                return e.nodeType ? (this.context = this[0] = e,
                    this.length = 1,
                    this) : E.isFunction(e) ? "undefined" != typeof n.ready ? n.ready(e) : e(E) : (void 0 !== e.selector && (this.selector = e.selector,
                    this.context = e.context),
                    E.makeArray(e, this));
            if (!(r = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && 3 <= e.length ? [null, e, null] : C.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof E ? t[0] : t,
                    E.merge(this, E.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : h, !0)),
                A.test(r[1]) && E.isPlainObject(t))
                    for (r in t)
                        E.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            if ((i = h.getElementById(r[2])) && i.parentNode) {
                if (i.id !== r[2])
                    return x.find(e);
                this.length = 1,
                    this[0] = i
            }
            return this.context = h,
                this.selector = e,
                this
        }
    ).prototype = E.fn,
        x = E(h);
    var k = /^(?:parents|prev(?:Until|All))/
        , L = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function I(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    E.fn.extend({
        has: function(e) {
            var t, n = E(e, this), r = n.length;
            return this.filter(function() {
                for (t = 0; t < r; t++)
                    if (E.contains(this, n[t]))
                        return !0
            })
        },
        closest: function(e, t) {
            for (var n, r = 0, i = this.length, o = [], a = w.test(e) || "string" != typeof e ? E(e, t || this.context) : 0; r < i; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && E.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(1 < o.length ? E.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? E.inArray(this[0], E(e)) : E.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(E.uniqueSort(E.merge(this.get(), E(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
        E.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return p(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return p(e, "parentNode", n)
            },
            next: function(e) {
                return I(e, "nextSibling")
            },
            prev: function(e) {
                return I(e, "previousSibling")
            },
            nextAll: function(e) {
                return p(e, "nextSibling")
            },
            prevAll: function(e) {
                return p(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return p(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return p(e, "previousSibling", n)
            },
            siblings: function(e) {
                return y((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return y(e.firstChild)
            },
            contents: function(e) {
                return E.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : E.merge([], e.childNodes)
            }
        }, function(r, i) {
            E.fn[r] = function(e, t) {
                var n = E.map(this, i, e);
                return "Until" !== r.slice(-5) && (t = e),
                t && "string" == typeof t && (n = E.filter(t, n)),
                1 < this.length && (L[r] || (n = E.uniqueSort(n)),
                k.test(r) && (n = n.reverse())),
                    this.pushStack(n)
            }
        });
    var $, j, D = /\S+/g;
    function N() {
        h.addEventListener ? (h.removeEventListener("DOMContentLoaded", M),
            T.removeEventListener("load", M)) : (h.detachEvent("onreadystatechange", M),
            T.detachEvent("onload", M))
    }
    function M() {
        (h.addEventListener || "load" === T.event.type || "complete" === h.readyState) && (N(),
            E.ready())
    }
    for (j in E.Callbacks = function(r) {
        r = "string" == typeof r ? function c(e) {
            var n = {};
            return E.each(e.match(D) || [], function(e, t) {
                n[t] = !0
            }),
                n
        }(r) : E.extend({}, r);
        var i, e, t, n, o = [], a = [], s = -1, l = function() {
            for (n = r.once,
                     t = i = !0; a.length; s = -1)
                for (e = a.shift(); ++s < o.length; )
                    !1 === o[s].apply(e[0], e[1]) && r.stopOnFalse && (s = o.length,
                        e = !1);
            r.memory || (e = !1),
                i = !1,
            n && (o = e ? [] : "")
        }, u = {
            add: function() {
                return o && (e && !i && (s = o.length - 1,
                    a.push(e)),
                    function n(e) {
                        E.each(e, function(e, t) {
                            E.isFunction(t) ? r.unique && u.has(t) || o.push(t) : t && t.length && "string" !== E.type(t) && n(t)
                        })
                    }(arguments),
                e && !i && l()),
                    this
            },
            remove: function() {
                return E.each(arguments, function(e, t) {
                    for (var n; -1 < (n = E.inArray(t, o, n)); )
                        o.splice(n, 1),
                        n <= s && s--
                }),
                    this
            },
            has: function(e) {
                return e ? -1 < E.inArray(e, o) : 0 < o.length
            },
            empty: function() {
                return o && (o = []),
                    this
            },
            disable: function() {
                return n = a = [],
                    o = e = "",
                    this
            },
            disabled: function() {
                return !o
            },
            lock: function() {
                return n = !0,
                e || u.disable(),
                    this
            },
            locked: function() {
                return !!n
            },
            fireWith: function(e, t) {
                return n || (t = [e, (t = t || []).slice ? t.slice() : t],
                    a.push(t),
                i || l()),
                    this
            },
            fire: function() {
                return u.fireWith(this, arguments),
                    this
            },
            fired: function() {
                return !!t
            }
        };
        return u
    }
        ,
        E.extend({
            Deferred: function(e) {
                var o = [["resolve", "done", E.Callbacks("once memory"), "resolved"], ["reject", "fail", E.Callbacks("once memory"), "rejected"], ["notify", "progress", E.Callbacks("memory")]]
                    , i = "pending"
                    , a = {
                    state: function() {
                        return i
                    },
                    always: function() {
                        return s.done(arguments).fail(arguments),
                            this
                    },
                    then: function() {
                        var i = arguments;
                        return E.Deferred(function(r) {
                            E.each(o, function(e, t) {
                                var n = E.isFunction(i[e]) && i[e];
                                s[t[1]](function() {
                                    var e = n && n.apply(this, arguments);
                                    e && E.isFunction(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this === a ? r.promise() : this, n ? [e] : arguments)
                                })
                            }),
                                i = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? E.extend(e, a) : a
                    }
                }
                    , s = {};
                return a.pipe = a.then,
                    E.each(o, function(e, t) {
                        var n = t[2]
                            , r = t[3];
                        a[t[1]] = n.add,
                        r && n.add(function() {
                            i = r
                        }, o[1 ^ e][2].disable, o[2][2].lock),
                            s[t[0]] = function() {
                                return s[t[0] + "With"](this === s ? a : this, arguments),
                                    this
                            }
                            ,
                            s[t[0] + "With"] = n.fireWith
                    }),
                    a.promise(s),
                e && e.call(s, s),
                    s
            },
            when: function(e) {
                var i, t, n, r = 0, o = c.call(arguments), a = o.length, s = 1 !== a || e && E.isFunction(e.promise) ? a : 0, l = 1 === s ? e : E.Deferred(), u = function(t, n, r) {
                    return function(e) {
                        n[t] = this,
                            r[t] = 1 < arguments.length ? c.call(arguments) : e,
                            r === i ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                    }
                };
                if (1 < a)
                    for (i = new Array(a),
                             t = new Array(a),
                             n = new Array(a); r < a; r++)
                        o[r] && E.isFunction(o[r].promise) ? o[r].promise().progress(u(r, t, i)).done(u(r, n, o)).fail(l.reject) : --s;
                return s || l.resolveWith(n, o),
                    l.promise()
            }
        }),
        E.fn.ready = function(e) {
            return E.ready.promise().done(e),
                this
        }
        ,
        E.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? E.readyWait++ : E.ready(!0)
            },
            ready: function(e) {
                (!0 === e ? --E.readyWait : E.isReady) || ((E.isReady = !0) !== e && 0 < --E.readyWait || ($.resolveWith(h, [E]),
                E.fn.triggerHandler && (E(h).triggerHandler("ready"),
                    E(h).off("ready"))))
            }
        }),
        E.ready.promise = function(e) {
            if (!$)
                if ($ = E.Deferred(),
                false || false && true)
                    T.setTimeout(E.ready);
                else if (h.addEventListener)
                    h.addEventListener("DOMContentLoaded", M),
                        T.addEventListener("load", M);
                else {
                    h.attachEvent("onreadystatechange", M),
                        T.attachEvent("onload", M);
                    var t = !1;
                    try {
                        t = null == T.frameElement && h.documentElement
                    } catch (c) {}
                    t && t.doScroll && function n() {
                        if (!E.isReady) {
                            try {
                                t.doScroll("left")
                            } catch (e) {
                                return T.setTimeout(n, 50)
                            }
                            N(),
                                E.ready()
                        }
                    }()
                }
            return $.promise(e)
        }
        ,
        E.ready.promise(),
        E(S))
        break;
    S.ownFirst = "0" === j,
        S.inlineBlockNeedsLayout = !1,
        E(function() {
            var e, t, n, r;
            (n = h.getElementsByTagName("body")[0]) && n.style && (t = h.createElement("div"),
                (r = h.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                n.appendChild(r).appendChild(t),
            "undefined" != typeof t.style.zoom && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
                S.inlineBlockNeedsLayout = e = 3 === t.offsetWidth,
            e && (n.style.zoom = 1)),
                n.removeChild(r))
        }),
        function() {
            var e = h.createElement("div");
            S.deleteExpando = !0;
            try {
                delete e.test
            } catch (t) {
                S.deleteExpando = !1
            }
            e = null
        }();
    var O, P = function(e) {
        var t = E.noData[(e.nodeName + " ").toLowerCase()]
            , n = +e.nodeType || 1;
        return (1 === n || 9 === n) && (!t || !0 !== t && e.getAttribute("classid") === t)
    }, R = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, B = /([A-Z])/g;
    function F(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var r = "data-" + t.replace(B, "-$1").toLowerCase();
            if ("string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : R.test(n) ? E.parseJSON(n) : n)
                } catch (c) {}
                E.data(e, t, n)
            } else
                n = void 0
        }
        return n
    }
    function H(e) {
        var t;
        for (t in e)
            if (("data" !== t || !E.isEmptyObject(e[t])) && "toJSON" !== t)
                return !1;
        return !0
    }
    function U(e, t, n, r) {
        if (P(e)) {
            var i, o, a = E.expando, s = e.nodeType, l = s ? E.cache : e, u = s ? e[a] : e[a] && a;
            if (u && l[u] && (r || l[u].data) || void 0 !== n || "string" != typeof t)
                return u || (u = s ? e[a] = d.pop() || E.guid++ : a),
                l[u] || (l[u] = s ? {} : {
                    toJSON: E.noop
                }),
                "object" != typeof t && "function" != typeof t || (r ? l[u] = E.extend(l[u], t) : l[u].data = E.extend(l[u].data, t)),
                    o = l[u],
                r || (o.data || (o.data = {}),
                    o = o.data),
                void 0 !== n && (o[E.camelCase(t)] = n),
                    "string" == typeof t ? null == (i = o[t]) && (i = o[E.camelCase(t)]) : i = o,
                    i
        }
    }
    function q(e, t, n) {
        if (P(e)) {
            var r, i, o = e.nodeType, a = o ? E.cache : e, s = o ? e[E.expando] : E.expando;
            if (a[s]) {
                if (t && (r = n ? a[s] : a[s].data)) {
                    i = (t = E.isArray(t) ? t.concat(E.map(t, E.camelCase)) : t in r ? [t] : (t = E.camelCase(t))in r ? [t] : t.split(" ")).length;
                    for (; i--; )
                        delete r[t[i]];
                    if (n ? !H(r) : !E.isEmptyObject(r))
                        return
                }
                (n || (delete a[s].data,
                    H(a[s]))) && (o ? E.cleanData([e], !0) : S.deleteExpando || a != a.window ? delete a[s] : a[s] = void 0)
            }
        }
    }
    E.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return !!(e = e.nodeType ? E.cache[e[E.expando]] : e[E.expando]) && !H(e)
        },
        data: function(e, t, n) {
            return U(e, t, n)
        },
        removeData: function(e, t) {
            return q(e, t)
        },
        _data: function(e, t, n) {
            return U(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return q(e, t, !0)
        }
    }),
        E.fn.extend({
            data: function(e, t) {
                var n, r, i, o = this[0], a = o && o.attributes;
                if (void 0 !== e)
                    return "object" == typeof e ? this.each(function() {
                        E.data(this, e)
                    }) : 1 < arguments.length ? this.each(function() {
                        E.data(this, e, t)
                    }) : o ? F(o, e, E.data(o, e)) : void 0;
                if (this.length && (i = E.data(o),
                1 === o.nodeType && !E._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--; )
                        a[n] && (0 === (r = a[n].name).indexOf("data-") && F(o, r = E.camelCase(r.slice(5)), i[r]));
                    E._data(o, "parsedAttrs", !0)
                }
                return i
            },
            removeData: function(e) {
                return this.each(function() {
                    E.removeData(this, e)
                })
            }
        }),
        E.extend({
            queue: function(e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue",
                    r = E._data(e, t),
                n && (!r || E.isArray(n) ? r = E._data(e, t, E.makeArray(n)) : r.push(n)),
                r || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = E.queue(e, t)
                    , r = n.length
                    , i = n.shift()
                    , o = E._queueHooks(e, t);
                "inprogress" === i && (i = n.shift(),
                    r--),
                i && ("fx" === t && n.unshift("inprogress"),
                    delete o.stop,
                    i.call(e, function() {
                        E.dequeue(e, t)
                    }, o)),
                !r && o && o.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return E._data(e, n) || E._data(e, n, {
                    empty: E.Callbacks("once memory").add(function() {
                        E._removeData(e, t + "queue"),
                            E._removeData(e, n)
                    })
                })
            }
        }),
        E.fn.extend({
            queue: function(t, n) {
                var e = 2;
                return "string" != typeof t && (n = t,
                    t = "fx",
                    e--),
                    arguments.length < e ? E.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                        var e = E.queue(this, t, n);
                        E._queueHooks(this, t),
                        "fx" === t && "inprogress" !== e[0] && E.dequeue(this, t)
                    })
            },
            dequeue: function(e) {
                return this.each(function() {
                    E.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, r = 1, i = E.Deferred(), o = this, a = this.length, s = function() {
                    --r || i.resolveWith(o, [o])
                };
                for ("string" != typeof e && (t = e,
                    e = void 0),
                         e = e || "fx"; a--; )
                    (n = E._data(o[a], e + "queueHooks")) && n.empty && (r++,
                        n.empty.add(s));
                return s(),
                    i.promise(t)
            }
        }),
        S.shrinkWrapBlocks = function() {
            return null != O ? O : (O = !1,
                (t = h.getElementsByTagName("body")[0]) && t.style ? (e = h.createElement("div"),
                    (n = h.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    t.appendChild(n).appendChild(e),
                "undefined" != typeof e.style.zoom && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
                    e.appendChild(h.createElement("div")).style.width = "5px",
                    O = 3 !== e.offsetWidth),
                    t.removeChild(n),
                    O) : void 0);
            var e, t, n
        }
    ;
    var W = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
        , z = new RegExp("^(?:([+-])=|)(" + W + ")([a-z%]*)$","i")
        , V = ["Top", "Right", "Bottom", "Left"]
        , X = function(e, t) {
        return e = t || e,
        "none" === E.css(e, "display") || !E.contains(e.ownerDocument, e)
    };
    function G(e, t, n, r) {
        var i, o = 1, a = 20, s = r ? function() {
                return r.cur()
            }
            : function() {
                return E.css(e, t, "")
            }
            , l = s(), u = n && n[3] || (E.cssNumber[t] ? "" : "px"), c = (E.cssNumber[t] || "px" !== u && +l) && z.exec(E.css(e, t));
        if (c && c[3] !== u)
            for (u = u || c[3],
                     n = n || [],
                     c = +l || 1; c /= o = o || ".5",
                     E.style(e, t, c + u),
                 o !== (o = s() / l) && 1 !== o && --a; )
                ;
        return n && (c = +c || +l || 0,
            i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = u,
            r.start = c,
            r.end = i)),
            i
    }
    var J, K, Z, Q = function(e, t, n, r, i, o, a) {
        var s = 0
            , l = e.length
            , u = null == n;
        if ("object" === E.type(n))
            for (s in i = !0,
                n)
                Q(e, t, s, n[s], !0, o, a);
        else if (void 0 !== r && (i = !0,
        E.isFunction(r) || (a = !0),
        u && (t = a ? (t.call(e, r),
            null) : (u = t,
                function(e, t, n) {
                    return u.call(E(e), n)
                }
        )),
            t))
            for (; s < l; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
    }, Y = /^(?:checkbox|radio)$/i, ee = /<([\w:-]+)/, te = /^$|\/(?:java|ecma)script/i, ne = /^\s+/, re = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function ie(e) {
        var t = re.split("|")
            , n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length; )
                n.createElement(t.pop());
        return n
    }
    J = h.createElement("div"),
        K = h.createDocumentFragment(),
        Z = h.createElement("input"),
        J.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        S.leadingWhitespace = 3 === J.firstChild.nodeType,
        S.tbody = !J.getElementsByTagName("tbody").length,
        S.htmlSerialize = !!J.getElementsByTagName("link").length,
        S.html5Clone = "<:nav></:nav>" !== h.createElement("nav").cloneNode(!0).outerHTML,
        Z.type = "checkbox",
        Z.checked = !0,
        K.appendChild(Z),
        S.appendChecked = Z.checked,
        J.innerHTML = "<textarea>x</textarea>",
        S.noCloneChecked = !!J.cloneNode(!0).lastChild.defaultValue,
        K.appendChild(J),
        (Z = h.createElement("input")).setAttribute("type", "radio"),
        Z.setAttribute("checked", "checked"),
        Z.setAttribute("name", "t"),
        J.appendChild(Z),
        S.checkClone = J.cloneNode(!0).cloneNode(!0).lastChild.checked,
        S.noCloneEvent = !!J.addEventListener,
        J[E.expando] = 1,
        S.attributes = !J.getAttribute(E.expando);
    var oe = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: S.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    function be(e, t) {
        var n, r, i = 0, o = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [],
                     n = e.childNodes || e; null != (r = n[i]); i++)
                !t || E.nodeName(r, t) ? o.push(r) : E.merge(o, be(r, t));
        return void 0 === t || t && E.nodeName(e, t) ? E.merge([e], o) : o
    }
    function ae(e, t) {
        for (var n, r = 0; null != (n = e[r]); r++)
            E._data(n, "globalEval", !t || E._data(t[r], "globalEval"))
    }
    oe.optgroup = oe.option,
        oe.tbody = oe.tfoot = oe.colgroup = oe.caption = oe.thead,
        oe.th = oe.td;
    var se = /<|&#?\w+;/
        , le = /<tbody/i;
    function ue(e) {
        Y.test(e.type) && (e.defaultChecked = e.checked)
    }
    function ce(e, t, n, r, i) {
        for (var o, a, s, l, u, c, d, f = e.length, p = ie(t), h = [], g = 0; g < f; g++)
            if ((a = e[g]) || 0 === a)
                if ("object" === E.type(a))
                    E.merge(h, a.nodeType ? [a] : a);
                else if (se.test(a)) {
                    for (l = l || p.appendChild(t.createElement("div")),
                             u = (ee.exec(a) || ["", ""])[1].toLowerCase(),
                             d = oe[u] || oe._default,
                             l.innerHTML = d[1] + E.htmlPrefilter(a) + d[2],
                             o = d[0]; o--; )
                        l = l.lastChild;
                    if (!S.leadingWhitespace && ne.test(a) && h.push(t.createTextNode(ne.exec(a)[0])),
                        !S.tbody)
                        for (o = (a = "table" !== u || le.test(a) ? "<table>" !== d[1] || le.test(a) ? 0 : l : l.firstChild) && a.childNodes.length; o--; )
                            E.nodeName(c = a.childNodes[o], "tbody") && !c.childNodes.length && a.removeChild(c);
                    for (E.merge(h, l.childNodes),
                             l.textContent = ""; l.firstChild; )
                        l.removeChild(l.firstChild);
                    l = p.lastChild
                } else
                    h.push(t.createTextNode(a));
        for (l && p.removeChild(l),
             S.appendChecked || E.grep(be(h, "input"), ue),
                 g = 0; a = h[g++]; )
            if (r && -1 < E.inArray(a, r))
                i && i.push(a);
            else if (s = E.contains(a.ownerDocument, a),
                l = be(p.appendChild(a), "script"),
            s && ae(l),
                n)
                for (o = 0; a = l[o++]; )
                    te.test(a.type || "") && n.push(a);
        return l = null,
            p
    }
    !function() {
        var e, t, n = h.createElement("div");
        for (e in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            t = "on" + e,
            (S[e] = t in T) || (n.setAttribute(t, "t"),
                S[e] = !1 === n.attributes[t].expando);
        n = null
    }();
    var de = /^(?:input|select|textarea)$/i
        , fe = /^key/
        , pe = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
        , he = /^(?:focusinfocus|focusoutblur)$/
        , ge = /^([^.]*)(?:\.(.+)|)/;
    function me() {
        return !0
    }
    function ve() {
        return !1
    }
    function ye() {
        try {
            return h.activeElement
        } catch (T) {}
    }
    function we(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
                n = void 0),
                t)
                we(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
            r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
            r = void 0) : (i = r,
            r = n,
            n = void 0)),
        !1 === i)
            i = ve;
        else if (!i)
            return e;
        return 1 === o && (a = i,
            (i = function(e) {
                    return E().off(e),
                        a.apply(this, arguments)
                }
            ).guid = a.guid || (a.guid = E.guid++)),
            e.each(function() {
                E.event.add(this, t, i, r, n)
            })
    }
    E.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, g, m = E._data(e);
            if (m) {
                for (n.handler && (n = (l = n).handler,
                    i = l.selector),
                     n.guid || (n.guid = E.guid++),
                     (a = m.events) || (a = m.events = {}),
                     (c = m.handle) || ((c = m.handle = function(e) {
                             return void 0 === E || e && E.event.triggered === e.type ? void 0 : E.event.dispatch.apply(c.elem, arguments)
                         }
                     ).elem = e),
                         s = (t = (t || "").match(D) || [""]).length; s--; )
                    p = g = (o = ge.exec(t[s]) || [])[1],
                        h = (o[2] || "").split(".").sort(),
                    p && (u = E.event.special[p] || {},
                        p = (i ? u.delegateType : u.bindType) || p,
                        u = E.event.special[p] || {},
                        d = E.extend({
                            type: p,
                            origType: g,
                            data: r,
                            handler: n,
                            guid: n.guid,
                            selector: i,
                            needsContext: i && E.expr.match.needsContext.test(i),
                            namespace: h.join(".")
                        }, l),
                    (f = a[p]) || ((f = a[p] = []).delegateCount = 0,
                    u.setup && !1 !== u.setup.call(e, r, h, c) || (e.addEventListener ? e.addEventListener(p, c, !1) : e.attachEvent && e.attachEvent("on" + p, c))),
                    u.add && (u.add.call(e, d),
                    d.handler.guid || (d.handler.guid = n.guid)),
                        i ? f.splice(f.delegateCount++, 0, d) : f.push(d),
                        E.event.global[p] = !0);
                e = null
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, g, m = E.hasData(e) && E._data(e);
            if (m && (c = m.events)) {
                for (u = (t = (t || "").match(D) || [""]).length; u--; )
                    if (p = g = (s = ge.exec(t[u]) || [])[1],
                        h = (s[2] || "").split(".").sort(),
                        p) {
                        for (d = E.event.special[p] || {},
                                 f = c[p = (r ? d.delegateType : d.bindType) || p] || [],
                                 s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                                 l = o = f.length; o--; )
                            a = f[o],
                            !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1),
                            a.selector && f.delegateCount--,
                            d.remove && d.remove.call(e, a));
                        l && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, m.handle) || E.removeEvent(e, p, m.handle),
                            delete c[p])
                    } else
                        for (p in c)
                            E.event.remove(e, p + t[u], n, r, !0);
                E.isEmptyObject(c) && (delete m.handle,
                    E._removeData(e, "events"))
            }
        },
        trigger: function(e, t, n, r) {
            var i, o, a, s, l, u, c, d = [n || h], f = m.call(e, "type") ? e.type : e, p = m.call(e, "namespace") ? e.namespace.split(".") : [];
            if (a = u = n = n || h,
            3 !== n.nodeType && 8 !== n.nodeType && !he.test(f + E.event.triggered) && (-1 < f.indexOf(".") && (f = (p = f.split(".")).shift(),
                p.sort()),
                o = f.indexOf(":") < 0 && "on" + f,
                (e = e[E.expando] ? e : new E.Event(f,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
                e.namespace = p.join("."),
                e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                e.result = void 0,
            e.target || (e.target = n),
                t = null == t ? [e] : E.makeArray(t, [e]),
                l = E.event.special[f] || {},
            r || !l.trigger || !1 !== l.trigger.apply(n, t))) {
                if (!r && !l.noBubble && !E.isWindow(n)) {
                    for (s = l.delegateType || f,
                         he.test(s + f) || (a = a.parentNode); a; a = a.parentNode)
                        d.push(a),
                            u = a;
                    u === (n.ownerDocument || h) && d.push(u.defaultView || u.parentWindow || T)
                }
                for (c = 0; (a = d[c++]) && !e.isPropagationStopped(); )
                    e.type = 1 < c ? s : l.bindType || f,
                    (i = (E._data(a, "events") || {})[e.type] && E._data(a, "handle")) && i.apply(a, t),
                    (i = o && a[o]) && i.apply && P(a) && (e.result = i.apply(a, t),
                    !1 === e.result && e.preventDefault());
                if (e.type = f,
                !r && !e.isDefaultPrevented() && (!l._default || !1 === l._default.apply(d.pop(), t)) && P(n) && o && n[f] && !E.isWindow(n)) {
                    (u = n[o]) && (n[o] = null),
                        E.event.triggered = f;
                    try {
                        n[f]()
                    } catch (v) {}
                    E.event.triggered = void 0,
                    u && (n[o] = u)
                }
                return e.result
            }
        },
        dispatch: function(e) {
            e = E.event.fix(e);
            var t, n, r, i, o, a = [], s = c.call(arguments), l = (E._data(this, "events") || {})[e.type] || [], u = E.event.special[e.type] || {};
            if ((s[0] = e).delegateTarget = this,
            !u.preDispatch || !1 !== u.preDispatch.call(this, e)) {
                for (a = E.event.handlers.call(this, e, l),
                         t = 0; (i = a[t++]) && !e.isPropagationStopped(); )
                    for (e.currentTarget = i.elem,
                             n = 0; (o = i.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                        e.rnamespace && !e.rnamespace.test(o.namespace) || (e.handleObj = o,
                            e.data = o.data,
                        void 0 !== (r = ((E.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (e.result = r) && (e.preventDefault(),
                            e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e),
                    e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a = [], s = t.delegateCount, l = e.target;
            if (s && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (r = [],
                                 n = 0; n < s; n++)
                            void 0 === r[i = (o = t[n]).selector + " "] && (r[i] = o.needsContext ? -1 < E(i, this).index(l) : E.find(i, this, null, [l]).length),
                            r[i] && r.push(o);
                        r.length && a.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }),
                a
        },
        fix: function(e) {
            if (e[E.expando])
                return e;
            var t, n, r, i = e.type, o = e, a = this.fixHooks[i];
            for (a || (this.fixHooks[i] = a = pe.test(i) ? this.mouseHooks : fe.test(i) ? this.keyHooks : {}),
                     r = a.props ? this.props.concat(a.props) : this.props,
                     e = new E.Event(o),
                     t = r.length; t--; )
                e[n = r[t]] = o[n];
            return e.target || (e.target = o.srcElement || h),
            3 === e.target.nodeType && (e.target = e.target.parentNode),
                e.metaKey = !!e.metaKey,
                a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                    e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button, a = t.fromElement;
                return null == e.pageX && null != t.clientX && (i = (r = e.target.ownerDocument || h).documentElement,
                    n = r.body,
                    e.pageX = t.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0),
                    e.pageY = t.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)),
                !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a),
                e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                    e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== ye() && this.focus)
                        try {
                            return this.focus(),
                                !1
                        } catch (T) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === ye() && this.blur ? (this.blur(),
                        !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return E.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                        !1) : void 0
                },
                _default: function(e) {
                    return E.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n) {
            var r = E.extend(new E.Event, n, {
                type: e,
                isSimulated: !0
            });
            E.event.trigger(r, null, t),
            r.isDefaultPrevented() && n.preventDefault()
        }
    },
        E.removeEvent = h.removeEventListener ? function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n)
            }
            : function(e, t, n) {
                var r = "on" + t;
                e.detachEvent && ("undefined" == typeof e[r] && (e[r] = null),
                    e.detachEvent(r, n))
            }
        ,
        E.Event = function(e, t) {
            return this instanceof E.Event ? (e && e.type ? (this.originalEvent = e,
                this.type = e.type,
                this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? me : ve) : this.type = e,
            t && E.extend(this, t),
                this.timeStamp = e && e.timeStamp || E.now(),
                void (this[E.expando] = !0)) : new E.Event(e,t)
        }
        ,
        E.Event.prototype = {
            constructor: E.Event,
            isDefaultPrevented: ve,
            isPropagationStopped: ve,
            isImmediatePropagationStopped: ve,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = me,
                e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = me,
                e && !this.isSimulated && (e.stopPropagation && e.stopPropagation(),
                    e.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = me,
                e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        E.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, i) {
            E.event.special[e] = {
                delegateType: i,
                bindType: i,
                handle: function(e) {
                    var t, n = e.relatedTarget, r = e.handleObj;
                    return n && (n === this || E.contains(this, n)) || (e.type = r.origType,
                        t = r.handler.apply(this, arguments),
                        e.type = i),
                        t
                }
            }
        }),
    S.submit || (E.event.special.submit = {
        setup: function() {
            return !E.nodeName(this, "form") && void E.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target
                    , n = E.nodeName(t, "input") || E.nodeName(t, "button") ? E.prop(t, "form") : void 0;
                n && !E._data(n, "submit") && (E.event.add(n, "submit._submit", function(e) {
                    e._submitBubble = !0
                }),
                    E._data(n, "submit", !0))
            })
        },
        postDispatch: function(e) {
            e._submitBubble && (delete e._submitBubble,
            this.parentNode && !e.isTrigger && E.event.simulate("submit", this.parentNode, e))
        },
        teardown: function() {
            return !E.nodeName(this, "form") && void E.event.remove(this, "._submit")
        }
    }),
    S.change || (E.event.special.change = {
        setup: function() {
            return de.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (E.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._justChanged = !0)
            }),
                E.event.add(this, "click._change", function(e) {
                    this._justChanged && !e.isTrigger && (this._justChanged = !1),
                        E.event.simulate("change", this, e)
                })),
                !1) : void E.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                de.test(t.nodeName) && !E._data(t, "change") && (E.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || E.event.simulate("change", this.parentNode, e)
                }),
                    E._data(t, "change", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return E.event.remove(this, "._change"),
                !de.test(this.nodeName)
        }
    }),
    S.focusin || E.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            E.event.simulate(r, e.target, E.event.fix(e))
        };
        E.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this
                    , t = E._data(e, r);
                t || e.addEventListener(n, i, !0),
                    E._data(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this
                    , t = E._data(e, r) - 1;
                t ? E._data(e, r, t) : (e.removeEventListener(n, i, !0),
                    E._removeData(e, r))
            }
        }
    }),
        E.fn.extend({
            on: function(e, t, n, r) {
                return we(this, e, t, n, r)
            },
            one: function(e, t, n, r) {
                return we(this, e, t, n, r, 1)
            },
            off: function(e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj)
                    return r = e.handleObj,
                        E(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                        this;
                if ("object" != typeof e)
                    return !1 !== t && "function" != typeof t || (n = t,
                        t = void 0),
                    !1 === n && (n = ve),
                        this.each(function() {
                            E.event.remove(this, e, n, t)
                        });
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            },
            trigger: function(e, t) {
                return this.each(function() {
                    E.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                return n ? E.event.trigger(e, t, n, !0) : void 0
            }
        });
    var _e = / jQuery\d+="(?:null|\d+)"/g
        , xe = new RegExp("<(?:" + re + ")[\\s/>]","i")
        , Ce = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi
        , ke = /<script|<style|<link/i
        , Te = /checked\s*(?:[^=]|=\s*.checked.)/i
        , Se = /^true\/(.*)/
        , Ee = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
        , Ae = ie(h).appendChild(h.createElement("div"));
    function Le(e, t) {
        return E.nodeName(e, "table") && E.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function Ie(e) {
        return e.type = (null !== E.find.attr(e, "type")) + "/" + e.type,
            e
    }
    function $e(e) {
        var t = Se.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
            e
    }
    function je(e, t) {
        if (1 === t.nodeType && E.hasData(e)) {
            var n, r, i, o = E._data(e), a = E._data(t, o), s = o.events;
            if (s)
                for (n in delete a.handle,
                    a.events = {},
                    s)
                    for (r = 0,
                             i = s[n].length; r < i; r++)
                        E.event.add(t, n, s[n][r]);
            a.data && (a.data = E.extend({}, a.data))
        }
    }
    function De(e, t) {
        var n, r, i;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(),
            !S.noCloneEvent && t[E.expando]) {
                for (r in (i = E._data(t)).events)
                    E.removeEvent(t, r, i.handle);
                t.removeAttribute(E.expando)
            }
            "script" === n && t.text !== e.text ? (Ie(t).text = e.text,
                $e(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML),
            S.html5Clone && e.innerHTML && !E.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Y.test(e.type) ? (t.defaultChecked = t.checked = e.checked,
            t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }
    }
    function Ne(n, r, i, o) {
        r = g.apply([], r);
        var e, t, a, s, l, u, c = 0, d = n.length, f = d - 1, p = r[0], h = E.isFunction(p);
        if (h || 1 < d && "string" == typeof p && !S.checkClone && Te.test(p))
            return n.each(function(e) {
                var t = n.eq(e);
                h && (r[0] = p.call(this, e, t.html())),
                    Ne(t, r, i, o)
            });
        if (d && (e = (u = ce(r, n[0].ownerDocument, !1, n, o)).firstChild,
        1 === u.childNodes.length && (u = e),
        e || o)) {
            for (a = (s = E.map(be(u, "script"), Ie)).length; c < d; c++)
                t = u,
                c !== f && (t = E.clone(t, !0, !0),
                a && E.merge(s, be(t, "script"))),
                    i.call(n[c], t, c);
            if (a)
                for (l = s[s.length - 1].ownerDocument,
                         E.map(s, $e),
                         c = 0; c < a; c++)
                    t = s[c],
                    te.test(t.type || "") && !E._data(t, "globalEval") && E.contains(l, t) && (t.src ? E._evalUrl && E._evalUrl(t.src) : E.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Ee, "")));
            u = e = null
        }
        return n
    }
    function Me(e, t, n) {
        for (var r, i = t ? E.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || E.cleanData(be(r)),
            r.parentNode && (n && E.contains(r.ownerDocument, r) && ae(be(r, "script")),
                r.parentNode.removeChild(r));
        return e
    }
    E.extend({
        htmlPrefilter: function(e) {
            return e.replace(Ce, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, l = E.contains(e.ownerDocument, e);
            if (S.html5Clone || E.isXMLDoc(e) || !xe.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Ae.innerHTML = e.outerHTML,
                Ae.removeChild(o = Ae.firstChild)),
                !(S.noCloneEvent && S.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || E.isXMLDoc(e)))
                for (r = be(o),
                         s = be(e),
                         a = 0; null != (i = s[a]); ++a)
                    r[a] && De(i, r[a]);
            if (t)
                if (n)
                    for (s = s || be(e),
                             r = r || be(o),
                             a = 0; null != (i = s[a]); a++)
                        je(i, r[a]);
                else
                    je(e, o);
            return 0 < (r = be(o, "script")).length && ae(r, !l && be(e, "script")),
                r = s = i = null,
                o
        },
        cleanData: function(e, t) {
            for (var n, r, i, o, a = 0, s = E.expando, l = E.cache, u = S.attributes, c = E.event.special; null != (n = e[a]); a++)
                if ((t || P(n)) && (o = (i = n[s]) && l[i])) {
                    if (o.events)
                        for (r in o.events)
                            c[r] ? E.event.remove(n, r) : E.removeEvent(n, r, o.handle);
                    l[i] && (delete l[i],
                        u || "undefined" == typeof n.removeAttribute ? n[s] = void 0 : n.removeAttribute(s),
                        d.push(i))
                }
        }
    }),
        E.fn.extend({
            domManip: Ne,
            detach: function(e) {
                return Me(this, e, !0)
            },
            remove: function(e) {
                return Me(this, e)
            },
            text: function(e) {
                return Q(this, function(e) {
                    return void 0 === e ? E.text(this) : this.empty().append((this[0] && this[0].ownerDocument || h).createTextNode(e))
                }, null, e, arguments.length)
            },
            append: function() {
                return Ne(this, arguments, function(e) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Le(this, e).appendChild(e)
                })
            },
            prepend: function() {
                return Ne(this, arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = Le(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return Ne(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return Ne(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    for (1 === e.nodeType && E.cleanData(be(e, !1)); e.firstChild; )
                        e.removeChild(e.firstChild);
                    e.options && E.nodeName(e, "select") && (e.options.length = 0)
                }
                return this
            },
            clone: function(e, t) {
                return e = null != e && e,
                    t = null == t ? e : t,
                    this.map(function() {
                        return E.clone(this, e, t)
                    })
            },
            html: function(e) {
                return Q(this, function(e) {
                    var t = this[0] || {}
                        , n = 0
                        , r = this.length;
                    if (void 0 === e)
                        return 1 === t.nodeType ? t.innerHTML.replace(_e, "") : void 0;
                    if ("string" == typeof e && !ke.test(e) && (S.htmlSerialize || !xe.test(e)) && (S.leadingWhitespace || !ne.test(e)) && !oe[(ee.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = E.htmlPrefilter(e);
                        try {
                            for (; n < r; n++)
                                1 === (t = this[n] || {}).nodeType && (E.cleanData(be(t, !1)),
                                    t.innerHTML = e);
                            t = 0
                        } catch (c) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var n = [];
                return Ne(this, arguments, function(e) {
                    var t = this.parentNode;
                    E.inArray(this, n) < 0 && (E.cleanData(be(this)),
                    t && t.replaceChild(e, this))
                }, n)
            }
        }),
        E.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, a) {
            E.fn[e] = function(e) {
                for (var t, n = 0, r = [], i = E(e), o = i.length - 1; n <= o; n++)
                    t = n === o ? this : this.clone(!0),
                        E(i[n])[a](t),
                        s.apply(r, t.get());
                return this.pushStack(r)
            }
        });
    var Oe, Pe = {
        HTML: "block",
        BODY: "block"
    };
    function Re(e, t) {
        var n = E(t.createElement(e)).appendTo(t.body)
            , r = E.css(n[0], "display");
        return n.detach(),
            r
    }
    function Be(e) {
        var t = h
            , n = Pe[e];
        return n || ("none" !== (n = Re(e, t)) && n || ((t = ((Oe = (Oe || E("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow || Oe[0].contentDocument).document).write(),
            t.close(),
            n = Re(e, t),
            Oe.detach()),
            Pe[e] = n),
            n
    }
    var Fe = /^margin/
        , He = new RegExp("^(" + W + ")(?!px)[a-z%]+$","i")
        , Ue = function(e, t, n, r) {
        var i, o, a = {};
        for (o in t)
            a[o] = e.style[o],
                e.style[o] = t[o];
        for (o in i = n.apply(e, r || []),
            t)
            e.style[o] = a[o];
        return i
    }
        , qe = h.documentElement;
    !function() {
        var r, i, o, a, s, l, u = h.createElement("div"), c = h.createElement("div");
        if (c.style) {
            function e() {
                var e, t, n = h.documentElement;
                n.appendChild(u),
                    c.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
                    r = o = l = !1,
                    i = s = !0,
                T.getComputedStyle && (t = T.getComputedStyle(c),
                    r = "1%" !== (t || {}).top,
                    l = "2px" === (t || {}).marginLeft,
                    o = "4px" === (t || {
                        width: "4px"
                    }).width,
                    c.style.marginRight = "50%",
                    i = "4px" === (t || {
                        marginRight: "4px"
                    }).marginRight,
                    (e = c.appendChild(h.createElement("div"))).style.cssText = c.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                    e.style.marginRight = e.style.width = "0",
                    c.style.width = "1px",
                    s = !parseFloat((T.getComputedStyle(e) || {}).marginRight),
                    c.removeChild(e)),
                    c.style.display = "none",
                (a = 0 === c.getClientRects().length) && (c.style.display = "",
                    c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
                    c.childNodes[0].style.borderCollapse = "separate",
                    (e = c.getElementsByTagName("td"))[0].style.cssText = "margin:0;border:0;padding:0;display:none",
                (a = 0 === e[0].offsetHeight) && (e[0].style.display = "",
                    e[1].style.display = "none",
                    a = 0 === e[0].offsetHeight)),
                    n.removeChild(u)
            }
            c.style.cssText = "float:left;opacity:.5",
                S.opacity = "0.5" === c.style.opacity,
                S.cssFloat = !!c.style.cssFloat,
                c.style.backgroundClip = "content-box",
                c.cloneNode(!0).style.backgroundClip = "",
                S.clearCloneStyle = "content-box" === c.style.backgroundClip,
                (u = h.createElement("div")).style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
                c.innerHTML = "",
                u.appendChild(c),
                S.boxSizing = "" === c.style.boxSizing || "" === c.style.MozBoxSizing || "" === c.style.WebkitBoxSizing,
                E.extend(S, {
                    reliableHiddenOffsets: function() {
                        return null == r && e(),
                            a
                    },
                    boxSizingReliable: function() {
                        return null == r && e(),
                            o
                    },
                    pixelMarginRight: function() {
                        return null == r && e(),
                            i
                    },
                    pixelPosition: function() {
                        return null == r && e(),
                            r
                    },
                    reliableMarginRight: function() {
                        return null == r && e(),
                            s
                    },
                    reliableMarginLeft: function() {
                        return null == r && e(),
                            l
                    }
                })
        }
    }();
    var We, ze, Ve = /^(top|right|bottom|left)$/;
    function Xe(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    T.getComputedStyle ? (We = function(e) {
            var t = e.ownerDocument.defaultView;
            return t && t.opener || (t = T),
                t.getComputedStyle(e)
        }
            ,
            ze = function(e, t, n) {
                var r, i, o, a, s = e.style;
                return "" !== (a = (n = n || We(e)) ? n.getPropertyValue(t) || n[t] : void 0) && void 0 !== a || E.contains(e.ownerDocument, e) || (a = E.style(e, t)),
                n && !S.pixelMarginRight() && He.test(a) && Fe.test(t) && (r = s.width,
                    i = s.minWidth,
                    o = s.maxWidth,
                    s.minWidth = s.maxWidth = s.width = a,
                    a = n.width,
                    s.width = r,
                    s.minWidth = i,
                    s.maxWidth = o),
                    void 0 === a ? a : a + ""
            }
    ) : qe.currentStyle && (We = function(e) {
            return e.currentStyle
        }
            ,
            ze = function(e, t, n) {
                var r, i, o, a, s = e.style;
                return null == (a = (n = n || We(e)) ? n[t] : void 0) && s && s[t] && (a = s[t]),
                He.test(a) && !Ve.test(t) && (r = s.left,
                (o = (i = e.runtimeStyle) && i.left) && (i.left = e.currentStyle.left),
                    s.left = "fontSize" === t ? "1em" : a,
                    a = s.pixelLeft + "px",
                    s.left = r,
                o && (i.left = o)),
                    void 0 === a ? a : a + "" || "auto"
            }
    );
    var Ge = /alpha\([^)]*\)/i
        , Je = /opacity\s*=\s*([^)]*)/i
        , Ke = /^(none|table(?!-c[ea]).+)/
        , Ze = new RegExp("^(" + W + ")(.*)$","i")
        , Qe = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
        , Ye = {
        letterSpacing: "0",
        fontWeight: "400"
    }
        , et = ["Webkit", "O", "Moz", "ms"]
        , tt = h.createElement("div").style;
    function nt(e) {
        if (e in tt)
            return e;
        for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = et.length; n--; )
            if ((e = et[n] + t)in tt)
                return e
    }
    function rt(e, t) {
        for (var n, r, i, o = [], a = 0, s = e.length; a < s; a++)
            (r = e[a]).style && (o[a] = E._data(r, "olddisplay"),
                n = r.style.display,
                t ? (o[a] || "none" !== n || (r.style.display = ""),
                "" === r.style.display && X(r) && (o[a] = E._data(r, "olddisplay", Be(r.nodeName)))) : (i = X(r),
                (n && "none" !== n || !i) && E._data(r, "olddisplay", i ? n : E.css(r, "display"))));
        for (a = 0; a < s; a++)
            (r = e[a]).style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }
    function it(e, t, n) {
        var r = Ze.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }
    function ot(e, t, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; o < 4; o += 2)
            "margin" === n && (a += E.css(e, n + V[o], !0, i)),
                r ? ("content" === n && (a -= E.css(e, "padding" + V[o], !0, i)),
                "margin" !== n && (a -= E.css(e, "border" + V[o] + "Width", !0, i))) : (a += E.css(e, "padding" + V[o], !0, i),
                "padding" !== n && (a += E.css(e, "border" + V[o] + "Width", !0, i)));
        return a
    }
    function at(e, t, n) {
        var r = !0
            , i = "width" === t ? e.offsetWidth : e.offsetHeight
            , o = We(e)
            , a = S.boxSizing && "border-box" === E.css(e, "boxSizing", !1, o);
        if (i <= 0 || null == i) {
            if (((i = ze(e, t, o)) < 0 || null == i) && (i = e.style[t]),
                He.test(i))
                return i;
            r = a && (S.boxSizingReliable() || i === e.style[t]),
                i = parseFloat(i) || 0
        }
        return i + ot(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }
    function st(e, t, n, r, i) {
        return new st.prototype.init(e,t,n,r,i)
    }
    E.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = ze(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": S.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = E.camelCase(t), l = e.style;
                if (t = E.cssProps[s] || (E.cssProps[s] = nt(s) || s),
                    a = E.cssHooks[t] || E.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                if ("string" === (o = typeof n) && (i = z.exec(n)) && i[1] && (n = G(e, t, i),
                    o = "number"),
                null != n && n == n && ("number" === o && (n += i && i[3] || (E.cssNumber[s] ? "" : "px")),
                S.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                    !(a && "set"in a && void 0 === (n = a.set(e, n, r)))))
                    try {
                        l[t] = n
                    } catch (u) {}
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = E.camelCase(t);
            return t = E.cssProps[s] || (E.cssProps[s] = nt(s) || s),
            (a = E.cssHooks[t] || E.cssHooks[s]) && "get"in a && (o = a.get(e, !0, n)),
            void 0 === o && (o = ze(e, t, r)),
            "normal" === o && t in Ye && (o = Ye[t]),
                "" === n || n ? (i = parseFloat(o),
                    !0 === n || isFinite(i) ? i || 0 : o) : o
        }
    }),
        E.each(["height", "width"], function(e, i) {
            E.cssHooks[i] = {
                get: function(e, t, n) {
                    return t ? Ke.test(E.css(e, "display")) && 0 === e.offsetWidth ? Ue(e, Qe, function() {
                        return at(e, i, n)
                    }) : at(e, i, n) : void 0
                },
                set: function(e, t, n) {
                    var r = n && We(e);
                    return it(0, t, n ? ot(e, i, n, S.boxSizing && "border-box" === E.css(e, "boxSizing", !1, r), r) : 0)
                }
            }
        }),
    S.opacity || (E.cssHooks.opacity = {
        get: function(e, t) {
            return Je.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style
                , r = e.currentStyle
                , i = E.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : ""
                , o = r && r.filter || n.filter || "";
            ((n.zoom = 1) <= t || "" === t) && "" === E.trim(o.replace(Ge, "")) && n.removeAttribute && (n.removeAttribute("filter"),
            "" === t || r && !r.filter) || (n.filter = Ge.test(o) ? o.replace(Ge, i) : o + " " + i)
        }
    }),
        E.cssHooks.marginRight = Xe(S.reliableMarginRight, function(e, t) {
            return t ? Ue(e, {
                display: "inline-block"
            }, ze, [e, "marginRight"]) : void 0
        }),
        E.cssHooks.marginLeft = Xe(S.reliableMarginLeft, function(e, t) {
            return t ? (parseFloat(ze(e, "marginLeft")) || (E.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - Ue(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            }) : 0)) + "px" : void 0
        }),
        E.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(i, o) {
            E.cssHooks[i + o] = {
                expand: function(e) {
                    for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                        n[i + V[t] + o] = r[t] || r[t - 2] || r[0];
                    return n
                }
            },
            Fe.test(i) || (E.cssHooks[i + o].set = it)
        }),
        E.fn.extend({
            css: function(e, t) {
                return Q(this, function(e, t, n) {
                    var r, i, o = {}, a = 0;
                    if (E.isArray(t)) {
                        for (r = We(e),
                                 i = t.length; a < i; a++)
                            o[t[a]] = E.css(e, t[a], !1, r);
                        return o
                    }
                    return void 0 !== n ? E.style(e, t, n) : E.css(e, t)
                }, e, t, 1 < arguments.length)
            },
            show: function() {
                return rt(this, !0)
            },
            hide: function() {
                return rt(this)
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                    X(this) ? E(this).show() : E(this).hide()
                })
            }
        }),
        ((E.Tween = st).prototype = {
            constructor: st,
            init: function(e, t, n, r, i, o) {
                this.elem = e,
                    this.prop = n,
                    this.easing = i || E.easing._default,
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = r,
                    this.unit = o || (E.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = st.propHooks[this.prop];
                return e && e.get ? e.get(this) : st.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = st.propHooks[this.prop];
                return this.options.duration ? this.pos = t = E.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
                    this.now = (this.end - this.start) * t + this.start,
                this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : st.propHooks._default.set(this),
                    this
            }
        }).init.prototype = st.prototype,
        (st.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = E.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
                },
                set: function(e) {
                    E.fx.step[e.prop] ? E.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[E.cssProps[e.prop]] && !E.cssHooks[e.prop] ? e.elem[e.prop] = e.now : E.style(e.elem, e.prop, e.now + e.unit)
                }
            }
        }).scrollTop = st.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        },
        E.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            },
            _default: "swing"
        },
        E.fx = st.prototype.init,
        E.fx.step = {};
    var lt, ut, ct, dt, ft, pt, ht, gt = /^(?:toggle|show|hide)$/, mt = /queueHooks$/;
    function vt() {
        return T.setTimeout(function() {
            lt = void 0
        }),
            lt = E.now()
    }
    function yt(e, t) {
        var n, r = {
            height: e
        }, i = 0;
        for (t = t ? 1 : 0; i < 4; i += 2 - t)
            r["margin" + (n = V[i])] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e),
            r
    }
    function wt(e, t, n) {
        for (var r, i = (bt.tweeners[t] || []).concat(bt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function bt(o, e, t) {
        var n, a, r = 0, i = bt.prefilters.length, s = E.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (a)
                return !1;
            for (var e = lt || vt(), t = Math.max(0, u.startTime + u.duration - e), n = 1 - (t / u.duration || 0), r = 0, i = u.tweens.length; r < i; r++)
                u.tweens[r].run(n);
            return s.notifyWith(o, [u, n, t]),
                n < 1 && i ? t : (s.resolveWith(o, [u]),
                    !1)
        }, u = s.promise({
            elem: o,
            props: E.extend({}, e),
            opts: E.extend(!0, {
                specialEasing: {},
                easing: E.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: lt || vt(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                var n = E.Tween(o, u.opts, e, t, u.opts.specialEasing[e] || u.opts.easing);
                return u.tweens.push(n),
                    n
            },
            stop: function(e) {
                var t = 0
                    , n = e ? u.tweens.length : 0;
                if (a)
                    return this;
                for (a = !0; t < n; t++)
                    u.tweens[t].run(1);
                return e ? (s.notifyWith(o, [u, 1, 0]),
                    s.resolveWith(o, [u, e])) : s.rejectWith(o, [u, e]),
                    this
            }
        }), c = u.props;
        for (function d(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (i = t[r = E.camelCase(n)],
                    o = e[n],
                E.isArray(o) && (i = o[1],
                    o = e[n] = o[0]),
                n !== r && (e[r] = o,
                    delete e[n]),
                (a = E.cssHooks[r]) && "expand"in a)
                    for (n in o = a.expand(o),
                        delete e[r],
                        o)
                        n in e || (e[n] = o[n],
                            t[n] = i);
                else
                    t[r] = i
        }(c, u.opts.specialEasing); r < i; r++)
            if (n = bt.prefilters[r].call(u, o, c, u.opts))
                return E.isFunction(n.stop) && (E._queueHooks(u.elem, u.opts.queue).stop = E.proxy(n.stop, n)),
                    n;
        return E.map(c, wt, u),
        E.isFunction(u.opts.start) && u.opts.start.call(o, u),
            E.fx.timer(E.extend(l, {
                elem: o,
                anim: u,
                queue: u.opts.queue
            })),
            u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }
    E.Animation = E.extend(bt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return G(n.elem, e, z.exec(t), n),
                    n
            }
            ]
        },
        tweener: function(e, t) {
            for (var n, r = 0, i = (e = E.isFunction(e) ? (t = e,
                ["*"]) : e.match(D)).length; r < i; r++)
                n = e[r],
                    bt.tweeners[n] = bt.tweeners[n] || [],
                    bt.tweeners[n].unshift(t)
        },
        prefilters: [function gn(t, e, n) {
            var r, i, o, a, s, l, u, c = this, d = {}, f = t.style, p = t.nodeType && X(t), h = E._data(t, "fxshow");
            for (r in n.queue || (null == (s = E._queueHooks(t, "fx")).unqueued && (s.unqueued = 0,
                    l = s.empty.fire,
                    s.empty.fire = function() {
                        s.unqueued || l()
                    }
            ),
                s.unqueued++,
                c.always(function() {
                    c.always(function() {
                        s.unqueued--,
                        E.queue(t, "fx").length || s.empty.fire()
                    })
                })),
            1 === t.nodeType && ("height"in e || "width"in e) && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
            "inline" === ("none" === (u = E.css(t, "display")) ? E._data(t, "olddisplay") || Be(t.nodeName) : u) && "none" === E.css(t, "float") && (S.inlineBlockNeedsLayout && "inline" !== Be(t.nodeName) ? f.zoom = 1 : f.display = "inline-block")),
            n.overflow && (f.overflow = "hidden",
            S.shrinkWrapBlocks() || c.always(function() {
                f.overflow = n.overflow[0],
                    f.overflowX = n.overflow[1],
                    f.overflowY = n.overflow[2]
            })),
                e)
                if (i = e[r],
                    gt.exec(i)) {
                    if (delete e[r],
                        o = o || "toggle" === i,
                    i === (p ? "hide" : "show")) {
                        if ("show" !== i || !h || void 0 === h[r])
                            continue;
                        p = !0
                    }
                    d[r] = h && h[r] || E.style(t, r)
                } else
                    u = void 0;
            if (E.isEmptyObject(d))
                "inline" === ("none" === u ? Be(t.nodeName) : u) && (f.display = u);
            else
                for (r in h ? "hidden"in h && (p = h.hidden) : h = E._data(t, "fxshow", {}),
                o && (h.hidden = !p),
                    p ? E(t).show() : c.done(function() {
                        E(t).hide()
                    }),
                    c.done(function() {
                        var e;
                        for (e in E._removeData(t, "fxshow"),
                            d)
                            E.style(t, e, d[e])
                    }),
                    d)
                    a = wt(p ? h[r] : 0, r, c),
                    r in h || (h[r] = a.start,
                    p && (a.end = a.start,
                        a.start = "width" === r || "height" === r ? 1 : 0))
        }
        ],
        prefilter: function(e, t) {
            t ? bt.prefilters.unshift(e) : bt.prefilters.push(e)
        }
    }),
        E.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? E.extend({}, e) : {
                complete: n || !n && t || E.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !E.isFunction(t) && t
            };
            return r.duration = E.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in E.fx.speeds ? E.fx.speeds[r.duration] : E.fx.speeds._default,
            null != r.queue && !0 !== r.queue || (r.queue = "fx"),
                r.old = r.complete,
                r.complete = function() {
                    E.isFunction(r.old) && r.old.call(this),
                    r.queue && E.dequeue(this, r.queue)
                }
                ,
                r
        }
        ,
        E.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(X).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r)
            },
            animate: function(t, e, n, r) {
                var i = E.isEmptyObject(t)
                    , o = E.speed(e, n, r)
                    , a = function() {
                    var e = bt(this, E.extend({}, t), o);
                    (i || E._data(this, "finish")) && e.stop(!0)
                };
                return a.finish = a,
                    i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
            },
            stop: function(i, e, o) {
                var a = function(e) {
                    var t = e.stop;
                    delete e.stop,
                        t(o)
                };
                return "string" != typeof i && (o = e,
                    e = i,
                    i = void 0),
                e && !1 !== i && this.queue(i || "fx", []),
                    this.each(function() {
                        var e = !0
                            , t = null != i && i + "queueHooks"
                            , n = E.timers
                            , r = E._data(this);
                        if (t)
                            r[t] && r[t].stop && a(r[t]);
                        else
                            for (t in r)
                                r[t] && r[t].stop && mt.test(t) && a(r[t]);
                        for (t = n.length; t--; )
                            n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                                e = !1,
                                n.splice(t, 1));
                        !e && o || E.dequeue(this, i)
                    })
            },
            finish: function(a) {
                return !1 !== a && (a = a || "fx"),
                    this.each(function() {
                        var e, t = E._data(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = E.timers, o = n ? n.length : 0;
                        for (t.finish = !0,
                                 E.queue(this, a, []),
                             r && r.stop && r.stop.call(this, !0),
                                 e = i.length; e--; )
                            i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                                i.splice(e, 1));
                        for (e = 0; e < o; e++)
                            n[e] && n[e].finish && n[e].finish.call(this);
                        delete t.finish
                    })
            }
        }),
        E.each(["toggle", "show", "hide"], function(e, r) {
            var i = E.fn[r];
            E.fn[r] = function(e, t, n) {
                return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(yt(r, !0), e, t, n)
            }
        }),
        E.each({
            slideDown: yt("show"),
            slideUp: yt("hide"),
            slideToggle: yt("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, r) {
            E.fn[e] = function(e, t, n) {
                return this.animate(r, e, t, n)
            }
        }),
        E.timers = [],
        E.fx.tick = function() {
            var e, t = E.timers, n = 0;
            for (lt = E.now(); n < t.length; n++)
                (e = t[n])() || t[n] !== e || t.splice(n--, 1);
            t.length || E.fx.stop(),
                lt = void 0
        }
        ,
        E.fx.timer = function(e) {
            E.timers.push(e),
                e() ? E.fx.start() : E.timers.pop()
        }
        ,
        E.fx.interval = 13,
        E.fx.start = function() {
            ut || (ut = T.setInterval(E.fx.tick, E.fx.interval))
        }
        ,
        E.fx.stop = function() {
            T.clearInterval(ut),
                ut = null
        }
        ,
        E.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        E.fn.delay = function(r, e) {
            return r = E.fx && E.fx.speeds[r] || r,
                e = e || "fx",
                this.queue(e, function(e, t) {
                    var n = T.setTimeout(e, r);
                    t.stop = function() {
                        T.clearTimeout(n)
                    }
                })
        }
        ,
        dt = h.createElement("input"),
        ft = h.createElement("div"),
        pt = h.createElement("select"),
        ht = pt.appendChild(h.createElement("option")),
        (ft = h.createElement("div")).setAttribute("className", "t"),
        ft.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        ct = ft.getElementsByTagName("a")[0],
        dt.setAttribute("type", "checkbox"),
        ft.appendChild(dt),
        (ct = ft.getElementsByTagName("a")[0]).style.cssText = "top:1px",
        S.getSetAttribute = "t" !== ft.className,
        S.style = /top/.test(ct.getAttribute("style")),
        S.hrefNormalized = "/a" === ct.getAttribute("href"),
        S.checkOn = !!dt.value,
        S.optSelected = ht.selected,
        S.enctype = !!h.createElement("form").enctype,
        pt.disabled = !0,
        S.optDisabled = !ht.disabled,
        (dt = h.createElement("input")).setAttribute("value", ""),
        S.input = "" === dt.getAttribute("value"),
        dt.value = "t",
        dt.setAttribute("type", "radio"),
        S.radioValue = "t" === dt.value;
    var _t = /\r/g
        , xt = /[\x20\t\r\n\f]+/g;
    E.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = E.isFunction(n),
                this.each(function(e) {
                    var t;
                    1 === this.nodeType && (null == (t = i ? n.call(this, e, E(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : E.isArray(t) && (t = E.map(t, function(e) {
                        return null == e ? "" : e + ""
                    })),
                    (r = E.valHooks[this.type] || E.valHooks[this.nodeName.toLowerCase()]) && "set"in r && void 0 !== r.set(this, t, "value") || (this.value = t))
                })) : t ? (r = E.valHooks[t.type] || E.valHooks[t.nodeName.toLowerCase()]) && "get"in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(_t, "") : null == e ? "" : e : void 0
        }
    }),
        E.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = E.find.attr(e, "value");
                        return null != t ? t : E.trim(E.text(e)).replace(xt, " ")
                    }
                },
                select: {
                    get: function(e) {
                        for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || i < 0, a = o ? null : [], s = o ? i + 1 : r.length, l = i < 0 ? s : o ? i : 0; l < s; l++)
                            if (((n = r[l]).selected || l === i) && (S.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !E.nodeName(n.parentNode, "optgroup"))) {
                                if (t = E(n).val(),
                                    o)
                                    return t;
                                a.push(t)
                            }
                        return a
                    },
                    set: function(e, t) {
                        for (var n, r, i = e.options, o = E.makeArray(t), a = i.length; a--; )
                            if (r = i[a],
                            -1 < E.inArray(E.valHooks.option.get(r), o))
                                try {
                                    r.selected = n = !0
                                } catch (l) {
                                    r.scrollHeight
                                }
                            else
                                r.selected = !1;
                        return n || (e.selectedIndex = -1),
                            i
                    }
                }
            }
        }),
        E.each(["radio", "checkbox"], function() {
            E.valHooks[this] = {
                set: function(e, t) {
                    return E.isArray(t) ? e.checked = -1 < E.inArray(E(e).val(), t) : void 0
                }
            },
            S.checkOn || (E.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
            )
        });
    var Ct, kt, Tt = E.expr.attrHandle, St = /^(?:checked|selected)$/i, Et = S.getSetAttribute, At = S.input;
    E.fn.extend({
        attr: function(e, t) {
            return Q(this, E.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                E.removeAttr(this, e)
            })
        }
    }),
        E.extend({
            attr: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o)
                    return "undefined" == typeof e.getAttribute ? E.prop(e, t, n) : (1 === o && E.isXMLDoc(e) || (t = t.toLowerCase(),
                        i = E.attrHooks[t] || (E.expr.match.bool.test(t) ? kt : Ct)),
                        void 0 !== n ? null === n ? void E.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                            n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = E.find.attr(e, t)) ? void 0 : r)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!S.radioValue && "radio" === t && E.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t),
                            n && (e.value = n),
                                t
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var n, r, i = 0, o = t && t.match(D);
                if (o && 1 === e.nodeType)
                    for (; n = o[i++]; )
                        r = E.propFix[n] || n,
                            E.expr.match.bool.test(n) ? At && Et || !St.test(n) ? e[r] = !1 : e[E.camelCase("default-" + n)] = e[r] = !1 : E.attr(e, n, ""),
                            e.removeAttribute(Et ? n : r)
            }
        }),
        kt = {
            set: function(e, t, n) {
                return !1 === t ? E.removeAttr(e, n) : At && Et || !St.test(n) ? e.setAttribute(!Et && E.propFix[n] || n, n) : e[E.camelCase("default-" + n)] = e[n] = !0,
                    n
            }
        },
        E.each(E.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var o = Tt[t] || E.find.attr;
            At && Et || !St.test(t) ? Tt[t] = function(e, t, n) {
                    var r, i;
                    return n || (i = Tt[t],
                        Tt[t] = r,
                        r = null != o(e, t, n) ? t.toLowerCase() : null,
                        Tt[t] = i),
                        r
                }
                : Tt[t] = function(e, t, n) {
                    return n ? void 0 : e[E.camelCase("default-" + t)] ? t.toLowerCase() : null
                }
        }),
    At && Et || (E.attrHooks.value = {
        set: function(e, t, n) {
            return E.nodeName(e, "input") ? void (e.defaultValue = t) : Ct && Ct.set(e, t, n)
        }
    }),
    Et || (Ct = {
        set: function(e, t, n) {
            var r = e.getAttributeNode(n);
            return r || e.setAttributeNode(r = e.ownerDocument.createAttribute(n)),
                r.value = t += "",
                "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    },
        Tt.id = Tt.name = Tt.coords = function(e, t, n) {
            var r;
            return n ? void 0 : (r = e.getAttributeNode(t)) && "" !== r.value ? r.value : null
        }
        ,
        E.valHooks.button = {
            get: function(e, t) {
                var n = e.getAttributeNode(t);
                return n && n.specified ? n.value : void 0
            },
            set: Ct.set
        },
        E.attrHooks.contenteditable = {
            set: function(e, t, n) {
                Ct.set(e, "" !== t && t, n)
            }
        },
        E.each(["width", "height"], function(e, n) {
            E.attrHooks[n] = {
                set: function(e, t) {
                    return "" === t ? (e.setAttribute(n, "auto"),
                        t) : void 0
                }
            }
        })),
    S.style || (E.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Lt = /^(?:input|select|textarea|button|object)$/i
        , It = /^(?:a|area)$/i;
    E.fn.extend({
        prop: function(e, t) {
            return Q(this, E.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return e = E.propFix[e] || e,
                this.each(function() {
                    try {
                        this[e] = void 0,
                            delete this[e]
                    } catch (t) {}
                })
        }
    }),
        E.extend({
            prop: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o)
                    return 1 === o && E.isXMLDoc(e) || (t = E.propFix[t] || t,
                        i = E.propHooks[t]),
                        void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = E.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : Lt.test(e.nodeName) || It.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            },
            propFix: {
                "for": "htmlFor",
                "class": "className"
            }
        }),
    S.hrefNormalized || E.each(["href", "src"], function(e, t) {
        E.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }),
    S.optSelected || (E.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex),
                null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
        E.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            E.propFix[this.toLowerCase()] = this
        }),
    S.enctype || (E.propFix.enctype = "encoding");
    var $t = /[\t\r\n\f]/g;
    function jt(e) {
        return E.attr(e, "class") || ""
    }
    E.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s, l = 0;
            if (E.isFunction(t))
                return this.each(function(e) {
                    E(this).addClass(t.call(this, e, jt(this)))
                });
            if ("string" == typeof t && t)
                for (e = t.match(D) || []; n = this[l++]; )
                    if (i = jt(n),
                        r = 1 === n.nodeType && (" " + i + " ").replace($t, " ")) {
                        for (a = 0; o = e[a++]; )
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = E.trim(r)) && E.attr(n, "class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s, l = 0;
            if (E.isFunction(t))
                return this.each(function(e) {
                    E(this).removeClass(t.call(this, e, jt(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof t && t)
                for (e = t.match(D) || []; n = this[l++]; )
                    if (i = jt(n),
                        r = 1 === n.nodeType && (" " + i + " ").replace($t, " ")) {
                        for (a = 0; o = e[a++]; )
                            for (; -1 < r.indexOf(" " + o + " "); )
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = E.trim(r)) && E.attr(n, "class", s)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i;
            return "boolean" == typeof t && "string" === o ? t ? this.addClass(i) : this.removeClass(i) : E.isFunction(i) ? this.each(function(e) {
                E(this).toggleClass(i.call(this, e, jt(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if ("string" === o)
                    for (t = 0,
                             n = E(this),
                             r = i.match(D) || []; e = r[t++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    void 0 !== i && "boolean" !== o || ((e = jt(this)) && E._data(this, "__className__", e),
                        E.attr(this, "class", e || !1 === i ? "" : E._data(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++]; )
                if (1 === n.nodeType && -1 < (" " + jt(n) + " ").replace($t, " ").indexOf(t))
                    return !0;
            return !1
        }
    }),
        E.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, n) {
            E.fn[n] = function(e, t) {
                return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
            }
        }),
        E.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        });
    var Dt = T.location
        , Nt = E.now()
        , Mt = /\?/
        , Ot = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    E.parseJSON = function(e) {
        if (T.JSON && T.JSON.parse)
            return T.JSON.parse(e + "");
        var i, o = null, t = E.trim(e + "");
        return t && !E.trim(t.replace(Ot, function(e, t, n, r) {
            return i && t && (o = 0),
                0 === o ? e : (i = n || t,
                    o += !r - !n,
                    "")
        })) ? Function("return " + t)() : E.error("Invalid JSON: " + e)
    }
        ,
        E.parseXML = function(e) {
            var t;
            if (!e || "string" != typeof e)
                return null;
            try {
                T.DOMParser ? t = (new T.DOMParser).parseFromString(e, "text/xml") : ((t = new T.ActiveXObject("Microsoft.XMLDOM")).async = "false",
                    t.loadXML(e))
            } catch (c) {
                t = void 0
            }
            return t && t.documentElement && !t.getElementsByTagName("parsererror").length || E.error("Invalid XML: " + e),
                t
        }
    ;
    var Pt = /#.*$/
        , Rt = /([?&])_=[^&]*/
        , Bt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm
        , Ft = /^(?:GET|HEAD)$/
        , Ht = /^\/\//
        , Ut = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
        , qt = {}
        , Wt = {}
        , zt = "*/".concat("*")
        , Vt = Dt.href
        , Xt = Ut.exec(Vt.toLowerCase()) || [];
    function Gt(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
                e = "*");
            var n, r = 0, i = e.toLowerCase().match(D) || [];
            if (E.isFunction(t))
                for (; n = i[r++]; )
                    "+" === n.charAt(0) ? (n = n.slice(1) || "*",
                        (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function Jt(t, i, o, a) {
        var s = {}
            , l = t === Wt;
        function u(e) {
            var r;
            return s[e] = !0,
                E.each(t[e] || [], function(e, t) {
                    var n = t(i, o, a);
                    return "string" != typeof n || l || s[n] ? l ? !(r = n) : void 0 : (i.dataTypes.unshift(n),
                        u(n),
                        !1)
                }),
                r
        }
        return u(i.dataTypes[0]) || !s["*"] && u("*")
    }
    function Kt(e, t) {
        var n, r, i = E.ajaxSettings.flatOptions || {};
        for (r in t)
            void 0 !== t[r] && ((i[r] ? e : n || (n = {}))[r] = t[r]);
        return n && E.extend(!0, e, n),
            e
    }
    E.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Vt,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Xt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": zt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": E.parseJSON,
                "text xml": E.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Kt(Kt(e, E.ajaxSettings), t) : Kt(E.ajaxSettings, e)
        },
        ajaxPrefilter: Gt(qt),
        ajaxTransport: Gt(Wt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e,
                e = void 0),
                t = t || {};
            var n, r, f, p, h, g, m, i, v = E.ajaxSetup({}, t), y = v.context || v, w = v.context && (y.nodeType || y.jquery) ? E(y) : E.event, b = E.Deferred(), _ = E.Callbacks("once memory"), x = v.statusCode || {}, o = {}, a = {}, C = 0, s = "canceled", k = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (2 === C) {
                        if (!i)
                            for (i = {}; t = Bt.exec(p); )
                                i[t[1].toLowerCase()] = t[2];
                        t = i[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return 2 === C ? p : null
                },
                setRequestHeader: function(e, t) {
                    var n = e.toLowerCase();
                    return C || (e = a[n] = a[n] || e,
                        o[e] = t),
                        this
                },
                overrideMimeType: function(e) {
                    return C || (v.mimeType = e),
                        this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (C < 2)
                            for (t in e)
                                x[t] = [x[t], e[t]];
                        else
                            k.always(e[k.status]);
                    return this
                },
                abort: function(e) {
                    var t = e || s;
                    return m && m.abort(t),
                        l(0, t),
                        this
                }
            };
            if (b.promise(k).complete = _.add,
                k.success = k.done,
                k.error = k.fail,
                v.url = ((e || v.url || Vt) + "").replace(Pt, "").replace(Ht, Xt[1] + "//"),
                v.type = t.method || t.type || v.method || v.type,
                v.dataTypes = E.trim(v.dataType || "*").toLowerCase().match(D) || [""],
            null == v.crossDomain && (n = Ut.exec(v.url.toLowerCase()),
                v.crossDomain = !(!n || n[1] === Xt[1] && n[2] === Xt[2] && (n[3] || ("http:" === n[1] ? "80" : "443")) === (Xt[3] || ("http:" === Xt[1] ? "80" : "443")))),
            v.data && v.processData && "string" != typeof v.data && (v.data = E.param(v.data, v.traditional)),
                Jt(qt, v, t, k),
            2 === C)
                return k;
            for (r in (g = E.event && v.global) && 0 == E.active++ && E.event.trigger("ajaxStart"),
                v.type = v.type.toUpperCase(),
                v.hasContent = !Ft.test(v.type),
                f = v.url,
            v.hasContent || (v.data && (f = v.url += (Mt.test(f) ? "&" : "?") + v.data,
                delete v.data),
            !1 === v.cache && (v.url = Rt.test(f) ? f.replace(Rt, "$1_=" + Nt++) : f + (Mt.test(f) ? "&" : "?") + "_=" + Nt++)),
            v.ifModified && (E.lastModified[f] && k.setRequestHeader("If-Modified-Since", E.lastModified[f]),
            E.etag[f] && k.setRequestHeader("If-None-Match", E.etag[f])),
            (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && k.setRequestHeader("Content-Type", v.contentType),
                k.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + zt + "; q=0.01" : "") : v.accepts["*"]),
                v.headers)
                k.setRequestHeader(r, v.headers[r]);
            if (v.beforeSend && (!1 === v.beforeSend.call(y, k, v) || 2 === C))
                return k.abort();
            for (r in s = "abort",
                {
                    success: 1,
                    error: 1,
                    complete: 1
                })
                k[r](v[r]);
            if (m = Jt(Wt, v, t, k)) {
                if (k.readyState = 1,
                g && w.trigger("ajaxSend", [k, v]),
                2 === C)
                    return k;
                v.async && 0 < v.timeout && (h = T.setTimeout(function() {
                    k.abort("timeout")
                }, v.timeout));
                try {
                    C = 1,
                        m.send(o, l)
                } catch (A) {
                    if (!(C < 2))
                        throw A;
                    l(-1, A)
                }
            } else
                l(-1, "No Transport");
            function l(e, t, n, r) {
                var i, o, a, s, l, u = t;
                2 !== C && (C = 2,
                h && T.clearTimeout(h),
                    m = void 0,
                    p = r || "",
                    k.readyState = 0 < e ? 4 : 0,
                    i = 200 <= e && e < 300 || 304 === e,
                n && (s = function c(e, t, n) {
                    for (var r, i, o, a, s = e.contents, l = e.dataTypes; "*" === l[0]; )
                        l.shift(),
                        void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (i)
                        for (a in s)
                            if (s[a] && s[a].test(i)) {
                                l.unshift(a);
                                break
                            }
                    if (l[0]in n)
                        o = l[0];
                    else {
                        for (a in n) {
                            if (!l[0] || e.converters[a + " " + l[0]]) {
                                o = a;
                                break
                            }
                            r || (r = a)
                        }
                        o = o || r
                    }
                    return o ? (o !== l[0] && l.unshift(o),
                        n[o]) : void 0
                }(v, k, n)),
                    s = function d(e, t, n, r) {
                        var i, o, a, s, l, u = {}, c = e.dataTypes.slice();
                        if (c[1])
                            for (a in e.converters)
                                u[a.toLowerCase()] = e.converters[a];
                        for (o = c.shift(); o; )
                            if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                            !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                                l = o,
                                o = c.shift())
                                if ("*" === o)
                                    o = l;
                                else if ("*" !== l && l !== o) {
                                    if (!(a = u[l + " " + o] || u["* " + o]))
                                        for (i in u)
                                            if ((s = i.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                                !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0],
                                                    c.unshift(s[1]));
                                                break
                                            }
                                    if (!0 !== a)
                                        if (a && e["throws"])
                                            t = a(t);
                                        else
                                            try {
                                                t = a(t)
                                            } catch (S) {
                                                return {
                                                    state: "parsererror",
                                                    error: a ? S : "No conversion from " + l + " to " + o
                                                }
                                            }
                                }
                        return {
                            state: "success",
                            data: t
                        }
                    }(v, s, k, i),
                    i ? (v.ifModified && ((l = k.getResponseHeader("Last-Modified")) && (E.lastModified[f] = l),
                    (l = k.getResponseHeader("etag")) && (E.etag[f] = l)),
                        204 === e || "HEAD" === v.type ? u = "nocontent" : 304 === e ? u = "notmodified" : (u = s.state,
                            o = s.data,
                            i = !(a = s.error))) : (a = u,
                    !e && u || (u = "error",
                    e < 0 && (e = 0))),
                    k.status = e,
                    k.statusText = (t || u) + "",
                    i ? b.resolveWith(y, [o, u, k]) : b.rejectWith(y, [k, u, a]),
                    k.statusCode(x),
                    x = void 0,
                g && w.trigger(i ? "ajaxSuccess" : "ajaxError", [k, v, i ? o : a]),
                    _.fireWith(y, [k, u]),
                g && (w.trigger("ajaxComplete", [k, v]),
                --E.active || E.event.trigger("ajaxStop")))
            }
            return k
        },
        getJSON: function(e, t, n) {
            return E.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return E.get(e, void 0, t, "script")
        }
    }),
        E.each(["get", "post"], function(e, i) {
            E[i] = function(e, t, n, r) {
                return E.isFunction(t) && (r = r || n,
                    n = t,
                    t = void 0),
                    E.ajax(E.extend({
                        url: e,
                        type: i,
                        dataType: r,
                        data: t,
                        success: n
                    }, E.isPlainObject(e) && e))
            }
        }),
        E._evalUrl = function(e) {
            return E.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                "throws": !0
            })
        }
        ,
        E.fn.extend({
            wrapAll: function(t) {
                if (E.isFunction(t))
                    return this.each(function(e) {
                        E(this).wrapAll(t.call(this, e))
                    });
                if (this[0]) {
                    var e = E(t, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && e.insertBefore(this[0]),
                        e.map(function() {
                            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; )
                                e = e.firstChild;
                            return e
                        }).append(this)
                }
                return this
            },
            wrapInner: function(n) {
                return E.isFunction(n) ? this.each(function(e) {
                    E(this).wrapInner(n.call(this, e))
                }) : this.each(function() {
                    var e = E(this)
                        , t = e.contents();
                    t.length ? t.wrapAll(n) : e.append(n)
                })
            },
            wrap: function(t) {
                var n = E.isFunction(t);
                return this.each(function(e) {
                    E(this).wrapAll(n ? t.call(this, e) : t)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    E.nodeName(this, "body") || E(this).replaceWith(this.childNodes)
                }).end()
            }
        }),
        E.expr.filters.hidden = function(e) {
            return S.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : function n(e) {
                if (!E.contains(e.ownerDocument || h, e))
                    return !0;
                for (; e && 1 === e.nodeType; ) {
                    if ("none" === ((t = e).style && t.style.display || E.css(t, "display")) || "hidden" === e.type)
                        return !0;
                    e = e.parentNode
                }
                var t;
                return !1
            }(e)
        }
        ,
        E.expr.filters.visible = function(e) {
            return !E.expr.filters.hidden(e)
        }
    ;
    var Zt = /%20/g
        , Qt = /\[\]$/
        , Yt = /\r?\n/g
        , en = /^(?:submit|button|image|reset|file)$/i
        , tn = /^(?:input|select|textarea|keygen)/i;
    function nn(n, e, r, i) {
        var t;
        if (E.isArray(e))
            E.each(e, function(e, t) {
                r || Qt.test(n) ? i(n, t) : nn(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== E.type(e))
            i(n, e);
        else
            for (t in e)
                nn(n + "[" + t + "]", e[t], r, i)
    }
    E.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            t = E.isFunction(t) ? t() : null == t ? "" : t,
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = E.ajaxSettings && E.ajaxSettings.traditional),
        E.isArray(e) || e.jquery && !E.isPlainObject(e))
            E.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                nn(n, e[n], t, i);
        return r.join("&").replace(Zt, "+")
    }
        ,
        E.fn.extend({
            serialize: function() {
                return E.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = E.prop(this, "elements");
                    return e ? E.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !E(this).is(":disabled") && tn.test(this.nodeName) && !en.test(e) && (this.checked || !Y.test(e))
                }).map(function(e, t) {
                    var n = E(this).val();
                    return null == n ? null : E.isArray(n) ? E.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(Yt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(Yt, "\r\n")
                    }
                }).get()
            }
        }),
        E.ajaxSettings.xhr = void 0 !== T.ActiveXObject ? function() {
                return this.isLocal ? ln() : 8 < h.documentMode ? sn() : /^(get|post|head|put|delete|options)$/i.test(this.type) && sn() || ln()
            }
            : sn;
    var rn = 0
        , on = {}
        , an = E.ajaxSettings.xhr();
    function sn() {
        try {
            return new T.XMLHttpRequest
        } catch (t) {}
    }
    function ln() {
        try {
            return new T.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }
    T.attachEvent && T.attachEvent("onunload", function() {
        for (var e in on)
            on[e](void 0, !0)
    }),
        S.cors = !!an && "withCredentials"in an,
    (an = S.ajax = !!an) && E.ajaxTransport(function(l) {
        var u;
        if (!l.crossDomain || S.cors)
            return {
                send: function(e, o) {
                    var t, a = l.xhr(), s = ++rn;
                    if (a.open(l.type, l.url, l.async, l.username, l.password),
                        l.xhrFields)
                        for (t in l.xhrFields)
                            a[t] = l.xhrFields[t];
                    for (t in l.mimeType && a.overrideMimeType && a.overrideMimeType(l.mimeType),
                    l.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                        e)
                        void 0 !== e[t] && a.setRequestHeader(t, e[t] + "");
                    a.send(l.hasContent && l.data || null),
                        u = function(e, t) {
                            var n, r, i;
                            if (u && (t || 4 === a.readyState))
                                if (delete on[s],
                                    u = void 0,
                                    a.onreadystatechange = E.noop,
                                    t)
                                    4 !== a.readyState && a.abort();
                                else {
                                    i = {},
                                        n = a.status,
                                    "string" == typeof a.responseText && (i.text = a.responseText);
                                    try {
                                        r = a.statusText
                                    } catch (m) {
                                        r = ""
                                    }
                                    n || !l.isLocal || l.crossDomain ? 1223 === n && (n = 204) : n = i.text ? 200 : 404
                                }
                            i && o(n, r, i, a.getAllResponseHeaders())
                        }
                        ,
                        l.async ? 4 === a.readyState ? T.setTimeout(u) : a.onreadystatechange = on[s] = u : u()
                },
                abort: function() {
                    u && u(void 0, !0)
                }
            }
    }),
        E.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return E.globalEval(e),
                        e
                }
            }
        }),
        E.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1),
            e.crossDomain && (e.type = "GET",
                e.global = !1)
        }),
        E.ajaxTransport("script", function(t) {
            if (t.crossDomain) {
                var r, i = h.head || E("head")[0] || h.documentElement;
                return {
                    send: function(e, n) {
                        (r = h.createElement("script")).async = !0,
                        t.scriptCharset && (r.charset = t.scriptCharset),
                            r.src = t.url,
                            r.onload = r.onreadystatechange = function(e, t) {
                                (t || !r.readyState || /loaded|complete/.test(r.readyState)) && (r.onload = r.onreadystatechange = null,
                                r.parentNode && r.parentNode.removeChild(r),
                                    r = null,
                                t || n(200, "success"))
                            }
                            ,
                            i.insertBefore(r, i.firstChild)
                    },
                    abort: function() {
                        r && r.onload(void 0, !0)
                    }
                }
            }
        });
    var un = []
        , cn = /(=)\?(?=&|$)|\?\?/;
    E.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = un.pop() || E.expando + "_" + Nt++;
            return this[e] = !0,
                e
        }
    }),
        E.ajaxPrefilter("json jsonp", function(e, t, n) {
            var r, i, o, a = !1 !== e.jsonp && (cn.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && cn.test(e.data) && "data");
            return a || "jsonp" === e.dataTypes[0] ? (r = e.jsonpCallback = E.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
                a ? e[a] = e[a].replace(cn, "$1" + r) : !1 !== e.jsonp && (e.url += (Mt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
                e.converters["script json"] = function() {
                    return o || E.error(r + " was not called"),
                        o[0]
                }
                ,
                e.dataTypes[0] = "json",
                i = T[r],
                T[r] = function() {
                    o = arguments
                }
                ,
                n.always(function() {
                    void 0 === i ? E(T).removeProp(r) : T[r] = i,
                    e[r] && (e.jsonpCallback = t.jsonpCallback,
                        un.push(r)),
                    o && E.isFunction(i) && i(o[0]),
                        o = i = void 0
                }),
                "script") : void 0
        }),
        E.parseHTML = function(e, t, n) {
            if (!e || "string" != typeof e)
                return null;
            "boolean" == typeof t && (n = t,
                t = !1),
                t = t || h;
            var r = A.exec(e)
                , i = !n && [];
            return r ? [t.createElement(r[1])] : (r = ce([e], t, i),
            i && i.length && E(i).remove(),
                E.merge([], r.childNodes))
        }
    ;
    var dn = E.fn.load;
    function fn(e) {
        return E.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    E.fn.load = function(e, t, n) {
        if ("string" != typeof e && dn)
            return dn.apply(this, arguments);
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = E.trim(e.slice(s, e.length)),
            e = e.slice(0, s)),
            E.isFunction(t) ? (n = t,
                t = void 0) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && E.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
                a.html(r ? E("<div>").append(E.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
            this
    }
        ,
        E.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            E.fn[t] = function(e) {
                return this.on(t, e)
            }
        }),
        E.expr.filters.animated = function(t) {
            return E.grep(E.timers, function(e) {
                return t === e.elem
            }).length
        }
        ,
        E.offset = {
            setOffset: function(e, t, n) {
                var r, i, o, a, s, l, u = E.css(e, "position"), c = E(e), d = {};
                "static" === u && (e.style.position = "relative"),
                    s = c.offset(),
                    o = E.css(e, "top"),
                    l = E.css(e, "left"),
                    i = ("absolute" === u || "fixed" === u) && -1 < E.inArray("auto", [o, l]) ? (a = (r = c.position()).top,
                        r.left) : (a = parseFloat(o) || 0,
                    parseFloat(l) || 0),
                E.isFunction(t) && (t = t.call(e, n, E.extend({}, s))),
                null != t.top && (d.top = t.top - s.top + a),
                null != t.left && (d.left = t.left - s.left + i),
                    "using"in t ? t.using.call(e, d) : c.css(d)
            }
        },
        E.fn.extend({
            offset: function(t) {
                if (arguments.length)
                    return void 0 === t ? this : this.each(function(e) {
                        E.offset.setOffset(this, t, e)
                    });
                var e, n, r = {
                    top: 0,
                    left: 0
                }, i = this[0], o = i && i.ownerDocument;
                return o ? (e = o.documentElement,
                    E.contains(e, i) ? ("undefined" != typeof i.getBoundingClientRect && (r = i.getBoundingClientRect()),
                        n = fn(o),
                        {
                            top: r.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                            left: r.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
                        }) : r) : void 0
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = {
                        top: 0,
                        left: 0
                    }, r = this[0];
                    return "fixed" === E.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(),
                        t = this.offset(),
                    E.nodeName(e[0], "html") || (n = e.offset()),
                        n.top += E.css(e[0], "borderTopWidth", !0),
                        n.left += E.css(e[0], "borderLeftWidth", !0)),
                        {
                            top: t.top - n.top - E.css(r, "marginTop", !0),
                            left: t.left - n.left - E.css(r, "marginLeft", !0)
                        }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent; e && !E.nodeName(e, "html") && "static" === E.css(e, "position"); )
                        e = e.offsetParent;
                    return e || qe
                })
            }
        }),
        E.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, i) {
            var o = /Y/.test(i);
            E.fn[t] = function(e) {
                return Q(this, function(e, t, n) {
                    var r = fn(e);
                    return void 0 === n ? r ? i in r ? r[i] : r.document.documentElement[t] : e[t] : void (r ? r.scrollTo(o ? E(r).scrollLeft() : n, o ? n : E(r).scrollTop()) : e[t] = n)
                }, t, e, arguments.length, null)
            }
        }),
        E.each(["top", "left"], function(e, n) {
            E.cssHooks[n] = Xe(S.pixelPosition, function(e, t) {
                return t ? (t = ze(e, n),
                    He.test(t) ? E(e).position()[n] + "px" : t) : void 0
            })
        }),
        E.each({
            Height: "height",
            Width: "width"
        }, function(o, a) {
            E.each({
                padding: "inner" + o,
                content: a,
                "": "outer" + o
            }, function(r, e) {
                E.fn[e] = function(e, t) {
                    var n = arguments.length && (r || "boolean" != typeof e)
                        , i = r || (!0 === e || !0 === t ? "margin" : "border");
                    return Q(this, function(e, t, n) {
                        var r;
                        return E.isWindow(e) ? e.document.documentElement["client" + o] : 9 === e.nodeType ? (r = e.documentElement,
                            Math.max(e.body["scroll" + o], r["scroll" + o], e.body["offset" + o], r["offset" + o], r["client" + o])) : void 0 === n ? E.css(e, t, i) : E.style(e, t, n, i)
                    }, a, n ? e : void 0, n, null)
                }
            })
        }),
        E.fn.extend({
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        }),
        E.fn.size = function() {
            return this.length
        }
        ,
        E.fn.andSelf = E.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return E
    });
    var pn = T.jQuery
        , hn = T.$;
    return E.noConflict = function(e) {
        return T.$ === E && (T.$ = hn),
        e && T.jQuery === E && (T.jQuery = pn),
            E
    }
        ,
    t || (T.jQuery = T.$ = E),
        E







