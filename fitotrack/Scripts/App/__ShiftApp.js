(function () {
    var a;
    a = angular.module("SHIFT.Util", []), a.factory("shiftUtil", function () {
        return {
            _urlRegex: /(?:(?:(http[s]{0,1}:\/\/)(?:(www|[\d\w\-]+)\.){0,1})|(www|[\d\w\-]+)\.)([\d\w\-]+)\.([A-Za-z]{2,6})(:[\d]*){0,1}(\/?[\d\w\-\?\,\'\/\\\+&amp;%\$#!\=~\.]*){0,1}/gi,
            generateId: function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
                    var b, c;
                    return b = 0 | 16 * Math.random(), c = "x" === a ? b : 8 | 3 & b, c.toString(16)
                })
            },
            findUrl: function (a) {
                return this._urlRegex.exec(a)
            },
            parseStringToUrls: function (a) {
                var b, c, d, e, f, g;
                for (d = !0, e = []; d;) {
                    if (d = this.findUrl(a), !d) {
                        a.length > 0 && e.push({
                            text: a,
                            isLink: !1
                        });
                        break
                    }
                    b = d.index, f = d[0], c = f.length, g = b + c, b > 0 && e.push({
                        text: a.slice(0, b),
                        isLink: !1
                    }), e.push({
                        text: f,
                        isLink: !0
                    }), a = a.slice(g)
                }
                return e
            },
            parseStringToMentions: function (a) {
                var b, c, d, e, f, g, h, i;
                if (f = /\B@\{([\d\w-]+):([\d\w\s-]+)}\B/gi, g = [], null != a)
                    for (h = a; c = f.exec(a);) d = c[0], i = c[1], b = c[2], e = {
                        id: i,
                        name: b,
                        type: "user"
                    }, g.push(e), h = h.replace(d, "{" + (g.length - 1) + "}");
                return {
                    text: h,
                    mentions: g
                }
            },
            renderAtMention: function (a, b) {
                var c, d, e, f, g, h;
                if (e = /\B\{(\d+)}\B/gi, null != b && b.length > 0)
                    for (; d = e.exec(a);) h = d[0], c = +d[1], g = b[c], null != g && (f = g.name, a = a.replace(h, f));
                return a
            },
            getTeamColors: function () {
                return ["red", "orange", "creamsicle", "brown", "khaki", "golden-yellow", "greenish-yellow", "yellowish-green", "green", "jade", "bluish-green", "turquoise", "sky-blue", "blue", "dark-blue", "easter-purple", "dark-purple", "grape", "pink", "hot-pink", "light-pink", "charcoal", "slate", "gray"]
            },
            getTeamIcons: function () {
                return [{
                    id: "bug",
                    name: "Bug"
                }, {
                    id: "camera",
                    name: "Camera"
                }, {
                    id: "car",
                    name: "Car"
                }, {
                    id: "cart",
                    name: "Cart"
                }, {
                    id: "chart",
                    name: "Chart"
                }, {
                    id: "money",
                    name: "Cash Money"
                }, {
                    id: "coffee",
                    name: "Coffee"
                }, {
                    id: "computer",
                    name: "Computer"
                }, {
                    id: "creditcard",
                    name: "Credit Card"
                }, {
                    id: "dog",
                    name: "Dog"
                }, {
                    id: "drink",
                    name: "Drink"
                }, {
                    id: "fastfood",
                    name: "Fast Food"
                }, {
                    id: "female",
                    name: "Female"
                }, {
                    id: "flower",
                    name: "Flower"
                }, {
                    id: "gbot",
                    name: "Graphbot"
                }, {
                    id: "glogo",
                    name: "Graph Logo"
                }, {
                    id: "headphones",
                    name: "Headphones"
                }, {
                    id: "pen",
                    name: "Ink Pen"
                }, {
                    id: "leaf",
                    name: "Leaf"
                }, {
                    id: "mad-bird",
                    name: "Mad Bird"
                }, {
                    id: "male",
                    name: "Male"
                }, {
                    id: "mobile",
                    name: "Mobile"
                }, {
                    id: "newspaper",
                    name: "Newspaper"
                }, {
                    id: "axes",
                    name: "Pickaxes"
                }, {
                    id: "plane",
                    name: "Plane"
                }, {
                    id: "shoe",
                    name: "Shoe"
                }, {
                    id: "tweet",
                    name: "Tweet"
                }, {
                    id: "utensils",
                    name: "Utensils"
                }, {
                    id: "video",
                    name: "Video"
                }, {
                    id: "map",
                    name: "Map"
                }, {
                    id: "boat",
                    name: "Boat"
                }, {
                    id: "calculator",
                    name: "Calculator"
                }]
            }
        }
    })
}).call(this),
function () {
    angular.module("SHIFT.Controllers", ["SHIFT.Store"])
}.call(this),
function () {
    angular.module("SHIFT.Models", ["SHIFT.Store", "SHIFT.Api", "SHIFT.Context"])
}.call(this),
function () {
    angular.module("SHIFT.Directives", [])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Api", ["SHIFT.ApiCallbacks"]), a.factory("api", ["$http", "apiCallbacks", "$window",
        function (a, b) {
            var c;
            return c = {
                callApi: function (d, e, f, g) {
                    var h, i, j, k, l, m, n, o;
                    if (null == g && (g = {}), f = "/v1/" + f, h = g.disableCallback ? {} : b[d] || {}, null != h.beforeApiCall && (g = "function" == typeof h.beforeApiCall ? h.beforeApiCall(g) : void 0, -1 === g)) throw "Error in calling " + d;
                    for (l = /:([\w]+)/g; k = l.exec(f);) {
                        if (j = k[1], o = g[j], null == o) throw "Missing " + j;
                        f = f.replace(":" + j, o)
                    }
                    return null != g.overrideUrl && (f = g.overrideUrl), null != g.url && (f += g.url), null != g.query && (m = function () {
                        var a, b;
                        a = g.query, b = [];
                        for (j in a) o = a[j], b.push("" + j + "=" + o);
                        return b
                    }(), f += "?" + m.join("&")), "" !== e && (g.method = e), g.url = f, n = function (a, b, d, e) {
                        var f;
                        return f = a.data, m = {
                            data: f,
                            response: a,
                            status: b,
                            headers: d,
                            config: e,
                            options: g
                        }, "function" == typeof g.beforeSuccess && g.beforeSuccess(m), "function" == typeof g.beforeComplete && g.beforeComplete(m), "function" == typeof h.success && h.success(m, c), "function" == typeof h.complete && h.complete(m, c), "function" == typeof g.success && g.success(m), "function" == typeof g.complete ? g.complete(m) : void 0
                    }, i = function (a, b, d, e) {
                        var f;
                        return f = a.data, m = {
                            data: f,
                            response: a,
                            status: b,
                            headers: d,
                            config: e,
                            options: g
                        }, "function" == typeof g.beforeError && g.beforeError(m), "function" == typeof g.beforeComplete && g.beforeComplete(m), "function" == typeof h.error && h.error(m, c), "function" == typeof h.complete && h.complete(m, c), "function" == typeof g.error && g.error(m), "function" == typeof g.complete ? g.complete(m) : void 0
                    }, a(g).success(n).error(i)
                },
                defineRoute: function (a, b, c) {
                    return this[a] = function (d) {
                        return this.callApi(a, b, c, d)
                    }
                }
            }, c.defineRoute("acceptTeamInvite", "PUT", "teams/:teamId/pending_users/:email"), c.defineRoute("fetchAllContacts", "GET", "users/me/address_book"), c.defineRoute("addContact", "POST", "users/me/address_book"), c.defineRoute("addUserToMessage", "POST", "messages/:messageId/addressed_users"), c.defineRoute("addUserToSubTeamMessage", "POST", "messages/:messageId/user_context"), c.defineRoute("blockContact", "POST", "users/me/blocklist"), c.defineRoute("checkFacebookCredentials", "GET", "facebook/credentials"), c.defineRoute("checkGoogleCredentials", "GET", "google/credentials"), c.defineRoute("checkUsernameAvailability", "GET", "usernames/:username"), c.defineRoute("closeAppSession", "DELETE", "applications/:applicationId/session"), c.defineRoute("createFollowup", "POST", "users/me/follow_ups"), c.defineRoute("declineTeamInvite", "DELETE", "teams/:teamId/pending_users/:email"), c.defineRoute("deleteFollowup", "DELETE", "users/me/follow_ups"), c.defineRoute("exchangeFacebookToken", "POST", "facebook/callback"), c.defineRoute("exchangeGoogleToken", "POST", "google/auth/callback"), c.defineRoute("fetchActivityEvents", "GET", "users/me/activity"), c.defineRoute("fetchAllApplications", "GET", "users/me/applications"), c.defineRoute("fetchAllConnections", "GET", "users/me/connections"), c.defineRoute("fetchAllFollowups", "GET", "users/me/follow_ups"), c.defineRoute("fetchAllHighFivers", "GET", "messages/:messageId"), c.defineRoute("fetchAllNotifications", "GET", "notifications"), c.defineRoute("fetchAllTeams", "GET", "users/me/teams"), c.defineRoute("fetchApplicationLog", "GET", "applications/:applicationId/callback_errors"), c.defineRoute("fetchBatchUsers", "GET", "users?ids=:ids"), c.defineRoute("fetchConfig", "GET", "users/me/config"), c.defineRoute("fetchMoreMessages", "GET", ""), c.defineRoute("fetchMutualTeams", "GET", "users/me/teams"), c.defineRoute("fetchPendingTeamMemberships", "GET", "teams/:teamId/pending_users"), c.defineRoute("fetchTeamMemberships", "GET", "teams/:teamId/users"), c.defineRoute("getGoogleContacts", "GET", "google/contacts"), c.defineRoute("getLinkInformation", "GET", "helpers/link-info"), c.defineRoute("googleAuth", "GET", "google/auth/redirect"), c.defineRoute("ignoreNotifications", "PUT", "notifications"), c.defineRoute("installApp", "POST", "teams/:teamId/applications"), c.defineRoute("inviteTeamMembership", "POST", "teams/:teamId/pending_users"), c.defineRoute("markAllMessagesAsRead", "PUT", ""), c.defineRoute("markChatAsRead", "PUT", "chats/:chatId"), c.defineRoute("markMessages", "PUT", "messages"), c.defineRoute("muteUnmuteMessage", "PUT", "messages"), c.defineRoute("muteUnmuteTeam", "PUT", "users/me/teams/:teamId"), c.defineRoute("leaveTeam", "DELETE", "teams/:teamId/users/:userId"), c.defineRoute("queryConnections", "GET", "users/me/connections"), c.defineRoute("removeContact", "DELETE", "users/me/address_book/:email"), c.defineRoute("removeDeveloperFromApplication", "DELETE", "applications/:applicationId/developers/:userId"), c.defineRoute("setHighFive", "", "messages"), c.defineRoute("toggleTeamFavorite", "PUT", "users/me/teams/:teamId"), c.defineRoute("unblockContact", "DELETE", "users/me/blocklist/:userId"), c.defineRoute("uninstallApp", "DELETE", "teams/:teamId/applications/:applicationId"), c.defineRoute("updateTeamMembership", "PUT", "teams"), c
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Analytics", ["SHIFT.Util"]), a.run(["$location", "$rootScope", "$timeout",
        function (a, b, c) {
            var d;
            return $(document).on("click", function (a) {
                var b, c, e, f, g, h, i;
                if ($(a.target).hasClass("ga") && "undefined" != typeof ga && null !== ga) {
                    for (f = $(a.target), c = f.attr("class"), b = c.split(" "), i = [], g = 0, h = b.length; h > g; g++) e = b[g], 0 === e.indexOf("ga-") && i.push(d(e));
                    return i
                }
            }), d = function (a) {
                var b, c, d, e;
                return e = a.split("-"), 4 === e.length ? (b = e[1], c = e[2], d = e[3], ga("send", "event", c, b, d)) : void 0
            }, b.$on("$locationChangeSuccess", function () {
                return null != window.ga ? c(function () {
                    var b, c;
                    return c = document.title, b = a.path(), ga("send", "pageview", {
                        title: c,
                        page: b
                    })
                }, 0) : void 0
            })
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        }, c = [].slice;
    a = angular.module("SHIFT.Popover", []).provider("popoverViews", function () {
        return this.registered = {}, this.$get = function () {
            return this.registered
        }, this
    }).service("popover", ["$rootScope", "$timeout", "$templateCache", "$http", "$compile", "$controller", "popoverViews",
        function (a, b, c, d, e, f, g) {
            var h;
            return h = {
                template: '<div class="popover"><div class="tip"></div><div class="header"><div class="title"></div></div><div class="popover-content-wrapper"></div></div>',
                popoverList: [],
                registered: g,
                last: function () {
                    return this.popoverList[this.popoverList.length - 1]
                },
                register: function (a, b) {
                    var c;
                    return (c = null != this.registered[a]) || (this.registered[a] = {
                        element: b
                    }), !c
                },
                unregister: function (a) {
                    var b;
                    return (b = null != this.registered[a]) && delete this.registered[a], b
                },
                add: function (a, b, c, d, e) {
                    var f;
                    return f = {
                        id: a,
                        popover: b,
                        element: c,
                        attribute: d,
                        options: e
                    }, this.popoverList.push(f), f
                },
                pop: function () {
                    return this.popoverList.pop()
                },
                show: function (g, i, j, k) {
                    var l, m, n, o;
                    return null == k && (k = {}), (o = this.registered[g]) ? (n = function (b) {
                        var c, d, i;
                        return d = k.scope || a.$new(), o.refreshOn && d.$on(o.refreshOn, function () {
                            return h.resize(g)
                        }), o.controller && f(o.controller, {
                            $scope: d
                        }), i = angular.element(h.template), c = [], o.footer && c.push("has-footer"), null == o.header || o.header || c.push("no-header"), i.attr({
                            id: o.id,
                            direction: o.direction
                        }).addClass(c.join(" ")), angular.element(".popover-content-wrapper", i).html(b), o.title && angular.element(".title", i).html(o.title), i.on("mouseenter mouseleave", function (a) {
                            var b;
                            return b = h.last(), null != b && b.id === g && "hover" === b.options.trigger && (b.options.overPopover = "mouseenter" === a.type, "mouseleave" === a.type && h.hide()), !0
                        }), angular.element("#overlays").append(e(i)(d)), i
                    }, l = function () {
                        var e, f, l;
                        return f = function (c) {
                            var d;
                            return d = n(c), h.add(g, d, i, j, k), i.addClass("active"), a.$broadcast("popoverWasShown", g, k.content), b(function () {
                                return h.resize(g)
                            }, 0)
                        }, (l = o.template) ? f(l) : (e = o.templateUrl) ? (l = c.get(e), l ? f(l) : d.get(e).then(function (a) {
                            return c.put(e, a.data), f(a.data)
                        }, function () {
                            throw Error("Failed to load template: " + e)
                        })) : f()
                    }, m = null != k.childPopover && k.childPopover, h.popoverList.length && !m ? h.hide({
                        callback: l
                    }) : l()) : void 0
                },
                getById: function (a, b) {
                    return _(this.popoverList).find(function (c) {
                        var d;
                        return d = null != b ? c.element.is(b) : !0, c.id === a && d
                    })
                },
                resize: function (a) {
                    var c;
                    return c = h.getById(a), null != c ? b(function () {
                        var a, b, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
                        return f = c.popover, m = c.element, j = c.options, a = angular.element(window), o = angular.element(".tip", f).removeAttr("style"), i = m.offset(), j.fixed && (i.top = m.position().top), l = {
                            height: m.outerHeight(),
                            width: m.outerWidth()
                        }, e = {
                            height: f.outerHeight(),
                            width: f.outerWidth()
                        }, p = 0, h = 0, k = f.attr("direction").trim(), n = function (a) {
                            var b;
                            return null == a && (a = 0), p -= a, b = +o.css("margin-top").replace("px", ""), o.css("margin-top", b + a)
                        }, r = function () {
                            switch (k) {
                            case "above left":
                                return p = -(e.height + 10), h = -25 + l.width / 2;
                            case "above right":
                                return p = -(e.height + 10), h = 25 + l.width / 2 - e.width;
                            case "below left":
                                return p = l.height + 10, h = -25 + l.width / 2;
                            case "below right":
                                return p = l.height + 10, h = 25 + l.width / 2 - e.width;
                            case "middle right":
                                return p = l.height / 2 - e.height / 2, h = l.width + 10;
                            case "middle left":
                                return p = l.height / 2 - e.height / 2, h = -(e.width + 10)
                            }
                        }, r(), q = j.fixed ? 0 : a.scrollTop(), b = {}, -1 === k.indexOf("middle") ? i.top + p - q < 0 ? b = {
                            remove: "above",
                            add: "below"
                        } : i.top + p - q > a.height() && (b = {
                            remove: "below",
                            add: "above"
                        }) : (g = i.top + p - q) < 0 ? n(g) : (g = i.top + p + f.outerHeight() - q - a.height()) > 0 && n(g), i.left + h < 0 ? b = {
                            remove: "right",
                            add: "left"
                        } : i.left + h + f.outerWidth() > a.width() && (b = {
                            remove: "left",
                            add: "right"
                        }), b.remove && b.add && (k = k.replace(b.remove, b.add), r()), i.top += p, i.left += h, d = (j.fixed ? "add" : "remove") + "Class", f[d]("fixed"), null != j.offsetX && (i.left += j.offsetX), null != j.offsetY && (i.top += j.offsetY), f.css(i).addClass("" + k + " visible")
                    }, 0) : void 0
                },
                hide: function (c, d) {
                    var e, f, g, h;
                    return null == d && (d = {}), _(c).isObject() && (d = c, c = null), e = d.callback, g = d.delay || 100, this.popoverList.length && (h = this.last(), null == c || h.id === c) ? (a.$broadcast("popoverBeforeHide", h.id), f = this.pop(), f.popover.removeClass("visible"), b(function () {
                        return f.element.removeClass("active"), a.$broadcast("popoverWasHidden", h.id), f.options.scope || f.popover.scope().$destroy(), f.popover.remove(), null != e ? e.apply(this) : void 0
                    }, g)) : void 0
                },
                hideAll: function () {
                    if (this.popoverList.length) {
                        for (; this.popoverList.length;) this.hide();
                        return angular.element(".popover.visible").removeClass("visible")
                    }
                }
            }, a.$on("hidePopover", function (a, b) {
                return h.hide(b)
            }), a.$on("hideAllPopovers", function () {
                return h.hideAll()
            }), h
        }
    ]).run(["$rootScope", "$timeout", "keys", "popover",
        function (a, b, d, e) {
            return angular.element(document).on("click", function (a) {
                var b, c, d, f;
                return f = angular.element(a.target), d = f.is("[shift-popover]") || f.parents("[shift-popover]").length, c = f.is(".popover") || f.parents(".popover").length, b = f.is(".popover-clickable") || f.parents(".popover-clickable").length, e.popoverList.length > 0 && !c && !d && !b && e.hide(), !0
            }), angular.element(document).on("scroll", function () {
                return e.hideAll()
            }), angular.element(window).on("resize", function () {
                return e.hide()
            }), a.$on("modalWasShown", function () {
                return e.hideAll()
            }), a.$on("showPopover", function () {
                var d, e, f;
                return d = arguments[0], f = arguments[1], e = 3 <= arguments.length ? c.call(arguments, 2) : [], b(function () {
                    var b, d;
                    return b = angular.element(f), d = b.attr("shift-popover"), b.click(), a.$broadcast.apply(a, ["popoverWasShown", d].concat(c.call(e)))
                }, 0)
            })
        }
    ]).directive("shiftPopover", ["$rootScope", "$timeout", "popover", "util",
        function (a, c, d, e) {
            return {
                restrict: "A",
                link: function (a, f, g) {
                    var h, i, j, k, l, m, n, o, p;
                    return k = {
                        fixed: !1,
                        childPopover: !1,
                        offsetY: 0,
                        offsetX: 0,
                        trigger: "click",
                        overPopover: !1,
                        scope: !1
                    }, o = e.extendAttributes("shiftPopover", k, g), j = g.shiftPopoverContent, m = g.shiftPopoverExclude || "", n = m.split(","), l = null, i = null, h = function () {
                        return null != l && c.cancel(l), null != i ? c.cancel(i) : void 0
                    }, p = function (c, e) {
                        var h, i, k;
                        return h = d.last(), i = null != h ? h.element : void 0, null != h && (k = h.id, b.call(n, k) >= 0) && d.hide(), null != h && h.id === e && f[0] === i[0] ? d.hide() : (o.content = a.$eval(j) || c, o.scope && (o.scope = a), d.show(e, f, g, o)), !0
                    }, g.$observe("shiftPopover", function (a) {
                        if (a) switch (o.trigger) {
                        case "click":
                            return f.on("click", function (b) {
                                return p(b, a)
                            });
                        case "hover":
                            return f.on("mouseenter", function (b) {
                                return h(), l = c(function () {
                                    return p(b, a)
                                }, 400), !0
                            }).on("mouseleave", function () {
                                return h(), i = c(function () {
                                    var b, c;
                                    return c = d.last(), null != c ? (b = c.element, c.id === a && !c.options.overPopover && b.is(f) ? d.hide() : void 0) : void 0
                                }, 500), !0
                            }).on("click", function () {
                                return h(), !0
                            })
                        }
                    })
                }
            }
        }
    ]).directive("shiftHidePopoverOnScroll", ["popover",
        function (a) {
            return {
                restrict: "A",
                link: function (b, c) {
                    return c.on("scroll", function () {
                        return a.hideAll()
                    })
                }
            }
        }
    ]), a.popover = function (b, c) {
        return a.config(["popoverViewsProvider",
            function (a) {
                return null == a.registered[b] ? (c.id = b, a.registered[b] = c) : void 0
            }
        ])
    }
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftInviteTypeahead", ["$rootScope",
        function (a) {
            return {
                restrict: "EA",
                link: function (b, c, d) {
                    var e, f, g, h;
                    return g = d.shiftInviteTypeaheadSection || null, e = c.parent(), f = $("#invite-typeahead-overlay"), h = f.find(".typeahead-wrap"), b.$on("hideTypeaheadContact", function () {
                        return h.removeClass("visible"), f.hide()
                    }), f.click(function (b) {
                        return "invite-typeahead-overlay" === $(b.target).attr("id") ? (h.removeClass("visible"), f.hide(), a.$broadcast("inviteOverlayHidden")) : void 0
                    }), c.keyup(function (a) {
                        var b, c, d;
                        if (13 !== a.which) return "onboarding" === g ? (c = $(this).offset().top + 26, b = $(this).parent().offset().left) : (c = 46, b = 15), d = $(this).parent().outerWidth(), h.addClass("visible"), f.show(), h.css({
                            top: c,
                            left: b,
                            width: d
                        })
                    }), e.click(function () {
                        return $(this).find(".typeahead").focus()
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    null == window.sh && (window.sh = {}), window.sh.VERSION = "7.5.6", window.SHIFT = a = angular.module("SHIFT", ["Bangular.View", "Mac", "SHIFT.Popover", "SHIFT.Analytics", "SHIFT.Api", "SHIFT.ApiCallbacks", "SHIFT.Context", "SHIFT.Controllers", "SHIFT.Directives", "SHIFT.Enums", "SHIFT.Filters", "SHIFT.HistoricEvents", "SHIFT.HistoricNotifications", "SHIFT.Initialize", "SHIFT.LarryKing", "SHIFT.LiveEvents", "SHIFT.Models", "SHIFT.NotificationHandler", "SHIFT.Routes", "SHIFT.Store", "SHIFT.Util"])
}.call(this),
function () {
    SHIFT.view = function (a, b) {
        return SHIFT.config(["panesProvider",
            function (c) {
                return c.addView(a, b)
            }
        ])
    }
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ActivityController", ["$scope", "store",
        function (a, b) {
            var c;
            return c = !1, a.allActivityEvents = b.findWithPersistence("ActivityEvent", {
                muted: !1
            }), a.setActivityEvents = function () {
                return a.activityEvents = a.allActivityEvents.slice(0, 50)
            }, a.$on("popoverWasShown", function (a, b) {
                return c = "activity-popover" === b
            }), a.$on("popoverWasHidden", function () {
                return c = !1, a.setActivityEvents()
            }), a.$watch("allActivityEvents.length", function () {
                return c ? void 0 : a.setActivityEvents()
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("AddContactController", ["$rootScope", "$scope", "popover", "api", "context", "util", "keys",
        function (a, b, c, d, e, f, g) {
            return b.resetAddContactController = function () {
                return b.selectedUser = [], b.isLoading = !1, b.canSubmit = !1, b.email = ""
            }, b.resetAddContactController(), a.$on("popoverBeforeHide", function (a, c) {
                return "add-contact-popover" === c ? b.resetAddContactController() : void 0
            }), b.isItemCurrentUser = function (a) {
                return a.id !== e.currentUser.id
            }, b.submitEmail = function (e) {
                return b.isLoading = !0, d.addContact({
                    data: {
                        people: [{
                            email: e
                        }]
                    },
                    success: function () {
                        return c.hide(), a.$broadcast("showSuccess", "Your contact request has been sent"), b.resetAddContactController(), b.$broadcast("resetSearch")
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to add " + e + " to address book")
                    },
                    complete: function () {
                        return b.isLoading = !1
                    }
                })
            }, b.addContact = function (a) {
                return b.submitEmail(a.userEmail)
            }, b.$watch("selectedUser.length", function (a) {
                var c;
                return 1 === a ? b.submitEmail(null != (c = b.selectedUser[0]) ? c.email : void 0) : void 0
            }), b.onKeydown = function (a, c) {
                switch (a.which) {
                case g.ENTER:
                    b.canSubmit && b.submitEmail(c)
                }
                return b.canSubmit = f.validateEmail(c), b.email = c
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("AddressBookController", ["$rootScope", "$scope", "context", "store", "util", "enums", "modal",
        function (a, b, c, d, e, f) {
            return b.filters = ["mutual", "pending", "email", "blocked"], b.selectedFilter = b.filters[0], b.filteredContactList = [], b.isLoading = !1, b.selectFilter = function (a) {
                return b.selectedFilter = a, b.updateFilteredContactList()
            }, b.$on("updateFilteredContactList", function () {
                return b.updateFilteredContactList()
            }), b.updateFilteredContactList = function () {
                var a, c;
                return a = b.selectedFilter, c = "blocked" !== a ? "/v1/users/me/address_book?filter=" + a + "&limit=200" : "/v1/users/me/blocklist?limit=200", b.isLoading = !0, d.fetchAll("User", {
                    url: c,
                    success: function (c) {
                        return b.isLoading = !1, b.filteredContactList = c.models || [], _(c.models).each(function (b) {
                            return b.relationship = function () {
                                switch (a) {
                                case "mutual":
                                    return f.RELATIONSHIP_TYPE.MUTUAL;
                                case "pending":
                                    return f.RELATIONSHIP_TYPE.PENDING_CONTACT;
                                case "blocked":
                                    return f.RELATIONSHIP_TYPE.BLOCKED;
                                default:
                                    return f.RELATIONSHIP_TYPE.NONE
                                }
                            }()
                        })
                    }
                })
            }, b.invitePeople = function () {
                return c.goToPath("invite-others")
            }, b.$watch("context.selectedSubpage", function (a) {
                return "address-book" === a ? (b.selectedFilter = b.filters[0], b.updateFilteredContactList()) : void 0
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("AppOverlayController", ["$scope", "$location", "store", "router", "initialize", "context", "api",
        function (a, b, c, d, e, f, g) {
            var h;
            return a.authUrl = null, h = function (b, c, d) {
                return null == c && (c = f.selectedTeam), null == d && (d = ""), a.authUrl = "/app-authorization/#/" + b.id + "/team/" + c.id + "/platform", d ? a.authUrl += "?redirect=" + encodeURIComponent(d) : void 0
            }, d.on("/teams/:teamId/apps/:appId", function (a, d) {
                return e.init({
                    invoke: function () {
                        var e, i, j, k;
                        return i = b.search().redirect || "", k = c.findOne("Team", a), e = c.findOne("Application", d), j = function () {
                            var a;
                            return (a = null != k && null != e) && (f.selectedApp = e, h(e, k, i)), a
                        }, j() ? void 0 : g.fetchAllTeams({
                            success: function () {
                                return k = c.findOne("Team", a), c.fetchOne("Application", d, {
                                    success: function (a) {
                                        return e = a.models[0], j() ? void 0 : f.goToRoot()
                                    },
                                    error: function () {
                                        return f.goToRoot()
                                    }
                                })
                            },
                            error: function () {
                                return f.goToRoot()
                            }
                        })
                    }
                })
            }), a.closeApp = function () {
                var b;
                return b = f.selectedApp.id, null != f.selectedObject ? f.goToObject(f.selectedObject) : f.goToRoot(), f.selectedApp = null, a.authUrl = "about:blank", g.closeAppSession({
                    applicationId: b
                })
            }
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("AppStoreController", ["$rootScope", "$scope", "store", "context", "api", "modal",
        function (a, c, d, e, f, g) {
            return c.reset = function () {
                return c.appsLoading = !0, c.installedAppIds = []
            }, c.isAppInstalled = function (a) {
                var d;
                return d = a.id, b.call(c.installedAppIds, d) >= 0
            }, c.confirmationMessage = function (a) {
                return null == e.selectedObject ? "" : "Team" === e.selectedObjectType ? "Are you sure you want to uninstall " + a.name + " from " + e.selectedTeam.name + "? No one on the team will be able to use the app and any existing activity will be frozen." : "Are you sure you want to uninstall " + a.name + "? You will no longer be able to use the app and any existing activity will be frozen."
            }, c.updateAppsList = function (a) {
                var d;
                return c.installedAppIds = _(a).chain().filter(function (a) {
                    return a.isInstalled
                }).pluck("id").value(), d = [], c.applicationList = _(a).reject(function (a) {
                    var c, e;
                    return e = a.id, c = b.call(d, e) >= 0, c || d.push(a.id), c
                }), setTimeout(function () {
                    return g.resize(g.opened)
                }, 0)
            }, c.$on("modalWasShown", function (a, b) {
                return "app-store" === b ? d.fetchAll("Application", {
                    url: "/v1/teams/" + e.selectedTeam.id + "/appstore",
                    success: function (a) {
                        var b, e, f, g;
                        for (g = d.find("Application"), e = 0, f = g.length; f > e; e++) b = g[e], delete b.isTogglingInstall;
                        return c.updateAppsList(a.models), c.appsLoading = !1
                    }
                }) : void 0
            }), c.$on("modalWasHidden", function (a, b) {
                return "app-store" === b ? c.reset() : void 0
            }), c.closeApplicationList = function () {
                return g.hide()
            }, c.toggleAppInstall = function (b) {
                var d;
                if (!b.isTogglingInstall) return c.isAppInstalled(b) ? (b.isTogglingInstall = !0, d = "Failed to uninstall application. Please try again.", f.uninstallApp({
                    applicationId: b.id,
                    teamId: e.selectedTeam.id,
                    success: function () {
                        return c.installedAppIds = _(c.installedAppIds).without(b.id)
                    },
                    error: function () {
                        return a.$broadcast("showError", d)
                    },
                    complete: function () {
                        return delete b.isTogglingInstall
                    }
                })) : null != e.selectedTeam && null != b ? (b.isTogglingInstall = !0, d = "There was an error installing this application. The developer has been notified.", f.installApp({
                    applicationId: b.id,
                    teamId: e.selectedTeam.id,
                    data: {
                        application_id: b.id
                    },
                    success: function () {
                        return c.installedAppIds.push(b.id)
                    },
                    error: function () {
                        return a.$broadcast("showError", d)
                    },
                    complete: function () {
                        return delete b.isTogglingInstall
                    }
                })) : a.$broadcast("showError", "Failed to install an application.")
            }, c.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("AppsController", ["$rootScope", "$scope", "popover", "store", "context", "api", "initialize",
        function (a, b, c, d, e, f, g) {
            return b.appsLoading = !0, b.installedApps = [], b.updateInstalledApps = function () {
                var a;
                switch (e.selectedObjectType) {
                case "Team":
                    a = e.selectedTeam.id, b.installedApps = d.find("Application", {
                        teamIds: {
                            $contains: a
                        }
                    });
                    break;
                case "User":
                    e.selectedObject.id === e.currentUser.id && (b.installedApps = d.find("Application", {
                        teamIds: {
                            $not: [],
                            $exists: !0
                        }
                    }))
                }
                return b.appsLoading = !1
            }, g.init({
                invoke: function () {
                    return b.appsLoading = !0, f.fetchAllApplications({
                        complete: function () {
                            return b.updateInstalledApps()
                        }
                    })
                }
            }), b.$on("contextDidChange", function () {
                return b.updateInstalledApps()
            }), b.$on("modalWasHidden", function (a, c) {
                return "app-store" === c ? b.updateInstalledApps() : void 0
            }), b.goToApp = function (a, b, f) {
                var g, h, i, j, k;
                return a.stopImmediatePropagation(), "Team" === e.selectedObjectType ? e.goToApp(f, e.selectedTeam) : 1 === f.teamIds.length ? e.goToApp(f, d.findOne("Team", f.teamIds[0])) : (j = "open-app-as-popover", k = c.getById(j), h = null != k ? k.popover : void 0, i = null != k ? k.element : void 0, g = $(".app-links a.content-link").get(b), (null != h ? h.attr("id") : void 0) === j && g === (null != i ? i[0] : void 0) ? c.hide() : c.show(j, $(g), {}, {
                    isFixed: !1,
                    content: f
                }))
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ChatController", ["$scope", "store", "context",
        function (a, b, c) {
            return a.conversations = b.findWithPersistence("Conversation"), Object.defineProperty(a, "isOnline", {
                get: function () {
                    return c.currentUser.isOnline
                }
            }), a.toggleOnline = function () {
                return c.currentUser.isOnline = !c.currentUser.isOnline
            }, a.closeConversation = function (a) {
                return b.remove("Conversation", {
                    id: a.id
                })
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ChatListController", ["$rootScope", "$scope", "store", "context", "util", "larryKing", "initialize",
        function (a, b, c, d, e, f, g) {
            var h;
            return b.allUsers = c.findWithPersistence("User"), b.chats = c.findWithPersistence("Chat"), b.showNewChat = !1, b.statusDropdownIsVisible = !1, b.userQuery = {
                name: ""
            }, b.addedUsers = [], b.locallyCreatedChatCount = 0, b.showUnreadHeader = !1, b.globalIsLocked = !0, h = function (a) {
                return c.fetchAll("ChatMessage", {
                    url: "/v1/chats/" + a.id + "/history",
                    success: function () {
                        return b.$broadcast("didResizeGlobal")
                    }
                })
            }, g.init({
                priority: -10,
                invoke: function () {
                    return c.fetchAll("Chat", {
                        success: function () {
                            var a, c, d, e, f;
                            for (e = b.chats, f = [], c = 0, d = e.length; d > c; c++) a = e[c], a.unread > 0 && (a.unreadPulseIsShown = !0), f.push(h(a));
                            return f
                        }
                    })
                }
            }), b.$watch("addedUsers.length", function (a) {
                return a >= 1 ? (b.createNewChat(b.addedUsers), b.addedUsers = []) : void 0
            }), b.$watch("chats.length", function () {
                var a, c, d, e, f, g;
                for (b.$broadcast("didResizeGlobal"), c = b.locallyCreatedChatCount, d = b.chats.splice(-c, c), g = [], e = 0, f = d.length; f > e; e++) a = d[e], g.push(b.chats.unshift(a));
                return g
            }), b.$on("chat-message-received", function (a, b) {
                return b.isSelected ? b.unread = 0 : (b.unread++, b.unreadPulseIsShown = !0)
            }), b.$on("createNewChat", function (a, c) {
                return b.createNewChat(c)
            }), b.$on("showChatUnreadHeader", function () {
                return b.showUnreadHeader = !0
            }), b.$on("hideChatUnreadHeader", function () {
                return b.showUnreadHeader = !1
            }), b.$on("popoverWasShown", function (b, c) {
                return "chat-popover" === c ? a.$broadcast("messageExpanded") : void 0
            }), b.createNewChat = function (d) {
                var e, f, g, i, j, k, l = this;
                for (k = this.chats, f = i = 0, j = k.length; j > i; f = ++i)
                    if (e = k[f], e.includesUsers(d) && e.users.length === d.length + 1) return b.selectedChat = e, b.showNewChat = !1, b.$broadcast("scrollChats"), a.$broadcast("showPopover", "#chat .global-list li:eq(" + f + ")", e), void 0;
                return this.locallyCreatedChatCount++, g = _(d).pluck("id"), c.create("Chat", {
                    users: g
                }, {
                    success: function () {
                        return e = l.chats[l.chats.length - 1], l.showNewChat = !1, l.selectedChat = e, h(e), l.$broadcast("scrollToTop"), a.$broadcast("showPopover", "#chat .global-list li:eq(0)", e)
                    }
                })
            }, b.$on("hideDropdown", function () {
                return b.statusDropdownIsVisible = !1
            }), b.toggleNewChat = function () {
                return this.statusDropdownIsVisible = !1, this.showNewChat = !b.showNewChat
            }, b.toggleDropdown = function (c) {
                return c.stopPropagation(), b.statusDropdownIsVisible || a.$broadcast("showDropdown"), this.showNewChat = !1, b.statusDropdownIsVisible = !b.statusDropdownIsVisible
            }, b.goOnline = function () {
                return d.currentUser.chatActive = !0, this.statusDropdownIsVisible = !1, f.sendOnlineStatus(!0), a.$broadcast("me-online"), a.$broadcast("hideDropdown")
            }, b.goOffline = function () {
                return d.currentUser.chatActive = !1, this.statusDropdownIsVisible = !1, f.sendOnlineStatus(!1), a.$broadcast("hideDropdown")
            }, b.getOnlineStatus = function (a) {
                var b;
                return function () {
                    var c, e, f, g;
                    for (f = a.users, g = [], c = 0, e = f.length; e > c; c++) b = f[c], b !== d.currentUser && g.push(b);
                    return g
                }()[0].online
            }, b.getOtherUser = function (a) {
                var b, c, e, f;
                for (f = a.users, c = 0, e = f.length; e > c; c++)
                    if (b = f[c], b !== d.currentUser) return b
            }, b.getUnreadChats = function () {
                var a, c, d, e, f;
                for (e = b.chats, f = [], c = 0, d = e.length; d > c; c++) a = e[c], a.unread > 0 && f.push(a);
                return f
            }, b.testShowUnreadHeader = function () {
                return b.showUnreadHeader && b.getUnreadChats().length > 0
            }, b.removeChat = function (b, d) {
                return a.$broadcast("hidePopover"), c["delete"]("Chat", b.id, {
                    error: function () {
                        return c.remove("Chat", {
                            id: b.id
                        })
                    }
                }), null != d ? d.stopPropagation() : void 0
            }, b.toggleGlobal = function () {
                return b.globalIsLocked = !b.globalIsLocked, a.$broadcast("lockGlobal", b.globalIsLocked)
            }
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("ChatPopoverController", ["$scope", "$rootScope", "popover", "store", "context", "util", "larryKing", "api",
        function (a, c, d, e, f, g, h, i) {
            var j, k;
            return j = !1, k = !1, a.isAddingUsers = !1, a.isLoadingHistory = !1, a.didLoadHistory = !1, a.userQuery = {
                name: ""
            }, a.addedUsers = [], Object.defineProperty(a, "addableUsers", {
                get: function () {
                    var a, c;
                    return c = f.currentUser.connectedUsers, null != this.chat && (a = this.chat.users, c = _.reject(c, function (c) {
                        return b.call(a, c) >= 0
                    })), c
                }
            }), a.adjustDisplay = function () {
                return a.$broadcast("scrollToBottom"), d.resize("chat-popover")
            }, a.getOnlineStatus = function (a) {
                var b;
                if (a) return function () {
                    var c, d, e, g;
                    for (e = a.users, g = [], c = 0, d = e.length; d > c; c++) b = e[c], b !== f.currentUser && g.push(b);
                    return g
                }()[0].online
            }, a.addUsers = function () {
                var a;
                return this.addedUsers.length > 0 && (this.closeChat(), a = _.reject(this.chat.users.concat(this.addedUsers), function (a) {
                    return a === f.currentUser
                }), c.$broadcast("createNewChat", a)), this.addedUsers = [], this.isAddingUsers = !1
            }, a.loadChatMessages = function (a) {
                return e.remove("ChatMessage", {
                    chatId: a.id
                }), e.fetchAll("ChatMessage", {
                    url: "/v1/chats/" + a.id + "/history"
                })
            }, a.loadHistory = function (b) {
                var c, d, f;
                return k && !a.isLoadingHistory ? (a.selectedMessage = b.oldestMessage, a.isLoadingHistory = !0, f = "/v1/chats/" + b.id + "/history", c = b.oldestMessage, c && (d = c.createdAt, f += "?offset=" + d), e.fetchAll("ChatMessage", {
                    url: f,
                    complete: function () {
                        return a.isLoadingHistory = !1, a.didLoadHistory = !0
                    }
                })) : void 0
            }, a.createOfflineMessage = function (b) {
                return a.createStatusMessage(b, "offline")
            }, a.createOnlineMessage = function (b) {
                return a.createStatusMessage(b, "online")
            }, a.createStatusMessage = function (b, c) {
                return null == c && (c = "offline"), e.save("ChatMessage", {
                    text: "" + b.firstName + " is " + c,
                    type: c,
                    chatId: a.chat.id,
                    createdAt: +new Date / 1e3
                })
            }, a.allowLoadHistory = function () {
                return k = !0
            }, a.$watch("chat.messages.length", function (b, c) {
                return a.adjustDisplay(), j && b > c && i.markChatAsRead({
                    chatId: a.chat.id
                }), a.didLoadHistory && a.selectedMessage ? (a.selectedMessage = null, a.didLoadHistory = !1, a.$broadcast("scrollChatMessages")) : void 0
            }), a.$on("newChatMessage", function (b, c) {
                return b.stopPropagation(), h.sendChatMessage(a.chat, {
                    text: c
                }), a.adjustDisplay()
            }), a.$on("popoverWasShown", function (b, c, d) {
                var g, h, l, m;
                if ("chat-popover" === c) {
                    for (a.isAddingUsers = !1, a.addedUsers = [], k = !1, a.adjustDisplay(), j = !0, a.chat = d, d.isSelected = !0, d.unread = 0, e.remove("ChatMessage", {
                        type: "offline"
                    }), m = d.users, h = 0, l = m.length; l > h; h++) g = m[h], g === f.currentUser || g.online || a.createOfflineMessage(g);
                    return i.markChatAsRead({
                        chatId: d.id
                    }), a.$broadcast("focusChatInput")
                }
            }), a.$on("popoverWasHidden", function () {
                var b;
                return k = !1, j = !1, null != (b = a.chat) ? b.isSelected = !1 : void 0
            }), a.$on("user-offline", function (c, d) {
                var e, f;
                return e = a.chat, j && (f = d.id, b.call(e.userIds, f) >= 0) ? a.createOfflineMessage(d) : void 0
            }), a.$on("user-online", function (c, d) {
                var e, f;
                return e = a.chat, j && (f = d.id, b.call(e.userIds, f) >= 0) ? a.createOnlineMessage(d) : void 0
            }), a.$on("me-online", function () {
                return null != a.chat ? a.loadChatMessages(a.chat) : void 0
            })
        }
    ]), a.controller("ChatFormController", ["$scope",
        function (a) {
            return a.newChatMessageText = "", a.sendChatMessage = function () {
                return this.newChatMessageText.length > 0 ? (a.$emit("newChatMessage", this.newChatMessageText), this.newChatMessageText = "") : void 0
            }, a.$on("popoverWasShown", function (b, c) {
                return "chat-popover" === c ? (a.newChatMessageText = "", a.$broadcast("clearChatForm")) : void 0
            }), a.$on("clearChatForm", function () {
                return a.newChatMessageText = ""
            })
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("ComposerController", ["$rootScope", "$scope", "store", "api", "context", "util", "shiftUtil", "keys", "modal",
        function (a, c, d, e, f, g, h, i, j) {
            return c.$on("contextDidChange", function () {
                return c.resetComposer()
            }), c.$on("modalWasHidden", function (a, b) {
                return "compose-message-modal" === b ? c.resetComposer() : void 0
            }), c.$on("modalWasShown", function (a, b) {
                var d;
                return d = j.opened.options.data, "compose-message-modal" === b && null != d ? c.addressedUsers = null != d && d !== f.currentUser ? [d] : [] : void 0
            }), c.$on("focusOnComposer", function () {
                return c.focused = !0
            }), c.$watch("mentionedUsers.length", function () {
                var a, e, f, g, h, i;
                if ("modal" === c.source && !c.addressingTeam) {
                    for (a = _(c.addressedUsers).pluck("id"), h = _(c.mentionedUsers).pluck("id"), i = [], f = 0, g = h.length; g > f; f++) e = h[f], b.call(a, e) < 0 ? i.push(c.addressedUsers.push(d.findOne("User", e))) : i.push(void 0);
                    return i
                }
            }), c.$watch("addressedUsers.length", function (a) {
                return c.addressingTeam = 1 === a && "Team" === c.addressedUsers[0].constructor.typeName, c.addressingUsers = a > 0 && _(c.addressedUsers).every(function (a) {
                    return "User" === a.constructor.typeName
                }), c.addressingTeam || (c.optionalUsers = []), c.addressingTeam ? c.showToPlaceholder = c.addressingTeam : void 0
            }), c.$watch("composerAttachments.length", function () {
                return "modal" === c.source ? j.resize(j.opened) : void 0
            }), c.$watch("addressingTeam", function () {
                return c.updateOptionalUsers()
            }), c.onTagInputBlur = function () {
                return setTimeout(function () {
                    return c.showToPlaceholder = 0 === c.optionalAddressedUsers.length
                }, 500)
            }, c.showOptionalTagInput = function () {
                return c.showToPlaceholder = !1, c.$broadcast("focusTagInput")
            }, c.updateOptionalUsers = function () {
                var a, g, h;
                switch (c.source) {
                case "modal":
                    if (c.addressingTeam) return g = c.addressedUsers[0], a = d.find("TeamMembership", {
                        teamId: g.id,
                        userId: {
                            $not: f.currentUser.id
                        }
                    }), 0 !== a.length || c.isFetchTeamMemberships ? c.optionalUsers = g.otherMembers : (c.isFetchTeamMemberships = !0, e.fetchTeamMemberships({
                        team: g,
                        success: function (a) {
                            var d, e, g, h, i, j;
                            for (c.isFetchTeamMemberships = !1, h = a.models, j = [], e = 0, g = h.length; g > e; e++) d = h[e], d.user.id !== f.currentUser.id && (i = d.user, b.call(c.optionalUsers, i) < 0) ? j.push(c.optionalUsers.push(d.user)) : j.push(void 0);
                            return j
                        }
                    }));
                    break;
                case "stream":
                    return c.optionalUsers = null != (h = f.selectedTeam) ? h.otherMembers : void 0
                }
            }, c.resetComposer = function () {
                return c.messageAttributes = {}, c.messageText = "", c.isSubmittingMessage = !1, c.isFetchTeamMemberships = !1, c.showToPlaceholder = !0, c.optionalUsers = [], c.addressedUsers = [], c.optionalAddressedUsers = [], c.addressedUserQuery = {
                    name: ""
                }, c.mentionedUsers = [], c.pendingAttachmentCount = 0, c.composerAttachments = [], c.addressingTeam = !1, c.addressingUsers = !1, c.focused = !1, c.$broadcast("resetMessageInput")
            }, c.submitComposer = function () {
                var a, b, d, e, g, i, j, k, l, m, n;
                if (d = (null != (l = this.messageText) ? l.length : void 0) > 0 || (null != (m = this.composerAttachments) ? m.length : void 0) > 0, d && !this.isSubmittingMessage && 0 === this.pendingAttachmentCount) {
                    if (b = h.parseStringToMentions(this.messageText), g = _(c.optionalAddressedUsers).chain().map(function (a) {
                        return a.id
                    }).compact().value(), c.messageAttributes = {
                        mentions: b.mentions,
                        text: b.text || "",
                        addressedUsers: {
                            ids: [],
                            emails: []
                        },
                        addressedTeams: [],
                        userContext: g,
                        attachments: _(c.composerAttachments).pluck("data")
                    }, "modal" === c.source)
                        if (0 === this.addressedUsers.length && this.messageAttributes.addressedUsers.ids.push(f.currentUser.id), c.addressingTeam) this.messageAttributes.addressedTeams.push(this.addressedUsers[0].id);
                        else
                            for (n = this.addressedUsers, j = 0, k = n.length; k > j; j++) e = n[j], a = e.isEmail ? "emails" : "ids", i = e.isEmail ? "name" : "id", this.messageAttributes.addressedUsers[a].push(e[i]);
                        else "stream" === c.source && this.messageAttributes.addressedTeams.push(f.selectedTeam.id);
                    return c.submitMessage()
                }
            }, c.submitMessage = function () {
                return c.isSubmittingMessage = !0, d.create("Message", c.messageAttributes, {
                    success: function () {
                        return j.hide(), c.resetComposer(), a.$broadcast("streamRequiresUpdate")
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to post message."), c.isSubmittingMessage = !1
                    }
                })
            }, c.getSuggestedUsers = function () {
                var a, c, d, e, g;
                for (e = f.currentUser.connectedUsers || [], g = [], c = 0, d = e.length; d > c; c++) a = e[c], b.call(this.addressedUsers || [], a) >= 0 || g.push(a);
                return g
            }, c.onKeydown = function (a, d) {
                var e, f, g;
                return e = function () {
                    var a, b, c, d;
                    for (c = ["SPACE", "SEMICOLON", "COMMA", "ENTER", "TAB"], d = [], a = 0, b = c.length; b > a; a++) f = c[a], d.push(i[f]);
                    return d
                }(), g = a.which, b.call(e, g) >= 0 && c.addEmailUser(d)
            }, c.optionalOnKeydown = function () {
                return c.updateOptionalUsers(), !1
            }, c.addEmailUser = function (a) {
                var b;
                return (b = g.validateEmail(a)) && d.fetchAll("User", {
                    url: "v1/users/" + a,
                    success: function (a) {
                        return c.addressedUsers.push(d.findOne("User", a.data[0].id)), c.$broadcast("resetSearch")
                    },
                    error: function () {
                        return c.addressedUsers.push({
                            name: a,
                            isEmail: !0
                        }), c.$broadcast("resetSearch")
                    }
                }), b
            }, c.resetComposer()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ContentNavController", ["$scope", "$rootScope", "store", "enums", "context", "api", "util", "modal",
        function (a, b, c, d, e, f) {
            return a.reset = function () {
                return a.user = null, a.teams = []
            }, a.isProfileView = function () {
                return "Team" === e.selectedObjectType ? !1 : e.selectedUser !== e.currentUser
            }, a.isMessageSection = function () {
                var a;
                return a = ["all", "inbox", "unread", "direct", "sent", "other"], "main" === e.selectedPage && _(a).contains(e.selectedSubpage)
            }, a.buttonClass = function () {
                if (null == a.user) return "not-contact";
                switch (+a.user.relationship) {
                case d.RELATIONSHIP_TYPE.PENDING_CONTACT:
                    return "is-pending";
                case d.RELATIONSHIP_TYPE.MUTUAL:
                    return "is-contact";
                default:
                    return "not-contact"
                }
            }, a.$on("contextDidChange", function () {
                return null != e.selectedUser ? (a.user = e.selectedUser, a.teams = [], e.selectedUser.id !== e.currentUser.id ? f.fetchMutualTeams({
                    userIds: [e.selectedUser.id],
                    success: function (b) {
                        var d, e;
                        return e = b.data, a.teams = function () {
                            var a, b, f;
                            for (f = [], a = 0, b = e.length; b > a; a++) d = e[a], f.push(c.findOne("Team", {
                                id: d
                            }));
                            return f
                        }()
                    }
                }) : void 0) : void 0
            }), a.addContact = function () {
                return a.user.relationship = d.RELATIONSHIP_TYPE.PENDING_CONTACT, f.addContact({
                    data: {
                        emails: [a.user.userEmail]
                    },
                    error: function () {
                        return a.user.relationship = d.RELATIONSHIP_TYPE.NONE, b.$broadcast("showError", "Failed to add user to contact list")
                    }
                })
            }, a.removeContact = function () {
                var c;
                return c = a.user.relationship, a.user.relationship = d.RELATIONSHIP_TYPE.NONE, f.removeContact({
                    email: a.user.userEmail,
                    error: function () {
                        return a.user.relationship = c, b.$broadcast("showError", "Failed to remove user from contact list")
                    }
                })
            }, a.sendMessage = function () {
                return e.openMessageModal(a.user)
            }, a.openChat = function () {
                return b.$broadcast("createNewChat", [a.user])
            }, a.reset()
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("CreateTeamController", ["$rootScope", "$scope", "popover", "context", "store", "shiftUtil", "util", "api", "enums",
        function (a, c, d, e, f, g, h, i, j) {
            return c.colorChoices = g.getTeamColors(), c.iconChoices = g.getTeamIcons(), c.reset = function () {
                return c.isCreatingTeam = !1, c.teamName = "", c.selectedIcon = c.iconChoices[Math.ceil(Math.random() * (c.iconChoices.length - 1))].id, c.selectedColor = c.colorChoices[Math.ceil(Math.random() * (c.colorChoices.length - 1))], c.addedContacts = []
            }, c.$on("popoverWasHidden", function (a, b) {
                return "create-team-popover" === b ? c.reset() : void 0
            }), c.$on("selected-team-color", function (a, b) {
                return c.selectedColor = b
            }), c.$on("selected-team-icon", function (a, b) {
                return c.selectedIcon = b
            }), c.createTeam = function () {
                var b;
                return c.isCreatingTeam = !0, b = {
                    name: c.teamName || "",
                    color: c.selectedColor,
                    icon: c.selectedIcon
                }, f.create("Team", b, {
                    success: function (a) {
                        return c.isCreatingTeam = !1, c.team = a.models[0], i.fetchTeamMemberships({
                            team: c.team
                        }), c.addedContacts.length > 0 ? c.inviteMember() : (d.hideAll(), e.goToTeam(c.team))
                    },
                    error: function () {
                        return a.$broadcast("showError", "There was a problem creating your team, try again or give us feedback")
                    }
                })
            }, c.createTeamDisabled = function () {
                return c.isCreatingTeam || 0 === c.teamName.length
            }, c.isItemAvailable = function (a) {
                var d, f;
                return d = _(c.addedContacts).map(function (a) {
                    return a.user.id
                }), a.id !== e.currentUser.id && (f = a.id, !(b.call(d, f) >= 0))
            }, c.searchGoToObject = function (a) {
                return c.addedContacts.push({
                    user: a,
                    role: j.MEMBERSHIP_TYPE.MEMBER
                })
            }, c.inviteMember = function () {
                var b, f, g, h, j;
                if (0 !== c.addedContacts.length) {
                    for (f = [], j = c.addedContacts, g = 0, h = j.length; h > g; g++) b = j[g], f.push({
                        email: b.user.userEmail,
                        membership_type: +b.role
                    });
                    return i.inviteTeamMembership({
                        teamId: c.team.id,
                        data: f,
                        success: function () {
                            return d.hideAll(), e.goToTeam(c.team)
                        },
                        error: function (b) {
                            var c;
                            return a.$broadcast("showError", null != (c = b.response.errors[0]) ? c.message : void 0)
                        }
                    })
                }
            }, c.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("DialogController", ["$rootScope", "$scope",
        function (a, b) {
            var c, d, e;
            return d = function () {
                return b.showDialog = !1, b.message = "Are you sure?", b.confirmText = "Confirm", b.cancelText = "Cancel", b.cancelCallback = b.confirmCallback = null
            }, e = function (c) {
                return null == c && (c = !1), b.showDialog = c, null == a.$$phase ? a.$digest() : void 0
            }, c = function (a) {
                return e(!1), "function" == typeof a && a(), d()
            }, b.confirm = function () {
                return c(b.confirmCallback)
            }, b.cancel = function () {
                return c(b.cancelCallback)
            }, a.$on("showDialog", function (c, d) {
                return null == d && (d = {}), null != d.message && (b.message = d.message), null != d.confirmText && (b.confirmText = d.confirmText), null != d.cancelText && (b.cancelText = d.cancelText), null != d.cancel && (b.cancelCallback = d.cancel), null != d.confirm && (b.confirmCallback = d.confirm), a.$broadcast("hidePopover"), e(!0)
            }), a.$on("hideDialog", function () {
                return e(!1)
            }), d()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("EditContactController", ["$rootScope", "$scope", "context", "popover", "enums", "api",
        function (a, b, c, d, e, f) {
            return b.reset = function () {
                return b.user = "", b.isBlocked = !1
            }, a.$on("popoverWasShown", function (a, c, d) {
                return "edit-contact-popover" === c ? (b.user = d, b.isBlocked = +d.relationship === e.RELATIONSHIP_TYPE.BLOCKED) : void 0
            }), b.addContact = function () {
                return null != b.user ? f.addContact({
                    data: {
                        emails: [b.user.email || b.user.primaryEmail.address]
                    },
                    success: function () {
                        return b.hideModal()
                    }
                }) : void 0
            }, b.removeContact = function () {
                return null != b.user ? f.removeContact({
                    email: b.user.email,
                    success: function () {
                        return b.hideModal()
                    }
                }) : void 0
            }, b.blockContact = function () {
                return null != b.user ? f.blockContact({
                    data: {
                        user_id: b.user.id
                    },
                    success: function () {
                        return b.hideModal()
                    }
                }) : void 0
            }, b.unblockContact = function () {
                return null != b.user ? f.unblockContact({
                    userId: b.user.id,
                    success: function () {
                        return b.hideModal()
                    }
                }) : void 0
            }, b.sendMessage = function () {
                return c.openMessageModal(b.user)
            }, b.openChat = function () {
                return a.$broadcast("createNewChat", [b.user])
            }, b.hideModal = function () {
                return d.hide(), a.$broadcast("updateFilteredContactList")
            }, b.$on("popoverWasHidden", function (a, c) {
                return "edit-contact-popover" === c ? b.reset() : void 0
            }), b.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("EditTeamController", ["$rootScope", "$scope", "popover", "store", "context", "api",
        function (a, b, c, d, e, f) {
            return b.resetEditTeam = function () {
                return b.team = null
            }, b.pinMessage = function () {
                var a;
                return (null != (a = b.team) ? a.isFavorite : void 0) ? "Unpin" : "Pin"
            }, b.$on("popoverWasShown", function (a, c, d) {
                return "edit-team-popover" === c ? b.team = d : void 0
            }), b.togglePin = function () {
                return f.toggleTeamFavorite({
                    teamId: b.team.id,
                    isFavorite: b.team.isFavorite ? 0 : 1
                })
            }, b.sendMessage = function () {
                return e.openMessageModal(b.team)
            }, b.checkLeaveTeam = function () {
                return e.currentUser.isAdminOfTeam(b.team) && 1 === b.team.adminCount ? a.$broadcast("showError", "You must promote another admin before leaving the team.") : a.$broadcast("showDialog", {
                    message: "Are you sure you want to leave " + b.team.name + "?",
                    confirmText: "Yes",
                    confirm: function () {
                        return b.leaveTeam()
                    }
                })
            }, b.leaveTeam = function () {
                return f.leaveTeam({
                    teamId: b.team.id,
                    userId: e.currentUser.id
                })
            }, b.resetEditTeam()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ErrorController", ["$rootScope", "$scope",
        function (a, b) {
            var c;
            return b.message = "", c = null, a.$on("showError", function (a, d, e) {
                var f;
                return e || (e = {}), f = e.delay || 5e3, b.message = d, b.action = e.action ? function () {
                    return b.reset(), e.action()
                } : null, e.noDelay ? void 0 : c = setTimeout(function () {
                    return b.reset(), b.$digest()
                }, f)
            }), b.reset = function () {
                return this.message = "", this.action = null, c = null
            }, b.closeModal = function () {
                return null != c && clearTimeout(c), this.reset()
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("FilterBarController", ["$rootScope", "$scope", "$location", "store", "router", "context", "api",
        function (a, b, c, d, e, f) {
            var g;
            return b.activeFilter = "", b.searchUsers = [], b.preSearchLocation = {}, b.incomingMessageIDs = [], g = function (a) {
                return b.activeFilter = a || ""
            }, e.on("/(:section)", g), e.on("/teams/:teamId(/:section)", function (a, b) {
                return g(b)
            }), b.$on("incomingMessagesDidChange", function (a, c) {
                return b.incomingMessageIDs = c
            }), b.filterMessages = function (a) {
                var b;
                if ("" === a || "unread" === a || "direct" === a || "sent" === a || "other" === a) return b = "Team" === f.selectedObject.constructor.typeName ? "/teams/" + f.selectedTeam.id + "/" + a : "/" + a, e.navigate(b)
            }, b.searchMessages = function (a) {
                var d, e;
                return e = b.extractSearchQuery(a), _.isEmpty(e) && _.isEmpty(this.searchUsers) ? b.exitFromSearch() : (_.isEmpty(b.preSearchLocation) && (b.preSearchLocation = {
                    path: c.path(),
                    search: c.search()
                }), d = {}, _.isEmpty(e) || (d.q = e.replace(/^\W+|\W+$/gi, "")), _.isEmpty(this.searchUsers) || (d.users = _.pluck(this.searchUsers, "id").join(",")), f.goToObject(f.selectedObject, "", d), b.searchedQuery = d.q)
            }, b.exitFromSearch = function () {
                return f.goToPath(b.preSearchLocation.path, b.preSearchLocation.search), a.$broadcast("resetMessageInput"), a.$broadcast("streamRequiresUpdate"), b.messageText = "", b.preSearchLocation = {}
            }, b.inboxLabel = function () {
                return "Team" === f.selectedObjectType ? "All" : "Inbox"
            }, b.extractSearchQuery = function (a) {
                var b;
                return null == a && (a = ""), b = /\s?@\{[\d\w-]+:[\d\w\s]+}/gi, a = a.replace(b, ""), a.replace(/\s?/, "")
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("FollowupsController", ["$scope", "$rootScope", "store", "context", "api", "initialize",
        function (a, b, c, d, e, f) {
            return a.$on("contextDidChange", function () {
                return a.populateFollowups()
            }), a.followups = [], a.getNoObjectsMessage = function () {
                var a;
                return d.currentUser === d.selectedUser ? "You have no follow ups." : "You have no follow ups with " + (null != (a = d.selectedObject) ? a.name : void 0) + "."
            }, a.deleteFollowup = function (a, d) {
                var e;
                return null != a && a.stopPropagation(), b.$broadcast("hidePopover"), e = c.findOne("Message", d.messageId), e.userFollowed = !1, c["delete"]("FollowUp", d.id, {
                    url: "/v1/users/me/follow_ups/" + d.messageId,
                    error: function () {
                        return b.$broadcast("showError", "Failed to remove follow up. Please try again.")
                    }
                })
            }, a.populateFollowups = function () {
                var e, f, g;
                return null != d.selectedObject && ("function" == typeof (g = a.followups).unregister && g.unregister(), f = d.selectedObject.id, e = "Team" === d.selectedObjectType ? {
                    addressedTeams: {
                        $contains: f
                    }
                } : "User" === d.selectedObjectType && d.currentUser.id !== f ? [{
                    authorId: f,
                    addressedUsers: {
                        $contains: d.currentUser.id
                    }
                }, {
                    addressedUsers: {
                        $contains: f
                    }
                }] : void 0, a.followups = c.findWithPersistence("FollowUp", e)), b.$broadcast("hidePopover")
            }, a.populateFollowups(), f.init({
                priority: -10,
                invoke: function () {
                    return e.fetchAllFollowups()
                }
            })
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Controllers").controller("HoverCardController", ["$rootScope", "$scope", "$timeout", "context", "popover", "enums", "api", "store",
        function (a, b, c, d, e, f, g, h) {
            return b.user = null, b.showing = !1, b.userSet = !0, b.setUser = function (a) {
                return b.showing ? (b.user = a, b.userSet = !0, e.resize("hover-card-popover")) : void 0
            }, a.$on("popoverWasShown", function (d, f, g) {
                var i;
                return "hover-card-popover" === f ? (b.showing = !0, b.userSet = !1, e.resize(f), angular.isString(g) ? (i = h.findOne("User", g), null != i ? b.setUser(i) : h.fetchOne("User", g, {
                    success: function (a) {
                        return b.setUser(a.models[0])
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to fetch user information"), c(function () {
                            return e.hideAll()
                        }, 250)
                    }
                })) : b.setUser(g)) : void 0
            }), b.buttonClass = function () {
                if (null == b.user) return "not-contact";
                switch (+b.user.relationship) {
                case f.RELATIONSHIP_TYPE.PENDING_CONTACT:
                    return "is-pending";
                case f.RELATIONSHIP_TYPE.MUTUAL:
                    return "is-contact";
                default:
                    return "not-contact"
                }
            }, b.addContact = function () {
                return b.user.relationship = f.RELATIONSHIP_TYPE.PENDING_CONTACT, g.addContact({
                    data: {
                        emails: [b.user.userEmail]
                    },
                    error: function () {
                        return b.user.relationship = f.RELATIONSHIP_TYPE.NONE, a.$broadcast("showError", "Failed to add user to contact list")
                    }
                })
            }, b.removeContact = function () {
                return b.user.relationship = f.RELATIONSHIP_TYPE.NONE, g.removeContact({
                    email: b.user.userEmail,
                    error: function () {
                        return a.$broadcast("showError", "Failed to remove user from contact list")
                    }
                })
            }, b.sendMessage = function () {
                return d.openMessageModal(b.user), e.hideAll()
            }, b.openChat = function () {
                return a.$broadcast("createNewChat", [b.user]), e.hideAll()
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("InviteOthersController", ["$rootScope", "$scope", "$http", "$window", "$filter", "$timeout", "api", "context", "enums", "util", "popover", "modal",
        function (a, b, c, d, e, f, g, h, i, j, k, l) {
            return b.resetInviteOthers = function () {
                return b.selectedContacts = [], b.inviteEmailError = !1, b.facebookContacts = [], b.filteredFacebookContacts = [], b.selectedFacebookContacts = [], b.googleContacts = [], b.filteredGoogleContacts = [], b.selectedGoogleContacts = [], b.facebookFilterQuery = "", b.googleFilterQuery = "", b.facebookPopoverOpen = !1, b.googlePopoverOpen = !1, b.facebookFriendsFetched = !1, b.googleContactsFetched = !1, b.googOAuthPop = null, b.communicationError = !1, b.contactSuggestionDomains = [], b.usedDomains = [], b.getUserDomain(), b.badDomains = ["gmail.com", "hotmail.com", "yahoo.com", "me.com", "mac.com", "icloud.com", "msn.com", "aol.com"], b.googleOAuthPop = null, b.checkFacebookSDK(), b.waiting = !1
            }, b.$on("inviteOverlayHidden", function () {
                return b.$apply(function () {
                    return b.inviteEmailError = !1
                })
            }), b.$on("invitePopoverHidden", function () {
                return b.facebookPopoverOpen = !1, b.googlePopoverOpen = !1
            }), b.$watch("allFacebookContacts", function (a) {
                return b.toggleAllContacts(a, b.filteredFacebookContacts)
            }), b.$watch("allGoogleContacts", function (a) {
                return b.toggleAllContacts(a, b.filteredGoogleContacts)
            }), b.$watch("inviteEmail", function (b) {
                return "" === b ? a.$broadcast("hideTypeaheadContact") : void 0
            }), b.closeModal = function () {
                return l.hide()
            }, b.checkFacebookSDK = function () {
                return "undefined" != typeof FB && null !== FB ? b.facebookLoaded = !0 : $script.get("//connect.facebook.net/en_US/all.js", function () {
                    return FB.init({
                        appId: "438362832877052",
                        status: !0,
                        cookie: !0,
                        xfbml: !0
                    }), b.facebookLoaded = !0
                })
            }, b.getUserDomain = function () {
                var a, c;
                return c = h.currentUser.primaryEmail.address.split("@"), a = c[1], b.contactSuggestionDomains.push(a)
            }, b.doDomainTypeahead = function () {
                var a, c, d, e, f, g;
                for (f = b.contactSuggestionDomains, g = [], d = 0, e = f.length; e > d; d++) a = f[d], -1 !== b.badDomains.indexOf(a) ? (c = b.contactSuggestionDomains.indexOf(a), g.push(b.contactSuggestionDomains.splice(c, 1))) : g.push(void 0);
                return g
            }, b.isNewDomain = function () {
                var a;
                return -1 !== (null != (a = b.inviteEmail) ? a.search("@") : void 0)
            }, b.simpleReverse = function (a) {
                return null != a ? a.slice().reverse() : void 0
            }, b.toggleAllContacts = function (a, c) {
                var d, e, f, g;
                if (c) {
                    for (g = [], e = 0, f = c.length; f > e; e++) d = c[e], a ? (d.selected = !0, g.push(b.addContactToCollection(d))) : g.push(d.selected = !1);
                    return g
                }
            }, b.clearSearchFilter = function (a) {
                return a.stopPropagation(), b.googleFilterQuery = "", b.facebookFilterQuery = "", b.filterFacebookContacts(), b.filterGoogleContacts()
            }, b.addContactToCollection = function (a) {
                return a.type === i.CONNECT_TYPE.FACEBOOK ? b.selectedFacebookContacts.push(a) : b.selectedGoogleContacts.push(a)
            }, b.addContactToEmails = function (c, d) {
                var e, f, g;
                return null == d && (d = null), (e = "input" === c ? b.inviteEmail : b.inviteEmail + "@" + d) ? e.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/) ? (f = _(b.selectedContacts).findWhere({
                    email: e
                }), f ? (b.errorMessage = "Contact already added.", b.inviteEmailError = !0) : (b.selectedContacts.push({
                    email: e,
                    img: "/images/default_profile_32.png",
                    type: i.CONNECT_TYPE.EMAIL,
                    name: e
                }), g = e.split("@"), d = g[1], -1 === b.contactSuggestionDomains.indexOf(d) && b.contactSuggestionDomains.push(d), a.$broadcast("hideTypeaheadContact"), b.inviteEmailError = !1, b.inviteEmail = "")) : (b.errorMessage = "Must be a valid email.", b.inviteEmailError = !0) : void 0
            }, b.removeContact = function (a) {
                var c;
                return c = b.selectedContacts.indexOf(a), -1 !== c ? (a.selected = !1, b.selectedContacts.splice(c, 1)) : void 0
            }, b.filterFacebookContacts = function () {
                return a.$broadcast("inviteFiltering"), b.filteredFacebookContacts = e("filter")(b.facebookContacts, {
                    name: b.facebookFilterQuery
                })
            }, b.filterGoogleContacts = function () {
                return a.$broadcast("inviteFiltering"), b.filteredGoogleContacts = e("filter")(b.googleContacts, {
                    email: b.googleFilterQuery
                })
            }, b.addContactsToSelected = function (a) {
                var c;
                return c = b.selectedContacts.concat(a), b.selectedContacts = _(c).uniq(), k.hide()
            }, b.toggleContactSelect = function (a) {
                var c;
                return a.selected = !a.selected, a.selected ? a.type === i.CONNECT_TYPE.FACEBOOK ? b.selectedFacebookContacts.push(a) : b.selectedGoogleContacts.push(a) : a.type === i.CONNECT_TYPE.FACEBOOK ? (c = b.selectedFacebookContacts.indexOf(a), b.selectedFacebookContacts.splice(c, 1)) : (c = b.selectedGoogleContacts.indexOf(a), b.selectedGoogleContacts.splice(c, 1))
            }, b.fetchFriendsFromFacebook = function () {
                return b.facebookPopoverOpen ? FB.api("/me/friends", function (a) {
                    var c, d, e, f, g;
                    for (d = a.data, b.facebookContacts = [], g = a.data, e = 0, f = g.length; f > e; e++) c = g[e], b.facebookContacts.push({
                        id: c.id,
                        name: c.name,
                        type: i.CONNECT_TYPE.FACEBOOK,
                        img: "https://graph.facebook.com/" + c.id + "/picture",
                        selected: !1
                    });
                    return b.filteredFacebookContacts = b.facebookContacts, b.$digest(), b.facebookFriendsFetched = !0, k.show("facebook-contacts", angular.element("#search-facebook"), {}, {
                        scope: b
                    })
                }) : void 0
            }, b.facebookLogin = function () {
                return b.facebookPopoverOpen ? FB.login(function (a) {
                    return a.authResponse ? b.fetchFriendsFromFacebook() : void 0
                }) : void 0
            }, b.facebookInit = function () {
                return b.facebookFriendsFetched ? (f(function () {
                    return k.show("facebook-contacts", angular.element("#search-facebook"), {}, {
                        scope: b
                    })
                }, 10), b.facebookPopoverOpen = !0, void 0) : (b.communicationError = !1, b.facebookPopoverOpen = !0, FB.getLoginStatus(function (a) {
                    return "connected" === a.status ? b.fetchFriendsFromFacebook() : b.facebookLogin()
                }))
            }, b.getGoogleContacts = function () {
                var a, c;
                if (b.googlePopoverOpen) return c = 1e3, a = b.googleContacts.length + 1, g.getGoogleContacts({
                    query: {
                        limit: c
                    },
                    success: function (a) {
                        var c, d, e, f, g, h, j, l, m;
                        for (b.googleContacts = [], d = a.data[0].feed.entry, m = [], g = 0, h = d.length; h > g; g++) c = d[g], e = null != (j = c.gd$email) ? j[0].address : void 0, f = null != (l = c.title) ? l.$t : void 0, b.googleContacts.push({
                            id: e,
                            name: f || e,
                            email: e,
                            type: i.CONNECT_TYPE.GOOGLE,
                            img: "/images/default_profile_32.png",
                            selected: !1
                        }), b.filteredGoogleContacts = b.googleContacts, b.googleContactsFetched = !0, m.push(k.show("google-contacts", angular.element("#search-google"), {}, {
                            scope: b
                        }));
                        return m
                    },
                    error: function () {
                        return b.communicationError = !0
                    }
                })
            }, b.googleInit = function () {
                var c;
                return b.googleContactsFetched ? (window.setTimeout(function () {
                    return a.$broadcast("showGoogleContacts")
                }, 10), b.googlePopoverOpen = !0, void 0) : (b.communicationError = !1, b.googlePopoverOpen = !0, b.googOAuthPop = window.open("/v1/google/auth/redirect", "googOAuth", "width=800, height=600"), b.googleContacts.length > 0 ? void 0 : c = window.setInterval(function () {
                    var a, d, e;
                    try {
                        if (-1 !== b.googOAuthPop.document.URL.indexOf("/v1/helpers/noop")) return window.clearInterval(c), e = b.googOAuthPop.document.URL, d = j.getQueryString(e, "code"), b.googOAuthPop.close(), g.checkGoogleCredentials({
                            success: function () {
                                return b.getGoogleContacts()
                            },
                            error: function () {
                                return g.exchangeGoogleToken({
                                    data: {
                                        code: d
                                    },
                                    success: function () {
                                        return b.getGoogleContacts()
                                    },
                                    error: function () {
                                        return b.communicationError = !0
                                    }
                                })
                            }
                        })
                    } catch (f) {
                        a = f
                    }
                }, 500))
            }, b.processFacebookContacts = function () {
                var a, c, d, e, f, g, h, j;
                for (e = _(b.selectedContacts).where({
                    type: i.CONNECT_TYPE.FACEBOOK
                }), f = [], c = [], h = 0, j = e.length; j > h; h++) d = e[h], c.push({
                    method: "GET",
                    relative_url: "" + d.id
                });
                return e.length > 0 ? (a = FB.getAccessToken(), g = "https://graph.facebook.com?access_token=" + a + "&batch=" + JSON.stringify(c), $.post(g, function (a) {
                    var c, d, e, g;
                    for (f = [], e = 0, g = a.length; g > e; e++) d = a[e], c = JSON.parse(d.body), f.push({
                        first_name: c.first_name,
                        last_name: c.last_name,
                        name: c.name,
                        img: "https://graph.facebook.com/" + c.id + "/picture",
                        email: "" + c.username + "@facebook.com",
                        id: c.id
                    });
                    return b.processAllContacts(f)
                }).error(function () {
                    return b.errorMessage = "There was a problem processing your contacts.", b.inviteEmailError = !1
                })) : b.inviteContacts()
            }, b.processAllContacts = function (a) {
                var c, d, e;
                return e = _(b.selectedContacts).where({
                    type: i.CONNECT_TYPE.GOOGLE
                }), d = _(b.selectedContacts).where({
                    type: i.CONNECT_TYPE.EMAIL
                }), c = a.concat(e, d), b.inviteContacts(c)
            }, b.inviteContacts = function (a) {
                var c, d, e, f, h;
                for (null == a && (a = b.selectedContacts), e = _(a).pluck("email"), b.waiting = !0, d = [], f = 0, h = e.length; h > f; f++) c = e[f], d.push(c);
                return g.addContact({
                    data: {
                        emails: d
                    }
                }), b.waiting = !1, l.hide(), b.resetInviteOthers()
            }, b.resetInviteOthers()
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("InviteToTeamController", ["$rootScope", "$scope", "popover", "context", "store", "util", "api", "enums", "shiftUtil",
        function (a, c, d, e, f, g, h, i, j) {
            return c.reset = function () {
                return c.addedContacts = [], c.inviting = !1
            }, c.$on("popoverWasHidden", function (a, b) {
                return "invite-to-team-popover" === b ? c.reset() : void 0
            }), c.isItemAvailable = function (a) {
                var d, f;
                return d = _(c.addedContacts).map(function (a) {
                    return a.user.id
                }), d = d.concat(_(e.selectedTeam.members).pluck("id")), d = d.concat(_(e.selectedTeam.pendingMembers).pluck("id")), a.id !== e.currentUser.id && (f = a.id, !(b.call(d, f) >= 0))
            }, c.searchAddContact = function (a) {
                var b;
                return b = "User" !== a.constructor.typeName ? f.save("User", {
                    email: a.name,
                    id: j.generateId()
                }) : a, c.addedContacts.push({
                    user: b,
                    role: i.MEMBERSHIP_TYPE.MEMBER
                })
            }, c.inviteMembers = function () {
                var b, g, i, j, k;
                if (0 !== c.addedContacts.length) {
                    for (c.inviting = !0, g = [], k = c.addedContacts, i = 0, j = k.length; j > i; i++) b = k[i], g.push({
                        email: b.user.userEmail,
                        membership_type: +b.role
                    });
                    return h.inviteTeamMembership({
                        teamId: e.selectedTeam.id,
                        data: g,
                        success: function (a) {
                            return d.hideAll(), f.save("PendingMembership", a.data), c.inviting = !1
                        },
                        error: function (b) {
                            var d;
                            return a.$broadcast("showError", null != (d = b.response.errors[0]) ? d.message : void 0), c.inviting = !1
                        }
                    })
                }
            }, c.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("MembershipsController", ["$scope", "store", "context",
        function (a, b, c) {
            return a.memberships = [], a.additionalMembers = 0, a.$on("contextDidChange", function () {
                var d, e;
                if ("Team" === c.selectedObjectType) return "function" == typeof (e = a.memberships).unregister && e.unregister(), d = c.selectedObject, a.memberships = null != d ? b.findWithPersistence("TeamMembership", {
                    teamId: d.id
                }) : [], a.memberships.length > 12 ? a.additionalMembers = a.memberships.length - 12 : void 0
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("MessageController", ["$scope", "$rootScope", "context", "store", "api", "enums", "util", "$location", "$timeout", "popover", "keys", "modal",
        function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m, n;
            return a.allRepliesShown = !1, a.fadeOutRepliesUnread = !1, a.maxVisibleReplyCount = 5, a.maxVisibleAddressedUsers = 4, a.updatingFollowup = !1, a.hasSearchResultsInReplies = !1, a.hasSearchResultsInSidebar = !1, a.sidebarsAreExpanded = !1, null != (n = a.message) && (n.userFollowed = !1), a.replyObject = "reply", a.replyPlaceholder = "Reply to this message", a.$on("resetMessageScope", function () {
                return a.resetMessage(), a.allRepliesShown = !1, a._replies = null, a._replyCount = null, a.maxVisibleReplyCount = 5
            }), a.$on("sidebarFormSubmitted", function () {
                return a.sidebarFormIsVisible = !1, a.sidebarButtonIsActive = !0
            }), a.$on("replyWasDeleted", function (b, c) {
                var d;
                return d = a.replies.indexOf(c), -1 !== d ? a.replies.splice(d, 1) : void 0
            }), a.$on("sidebarReplyWasDeleted", function (b, c) {
                var d;
                return d = a.replies.indexOf(c), a.replies.splice(d, 1)
            }), a.$on("expandMessage", function (b, c) {
                return c === a.message ? a.expandMessage() : void 0
            }), a.$on("toggleReplies", function (b, c) {
                return c === a.message ? a.toggleReplies() : void 0
            }), a.$on("toggleSidebars", function (b, c) {
                return c === a.message ? a.toggleSidebars() : void 0
            }), a.$on("submitReply", function (b, c) {
                return b.stopPropagation(), a.replies.push(c), a.maxVisibleReplyCount++, a.replyCount++
            }), a.$on("displayUpdates", function () {
                return a.displayUpdates()
            }), a.$on("updateMessage", function (b, c) {
                return c === a.message ? a.displayUpdates() : void 0
            }), a.$on("markMessageAsRead", function (b, c) {
                return c !== a.message || b.defaultPrevented ? void 0 : (b.preventDefault(), a.markMessage("read"))
            }), a.$on("fetchAllReplies", function (b, c) {
                return a.fetchAllReplies(c)
            }), a.$watch("message.addressedUsers.length", function (b) {
                var c, e, f, g, h, i;
                if (b) {
                    for (h = (null != (g = a.message) ? g.addressedUsers : void 0) || [], i = [], e = 0, f = h.length; f > e; e++) c = h[e], d.findOne("User", c) ? i.push(void 0) : i.push(d.fetchOne("User", c));
                    return i
                }
            }), a.shouldTruncateMessage = function () {
                var b, c, d, e;
                return a.isExpanded ? !1 : (null != (b = a.message) ? b.lines : void 0) >= 5 || (null != (c = a.message) ? c.text.length : void 0) >= 300 || (null != (d = a.message) ? null != (e = d.attachments) ? e.length : void 0 : void 0) >= 2
            }, a.authorIsOnline = function (a) {
                var b;
                return this.fromApplication(a) ? !1 : null != a ? null != (b = a.author) ? b.online : void 0 : void 0
            }, a.messageIsUnread = function () {
                var b, c;
                return !(null != (b = a.message) ? b.read : void 0) && !(null != (c = a.message) ? c.isMuted : void 0)
            }, a.fromApplication = function (a) {
                return null != a && ("application" === a.authorType || null != a.viaApp)
            }, a.isFollowed = function () {
                var a, b;
                return null != d.findOne("FollowUp", {
                    messageId: null != (a = this.message) ? a.id : void 0
                }) ? !0 : null != (b = this.message) ? b.userFollowed : void 0
            }, a.getExtraUsersCount = function () {
                var b;
                return null != a.message && a.message.toWho.users.length > a.maxVisibleAddressedUsers ? (null != (b = a.message) ? b.toWho.users.length : void 0) - a.maxVisibleAddressedUsers : 0
            }, a.getUserLimit = function () {
                var b, c;
                return b = null != (c = a.getAddressedUsers()) ? c.length : void 0, b >= 5 ? 3 : 4
            }, a.getHiddenUsers = function () {
                var b, c;
                return b = null != (c = a.getAddressedUsers()) ? c.length : void 0, b >= 5 ? b - 3 : 0
            }, a.showComma = function (b) {
                var c;
                return c = a.getAddressedUsers().length, !(1 === c || 2 === c || 3 === c && 1 === b || 3 === c && 2 === b || 4 === c && 2 === b || 4 === c && 3 === b || c >= 5 && 2 === b || c >= 5 && 3 === b)
            }, a.getFileExtensions = function () {
                var b, c, d, e, f, g, h, i;
                for (d = [], h = (null != (g = a.message) ? g.attachments : void 0) || [], e = 0, f = h.length; f > e; e++) b = h[e], c = a.getFileExtension(null != b ? null != (i = b.data) ? i.filename : void 0 : void 0), null != c && d.push(c);
                return d = _(d).without("jpg", "png", "gif", "jpeg"), _(d).uniq()
            }, a.getFileExtension = function (a) {
                var b, c, d;
                return d = /\.([0-9a-z]+)$/i, null != (c = null != a ? a.match(d) : void 0) && (b = c[1]), b || ""
            }, a.getShowMoreMessage = function () {
                var b, c, d, e;
                return b = g.pluralize("attachment", null != (c = a.message) ? c.attachments.length : void 0), (null != (d = a.message) ? d.attachments.length : void 0) > 0 ? "Show message with " + (null != (e = a.message) ? e.attachments.length : void 0) + " " + b : "Show message"
            }, Object.defineProperty(a, "replies", {
                get: function () {
                    var a, b, c;
                    return this._replies && 0 !== this._replies.length || (this._replies = null != (a = this.message) ? null != (b = a.replies) ? b.slice() : void 0 : void 0), !this.allRepliesShown && (null != (c = this._replies) ? c.length : void 0) > this.maxVisibleReplyCount ? _.sortBy(this._replies, "createdAt").slice(-this.maxVisibleReplyCount) : this._replies || []
                },
                set: function (b) {
                    return this._replies = b, a.thread = a.getThread()
                }
            }), Object.defineProperty(a, "thread", {
                get: function () {
                    return a.getThread() || this._thread
                },
                set: function (a) {
                    this._thread = a
                }
            }), Object.defineProperty(a, "replyCount", {
                get: function () {
                    return null != this.message && null == this._replyCount && (this._replyCount = this.message.numReplies), this._replyCount || 0
                },
                set: function (a) {
                    this._replyCount = a
                }
            }), Object.defineProperty(a, "isExpanded", {
                get: function () {
                    return this._isExpanded || this.autoExpand
                },
                set: function (a) {
                    this._isExpanded = a
                }
            }), a.getNewReplyCount = function () {
                var a;
                return null != this.message ? (null != (a = this.message) ? a.numReplies : void 0) - this.replyCount : 0
            }, a.getAppObjAttachmentText = function () {
                var b;
                return b = "", a.fromApplication(a.message) && (b = "Visit ", null != this.message.mentions && this.message.mentions.length > 0 && (b += "" + this.message.mentions[0].name + " in "), b += "application" === this.message.authorType ? this.message.author.name : this.message.viaApp.name), b
            }, a.getAppObjAttachmentImage = function () {
                var b;
                return b = {}, a.fromApplication(a.message) && (b = "application" === this.message.authorType ? this.message.author.images[0].sizes : this.message.viaApp.images[0].sizes), b
            }, a.$watch("getNewReplyCount()", function (b, c) {
                return b > c ? a.$emit("newReplyWasReceived", a.message) : void 0
            }), a.resetMessage = function () {
                return a.isLoading = !1, a.fadeOutRepliesUnread = !1, a.repliesAreExpanded = !1, a.sidebarFormIsVisible = !1, a.isExpandedHTML = !1, a.messageImagesExpanded = !1, a.sidebarButtonIsActive = !0, a.replies = [], a.footerSection = ""
            }, a.getAddressedUsers = function () {
                var b, c, d;
                return (null != (b = a.message) ? b.toWho.contextUsers.length : void 0) > 0 ? null != (c = a.message) ? c.toWho.contextUsers : void 0 : null != (d = a.message) ? d.toWho.users : void 0
            }, a.shouldShowMessageLock = function () {
                var b, c, d;
                return 0 === (null != (b = a.message) ? b.toWho.teams.length : void 0) || (null != (c = a.getAddressedUsers()) ? c.length : void 0) > 0 && (null != (d = a.message) ? d.toWho.teams.length : void 0) > 0
            }, a.getThread = function () {
                var b, c;
                return null != (null != (c = a.message) ? c.events : void 0) ? (b = a.replies.concat(a.message.events), _.sortBy(b, function (a) {
                    return a.updatedAt
                })) : a.replies
            }, a.resizeContainer = function () {
                return i(function () {
                    switch (a.source) {
                    case "model":
                        return l.resize(l.opened);
                    case "popover":
                        return j.resize("activity-popover")
                    }
                }, 0)
            }, a.showAllReplies = function () {
                return a.allRepliesShown = !0, a.resizeContainer()
            }, a.fetchAllReplies = function (a, b) {
                var c = this;
                return d.fetchAll("Reply", {
                    url: "/v1/messages/" + a.id + "/replies",
                    dependencies: ["Author"],
                    success: function (a) {
                        var d;
                        return d = a.models, c.allRepliesShown = !1, c.replyCount += c.getNewReplyCount(), c.replies = d, "function" == typeof b ? b() : void 0
                    }
                })
            }, a.displayUpdates = function () {
                var a;
                return delete this.message.isNew, this.maxVisibleReplyCount += this.getNewReplyCount(), this.replyCount += this.getNewReplyCount(), this.replies = null != (a = this.message) ? a.replies.slice() : void 0
            }, m = null, a.markOnMouseEnter = function () {
                return a.clearMarkedDelay(), m = i(function () {
                    return a.markMessage("read")
                }, 1500)
            }, a.clearMarkedDelay = function () {
                return null != m ? clearTimeout(m) : void 0
            }, a.markMessage = function (d, f) {
                var g, h = this;
                return null != f && f.stopPropagation(), "read" !== d && "unread" !== d || this.message.read && "read" === d || !this.message.read && "unread" === d ? void 0 : (g = "read" === d, this.message.read = g, b.$broadcast("messageWasMarked", a.message), e.markMessages({
                    messageIds: [this.message.id],
                    read: g,
                    success: function (a) {
                        return c.updateUnreadCounts(a.response.meta.unread_counts)
                    },
                    error: function () {
                        return h.message.read = !g
                    }
                }))
            }, a.expandMessage = function (c) {
                return null != c && c.preventDefault(), a.isExpanded = !0, null != a.isPopover && b.$broadcast("messageExpanded"), a.resizeContainer()
            }, a.toggleExpandMessage = function () {
                return a.isExpanded ? a.isExpanded = !1 : a.expandMessage()
            }, a.toggleExpandMessageHTML = function () {
                return a.isExpandedHTML = !a.isExpandedHTML
            }, a.displayReplyImage = function (a, c, d) {
                var e;
                return null != a && a.preventDefault(), e = d.images[c], b.$broadcast("showImageModal", e.sizes.original, e.filename)
            }, a.displayReplyImageLink = function (a, c) {
                return null != a && a.preventDefault(), b.$broadcast("showImageModal", c.imageLink.url, c.imageLink.url)
            }, a.toggleReplies = function () {
                var c;
                return c = function () {
                    return a.fadeOutRepliesUnread = !0, a.message.repliesAreMarkedAsRead = !0, a.repliesAreExpanded = !a.repliesAreExpanded, a.sidebarsAreExpanded = !1, a.footerSection = a.repliesAreExpanded ? "replies" : "", null != a.isPopover && b.$broadcast("messageExpanded"), i(function () {
                        return a.repliesAreExpanded ? a.$broadcast("repliesExpanded") : void 0
                    }), a.resizeContainer()
                }, d.count("Reply", {
                    messageId: a.message.id,
                    sidebarId: {
                        $exists: !1
                    }
                }) !== a.replyCount ? a.fetchAllReplies(a.message, function () {
                    return c()
                }) : c()
            }, a.toggleSidebars = function () {
                return a.fadeOutRepliesUnread = !0, this.message.sidebarsAreMarkedAsRead = !0, this.sidebarsAreExpanded = !this.sidebarsAreExpanded, this.repliesAreExpanded = a.sidebarFormIsVisible = !1, a.$broadcast("resetSidebarForm"), a.sidebarButtonIsActive = !0, a.footerSection = a.sidebarsAreExpanded ? "sidebars" : "", null != a.isPopover && b.$broadcast("messageExpanded"), a.resizeContainer()
            }, a.deleteReply = function (b, c, e) {
                var f, g, h;
                return this.replyOptions = {}, this.replyOptions.url = null != c ? "/v1/messages/" + b.id + "/sidebars/" + c.id + "/replies/" + e.id : "/v1/messages/" + b.id + "/replies/" + e.id, this.replyOptions.success = function () {
                    return null == c && a.message.numReplies--, null != c && 0 === c.replies.length ? d.remove("Sidebar", c.id) : void 0
                }, d["delete"]("Reply", e.id, this.replyOptions), g = null != c ? c.replies : a.replies, f = _(g).indexOf(e), [].splice.apply(g, [f, f - f + 1].concat(h = [])), h
            }, a.deleteSidebar = function (a, b) {
                return d["delete"]("Sidebar", b.id, {
                    url: "/v1/messages/" + a.id + "/sidebars/" + b.id
                })
            }, a.viewImage = function (a) {
                return b.$broadcast("showImageModal", this.message.images[a].sizes.original, this.message.images[a].filename)
            }, a.setFollowUp = function () {
                return this.isFollowed() ? this.unFollowUp() : this.createFollowUp()
            }, a.createFollowUp = function () {
                var a = this;
                return this.message.userFollowed = !0, this.updatingFollowup = !0, this.markMessage("read"), e.createFollowup({
                    message: this.message,
                    error: function () {
                        return b.$broadcast("showError", "Failed to follow up on this message. Please try again.")
                    },
                    complete: function () {
                        return a.updatingFollowup = !1
                    }
                })
            }, a.unFollowUp = function () {
                var a = this;
                return this.message.userFollowed = !1, this.updatingFollowup = !0, this.markMessage("read"), d["delete"]("FollowUp", "followup-" + this.message.id, {
                    url: "/v1/users/me/follow_ups/" + this.message.id,
                    success: function () {
                        return b.$broadcast("hidePopover", "followup-popover")
                    },
                    error: function () {
                        return b.$broadcast("showError", "Failed to remove follow up. Please try again.")
                    },
                    complete: function () {
                        return a.updatingFollowup = !1
                    }
                })
            }, a.showAddressedUsers = function (b) {
                var c, d, e, f;
                return null != b && b.stopPropagation(), j.hideAll(), c = (null != (d = a.message) ? d.toWho.contextUsers.length : void 0) > 0 ? null != (e = a.message) ? e.toWho.contextUsers : void 0 : null != (f = a.message) ? f.toWho.users : void 0, j.show("user-list-popover", $(b.target), {}, {
                    content: c
                })
            }, a.setHighFive = function (b, c) {
                var d;
                return null != b && b.stopPropagation(), d = !1, c.userHighFived ? (c.userHighFived = !1, c.numHighFives--, d = !0) : (c.userHighFived = !0, c.numHighFives++), e.setHighFive({
                    target: c,
                    remove: d
                }), "Message" === c.constructor.typeName ? a.markMessage("read") : void 0
            }, a.toggleSidebarForm = function () {
                return a.$broadcast("resetSidebarForm"), a.sidebarFormIsVisible = !a.sidebarFormIsVisible, i(function () {
                    return a.sidebarButtonIsActive = !1
                }, 200)
            }, a.goToObject = function () {
                var b, e, f, g, h, i, j, k, l;
                if (h = this.message.authorType, "user" === h && null == this.message.viaApp) return c.goToUser(this.message.author);
                if ("application" === h || "user" === h && null != this.message.viaApp) {
                    if (this.message.mentions.length > 0) {
                        if (g = this.message.author, "application" === this.message.authorType) e = g.id, i = g.baseUri;
                        else {
                            if (null == this.message.viaApp) return;
                            e = this.message.viaApp.id, i = this.message.viaApp.baseUri
                        }
                        return b = d.findOne("Application", e), f = this.message.mentions[0], j = i.substring(0, i.indexOf("/", 8)), k = j + "/" + f.data.url, l = a.message.toWho.teams[0], c.goToApp(b, l, {
                            redirect: k
                        })
                    }
                    return l = this.message.toWho.teams.length > 0 ? this.message.toWho.teams[0] : void 0, c.goToApp(this.message.author, l)
                }
            }, a.setUnreadSince = function (b) {
                return null == b && (b = 0), i(function () {
                    return a.message.unreadSince = +new Date / 1e3
                }, b)
            }, a.addUserToAddressBook = function () {
                return null != this.message && this.message.author.id ? e.addContact({
                    data: {
                        emails: [this.message.author.userEmail]
                    },
                    error: function () {
                        return b.$broadcast("showError", "Failed to add user to address book")
                    }
                }) : void 0
            }, a.blockSender = function () {
                return e.blockContact({
                    data: {
                        user_id: this.message.author.id
                    },
                    error: function () {
                        return b.$broadcast("showError", "Failed to block user")
                    }
                })
            }, a.toggleMessageImagesExpanded = function () {
                return a.messageImagesExpanded = !a.messageImagesExpanded, "modal" === a.source ? setTimeout(function () {
                    return l.resize()
                }, 150) : void 0
            }, a.showDomain = function (a) {
                var b;
                return g.capitalize((null != (b = g.validateUrl(a)) ? b.name : void 0) || "")
            }, a.resetMessage()
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("AddMessageUsersController", ["$scope", "$timeout", "util", "store", "popover", "keys", "context", "api",
        function (a, c, d, e, f, g, h, i) {
            return a.reset = function () {
                return a.addedUsers = [], a.allowedUsers = [], a.addUserQuery = null, a.isLoading = !1
            }, a.$on("popoverWasShown", function (b, c, d) {
                return a.reset(), "add-message-users" === c ? (a.message = d, a.getAvailableUsers()) : void 0
            }), a.$on("popoverWasHidden", function () {
                return a.reset()
            }), a.addUsersToMessage = function () {
                var b, c, d, g;
                if (0 !== a.addedUsers.length) {
                    for (a.isLoading = !0, g = a.addedUsers, c = 0, d = g.length; d > c; c++) b = g[c], a.message.toWho.teams.length > 0 ? i.addUserToSubTeamMessage({
                        messageId: a.message.id,
                        data: {
                            user_id: b.id
                        },
                        success: function (b) {
                            var c, d;
                            return a.isLoading = !1, c = b.data[0].event, null != c && (d = c.user_added.id, e.save("MessageEvent", c), a.message.userContext.push(d)), a.addedUsers = [], a.$broadcast("resetTagInput")
                        }
                    }) : i.addUserToMessage({
                        messageId: a.message.id,
                        data: b.isEmail ? {
                            email: b.name
                        } : {
                            user_id: b.id
                        },
                        success: function (b) {
                            var c, d;
                            return a.isLoading = !1, c = b.data[0].event, null != c && (d = c.user_added.id, e.save("MessageEvent", c), a.message.addressedUsers.push(d), a.allowedUsers.push(e.findOne("User", d))), a.addedUsers = [], a.$broadcast("resetTagInput")
                        }
                    });
                    return f.hide()
                }
            }, a.addEmailUserKeydown = function (c, d) {
                var e, f;
                return g = function () {
                    var a, b, c, d;
                    for (c = ["SPACE", "SEMICOLON", "COMMA", "ENTER", "TAB"], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(g[e]);
                    return d
                }(), f = c.which, b.call(g, f) >= 0 && a.addEmailUser(d)
            }, a.addEmailUser = function (b) {
                return d.validateEmail(b) ? (e.fetchAll("User", {
                    url: "v1/users/" + b,
                    success: function (b) {
                        return a.addedUsers.push(e.findOne("User", b.data[0].id))
                    },
                    error: function () {
                        return a.addedUsers.push({
                            name: b,
                            isEmail: !0
                        })
                    }
                }), !0) : !1
            }, a.getAvailableUsers = function () {
                var c, d, f, g, j, k, l, m, n, o;
                if (a.message.toWho.teams.length > 0) {
                    for (m = a.message.toWho.teams, o = [], g = 0, k = m.length; k > g; g++) {
                        for (f = m[g], d = e.find("TeamMembership", {
                            teamId: f.id,
                            userId: {
                                $not: h.currentUser.id
                            }
                        }), j = 0, l = d.length; l > j; j++) c = d[j], n = c.user, b.call(a.allowedUsers, n) < 0 && a.allowedUsers.push(c.user);
                        0 === d.length ? (a.isLoading = !0, o.push(i.fetchTeamMemberships({
                            team: f,
                            success: function (d) {
                                var e, f, g, i;
                                for (g = d.models, e = 0, f = g.length; f > e; e++) c = g[e], c.user.id !== h.currentUser.id && (i = c.user, b.call(a.allowedUsers, i) < 0) && a.allowedUsers.push(c.user);
                                return a.isLoading = !1
                            }
                        }))) : o.push(void 0)
                    }
                    return o
                }
            }, a.getAllowedUsers = function () {
                var b, c;
                return a.message.toWho.teams.length > 0 ? a.allowedUsers : (b = [], null != a.message && "user" === a.message.authorType && b.push(a.message.author), a.allowedUsers = _.difference(h.currentUser.connectedUsers, null != (c = a.message) ? c.toWho.users : void 0, b), a.allowedUsers)
            }
        }
    ]), a.controller("MessageActionsController", ["$rootScope", "$scope", "popover", "store", "context", "api",
        function (a, b, c, d, e, f) {
            return b.$on("popoverWasShown", function (a, c, d) {
                return b.reset(), "message-actions" === c ? b.message = d : void 0
            }), b.reset = function () {
                return b.message = null
            }, b.setMessageMute = function () {
                return this.message.isMuted ? this.unmuteMessage() : this.muteMessage()
            }, b.muteMessage = function () {
                return b.message.isMuted = !0, b.message.read = !0, b.message.repliesAreMarkedAsRead = !0, c.resize("message-actions"), f.muteUnmuteMessage({
                    messageIds: [this.message.id],
                    isMuted: !0,
                    read: !0,
                    success: function (a) {
                        return e.updateUnreadCounts(a.response.meta.unread_counts)
                    }
                })
            }, b.unmuteMessage = function () {
                return b.message.isMuted = !1, b.message.read = !1, c.resize("message-actions"), f.muteUnmuteMessage({
                    messageIds: [this.message.id],
                    isMuted: !1,
                    read: !1,
                    success: function (a) {
                        return e.updateUnreadCounts(a.response.meta.unread_counts)
                    }
                })
            }, b.getMuteText = function () {
                var a;
                return (null != (a = this.message) ? a.isMuted : void 0) ? "Unmute Message" : "Mute Message"
            }, b.deleteMessage = function () {
                var c;
                return c = "Team" === e.selectedObjectType ? "/v1/teams/" + e.selectedTeam.id + "/messages/" + b.message.id : b.message.author.id === e.currentUser.id ? "/v1/messages/" + b.message.id : null, null != c ? (a.$broadcast("messageWasDeleted", b.message), d.remove("ActivityEvent", {
                    messageId: b.message.id
                }), d["delete"]("Message", b.message.id, {
                    url: c
                })) : void 0
            }
        }
    ]), a.controller("AddSidebarMemberController", ["$rootScope", "$scope", "popover", "context",
        function (a, b, c, d) {
            return b.$on("popoverWasShown", function (a, c, d) {
                return "add-sidebar-member-popover" === c ? (b.allowedUsers = d.allowedUsers, b.messageId = d.messageId) : void 0
            }), b.$on("popoverWasHidden", function (a, c) {
                return "add-sidebar-member-popover" === c ? b.reset() : void 0
            }), b.reset = function () {
                return b.addedUsers = [], b.allowedUsers = [], b.addUserQuery = "", b.messageId = null, b.$broadcast("resetTagInput")
            }, b.isCurrentUser = function (a) {
                return a.id !== d.currentUser.id
            }, b.addUsersToSidebar = function () {
                return a.$broadcast("addMembersToSidebar", b.addedUsers, this.messageId), c.hide()
            }, b.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("NavController", ["$scope", "context", "api", "store",
        function (a, b, c, d) {
            return a.notifications = d.findWithPersistence("Notification"), a.getUnreadMessages = function () {
                return d.find("Message", {
                    tags: {
                        $contains: "_inbox"
                    },
                    read: !1
                })
            }, a.$on("contextDidChange", function () {
                return null != b.selectedTeam ? c.fetchTeamMemberships({
                    team: b.selectedTeam
                }) : void 0
            }), a.isItemCurrentUser = function (a) {
                return a.id !== b.currentUser.id
            }, a.searchGoToObject = function (a) {
                return b.goToObject(a)
            }, a.isFetchingConnections = !1
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("NotificationController", ["$rootScope", "$scope", "store", "context", "api",
        function (a, b, c, d, e) {
            return b.acceptingInvite = !1, b.performAction = function (a, b, c) {
                if (a.stopPropagation(), "function" != typeof this[b]) throw "Notification button action " + b + " does not exist.";
                return this[b](c)
            }, b.acceptTeamInvite = function (c) {
                return null == c && (c = null), b.acceptingInvite = !0, c.isWaiting = !0, e.acceptTeamInvite({
                    email: d.currentUser.primaryEmail.address,
                    teamId: this.notification.team.id,
                    success: function () {
                        return e.fetchAllTeams({
                            success: function () {
                                return e.fetchTeamMemberships({
                                    team: b.notification.team
                                })
                            }
                        }), e.fetchAllApplications(), b.removeNotification(), b.$emit("teamInviteWasAccepted")
                    },
                    complete: function () {
                        return b.acceptingInvite = !1, c.isWaiting = !1, a.$broadcast("hideDropdown")
                    }
                })
            }, b.declineTeamInvite = function () {
                return this.notification.declinedOnce = !0, this.notification.buttons[0].action = "confirmedDeclineTeamInvite"
            }, b.confirmedDeclineTeamInvite = function (f) {
                var g = this;
                return null == f && (f = null), b.acceptingInvite = !0, f.isWaiting = !0, e.declineTeamInvite({
                    email: d.currentUser.primaryEmail.address,
                    teamId: this.notification.team.id,
                    userId: d.currentUser.id,
                    success: function () {
                        return c.remove("PendingMembership", {
                            teamId: g.notification.team.id,
                            userId: d.currentUser.id
                        }), c.remove("Notification", g.notification.id), b.$emit("teamInviteWasDeclined")
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to cancel the invite. Please try again.")
                    },
                    complete: function () {
                        return b.acceptingInvite = !1, f.isWaiting = !1, a.$broadcast("hideDropdown")
                    }
                })
            }, b.removeNotification = function () {
                return c.remove("Notification", b.notification.id)
            }, b.confirmedDeclineAppDevInvite = function (c) {
                return null == c && (c = null), e.removeDeveloperFromApplication({
                    applicationId: this.notification.app.id,
                    userId: d.currentUser.id,
                    success: function () {
                        return b.removeNotification()
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to cancel the invite. Please try again.")
                    }
                })
            }, b.acceptAppDevInvite = function (e) {
                return null == e && (e = null), c.update("User", d.currentUser.id, {
                    confirm: !0
                }, {
                    url: "/v1/applications/" + this.notification.app.id + "/developers/" + d.currentUser.id + "/confirm",
                    success: function () {
                        return b.removeNotification(), "app-dev" === d.selectedPage ? c.fetchAll("Application", {
                            url: "/v1/users/me/applications/developer"
                        }) : void 0
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to accept the invite. Please try again.")
                    }
                })
            }, b.acceptPendingMessage = function (d) {
                var f, g;
                return null == d && (d = null), g = b.notification.user, f = b.notification.messageId, e.addContact({
                    data: {
                        emails: [g.email || g.primaryEmail.address]
                    },
                    success: function () {
                        return c.fetchAll("Message", {
                            dependencies: ["Author"],
                            url: "/v1/messages/" + f,
                            success: function () {
                                return c.findOne("Message", f).isNew = !0, b.removeNotification()
                            },
                            error: function () {
                                return a.$broadcast("showError", "Failed to retrieve message.")
                            }
                        })
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to add contact. Please try again.")
                    }
                })
            }, b.viewPendingMessage = function (c) {
                return null == c && (c = null), b.ignoreNotification(), d.goToMessage(b.notification.messageId), b.removeNotification(), a.$broadcast("hideDropdown")
            }, b.addContact = function (c) {
                var d;
                return null == c && (c = null), d = b.notification.user, e.addContact({
                    data: {
                        emails: [d.email || d.primaryEmail.address]
                    },
                    success: function () {
                        return b.removeNotification()
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to add contact. Please try again.")
                    }
                })
            }, b.blockContact = function (c) {
                var d;
                return null == c && (c = null), d = b.notification.user, e.blockContact({
                    data: {
                        user_id: d.id
                    },
                    success: function () {
                        return b.removeNotification()
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to block user")
                    }
                })
            }, b.ignoreNotification = function (c) {
                var d;
                return null == c && (c = null), d = b.notification.user, e.ignoreNotifications({
                    data: {
                        ignore: !0,
                        ids: [b.notification.id]
                    },
                    success: function () {
                        return b.removeNotification()
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to ignore contact. Please try again.")
                    }
                })
            }, b.notificationClick = function (a) {
                return null == a && (a = null), b.notification.clickToView ? b.viewPendingMessage() : void 0
            }, b.$watch("notification.userId", function (a) {
                var d;
                return null == (null != (d = b.notification) ? d.user : void 0) ? c.fetchOne("User", a) : void 0
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("NotificationsController", ["$rootScope", "$scope", "store",
        function (a, b, c) {
            return b.notifications = c.findWithPersistence("Notification")
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("OpenAppAsController", ["$rootScope", "$scope", "popover", "store",
        function (a, b, c, d) {
            return b.reset = function () {
                return b.availableTeams = [], b.application = null
            }, a.$on("popoverWasShown", function (a, c, e) {
                return "open-app-as-popover" === c ? (b.availableTeams = d.find("Team", e.teamIds), b.application = e) : void 0
            }), a.$on("popoverBeforeHide", function (a, c) {
                return "open-app-as-popover" === c ? b.reset() : void 0
            }), b.$watch("availableTeams.length", function () {
                return c.resize("open-app-as-popover")
            }), b.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ReplyController", ["$scope", "$rootScope", "context", "store", "util",
        function (a, b, c, d, e) {
            return a.resetReply = function () {
                return a.replyImagesExpanded = !1
            }, a.toggleReplyImagesExpanded = function () {
                return a.replyImagesExpanded = !a.replyImagesExpanded
            }, a.showDomain = function (a) {
                var b;
                return e.capitalize((null != (b = e.validateUrl(a)) ? b.name : void 0) || "")
            }, a.resetReply()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("ReplyFormController", ["$rootScope", "$scope", "store", "context", "util", "shiftUtil",
        function (a, b, c, d, e, f) {
            return this.isSubmittingReply = !1, b.attachmentRoute = "/v1/attachments", b.$on("isLoadingLinkPreview", function (a) {
                return a.stopPropagation(), b.$apply(function () {
                    return b.isLoadingPreview = !0
                })
            }), b.$on("finishLoadingLinkPreview", function (a) {
                return a.stopPropagation(), b.isLoadingPreview = !1
            }), b.$on("focusedInTextarea", function () {
                return b.focused = !0, b.attachmentBarIsVisible = !0
            }), b.$on("clickedOnAttachment", function () {
                return b.attachmentBarIsVisible = !0
            }), b.replyFormReset = function () {
                return this.replyAttributes = {}, this.replyOptions = {}, this.linkData = null, this.isLoadingPreview = !1, this.messageText = "", this.isExpanded = !1, this.replyAttachments = [], this.focused = !1, this.attachmentBarIsVisible = !1, this.pendingAttachmentCount = 0, this.attachmentPreviews = [], b.$emit("refresh-popover")
            }, b.createReply = function (d, e) {
                var g, h, i, j, k, l = this;
                if (!this.isLoadingPreview && !this.isSubmittingReply && this.replyForm.$valid) {
                    for (h = f.parseStringToMentions(this.messageText), this.replyAttributes.mentions = h.mentions, this.replyAttributes.text = h.text || "", this.replyAttributes.attachments = [], k = this.replyAttachments, i = 0, j = k.length; j > i; i++) g = k[i], this.replyAttributes.attachments.push(g.data);
                    if (this.messageText || this.replyAttributes.attachments.length > 0) return this.isSubmittingReply = !0, this.replyOptions = {
                        success: function (c) {
                            var e;
                            return e = c.models, l.$broadcast("resetMessageInput", "reply"), l.$emit("submitReply", e[0]), l.$emit("scrollToBottom", ".activity-popover-content"), l.$emit("scrollToBottom", ".followup-popover-content"), a.$broadcast("updateMessage", d), b.preventMarkMessage || a.$broadcast("markMessageAsRead", d), null != b.isPopover ? a.$broadcast("messageExpanded") : void 0
                        },
                        complete: function () {
                            return l.isSubmittingReply = !1
                        }
                    }, this.replyOptions.url = null != e ? "/v1/messages/" + d.id + "/sidebars/" + e.id + "/replies" : "/v1/messages/" + d.id + "/replies", c.create("Reply", this.replyAttributes, this.replyOptions), this.replyFormReset()
                }
            }, b.replyFormReset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("RootController", ["$rootScope", "$scope", "context", "enums", "store", "title",
        function (a, b, c, d) {
            return a.context = c, a.enums = d, b.hideTopLevelAlert = function () {
                return b.$broadcast("hide-top-level-alert")
            }, a.$on("lockGlobal", function (a, c) {
                return b.isContainerExpanded = !c
            }), b.inApp = function () {
                return null != c.selectedApp
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("SidebarController", ["$scope", "$rootScope",
        function (a) {
            return a.replyPlaceholder = "Privately reply on this sidebar", a.replyObject = "sidebar-reply", Object.defineProperty(a, "thread", {
                get: function () {
                    return a.sidebar.replies
                }
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("SidebarFormController", ["$scope", "$rootScope", "context", "store", "util", "shiftUtil", "popover",
        function (a, b, c, d, e, f, g) {
            return a.isSubmittingSidebar = !1, a.loadingUsers = !1, a.attachmentRoute = "/v1/attachments", a.$on("isLoadingLinkPreview", function (b) {
                return b.stopPropagation(), a.$apply(function () {
                    return a.isLoadingPreview = !0
                })
            }), a.$on("finishLoadingLinkPreview", function (b) {
                return b.stopPropagation(), a.isLoadingPreview = !1
            }), a.$on("focusedInTextarea", function () {
                return a.attachmentBarIsVisible = !0
            }), a.$on("clickedOnAttachment", function () {
                return a.attachmentBarIsVisible = !0
            }), a.$on("resetSidebarForm", function () {
                return a.resetSidebarForm()
            }), a.$on("addMembersToSidebar", function (b, c, d) {
                return a.message && a.message.id === d ? a.sidebarMembers = _.union(a.sidebarMembers, c) : void 0
            }), a.resetSidebarForm = function () {
                return this.sidebarAttributes = {}, this.sidebarMembers = [], this.sidebarMemberQuery = {
                    name: ""
                }, this.messageText = "", a.sidebarAttachments = [], this.attachmentBarIsVisible = !1, this.pendingAttachmentCount = 0, this.focused = !1
            }, a.getSidebarData = function () {
                var b;
                return b = {
                    allowedUsers: a.allowedUsers,
                    messageId: a.message.id
                }
            }, a.showAddSidebarMembers = function (b) {
                return b.stopPropagation(), a.loadingUsers = !0, a.message.allAddressedUsers().then(function (c) {
                    return a.loadingUsers = !1, a.allowedUsers = _(c).chain().compact().uniq().value(), g.show("add-sidebar-member-popover", $(b.target), {}, {
                        content: {
                            allowedUsers: a.allowedUsers,
                            messageId: a.message.id
                        }
                    })
                })
            }, a.submitSidebar = function (b) {
                var c, e, g, h, i, j, k, l, m = this;
                if (!(this.isSubmittingSidebar || this.pendingAttachmentCount > 0)) {
                    for (this.isSubmittingSidebar = !0, e = _.pluck(this.sidebarMembers, "id"), g = f.parseStringToMentions(this.messageText), this.sidebarAttributes.mentions = g.mentions, this.sidebarAttributes.addressed_to = e, this.sidebarAttributes.text = g.text || "", this.sidebarAttributes.attachments = [], l = a.sidebarAttachments, j = 0, k = l.length; k > j; j++) c = l[j], this.sidebarAttributes.attachments.push(c.data);
                    if (this.messageText || this.sidebarAttributes.attachments.length > 0) return i = {
                        url: "/v1/messages/" + b.id + "/sidebars",
                        complete: function () {
                            return m.isSubmittingSidebar, a.$broadcast("resetMessageInput"), a.$emit("sidebarFormSubmitted"), a.resetSidebarForm()
                        }
                    }, h = d.create("Sidebar", this.sidebarAttributes, i)
                }
            }, a.resetSidebarForm()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("SingleMessageController", ["$scope", "$rootScope", "store", "context", "api", "enums",
        function (a, b, c, d, e, f) {
            return a.$watch("context.selectedMessage", function (b) {
                var c;
                return a.$broadcast("resetMessageScope"), a.message = b, null != b ? (a.messageWasDeleted = !1, a.$broadcast("expandMessage", b), a.$broadcast("markMessageAsRead", b), c = function () {
                    switch (d.selectedSubpage) {
                    case "normal":
                        return "toggleReplies";
                    case "sidebar":
                        return "toggleSidebars"
                    }
                }(), a.$broadcast(c, b)) : null === b ? a.messageWasDeleted = !0 : void 0
            }), a.$on("modalWasHidden", function () {
                return a.$broadcast("resetMessageScope")
            }), a.shouldShowAlertBar = function () {
                var b;
                return null != a.message && null != a.message.author && "user" === a.message.authorType && 0 === a.message.toWho.teams.length && d.currentUser.id !== a.message.authorRef && ((b = a.message.author.relationship) === f.RELATIONSHIP_TYPE.NONE || b === f.RELATIONSHIP_TYPE.ADDED_BY)
            }, a.reset = function () {
                return a.message = null, a.messageWasDeleted = !1
            }, a.addAuthorToContacts = function () {
                var d;
                return d = c.findOne("User", a.message.author.id), d.relationship = f.RELATIONSHIP_TYPE.PENDING_CONTACT, e.addContact({
                    data: {
                        emails: [a.message.author.userEmail]
                    },
                    error: function () {
                        return d = c.findOne("User", a.message.author.id), d.relationship = f.RELATIONSHIP_TYPE.NONE, b.$broadcast("showError", "Failed to add user to contact list")
                    }
                })
            }, a.blockAuthor = function () {
                var g, h;
                return h = c.findOne("User", a.message.author.id), g = h.relationship, c.save("User", {
                    id: h.id,
                    relationship: f.RELATIONSHIP_TYPE.BLOCKED
                }), e.blockContact({
                    data: {
                        user_id: a.message.author.id
                    },
                    success: function () {
                        return d.goToRoot()
                    },
                    error: function () {
                        return h = c.findOne("User", a.message.author.id), c.save("User", {
                            id: h.id,
                            relationship: g
                        }), b.$broadcast("showError", "Failed to block user")
                    }
                })
            }, a.reset()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("SingleMessageModalController", ["$scope", "$timeout", "modal",
        function (a, b, c) {
            return a.source = "modal", a.$on("modalWasShown", function (d, e) {
                return "single-message-modal" === e && (a.message = c.opened.options.data, null != a.message) ? (a.$broadcast("markMessageAsRead", a.message), b(function () {
                    return c.resize()
                }, 0)) : void 0
            }), a.$on("modalWasHidden", function (b, c) {
                return "single-message-modal" === c ? a.$broadcast("resetMessageScope") : void 0
            })
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Controllers"), a.controller("StreamController", ["$rootScope", "$timeout", "$location", "$scope", "store", "router", "api", "context",
        function (a, c, d, e, f, g, h, i) {
            return g.on("/(:section)", function (a) {
                return c(function () {
                    return e.selectedFilter = a || "inbox", e.resetAndFetch()
                })
            }), g.on("/teams/:teamId(/:section)", function (a, b) {
                return "inbox" === b ? (g.navigate("/teams/" + a), void 0) : c(function () {
                    return e.selectedFilter = b || "inbox", e.resetAndFetch()
                })
            }), g.on("/users/:userId", function () {
                return c(function () {
                    return e.resetAndFetch()
                })
            }), e.resetAndFetch = function () {
                return e.resetStreamController(), e.fetchMessages()
            }, e.$location = d, e.$watch("$location.$$search.q", function (a) {
                return null != a ? e.resetAndFetch() : void 0
            }), e.selectedFilter = "", e.messages = [], e.incomingMessages = [], e.unfilteredIncomingMessages = [], e.limit = 10, e.source = "stream", e.markLoading = !1, Object.defineProperty(e, "searchedQuery", {
                get: function () {
                    return d.search().q || ""
                }
            }), e.getUserUrl = function () {
                var a;
                return a = "v1/users/me/messages", "other" === e.selectedFilter && (a += "/_other"), a
            }, e.getMessageUrl = function () {
                var a, b, c, d;
                return c = i.selectedObjectType, a = e.selectedFilter, b = e.searchQuery, d = "Team" === c ? "v1/teams/" + i.selectedTeam.id + "/messages" : "User" === c ? e.getUserUrl() : null
            }, e.$watch("unfilteredIncomingMessages.length", function () {
                var a, c, d, g, h, j;
                if ("User" !== i.selectedObjectType || i.selectedUser === i.currentUser) return g = _.uniq(e.unfilteredIncomingMessages), a = function (a) {
                    var b;
                    return a.addressedTeams[0] === (null != (b = i.selectedTeam) ? b.id : void 0)
                }, j = function (a) {
                    var c;
                    switch (c = i.currentUser.id, e.selectedFilter) {
                    case "inbox":
                        return b.call(a.tags, "_other") < 0;
                    case "other":
                        return b.call(a.tags, "_other") >= 0;
                    case "direct":
                        return b.call(a.tags, "_direct") >= 0;
                    case "unread":
                        return !a.read;
                    case "sent":
                        return a.authorRef === c;
                    default:
                        return !1
                    }
                }, h = function (a) {
                    var b, c;
                    return b = a.addressedTeams || [], c = f.findOne("Team", b[0]), null != c ? !c.isMuted : !0
                }, c = function (a) {
                    return h(a) && j(a)
                }, d = _(g).filter(function (b) {
                    if (b.isMuted) return !1;
                    switch (i.selectedObjectType) {
                    case "User":
                        return c(b);
                    case "Team":
                        return a(b)
                    }
                }), e.incomingMessages = d
            }), e.$watch("incomingMessages.length", function () {
                return a.$broadcast("incomingMessagesDidChange", _(e.incomingMessages).pluck("id"))
            }), e.getQuery = function (a) {
                var b, c, f, g;
                return null == a && (a = (null != (g = e.messages) ? g.length : void 0) || 0), b = angular.copy(d.search()), b.limit = e.limit, b.offset = a, b.filter = e.selectedFilter, c = i.selectedObjectType, f = i.selectedUserIsCurrentUser, "User" !== c || f || (b.users = i.selectedUser.id, b.filter = "direct"), b.filter && "inbox" !== b.filter && "other" !== b.filter || delete b.filter, b
            }, e.fetchMessages = function (b) {
                var d, g;
                return null == b && (b = (null != (g = e.messages) ? g.length : void 0) || 0), e.isLoading ? void 0 : null === e.getMessageUrl() ? c(function () {
                    return e.fetchMessages()
                }, 50) : (e.isLoading = !0, d = e.selectedFilter, f.fetchAll("Message", {
                    url: e.getMessageUrl(),
                    query: e.getQuery(b),
                    dependencies: ["Author"],
                    success: function (a) {
                        var b, c, g, h, j, k, l;
                        if (e.selectedFilter === d) {
                            for (c = [], j = a.models, g = 0, h = j.length; h > g; g++) b = j[g], c = c.concat(b.userContext);
                            return c.length > 0 && f.fetchDependencies({
                                User: c
                            }), e.setMessages(e.messages.concat(a.models)), e.messages.length >= a.response.meta.total && (e.messageLoadingExhausted = !0), e.totalMessages = a.response.meta.total, i.updateUnreadCounts(null != (k = a.response) ? null != (l = k.meta) ? l.unread_counts : void 0 : void 0)
                        }
                    },
                    error: function () {
                        var b;
                        return b = i.selectedObjectType.toLowerCase(), a.$broadcast("showError", "Failed to get messages for the " + b + ".")
                    },
                    complete: function () {
                        return e.isLoading = !1
                    }
                }))
            }, e.setMessages = function (a) {
                return e.messages = _(a).chain().sortBy("updatedAt").unique(!0, function (a) {
                    return a.id
                }).value().reverse()
            }, e.displayIncomingMessages = function () {
                return e.setMessages(e.messages.concat(e.incomingMessages)), e.unfilteredIncomingMessages = []
            }, e.resetStreamController = function () {
                return e.messages = [], e.unfilteredIncomingMessages = [], e.isLoading = !1, e.messageLoadingExhausted = !1
            }, e.refreshStream = function () {
                return e.fetchMessages(0), e.$broadcast("displayUpdates")
            }, e.markMessageAsRead = function (a) {
                return e.$broadcast("markMessageAsRead", a)
            }, e.markAllMessagesRead = function () {
                return e.markLoading = !0, h.markAllMessagesAsRead({
                    success: function () {
                        return e.markLoading = !1
                    }
                })
            }, e.fetchMoreMessages = function () {
                return "main" === i.selectedPage ? e.messageLoadingExhausted || e.isLoading ? void 0 : e.$apply(function () {
                    return e.fetchMessages()
                }) : void 0
            }, e.$on("reloadStream", function () {
                return e.resetStreamController(), e.fetchMessages()
            }), e.$on("incomingMessage", function (a, b) {
                return e.unfilteredIncomingMessages.push(b)
            }), e.$on("messageWasDeleted", function (a, b) {
                var c;
                return c = e.messages.indexOf(b), c >= 0 ? e.messages.splice(c, 1) : void 0
            }), e.$on("streamRequiresUpdate", function () {
                return e.refreshStream()
            }), e.resetStreamController()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("TeamColorsController", ["$rootScope", "$scope", "shiftUtil",
        function (a, b, c) {
            return b.teamColorOptions = c.getTeamColors(), b.selectTeamColor = function (c, d) {
                return c.stopImmediatePropagation(), a.$broadcast("selected-team-color", b.teamColorOptions[d]), a.$broadcast("hidePopover")
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("TeamFormController", ["$rootScope", "$scope", "store", "util", "keys", "modal", "context", "enums", "api",
        function (a, b, c, d, e, f, g, h, i) {
            return b.$watch("context.selectedTeam", function () {
                return b.resetTeamForm(), null != g.selectedTeam ? (b.originalName = g.selectedTeam.name, b.teamName = g.selectedTeam.name, b.selectedColor = g.selectedTeam.color, b.selectedIcon = g.selectedTeam.icon) : void 0
            }), b.$on("selected-team-color", function (a, c) {
                return b.selectedColor = c, b.canSave = !0
            }), b.$on("selected-team-icon", function (a, c) {
                return b.selectedIcon = c, b.canSave = !0
            }), b.$watch("teamName", function (a) {
                return a !== b.originalName ? b.canSave = !0 : void 0
            }), b.resetTeamForm = function () {
                return b.previousMuteState = null, b.previousFavoriteState = null, b.teamLoading = !1, b.isLeavingTeam = !1, b.canSave = !1
            }, b.getTeamMute = function () {
                var a;
                return 1 === (null != (a = g.selectedTeam) ? a.isMuted : void 0) ? !0 : !1
            }, b.getTeamFavorite = function () {
                var a;
                return 1 === (null != (a = g.selectedTeam) ? a.isFavorite : void 0) ? !0 : !1
            }, b.toggleTeamMute = function () {
                return b.previousMuteState = g.selectedTeam.isMuted, g.selectedTeam.isMuted = 1 === g.selectedTeam.isMuted ? 0 : 1, i.muteUnmuteTeam({
                    teamId: g.selectedTeam.id,
                    data: {
                        is_muted: g.selectedTeam.isMuted
                    },
                    success: function () {
                        var a, b;
                        return b = "" + g.selectedTeam.id + "+" + g.currentUser.id, a = c.findOne("TeamMembership", b), a.isMuted = g.selectedTeam.isMuted, c.save("TeamMembership", a)
                    },
                    error: function () {
                        return a.$broadcast("showError", "There was an error skipping inbox.  Please try again."), g.selectedTeam.isMuted = b.previousMuteState
                    }
                })
            }, b.toggleTeamFavorite = function () {
                return i.toggleTeamFavorite({
                    teamId: g.selectedTeam.id,
                    isFavorite: g.selectedTeam.isFavorite ? 0 : 1
                })
            }, b.updateTeam = function () {
                var d;
                return b.teamLoading = !0, d = {
                    name: b.teamName,
                    color: b.selectedColor,
                    icon: b.selectedIcon
                }, c.update("Team", g.selectedTeam.id, d, {
                    success: function () {
                        return b.teamLoading = !1, a.$broadcast("showSuccess", "Team successfully updated.")
                    },
                    error: function () {
                        return a.$broadcast("showError", "There was an error saving your changes.  Please try again.")
                    }
                })
            }, b.checkLeave = function () {
                return g.currentUser.isAdminOfTeam() && 1 === g.selectedTeam.adminCount ? a.$broadcast("showError", "You must promote another admin before leaving the team.") : a.$broadcast("showDialog", {
                    message: "Are you sure you want to leave " + g.selectedTeam.name + "?",
                    confirmText: "Yes",
                    confirm: function () {
                        return b.$eval(b.leaveTeam())
                    }
                })
            }, b.deleteTeam = function () {
                return console.log("Deleting")
            }, b.leaveTeam = function () {
                return b.isLeavingTeam = !0, i.leaveTeam({
                    teamId: g.selectedTeam.id,
                    complete: function () {
                        return b.isLeavingTeam = !1
                    }
                })
            }, b.resetTeamForm()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("TeamIconsController", ["$rootScope", "$scope", "shiftUtil",
        function (a, b, c) {
            return b.teamIconOptions = c.getTeamIcons(), b.selectTeamIcon = function (c, d) {
                return c.stopImmediatePropagation(), a.$broadcast("selected-team-icon", b.teamIconOptions[d].id), a.$broadcast("hidePopover")
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("TeamsNavController", ["$scope", "store", "context", "api", "popover",
        function (a, b, c, d, e) {
            return a.pinnedTeamMemberships = b.findWithPersistence("TeamMembership", {
                userId: c.currentUser.id,
                isFavorite: 1
            }), a.unPinnedTeamMemberships = b.findWithPersistence("TeamMembership", {
                userId: c.currentUser.id,
                isFavorite: 0
            }), a.toggleFavorite = function (a) {
                return d.toggleTeamFavorite({
                    teamId: a.teamId,
                    isFavorite: a.isFavorite ? 0 : 1
                })
            }, a.createTeam = function (a) {
                var b;
                return a.stopImmediatePropagation(), b = $("#nav-teams-nav-button"), e.show("create-team-popover", b, {}, {
                    isFixed: !0
                })
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("TeamsPageController", ["$scope", "store", "router", "context", "api",
        function (a, b, c, d, e) {
            return a.teams = [], a.teamMemberships = [], c.on("/teams", function () {
                return null != d.selectedUser ? (a.teams = [], d.selectedUser.id === d.currentUser.id ? a.teamMemberships = b.findWithPersistence("TeamMembership", {
                    userId: d.currentUser.id
                }) : void 0) : void 0
            }), a.getTeams = function () {
                var b, c, d, e, f;
                for (e = a.teamMemberships, f = [], c = 0, d = e.length; d > c; c++) b = e[c], f.push(b.team);
                return f
            }, a.toggleTeamFavorite = function (a) {
                return e.toggleTeamFavorite({
                    teamId: a.id,
                    isFavorite: a.isFavorite ? 0 : 1
                })
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("UnreadMessagesController", ["$scope", "popover", "context", "initialize", "store",
        function (a, b, c, d, e) {
            return a.getUnreadMessages = function () {
                return e.find("Message", {
                    tags: {
                        $contains: "_inbox"
                    },
                    read: !1
                })
            }, a.authorImagePath = function (a) {
                return "application" === (null != a ? a.authorType : void 0) ? a.author.images[0].sizes.medium : a.author.image.icon
            }, a.viewAllMessages = function () {
                return c.goToRoot("inbox", {
                    filter: ""
                }), b.hide()
            }
        }
    ]), angular.module("SHIFT").config(["initializeProvider",
        function (a) {
            return a.init({
                priority: -10,
                invoke: ["store",
                    function (a) {
                        return a.fetchAll("Message", {
                            dependencies: ["Author"],
                            url: "v1/users/me/messages",
                            query: {
                                filter: "unread"
                            }
                        })
                    }
                ]
            })
        }
    ])
}.call(this),
function () {
    var a, b = {}.hasOwnProperty;
    a = angular.module("SHIFT.Controllers"), a.controller("UserFormController", ["$rootScope", "$scope", "$http", "util", "context", "store",
        function (a, c, d, e, f, g) {
            return c.notifyProperties = ["email_on_team_invite", "email_on_team_removed", "email_on_direct_message", "email_on_reply_to_your_direct_message", "email_on_reply_to_message_you_replied_to", "email_on_sidebar_message", "email_on_at_mention"], c.otherProperties = ["email_on_team_message", "email_on_shift_update"], c.resetSettingsForm = function () {
                var a, b, d, e, g, h, i;
                for (c.currentUser = f.currentUser, c.avatarRoute = "/v1/users/" + f.currentUser.id + "/images", c.userAttributes = {}, c.infoIsVisible = !0, c.selectedSection = "information", c.notifications = {}, c.isSavingForm = !1, c.emailIsInvalid = !1, c.passwordIsValid = !0, c.googleOAuthPop = null, c.googleWaiting = !1, c.facebookWaiting = !1, g = ["firstName", "lastName", "title", "password", "primaryEmail", "hasFacebook", "hasGoogle"], d = 0, e = g.length; e > d; d++) a = g[d], b = "", c.userAttributes[a] = "password" === a ? "" : "primaryEmail" === a ? null != (h = c.currentUser) ? h[a].address : void 0 : "hasFacebook" === a || "hasGoogle" === a ? 0 === c.currentUser[a] ? !1 : !0 : (null != (i = c.currentUser) ? i[a] : void 0) || b, null != c.userAttributes[a].length && (c.userAttributes[a] = c.userAttributes[a].slice());
                return c.oldPassword = "", c.confirmPassword = "", c.saveStatus = {}, c.setPreferences()
            }, c.checkPasswordMatch = function () {
                return c.passwordIsValid = c.userAttributes.password === c.confirmPassword, c.passwordError = c.passwordIsValid ? "" : "The two passwords do not match"
            }, c.setPreferences = function () {
                var a, b, d, e, g, h, i, j, k;
                for (b = f.currentUser.prefs, i = c.notifyProperties, d = 0, g = i.length; g > d; d++) a = i[d], c.notifications[a] = f.currentUser.prefs[a];
                for (j = c.otherProperties, k = [], e = 0, h = j.length; h > e; e++) a = j[e], k.push(c[a] = f.currentUser.prefs[a]);
                return k
            }, c.saveUserInfo = function () {
                return c.userForm.$valid ? (c.data = {
                    firstName: c.userAttributes.firstName || void 0,
                    lastName: c.userAttributes.lastName || void 0,
                    title: c.userAttributes.title || void 0
                }, c.userAttributes.password && (c.data.oldPassword = c.oldPassword, c.data.password = c.userAttributes.password), c.isSavingForm = !0, g.update("User", f.currentUser.id, c.data, {
                    success: function () {
                        return c.saveEmailPreferences()
                    },
                    error: function () {
                        return a.$broadcast("showError", "There was an issue saving, please try again."), c.isSavingForm = !1
                    }
                })) : void 0
            }, c.saveEmailPreferences = function () {
                var d, e, h, i, j, k;
                c.prefData = {}, j = c.notifications;
                for (d in j) b.call(j, d) && (e = j[d], c.prefData[d] = e);
                for (k = c.otherProperties, h = 0, i = k.length; i > h; h++) d = k[h], c.prefData[d] = c[d];
                return g.update("User", f.currentUser.id, {
                    prefs: c.prefData
                }, {
                    error: function () {
                        return a.$broadcast("showError", "There was an issue saving, please try again.")
                    },
                    complete: function () {
                        return c.isSavingForm = !1
                    },
                    success: function () {
                        return f.currentUser.prefs = angular.copy(c.prefData), a.$broadcast("showSuccess", "Account successfully updated.")
                    }
                })
            }, c.saveUserAvatar = function (a) {
                return c.currentUser.image = a[0].sizes
            }, c.avatarUploadSuccess = function (a) {
                return c.saveUserAvatar(a.result.data), c.saveStatus.user_avatar = "success"
            }, c.avatarUploadError = function () {
                return c.saveStatus.user_avatar = "error", a.$broadcast("showError", "There was an error uploading your photo. Please refresh and try again.")
            }, c.avatarUploadSubmit = function () {
                return c.saveStatus.user_avatar = "loading"
            }, c.isInvalid = function (a) {
                return a.$invalid && a.$dirty
            }, c.validateEmail = function (a) {
                return c.emailIsInvalid = !e.validateEmail(a), c.emailIsInvalid
            }, c.connectSocial = function (a) {
                return "facebook" === a && c.userAttributes.hasFacebook || "google" === a && c.userAttributes.hasGoogle ? void 0 : "facebook" === a ? c.facebookSignIn() : "google" === a ? c.googleSignIn() : void 0
            }, c.googleSignIn = function () {
                var b;
                return null == c.googleOAuthPop ? (c.googleOAuthPop = window.open("/v1/google/auth/redirect", "googOAuth", "width=800, height=600"), b = window.setInterval(function () {
                    var f, g;
                    try {
                        if (-1 !== c.googleOAuthPop.document.URL.indexOf("/v1/helpers/noop")) return window.clearInterval(b), g = c.googleOAuthPop.document.URL, c.googOAuthCode = e.getQueryString(g, "code"), c.googleOAuthPop.close(), c.googleWaiting = !0, f = {
                            code: c.googOAuthCode
                        }, d.post("/v1/google/auth/callback", f).success(function (b) {
                            var d;
                            return c.googleWaiting = !1, d = b.data[0].action, "linked" === d ? (c.googleWaiting = !1, c.userAttributes.hasGoogle = !0, a.$broadcast("showSuccess", "Your Google account was successfully connected.")) : a.$broadcast("showError", "There was an error connecting your Google account. Please try again later.")
                        }).error(function () {
                            return a.$broadcast("showError", "There was an error connecting your Google account. Please try again later.")
                        })
                    } catch (h) {}
                })) : void 0
            }, c.facebookSignIn = function () {
                return FB.getLoginStatus(function (a) {
                    return "connected" === a.status ? c.loginFacebook() : FB.login(function (a) {
                        return a.authResponse ? c.loginFacebook() : void 0
                    })
                })
            }, c.loginFacebook = function () {
                var b;
                return c.facebookWaiting = !0, b = {
                    facebook_user_id: FB.getUserID(),
                    access_token: FB.getAccessToken()
                }, d.post("/v1/facebook/callback", b).success(function (b) {
                    var d;
                    return d = b.data[0].action, "linked" === d ? (c.facebookWaiting = !1, c.userAttributes.hasFacebook = !0, a.$broadcast("showSuccess", "Your Facebook account was successfully connected.")) : a.$broadcast("showError", "There was an error connecting your Facebook account. Please try again later.")
                }).error(function () {
                    return a.$broadcast("showError", "There was an error connecting your Facebook account. Please try again later.")
                })
            }, c.resetSettingsForm()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("UserListController", ["$rootScope", "$scope", "popover", "api",
        function (a, b, c, d) {
            return b.reset = function () {
                return b.users = [], b.isLoading = !1
            }, b.reset(), b.$on("popoverWasShown", function (e, f, g) {
                return "user-list-popover" !== f || angular.isArray(g) ? b.users = g : (b.isLoading = !0, d.fetchAllHighFivers({
                    target: g,
                    success: function () {
                        var a, d, e, h, i;
                        for (d = [], i = g.highFives, e = 0, h = i.length; h > e; e++) a = i[e], d.push(a.user);
                        return b.users = d, c.resize(f)
                    },
                    error: function () {
                        return a.$broadcast("showError", "There was an error retrieving the list of users. Please try again"), c.hide()
                    },
                    complete: function () {
                        return b.isLoading = !1
                    }
                }))
            }), b.$on("popoverWasHidden", function () {
                return b.reset()
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("UserNavController", ["$rootScope", "$scope", "popover", "api", "context", "store", "util", "enums", "modal",
        function (a, b, c, d, e, f, g, h) {
            return b.resetUserNav = function () {
                return b.user = null, b.invitedAdmin = !1, b.membership = null
            }, b.$on("popoverWasShown", function (a, c, d) {
                var g;
                return "member-settings" === c ? (b.user = d, g = (b.user.pending ? "Pending" : "Team") + "Membership", b.membership = f.findOne(g, "" + e.selectedTeam.id + "+" + b.user.id), b.invitedAdmin = b.user.pending && b.membership.membershipType === h.MEMBERSHIP_TYPE.ADMIN) : void 0
            }), b.getAdminText = function () {
                var a;
                return (null != (a = b.user) ? a.isAdminOfTeam() : void 0) || b.invitedAdmin ? "Remove as admin" : "Promote to admin"
            }, b.getRemoveText = function () {
                var a, c;
                return (null != (a = b.user) ? a.id : void 0) === e.currentUser.id ? "Leave team" : (null != (c = b.user) ? c.id : void 0) === e.currentUser.id && 1 === e.selectedTeam.teamMemberships.length ? "Delete team" : "Remove from team"
            }, b.getConfirmText = function () {
                var a, c, d, f;
                return (null != (a = b.user) ? a.id : void 0) === e.currentUser.id ? "Are you sure you want to leave " + (null != (c = e.selectedTeam) ? c.name : void 0) + "?" : "Are you sure you want to remove " + (null != (d = b.user) ? d.name : void 0) + " from " + (null != (f = e.selectedTeam) ? f.name : void 0) + "?"
            }, b.setAdminRole = function () {
                var c, d;
                return (null != (d = b.user) ? d.isAdminOfTeam() : void 0) ? 1 === e.selectedTeam.adminCount ? a.$broadcast("showError", "You must have at least one admin on a team") : b.updateTeamMembership(h.MEMBERSHIP_TYPE.MEMBER) : (c = function () {
                    switch (b.membership.membershipType) {
                    case h.MEMBERSHIP_TYPE.ADMIN:
                        return h.MEMBERSHIP_TYPE.MEMBER;
                    case h.MEMBERSHIP_TYPE.MEMBER:
                        return h.MEMBERSHIP_TYPE.ADMIN
                    }
                }(), b.updateTeamMembership(c))
            }, b.updateTeamMembership = function (a) {
                var f, g;
                return b.user.pending ? (g = b.user.email, f = "PendingMembership") : (g = b.user.id, f = "TeamMembership"), d.updateTeamMembership({
                    email: b.user.email,
                    teamId: e.selectedTeam.id,
                    userId: g,
                    membershipType: a,
                    membership: f,
                    data: {
                        membership_type: a
                    },
                    success: function (a) {
                        var d;
                        return c.hide(), d = a.options, b.membership.membershipType = d.membershipType
                    }
                })
            }, b.checkRemove = function () {
                var d;
                return b.user.id === e.currentUser.id && e.currentUser.isAdminOfTeam() && 1 === e.selectedTeam.adminCount ? (a.$broadcast("showError", "You must promote another admin before leaving the team."), !1) : (d = b.user.id === e.currentUser.id ? b.leaveTeam : b.removeUser, a.$broadcast("showDialog", {
                    message: b.getConfirmText(),
                    confirmText: "Yes",
                    cancelText: "Cancel",
                    confirm: function () {
                        return b.$eval(d), c.hide()
                    },
                    cancel: function () {
                        return c.hide()
                    }
                }), !0)
            }, b.removeUser = function () {
                var c;
                return b.user.pending ? d.declineTeamInvite({
                    teamId: e.selectedTeam.id,
                    email: b.user.userEmail,
                    success: function () {
                        return f.remove("PendingMembership", {
                            teamId: e.selectedTeam.id,
                            userId: b.user.id
                        })
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to remove member from the team. Please try again.")
                    }
                }) : (c = f.findOne("TeamMembership", {
                    teamId: e.selectedTeam.id,
                    userId: b.user.id
                }), f["delete"]("TeamMembership", c.id, {
                    url: "/v1/teams/" + e.selectedTeam.id + "/users/" + b.user.id,
                    success: function () {
                        return a.$broadcast("showSuccess", "Successfully removed user from the team.")
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to remove member from the team. Please try again.")
                    }
                }))
            }, b.leaveTeam = function () {
                return d.leaveTeam({
                    teamId: e.selectedTeam.id
                })
            }, b.sendMessage = function () {
                return e.openMessageModal(b.user)
            }, b.openChat = function () {
                return a.$broadcast("createNewChat", [b.user])
            }, b.resetUserNav()
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Controllers"), a.controller("UsersPageController", ["$rootScope", "$scope", "$timeout", "store", "router", "context", "api",
        function (a, b, c, d, e, f, g) {
            return b.connections = d.findWithPersistence("Connection"), b.isLeavingTeam = !1, e.on("/teams/:teamId/connections", function () {
                return c(function () {
                    return b.reset()
                })
            }), b.reset = function () {
                return null != f.selectedTeam && f.currentUser.isAdminOfTeam() ? (b.pendingMemberships = [], g.fetchPendingTeamMemberships({
                    team: f.selectedTeam
                }), b.pendingMemberships = d.findWithPersistence("PendingMembership", {
                    teamId: f.selectedTeam.id
                })) : void 0
            }, b.getUsers = function () {
                return null != f.selectedTeam ? b.membersList() : []
            }, b.membersList = function () {
                var a, c, d, e, g, h;
                if (a = function () {
                    var a, b, d, e;
                    for (d = f.selectedTeam.teamMemberships, e = [], a = 0, b = d.length; b > a; a++) c = d[a], e.push(c.user);
                    return e
                }(), f.currentUser.isAdminOfTeam() && null != b.pendingMemberships) {
                    for (d = [], h = b.pendingMemberships, e = 0, g = h.length; g > e; e++) c = h[e], c.user.pending = !0, d.push(c.user);
                    return a.concat(d)
                }
                return a
            }, b.getPendingRole = function (a) {
                var b;
                if (f.selectedTeam) return b = d.findOne("PendingMembership", "" + f.selectedTeam.id + "+" + a.id), null != b && 1 === b.membershipType
            }, b.getNoUsersMessage = function () {
                var a, b;
                return "User" === f.selectedObjectType ? f.selectedUser === f.currentUser ? "You have no connections" : "" + (null != (a = f.selectedUser) ? a.name : void 0) + " has no connections" : "" + (null != (b = f.selectedTeam) ? b.name : void 0) + " has no members"
            }, b.checkLeaveTeam = function () {
                return b.isLeavingTeam ? void 0 : f.currentUser.isAdminOfTeam() && 1 === f.selectedTeam.adminCount ? (a.$broadcast("showError", "You must promote another admin before leaving the team."), !1) : (a.$broadcast("showDialog", {
                    message: "Are you sure you want to leave " + f.selectedTeam.name + "?",
                    confirmText: "Yes",
                    cancelText: "No",
                    confirm: function () {
                        return b.leaveTeam()
                    }
                }), !0)
            }, b.leaveTeam = function () {
                return b.isLeavingTeam = !0, g.leaveTeam({
                    teamId: f.selectedTeam.id,
                    complete: function () {
                        return b.isLeavingTeam = !1
                    }
                })
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftAttribute", function () {
        return {
            restrict: "A",
            link: function (a, b, c) {
                var d, e, f;
                return d = c.shiftAttribute, e = c.shiftAttributeCondition, f = c.shiftAttributeValue || !0, a.$watch(e, function (a) {
                    return a ? b.attr(d, f) : void 0
                })
            }
        }
    })
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftAutofillEnable", ["$timeout",
        function (a) {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function (b, c, d, e) {
                    return a(function () {
                        return e.$viewValue !== c.val() ? e.$setViewValue(c.val()) : void 0
                    }, 500)
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftAutogrow", ["$parse",
        function (a) {
            return {
                restrict: "A",
                link: function (b, c, d) {
                    var e;
                    return null != d.shiftAutogrowCallback && (e = a(d.shiftAutogrowCallback)), c.autosize({
                        append: "\n",
                        callback: function () {
                            return "function" == typeof e ? e(b) : void 0
                        }
                    }), b.$on("$destroy", function () {
                        return c.trigger("autosize.destroy")
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftChatIconGrid", ["$parse", "util",
        function () {
            return {
                restrict: "E",
                replace: !0,
                transclude: !0,
                templateUrl: "partials/directives/chat_icon_grid.html",
                link: function (a, b) {
                    var c, d, e, f, g, h, i, j, k, l;
                    for (c = a.chat, f = c.images, e = f.length, i = function (a) {
                        var b;
                        return 1 === e ? {
                            width: "100%",
                            height: "100%"
                        } : 2 === e ? {
                            width: "50%",
                            height: "100%"
                        } : 3 === e ? (b = 0 === a ? "100%" : "50%", {
                            width: b,
                            height: "50%"
                        }) : {
                            width: "50%",
                            height: "50%"
                        }
                    }, l = [], g = j = 0, k = f.length; k > j; g = ++j) d = f[g], h = i(g), l.push(b.append('<div class="avatar" style="background-image: url(' + d.icon + "); width: " + h.width + "; height: " + h.height + ';" />'));
                    return l
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftChatScrollDetector", function () {
        return function (a, b) {
            var c;
            return c = !0, a.$on("didResizeGlobal", function () {
                var d;
                return d = b.height() !== b.prop("scrollHeight"), d !== c && a.$emit(d ? "showChatUnreadHeader" : "hideChatUnreadHeader"), c = d
            })
        }
    })
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftClassOnEvent", function () {
        return function (a, b, c) {
            var d, e, f;
            return d = c.shiftClassOnEventAddOn, f = c.shiftClassOnEventRemoveOn, e = c.shiftClassOnEventClass, d && a.$on(d, function () {
                return b.addClass(e)
            }), f ? a.$on(f, function () {
                return b.removeClass(e)
            }) : void 0
        }
    })
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftConfirmDialog", ["$rootScope",
        function (a) {
            return function (b, c, d) {
                return c.on("click", function () {
                    var c, e, f, g, h, i;
                    return i = d.shiftConfirmMessage || "Are you sure?", c = d.shiftCancelText || "Cancel", f = d.shiftConfirmText || "Yes", e = d.shiftConfirmOn, g = d.shiftConfirmDisableOn, h = d.shiftConfirmDisabled, null != h && b.$eval(h) ? b.$apply(function () {
                        return b.$eval(g)
                    }) : a.$broadcast("showDialog", {
                        message: i,
                        confirmText: f,
                        cancelText: c,
                        confirm: function () {
                            return b.$eval(e), a.$broadcast("hidePopover")
                        },
                        cancel: function () {
                            return a.$broadcast("hidePopover")
                        }
                    }), !0
                })
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftDisableBgScroll", [
        function () {
            return {
                restrict: "A",
                link: function (a, b, c) {
                    var d, e;
                    return d = c.shiftDisableBgScrollName || c.shiftDisableBgScroll, e = function (a, b) {
                        var c, d, e;
                        return a.stopPropagation(), c = $(this).outerHeight(), d = this.scrollHeight, e = $(this).scrollTop(), (e >= d - c && 0 > b || 0 === e && b > 0) && a.preventDefault(), !0
                    }, b.on("mousewheel." + d, e), $(".scrollable", b).on("mousewheel." + d, e)
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftError", ["$rootScope", "$timeout",
        function (a, b) {
            return {
                scope: {},
                restrict: "E",
                replace: !0,
                transclude: !0,
                templateUrl: "partials/directives/error.html",
                link: function (c, d) {
                    var e;
                    return c.message = "", c.cssDelay = 200, e = null, a.$on("showError", function (a, b, d) {
                        return c.showAlert("error", b, d)
                    }), a.$on("showSuccess", function (a, b, d) {
                        return c.showAlert("success", b, d)
                    }), a.$on("showNotice", function (a, b, d) {
                        return c.showAlert("notice", b, d)
                    }), c.showAlert = function (a, f, g) {
                        var h, i;
                        return null == g && (g = {}), h = g.delay || 5e3, c.message = f, i = d.find(".flash"), i.removeClass("error success notice"), i.addClass(a), b(function () {
                            var a;
                            return a = -(i.width() / 2), i.css("margin-left", a), d.addClass("visible")
                        }, 50, !1), c.action = g.action ? function () {
                            return c.reset(), g.action()
                        } : null, g.noDelay ? void 0 : e = b(function () {
                            return d.removeClass("visible"), b(function () {
                                return c.reset()
                            }, c.cssDelay)
                        }, h, !1)
                    }, c.reset = function () {
                        return this.message = "", this.action = null, e = null
                    }, c.closeAlert = function () {
                        return null != e && b.cancel(e), d.removeClass("visible"), b(function () {
                            return c.reset()
                        }, c.cssDelay)
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftFlashFirstOnCreate", ["$timeout",
        function (a) {
            return function (b, c) {
                return b.$first ? a(function () {
                    return c.addClass("flash"), a(function () {
                        return c.removeClass("flash")
                    }, 200, !1)
                }, 50, !1) : void 0
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftFocusOnClick", ["$timeout",
        function (a) {
            return {
                restrict: "A",
                link: function (b, c, d) {
                    var e, f, g;
                    return null != d.focusParents && (g = d.focusParents), null != d.element && (e = d.element), null != d.focusGlobalElement && (f = d.focusGlobalElement), c.on("click", function (b) {
                        return b.preventDefault(), a(function () {
                            var a;
                            return null != f ? $(f).focus() : (a = null != g ? c.parents(g) : c, a.find(e).focus())
                        }, 50, !1)
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftFocusOnEvent", ["$timeout", "$window",
        function (a, b) {
            return function (c, d, e) {
                return c.$on(e.shiftFocusOnEvent, function () {
                    return a(function () {
                        var a, c;
                        return a = b.scrollX, c = b.scrollY, d.focus(), b.scrollTo(a, c)
                    }, 0, !1)
                })
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftGlobalResize", ["$rootScope", "popover",
        function (a, b) {
            return {
                restrict: "A",
                link: function (c, d) {
                    var e, f, g, h, i;
                    return h = null, f = !0, i = function () {
                        return clearInterval(h), d.addClass("show")
                    }, g = function (a) {
                        return null == a && (a = 500), clearInterval(h), h = setInterval(function () {
                            return b.popoverList.length ? void 0 : (d.removeClass("show"), clearInterval(h))
                        }, a)
                    }, d.on("mouseenter", function () {
                        return i()
                    }), d.on("mouseleave", function () {
                        return g()
                    }), e = function (a) {
                        return a ? d.removeClass("collapse") : (g(0), d.addClass("collapse"))
                    }, a.$on("lockGlobal", function (a, b) {
                        return f = b, e(b)
                    }), c.$on("popoverWasShown", function (a, b) {
                        return "chat-popover" !== b && "activity-popover" !== b || f ? void 0 : e(!0)
                    }), c.$on("popoverWasHidden", function (a, b) {
                        return "chat-popover" !== b && "activity-popover" !== b || f ? void 0 : d.addClass("collapse")
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftInfiniteScroll", ["$parse",
        function (a) {
            return {
                link: function (b, c, d) {
                    var e, f, g, h, i;
                    return g = null != d.shiftInfiniteScrollDocument, i = g ? angular.element(document) : c, e = angular.element(window), h = a(d.shiftInfiniteScroll), f = +(d.shiftInfiniteScrollOffset || 150), i.on("mousewheel", function () {
                        var a, c;
                        return a = i.height(), g && (a -= e.height()), c = i.scrollTop(), 0 === c && null != d.shiftInfiniteScrollMin && b.$apply(d.shiftInfiniteScrollMin), f > a - c && null != d.shiftInfiniteScroll && h(b), !0
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftLinkifyText", ["shiftUtil",
        function (a) {
            return function (b, c, d) {
                return b.$watch(d.shiftLinkifyText, function (b) {
                    var d, e, f, g, h;
                    for (c.empty(), g = a.parseStringToUrls(b), h = [], e = 0, f = g.length; f > e; e++) d = g[e], d.isLink ? h.push(c.append($("<a>" + d.text + "</a>").attr("href", d.text).attr("target", "_blank"))) : h.push(c.append($("<span>" + d.text + "</span>")));
                    return h
                })
            }
        }
    ])
}.call(this),
function () {
    var a = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    angular.module("SHIFT.Directives").directive("shiftMessageInput", ["$rootScope", "$filter", "$parse", "$timeout", "util", "keys", "api", "context", "store", "modal", "typeahead",
        function (b, c, d, e, f, g, h, i, j, k, l) {
            return {
                restrict: "E",
                replace: !0,
                templateUrl: "partials/directives/message_input.html",
                scope: {
                    isGlobal: "=shiftMessageInputIsGlobal",
                    isDisabled: "=shiftMessageInputNgDisabled",
                    model: "=shiftMessageInputNgModel",
                    attachmentsModel: "=shiftMessageInputAttachments",
                    pendingCount: "=shiftMessageInputAttachmentCount",
                    mentions: "=shiftMessageInputMentions",
                    onSubmit: "&shiftMessageInputOnSubmit"
                },
                compile: function (d, m) {
                    var n, o, p, q;
                    return p = m.shiftMessageInputType || "textarea", n = $("<" + p + " />"), o = $(".shift-message-inputarea", d), q = {
                        name: m.shiftMessageInputName || "inputText"
                    }, "input" === p && (q.type = "text"), m.shiftMessageInputNgDisabled && (q["ng-disabled"] = "isDisabled"), null != m.shiftMessageInputRequired && (q.required = !0), q["shift-typeahead"] = !0, q["mac-blur"] = "focusBlur($event, false)", q["mac-focus"] = "focusBlur($event, true)", null != m.shiftMessageInputAutogrow && angular.extend(q, {
                        "shift-autogrow": !0,
                        "shift-autogrow-callback": "onResize()"
                    }), n.attr(q).css({
                        lineHeight: "20px",
                        fontSize: "13px"
                    }).addClass("share-field message-input"), o.html(n),
                    function (d, n, q) {
                        var r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L;
                        return r = q.delay || 300, A = 800, B = null, L = null, s = null, x = 5, z = /\B@([\w\d]+\s{0,1}[\w\d-]*)/gi, C = /\B@([\w\d-]+)/gi, I = /\B@\{([\d\w-]+):([\d\w\s-]+)}\B/gi, y = [], t = q.shiftMessageInputDetectLink || !0, v = $(".share-field", n), u = $(".shift-message-display", n), o = $(".shift-message-inputarea", n), F = d.$parent[m.shiftMessageInputPlaceholder], F || (F = m.shiftMessageInputPlaceholder || "Send a message"), v.attr("placeholder", F), E = [], d.focused = !1, D = "", H = function () {
                            var a;
                            return s = null, d.inputText = "", d.storedText = "", d.attachmentRoute = "/v1/attachments", d.disableAttachment = null != q.shiftDisableAttachment, d.attachments = [], y = [], d.query = "", a = "disable", E = [], d.focused = !1, d.isLoadingLinkPreview = !1, v.val(d.inputText), d.updateDisplay(), $(".share-field", n).css("height", ""), l.reset(), b.$broadcast("disableConfirmOnLeave")
                        }, w = function () {
                            var a, b;
                            for (a = []; b = I.exec(d.storedText);) a.push({
                                id: b[1]
                            });
                            return a
                        }, J = function (a, b) {
                            var c, e, f;
                            for (e = [], f = null; c = a.exec(b);) e.push(c[1]);
                            return e.length > 0 && (f = _.difference(e, y)[0], null != f && (d.query = f, y = e)), {
                                query: f,
                                newMatches: e
                            }
                        }, K = function (a) {
                            var b, e, f, g, h;
                            return null == a && (a = d.query), e = w(), b = _.difference(d.peopleList, j.find("User", e)), E = c("filter")(b, {
                                name: a
                            }).slice(0, +(x - 1) + 1 || 9e9), 0 === E.length && d.inputText ? (h = J(C, d.inputText), g = h.query, f = h.newMatch, null != g ? K(g) : void 0) : (o = $(".shift-message-inputarea", n), l.show(o.parent(), {
                                people: E
                            }, {
                                onSelect: function (a) {
                                    return d.updateMentionObject(a), null != q.shiftMessageInputMentions ? d.mentions = w() : void 0
                                },
                                onHide: function () {
                                    return y = []
                                }
                            }))
                        }, G = function (a) {
                            return h.queryConnections({
                                query: a,
                                success: function (a) {
                                    return d.peopleList = a.users, K.apply(this)
                                }
                            })
                        }, v.on("keyup", function () {
                            var c, g, k, m, n, o, p, u, v, w, x, y, C, E, F, H, M, N, O, P, Q, R, S, T, U, V, W;
                            if (c = $(this), N = c.val(), N === D) return !0;
                            if (d.inputText = N, g = N ? "enable" : "disable", null != q.shiftMessageInputConfirmOnLeave && g !== m && (k = "" + g + "ConfirmOnLeave", b.$broadcast(k), m = g), !N) return d.$apply(function () {
                                return d.storedText = N, d.model = N, d.updateDisplay(), l.hide()
                            }), !0;
                            for (T = J(z, N), O = T.query, F = T.newMatches, null != O ? (null != L && e.cancel(L), L = e(function () {
                                var c, e, f, g, k, l, m, n, o;
                                switch (d.peopleList = [], g = q.shiftMessageInputObjType, "message" !== g && "search" !== g && "reply" !== g && "sidebar-reply" !== g && "sidebar" !== g && (g = d.$parent.$eval(g)), g) {
                                case "message":
                                case "search":
                                    if ("User" === i.selectedObjectType || d.isGlobal) return G(O);
                                    "Team" === i.selectedObjectType && (d.peopleList = i.selectedTeam.members);
                                    break;
                                case "reply":
                                    if (f = d.$parent.$parent.message, f.toWho.users.length > 0) return G(O);
                                    if (null != (k = f.toWho.teams[0])) {
                                        for (e = j.find("TeamMembership", {
                                            teamId: k.id
                                        }), l = 0, m = e.length; m > l; l++) c = e[l], n = c.user, a.call(d.peopleList, n) < 0 && d.peopleList.push(c.user);
                                        1 === e.length && h.fetchTeamMemberships({
                                            team: k,
                                            success: function (b) {
                                                var e, f, g, h;
                                                for (g = b.models, e = 0, f = g.length; f > e; e++) c = g[e], c.user.id !== i.currentUser.id && (h = c.user, a.call(d.peopleList, h) < 0) && d.peopleList.push(c.user);
                                                return K()
                                            }
                                        })
                                    }
                                    break;
                                case "sidebar-reply":
                                    d.peopleList = null != (o = d.$parent.$parent.sidebar) ? o.members : void 0;
                                    break;
                                case "sidebar":
                                    d.peopleList = d.$parent.sidebarMembers
                                }
                                return null == b.$$phase && b.$digest(), K()
                            }, r)) : l.hide(), H = N || ""; x = I.exec(d.storedText);)
                                if (C = x[2], n = null != (U = C.split(" ")) ? U[0] : void 0, v = null != (V = C.split(" ")) ? V[1] : void 0, o = RegExp("\\b" + n + "\\b(?!})", "g"), u = RegExp(":\\b" + n + "\\b", "g"), w = RegExp("\\b" + v + "(?!})", "g"), E = RegExp("\\b" + C + "\\b(?!})", "g"), null != n && null != v && E.test(H)) H = H.replace(E, x[0]);
                                else if (null != n && o.test(H) && !u.test(H)) {
                                if (y = "@{" + x[1] + ":" + n + "}", H = H.replace(o, y), null != v && !w.test(H)) {
                                    for (M = N.split(" "), R = D.split(" "), P = _.difference(M, R)[0], Q = RegExp("\\b" + P + "\\b\\s"), H = H.replace(Q, ""), p = S = W = M.length - 1; S >= 0; p = S += -1)
                                        if (M[p] === P) {
                                            M.splice(p, 1);
                                            break
                                        }
                                    c.val(M.join(" "))
                                }
                            } else null != v && w.test(H) && (y = "@{" + x[1] + ":" + v + "}", H = H.replace(w, y));
                            return d.storedText = H, d.updateDisplay(), null != B && e.cancel(B), B = e(function () {
                                return d.$apply(function () {
                                    return d.model = d.storedText
                                })
                            }, A), D = N, t ? (null != s && e.cancel(s), s = e(function () {
                                var a, b;
                                return (x = f.validateUrl(N)) && (d.isLoadingLinkPreview = !0, b = "", null != x.protocol && (b += x.protocol), null != x.subdomain && (b += "" + x.subdomain + "."), b += "" + x.name + "." + x.domain, b = encodeURIComponent(b), b += encodeURIComponent(x.path), a = decodeURIComponent(b), _(d.attachments).every(function (b) {
                                    var c, d;
                                    return "link" === (d = b.type) || "image-link" === d || "video" === d ? (c = b.data.url || b.data.data.url, c !== a) : !0
                                })) ? (d.attachments.push({
                                    data: {
                                        url: a
                                    },
                                    type: "link",
                                    isLoading: !0
                                }), h.getLinkInformation({
                                    query: {
                                        url: b
                                    },
                                    success: function (b) {
                                        var c, e, f, g, h, i, j;
                                        for (e = b.data[0], h = d.attachments, j = [], p = f = 0, g = h.length; g > f; p = ++f) {
                                            if (c = h[p], (null != (i = c.data) ? i.url : void 0) === a) {
                                                d.attachments[p] = {
                                                    data: e,
                                                    type: e.type,
                                                    isLoading: !1
                                                };
                                                break
                                            }
                                            j.push(void 0)
                                        }
                                        return j
                                    },
                                    error: function () {
                                        var b;
                                        return b = _(d.attachments).find(function (b) {
                                            var c;
                                            return (null != (c = b.data) ? c.url : void 0) === a
                                        }), b.isLoading = !1, b.data = {
                                            data: {
                                                url: a
                                            },
                                            type: "link",
                                            url: a
                                        }
                                    }
                                })) : void 0
                            }, r), !0) : !0
                        }), d.$on(q.shiftMessageInputFocusOnEvent, function () {
                            return e(function () {
                                return n.find(p).focus(), d.$emit("focusedInTextarea")
                            }, 200)
                        }), d.$on("modalWasHidden", function (a, b) {
                            return "compose-message-modal" === b && "composerText" === q.shiftMessageInputName ? H() : void 0
                        }), d.$on("resetMessageInput", function () {
                            return H()
                        }), d.$watch("attachments", function (a) {
                            return null != d.attachmentsModel ? (d.$emit("focusOnComposer"), d.attachmentsModel = a) : void 0
                        }, !0), null == m.shiftMessageInputAutogrow && v.on("mousewheel", function () {
                            return u.scrollTop($(this).scrollTop())
                        }), v.on("keypress", function (a) {
                            return null != q.shiftMessageInputOnSubmit && a.which === g.ENTER && (a.preventDefault(), d.$apply(function () {
                                return d.model = d.storedText, d.onSubmit({
                                    $event: a,
                                    text: d.storedText
                                })
                            })), !0
                        }), d.focusBlur = function (a, b) {
                            return b && (d.$emit("focusedInTextarea"), l.hide()), d.focused = b, !0
                        }, d.updateMentionObject = function (a) {
                            return null != a ? (d.storedText = d.storedText.replace("@" + d.query, "@{" + a.id + ":" + a.name + "} "), d.inputText = d.inputText.replace("@" + d.query, "" + a.name + " "), v.val(d.inputText), D = d.inputText, d.updateDisplay(), d.model = d.storedText) : void 0
                        }, $(window).on("resize", function () {
                            return d.updateDisplay()
                        }), d.updateDisplay = function () {
                            var a, b;
                            if ("input" !== m.shiftMessageInputType) {
                                for (a = _.escape(d.storedText); b = I.exec(d.storedText);) a = a.replace(b[0], "<b>" + b[2] + "</b>");
                                return u.html(a)
                            }
                        }, d.onResize = function () {
                            return k.opened && k.resize(), l.position(o.parent())
                        }, d.getPreviewByFileName = function (a) {
                            var b, c, e, f;
                            for (b = e = f = d.attachments.length - 1; e >= 0; b = e += -1)
                                if (c = d.attachments[b], c.fileName === a) return c
                        }, d.attachmentUploadSubmit = function (a, b) {
                            var c;
                            return null != q.shiftMessageInputAttachmentCount && d.pendingCount++, c = d.getPreviewByFileName(b.files[0].name), null != c ? c.isLoading = !0 : void 0
                        }, d.attachmentUploadSuccess = function (a) {
                            var b, c;
                            return null != q.shiftMessageInputAttachmentCount && d.pendingCount--, b = a.result.data[0], c = d.getPreviewByFileName(a.files[0].name), null != c ? (c.progress = 111, c.failedToUpload = !1, c.data = b, setTimeout(function () {
                                return d.$apply(function () {
                                    return c.isLoading = !1
                                })
                            }, 250)) : void 0
                        }, d.attachmentUploadError = function (a) {
                            return null != q.shiftMessageInputAttachmentCount && d.pendingCount--, d.attachments = _(d.attachments).reject(function (b) {
                                var c;
                                return b.fileName === (null != (c = a.files[0]) ? c.name : void 0)
                            })
                        }, d.removeAttachmentFromList = function (a, b) {
                            return a.isLoading && null != q.shiftMessageInputAttachmentCount && d.pendingCount--, d.attachments.splice(b, 1)
                        }, d.getImageSrc = function (a) {
                            var b;
                            return b = d.getAttachmentType(a), "image" === b ? a.fileData : "/images/file_icon.png"
                        }, d.getAttachmentType = function (a) {
                            var b;
                            return b = a.type, b.match(/image\/.*/) && !b.match(/photoshop|psd/) ? b = "image" : -1 !== b.indexOf("/") && (b = "file"), b
                        }, d.getAttachmentProgress = function (a) {
                            return {
                                width: .9 * a.progress
                            }
                        }, d.showDomain = function (a) {
                            var b;
                            return f.capitalize((null != (b = f.validateUrl(a)) ? b.name : void 0) || "")
                        }, H()
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftRenderText", ["$rootScope", "$compile", "$parse", "store", "context",
        function (a, b, c, d, e) {
            return {
                restrict: "A",
                translcude: "element",
                link: function (a, f, g) {
                    var h, i;
                    return i = g.shiftRenderTextHighlight, h = g.shiftRenderText || "message", a.$watch(h, function (j) {
                        var k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
                        if (null != j) {
                            if (k = c(h)(a), q = c(i)(a) || "", p = new RegExp(("(>[^<]*)(" + q + ")([^<.]*)").replace(/\s|\,/, "|"), "gi"), n = {}, u = /\B\{(\d+)}\B/gi, w = _.escape(k.text || ""), w = w.replace(/\n$/, "<br/>&nbsp;").replace(/\n/g, "<br/>"), z = /(http(s)?:&\#x2F;&\#x2F;){0,1}(?:(www|[\d\w\-]+)\.){0,1}([\d\w\-]+)\.([A-Za-z]{2,6})(:[\d]*){0,1}((?:&\#x2F;\/)?[\d\w\-\?\,\'\/\\\+&amp;%\$#!\=~\.]*){0,1}/gi, null != g.shiftRenderTextUrl) {
                                for (y = w; t = z.exec(w);) s = /http(s)?:&\#x2F;&\#x2F;/.test(t[0]) ? t[0] : "http:&#x2F;&#x2F;" + t[0], y = y.replace(t[0], '<a href="' + s + '" target="_blank">' + t[0] + "</a>");
                                w = y
                            }
                            if (null != k.mentions && k.mentions.length > 0)
                                for (; t = u.exec(w);) x = t[0], r = +t[1], null == g.shiftDisableRenderLink ? "user" === k.authorType && null == k.viaApp || null != k.sidebarId ? v = '<span class="mentioned-user" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="' + h + ".mentions[" + r + '].data.id" ng-click="context.goToUser(' + h + ".mentions[" + r + '].data.id)">{{' + h + ".mentions[" + r + "].name}}</span>" : ("application" === k.authorType || null != k.viaApp) && (v = '<span class="mentioned-user" ng-click="goToAppObj()">{{' + h + ".mentions[" + r + "].name}}</span>") : v = "{{" + h + ".mentions[" + r + "].name}}", w = w.replace(x, v);
                            for (m = /\B:([\w+\d]+):\B/gi; t = m.exec(w);) x = t[0], l = t[1], l in n && (o = "<span class='emoji' id='" + l + "' />", w = w.replace(x, o));
                            return w = w.replace(/\s\s/g, "&nbsp;&nbsp;"), w = "<span>" + w + "</span>", q && (w = w.replace(p, '$1<span class="search-highlight">$2</span>$3')), b(w)(a, function (b, g) {
                                return f.empty().append(b), g.goToAppObj = function () {
                                    var b, f, g, i, j, l, m, n;
                                    if (k = c(h)(a), m = (null != (n = k.toWho) ? n.teams[0] : void 0) || null, "application" === k.authorType) f = k.author.id, i = k.author.baseUri;
                                    else {
                                        if (null == k.viaApp) return;
                                        f = k.viaApp.id, i = k.viaApp.baseUri
                                    }
                                    return b = d.findOne("Application", {
                                        id: f
                                    }), k.mentions.length > 0 ? (g = k.mentions[0], j = i.substring(0, i.indexOf("/", 8)), l = j + "/" + g.data.url, e.goToApp(b, m, {
                                        redirect: l
                                    })) : void 0
                                }
                            })
                        }
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftScrollToEdge", ["$timeout",
        function (a) {
            return {
                restrict: "A",
                link: function (b, c, d) {
                    var e;
                    return e = parseInt(d.shiftScrollDelay) || 0, b.$on("scrollToTop", function (b, d) {
                        return null != d && c.is(d) ? a(function () {
                            return $(c).animate({
                                scrollTop: 0
                            }, e)
                        }, 0) : void 0
                    }), b.$on("scrollToBottom", function (b, f) {
                        return null == f || c.is(f) ? a(function () {
                            return $(c).animate({
                                scrollTop: $(c).prop("scrollHeight")
                            }, e)
                        }, parseInt(d.shiftScrollToEdgeTimeout, 10) || 0) : void 0
                    }), b.$on("scrollToTopBody", function () {
                        return a(function () {
                            return $("html, body").animate({
                                scrollTop: 0
                            }, e)
                        }, 0)
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftScrollToItem", ["$timeout",
        function (a) {
            return function (b, c, d) {
                var e, f, g, h, i;
                if (e = d.shiftScrollToItemCondition, g = d.shiftScrollToItemEvent || "scrollToItem", f = d.shiftScrollToItemDelay || 0, i = d.shiftScrollToItemTimeout || 0, h = null != d.shiftScrollToItemFindParent ? c.parents("[shift-scroll-to-item-parent]").first() : c.parent(), null == e) throw new Error("shiftScrollToItem directive declared without a condition. Please specify a condition with the shift-scroll-to-item-condition attribute. Refer to documentation for more information.");
                return b.$on(g, function () {
                    return a(function () {
                        return b.$eval(e) ? h.animate({
                            scrollTop: c.position().top
                        }, f) : void 0
                    }, i)
                })
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftSearch", ["$filter", "$parse", "$timeout", "store", "context", "api", "keys", "typeahead",
        function (a, b, c, d, e, f, g, h) {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (i, j, k, l) {
                    var m, n, o, p, q, r, s, t, u;
                    return q = [], u = [], p = 4, m = null, n = null != k.shiftSearchDisablePeople, t = null != k.shiftSearchShowQuery, r = function () {
                        return q = [], u = [], null != m && c.cancel(m), j.val("")
                    }, r(), s = function (a) {
                        var c;
                        return null != k.shiftSearchIsLoading ? (c = b(k.shiftSearchIsLoading).assign, c(i, a)) : void 0
                    }, o = function () {
                        return null == k.shiftSearchDisableTeams ? !1 : b(k.shiftSearchDisableTeams)(i)
                    }, i.$on("resetSearch", function () {
                        return r()
                    }), i.$on("contextDidChange", function () {
                        return r()
                    }), j.on("keyup", function (a) {
                        return a.which === g.ESCAPE && r(), !0
                    }), l.$parsers.push(function (g) {
                        var l;
                        return null != m && clearTimeout(m), g ? (l = function () {
                            var c, f, l, m, s, v, w;
                            return q = [], n || (f = b(k.shiftSearchPeopleFilter), s = null != k.shiftSearchPeopleModel ? b(k.shiftSearchPeopleModel)(i) : (c = d.find("Connection", {
                                fromUserId: e.currentUser.id
                            }), _(c).map(function (a) {
                                return a.toUser
                            })), q = a("filter")(s, {
                                name: g
                            }).slice(0, +p + 1 || 9e9), q = function () {
                                var a, b, c;
                                for (c = [], a = 0, b = q.length; b > a; a++) v = q[a], f(i, {
                                    object: v
                                }) && c.push(v);
                                return c
                            }()), u = [], o() || (w = null != k.shiftSearchTeamsModel ? b(k.shiftSearchTeamsModel)(i) : (m = d.find("TeamMembership", {
                                userId: e.currentUser.id
                            }), function () {
                                var a, b, c;
                                for (c = [], a = 0, b = m.length; b > a; a++) l = m[a], c.push(l.team);
                                return c
                            }()), u = a("filter")(w, {
                                name: g
                            }).slice(0, +p + 1 || 9e9)), 0 === q.length && t && (q = [{
                                name: g
                            }]), h.show(j.parent(), {
                                people: q,
                                teams: u
                            }, {
                                onSelect: function (a) {
                                    var c;
                                    return c = b(k.shiftSearchOnEnter), c(i, {
                                        object: a
                                    }), r()
                                }
                            })
                        }, n ? l() : m = c(function () {
                            return s(!0), f.queryConnections({
                                overrideUrl: i.$eval(k.shiftSearchUrl),
                                query: g,
                                success: function (a) {
                                    var b, c, f, g, h;
                                    for (h = a.data, f = 0, g = h.length; g > f; f++) b = h[f], c = d.save("User", b), d.save("Connection", {
                                        fromUserId: e.currentUser.id,
                                        toUserId: c.id
                                    });
                                    return l(), s(!1)
                                }
                            })
                        }, 250)) : (q = u = [], h.hide()), g
                    })
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").directive("shiftTagInput", ["$rootScope", "$timeout", "keys",
        function (a, b, c) {
            return {
                restrict: "E",
                replace: !0,
                transclude: !0,
                templateUrl: "partials/directives/tag_input.html",
                scope: {
                    tags: "=shiftTagsModel",
                    queryModel: "=shiftQueryModel",
                    suggestions: "&shiftSuggestionsModel",
                    onKeyDown: "&shiftTagsOnKeydown",
                    onBlur: "&shiftTagsOnBlur",
                    disableTeam: "=shiftTagsDisableTeam"
                },
                compile: function (a, d) {
                    var e, f;
                    return f = $(".shift-typeahead-input", a), e = {
                        placeholder: d.placeholder
                    }, null != d.shiftSuggestionsModel && (e["shift-search-people-model"] = "suggestions()"), e["shift-search-disable-teams"] = null != d.shiftTagsDisableTeam ? "disableTeam" : "true", f.attr(e),
                    function (a, d, e) {
                        var f;
                        return e.$observe("shiftTagInputLimit", function (b) {
                            return null != b && b ? a.tagsLimit = +b : void 0
                        }), a.$watch("tags.length", function () {
                            return a.focused ? a.focusInput() : void 0
                        }), null != e.shiftTagsOptionalClasses && (a.inputClass = e.shiftTagsOptionalClasses), a.onTypeaheadBlur = function (b) {
                            return a.focused = !1, "function" == typeof a.onBlur && a.onBlur({
                                $event: b,
                                query: a.queryModel
                            }), a.queryModel = ""
                        }, f = function () {
                            return a.queryModel = "", a.tags = [], a.focused = !1
                        }, a.$on("resetTagInput", function () {
                            return f()
                        }), a.$on("focusTagInput", function () {
                            return b(function () {
                                return a.focusInput()
                            }, 0, !1)
                        }), a.shouldShowItem = function (b) {
                            return -1 === a.tags.indexOf(b)
                        }, a.focusInput = function () {
                            return $(".shift-typeahead-input", d).focus()
                        }, a.onQueryKeydown = function (b) {
                            var d;
                            return a.focused = !0, d = a.queryModel, 0 === d.length && b.which === c.BACKSPACE && a.tags.pop(), null != e.shiftTagsOnKeydown && a.onKeyDown({
                                $event: b,
                                query: d
                            }) && (f(), b.preventDefault()), !0
                        }, a.addSuggestion = function (b) {
                            return a.tags.push(b), a.queryModel = "", a.focusInput()
                        }
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Directives"), a.directive("shiftTimestamp", ["$parse", "dateFilter",
        function (a, b) {
            return {
                restrict: "E",
                replace: !0,
                templateUrl: "partials/directives/timestamp.html",
                compile: function (c, d) {
                    var e;
                    return e = null != d.shiftTimestampShort ? "{{" + d.shiftTime + " | shortTimestamp}}" : "{{" + d.shiftTime + " | timestamp}}", null != d.shiftTimestampPrefix && (e = "" + d.shiftTimestampPrefix + " " + e), c.html(e),
                    function (c, d, e) {
                        var f;
                        return c.timestamp = function () {
                            var d;
                            return d = a(e.shiftTime)(c), b(1e3 * d, "EEEE, MMMM d, yyyy 'at' h:mma")
                        }, f = setInterval(function () {
                            return c.$digest()
                        }, 6e4), c.$on("$destroy", function () {
                            return clearInterval(f)
                        })
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Directives").factory("typeahead", ["$rootScope",
        function (a) {
            var b;
            return b = {
                _numOfItems: 0,
                _data: null,
                _index: 0,
                _options: {},
                _visible: !1,
                typeahead: null,
                data: function (a) {
                    var b, c;
                    if (null != a) {
                        this.reset(), this._numOfItems = 0;
                        for (b in a) c = a[b], angular.isArray(c) && (this._numOfItems += c.length);
                        return this._data = a
                    }
                    return this._data
                },
                noResultVisible: function () {
                    var a, b, c, d;
                    return b = (null != (c = this._data) ? c.teams : void 0) || [], a = (null != (d = this._data) ? d.people : void 0) || [], 0 === b.length && 0 === a.length
                },
                register: function (a) {
                    return null != this.typeahead ? console.error("There should only be 1 typeahead element") : this.typeahead = a
                },
                unregister: function () {
                    return this.typeahead = null
                },
                next: function () {
                    return this._index = (this._index + 1) % this._numOfItems
                },
                previous: function () {
                    return this._index = (this._index - 1) % this._numOfItems, this._index < 0 ? this._index = this._numOfItems : void 0
                },
                select: function (a) {
                    var b;
                    return null == a && (a = this._index > this._data.people.length - 1 ? this._data.teams[this._index - this._data.people.length] : this._data.people[this._index]), null != a && "function" == typeof (b = this._options).onSelect && b.onSelect(a), this.hide()
                },
                position: function (a) {
                    var b, c;
                    return b = a.offset(), this.typeahead.css({
                        top: b.top + a.outerHeight(),
                        left: b.left
                    }).width(a.outerWidth()), c = b.top - $(window).scrollTop(), c + a.outerHeight() + this.typeahead.height() > $(window).height() ? this.typeahead.css("top", b.top - this.typeahead.height()) : void 0
                },
                show: function (a, b, c) {
                    return null == c && (c = {}), this.data(b), this._options = c, this.position(a), this.typeahead.addClass("visible"), this._visible = !0
                },
                hide: function () {
                    var a, b;
                    return "function" == typeof (a = this._options).onHide && a.onHide(), null != (b = this.typeahead) && b.removeClass("visible"), this._visible = !1, this.reset()
                },
                reset: function () {
                    return this._data = null, this._numOfItems = 0, this._index = 0
                },
                visible: function () {
                    return this._visible
                }
            }, $(document).on("click scroll resize", function () {
                return this._visible ? a.$apply(function () {
                    return b.hide()
                }) : void 0
            }), b
        }
    ]).directive("shiftTypeahead", ["typeahead", "keys",
        function (a, b) {
            return {
                restrict: "A",
                link: function (c, d) {
                    return d.on("keyup", function (d) {
                        switch (d.which) {
                        case b.ESCAPE:
                            d.preventDefault(), c.$apply(function () {
                                return a.hide()
                            });
                            break;
                        case b.UP:
                            c.$apply(function () {
                                return a.previous()
                            });
                            break;
                        case b.DOWN:
                            c.$apply(function () {
                                return a.next()
                            })
                        }
                        return !0
                    }).on("keypress", function (d) {
                        return d.which === b.ENTER && a.visible() && (d.preventDefault(), c.$apply(function () {
                            return a.select()
                        })), !0
                    }).on("blur", function () {
                        return setTimeout(function () {
                            return a.hide()
                        }, 100), !0
                    })
                }
            }
        }
    ]).directive("shiftTypeahead", ["typeahead",
        function (a) {
            return {
                restrict: "E",
                replace: !0,
                templateUrl: "partials/directives/typeahead.html",
                scope: {},
                link: function (b, c) {
                    return b.typeahead = a, b.onClick = function (b, c) {
                        return b.stopPropagation(), a.select(c)
                    }, a.register(c)
                }
            }
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT").run(function () {
        var a;
        return a = angular.module("Mac"), a.modal("compose-message-modal", {
            templateUrl: "/partials/modals/compose_message.html",
            attributes: {
                "shift-disable-bg-scroll": "inviteOthersModalScroll"
            }
        }), a.modal("single-message-modal", {
            controller: "SingleMessageModalController",
            templateUrl: "/partials/modals/single_message.html",
            attributes: {
                "shift-disable-bg-scroll": "appStoreModalScroll"
            }
        }), a.modal("app-store", {
            controller: "AppStoreController",
            templateUrl: "/partials/modals/app_store.html",
            attributes: {
                "shift-disable-bg-scroll": "singleMessageModalScroll"
            }
        }), a.modal("invite-others", {
            controller: "InviteOthersController",
            templateUrl: "/partials/modals/invite_others.html",
            attributes: {
                "shift-disable-bg-scroll": "composeMessagePopoverScroll"
            }
        })
    })
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "shiftUtil", "enums", "context", "eventHandler",
        function (a, c, d, e, f) {
            return a.models.ActivityEvent = function (a) {
                function e(a) {
                    var b, g, h, i, j;
                    if (i = _(d.EVENT_TYPE).invert(), a.createdAt = a.event.timestamp, a.updatedAt = a.event.timestamp, a.id = c.generateId(), null == a.muted && (a.muted = !1), g = f.messageType[i[a.type]], null == g) throw "Unable to handle message of type " + i[a.type];
                    h = g.constructor(a);
                    for (b in h) j = h[b], this[b] = j;
                    this.subject = {
                        you: "You",
                        them: this.userName
                    }, e.__super__.constructor.apply(this, arguments)
                }
                return b(e, a), e.typeName = "ActivityEvent", e.hasOne = {
                    message: "Message",
                    team: "Team",
                    application: "Application",
                    user: "User"
                }, e.property("text", {
                    get: function () {
                        return this._text
                    },
                    set: function (a) {
                        this._text = a
                    }
                }), e.property("userIcon", {
                    get: function () {
                        return this._userIcon
                    },
                    set: function (a) {
                        this._userIcon = a
                    }
                }), e.property("teamIcon", {
                    get: function () {
                        return this._teamIcon
                    },
                    set: function (a) {
                        this._teamIcon = a
                    }
                }), e.property("teamColor", {
                    get: function () {
                        return this._teamColor
                    },
                    set: function (a) {
                        this._teamColor = a
                    }
                }), e.property("userName", {
                    get: function () {
                        return this._userName
                    },
                    set: function (a) {
                        this._userName = a
                    }
                }), e.property("subject", {
                    get: function () {
                        return this._subject
                    },
                    set: function (a) {
                        return null != this._subject ? this._subject : this._subject = a
                    }
                }), e.property("teamSubject", {
                    get: function () {
                        return this._teamSubject
                    },
                    set: function (a) {
                        this._teamSubject = a
                    }
                }), e.property("applicationName", {
                    get: function () {
                        return this._applicationName
                    },
                    set: function (a) {
                        this._applicationName = a
                    }
                }), e.property("devType", {
                    get: function () {
                        return this._devType
                    },
                    set: function (a) {
                        this._devType = a
                    }
                }), e.property("inviteeName", {
                    get: function () {
                        return this._inviteeName
                    },
                    set: function (a) {
                        this._inviteeName = a
                    }
                }), e.prototype.save = function (a) {
                    return a.updatedAt = a.event.timestamp, e.__super__.save.apply(this, arguments)
                }, e
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "context",
        function (a) {
            var c;
            return a.models.Application = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "Application", d.prototype.save = function (a) {
                    var b, c;
                    return a.image = (b = null != (c = a.images) ? c.length : void 0) > 0 ? a.images[b - 1].sizes : {
                        "default": "images/default_profile_200.png",
                        icon: "images/default_profile_48.png",
                        original: "images/default_profile_200.png"
                    }, d.__super__.save.apply(this, arguments)
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        }, c = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    angular.module("SHIFT.Models").run(["store", "context",
        function (a, d) {
            var e;
            return a.models.Chat = function (f) {
                function g() {
                    return e = g.__super__.constructor.apply(this, arguments)
                }
                return b(g, f), g.typeName = "Chat", g.hasMany = {
                    messages: "ChatMessage"
                }, g.property("users", {
                    get: function () {
                        var b, c, d, e, f;
                        for (e = this.userIds, f = [], c = 0, d = e.length; d > c; c++) b = e[c], f.push(a.findOne("User", b));
                        return f
                    }
                }), g.property("previewUsers", {
                    get: function () {
                        return _.reject(this.users, function (a) {
                            return a === d.currentUser
                        }).slice(0, 4)
                    }
                }), g.property("title", {
                    get: function () {
                        var a, b, c;
                        return a = this.previewUsers.slice(0, 3), b = "Empty Chat", 1 === a.length ? b = a[0].name : a.length > 0 && (c = this.users, b = _.pluck(a, "firstName").join(", "), c.length - a.length > 1 && (b += " + " + (c.length - a.length - 1))), b
                    }
                }), g.property("images", {
                    get: function () {
                        var a, b, c, d, e;
                        for (d = this.previewUsers, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.image);
                        return e
                    }
                }), g.property("oldestMessage", {
                    get: function () {
                        return this.messages.length > 0 ? _(this.messages).sortBy("createdAt")[0] : null
                    }
                }), g.prototype.save = function (a) {
                    var b, c, d, e;
                    if (null != a.users) {
                        for (e = a.users, c = 0, d = e.length; d > c; c++) b = e[c], this.store.save("User", b);
                        a.userIds = _.pluck(a.users, "id"), delete a.users
                    }
                    return g.__super__.save.apply(this, arguments)
                }, g.prototype.includesUser = function (a) {
                    var b;
                    return b = a.id, c.call(this.userIds, b) >= 0
                }, g.prototype.includesUsers = function (a) {
                    var b, c, d;
                    for (c = 0, d = a.length; d > c; c++)
                        if (b = a[c], !this.includesUser(b)) return !1;
                    return !0
                }, g.prototype.getLatestMessageNotFromUser = function (a) {
                    var b, c, d, e, f, g, h, i;
                    for (f = this.messages, b = f.length - 1, d = null, h = 0, i = f.length; i > h; h++) e = f[h], g = e.authorId !== a.id, c = null != d ? e.createdAt > d.createdAt : !0, g && c && !e.type && (d = e);
                    return d
                }, g.prototype.getLatestMessageNotFromUserTimestamp = function (a) {
                    var b;
                    return (null != (b = this.getLatestMessageNotFromUser(a)) ? b.createdAt : void 0) || null
                }, g
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "util",
        function (a) {
            var c;
            return a.models.ChatMessage = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "ChatMessage", d.hasOne = {
                    author: "User"
                }, d.prototype.save = function (a) {
                    return null == a.id && (a.id = "" + a.chat_id + ";" + a.created_at), d.__super__.save.apply(this, arguments)
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            return a.models.Connection = function (a) {
                function c(a) {
                    var b, d, e;
                    e = [a.fromUserId, a.toUserId].sort(), b = e[0], d = e[1], a.id = "" + b + "+" + d, c.__super__.constructor.apply(this, arguments)
                }
                return b(c, a), c.typeName = "Connection", c.hasOne = {
                    fromUser: "User",
                    toUser: "User"
                }, c.prototype.getOtherUser = function (a) {
                    var b, c;
                    if (a.id === this.fromUserId) return this.toUser;
                    if (a.id === this.toUserId) return this.fromUser;
                    throw "User " + a.displayName + " does not belong to users " + (null != (b = this.fromUser) ? b.name : void 0) + " and " + (null != (c = this.toUser) ? c.name : void 0) + " in connection " + this.id + "."
                }, c.prototype.containsUser = function (a) {
                    return this.fromUserId === a.id || this.toUserId === a.id
                }, c
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            var c;
            return a.models.Conversation = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "Conversation", d.hasMany = {
                    conversationMessages: "ConversationMessage"
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            var c;
            return a.models.ConversationMessage = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "ConversationMessage", d.hasOne = {
                    author: "User"
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "truncateFilter",
        function (a, c) {
            return a.models.FollowUp = function (d) {
                function e(b) {
                    var c, d, f;
                    f = angular.copy(b), d = f.message_id || f.message.id, c = a.findOne("Message", d), c || null == f.message || (c = a.save("Message", f.message)), b.id = "followup-" + d, b.addressedTeams = c.addressedTeams, b.addressedUsers = c.addressedUsers, b.messageId = d, delete b.message, e.__super__.constructor.apply(this, arguments)
                }
                return b(e, d), e.typeName = "FollowUp", e.property("text", {
                    get: function () {
                        var a;
                        return c((null != (a = this.message) ? a.text : void 0) || "", 80)
                    }
                }), e
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            return a.models.HighFive = function (a) {
                function c(a) {
                    a.id = null != a.replyId ? "" + a.replyId + "+" + a.userId : "" + a.messageId + "+" + a.userId, c.__super__.constructor.apply(this, arguments)
                }
                return b(c, a), c.typeName = "HighFive", c
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["$q", "store", "api", "context",
        function (a, c, d, e) {
            var f;
            return c.models.Message = function (g) {
                function h() {
                    return f = h.__super__.constructor.apply(this, arguments)
                }
                return b(h, g), h.typeName = "Message", h.hasMany = {
                    sidebars: "Sidebar",
                    highFives: "HighFive",
                    events: "MessageEvent"
                }, h.property("author", {
                    get: function () {
                        switch (this.authorType) {
                        case "user":
                            return this.store.findOne("User", {
                                id: this.authorRef
                            });
                        case "application":
                            return this.store.findOne("Application", {
                                id: this.authorRef
                            });
                        default:
                            return null
                        }
                    }
                }), h.property("authorName", {
                    get: function () {
                        var a;
                        switch (this.authorType) {
                        case "user":
                            return a = this.store.findOne("User", this.authorRef), null != a ? a.displayName : "";
                        case "application":
                            return this.store.findOne("Application", {
                                id: this.authorRef
                            }).name;
                        default:
                            return ""
                        }
                    }
                }), h.hasOne = {
                    viaApp: "Application"
                }, h.property("replies", {
                    get: function () {
                        return this.store.find("Reply", {
                            messageId: this.id,
                            sidebarId: {
                                $exists: !1
                            }
                        })
                    }
                }), h.property("followup", {
                    get: function () {
                        return this.store.findOne("FollowUp", {
                            messageId: this.id
                        })
                    }
                }), h.property("images", {
                    get: function () {
                        var a, b, c, d, e;
                        for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "image" === a.type && e.push(a.data);
                        return e
                    }
                }), h.property("links", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "link" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), h.property("imageLinks", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "image-link" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), h.property("videos", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "video" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), h.property("files", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "file" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), h.property("iframe", {
                    get: function () {
                        var a, b, c, d;
                        for (d = this.attachments, b = 0, c = d.length; c > b; b++)
                            if (a = d[b], "iframe" === a.type) return a.data
                    }
                }), h.property("toWho", {
                    get: function () {
                        var a, b, d, e, f, g, h, i, j;
                        return c = this.store, b = this.addressedUsers, a = this.addressedTeams, d = this.authorId, h = this.userContext, g = function () {
                            var b, d, e;
                            for (e = [], b = 0, d = a.length; d > b; b++) f = a[b], e.push(c.findOne("Team", f));
                            return e
                        }(), j = function () {
                            var a, e, f;
                            for (f = [], a = 0, e = b.length; e > a; a++) i = b[a], i !== d && f.push(c.findOne("User", i));
                            return f
                        }(), e = function () {
                            var a, b, e;
                            for (e = [], a = 0, b = h.length; b > a; a++) i = h[a], i !== d && e.push(c.findOne("User", i));
                            return e
                        }(), {
                            users: j,
                            teams: g,
                            contextUsers: e
                        }
                    }
                }), h.property("isSearchResult", {
                    get: function () {
                        var a;
                        return null != (null != (a = this.meta) ? a.search : void 0)
                    }
                }), h.property("hasUnreadReplies", {
                    get: function () {
                        var a, b;
                        return this.repliesAreMarkedAsRead ? !1 : (a = this.replies, a.length > 0 && !(null != (b = a[a.length - 1]) ? b.read : void 0))
                    }
                }), h.property("hasUnreadSidebars", {
                    get: function () {
                        var a, b, c, d, e;
                        if (this.sidebarsAreMarkedAsRead) return !1;
                        for (e = this.sidebars, c = 0, d = e.length; d > c; c++)
                            if (b = e[c], a = b.replies, 0 !== a.length && !a[a.length - 1].read) return !0;
                        return !1
                    }
                }), h.property("lines", {
                    get: function () {
                        var a;
                        return null != (a = this.text) ? a.split("\n") : void 0
                    }
                }), h.property("hasHTML", {
                    get: function () {
                        return null != this.iframe
                    }
                }), h.property("isPrivate", {
                    get: function () {
                        var a, b;
                        return 0 === (null != (a = this.toWho.teams) ? a.length : void 0) || (null != (b = this.userContext) ? b.length : void 0) > 0
                    }
                }), h.property("numSidebarReplies", {
                    get: function () {
                        var a, b, c, d, e;
                        for (a = 0, e = this.sidebars, c = 0, d = e.length; d > c; c++) b = e[c], a += b.replies.length;
                        return a
                    }
                }), h.prototype.allAddressedUsers = function () {
                    var b, f, g, h, i, j, k, l, m, n, o, p;
                    if (h = a.defer(), c = this.store, f = this.toWho.users, b = this.toWho.teams, m = _(f).pluck("id"), n = function () {
                        var a, b, d;
                        for (d = [], a = 0, b = m.length; b > a; a++) l = m[a], l !== e.currentUser.id && d.push(c.findOne("User", l));
                        return d
                    }(), i = [], j = b.length, this.authorRef !== e.currentUser.id && n.push(c.findOne("User", this.authorRef)), 0 === j) return h.resolve(n), h.promise;
                    for (g = 0, o = 0, p = b.length; p > o; o++) k = b[o], d.fetchTeamMemberships({
                        team: k,
                        success: function (a) {
                            var b, c, d, f;
                            for (f = a.models, c = 0, d = f.length; d > c; c++) b = f[c], b.user.id !== e.currentUser.id && n.push(b.user);
                            return g += 1, g === j ? i.length ? h.reject(i) : h.resolve(n) : void 0
                        },
                        error: function (a) {
                            return i.push(a)
                        }
                    });
                    return h.promise
                }, h.prototype.save = function (a) {
                    var b, c, d, e, f, g, i, j;
                    if (null != a.author && (a.author_ref = a.author.id), null == a.author_ref && (a.author_ref = a.author_id), null != a.via_app && (a.via_app_id = a.via_app.id), d = a.high_fivers, e = a.sidebars, c = a.events, b = a.author_type, g = a.via_app, null != e && this.store.save("Sidebar", e), null != g && this.store.save("Application", g), null != c && this.store.save("MessageEvent", c), delete a.author_id, delete a.high_fivers, delete a.sidebars, delete a.via_app, delete a.events, null != d) {
                        for (i = 0, j = d.length; j > i; i++) f = d[i], this.store.save("HighFive", {
                            messageId: a.id,
                            userId: f.id
                        }, !1);
                        this.store._refreshQueries("HighFive")
                    }
                    return h.__super__.save.apply(this, arguments)
                }, h
            }(c.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            var c;
            return a.models.MessageEvent = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "MessageEvent", d.hasOne = {
                    actor: "User",
                    userAdded: "User"
                }, d.prototype.save = function (a) {
                    var b, c, e;
                    return b = a.actor, c = a.user_added, e = [], null != b && (a.actorId = b.id, 0 === this.store.count("User", b.id) && e.push(b.id)), null != c && (a.userAddedId = c.id, 0 === this.store.count("User", c.id) && e.push(c.id)), e.length > 0 && this.store.fetchAll("User", {
                        url: "/v1/users?ids=" + e.join("&")
                    }), delete a.actor, delete a.user_added, d.__super__.save.apply(this, arguments)
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty,
        c = function (a, c) {
            function d() {
                this.constructor = a
            }
            for (var e in c) b.call(c, e) && (a[e] = c[e]);
            return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
        };
    angular.module("SHIFT.Models").run(["store", "enums", "util", "notificationHandler",
        function (b, d, e, f) {
            var g;
            return b.models.Notification = function (b) {
                function e() {
                    return this.save = a(this.save, this), g = e.__super__.constructor.apply(this, arguments)
                }
                return c(e, b), e.typeName = "Notification", e.hasOne = {
                    user: "User",
                    app: "Application",
                    message: "Message",
                    team: "Team"
                }, e.property("author", {
                    get: function () {
                        switch (this.authorType) {
                        case "User":
                            return this.user;
                        case "Application":
                            return this.app
                        }
                    }
                }), e.property("lines", {
                    get: function () {
                        var a;
                        return null != (a = this.text) ? a.split("\n") : void 0
                    }
                }), e.prototype.declinedOnce = !1, e.prototype.save = function (a) {
                    var b, c, g, h, i;
                    if (h = _(d.NOTIFICATION_TYPE).invert(), b = f.notificationType[h[a.type]], null == b) throw "Unable to handle notification of type " + h[a.type];
                    g = b.constructor(a);
                    for (c in g) i = g[c], this[c] = i;
                    return e.__super__.save.apply(this, arguments)
                }, e
            }(b.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            return a.models.PendingMembership = function (c) {
                function d(b) {
                    var c, e;
                    e = b.user, null != b.team ? c = a.save("Team", b.team) : b.team_id && (c = a.findOne("Team", b.team_id)), null != e && (b.user = a.save("User", b.user)), null != c && (a.save("Team", c), null == b.team_id && (b.team_id = c.id)), null != b.inviter && (a.save("User", b.inviter), b.inviter_id = b.inviter.id), null != b.userid && null == b.user_id && (b.user_id = b.userid), b.id = "" + b.team_id + "+" + b.user_id, d.__super__.constructor.apply(this, arguments)
                }
                return b(d, c), d.typeName = "PendingMembership", d.hasOne = {
                    inviter: "User"
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "util",
        function (a) {
            var c;
            return a.models.Reply = function (a) {
                function d() {
                    return c = d.__super__.constructor.apply(this, arguments)
                }
                return b(d, a), d.typeName = "Reply", d.hasOne = {
                    author: "User"
                }, d.hasMany = {
                    highFives: "HighFive"
                }, d.property("images", {
                    get: function () {
                        var a, b, c, d, e;
                        for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "image" === a.type && e.push(a.data);
                        return e
                    }
                }), d.property("links", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "link" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), d.property("imageLinks", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "image-link" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), d.property("videos", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "video" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), d.property("files", {
                    get: function () {
                        var a;
                        return function () {
                            var b, c, d, e;
                            for (d = this.attachments, e = [], b = 0, c = d.length; c > b; b++) a = d[b], "file" === a.type && e.push(a.data);
                            return e
                        }.call(this)
                    }
                }), d.property("read", {
                    get: function () {
                        var a, b;
                        return !(null != (a = this.message) ? a.unreadSince : void 0) || this.createdAt + 1 < (null != (b = this.message) ? b.unreadSince : void 0)
                    }
                }), d.prototype.save = function (a) {
                    var b, c, e, f, g, h;
                    if (null == a.author_id && (a.author_id = null != (g = a.author) ? g.id : void 0), b = a.author, null != b && 0 === this.store.count("User", b.id) && this.store.fetchOne("User", b.id), null != a.high_fivers)
                        for (h = a.high_fivers, e = 0, f = h.length; f > e; e++) c = h[e], this.store.save("HighFive", {
                            replyId: a.id,
                            userId: c.id
                        });
                    return delete a.author, delete a.high_fivers, d.__super__.save.apply(this, arguments)
                }, d
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store",
        function (a) {
            var c;
            return a.models.Sidebar = function (d) {
                function e() {
                    return c = e.__super__.constructor.apply(this, arguments)
                }
                return b(e, d), e.typeName = "Sidebar", e.hasOne = {
                    creator: "User"
                }, e.hasMany = {
                    replies: "Reply"
                }, e.property("members", {
                    get: function () {
                        var b;
                        return b = a.find("User", this.addressedTo), b.push(this.creator), b
                    }
                }), e.prototype.save = function (a) {
                    var b, c;
                    return b = a.creator, c = a.replies, null != b && 0 === this.store.count("User", b.id) && this.store.fetchOne("User", b.id), null != b && (a.creatorId = b.id), null != c && this.store.save("Reply", c), delete a.creator, delete a.replies, e.__super__.save.apply(this, arguments)
                }, e
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "enums", "context",
        function (a, c, d) {
            var e;
            return a.models.Team = function (f) {
                function g() {
                    return e = g.__super__.constructor.apply(this, arguments)
                }
                return b(g, f), g.typeName = "Team", g.hasMany = {
                    teamMemberships: "TeamMembership"
                }, g.property("adminCount", {
                    get: function () {
                        return this.store.find("TeamMembership", {
                            teamId: this.id,
                            membershipType: c.MEMBERSHIP_TYPE.ADMIN
                        }).length
                    }
                }), g.property("members", {
                    get: function () {
                        var b, c, d, e, f;
                        for (c = a.find("TeamMembership", {
                            teamId: this.id
                        }), f = [], d = 0, e = c.length; e > d; d++) b = c[d], f.push(b.user);
                        return f
                    }
                }), g.property("otherMembers", {
                    get: function () {
                        var b, c, e, f, g;
                        for (c = a.find("TeamMembership", {
                            teamId: this.id,
                            userId: {
                                $not: d.currentUser.id
                            }
                        }), g = [], e = 0, f = c.length; f > e; e++) b = c[e], g.push(b.user);
                        return g
                    }
                }), g.property("pendingMembers", {
                    get: function () {
                        var b, c, d, e, f;
                        for (c = a.find("PendingMembership", {
                            teamId: this.id
                        }), f = [], d = 0, e = c.length; e > d; d++) b = c[d], f.push(b.user);
                        return f
                    }
                }), g
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["store", "context",
        function (a, c) {
            return a.models.TeamMembership = function (d) {
                function e(b) {
                    var d, f, g;
                    d = b.team, f = b.user, null != d && (b.user_id === c.currentUser.id && (d.is_favorite = b.is_favorite || 0, d.is_muted = b.is_muted || 0), delete d.unread_count, a.save("Team", d), null == b.team_id && (b.team_id = d.id)), null != f && f.id !== c.currentUser.id && (b.user = a.save("User", b.user)), null != f && null == b.user_id && (b.user_id = b.user.id), null != b.inviter && (a.save("User", b.inviter), b.inviter_id = null != (g = b.inviter) ? g.id : void 0), null === b.is_favorite && (b.is_favorite = 0), b.id = "" + b.team_id + "+" + b.user_id, e.__super__.constructor.apply(this, arguments)
                }
                return b(e, d), e.typeName = "TeamMembership", e.hasOne = {
                    inviter: "User"
                }, e
            }(a.Model)
        }
    ])
}.call(this),
function () {
    var a = {}.hasOwnProperty,
        b = function (b, c) {
            function d() {
                this.constructor = b
            }
            for (var e in c) a.call(c, e) && (b[e] = c[e]);
            return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
        };
    angular.module("SHIFT.Models").run(["$rootScope", "store", "util", "enums", "context",
        function (a, c, d, e, f) {
            var g;
            return c.models.User = function (d) {
                function h() {
                    return g = h.__super__.constructor.apply(this, arguments)
                }
                return b(h, d), h.typeName = "User", h.hasMany = {
                    sidebarMemberships: "SidebarMembership",
                    teamMemberships: "TeamMembership"
                }, h.property("name", {
                    get: function () {
                        var a, b, c;
                        return a = this.firstName || "", b = this.lastName || "", c = a ? "" + a + " " + b : "", c.trim() || this.email || ""
                    }
                }), h.property("displayName", {
                    get: function () {
                        var a, b, c, d;
                        return b = this.name, a = this.email, c = null != (d = this.primaryEmail) ? d.address : void 0, null != b && "" !== b ? b : null != a && "" !== a ? a : null != c && "" !== c ? c : ""
                    }
                }), h.property("userEmail", {
                    get: function () {
                        var a, b;
                        return a = this.email, null == a && (a = null != (b = this.primaryEmail) ? b.address : void 0), a
                    }
                }), h.property("connectedUsers", {
                    get: function () {
                        var a, b, c, d, e;
                        for (b = this.store.find("Connection", [{
                            fromUserId: this.id
                        }, {
                            toUserId: this.id
                        }]), e = [], c = 0, d = b.length; d > c; c++) a = b[c], e.push(a.getOtherUser(this));
                        return e
                    }
                }), h.prototype.isAdminOfTeam = function (a) {
                    var b;
                    return null == a && (a = f.selectedTeam), null == a ? !1 : (b = this.store.findOne("TeamMembership", "" + a.id + "+" + this.id), (null != b ? b.membershipType : void 0) === e.MEMBERSHIP_TYPE.ADMIN)
                }, h.prototype.isLastAdminOfTeam = function (a) {
                    return null == a && (a = f.selectedTeam), 1 === (null != a ? a.adminCount : void 0) && this.isAdminOfTeam(a)
                }, h.prototype.isLastMemberOfTeam = function (a) {
                    return null == a && (a = f.selectedTeam), null == a ? !1 : this.store.find("TeamMembership", "" + a.id + "+" + this.id).length <= 1
                }, h.prototype.removeTeamData = function (b) {
                    var d, e, f, g;
                    for (e = c.find("Message", {
                        addressedTeams: {
                            $contains: b
                        }
                    }), f = 0, g = e.length; g > f; f++) d = e[f], a.$broadcast("messageWasDeleted", d);
                    return c.remove("ActivityEvent", {
                        teamId: b
                    }), c.remove("FollowUp", {
                        addressedTeams: {
                            $contains: b
                        }
                    }), c.remove("Message", {
                        addressedTeams: {
                            $contains: b
                        }
                    }), c.remove("TeamMembership", {
                        teamId: b
                    }), c.remove("Team", b)
                }, h.prototype.save = function (a) {
                    return _(a.image).isEmpty() ? a.image = {
                        "default": "images/default_profile_200.png",
                        icon: "images/default_profile_48.png",
                        original: "images/default_profile_200.png"
                    } : angular.isArray(a.image) && (a.image = a.image[0]), h.__super__.save.apply(this, arguments)
                }, h
            }(c.Model)
        }
    ])
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("add-contact-popover", {
        templateUrl: "/partials/popovers/add_contact.html",
        controller: "AddContactController",
        direction: "below right",
        title: "Add Contact"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("add-message-users", {
        templateUrl: "/partials/popovers/add_message_users.html",
        controller: "AddMessageUsersController",
        direction: "below left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("add-sidebar-member-popover", {
        templateUrl: "/partials/popovers/add_sidebar_member.html",
        controller: "AddSidebarMemberController",
        direction: "below right",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("chat-popover", {
        templateUrl: "/partials/popovers/chat.html",
        controller: "ChatPopoverController",
        direction: "middle left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("create-team-popover", {
        templateUrl: "/partials/popovers/create_team.html",
        controller: "CreateTeamController",
        direction: "below left",
        title: "Create New Team"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("edit-contact-popover", {
        templateUrl: "/partials/popovers/edit_contact.html",
        controller: "EditContactController",
        direction: "below right",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("edit-team-popover", {
        templateUrl: "/partials/popovers/edit_team.html",
        controller: "EditTeamController",
        direction: "below right",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("facebook-connect", {
        templateUrl: "/partials/popovers/facebook_connect.html",
        direction: "middle left",
        title: "Add Contacts from Facebook"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("facebook-contacts", {
        templateUrl: "/partials/popovers/facebook_contacts.html",
        direction: "middle left",
        title: "Add Contacts from Facebook"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("google-connect", {
        templateUrl: "/partials/popovers/google_connect.html",
        direction: "middle left",
        title: "Add Contacts from Google"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("google-contacts", {
        templateUrl: "/partials/popovers/google_contacts.html",
        direction: "middle left",
        title: "Add Contacts from Google"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("hover-card-popover", {
        templateUrl: "/partials/popovers/hover_card.html",
        controller: "HoverCardController",
        direction: "above left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("invite-to-team-popover", {
        templateUrl: "/partials/popovers/invite_to_team.html",
        controller: "InviteToTeamController",
        direction: "below left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("member-settings", {
        templateUrl: "/partials/popovers/member_settings.html",
        controller: "UserNavController",
        direction: "below right",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("message-actions", {
        templateUrl: "/partials/popovers/message_actions.html",
        controller: "MessageActionsController",
        direction: "below right",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("notifications-popover", {
        templateUrl: "/partials/popovers/notifications.html",
        controller: "NotificationsController",
        direction: "below left",
        title: "Notifications"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("open-app-as-popover", {
        templateUrl: "/partials/popovers/open_app_as.html",
        controller: "OpenAppAsController",
        direction: "middle right",
        title: "Open App As..."
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("team-colors-popover", {
        templateUrl: "/partials/popovers/team_colors.html",
        controller: "TeamColorsController",
        direction: "below left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("team-icons-popover", {
        templateUrl: "/partials/popovers/team_icons.html",
        controller: "TeamIconsController",
        direction: "below left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("teams-nav", {
        templateUrl: "/partials/popovers/teams_nav.html",
        controller: "TeamsNavController",
        direction: "below left",
        header: !1,
        footer: !0
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("unread-message-popover", {
        templateUrl: "/partials/popovers/unread_message.html",
        controller: "UnreadMessagesController",
        direction: "below left",
        footer: !0,
        title: "Recent Unread Messages"
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("user-list-popover", {
        templateUrl: "/partials/popovers/user_list.html",
        controller: "UserListController",
        direction: "middle left",
        header: !1
    })
}.call(this),
function () {
    angular.module("SHIFT.Popover").popover("user-nav-popover", {
        templateUrl: "/partials/popovers/user_nav.html",
        direction: "below right",
        title: "Hello {{context.currentUser.name}}"
    })
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.ApiCallbacks", ["SHIFT.Store", "SHIFT.Context", "SHIFT.Enums"]), a.factory("apiCallbacks", ["$rootScope", "$http", "store", "context", "enums",
        function (a, c, d, e, f) {
            return {
                fetchAllContacts: {
                    success: function (a) {
                        return d.save("User", a.data)
                    }
                },
                fetchAllTeams: {
                    success: function (a) {
                        return d.save("TeamMembership", a.data)
                    }
                },
                fetchMutualTeams: {
                    beforeApiCall: function (a) {
                        var b;
                        return b = a.userIds, 0 === (null != b ? b.length : void 0) ? -1 : (a.query = {
                            users: b.join(",")
                        }, a)
                    }
                },
                fetchAllConnections: {
                    beforeApiCall: function (a) {
                        var b;
                        if (b = a.userIds, (null != b ? b.length : void 0) > 1) throw "Fetching connections for multiple users is not supported yet.";
                        return b && b.length > 0 && (a.query = {
                            users: b.join(",")
                        }), a
                    },
                    success: function (a) {
                        var b, c, f, g, h, i, j, k;
                        for (c = a.options, g = c.userIds, f = g && g.length > 0 ? d.findOne("User", g[0]) : e.currentUser, null != f && (f.numConnections = a.response.meta.num_connections), j = a.data, k = [], h = 0, i = j.length; i > h; h++) b = j[h], d.save("User", b), k.push(d.save("Connection", {
                            fromUserId: f.id,
                            toUserId: b.id
                        }));
                        return k
                    }
                },
                queryConnections: {
                    beforeApiCall: function (a) {
                        var b;
                        return b = a.query, null == b || "" === b ? -1 : (a.query = {
                            query: b
                        }, a)
                    },
                    success: function (a) {
                        var b, c, f, g, h;
                        for (c = [], h = a.data, f = 0, g = h.length; g > f; f++) b = h[f], c.push(d.save("User", b)), d.save("Connection", {
                            fromUserId: e.currentUser.id,
                            toUserId: b.id
                        });
                        return a.users = c
                    }
                },
                fetchAllFollowups: {
                    beforeApiCall: function (a) {
                        return d.clear("FollowUp"), a
                    },
                    success: function (a) {
                        var b, c, e;
                        return c = a.data, e = _.map(c, function (a) {
                            return a.message.author_id
                        }), e.length > 0 && d.fetchAll("User", {
                            url: "/v1/users?ids=" + e.join(",")
                        }), b = d.save("FollowUp", c)
                    }
                },
                installApp: {
                    success: function (a) {
                        var c, e, f;
                        return f = a.options.teamId, e = a.options.applicationId, c = d.findOne("Application", e), null == c.teamIds && (c.teamIds = []), b.call(c.teamIds, f) < 0 ? c.teamIds.push(f) : void 0
                    }
                },
                uninstallApp: {
                    success: function (a) {
                        var b, c, e, f, g;
                        return c = a.options.applicationId, f = a.options.teamId, b = d.findOne("Application", c), e = b.teamIds.indexOf(f), -1 !== e ? ([].splice.apply(b.teamIds, [e, e - e + 1].concat(g = [])), g) : void 0
                    }
                },
                updateTeamMembership: {
                    beforeApiCall: function (a) {
                        return a.url = "PendingMembership" === a.membership ? "/" + a.teamId + "/pending_users/" + a.email : "/" + a.teamId + "/users/" + a.userId, a
                    }
                },
                createFollowup: {
                    beforeApiCall: function (a) {
                        var b;
                        return b = a.message, a.data = {
                            message_id: b.id
                        }, a
                    },
                    success: function (a) {
                        var b;
                        return b = d.save("FollowUp", a.data)
                    }
                },
                markMessages: {
                    beforeApiCall: function (a) {
                        var b, c;
                        return (null != (c = a.messageIds) ? c.length : void 0) ? (b = a.read, a.data = {
                            read: b,
                            message_ids: a.messageIds
                        }, a) : -1
                    }
                },
                markAllMessagesAsRead: {
                    beforeApiCall: function (a) {
                        var b;
                        return b = "", b += "Team" === e.selectedObjectType ? "teams/" + e.selectedObject.id + "/messages" : "users/me/messages", a.data = {
                            read: !0
                        }, a.url = b, a
                    },
                    success: function (b) {
                        var c, f, g, h, i;
                        for (e.updateUnreadCounts(b.response.meta.unread_counts), f = d.find("Message", {
                            read: !1
                        }), i = [], g = 0, h = f.length; h > g; g++) c = f[g], c.read = "Team" === e.selectedObjectType && c.addressedTeams[0] === e.selectedTeam.id ? !0 : !0, c.read ? i.push(a.$broadcast("messageWasMarked", c)) : i.push(void 0);
                        return i
                    }
                },
                muteUnmuteMessage: {
                    beforeApiCall: function (a) {
                        var b;
                        return (null != (b = a.messageIds) ? b.length : void 0) ? (a.data = {
                            is_muted: a.isMuted,
                            message_ids: a.messageIds,
                            read: null != a.read ? a.read : void 0
                        }, a) : -1
                    }
                },
                acceptTeamInvite: {
                    beforeApiCall: function (a) {
                        return a.data = {
                            accepted: !0
                        }, a
                    }
                },
                setHighFive: {
                    beforeApiCall: function (a) {
                        var b;
                        return null == a.target ? -1 : (b = a.target, a.remove ? (a.method = "DELETE", a.headers || (a.headers = {}), a.headers["Content-Length"] = 0) : a.method = "POST", a.url = "Reply" === b.constructor.typeName ? null != b.sidebarId ? "/" + b.messageId + "/sidebars/" + b.sidebarId + "/replies/" + b.id + "/high_fives" : "/" + b.messageId + "/replies/" + b.id + "/high_fives" : "/" + b.id + "/high_fives", a)
                    },
                    success: function (a) {
                        var b, c, f;
                        switch (c = a.options, b = {
                            userId: e.currentUser.id
                        }, f = c.target, f.constructor.typeName) {
                        case "Message":
                            b.messageId = f.id;
                            break;
                        case "Reply":
                            b.replyId = f.id
                        }
                        return c.remove ? (d.remove("HighFive", b), f.userHighFived = !1) : (d.save("HighFive", b), f.userHighFived = !0)
                    }
                },
                fetchAllHighFivers: {
                    beforeApiCall: function (a) {
                        var b, c;
                        if (null == a.target) return -1;
                        switch (b = a.target, b.constructor.typeName) {
                        case "Message":
                            a.messageId = b.id;
                            break;
                        case "Reply":
                            a.messageId = b.messageId, a.replyId = b.id, a.sidebarId = b.sidebarId
                        }
                        return c = "", null != a.sidebarId && (c += "/sidebars/" + a.sidebarId), null != a.replyId && (c += "/replies/" + a.replyId), a.url = "" + c + "/high_fivers", a
                    },
                    success: function (a) {
                        var b, c, e, f, g, h;
                        for (b = a.options, e = a.data || [], h = [], f = 0, g = e.length; g > f; f++) c = e[f], d.save("User", c), null != b.replyId ? h.push(d.save("HighFive", {
                            replyId: b.replyId,
                            userId: c.id
                        })) : h.push(d.save("HighFive", {
                            messageId: b.messageId,
                            userId: c.id
                        }));
                        return h
                    }
                },
                fetchTeamMemberships: {
                    beforeApiCall: function (a) {
                        return null == a.team ? -1 : (a.teamId = a.team.id, a)
                    },
                    success: function (a) {
                        return a.models = d.save("TeamMembership", a.data)
                    }
                },
                fetchPendingTeamMemberships: {
                    beforeApiCall: function (a) {
                        return null == a.team ? -1 : (a.teamId = a.team.id, a)
                    },
                    success: function (a) {
                        return a.models = d.save("PendingMembership", a.data)
                    }
                },
                addContact: {
                    success: function (a) {
                        return d.save("User", a.data)
                    }
                },
                removeContact: {
                    beforeApiCall: function (a) {
                        return a.email ? a : -1
                    },
                    success: function (a) {
                        var b;
                        return b = d.findOne("User", {
                            email: a.options.email
                        }), b.relationship = f.RELATIONSHIP_TYPE.NONE
                    }
                },
                blockContact: {
                    success: function (a) {
                        var b;
                        return b = a.options.data.user_id, d.remove("Notification", {
                            userId: b
                        })
                    }
                },
                fetchBatchUsers: {
                    beforeApiCall: function (a) {
                        var b;
                        return (null != (b = a.ids) ? b.length : void 0) ? (a.ids = a.ids.join(","), a) : -1
                    },
                    success: function (a) {
                        return d.save("User", a.data)
                    }
                },
                fetchAllApplications: {
                    success: function (a) {
                        var b;
                        return b = a.data || [], _(b).each(function (a) {
                            return a.is_installed = !0
                        }), d.save("Application", b)
                    }
                },
                toggleTeamFavorite: {
                    beforeApiCall: function (a) {
                        return null == a.teamId || null == a.isFavorite ? -1 : (null == a.userId && (a.userId = e.currentUser.id), a.membership = d.findOne("TeamMembership", {
                            userId: a.userId,
                            teamId: a.teamId
                        }), a.team = d.findOne("Team", a.teamId), a.membership.isFavorite = a.isFavorite, a.team.isFavorite = a.isFavorite, a.data = {
                            is_favorite: a.isFavorite
                        }, a)
                    },
                    error: function (b) {
                        var c, e;
                        return a.$broadcast("showError", "There was an error pinning the team.  Please try again."), c = b.options, e = 1 === c.isFavorite ? 0 : 1, c.team.isFavorite = e, c.membership.isFavorite = e, d.save("TeamMembership", c.membership), d.save("Team", c.team)
                    }
                },
                leaveTeam: {
                    beforeApiCall: function (a) {
                        return null == a.userId && (a.userId = e.currentUser.id), a
                    },
                    success: function (b) {
                        var c, f;
                        return c = b.options.teamId, d.remove("TeamMembership", c), d.remove("Message", {
                            addressedTeams: {
                                $contains: c
                            }
                        }), d.remove("TeamMembership", {
                            teamId: c
                        }), d.remove("Team", c), a.$broadcast("reloadStream"), a.$broadcast("resetMessageInput"), (null != (f = e.selectedTeam) ? f.id : void 0) === c ? e.goToRoot() : void 0
                    },
                    error: function () {
                        return a.$broadcast("showError", "Failed to leave team. Please try again")
                    }
                },
                ignoreNotifications: {}
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.BrowserNotifications", []), a.factory("browserNotifications", ["$rootScope", "$window", "context",
        function (a, b, c) {
            var d, e, f;
            return d = b.webkitNotifications, f = {
                isFocused: !0,
                notificationObjects: [],
                createNotification: function (e, f, g, h) {
                    var i, j = this;
                    null == e && (e = ""), null == f && (f = ""), null == g && (g = ""), this.isFocused || 0 !== (null != d ? "function" == typeof d.checkPermission ? d.checkPermission() : void 0 : void 0) || (i = null != d ? d.createNotification(e, f, g) : void 0, this.notificationObjects.push(i), i.show(), this.notificationObjects.length > 4 && this.notificationObjects.shift().close(), i.onclick = function () {
                        var d, e, f, g;
                        for (b.focus(), g = j.notificationObjects, e = 0, f = g.length; f > e; e++) d = g[e], d.close();
                        return j.notificationObjects = [], "Chat" === (null != h ? h.constructor.typeName : void 0) && a.$broadcast("createNewChat", _(h.users).filter(function (a) {
                            return !(a === c.currentUser)
                        })), !0
                    }, function (a) {
                        return b.setTimeout(function () {
                            return null != a ? (a.close(), j.notificationObjects.shift()) : void 0
                        }, 5e3)
                    }(i))
                }
            }, 0 !== (null != d ? "function" == typeof d.checkPermission ? d.checkPermission() : void 0 : void 0) && (e = function () {
                var a;
                try {
                    null != d && "function" == typeof d.requestPermission && d.requestPermission()
                } catch (b) {
                    a = b, console.error(a)
                }
                return e = function () {}
            }, $(document).click(function () {
                return e(), !0
            })), $(b).on("focus", function () {
                return f.isFocused = !0
            }), $(b).on("blur", function () {
                return f.isFocused = !1
            }), f
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Context", ["SHIFT.Util", "Bangular.View"]), a.provider("context", function () {
        var a;
        return a = this, this.$get = ["$rootScope", "$location", "$http", "$window", "$timeout", "popover", "util", "store", "modal", "router",
            function (a, c, d, e, f, g, h, i, j, k) {
                var l;
                return l = {}, Object.defineProperty(l, "currentUser", {
                    get: function () {
                        return this._currentUser
                    },
                    set: function (b) {
                        return this._currentUser = b, a.$broadcast("contextDidChange")
                    }
                }), Object.defineProperty(l, "selectedObject", {
                    get: function () {
                        return this._selectedObject
                    },
                    set: function (b) {
                        return this._selectedObject = b, a.$broadcast("contextDidChange")
                    }
                }), Object.defineProperty(l, "selectedApp", {
                    get: function () {
                        return this._selectedApp
                    },
                    set: function (a) {
                        return this._selectedApp = a
                    }
                }), Object.defineProperty(l, "selectedTeam", {
                    get: function () {
                        return "Team" === this.selectedObjectType ? this.selectedObject : void 0
                    },
                    set: function (a) {
                        return this.selectedObject = a
                    }
                }), Object.defineProperty(l, "selectedUser", {
                    get: function () {
                        return "User" === this.selectedObjectType ? this.selectedObject : void 0
                    },
                    set: function (a) {
                        return this.selectedObject = a
                    }
                }), Object.defineProperty(l, "selectedMessage", {
                    get: function () {
                        return this._selectedMessage
                    },
                    set: function (a) {
                        return this._selectedMessage = a
                    }
                }), Object.defineProperty(l, "selectedObjectType", {
                    get: function () {
                        var a;
                        return null != (a = this.selectedObject) ? a.constructor.typeName : void 0
                    }
                }), Object.defineProperty(l, "selectedPage", {
                    get: function () {
                        return this._selectedPage
                    },
                    set: function (a) {
                        var c;
                        return c = ["main", "single-message", "user-settings"], this._selectedPage = b.call(c, a) >= 0 ? a : c[0]
                    }
                }), Object.defineProperty(l, "selectedSubpage", {
                    get: function () {
                        return null != this._selectedSubpage ? this._selectedSubpage : "inbox"
                    },
                    set: function (a) {
                        return l._setSubpage(a)
                    }
                }), Object.defineProperty(l, "selectedUserIsCurrentUser", {
                    get: function () {
                        return this.selectedObject.id === this.currentUser.id
                    }
                }), a.$on("$locationChangeSuccess", function () {
                    return j.hide(), g.hideAll(), f(function () {
                        return $("html, body").animate({
                            scrollTop: 0
                        }, 0)
                    }, 0)
                }), l.resetContextPage = function (a, b) {
                    return null == a && (a = "main"), null == b && (b = "inbox"), l.selectedPage = a, this._setSubpage(b)
                }, l._setSubpage = function (a) {
                    var c, d, e;
                    return c = {
                        main: ["inbox", "all", "direct", "unread", "sent", "other", "connections", "teams", "address-book", "edit"],
                        "single-message": ["normal", "sidebar"],
                        "user-settings": ["user-settings"]
                    }, d = this.selectedPage || "main", e = c[d], this._selectedSubpage = null != e && b.call(e, a) >= 0 ? a : e[0]
                }, l.goToPath = function (a, b) {
                    var c, d, e;
                    return null == b && (b = {}), e = a, d = _.keys(b), (null != d ? d.length : void 0) && (e += "?", e += function () {
                        var a, e, f;
                        for (f = [], a = 0, e = d.length; e > a; a++) c = d[a], f.push("" + c + "=" + encodeURIComponent(b[c]));
                        return f
                    }().join("&")), k.navigate(e)
                }, l.goToRoot = function (a, b) {
                    return null == a && (a = "inbox"), l.resetContextPage("main", a), this.goToPath("/" + a, b)
                }, l.goToCurrentUser = function (a, b) {
                    return null == a && (a = ""), l._setSubpage(a), this.goToPath("/" + a, b)
                }, l.goToTeam = function (a, b, c) {
                    var d;
                    return null == b && (b = ""), l._setSubpage(b), d = "/teams/" + a.id, b && (d += "/" + b), this.goToPath(d, c)
                }, l.goToMessage = function (a, b) {
                    return this.goToPath("/messages/" + a, b)
                }, l.goToObject = function (a, b, c) {
                    var d, e;
                    return null == b && (b = ""), l._setSubpage(b), a.id === l.currentUser.id && "user-settings" === b ? this.goToPath("/settings", c) : a.id === l.currentUser.id ? (e = "", b && (e += "/" + b), this.goToPath("/" + b, c)) : (d = h.pluralize(a.constructor.typeName.toLowerCase()), e = "/" + d + "/" + a.id, b && (e += "/" + b), this.goToPath(e, c))
                }, l.goToUserSettings = function () {
                    return this.goToObject(this.currentUser, "user-settings")
                }, l.goToUser = function (a, b, c) {
                    var d, e;
                    return null == b && (b = ""), a.id === this.currentUser.id ? this.goToRoot(b, c) : (d = angular.isString(a) ? a : a.id, e = "/users/" + d, b && (e += "/" + b), this.goToPath(e, c))
                }, l.goToPage = function (a, b) {
                    return this.goToObject(l.selectedObject, a, b)
                }, l.goToApp = function (a, b, c) {
                    var d, e, g, h;
                    return null == b && (b = this.selectedObject), g = "/teams/" + b.id + "/apps/" + a.id, "Safari" === window.bd.browser ? (d = "/app-authorization/#/" + a.id + "/team/" + b.id + "/platform", e = window.open(d, "appAuth", "width=850, height=600, location=0"), h = window.setInterval(function () {
                        try {
                            if (null == e.location.href && (window.clearInterval(h), f(function () {
                                return e.close(), null != b ? l.goToPath(g, c) : l.goToRoot(c)
                            }, 500)), (!e || e.closed) && null != h) return window.clearInterval(h)
                        } catch (a) {}
                    }, 100)) : null != b ? l.goToPath(g, c) : l.goToRoot(c)
                }, l.openMessageModal = function (a) {
                    return j.show("compose-message-modal", {
                        data: a
                    })
                }, l.logout = function () {
                    return d["delete"]("/v1/sessions/authentication").success(function () {
                        return e.location.href = "" + e.location.protocol + "//" + e.location.host + "/"
                    })
                }, l.refresh = function () {
                    return e.location.reload(!0)
                }, l.updateUnreadCounts = function (a) {
                    var b, c, d, e;
                    if (null != (null != a ? a.tags : void 0)) {
                        for (c = i.find("Team"), d = 0, e = c.length; e > d; d++) b = c[d], b.unreadCount = a.tags["_team." + b.id];
                        return l.currentUser.unreadCount = a.tags._inbox, l.currentUser.directUnreadCount = a.tags._direct
                    }
                }, l
            }
        ], this
    })
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Enums", []), a.factory("enums", function () {
        return {
            MEMBERSHIP_TYPE: {
                ADMIN: 1,
                MEMBER: 2
            },
            USER_STATUS: {
                PENDING: 0,
                ACTIVE: 1
            },
            EVENT_TYPE: {
                MESSAGE_NOT_FOUND: 0,
                CREATED_TEAM_MEMBERSHIP: 1,
                CREATED_DIRECT_MESSAGE: 2,
                CREATED_DIRECT_REPLY: 3,
                CREATED_TEAM_MESSAGE: 4,
                DELETED_TEAM_MEMBERSHIP: 5,
                CREATED_TEAM_REPLY: 6,
                UPDATED_TEAM_MEMBERSHIP: 7,
                UPDATED_TEAM: 8,
                UPDATED_USER: 9,
                DELETED_TEAM: 10,
                UPDATED_PLATFORM: 11,
                CREATED_HIGH_FIVE: 12,
                DELETED_HIGH_FIVE: 13,
                CREATED_SIDEBAR: 14,
                DELETED_SIDEBAR: 15,
                CREATED_SIDEBAR_REPLY: 16,
                DELETED_SIDEBAR_REPLY: 17,
                DELETED_MESSAGE: 18,
                CREATED_NOTIFICATION: 19,
                DELETED_NOTIFICATION: 20,
                CREATED_MENTION: 21,
                CREATED_USER_APPLICATION: 23,
                DELETED_USER_APPLICATION: 24,
                CREATED_TEAM_APPLICATION: 25,
                DELETED_TEAM_APPLICATION: 26,
                UPDATED_NOTIFICATION: 27,
                DELETED_REPLY: 28,
                CREATED_CHAT_MESSAGE: 30,
                USER_ONLINE: 31,
                MESSAGE_EVENT: 32,
                ADDED_TO_ADDRESS_BOOK: 35,
                REMOVE_FROM_ADDRESS_BOOK: 36,
                INSTALLED_TEAM_APPLICATION: 50,
                UNINSTALLED_TEAM_APPLICATION: 51,
                APP_DEV_INVITED: 151,
                APP_DEV_ADDED: 152,
                APP_DEV_REMOVED: 153,
                APP_MODIFIED: 161,
                APP_DELETED: 162
            },
            NOTIFICATION_TYPE: {
                USER_INVITED_TO_TEAM: 1,
                APP_DEV_INVITED: 151,
                PENDING_MESSAGE: 171,
                ADDED_TO_ADDRESS_BOOK: 172
            },
            DEV_TYPE: {
                ADMIN: 1,
                DEV: 2,
                TESTER: 3
            },
            DEV_STATUS: {
                ACTIVE: 1,
                PENDING: 2
            },
            RELATIONSHIP_TYPE: {
                NONE: 0,
                PENDING_CONTACT: 1,
                ADDED_BY: 2,
                MUTUAL: 3,
                BLOCKED: 4
            },
            CONNECT_TYPE: {
                EMAIL: 0,
                FACEBOOK: 1,
                GOOGLE: 2
            },
            HTTP_STATUS: {
                SUCCESS: 200,
                REDIRECTION: 300,
                UNAUTHORIZED: 401,
                NOT_FOUND: 404
            },
            fromString: function (a, b) {
                var c;
                return null != (c = this[a]) ? c[b.toUpperCase()] : void 0
            },
            toString: function (a, b) {
                var c, d, e;
                if (null == this[a]) return void 0;
                e = this[a];
                for (c in e)
                    if (d = e[c], b === d) return c
            }
        }
    })
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.EventHandler", ["SHIFT.Store", "SHIFT.Context", "SHIFT.Util", "SHIFT.Enums", "SHIFT.BrowserNotifications", "SHIFT.NotificationHandler"]), a.factory("eventHandler", ["$rootScope", "popover", "store", "context", "util", "shiftUtil", "enums", "truncateFilter", "browserNotifications", "notificationHandler",
        function (a, c, d, e, f, g, h, i, j, k) {
            var l, m, n, o, p, q;
            return m = _(h.EVENT_TYPE).invert(), p = _(h.NOTIFICATION_TYPE).invert(), l = h.EVENT_TYPE, q = [l.CREATED_DIRECT_MESSAGE, l.CREATED_DIRECT_REPLY, l.CREATED_TEAM_MESSAGE, l.CREATED_TEAM_REPLY, l.CREATED_HIGH_FIVE, l.DELETED_HIGH_FIVE, l.CREATED_SIDEBAR, l.DELETED_SIDEBAR, l.CREATED_SIDEBAR_REPLY, l.DELETED_SIDEBAR_REPLY, l.DELETED_MESSAGE, l.CREATED_MENTION, l.DELETED_REPLY, l.MESSAGE_EVENT], n = function (a) {
                var b, c, d;
                return null != a.text && a.text.length > 0 ? (c = g.renderAtMention(a.text, a.mentions), b = '"' + i(c, 30) + '"') : (d = _(a.attachments).pluck("type"), b = _(d).every(function (a) {
                    return "link" === a
                }) ? "has posted " + f.pluralize("link", a.attachments.length) : "has posted " + f.pluralize("file", a.attachments.length)), b
            }, o = function (a) {
                var b, c, d, h;
                return d = a.author.id === e.currentUser.id ? "you" : a.author.name, null != a.text && a.text.length > 0 ? (c = g.renderAtMention(a.text, a.mentions), d += a.author.id === e.currentUser.id ? "r" : "'s", b = "" + d + ' message "' + i(c, 30) + '"') : (h = _(a.attachments).pluck("type"), b = _(h).every(function (a) {
                    return "link" === a
                }) ? "" + f.pluralize("link", a.attachments.length) + " " + d + " posted" : "" + f.pluralize("file", a.attachments.length) + " " + d + " uploaded"), b
            }, {
                handleEvents: function (a, e) {
                    var f, g = this;
                    return f = function () {
                        var e, f, h, i, j, k, l, n, o;
                        for (o = [], j = 0, k = a.length; k > j; j++)
                            if (f = a[j], i = f.msg_type, h = g.messageType[m[i]], null != h) try {
                                if (null != h.storeGivenData && h.storeGivenData(f), f.isLive && "function" == typeof h.processLiveEvent && h.processLiveEvent(f), b.call(q, i) < 0) continue;
                                (null != (l = h.activityEventIsNeeded) ? l : function () {
                                    return !0
                                })(f) ? (d.save("ActivityEvent", {
                                    type: i,
                                    event: f
                                }), "activity-popover" === (null != (n = c.last()) ? n.popover.prop("id") : void 0) ? o.push(c.resize("activity-popover")) : o.push(void 0)) : o.push(void 0)
                            } catch (p) {
                                e = p, console.error(m[i] + " - " + e.message);
                                continue
                            } else console.error("Unable to handle message of type " + m[i]);
                        return o
                    }, d.fetchDependencies(e).then(f, function () {
                        return console.error("Failed to fetch all dependencies")
                    })
                },
                messageType: {
                    CREATED_TEAM_MEMBERSHIP: {
                        getDependedModelNames: ["User", "Team"],
                        processLiveEvent: function (a) {
                            var b, c, f, g;
                            return g = a.msg.user_id || a.msg.user.id, null != a.msg.user && (f = d.save("User", a.msg.user)), null == f && (f = d.findOne("User", g)), b = a.msg.team_id || a.msg.team.id, c = a.timestamp, d.save("TeamMembership", a.msg), d.remove("PendingMembership", {
                                teamId: b,
                                userId: g
                            }), d.remove("PendingMembership", {
                                teamId: b,
                                userId: f.primaryEmail.address
                            }), d.save("Connection", {
                                fromUserId: e.currentUser.id,
                                toUserId: g
                            })
                        },
                        constructor: function (a) {
                            var b, c, f, g, h, i, j, k;
                            return b = a.event.msg, i = a.event.msg.user_id || a.event.msg.user.id, c = a.event.msg.team_id || a.event.msg.team.id, g = d.findOne("User", i), null == g && (g = d.save("User", a.event.msg.user)), k = i === e.currentUser.id ? "have" : "has", j = g.displayName, h = g.image.icon, f = "" + k + " been added to team " + b.team.name, {
                                userName: j,
                                userIcon: h,
                                teamId: c,
                                text: f
                            }
                        }
                    },
                    CREATED_DIRECT_MESSAGE: {
                        storeGivenData: function (a) {
                            return a.message = d.findOne("Message", a.msg.message.id), null == a.message && (a.message = d.save("Message", angular.copy(a.msg.message))), a
                        },
                        processLiveEvent: function (b) {
                            var c, d;
                            return a.$broadcast("incomingMessage", b.message), e.updateUnreadCounts(null != b ? null != (c = b.msg) ? null != (d = c.meta) ? d.unread_counts : void 0 : void 0 : void 0)
                        },
                        constructor: function (a) {
                            var b, c, e, f, g, h, i, j, k;
                            return b = a.event.msg, e = b.message.id, c = d.findOne("Message", e), f = n(c), k = c.author.displayName, j = c.author.image.icon, g = c.addressedUsers.length - 1, h = g > 0 ? "you + " + g : "you", i = "" + f + " to " + h, {
                                messageId: e,
                                userName: k,
                                userIcon: j,
                                text: i
                            }
                        }
                    },
                    CREATED_DIRECT_REPLY: {
                        getDependencies: [{
                            Reply: ["Author"]
                        }, {
                            Message: ["Author"]
                        }],
                        storeGivenData: function (a) {
                            return a.reply = d.save("Reply", angular.copy(a.msg.reply)), a.message = d.findOne("Message", a.msg.message.id), null == a.message && (a.message = d.save("Message", angular.copy(a.msg.message))), a
                        },
                        processLiveEvent: function (b) {
                            var c, f, g, h;
                            return e.updateUnreadCounts(null != b ? null != (g = b.msg) ? null != (h = g.meta) ? h.unread_counts : void 0 : void 0 : void 0), f = b.msg.user_id || b.msg.reply.author_id, f !== e.currentUser.id ? (c = d.save("Message", angular.copy(b.msg.message)), a.$broadcast("incomingMessage", c)) : void 0
                        },
                        constructor: function (a) {
                            var b, c, d, e, f, g, h, i, j;
                            return b = a.event.msg, c = a.event.message, f = a.event.reply, d = c.id, e = o(c), h = "replied to " + e, g = f.author, j = g.displayName, i = g.image.icon, {
                                messageId: d,
                                userName: j,
                                userIcon: i,
                                text: h
                            }
                        },
                        activityEventIsNeeded: function (a) {
                            var b;
                            return b = a.msg.user_id || a.msg.reply.author_id, b !== e.currentUser.id
                        }
                    },
                    DELETED_TEAM_MEMBERSHIP: {
                        getDependencies: ["User"],
                        constructor: function (a) {
                            var b, c, e, f, g;
                            return b = a.event.msg, e = d.findOne("User", b.user.id), g = e.displayName, f = e.image.icon, c = "are no longer in the team " + b.team.name, {
                                userName: g,
                                userIcon: f,
                                text: c
                            }
                        },
                        processLiveEvent: function (b) {
                            var c, f, g;
                            return c = b.msg, g = c.user.id, f = c.team.id, g === e.currentUser.id ? (e.selectedObject.id === f && (a.$broadcast("disableConfirmOnLeave"), e.goToRoot(), a.$broadcast("showNotice", "You have been removed from team " + c.team.name)), e.currentUser.removeTeamData(f)) : d.remove("TeamMembership", {
                                userId: g,
                                teamId: f
                            })
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    CREATED_TEAM_REPLY: {
                        getDependencies: ["User", {
                            Message: ["Author"]
                        }],
                        storeGivenData: function (a) {
                            var b;
                            return a.message = d.findOne("Message", a.msg.message.id), null == a.message && (a.message = d.save("Message", a.msg.message)), b = a.msg.user_id || a.msg.user.id, a.user = d.findOne("User", b), null == a.user && (a.user = d.save("User", a.msg.user)), a
                        },
                        processLiveEvent: function (b) {
                            var c, f, g, h, i;
                            return e.updateUnreadCounts(null != b ? null != (h = b.msg) ? null != (i = h.meta) ? i.unread_counts : void 0 : void 0 : void 0), g = b.msg.user_id || b.msg.reply.author_id, g !== e.currentUser.id ? (f = d.save("Reply", b.msg.reply), c = d.save("Message", angular.copy(b.msg.message)), a.$broadcast("incomingMessage", c)) : void 0
                        },
                        constructor: function (a) {
                            var b, c, d, e, f, g, h, i;
                            return b = a.event.msg, c = a.event.message, g = a.event.user, i = g.displayName, h = g.image.icon, d = c.id, e = o(c), f = "replied to " + e + " in " + b.team.name, {
                                userName: i,
                                userIcon: h,
                                messageId: d,
                                text: f
                            }
                        },
                        activityEventIsNeeded: function (a) {
                            var b;
                            return b = a.msg.user_id || a.msg.reply.author_id, b !== e.currentUser.id
                        }
                    },
                    UPDATED_TEAM_MEMBERSHIP: {
                        getDependencies: ["User"],
                        processLiveEvent: function (a) {
                            var b, c, e;
                            return c = a.timestamp, e = d.findOne("User", a.msg.user.id), b = d.findOne("TeamMembership", "" + team.id + "+" + e.id), b.membershipType = a.msg.membership_type, b.updatedAt = c
                        },
                        activityEventIsNeeded: function (a) {
                            return a.msg.user.id === e.currentUser.id
                        },
                        constructor: function (a) {
                            var b, c, e, f, g, i, j;
                            return b = a.event.msg, c = function () {
                                switch (b.membership_type) {
                                case h.MEMBERSHIP_TYPE.ADMIN:
                                    return "admin";
                                case h.MEMBERSHIP_TYPE.MEMBER:
                                    return "member"
                                }
                            }(), g = d.findOne("User", b.user.id), j = g.displayName, i = g.image.icon, f = "role changed to " + c + " in " + b.team.name, e = {
                                you: "Your",
                                them: g.displayName
                            }, {
                                userName: j,
                                userIcon: i,
                                text: f,
                                subject: e
                            }
                        }
                    },
                    UPDATED_TEAM: {
                        storeGivenData: function (a) {
                            return a.team = d.save("Team", a.msg.team), a
                        },
                        constructor: function (a) {
                            return {
                                teamId: a.event.team.id,
                                teamIcon: a.event.team.icon,
                                teamColor: a.event.team.color,
                                teamSubject: !0,
                                subject: {
                                    them: a.event.team.name
                                },
                                text: "has been given a new look"
                            }
                        }
                    },
                    UPDATED_USER: {
                        activityEventIsNeeded: function () {
                            return !1
                        },
                        storeGivenData: function (a) {
                            return a.user = d.save("User", a.msg.user), a
                        }
                    },
                    DELETED_TEAM: {
                        storeGivenData: function (a) {
                            return a.team = a.msg.team, a
                        },
                        processLiveEvent: function (a) {
                            return e.currentUser.removeTeamData(a.team.id)
                        },
                        constructor: function (a) {
                            return {
                                teamIcon: a.event.team.icon,
                                teamColor: a.event.team.color,
                                teamSubject: !0,
                                subject: {
                                    them: a.event.team.name
                                },
                                text: "was archived"
                            }
                        }
                    },
                    CREATED_HIGH_FIVE: {
                        storeGivenData: function (a) {
                            return d.findOne("Message", a.msg.message.id) || d.save("Message", a.msg.message), a
                        },
                        getDependencies: ["Actor", {
                            Message: ["Author"]
                        }, {
                            Reply: ["Author"]
                        }],
                        processLiveEvent: function (a) {
                            var b, c, e, f, g, h, i, j;
                            return j = a.msg.actor_id, null != (h = a.msg.sidebar_reply) ? (g = h.id, e = "Reply", b = h.num_high_fives) : null != (f = a.msg.reply) ? (g = f.id, e = "Reply", b = f.num_high_fives) : null != (c = a.msg.message) && (g = c.id, e = "Message", b = c.num_high_fives), i = d.findOne(e, g), null != (null != i ? i.numHighFives : void 0) && (i.numHighFives = b), d.save("HighFive", {
                                replyId: g,
                                userId: j
                            })
                        },
                        constructor: function (a) {
                            var b, c, f, h, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y;
                            if (f = a.event.msg, k = f.message.id, b = d.findOne("User", f.actor_id), null == b && (b = d.save("User", f.actor)), t = b.displayName, s = b.image.icon, r = "high fived ", null != f.sidebar_reply) {
                                for (w = f.message.sidebars, u = 0, v = w.length; v > u; u++) m = w[u], m.id === f.sidebar_reply.sidebar_id && (p = m);
                                n = d.findOne("User", f.sidebar_reply.author.id), c = n.id === e.currentUser.id ? "your" : n.name + "'s", r += "" + c + " ", f.message.addressed_teams.length > 0 && (q = d.findOne("Team", f.message.addressed_teams[0])), 1 === (null != p ? null != (x = p.replies) ? x.length : void 0 : void 0) ? (o = g.renderAtMention(f.sidebar_reply.text, f.sidebar_reply.mentions), o = i(o, 30), r += 'sidebar "' + o + '" in') : (null != p ? null != (y = p.replies) ? y.length : void 0 : void 0) > 1 && (h = _.first(p.replies), o = g.renderAtMention(h.text, h.mentions), o = i(o, 30), r += 'reply to sidebar "' + o + '"'), r += " in " + q.name
                            } else null != f.reply ? (n = d.findOne("User", f.reply.author.id), c = n.id === e.currentUser.id ? "your" : n.name + "'s", o = g.renderAtMention(f.message.text, f.message.mentions), o = i(o, 30), r += "" + c + ' reply to "' + o + '"', f.message.addressed_teams.length > 0 && (q = d.findOne("Team", f.message.addressed_teams[0]), r += " in " + q.name)) : null != f.message && (l = g.renderAtMention(f.message.text, f.message.mentions), l = i(l, 30), f.message.addressed_teams.length > 0 ? (q = d.findOne("Team", f.message.addressed_teams[0]), r += '"' + l + '" in ' + q.name) : f.message.addressed_users.length > 0 && (j = d.findOne("User", f.message.author_id), c = j.id === e.currentUser.id ? "your" : j.name + "'s", r += "" + c + ' message "' + l + '"'));
                            return {
                                userName: t,
                                userIcon: s,
                                messageId: k,
                                text: r
                            }
                        }
                    },
                    DELETED_HIGH_FIVE: {
                        getDependencies: ["Actor"],
                        processLiveEvent: function (a) {
                            var b, c, e, f, g;
                            return b = a.msg.actor_id, null != a.msg.sidebar_reply_id ? (d.remove("HighFive", {
                                userId: b,
                                replyId: a.msg.sidebar_reply_id
                            }), null != (e = d.findOne("Reply", a.msg.sidebar_reply_id)) ? e.numHighFives-- : void 0) : null != a.msg.reply_id ? (d.remove("HighFive", {
                                userId: b,
                                replyId: a.msg.reply_id
                            }), null != (f = d.findOne("Reply", a.msg.reply_id)) ? f.numHighFives-- : void 0) : (c = a.msg.message, d.remove("HighFive", {
                                userId: b,
                                messageId: c.id
                            }), null != (g = d.findOne("Message", c.id)) ? g.numHighFives-- : void 0)
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    CREATED_SIDEBAR: {
                        getDependencies: [{
                            Sidebar: ["Creator"]
                        }],
                        processLiveEvent: function (b) {
                            var c, f, g;
                            return d.save("Sidebar", angular.copy(b.msg.sidebar)), c = d.save("Message", b.msg.message), a.$broadcast("incomingMessage", c), e.updateUnreadCounts(null != b ? null != (f = b.msg) ? null != (g = f.meta) ? g.unread_counts : void 0 : void 0 : void 0)
                        },
                        constructor: function (a) {
                            var b, c, e, f, h, j, k, l, m, n, o, p;
                            return c = a.event.msg, h = c.sidebar.replies[0], j = g.renderAtMention(h.text, h.mentions), f = i(j, 30), b = c.sidebar.addressed_to.length, k = "you", b > 1 && (k += " + " + (b - 1).toString()), l = c.message.addressed_teams.length > 0 ? " in " + d.findOne("Team", c.message.addressed_teams[0]).name : "", n = d.findOne("User", c.sidebar.creator.id), p = n.displayName, o = n.image.icon, e = c.sidebar.message_id, m = "sidebarred " + k + ' "' + f + '"' + l, {
                                userName: p,
                                userIcon: o,
                                messageId: e,
                                text: m
                            }
                        }
                    },
                    DELETED_SIDEBAR: {
                        getDependencies: [{
                            Sidebar: ["Creator"]
                        }],
                        processLiveEvent: function (a) {
                            var b, c;
                            return d.remove("Sidebar", a.msg.sidebar.id), e.updateUnreadCounts(null != a ? null != (b = a.msg) ? null != (c = b.meta) ? c.unread_counts : void 0 : void 0 : void 0)
                        },
                        constructor: function (a) {
                            var b, c, e, f, g, h;
                            return b = a.event.msg, f = d.find("User", b.sidebar.creator.id), h = f.displayName, g = f.image.icon, e = "removed a sidebar", c = b.sidebar.message_id, {
                                userName: h,
                                userIcon: g,
                                text: e,
                                messageId: c
                            }
                        }
                    },
                    CREATED_SIDEBAR_REPLY: {
                        getDependencies: [{
                            Sidebar_reply: ["Author"]
                        }],
                        processLiveEvent: function (b) {
                            var c, f, g, h;
                            return f = d.save("Reply", angular.copy(b.msg.sidebar_reply)), c = d.findOne("Message", b.msg.message_id), c.updatedAt = f.updatedAt, c.read = !1, a.$broadcast("incomingMessage", c), e.updateUnreadCounts(null != b ? null != (g = b.msg) ? null != (h = g.meta) ? h.unread_counts : void 0 : void 0 : void 0)
                        },
                        constructor: function (a) {
                            var b, c, e, f, h, j, k, l, m, n, o, p, q;
                            return c = a.event.msg, o = d.findOne("User", c.sidebar_reply.author.id), j = d.findOne("Sidebar", c.sidebar_id), e = d.findOne("Message", c.message_id), b = d.findOne("User", c.sidebar_creator.id), k = g.renderAtMention(j.replies[0].text, j.replies[0].mentions), h = i(k, 30), l = b.displayName, m = e.addressedTeams.length > 0 ? " in " + d.findOne("Team", e.addressedTeams[0]).name : "", n = "replied to " + l + "'s sidebar \"" + h + '"' + m, q = o.displayName, p = o.image.icon, f = c.message_id, {
                                userName: q,
                                userIcon: p,
                                text: n,
                                messageId: f
                            }
                        },
                        activityEventIsNeeded: function (a) {
                            return null != d.findOne("Sidebar", a.msg.sidebar_id)
                        }
                    },
                    DELETED_SIDEBAR_REPLY: {
                        processLiveEvent: function (b) {
                            var c;
                            return c = d.findOne("Reply", b.msg.sidebar_reply.id), null != c ? (d.remove("Reply", c.id), d.remove("ActivityEvent", {
                                replyId: c.id
                            }), a.$broadcast("sidebarReplyWasDeleted", c)) : void 0
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    INSTALLED_TEAM_APPLICATION: {
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    DELETED_TEAM_APPLICATION: {
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    UNINSTALLED_TEAM_APPLICATION: {
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    CREATED_TEAM_APPLICATION: {
                        storeGivenData: function (a) {
                            return a.application = d.save("Application", a.msg.application), a
                        },
                        constructor: function (a) {
                            var b;
                            return b = a.event.msg, {
                                teamId: b.team.id,
                                applicationId: b.application.id,
                                teamIcon: b.team.icon,
                                teamColor: b.team.color,
                                teamSubject: !0,
                                text: "installed " + b.application.name,
                                subject: {
                                    them: b.team.name
                                }
                            }
                        }
                    },
                    MESSAGE_EVENT: {
                        getDependencies: ["Actor", "Message", "User_Added"],
                        storeGivenData: function (a) {
                            return a.actor = d.findOne("User", a.msg.actor_id), null == a.actor && (a.actor = d.save("User", a.msg.actor)), a.added = d.findOne("User", a.msg.user_added_id), null == a.added && (a.added = d.save("User", a.msg.user_added)), a.message = d.findOne("Message", a.msg.message.id), null == a.message && (a.message = d.save("Message", a.msg.message)), a
                        },
                        processLiveEvent: function (a) {
                            var b;
                            return b = angular.copy(a.msg.message), b.isNew = a.actor.id !== e.currentUser.id, a.message = d.save("Message", b)
                        },
                        constructor: function (a) {
                            var b, c, d, f, g, h, i;
                            return b = a.event.msg, g = e.currentUser.id === a.event.added.id ? "you" : a.event.added.displayName, d = a.event.message.author.id === e.currentUser.id ? "your" : "a", i = a.event.actor.displayName, h = a.event.actor.image.icon, c = b.message.id, f = "added " + g + " to " + d + " message.", {
                                userName: i,
                                userIcon: h,
                                messageId: c,
                                text: f
                            }
                        }
                    },
                    CREATED_TEAM_MESSAGE: {
                        getDependencies: [{
                            Message: ["Author"]
                        }, "Team"],
                        storeGivenData: function (a) {
                            var b, c, e;
                            return c = a.msg.message, a.message = d.findOne("Message", c.id), null == a.message && (a.message = d.save("Message", angular.copy(c))), b = c.author_id, (e = a.message.authorType) && (a.author = d.findOne(f.capitalize(e), b)), a
                        },
                        processLiveEvent: function (b) {
                            var c, d;
                            return a.$broadcast("incomingMessage", b.message), e.updateUnreadCounts(null != b ? null != (c = b.msg) ? null != (d = c.meta) ? d.unread_counts : void 0 : void 0 : void 0)
                        },
                        constructor: function (a) {
                            var b, c, e, f, g, h, i, j, k;
                            return c = a.event.msg, b = a.event.author, f = c.message.id, e = d.findOne("Message", f), h = d.findOne("Team", c.team.id), g = n(e), k = null != b.displayName ? b.displayName : b.name, j = b.image.icon, i = "" + g + " to " + h.name, {
                                messageId: f,
                                userName: k,
                                userIcon: j,
                                text: i
                            }
                        }
                    },
                    DELETED_MESSAGE: {
                        processLiveEvent: function (b) {
                            var c, f, g, h;
                            return f = b.msg.message_id, c = d.findOne("Message", f), d.remove("Message", f), d.remove("ActivityEvent", {
                                messageId: f
                            }), d.remove("FollowUp", {
                                messageId: f
                            }), null != c && a.$broadcast("messageWasDeleted", c), e.updateUnreadCounts(null != b ? null != (g = b.msg) ? null != (h = g.meta) ? h.unread_counts : void 0 : void 0 : void 0)
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    CREATED_NOTIFICATION: {
                        getDependencies: function (a) {
                            return k.getNotificationDependencies(a.msg)
                        },
                        processLiveEvent: function (a) {
                            return a.msg.action = "create", k.handleNotifications([a.msg], "create")
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    DELETED_NOTIFICATION: {
                        processLiveEvent: function (a) {
                            var b, c, e, f, g, h;
                            for (g = a.msg.ids, h = [], e = 0, f = g.length; f > e; e++) b = g[e], c = d.findOne("Notification", b), null != c ? (d.remove("PendingMembership", {
                                teamId: c.teamId,
                                userId: c.userId
                            }), h.push(d.remove("Notification", b))) : h.push(void 0);
                            return h
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    UPDATED_NOTIFICATION: {
                        getDependencies: function (a) {
                            return k.getNotificationDependencies(a.msg)
                        },
                        processLiveEvent: function (a) {
                            return a.msg.action = "update", k.handleNotifications([a.msg])
                        },
                        activityEventIsNeeded: function () {
                            return !1
                        }
                    },
                    DELETED_REPLY: {
                        storeGivenData: function (a) {
                            return a.reply = d.findOne("Reply", a.msg.reply_id), a
                        },
                        processLiveEvent: function (b) {
                            var c, f, g;
                            return e.updateUnreadCounts(null != b ? null != (f = b.msg) ? null != (g = f.meta) ? g.unread_counts : void 0 : void 0 : void 0), null != b.reply ? (c = b.reply.id, b.reply.message.numReplies--, d.remove("Reply", c), d.remove("ActivityEvent", {
                                replyId: c
                            }), a.$broadcast("replyWasDeleted", b.reply)) : void 0
                        }
                    },
                    CREATED_CHAT_MESSAGE: {
                        getDependencies: ["Chat"],
                        activityEventIsNeeded: function () {
                            return !1
                        },
                        storeGivenData: function (a) {
                            return a.chatMessage = d.save("ChatMessage", angular.copy(a.msg)), a
                        },
                        processLiveEvent: function (b) {
                            var c, d;
                            return d = b.chatMessage, c = d.chat, c.lastReceivedTime = d.createdAt, a.$broadcast("chat-message-received", c), j.createNotification("", d.author.displayName, b.chatMessage.text, c)
                        }
                    },
                    USER_ONLINE: {
                        getDependencies: ["User"],
                        activityEventIsNeeded: function () {
                            return !1
                        },
                        processLiveEvent: function (b) {
                            var c, f;
                            return f = d.findOne("User", b.msg.user_id), f.online = b.msg.online, f.id !== e.currentUser.id && (c = f.online ? "user-online" : "user-offline", a.$broadcast(c, f)), f.online && f.id === e.currentUser.id ? d.fetchAll("Chat", {
                                complete: function () {
                                    var a, b, c, e, f;
                                    for (e = d.find("Chat"), f = [], b = 0, c = e.length; c > b; b++) a = e[b], f.push(a.initialMessagesLoaded = !1);
                                    return f
                                }
                            }) : void 0
                        }
                    },
                    REMOVE_FROM_ADDRESS_BOOK: {
                        activityEventIsNeeded: function () {
                            return !1
                        },
                        storeGivenData: function (a) {
                            return d.save("User", a.msg.user)
                        }
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Filters", ["SHIFT.Util"]), a.filter("shortTimestamp", function () {
        var a;
        return a = function (a, b) {
            return 1 !== a && (b = "" + b + "s"), "" + a + " " + b + " ago"
        },
        function (b) {
            var c, d, e, f, g, h, i, j;
            return b = +b, c = Math.round(Date.now() / 1e3), h = c - b, 45 > h ? "just now" : 120 > h ? "1m" : (j = Math.floor(h / 31536e3), j > 0 ? a(j, "year") : (g = Math.floor(h / 2678400), g > 0 ? a(g, "month") : (i = Math.floor(h / 604800), i > 0 ? a(i, "week") : (d = Math.floor(h / 86400), d > 0 ? "" + d + "d" : (e = Math.floor(h / 3600), e > 0 ? "" + e + "h" : (f = Math.floor(h / 60), f > 0 ? "" + f + "m" : "" + h + "s"))))))
        }
    }), a.filter("highlight", [
        function () {
            return function (a, b) {
                var c, d, e, f, g, h, i, j, k, l;
                if (_.isEmpty(b)) return a;
                for (f = a.split(" "), h = b.split(/\s|\,/), c = [], i = 0, k = f.length; k > i; i++) {
                    for (e = f[i], d = !1, j = 0, l = h.length; l > j; j++)
                        if (g = h[j], e.toLowerCase() === g.toLowerCase()) {
                            d = !0;
                            break
                        }
                    c.push(d ? '<span class="search-highlight">' + e + "</span>" : e)
                }
                return c.join(" ")
            }
        }
    ]), a.filter("truncate", function () {
        return function (a, b, c) {
            return null == c && (c = "..."), a.length > b - c.length ? a.slice(0, b - c.length) + c : a
        }
    })
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.HistoricEvents", ["SHIFT.Store", "SHIFT.Context", "SHIFT.Enums", "SHIFT.Initialize", "SHIFT.Api"]), a.factory("historicEvents", ["$rootScope", "context", "store", "enums", "eventHandler", "api",
        function (a, b, c, d, e, f) {
            return {
                processAllEvents: function (a) {
                    var b, f, g, h, i, j, k, l, m, n, o;
                    for (null == a && (a = []), b = {}, l = _(d.EVENT_TYPE).invert(), n = 0, o = a.length; o > n; n++)
                        if (g = a[n], i = l[g.msg_type], k = e.messageType[i], null != k) {
                            f = k.getDependencies || [], h = c.checkDependencies([g.msg], f, !0);
                            for (j in h) m = h[j], b[j] = _(b[j] || []).union(m)
                        } else console.error("Unable to handle message of type " + l[g.msg_type] + " in historic events", g);
                    return e.handleEvents(a, b)
                },
                getHistoricEvents: function (a) {
                    var b = this;
                    return null == a && (a = !1), f.fetchActivityEvents({
                        success: function (d) {
                            var e, f, g, h, i, j, k;
                            if (f = d.data, _(f).each(function (a) {
                                var b, c;
                                return null != (b = a.msg) ? null != (c = b.message) ? c.read = !0 : void 0 : void 0
                            }), i = [], a)
                                for (g = !1, h = _(c.find("ActivityEvent")).chain().sortBy("updatedAt").last().value(), j = 0, k = f.length; k > j; j++) {
                                    if (e = f[j], e.msg_type === h.msg_type && e.timestamp === h.timestamp) {
                                        g = !0;
                                        break
                                    }
                                    i.push(e)
                                } else i = f;
                            return b.processAllEvents(i)
                        }
                    })
                }
            }
        }
    ]), a.config(["initializeProvider",
        function (a) {
            return a.init({
                invoke: ["historicEvents",
                    function (a) {
                        return a.getHistoricEvents()
                    }
                ]
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.HistoricNotifications", ["SHIFT.Store", "SHIFT.Context", "SHIFT.Enums", "SHIFT.Initialize", "SHIFT.Api", "SHIFT.NotificationHandler"]), a.factory("historicNotifications", ["$rootScope", "context", "store", "enums", "notificationHandler", "api",
        function (a, b, c, d, e, f) {
            return {
                getHistoricNotifications: function () {
                    return f.fetchAllNotifications({
                        success: function (a) {
                            var b;
                            return b = ["Inviter", "User", "Application", "Invitee", "Author"], c.resolveDependencies(a.data, b, !0).then(function () {
                                return e.handleNotifications(a.data)
                            })
                        },
                        complete: function () {
                            return a.$broadcast("notificationsAreLoaded")
                        }
                    })
                }
            }
        }
    ]), a.config(["initializeProvider",
        function (a) {
            return a.init({
                invoke: ["historicNotifications",
                    function (a) {
                        return a.getHistoricNotifications()
                    }
                ]
            })
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Initialize", []), a.provider("initialize", function () {
        return {
            toInvokes: [],
            init: function (a) {
                return null == a && (a = {}), null == a.priority && (a.priority = 0), null == a.invoke && (a.invoke = angular.noop), null != this.toInvokes ? this.toInvokes.push(a) : angular.injector().invoke(a.invoke)
            },
            $get: function () {
                return this
            }
        }
    }), angular.module("SHIFT").run(["$injector", "$q", "initialize", "context", "api", "router", "store",
        function (a, b, c, d, e, f, g) {
            var h;
            return h = function () {
                var b, d, e, f;
                for (c.toInvokes.sort(function (a, b) {
                    return b.priority - a.priority
                }), f = c.toInvokes, d = 0, e = f.length; e > d; d++) b = f[d], a.invoke(b.invoke);
                return c.toInvokes = null
            }, null != window.CURRENT_USER ? (d.currentUser = g.save("User", JSON.parse(window.CURRENT_USER).data[0]), b.all([e.fetchAllTeams(), e.fetchAllContacts()]).then(h)) : d.currentUser = g.save("User", {
                id: "currentTestUser"
            }), f.start()
        }
    ])
}.call(this),
function () {
    var a, b = {}.hasOwnProperty;
    a = angular.module("SHIFT.LarryKing", ["SHIFT.Context", "SHIFT.Store", "SHIFT.Util", "SHIFT.Enums", "SHIFT.Initialize", "SHIFT.LiveEvents", "SHIFT.Api"]), a.factory("larryKing", ["$rootScope", "store", "context", "util", "enums", "api", "liveEvents", "historicEvents",
        function (a, c, d, e, f, g, h, i) {
            return {
                connect: function () {
                    var c, e = this;
                    return c = this, this.hasDisconnected = !1, g.fetchConfig({
                        success: function (g) {
                            return e.url = g.data[0].lk_url, $script("" + e.url + "/socket.io/socket.io.js", function () {
                                var g, j, k, l, m, n;
                                if ("undefined" != typeof io && null !== io) {
                                    m = io.connect(e.url), g = function (a, b) {
                                        return m.on(a, function (a) {
                                            return c.log && console.log("lk log", b, a), null != a ? (a.isLive = !0, h.processLiveEvents(b, a)) : void 0
                                        })
                                    }, n = f.EVENT_TYPE;
                                    for (k in n) b.call(n, k) && (j = n[k], g(j, k));
                                    return m.on("disconnect", function () {
                                        return c.log && console.log("lk log", "disconnect"), e.hasDisconnected = !0, e.previousOnlineStatus = d.currentUser.chatActive, d.currentUser.chatActive = !1
                                    }), l = !0, m.on("connect", function () {
                                        return c.log && console.log("lk log", "connect"), a.$apply(function () {
                                            return l && (e.sendOnlineStatus(!0), d.currentUser.chatActive = !0, l = !1), e.hasDisconnected ? (i.getHistoricEvents(!0), e.hasDisconnected = !1, e.sendOnlineStatus(e.previousOnlineStatus), d.currentUser.chatActive = e.previousOnlineStatus) : void 0
                                        })
                                    }), e.socket = m, m
                                }
                            })
                        }
                    })
                },
                sendApiRequest: function (a) {
                    var b;
                    return null != (b = this.socket) ? b.emit("api_message", a) : void 0
                },
                sendChatMessage: function (a, b) {
                    var c;
                    return b.chat_id = a.id, null != (c = this.socket) ? c.emit("new_chat_message", b) : void 0
                },
                sendOnlineStatus: function (a) {
                    var b;
                    return null == a && (a = !0), null != (b = this.socket) ? b.emit("online_status", a) : void 0
                },
                logout: function () {
                    var a;
                    return null != (a = this.socket) && a.emit("logout"), d.logout()
                },
                log: !1
            }
        }
    ]), a.config(["initializeProvider",
        function (a) {
            return a.init({
                invoke: ["larryKing",
                    function (a) {
                        return a.connect()
                    }
                ]
            })
        }
    ])
}.call(this),
function () {
    var a, b = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.LiveEvents", ["SHIFT.Store", "SHIFT.EventHandler", "SHIFT.Context", "SHIFT.Enums"]), a.factory("liveEvents", ["$rootScope", "store", "context", "eventHandler", "enums",
        function (a, c, d, e, f) {
            return {
                processLiveEvents: function (b, d) {
                    var f, g, h;
                    if (this.keepInSync(b, d), h = e.messageType[b], null == h) throw console.error("live event data is", d), "Unable to handle message of type " + b + " in live events";
                    return f = h.getDependencies, g = c.checkDependencies([d.msg], f, !0), a.$apply(function () {
                        return e.handleEvents([d], g)
                    })
                },
                keepInSync: function (a, c) {
                    var e, f, g, h;
                    if (b.call(this.eventsAffectingUnreadCounts, a) >= 0) {
                        if (e = (null != (f = c.msg) ? f.unread_counts : void 0) || (null != (g = c.msg) ? null != (h = g.meta) ? h.unread_counts : void 0 : void 0), null == e) return;
                        return d.updateUnreadCounts(e)
                    }
                },
                eventsAffectingUnreadCounts: [f.EVENT_TYPE.CREATED_DIRECT_MESSAGE, f.EVENT_TYPE.CREATED_DIRECT_REPLY, f.EVENT_TYPE.CREATED_TEAM_MESSAGE, f.EVENT_TYPE.DELETED_TEAM_MEMBERSHIP, f.EVENT_TYPE.CREATED_TEAM_REPLY, f.EVENT_TYPE.DELETED_TEAM, f.EVENT_TYPE.CREATED_SIDEBAR_REPLY, f.EVENT_TYPE.DELETED_SIDEBAR_REPLY, f.EVENT_TYPE.DELETED_MESSAGE, f.EVENT_TYPE.CREATED_MENTION, f.EVENT_TYPE.DELETED_REPLY, f.EVENT_TYPE.MESSAGE_EVENT]
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.NotificationHandler", ["SHIFT.Store", "SHIFT.Context", "SHIFT.Util", "SHIFT.Enums"]), a.factory("notificationHandler", ["$rootScope", "store", "context", "util", "enums",
        function (a, b, c, d, e) {
            var f;
            return f = _(e.NOTIFICATION_TYPE).invert(), {
                getNotificationDependencies: function () {
                    var a, b, c;
                    if (b = f[data.type], c = this.notificationType[b], null == c) throw "Unable to handle notification of type " + notificationType[type];
                    return a = c.getDependencies, _(a).isFunction() ? a() : a
                },
                handleNotifications: function (a) {
                    var c, d, e, g, h, i;
                    for (h = 0, i = a.length; i > h; h++)
                        if (d = a[h], g = d.type, e = this.notificationType[f[g]], null != e) {
                            if (null != e.storeGivenData && (d = e.storeGivenData(d)), null != e.shouldProcessNotification && !e.shouldProcessNotification(d)) return;
                            switch (null != e.processLiveNotification && e.processLiveNotification(d), d.action) {
                            case "update":
                                "function" == typeof e.onBeforeUpdate && e.onBeforeUpdate(d), b.save("Notification", {
                                    type: g,
                                    notification: d
                                });
                                break;
                            default:
                                "function" == typeof e.onBeforeCreate && e.onBeforeCreate(d), c = angular.isArray(d.id) ? d.id[0] : d.id, b.save("Notification", {
                                    type: g,
                                    notification: d,
                                    id: c
                                })
                            }
                        } else console.error("Unable to handle notification of type " + f[g])
                },
                notificationType: {
                    USER_INVITED_TO_TEAM: {
                        getDependencies: [],
                        storeGivenData: function (a) {
                            var c, d;
                            return null != (null != (d = a.data.invitation) ? d.team : void 0) && (c = a.data.invitation, a.team = b.save("Team", c.team), a.inviter = b.save("User", c.inviter)), a
                        },
                        shouldProcessNotification: function (a) {
                            return a.data.invitation.user.id === c.currentUser.id
                        },
                        onBeforeCreate: function (a) {
                            var c;
                            return c = a.data.invitation, b.save("PendingMembership", c)
                        },
                        onBeforeUpdate: function (a) {
                            var c;
                            return c = a.data.invitation, b.save("PendingMembership", c)
                        },
                        constructor: function (a) {
                            return {
                                createdAt: a.notification.data.invitation.created_at,
                                teamId: a.notification.team.id,
                                from: a.notification.team.name,
                                to: "You",
                                userId: a.notification.inviter.id,
                                authorType: "User",
                                text: "invited you to join the team " + a.notification.team.name,
                                clickToView: !1,
                                buttons: [{
                                    label: "Accept",
                                    action: "acceptTeamInvite",
                                    type: "primary green"
                                }, {
                                    label: "Decline",
                                    action: "confirmedDeclineTeamInvite",
                                    type: "ignore"
                                }]
                            }
                        }
                    },
                    APP_DEV_INVITED: {
                        getDependencies: [],
                        storeGivenData: function (a) {
                            return a.inviter = b.save("User", a.data.invited_by), a.application = b.save("Application", a.data.app), a
                        },
                        constructor: function (a) {
                            var b, c, d, f;
                            return f = a.notification.inviter, b = a.notification.application, c = a.notification.data.dev_type, d = function () {
                                switch (c) {
                                case e.DEV_TYPE.ADMIN:
                                    return "Administrator";
                                case e.DEV_TYPE.DEV:
                                    return "Developer";
                                case e.DEV_TYPE.TESTER:
                                    return "Tester"
                                }
                            }(), {
                                createdAt: new Date,
                                appId: b.id,
                                text: "would like to add you as a " + d + " to " + b.name,
                                userId: f.id,
                                authorType: "User",
                                clickToView: !1,
                                buttons: [{
                                    label: "Accept",
                                    action: "acceptAppDevInvite",
                                    type: "primary green"
                                }, {
                                    label: "Decline",
                                    action: "confirmedDeclineAppDevInvite",
                                    type: "secondary"
                                }]
                            }
                        }
                    },
                    PENDING_MESSAGE: {
                        getDependencies: [],
                        storeGivenData: function (a) {
                            return b.fetchOne("User", a.data.from_user_id), a
                        },
                        processLiveNotification: function (c) {
                            return b.fetchOne("Message", c.data.message_id, {
                                dependencies: ["Author"],
                                success: function (b) {
                                    return a.$broadcast("incomingMessage", b.models[0])
                                }
                            })
                        },
                        constructor: function (a) {
                            return {
                                createdAt: a.notification.created_at,
                                userId: a.notification.data.from_user_id,
                                authorType: "User",
                                messageId: a.notification.data.message_id,
                                text: "sent you a message",
                                clickToView: !0,
                                buttons: [{
                                    label: "Add Contact",
                                    action: "acceptPendingMessage",
                                    type: "primary green"
                                }, {
                                    label: "Block Contact",
                                    action: "blockContact",
                                    type: "info"
                                }]
                            }
                        }
                    },
                    ADDED_TO_ADDRESS_BOOK: {
                        getDependencies: [],
                        storeGivenData: function (a) {
                            return b.fetchOne("User", a.data.from_user_id), a
                        },
                        constructor: function (a) {
                            return {
                                createdAt: a.notification.created_at,
                                userId: a.notification.data.from_user_id,
                                authorType: "User",
                                text: "added you as a contact.",
                                clickToView: !1,
                                buttons: [{
                                    label: "Add Contact",
                                    action: "addContact",
                                    type: "primary green"
                                }, {
                                    label: "Ignore",
                                    action: "ignoreNotification",
                                    type: "ignore"
                                }]
                            }
                        }
                    }
                }
            }
        }
    ])
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT.Routes", ["Bangular.View", "SHIFT.Initialize", "SHIFT.Store", "SHIFT.Context", "SHIFT.Api"]), a.run(["$location", "$rootScope", "initialize", "store", "router", "context", "api",
        function (a, b, c, d, e, f) {
            var g, h;
            return g = !1, h = function (a) {
                return a.substr(a.indexOf("#") + 1)
            }, b.$on("enableConfirmOnLeave", function () {
                return g = !0
            }), b.$on("disableConfirmOnLeave", function () {
                return g = !1
            }), b.$on("$locationChangeStart", function (c, d) {
                return g ? (c.preventDefault(), b.$broadcast("showDialog", {
                    message: "Are you sure you want to leave this page without sending your message?",
                    confirmText: "Leave",
                    cancelText: "Stay",
                    confirm: function () {
                        return a.path(h(d)), b.$broadcast("resetMessageInput"), g = !1
                    }
                })) : void 0
            }), e.on("/messages/:messageId(/sidebars)(/:sidebarId)", function (a, c) {
                var e, g;
                return e = d.findOne("Message", a), g = function (a) {
                    return f.selectedMessage = a, f.selectedPage = "single-message", f._setSubpage(null != c ? "sidebar" : "normal"), b.$broadcast("scrollToTopBody")
                }, null != e ? g(e) : d.fetchOne("Message", a, {
                    dependencies: ["Author"],
                    success: function (a) {
                        return g(a.models[0])
                    },
                    error: function () {
                        return g(null)
                    }
                })
            }), e.on("/users/:id(/:pageName)", function (c, e) {
                var g, h, i;
                return f.currentUser.id === c ? (f.goToRoot(e, g), void 0) : (g = a.search(), h = function (a) {
                    return f.selectedObject = a, f.selectedPage = "main", f.selectedSubpage = e, b.$broadcast("scrollToTopBody")
                }, i = d.findOne("User", c), null != i ? h(i) : d.fetchOne("User", c, {
                    success: function (a) {
                        return h(a.models[0])
                    },
                    error: function () {
                        return f.goToRoot()
                    }
                }))
            }), e.on("/teams/:teamId(/:pageName)", function (b, e) {
                return null == e && (e = "inbox"), c.init({
                    invoke: function () {
                        var c, g;
                        return g = d.findOne("Team", b), c = a.search(), null != g ? (f.selectedObject = g, f.selectedPage = "main", f.selectedSubpage = e) : d.fetchOne("Team", b, {
                            success: function (a) {
                                return g = d.save("Team", a.data[0]), f.selectedObject = g, f.selectedPage = "main", f.selectedSubpage = e
                            },
                            error: function () {
                                return f.goToRoot()
                            }
                        })
                    }
                })
            }), e.on("/:pageName", function (b) {
                var c;
                return f.selectedObject = f.currentUser, c = a.search(), "settings" === b ? f.selectedPage = "user-settings" : (f.selectedPage = "main", f.selectedSubpage = b)
            }), e.on("/", function () {
                var b;
                return b = _(a.search()).keys(), b.length ? void 0 : e.navigate("/inbox")
            }), e.onAll(function (a) {
                return e.getHandlers(a).length ? void 0 : e.navigate("/")
            })
        }
    ])
}.call(this),
function () {
    var a, b = {}.hasOwnProperty,
        c = function (a, c) {
            function d() {
                this.constructor = a
            }
            for (var e in c) b.call(c, e) && (a[e] = c[e]);
            return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
        }, d = [].slice,
        e = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a) return b;
            return -1
        };
    a = angular.module("SHIFT.Store", ["SHIFT.Models"]), a.provider("store", function () {
        var a;
        return a = this, this.$get = ["$http", "$q", "util", "$window",
            function (a, f, g) {
                var h, i;
                return Function.prototype.property = function (a, b) {
                    return Object.defineProperty(this.prototype, a, b)
                }, h = function () {
                    function a(a, b) {
                        var c, d, e, f;
                        if (this.store = b, this.save(a, !0), null != this.store) {
                            if (null != this.constructor.hasOne) {
                                e = this.constructor.hasOne;
                                for (c in e) d = e[c], this.addOneToOneRelationship(c, d)
                            }
                            if (null != this.constructor.hasMany) {
                                if (null == this.id) throw "Model of type " + this.constructor.typeName + " supports one-to-many relationships, but an\nobject of that type was created without an id. An id is required for objects\nwith one-to-many relationships.";
                                f = this.constructor.hasMany;
                                for (c in f) d = f[c], this.addOneToManyRelationship(c, d)
                            }
                        }
                    }
                    return a.typeName = "Model", a.prototype.save = function (a, c) {
                        var d, e, f, h;
                        null == c && (c = !1), h = [];
                        for (d in a) b.call(a, d) && (e = a[d], d = g.toCamelCase(d), this[d] = e, c && "Id" === d.slice(-2) ? (d = d.slice(0, -2), null == (null != (f = this.constructor.hasOne) ? f[d] : void 0) ? h.push(this.addOneToOneRelationship(d, g.capitalize(d))) : h.push(void 0)) : h.push(void 0));
                        return h
                    }, a.prototype.addOneToOneRelationship = function (a, b) {
                        var c, d, e = this;
                        return (d = this.constructor).oneToOneRelationships || (d.oneToOneRelationships = {}), c = this.constructor.oneToOneRelationships, null == c[a] ? (c[a] = b, function (a, b) {
                            var c;
                            return c = "" + b + "Id", Object.defineProperty(e.constructor.prototype, b, {
                                get: function () {
                                    return this.store._getById(a, this[c])
                                },
                                set: function (a) {
                                    return null != (null != a ? a.id : void 0) ? this[c] = a.id : void 0
                                }
                            })
                        }(b, a)) : void 0
                    }, a.prototype.addOneToManyRelationship = function (a, b) {
                        var c, d;
                        if ("Model" === this.constructor.typeName) throw "Tried to define a one-to-many relationship { " + a + ": " + b + " } on a model class                 that doesn't define a type name. Make sure to set @typeName to be the name of the                 model class.";
                        return c = {}, d = g.uncapitalize(this.constructor.typeName) + "Id", c[d] = this.id, this[a] = this.store.findWithPersistence(b, c)
                    }, a
                }(), i = function () {
                    function i() {
                        this.Model = h, this.dataMap = {}, this.models = {}, this.persistentQueries = {}
                    }
                    return i.prototype.fetchAll = function (a, b) {
                        return this._rest("GET", a, null, null, b)
                    }, i.prototype.fetchOne = function (a, b, c) {
                        return this._rest("GET", a, b, null, c)
                    }, i.prototype.update = function (a, b, c, d) {
                        return this._rest("PUT", a, b, c, d)
                    }, i.prototype.create = function (a, b, c) {
                        return this._rest("POST", a, null, b, c)
                    }, i.prototype["delete"] = function (a, b, c) {
                        return this._rest("DELETE", a, b, null, c)
                    }, i.prototype._rest = function (b, c, d, e, f) {
                        var h, i, j, k, l, m, n = this;
                        return null == f && (f = {}), l = null != f.url ? f.url : null != d ? "/v1/" + g.pluralize(g.toSnakeCase(c).toLowerCase()) + "/" + d : "/v1/" + g.pluralize(g.toSnakeCase(c).toLowerCase()), f.headers || (f.headers = {}), "DELETE" === b && (f.headers["Content-Length"] = 0), null != f.query && (j = function () {
                            var a, b;
                            a = f.query, b = [];
                            for (i in a) m = a[i], b.push("" + i + "=" + m);
                            return b
                        }(), l += "?" + j.join("&")), k = function (a, e, g, h) {
                            var i;
                            return i = function (b) {
                                return null == b && (b = []), j = {
                                    data: a.data,
                                    response: a,
                                    status: e,
                                    headers: g,
                                    config: h,
                                    models: b
                                }, "function" == typeof f.success && f.success(j), "function" == typeof f.complete ? f.complete(j) : void 0
                            }, "DELETE" === b ? (n.remove(c, d), i()) : n.resolveDependencies(a.data, f.dependencies || [], !0).then(function () {
                                var b;
                                return b = n.save(c, a.data), i(b)
                            })
                        }, h = function (a, b, c, d) {
                            return j = {
                                data: a.data,
                                response: a,
                                status: b,
                                headers: c,
                                config: d
                            }, "function" == typeof f.error && f.error(j), "function" == typeof f.complete ? f.complete(j) : void 0
                        }, f.method = b, f.url = l, null != e && (f.data = g.convertKeysToSnakeCase(e)), a(f).success(k).error(h)
                    }, i.prototype.save = function (a, b, d) {
                        var e, f, g, h, i, j, k, l, m;
                        if (null == d && (d = !0), null == b) return null;
                        if (k = null, (l = this.models)[a] || (l[a] = function (a) {
                            function b() {
                                return m = b.__super__.constructor.apply(this, arguments)
                            }
                            return c(b, a), b
                        }(this.Model)), b instanceof Array) i = b, this.find(a, [
                            function () {
                                var a, b, c;
                                for (c = [], a = 0, b = i.length; b > a; a++) h = i[a], c.push({
                                    id: h.id
                                });
                                return c
                            }()
                        ]).length === i.length && (d = !1), k = function () {
                            var b, c, d;
                            for (d = [], b = 0, c = i.length; c > b; b++) h = i[b], d.push(this.save(a, h, !1));
                            return d
                        }.call(this);
                        else if (e = this.models[a], h = new e(b, this), j = this.dataMap[a], null == j && (j = this.dataMap[a] = {}), f = !0, null != (g = j[h.id]) && ((null == g.updatedAt || g.updatedAt <= h.updatedAt) && g.save(b), f = !1, k = g), f && (j[h.id] = h, k = h), null == k.id) throw "Tried to store an object of type " + a + " with no ID.";
                        return d && this._refreshQueries(a), k
                    }, i.prototype.remove = function (a, b) {
                        var c, d, e, f, g;
                        if (e = this.dataMap[a], null != e) {
                            for (d = this.find(a, b), f = 0, g = d.length; g > f; f++) c = d[f], delete e[c.id];
                            return 0 === e.length && delete this.dataMap[a], this._refreshQueries(a), void 0
                        }
                    }, i.prototype.find = function (a, c) {
                        var d, e, f, g, h, i, j, k, l, m, n, o, p;
                        if (i = this.dataMap[a], null != c && null != i) {
                            if (k = [], k._byId = {}, j = function (a) {
                                var b, c;
                                return null == a || k._byId[a.id] ? void 0 : (k.push(a), null == (b = k._byId)[c = a.id] && (b[c] = 0), k._byId[a.id] += 1)
                            }, angular.isString(c)) j(this._getById(a, c));
                            else if (_(c).isObject() && 1 === c.length && _(c).has("id")) j(this._getById(a, c.id));
                            else if (angular.isArray(c))
                                for (l = 0, n = c.length; n > l; l++)
                                    for (d = c[l], p = this.find(a, d), m = 0, o = p.length; o > m; m++) h = p[m], j(h);
                            else
                                for (e in i) {
                                    h = i[e], g = !0;
                                    for (f in c)
                                        if (b.call(c, f) && (d = c[f], !this._testObject(h, f, d))) {
                                            g = !1;
                                            break
                                        }
                                    g && j(h)
                                }
                            return k
                        }
                        return null != i ? _(i).values() : []
                    }, i.prototype.findOne = function (a, c) {
                        var d, e, f, g, h, i;
                        if (null == c || null == this.dataMap[a]) return null;
                        if (angular.isString(c)) return this._getById(a, c);
                        if (_(c).isObject() && 1 === c.length && _(c).has("id")) return this._getById(a, c.id);
                        if (angular.isArray(c)) return this.find(a, c)[0];
                        i = this.dataMap[a];
                        for (e in i) {
                            h = i[e], g = !0;
                            for (f in c)
                                if (b.call(c, f) && (d = c[f], !this._testObject(h, f, d))) {
                                    g = !1;
                                    break
                                }
                            if (g) return h
                        }
                    }, i.prototype.count = function (a, b) {
                        var c;
                        return null != b ? this.find(a, b).length : (null != (c = this.dataMap[a]) ? c.length : void 0) || 0
                    }, i.prototype.findWithPersistence = function (a, b) {
                        var c, e, f, g = this;
                        return c = this.find(a, b), e = this.persistentQueries[a], null == e && (e = this.persistentQueries[a] = []), f = {
                            objects: c,
                            type: a,
                            conditions: b
                        }, e.push(f), c.unregister = function () {
                            var b;
                            return b = e.indexOf(f), b >= 0 && e.splice(b, 1), 0 === e.length ? delete g.persistentQueries[a] : void 0
                        }, c.refresh = function () {
                            var a;
                            return a = g.find(f.type, f.conditions), c.splice.apply(c, [0, c.length].concat(d.call(a)))
                        }, c
                    }, i.prototype.clear = function (a) {
                        return null != a ? this.dataMap[a] = {} : this.dataMap = {}
                    }, i.prototype.clearPersistentQueries = function (a) {
                        return null != a ? this.persistentQueries[a] = [] : this.persistentQueries = {}
                    }, i.prototype.resolveDependencies = function (a, b, c) {
                        var d;
                        return null == b && (b = []), null == c && (c = !1), d = this.checkDependencies(a, b, c), this.fetchDependencies(d)
                    }, i.prototype.checkDependencies = function (a, b, c) {
                        var d, e, f, h, i, j, k, l, m, n, o, p, q, r, s, t;
                        for (null == b && (b = []), null == c && (c = !1), f = {}, q = 0, s = b.length; s > q; q++)
                            for (n = b[q], r = 0, t = a.length; t > r; r++)
                                if (m = a[r], angular.isString(n)) j = this._modelNameKey(n, "type", c), i = m[j] || n, i = g.capitalize(i), null == f[i] && (f[i] = []), h = this._modelNameKey(n, "id", c), null != (p = m[h]) && f[i].push(p);
                                else if (_(n).isObject())
                            for (l in n) {
                                p = n[l], o = m[l.toLowerCase()], null != o && (k = this.checkDependencies([o], p, c));
                                for (d in k) e = k[d], f[d] = _(f[d] || []).union(e)
                            }
                        return f
                    }, i.prototype.fetchDependencies = function (a) {
                        var b, c, d, e, h, i, j;
                        null == a && (a = {}), c = [], i = [];
                        for (h in a) e = a[h], j = _(e).unique(!1), d = _(this.find(h, j)).pluck("id"), b = _(j).difference(d).join(","), b.length > 0 && i.push(this.fetchAll(h, {
                            url: "/v1/" + g.pluralize(g.toSnakeCase(h).toLowerCase()),
                            query: {
                                ids: b
                            },
                            error: function (a) {
                                return c.push(a)
                            }
                        }));
                        return f.all(i)
                    }, i.prototype._modelNameKey = function (a, b, c) {
                        return c ? ("" + a + "_" + b).toLowerCase() : a.toLowerCase() + g.capitalize(b)
                    }, i.prototype._testObject = function (a, b, c) {
                        var d, f, g, h;
                        if (h = b.indexOf(".") > 0 ? function (a, b) {
                            var c, d, e, f, g;
                            for (f = b.split("."), g = [], d = 0, e = f.length; e > d && (c = f[d], a = a[c], null != a); d++) g.push(void 0);
                            return g
                        }(a, b) : a[b], "object" == typeof c) {
                            g = !0;
                            for (d in c)
                                if (f = c[d], g = function () {
                                    switch (d) {
                                    case "$is":
                                        return h === f;
                                    case "$lt":
                                        return f > h;
                                    case "$lte":
                                        return f >= h;
                                    case "$gt":
                                        return h > f;
                                    case "$gte":
                                        return h >= f;
                                    case "$not":
                                        return h !== f;
                                    case "$match":
                                        return null != f.exec(h);
                                    case "$contains":
                                        return null != (null != h ? h.indexOf : void 0) && e.call(h, f) >= 0;
                                    case "$notContains":
                                        return null == (null != h ? h.indexOf : void 0) || e.call(h, f) < 0;
                                    case "$exists":
                                        return f ? null != h : null == h;
                                    default:
                                        return !1
                                    }
                                }(), !g) break;
                            return g
                        }
                        return h === c
                    }, i.prototype._getById = function (a, b) {
                        var c;
                        return null != (c = this.dataMap[a]) ? c[b] : void 0
                    }, i.prototype._refreshQueries = function (a) {
                        var b, c, d, e, f;
                        if (b = this.persistentQueries[a], null != b) {
                            for (f = [], d = 0, e = b.length; e > d; d++) c = b[d], f.push(c.objects.refresh());
                            return f
                        }
                    }, i
                }(), new i
            }
        ], this
    })
}.call(this),
function () {
    var a;
    a = angular.module("SHIFT"), a.factory("title", ["$rootScope", "store", "context",
        function (a, b, c) {
            var d, e;
            return d = a.$new(), e = -1, Object.defineProperty(d, "defaultTitle", {
                get: function () {
                    var a, b, d, e;
                    return a = c.selectedObject, d = null != (e = c.currentUser) ? e.unreadCount : void 0, b = "SHIFT", null != a && (b = "" + b + " - " + a.name), d > 0 && (b = "(" + d + ") " + b), b
                }
            }), Object.defineProperty(d, "title", {
                get: function () {
                    var a, b;
                    return e >= 0 ? (a = this.unreadChats[e], b = a.getLatestMessageNotFromUser(c.currentUser), null != b ? "" + b.author.firstName + " says: " + b.text : this.defaultTitle) : this.defaultTitle
                }
            }), d.$watch("title", function (a, b) {
                return a !== b ? $("title").text(a) : void 0
            })
        }
    ])
}.call(this),
function () {
    SHIFT.view("main", {
        routes: ["/address-book"],
        templateUrl: "partials/address_book.html",
        controller: "AddressBookController"
    })
}.call(this),
function () {
    SHIFT.view("shiftApp", {
        routes: ["/inbox", "/address-book", "/teams", "/unread", "/direct", "/other", "/teams/:teamId", "/teams/:teamId/inbox", "/teams/:teamId/unread", "/teams/:teamId/sent", "/teams/:teamId/connections", "/teams/:teamId/edit", "/users/:userId"],
        templateUrl: "partials/main.html",
        controller: ["$rootScope", "$scope", "$timeout", "router", "util", "context", "store",
            function () {}
        ]
    })
}.call(this),
function () {
    SHIFT.view("shiftApp", {
        routes: ["/messages/:messageId"],
        templateUrl: "partials/single_message.html",
        controller: "SingleMessageController"
    })
}.call(this),
function () {
    SHIFT.view("main", {
        routes: ["/inbox", "/direct", "/unread", "/sent", "/other", "/teams/:teamId", "/teams/:teamId/inbox", "/teams/:teamId/unread", "/teams/:teamId/sent", "/users/:userId"],
        templateUrl: "partials/stream.html",
        controller: "StreamController"
    })
}.call(this),
function () {
    SHIFT.view("main", {
        routes: ["/teams/:teamId/edit"],
        templateUrl: "partials/team_form.html",
        controller: "TeamFormController"
    })
}.call(this),
function () {
    SHIFT.view("main", {
        routes: ["/teams"],
        templateUrl: "partials/teams_page.html",
        controller: "TeamsPageController"
    })
}.call(this),
function () {
    SHIFT.view("shiftApp", {
        routes: ["/settings"],
        templateUrl: "partials/user_settings.html",
        controller: "UserFormController"
    })
}.call(this),
function () {
    SHIFT.view("main", {
        routes: ["/teams/:teamId/connections"],
        templateUrl: "partials/users.html",
        controller: "UsersPageController"
    })
}.call(this), angular.module("SHIFT").run(["$templateCache",
    function (a) {
        a.put("partials/_dialog.html", '<div ng-controller="DialogController" ng-class="{\'visible\':showDialog}" class="confirm-overlay"><div class="confirm"><div class="confirm-body"><div class="warning-icon"></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="content-title">Are You Sure?</div><div class="confirm-message">{{ message }}</div></div></div></div><div class="confirm-footer"><a ng-click="confirm()" class="button green big">{{ confirmText }}</a><a ng-click="cancel()" class="button big">{{ cancelText }}</a></div></div></div>'), a.put("partials/_global.html", '<section id="nav-mini" ng-controller="NavController" ng-class="{\'visible\': inApp()}"><div id="nav-mini-icons"><a shift-popover="notifications-popover" ng-class="{\'notify\':notifications.length &gt;  0}" shift-popover-fixed="shift-popover-fixed" class="icon-wrap"><i class="donkicons notifications"></i></a><a shift-popover="unread-message-popover" ng-class="{\'notify\':getUnreadMessages().length &gt; 0}" shift-popover-fixed="shift-popover-fixed" class="icon-wrap"><i class="donkicons message"></i></a><a id="nav-compose-popover-button" mac-modal="compose-message-modal" class="icon-wrap"><i class="donkicons compose"></i></a></div></section><section id="chat" ng-cloak="ng-cloak" ng-controller="ChatListController"><a id="close-global" ng-click="toggleGlobal()" ng-class="{\'active\':!globalIsLocked}" class="icon-wrap gray ga ga-click-global-toggle_bar"><i class="donkicons slide-right gray"></i></a><div class="icon-header"><div class="icon-wrap"><i ng-hide="testShowUnreadHeader()" class="donkicons chat"></i><i ng-show="testShowUnreadHeader()" class="donkicons chat red"></i></div><h3 ng-hide="testShowUnreadHeader()">Chats</h3><h3 ng-show="testShowUnreadHeader()">Chats ({{getUnreadChats().length}})</h3></div><div ng-class="{\'show-new-chat\':showNewChat}" class="list-wrapper"><ul ng-cloak="ng-cloak" shift-chat-scroll-detector="shift-chat-scroll-detector" shift-hide-popover-on-scroll="shift-hide-popover-on-scroll" shift-scroll-to-edge="shift-scroll-to-edge" class="global-list scrollable"><li ng-repeat="chat in chats" shift-scroll-to-item="shift-scroll-to-item" shift-scroll-to-item-condition="chat.id == selectedChat.id" shift-scroll-to-item-event="scrollChats" shift-popover="chat-popover" shift-popover-content="chat" shift-popover-fixed="shift-popover-fixed" ng-class="{\'unread\':chat.unread &gt; 0}"><div ng-click="removeChat(chat, $event)" class="close-chat ga ga-click-global-remove_chat">&times;</div><div ng-class="{\'online\':getOnlineStatus(chat)}" class="chat-user-icon avatar left"><shift-chat-icon-grid></shift-chat-icon-grid></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{chat.title}}</div><div ng-show="(chat.getLatestMessageNotFromUser(context.currentUser) &amp;&amp; chat.users.length &lt;= 2) &amp;&amp; chat.unread &gt; 0" class="text">{{chat.getLatestMessageNotFromUser(context.currentUser).text}}\n</div></div></div></li></ul><div class="start-new-chat"><button ng-hide="showNewChat" ng-click="toggleNewChat()" shift-focus-on-click="shift-focus-on-click" focus-global-element="#chat .new-chat input" class="button small block ga ga-click-global-new_chat">Start new chat</button><div ng-show="showNewChat" ng-cloak="ng-cloak" class="new-chat"><shift-tag-input shift-tags-model="addedUsers" shift-suggestion-name="user" shift-suggestions-model="context.currentUser.connectedUsers" shift-suggestion-limit="4" shift-query-model="userQuery.name" placeholder="First and Last Name"><div class="avatar"><img ng-src="{{user.image.icon}}"/></div><div class="name"> {{user.name}}</div><div class="title">{{user.title}}</div></shift-tag-input></div></div></div></section><section id="activity" ng-cloak="ng-cloak"><div class="icon-header"><div class="icon-wrap"><i class="donkicons global"></i></div><h3>Global Activity</h3></div><div class="list-wrapper"><ul ng-controller="ActivityController" class="global-list scrollable"><li ng-repeat="event in activityEvents | orderBy: \'-updatedAt\'" shift-flash-first-on-create="new-activity" mac-modal="single-message-modal" mac-modal-content="event.message"><div ng-hide="event.teamSubject" class="avatar left"><img ng-src="{{event.userIcon}}"/></div><i ng-show="event.teamSubject" class="teamicons small left {{event.teamColor}} {{event.teamIcon}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text"><div ng-show="event.user == context.currentUser" class="first">{{event.subject.you}}</div><div ng-hide="event.user == context.currentUser" class="first">{{event.subject.them}}</div></div><div class="text">{{event.text}}</div></div></div></li></ul></div></section>'),
        a.put("partials/_nav.html", '<div id="nav" ng-controller="NavController"><div class="container"><div class="right-side"><div class="typeahead-input-wrap search"><input shift-search="shift-search" shift-search-people-filter="isItemCurrentUser(object)" shift-search-on-enter="searchGoToObject(object)" shift-search-is-loading="isFetchingConnections" type="text" placeholder="Find contacts or teams" ng-model="searchQuery" shift-typeahead="shift-typeahead" class="typeahead ga ga-click-nav-search"/><mac-spinner ng-show="isFetchingConnections" class="spinner"></mac-spinner></div><a shift-popover="user-nav-popover" shift-popover-fixed="shift-popover-fixed" class="avatar small user-nav launch-popover ga ga-click-nav-settings"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="left-side"><a id="logo" ng-click="context.goToRoot()" class="ga ga-click-nav-home"><i class="donkicons logo logo-gray"></i></a><div id="nav-icons"><a id="nav-teams-nav-button" shift-popover="teams-nav" shift-popover-fixed="shift-popover-fixed" class="nav-teams ga ga-click-nav-jump_nav"></a><a shift-popover="notifications-popover" ng-class="{\'notify\':notifications.length &gt;  0}" shift-popover-fixed="shift-popover-fixed" class="icon-wrap ga ga-click-nav-notifications"><i class="donkicons notifications"></i></a><a shift-popover="unread-message-popover" ng-class="{\'notify\':getUnreadMessages().length &gt; 0}" shift-popover-fixed="shift-popover-fixed" class="icon-wrap ga ga-click-nav-unread"><i class="donkicons message"></i></a><a id="nav-compose-popover-button" mac-modal="compose-message-modal" class="icon-wrap ga ga-click-nav-compose"><i class="donkicons compose"></i></a></div></div></div></div>'), a.put("partials/address_book.html", '<div id="address-book-page"><div class="content"><div class="section-wrap large"><ul class="nav-pills left"><li ng-repeat="filter in filters" ng-click="selectFilter(filter)" ng-class="{\'active\': selectedFilter == filter}"><a class="address-book-menu-item-content">{{filter | underscoreString:"capitalize"}}</a></li></ul><a mac-modal="invite-others" class="button small right">Invite People</a></div><div ng-show="isLoading" class="spinner-block-wrap"><mac-spinner ng-show="isLoading" class="spinner large block"></mac-spinner></div><div ng-show="filteredContactList.length == 0 &amp;&amp; !isLoading" class="placeholder">No Contacts</div><ul ng-hide="isLoading" class="members-list"><li ng-repeat="user in filteredContactList | orderBy: \'displayName\'"><a ng-click="context.goToUser(user)" class="avatar large left"><img ng-src="{{user.image.default}}" ng-click="context.goToUser(user)"/></a><div class="details-wrap large"><div class="v-aligner"></div><div class="details"><a ng-click="context.goToUser(user)" class="text">{{user.displayName}}</a><div ng-show="user.title.length" class="text">{{user.title}}</div></div><a shift-popover="edit-contact-popover" shift-popover-content="user" class="dropdown-wrap"><i class="donkicons drop-down gray"></i></a></div></li></ul></div></div>'), a.put("partials/directives/chat_icon_grid.html", '<div ng-transclude="ng-transclude" class="shift-chat-icon-grid"></div>'), a.put("partials/directives/error.html", '<div id="flash-wrapper" ng-cloak="ng-cloak" ng-transclude="ng-transclude"><div class="flash well"><a ng-click="closeAlert()" class="close"></a><div ng-hide="!!action" class="flash-message">{{message}}</div><div ng-show="!!action" class="flash-message"><a ng-click="action()">{{message}}</a></div></div></div>'), a.put("partials/directives/message_input.html", '<div ng-class="{\'active\':focused}" class="shift-message-wrap"><div class="shift-message-display"></div><div class="shift-message-inputarea"></div><div ng-hide="disableAttachment" ng-class="{\'hide\':attachments.length == 0}" class="attachments"><div ng-repeat="attachment in attachments" ng-switch="getAttachmentType(attachment)" class="popover-clickable"><div ng-switch-when="file" class="attachment file-attachment"><div ng-click="removeAttachmentFromList(attachment, $index)" class="close"></div><div ng-show="attachment.isLoading" class="progress-wrap"><div ng-style="getAttachmentProgress(attachment)" class="progress"></div></div><i class="donkicons file"></i><div class="filename">{{attachment.fileName}}</div></div><div ng-switch-when="link" class="attachment link-attachment"><div ng-click="removeAttachmentFromList(attachment, $index)" class="close"></div><mac-spinner ng-show="attachment.isLoading" class="spinner"></mac-spinner><div class="link-image"><img ng-src="{{attachment.data.data.images[0]}}"/></div><div class="link-details"><div class="link-title">{{attachment.data.data.title || showDomain(attachment.data.data.url)}}</div><small class="link-address">{{attachment.data.data.url}}</small></div></div><div ng-switch-when="image-link" class="attachment image-attachment small"><div ng-click="removeAttachmentFromList(attachment, $index)" class="close"></div><mac-spinner ng-show="attachment.isLoading" class="spinner"></mac-spinner><img ng-src="{{attachment.data.data.images[0]}}"/></div><div ng-switch-when="video" class="attachment video-attachment"><div ng-click="removeAttachmentFromList(attachment, $index)" class="close"></div><div class="link-image"><img ng-src="{{attachment.data.data.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{attachment.data.data.title}}</div><small class="link-address">{{attachment.data.data.url}}</small></div></div><div ng-switch-when="image" class="attachment image-attachment small"><div ng-click="removeAttachmentFromList(attachment, $index)" class="close"></div><div ng-show="attachment.isLoading" class="progress-wrap"><div ng-style="getAttachmentProgress(attachment)" class="progress"></div></div><img ng-src="{{getImageSrc(attachment)}}"/></div></div></div><div ng-hide="disableAttachment" class="attach-wrap"><div class="attach-link"><i class="donkicons upload gray"></i><span>Upload files or drag &amp; drop</span></div><input mac-upload="mac-upload" mac-upload-progress="mac-upload-progress" multiple="multiple" ng-disabled="isSubmittingMessage" type="file" tabindex="-1" name="file" mac-upload-route="attachmentRoute" mac-upload-previews="attachments" mac-upload-submit="attachmentUploadSubmit($event, $data)" mac-upload-success="attachmentUploadSuccess($data, $status)" mac-upload-error="attachmentUploadError($data, $status)" mac-upload-drop-zone=".composer-wrap" class="attachment-input"/></div></div>'), a.put("partials/directives/popover.html", '<div class="popover"><div class="tip"></div><div class="header"><div class="title">{{title}}</div></div><div class="popover-content-wrapper"></div></div>'), a.put("partials/directives/tag_input.html", '<div ng-click="focusInput()" ng-class="{\'active\':focused}" class="typeahead-input-wrap"><div ng-repeat="tag in tags" ng-click="tags.splice($index, 1)" ng-class="{\'has-icon\': tag.iconClass}" class="token button small popover-clickable"><div class="avatar"><img ng-src="{{tag.image.icon}}"/></div><div class="name">{{tag.name}}</div></div><input type="text" mac-keydown="onQueryKeydown($event)" mac-blur="onTypeaheadBlur($event)" ng-model="queryModel" ng-hide="tagsLimit == tags.length" shift-focus-on-event="focusTagInput" shift-search-on-enter="addSuggestion(object)" shift-search-people-filter="shouldShowItem(object)" ng-class="inputClass" shift-search="shift-search" shift-typeahead="shift-typeahead" class="shift-typeahead-input typeahead"/></div>'), a.put("partials/directives/timestamp.html", '<span title="{{timestamp()}}" class="shift-timestamp"></span>'), a.put("partials/directives/typeahead.html", '<div shift-disable-bg-scroll="shift-disable-bg-scroll" ng-class="{\'visible\': isSuggestionsVisible}" mac-mouseenter="clearSelectedIndex()" shift-disable-bg-scroll-name="typeaheadScroll" class="typeahead-wrap"><div ng-show="typeahead.noResultVisible()" class="placeholder">{{noResult || "No results found"}}</div><ul><li ng-repeat="item in typeahead.data().people" ng-mouseover="typeahead._index = $index"><a ng-click="onClick($event, item)" ng-class="{\'active\': $index == typeahead._index}"><div class="avatar small left"><img ng-src="{{item.image.icon}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{item.name}}</div><div class="text">{{item.title}}</div></div></div></a></li></ul><ul ng-show="typeahead.data().teams"><li class="section-header">Teams</li><li ng-repeat="item in typeahead.data().teams" ng-mouseover="typeahead._index = $index + typeahead.data().people.length"><a ng-click="onClick($event, item)" ng-class="{\'active\': typeahead.data().people.length + $index == typeahead._index}"><i class="teamicons small left {{item.color}} {{item.icon}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{item.name}}</div><div class="text">{{item.title}}</div></div></div></a></li></ul></div>'), a.put("partials/main.html", '<div id="main"><div id="profile" ng-cloak="ng-cloak" class="{{context.selectedObjectType.toLowerCase()}}-profile"><div id="header" ng-show="context.selectedObjectType == \'Team\' || context.selectedUser == context.currentUser" class="{{context.selectedObjectType == \'Team\' | boolean: \'teamicons \' + context.selectedTeam.color : \'default\'}}"><div class="container"><ul ng-controller="MembershipsController" ng-show="context.selectedObjectType == \'Team\'" class="members"><li ng-repeat="membership in memberships | orderBy: \'-user.lastName\' | limitTo: 12" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="membership.user" class="member right"><a ng-click="context.goToUser(membership.user)" class="avatar small"><img ng-src="{{membership.user.image.icon}}"/></a></li><li ng-show="additionalMembers.length &gt; 0" class="member count avatar small"><a>+{{additionalMembers}}</a></li></ul><i ng-show="context.selectedObjectType == \'Team\'" class="teamicons extra-large left {{context.selectedTeam.icon}}"></i><div ng-show="context.selectedObjectType == \'User\'" class="avatar large left"><img ng-src="{{context.selectedUser.image.default}}"/></div><div class="details-wrap profile-large"><div class="v-aligner"></div><div class="details"><h1>{{context.selectedObject.name}}</h1><h2 ng-show="context.selectedObjectType == \'User\'">You have {{context.selectedObject.unreadCount || 0}} unread {{"message" | pluralize: context.selectedObject.unreadCount: false}}.</h2></div></div></div></div></div><div class="container"><ul ng-controller="ContentNavController" class="content-nav content"><li ng-show="context.selectedObjectType == \'User\' &amp;&amp; context.selectedObject != context.currentUser"><div class="contact"><div class="avatar huge"><img ng-src="{{context.selectedUser.image.default}}"/></div><h1>{{context.selectedObject.name}}</h1><h2>{{context.selectedObject.title}}</h2><div ng-show="isProfileView()" class="contact-card-wrap"><div class="contact-buttons-wrap {{buttonClass()}}"><a class="contact-button button big hoverable"><span class="contact-text"><i class="donkicons check white text-after"></i>Contacts</span><span ng-click="addContact()" class="add-text ga ga-click-user_page-add_contact">Add Contact</span><span class="pending-text">Pending</span><span ng-click="removeContact()" class="cancel-text ga ga-click-user_page-cancel_contact">Cancel</span><span ng-click="removeContact()" class="remove-text ga ga-click-user_page-remove_contact">Remove</span></a></div><div class="contact-button-group"><button ng-click="sendMessage()" class="button small ga ga-click-user_page-send_message"><i class="donkicons compose text-after"></i>Message</button><button ng-click="openChat()" class="button small ga ga-click-user_page-open_chat"><i class="donkicons chat text-after"></i>Chat</button></div></div></div></li><li ng-show="!isProfileView() &amp;&amp; context.selectedObjectType == \'User\'"><ul class="nav-pills-stacked"><li ng-class="{\'active\': isMessageSection()}" ng-click="context.goToPage(\'inbox\')" class="ga ga-click-inbox-nav_messages"><a>Messages<span ng-show="context.selectedObject.unreadCount">{{context.selectedObject.unreadCount}}</span></a></li><li ng-class="{\'active\':context.selectedSubpage == \'address-book\'}" ng-click="context.goToPage(\'address-book\')" class="ga ga-click-inbox-nav_contacts"><a>Contacts</a></li><li ng-class="{\'active\':context.selectedSubpage == \'teams\'}" ng-show="context.selectedObject.id == context.currentUser.id" ng-click="context.goToPage(\'teams\')" class="ga ga-click-inbox-nav_teams"><a>Teams</a></li></ul></li><li ng-show="context.selectedObjectType == \'Team\'"><ul class="nav-pills-stacked"><li ng-click="context.goToPage(\'inbox\')" ng-class="{\'active\': isMessageSection()}" class="ga ga-click-team-nav_messages"><a>Messages<span ng-show="context.selectedObject.unreadCount">{{context.selectedObject.unreadCount}}</span></a></li><li ng-click="context.goToPage(\'connections\')" ng-class="{\'active\':context.selectedSubpage == \'connections\'}" class="ga ga-click-team-nav_members"><a>Members</a></li><li ng-click="context.goToPage(\'edit\')" ng-class="{\'active\':context.selectedSubpage == \'edit\'}" class="ga ga-click-team-nav_manage"><a>Team Settings</a></li></ul></li><li ng-show="!isProfileView()"><div ng-controller="AppsController" ng-show="!isProfileView()" class="app-links"><div class="icon-header"><a ng-show="context.selectedObjectType == \'Team\' &amp;&amp; context.currentUser.isAdminOfTeam()" mac-modal="app-store" class="header-link">manage</a><div class="icon-wrap"><i class="donkicons apps"></i></div><h3>Apps</h3></div><div ng-show="appsLoading" class="loading-wrap"><mac-spinner ng-show="appsLoading" class="spinner block"></mac-spinner></div><div class="scroll-section"><a ng-click="goToApp($event, $index, app)" ng-repeat="app in installedApps | orderBy: \'+name\'" class="content-link"><div class="app-icon left"><img ng-src="{{app.image.medium}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{app.name}}</div><div class="text">{{app.publisher}}</div></div></div></a></div></div></li><li ng-controller="FollowupsController"><div class="icon-header"><div class="icon-wrap"><i class="donkicons check"></i></div><h3>Follow Ups</h3></div><div ng-show="followups.length == 0" class="placeholder">{{getNoObjectsMessage()}}</div><div ng-repeat="followup in followups | orderBy: \'-createdAt\'" mac-modal="single-message-modal" mac-modal-content="followup.message" class="content-link"><a ng-click="deleteFollowup($event, followup)" class="close"></a><div class="avatar small left"><img ng-src="{{followup.message.author.image.icon}}"/></div><div class="details-wrap truncate"><div class="v-aligner"></div><div class="details"><div class="text author">{{followup.message.authorName}}</div><div shift-render-text="followup.message" shift-disable-render-link="shift-disable-render-link" class="text"></div></div></div></div></li><li ng-show="isProfileView()"><div class="icon-header"><div class="icon-wrap"><i class="donkicons teams"></i></div><h3>Mutual Teams</h3></div><div ng-show="getMutualTeams().length==0" class="placeholder">You have no Mutual Teams with {{context.selectedUser.name}}</div><a ng-click="context.goToTeam(team)" ng-repeat="team in teams | orderBy: \'+name\'" class="content-link ga ga-click-user_page-mutual_team"><i class="teamicons small left {{team.color}} {{team.icon}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{team.name}}</div></div></div></a></li></ul><div bang-pane="main"></div></div></div>'), a.put("partials/modals/app_store.html", '<div class="modal-content"><div class="hero-banner"></div><div ng-show="appsLoading" class="app-spinner"><mac-spinner ng-show="appsLoading" class="spinner large block"></mac-spinner></div><div ng-hide="appsLoading"><div ng-show="installedAppIds.length &gt; 0"><h2>Installed Apps</h2><div class="well"><ul class="app-list"><li class="divider"></li><li ng-repeat="app in applicationList | orderBy:\'name\'" ng-switch="isAppInstalled(app)" ng-show="isAppInstalled(app)"><div ng-switch-when="true"><div class="app-icon large left"><img ng-src="{{app.image.large}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text name">{{app.name}}</div><div class="text description">{{app.publisher}}</div><button ng-show="app.isConfirmingUninstall" ng-click="app.isConfirmingUninstall = false" class="secondary cancel">Cancel</button><button ng-hide="isAppInstalled(app) || app.isTogglingInstall" ng-disabled="!context.currentUser.isAdminOfTeam()" ng-click="toggleAppInstall(app)" class="button small">Install</button><button ng-hide="app.isTogglingInstall || !isAppInstalled(app)" ng-disabled="!context.currentUser.isAdminOfTeam()" shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="{{confirmationMessage(app)}}" shift-confirm-on="toggleAppInstall(app)" class="button small">Remove</button><div ng-show="app.isTogglingInstall"><mac-spinner ng-show="app.isTogglingInstall" class="spinner"></mac-spinner><div ng-hide="isAppInstalled(app)" class="spinner-message">Installing app</div><div ng-show="isAppInstalled(app)" class="spinner-message">Removing app</div></div></div></div></div></li></ul></div></div><h2>Apps Available To Install</h2><div class="well"><ul class="app-list"><li class="divider"></li><li ng-repeat="app in applicationList | orderBy:\'name\'" ng-switch="isAppInstalled(app)" ng-hide="isAppInstalled(app)"><div ng-switch-when="false"><div class="app-icon large left"><img ng-src="{{app.image.large}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text name">{{app.name}}</div><div class="text description">{{app.publisher}}</div><button ng-show="app.isConfirmingUninstall" ng-click="app.isConfirmingUninstall = false" class="secondary cancel">Cancel</button><button ng-hide="isAppInstalled(app) || app.isTogglingInstall" ng-disabled="!context.currentUser.isAdminOfTeam()" ng-click="toggleAppInstall(app)" class="button small">Install</button><button ng-hide="app.isTogglingInstall || !isAppInstalled(app)" ng-disabled="!context.currentUser.isAdminOfTeam()" shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="{{confirmationMessage(app)}}" shift-confirm-on="toggleAppInstall(app)" class="button small">Remove</button><div ng-show="app.isTogglingInstall"><mac-spinner ng-show="app.isTogglingInstall" class="spinner"></mac-spinner><div ng-hide="isAppInstalled(app)" class="spinner-message">Installing app</div><div ng-show="isAppInstalled(app)" class="spinner-message">Removing app</div></div></div></div></div></li></ul></div><a ng-click="closeApplicationList()" class="button right">Close App Store</a></div></div>'), a.put("partials/modals/compose_message.html", '<div id="composer" ng-init="source = \'modal\'"><div class="modal-header">Compose a Message</div><div class="modal-content"><div ng-controller="ComposerController" name="composerForm" class="composer-wrapper"><a ng-hide="source == \'popover\'" ng-click="context.goToUser(context.currentUser)" class="avatar large left"><img ng-src="{{context.currentUser.image.default}}"/></a><div ng-class="{\'has-team\':addressingTeam || source == \'stream\', \'active\':focused || source == \'modal\'}" ng-click="focused = true" class="composer-wrap"><div class="composer"><div class="recipients"><div ng-hide="addressingTeam" class="contact-recipient-wrap"><shift-tag-input shift-tags-model="addressedUsers" shift-tags-on-keydown="onKeydown($event, query)" shift-tags-on-blur="addEmailUser(query)" shift-suggestions-model="getSuggestedUsers()" shift-query-model="addressedUserQuery.name" placeholder="Add contact or team" shift-tags-disable-team="addressingUsers"></shift-tag-input></div><div ng-show="addressingTeam" class="contact-recipient-wrap"><div class="typeahead-input-wrap tokenizing"><div ng-click="addressedUsers.splice(0,1)" class="token team button small"><i class="teamicons left tiny {{addressedUsers[0].color}} {{addressedUsers[0].icon}}"></i><div class="name">{{addressedUsers[0].name}}</div></div></div></div><div ng-show="addressingTeam || source == \'stream\'" ng-class="{\'active\': !showToPlaceholder}" class="team-recipient-wrap"><div class="to-placeholder">All members or&nbsp;<a ng-click="showOptionalTagInput()" class="limit-visibility">limit visibility</a></div><div ng-class="{\'active\': !showToPlaceholder}" class="tokenizing"><shift-tag-input shift-tags-model="optionalAddressedUsers" shift-tags-on-keydown="optionalOnKeydown()" shift-tags-on-blur="onTagInputBlur($event)" shift-suggestions-model="optionalUsers" shift-query-model="addressedUserQuery.name" placeholder="Add Member"></shift-tag-input></div></div></div><shift-message-input ng-submit="submitComposer()" shift-message-input-name="composerText" shift-message-input-placeholder="Send a new message" shift-message-input-ng-model="messageText" shift-message-input-ng-disabled="isSubmittingReply" shift-message-input-obj-type="message" shift-message-input-is-global="source == \'modal\'" shift-message-input-attachments="composerAttachments" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-mentions="mentionedUsers" shift-message-input-required="shift-message-input-required" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div ng-class="{\'visible\':(messageText||composerAttachments.length)}" class="composer-footer"><span ng-disabled="isSubmittingMessage || pendingAttachmentCount &gt; 0" ng-click="submitComposer()" ng-class="{\'loading\': isSubmittingMessage}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><span ng-class="{\'active\':isSubmittingMessage}" class="button primary">Send Message</span></span></div><div class="drop-overlay"></div></div></div></div></div>'), a.put("partials/modals/invite_others.html", '<div id="invite-contacts" shift-disable-bg-scroll="shift-disable-bg-scroll" shift-disable-bg-scroll-name="inviteOthersModalScroll"><div class="modal-header">Invite people you know</div><div class="modal-content scrollable"><h2 class="component-header">Invite by Email</h2><div class="section-wrap"><div ng-class="{error: inviteEmailError}" class="typeahead-input-wrap search"><input placeholder="Add by email" ng-model="inviteEmail" ng-class="{error: inviteEmailError}" mac-keydown-enter="addContactToEmails(\'input\')" class="typeahead"/></div></div><div class="section-wrap"><div ng-show="inviteEmail.length &gt; 0" ng-click="addContactToEmails(\'input\')" class="button right green">Add Email</div></div><h2 class="component-header">Invite by Network</h2><div class="section-wrap"><ul class="networks"><li><a id="search-facebook" shift-popover="facebook-connect" ng-click="facebookInit()" shift-popover-scope="shift-popover-scope" class="button small show-popover">Search Contacts</a><div class="network"><div class="icon fb"></div><div class="name">Facebook</div></div></li><li><a id="search-google" shift-popover="google-connect" ng-click="googleInit()" shift-popover-scope="shift-popover-scope" class="button small show-popover">Search Contacts</a><div class="network"><div class="icon google"></div><div class="name">Google</div></div></li></ul></div><div ng-show="selectedContacts.length" class="section-wrap"><h2 class="component-header">Pending Invites</h2><div class="contact-review"><ul class="selector-list"><li ng-repeat="contact in selectedContacts" ng-class="{\'active\': contact.selected}"><a ng-click="removeContact(contact)" class="close"></a><div class="avatar left small"><img ng-src="{{contact.img}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div ng-show="contact.type == 1" class="text">{{contact.name}}</div><div ng-show="contact.type != 1" class="text">{{contact.email}}</div></div></div></li></ul></div></div><div class="section-wrap"><div ng-show="inviteEmailError" class="well error">{{errorMessage}}</div></div><div class="section-wrap"><div ng-class="{\'loading\': waiting}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><input ng-disabled="selectedContacts.length == 0" ng-class="{disabled: selectedContacts.length == 0}" ng-click="processFacebookContacts()" value="Invite {{selectedContacts.length}} Contacts" class="button green"/></div><a ng-click="closeModal($event)" class="button right">Cancel</a></div></div></div>'), a.put("partials/modals/single_message.html", '<div class="modal-header">Message</div><div class="modal-content"><div ng-show="message" class="single-message"><div ng-controller="MessageController" class="message"><a ng-show="message.authorType != \'application\'" ng-click="context.goToUser(message.author)" ng-class="{\'online\': authorIsOnline(message)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" class="message-avatar avatar large left"><img ng-src="{{message.author.image.default}}"/></a><a ng-click="context.goToUser(message.author)" ng-show="message.authorType == \'application\'" class="message-avatar avatar large left"><img ng-src="{{message.author.images[0].sizes.large}}"/></a><div class="content-wrap"><a ng-class="{\'visible\': messageIsUnread()}" ng-click="markMessage(\'read\', $event)" class="unread"></a><div class="message-header"><a shift-popover="message-actions" shift-popover-content="message" shift-popover-exclude="message-actions" shift-popover-child-popover="shift-popover-child-popover" class="message-settings gray right show-popover"><i class="donkicons drop-down gray"></i></a><div class="author"><i mac-tooltip="Private Message" ng-show="shouldShowMessageLock()" class="donkicons lock gold left"></i><a shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" ng-click="context.goToUser(message.author)" ng-bind-html-unsafe="message.authorName | highlight : searchedQuery" class="name left ga ga-click-message-author_name"></a><div class="string left">&nbsp;to&nbsp;</div><div ng-repeat="user in getAddressedUsers() | limitTo: getUserLimit()"><div ng-show="$last &amp;&amp; getAddressedUsers().length &lt; 5 &amp;&amp; getAddressedUsers().length != 1" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length == 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToUser(user)" class="name left ga ga-click-message-recipient_name">{{user.name}}</a><a ng-show="getAddressedUsers().length &gt; 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToObject(user)" class="name left ga ga-click-message-recipient_name">{{user.firstName}}</a><div ng-show="showComma($index)" class="string left">,&nbsp;</div></div><div ng-show="getAddressedUsers().length &gt;= 5" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length &gt;= 5" ng-click="showAddressedUsers($event)" class="name left ga ga-click-message-more_recipients">{{"Other" | pluralize: getHiddenUsers()}}</a><a ng-show="message.toWho.teams.length &amp;&amp; getAddressedUsers().length == 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name left"><span>{{message.toWho.teams[0].name}}</span></a><a ng-show="getAddressedUsers().length &gt; 0" shift-popover="add-message-users" shift-popover-content="message" class="add-contact left ga ga-click-message-add_user"></a></div></div><div ng-class="{\'truncate\': shouldTruncateMessage()}" class="message-content"><p shift-render-text="message" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text"></p><div ng-show="message.attachments.length &gt; 0"><div class="attachments"><ul ng-class="{\'small\': !messageImagesExpanded}" ng-click="toggleMessageImagesExpanded()" class="attachment image-attachment ga ga-click-message-attachment_image"><li ng-repeat="image in message.images"><img ng-src="{{image.sizes.original}}"/></li><li ng-repeat="imageLink in message.imageLinks"><img ng-src="{{imageLink.url}}"/></li></ul><a ng-repeat="link in message.links" ng-href="{{link._url || link.url}}" target="_blank" class="attachment link-attachment ga ga-click-message-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link._url || link.url}}</small></div></a><a ng-repeat="file in message.files" ng-href="{{file.url}}" target="_blank" ng-click="markMessage(\'read\');$event.stopPropagation()" class="attachment file-attachment ga ga-click-message-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in message.videos" ng-href="{{video.url}}" target="_blank" class="attachment video-attachment ga ga-click-message-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div><div ng-show="fromApplication(message) &amp;&amp; message.mentions.length &gt; 0" class="attachments"><a ng-click="goToObject()" class="attachment link-attachment ga ga-click-message-attachment_app_object"><div class="link-image"><img ng-src="{{getAppObjAttachmentImage().medium}}" ng-click="goToObject()"/></div><div class="link-wrap"><div class="v-aligner"></div><div class="link-details"><div class="link-title">{{getAppObjAttachmentText()}}</div></div></div></a></div></div><a ng-click="expandMessage($event)" ng-hide="isExpanded || !shouldTruncateMessage()" class="show-more"><div class="message-text left">{{getShowMoreMessage()}}</div><div class="attachment-group"><div ng-show="message.images.length &gt; 0" ng-repeat="image in message.images" class="image"><img ng-src="{{image.sizes.icon}}"/></div><i ng-show="message.links.length &gt; 0" class="donkicons link gray"></i><div ng-show="message.imageLinks.length &gt; 0" ng-repeat="imageLink in message.imageLinks" class="image"><img ng-src="{{imageLink.url}}"/></div><i ng-repeat="ext in getFileExtensions()" class="donkicons file {{ext}}"></i><div ng-repeat="video in message.videos" ng-show="message.videos.length &gt; 0" class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div></div></a><div class="message-meta"><a ng-show="message.toWho.teams.length" class="team-context left"><i class="teamicons tiny right {{message.toWho.teams[0].color}} {{message.toWho.teams[0].icon}}"></i></a><a ng-show="message.toWho.teams.length &gt; 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name">{{message.toWho.teams[0].name}}</a><span ng-show="message.toWho.teams.length">&nbsp;&middot;&nbsp;</span><a href="#/messages/{{message.id}}" class="timestamp"><shift-timestamp shift-time="message.createdAt"></shift-timestamp></a></div><div class="message-footer"><div class="click-actions-wrap"><a shift-popover="user-list-popover" shift-popover-content="message" shift-popover-child-popover="shift-popover-child-popover" ng-show="message.numHighFives &gt; 0" class="left high-fivers-link">({{message.numHighFives}})</a><a mac-tooltip="{{message.userHighFived | boolean:\'Un-High Five\':\'High Five\'}}" ng-class="{\'active\': message.userHighFived}" ng-click="setHighFive($event, message)" class="high-five-wrap left"><i class="donkicons high-five gray"></i></a><a mac-tooltip="Follow Up" ng-click="setFollowUp($event)" ng-class="{\'active\': isFollowed()}" class="follow-up-wrap left"><i class="donkicons check gray"></i></a></div><div class="reply-actions-wrap"><a ng-click="toggleReplies()" ng-class="{\'unread-link\': message.hasUnreadReplies, \'active\': repliesAreExpanded}" class="replies-link">replies&nbsp;<span ng-show="message.numReplies &gt; 0">({{message.numReplies}})</span></a><a ng-click="toggleSidebars()" ng-class="{\'unread-link\': message.hasUnreadSidebars, \'active\': sidebarsAreExpanded}" class="sidebars-link">sidebars&nbsp;<span ng-show="message.sidebars.length">({{message.sidebars.length}})</span></a></div></div></div><div ng-switch="footerSection"><div ng-switch-when="replies" class="replies-wrap visible"><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><div ng-switch-when="sidebars" class="sidebars-wrap visible"><div ng-repeat="sidebar in message.sidebars | orderBy: \'-dateCreated\'" ng-controller="SidebarController" class="sidebar"><div class="sidebar-header"><div class="sidebar-header-content visible"><div ng-show="context.currentUser.id == sidebar.creator.id" shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this sidebar?" shift-confirm-on="deleteSidebar(message, sidebar)" shift-confirm-text="Delete" class="sidebar-delete-wrap"><button class="sidebar-delete-button button small right">Delete</button></div><ul class="sidebar-members"><li ng-repeat="member in sidebar.members" class="member left"><a ng-click="context.goToUser(member)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="member" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><form ng-controller="SidebarFormController" name="sidebarForm" class="sidebar"><div class="sidebar-header"><div ng-class="{\'visible\': !sidebarFormIsVisible, \'hide\': !sidebarButtonIsActive}" class="sidebar-create-wrap center"><button ng-click="toggleSidebarForm()" class="create-sidebar-button button small">Start New Sidebar</button></div><div ng-class="{\'visible\': sidebarFormIsVisible}" class="sidebar-header-content"><div class="sidebar-add-member-wrap"><div ng-class="{\'loading\': loadingUsers}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="showAddSidebarMembers($event)" class="add-member-button button small right">Add Member</button></div><small ng-hide="sidebarMembers.length &gt; 0" class="help-text right">Start a sidebar by adding a team member.</small></div><ul class="sidebar-members"><li class="member left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="avatar small"><img ng-src="{{context.currentUser.image.icon}}"/></a></li><li ng-repeat="member in sidebarMembers" class="member left"><a href="#" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><ul ng-show="sidebarMembers.length &gt; 0" class="replies"><li class="reply"><a class="avatar small online left"><img ng-class="{\'online\': context.currentUser.online}" ng-src="{{context.currentUser.image.icon}}"/></a><div class="reply-content-wrap"><div ng-class="{\'active\':focused}" ng-click="focused = true" class="composer-wrap"><div class="composer"><shift-message-input shift-message-input-type="textarea" shift-message-input-name="sidebarText" shift-message-input-placeholder="Privately reply on this sidebar" shift-message-input-ng-model="messageText" shift-message-input-obj-type="sidebar" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="sidebarAttachments" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div ng-class="{\'visible\': messageText.length &gt; 0}" class="composer-footer"><span ng-class="{\'loading\': isSubmittingSidebar}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="submitSidebar(message)" ng-disabled="messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0}" class="button primary">Create Sidebar</button></span></div><div class="drop-overlay"></div></div></div></li></ul></form></div></div></div></div></div>'), a.put("partials/popovers/add_contact.html", '<div id="add-contact" ng-controller="AddContactController" class="popover-content"><div class="typeahead-input-wrap search"><input shift-search="shift-search" shift-typeahead="shift-typeahead" shift-search-disable-teams="shift-search-disable-teams" shift-search-people-filter="isItemCurrentUser(object)" shift-search-on-enter="addContact(object)" shift-search-on-keydown="onKeydown($event, query)" type="text" ng-model="contactQuery" placeholder="Add by name or email" class="typeahead"/></div><span ng-class="{\'loading\':isLoading}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="submitEmail(email)" ng-disabled="!canSubmit" ng-class="{\'disabled\':!canSubmit}" class="button green block">Add Contact</button></span></div>'), a.put("partials/popovers/add_message_users.html", '<div class="popover-content add-people-to-message add-members"><div><shift-tag-input shift-tags-model="addedUsers" shift-tags-on-keydown="addEmailUserKeydown($event, query)" shift-tags-on-blur-submit="addEmailUser(query)" shift-suggestion-name="user" shift-suggestions-model="getAllowedUsers()" shift-suggestion-limit="4" shift-query-model="addUserQuery" placeholder="Add contacts"></shift-tag-input></div><span ng-class="{\'loading\':isLoading}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="addUsersToMessage()" ng-disabled="addedUsers.length == 0" ng-class="{\'disabled\': addedUsers.length == 0}" class="button green block">Add to Message</button></span></div>'), a.put("partials/popovers/add_sidebar_member.html", '<div class="add-members"><div class="popover-content"><shift-tag-input shift-tags-model="addedUsers" shift-suggestion-name="user" shift-suggestions-model="allowedUsers" shift-suggestion-limit="4" shift-query-model="addUserQuery" placeholder="Add member"></shift-tag-input><span ng-class="{\'loading\':isLoading}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner ng-show="isLoading" class="spinner"></mac-spinner></div><button ng-click="addUsersToSidebar()" ng-disabled="addedUsers.length == 0" ng-class="{\'disabled\': addedUsers.length == 0}" class="button green block">Add to Sidebar</button></span></div></div>'), a.put("partials/popovers/chat.html", '<div class="chat-wrapper"><div class="chat-header"><div ng-click="isAddingUsers = !isAddingUsers" ng-class="{\'active\':isAddingUsers}" class="add-user ga ga-click-chat_popover-add_user"></div><div class="name"><span ng-show="chat.users.length &lt;= 2"><div ng-show="getOnlineStatus(chat)" class="online"></div><div ng-hide="getOnlineStatus(chat)" class="offline"></div><span>{{chat.title}}</span></span><span ng-show="chat.users.length &gt; 2">{{chat.title}}</span></div></div><div ng-show="isAddingUsers" class="add-users-bar"><shift-tag-input shift-tags-model="addedUsers" shift-suggestion-name="user" shift-suggestions-model="addableUsers" shift-suggestion-limit="4" shift-query-model="userQuery.name" placeholder="Add person"><img ng-src="{{user.image.icon}}"/><div class="name"> {{user.name}}</div><div class="title">{{user.title}}</div></shift-tag-input><button ng-click="addUsers()" class="button ga ga-click-chat_popover-add_user_done">Done</button></div><div shift-scroll-to-edge="shift-scroll-to-edge" shift-scroll-to-edge-timeout="50" shift-scroll-to-item-parent="shift-scroll-to-item-parent" shift-disable-bg-scroll="chatPopoverScroll" shift-infinite-scroll="allowLoadHistory()" shift-infinite-scroll-min="loadHistory(chat)" shift-infinite-scroll-offset="50" class="messages-wrap scrollable"><div class="chat-messages"><div ng-show="isLoadingHistory" class="chat-message"><div class="special-message"><div class="loading"><mac-spinner mac-spinner-color="#CBCBCB" mac-spinner-size="10" ng-show="isLoadingHistory"></mac-spinner></div><div class="text">Loading History</div></div></div><div ng-repeat="message in chat.messages | orderBy: \'createdAt\'" ng-switch="message.type" shift-scroll-to-item="shift-scroll-to-item" shift-scroll-to-item-find-parent="shift-scroll-to-item-find-parent" shift-scroll-to-item-condition="selectedMessage == message" shift-scroll-to-item-event="scrollChatMessages" class="chat-message"><div ng-switch-when="offline" class="special-message"><div class="text">{{message.text}}</div></div><div ng-switch-when="online" class="special-message"><div class="text">{{message.text}}</div></div><div ng-switch-default="ng-switch-default"><div class="avatar"><img ng-src="{{message.author.image.icon}}"/></div><div class="name">{{message.author.name}}<div class="time"><span class="separator">-</span><shift-timestamp shift-time="message.createdAt" shift-timestamp-short="shift-timestamp-short" ng-show="!!message.createdAt"></shift-timestamp></div></div><div shift-linkify-text="message.text" class="text"></div></div></div></div></div><form ng-controller="ChatFormController" name="chatForm" class="reply-wrap"><textarea placeholder="Reply" ng-model="newChatMessageText" mac-keydown-enter="sendChatMessage()" shift-focus-on-event="focusChatInput" shift-autogrow="shift-autogrow"></textarea></form></div>'), a.put("partials/popovers/create_team.html", '<div id="create-team" style="width:390px"><div class="popover-content"><div class="create-team-form-wrapper"><i id="team-avatar-preview" class="teamicons large left {{selectedColor}} {{selectedIcon}}"></i><div class="create-team-form"><input ng-model="teamName" type="text" placeholder="Team Name" class="text-input"/><a shift-popover="team-colors-popover" shift-popover-exclude="team-icons-popover" shift-popover-allow-scroll="shift-popover-allow-scroll" shift-popover-child-popover="shift-popover-child-popover" class="button small show-popover">Change Color</a><a shift-popover="team-icons-popover" shift-popover-exclude="team-colors-popover" shift-popover-child-popover="shift-popover-child-popover" class="button small show-popover"> Change Icon</a></div></div><div class="create-team-invite-wrapper"><div class="wrapper"><h3>Invite Contacts to This Team</h3><div class="typeahead-input-wrap search"><input shift-search="shift-search" shift-typeahead="shift-typeahead" shift-search-disable-teams="shift-search-disable-teams" shift-search-people-filter="isItemAvailable(object)" shift-search-on-enter="searchGoToObject(object)" type="text" placeholder="Add Contact" ng-model="createTeamQuery" class="typeahead"/></div><div ng-show="addedContacts.length" class="contact-review"><ul shift-disable-bg-scroll-name="createTeamPopoverUserScroll" shift-disable-bg-scroll="shift-disable-bg-scroll" class="selector-list scrollable"><li ng-repeat="contact in addedContacts"><a ng-click="addedContacts.splice($index, 1)" class="close popover-clickable"></a><select ng-model="contact.role" class="select-role"><option value="1">Admin</option><option value="2">Member</option></select><div class="avatar small left"><img ng-src="{{contact.user.image.icon}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{contact.user.displayName}}</div><div class="text">{{contact.user.userEmail}}</div></div></div></li></ul></div></div><div ng-class="{\'loading\':isCreatingTeam}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-class="{\'disabled\': createTeamDisabled()}" ng-disabled="createTeamDisabled()" ng-click="createTeam()" class="button green block create-team">Create Team</button></div></div></div></div>'), a.put("partials/popovers/edit_contact.html", '<div id="manage-contact"><div class="manage-contact-wrap popover-content"><ul class="popover-section"><li><a ng-click="sendMessage()" class="list-item">Send message</a></li><li><a ng-click="openChat()" class="list-item">Open chat</a></li></ul><ul class="popover-section"><li><a ng-show="isBlocked" ng-click="addContact()" class="list-item">Add Contact</a></li><li><a ng-hide="isBlocked" ng-click="removeContact()" class="list-item">Remove Contact</a></li><li><a ng-hide="isBlocked" ng-click="blockContact()" class="list-item">Block Contact</a></li><li><a ng-show="isBlocked" ng-click="unblockContact()" class="list-item">Unblock Contact</a></li></ul></div></div>'), a.put("partials/popovers/edit_team.html", '<div id="teams-settings"><div class="popover-content user-nav-wrap"><ul class="popover-section"><li><a ng-click="togglePin()" class="list-item">{{pinMessage()}} Team</a></li><li><a ng-click="sendMessage()" class="list-item">Send Message</a></li></ul><ul ng-hide="team.numMembers &lt; 2" class="popover-section"><li><a ng-click="checkLeaveTeam()" class="list-item">Leave This Team</a></li></ul></div></div>'), a.put("partials/popovers/facebook_connect.html", '<div class="connecting-wrap"><div ng-show="communicationError" class="well error">An error occured connnecting with Facebook.&nbsp;<a ng-click="facebookInit()">Try again</a></div><div ng-hide="communicationError" class="status-wrap"><mac-spinner ng-hide="communicationError" class="spinner"></mac-spinner><div class="spinner-message">Connecting with Facebook</div></div><small>Note: A window may popup asking you to authorize access. After you authorize, this popup will show your Facebook contacts.</small></div>'), a.put("partials/popovers/facebook_contacts.html", '<div class="connecting-wrap"><div class="selector"><div class="selector-header"><label class="select-all"><input type="checkbox" ng-model="allFacebookContacts" class="input-checkbox"/>Select all contacts</label><div ng-class="{\'filtering\': facebookFilterQuery.length &gt; 0}" class="filter-wrap"><a ng-click="clearSearchFilter($event)" class="close"></a><input placeholder="Filter" ng-model="facebookFilterQuery" mac-keyup="filterFacebookContacts()" mac-focus="filterActive()" mac-blur="filterInactive()"/></div></div><ul shift-disable-bg-scroll="shift-disable-bg-scroll" shift-disable-bg-scroll-name="facebookContactsScroll" class="selector-list scrollable"><li ng-repeat="contact in filteredFacebookContacts" ng-class="{\'active\': contact.selected}"><div ng-click="toggleContactSelect(contact)" class="list-item"><input type="checkbox" ng-model="contact.selected" ng-click="toggleContactSelect(contact)" class="input-checkbox link"/><div class="avatar small left"><img ng-src="{{contact.img}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{contact.name}}</div></div></div></div></li></ul></div><a ng-click="addContactsToSelected(selectedFacebookContacts)" class="button primary right">Add Selected Contacts</a></div>'), a.put("partials/popovers/google_connect.html", '<div class="connecting-wrap"><div ng-show="communicationError" class="well error">An error occured connnecting with Google.&nbsp;<a ng-click="googleInit()">Try again</a></div><div ng-hide="communicationError" class="status-wrap"><mac-spinner ng-hide="communicationError" class="spinner"></mac-spinner><div class="spinner-message">Connecting with Google</div></div><small>Note: A window may popup asking you to authorize access. After you authorize, this popup will show your Google contacts.</small></div>'), a.put("partials/popovers/google_contacts.html", '<div class="connecting-wrap"><div class="selector"><div class="selector-header"><label class="select-all"><input type="checkbox" ng-model="allGoogleContacts" class="input-checkbox"/>Select all contacts</label><div class="filter-wrap"><a ng-click="clearSearchFilter($event)" class="close"></a><input placeholder="Filter" ng-model="googleFilterQuery" mac-keyup="filterGoogleContacts()" mac-focus="filterActive()" mac-blur="filterInactive()"/></div></div><ul class="selector-list scrollable"><li ng-repeat="contact in filteredGoogleContacts" ng-class="{\'active\': contact.selected}"><div ng-click="toggleContactSelect(contact)" class="list-item"><input type="checkbox" ng-model="contact.selected" ng-click="toggleContactSelect(contact)" class="input-checkbox left"/><div class="avatar left"><img src="/images/default_profile_32.png"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{contact.email}}</div></div></div></div></li></ul></div><a ng-click="addContactsToSelected(selectedGoogleContacts)" class="button primary right">Add Selected Contacts</a></div>'), a.put("partials/popovers/hover_card.html", '<div id="hover-card"><div ng-hide="userSet" class="popover-spinner-wrap"><mac-spinner ng-hide="userSet" class="spinner"></mac-spinner></div><div ng-show="userSet" class="popover-content"><div class="contact-card-wrap"><div ng-hide="user.id == context.currentUser.id" class="contact-buttons-wrap {{buttonClass()}}"><div class="button-group"><a ng-click="sendMessage()" mac-tooltip="Send Message" class="button icon-only small ga ga-click-hovercard-send_message"><i class="donkicons compose gray"></i></a><a ng-click="openChat()" mac-tooltip="Open Chat" class="button icon-only small ga ga-click-hovercard-open_chat"><i class="donkicons chat gray"></i></a></div><a class="contact-button button small hoverable"><span class="contact-text"><i class="donkicons check white text-after"></i>Contacts</span><span ng-click="addContact()" class="add-text ga ga-click-hovercard-add_contact">Add Contact</span><span class="pending-text">Pending</span><span ng-click="removeContact()" class="cancel-text ga ga-click-hovercard-contact_cancel">Cancel</span><span ng-click="removeContact()" class="remove-text ga ga-click-hovercard-contact_remove">Remove</span></a></div><a ng-show="user" ng-click="context.goToUser(user)" class="avatar large left ga ga-click-hovercard-avatar"><img ng-cloak="ng-cloak" ng-src="{{user.image.default}}"/></a><div class="details-wrap large"><div class="v-aligner"></div><div class="details"><a ng-click="context.goToUser(user)" class="text">{{user.displayName}}</a><div class="text">{{user.title}}</div></div></div></div></div></div>'), a.put("partials/popovers/invite_to_team.html", '<div style="width:370px" class="create-team-invite-wrapper"><div class="wrapper"><h3>Invite Contacts to This Team</h3><div class="typeahead-input-wrap search"><input shift-search="shift-search" shift-typeahead="shift-typeahead" shift-search-disable-teams="shift-search-disable-teams" shift-search-show-query="shift-search-show-query" shift-search-people-filter="isItemAvailable(object)" shift-search-on-enter="searchAddContact(object)" type="text" placeholder="Add Contact" ng-model="inviteToTeamQuery" class="typeahead"/></div><div ng-show="addedContacts.length" class="contact-review"><ul class="selector-list scrollable"><li ng-repeat="contact in addedContacts"><a ng-click="addedContacts.splice($index, 1)" class="close popover-clickable"></a><select ng-model="contact.role" class="select-role"><option value="1">Admin</option><option value="2">Member</option></select><div class="avatar small left"><img ng-src="{{contact.user.image.icon}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{contact.user.displayName || contact.user.name}}</div><div class="text">{{contact.user.userEmail}}</div></div></div></li></ul></div></div><div ng-class="{\'loading\':inviting}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="inviteMembers()" ng-disabled="addedContacts.length == 0" ng-class="addedContacts.length == 0" class="button green block create-team">Invite Members</button></div></div>'), a.put("partials/popovers/member_settings.html", '<div class="popover-content user-nav-wrap"><ul ng-show="context.currentUser.isAdminOfTeam()" class="popover-section"><li><a ng-click="setAdminRole()" class="list-item">{{getAdminText()}}</a></li><li><a ng-click="checkRemove()" class="list-item">{{getRemoveText()}}</a></li></ul><ul ng-hide="user.id == context.currentUser.id" class="popover-section"><li><a ng-click="sendMessage()" class="list-item">Send message</a></li><li><a ng-click="openChat()" class="list-item">Open chat</a></li></ul></div>'), a.put("partials/popovers/message_actions.html", '<ul class="popover-section"><li><a ng-click="setMessageMute($event)" class="list-item">{{getMuteText()}}</a></li><li><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this message?" shift-confirm-on="deleteMessage()" shift-confirm-text="Delete" ng-show="message.author.id == context.currentUser.id" class="ga ga-click-message-delete list-item">Delete Message</a></li></ul>'), a.put("partials/popovers/notifications.html", '<div id="notifications"><div shift-disable-bg-scroll-name="notificationsPopoverContentScroll" shift-disable-bg-scroll="shift-disable-bg-scroll" class="popover-content scrollable"><p ng-show="notifications.length == 0" class="placeholder">There are no new notifications</p><ul class="notifications"><li ng-repeat="notification in notifications | orderBy: \'-createdAt\'" class="popover-section"><div ng-controller="NotificationController" ng-click="notificationClick()" class="notification-wrap"><div ng-show="notification.buttons" class="action-buttons"><div ng-class="{\'loading\': button.isWaiting}" ng-repeat="button in notification.buttons" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="performAction($event, button.action, button)" class="button small block {{button.type}}">{{button.label}}</button></div></div><div ng-hide="notification.type == enums.NOTIFICATION_TYPE.USER_INVITED_TO_TEAM" class="avatar small left"><img ng-src="{{notification.author.image.icon}}"/></div><i ng-show="notification.type == enums.NOTIFICATION_TYPE.USER_INVITED_TO_TEAM" class="teamicons small left {{notification.team.color}} {{notification.team.icon}}"></i><div class="notification-text"><a ng-click="context.goToObject(notification.author)" class="username">{{notification.author.name}}</a><span class="text"> {{notification.text}}</span><a ng-show="notification.type == enums.NOTIFICATION_TYPE.PENDING_MESSAGE">View message</a></div></div></li></ul></div></div>'), a.put("partials/popovers/open_app_as.html", '<div id="app-select-team"><div shift-disable-bg-scroll-name="openAppAsPopoverContentScroll" shift-disable-bg-scroll="shift-disable-bg-scroll" class="popover-content scrollable"><ul><li ng-repeat="team in availableTeams | orderBy: \'name\'" ng-click="context.goToApp(application, team)"><a class="team-list-wrap"><i class="teamicons small left {{team.icon}} {{team.color}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{team.name}}</div></div></div></a></li></ul></div></div>'), a.put("partials/popovers/team_colors.html", '<div id="team-colors" class="popover-content"><ul id="colors"><li ng-repeat="color in teamColorOptions"><div ng-click="selectTeamColor($event, $index)" class="teamicons {{color}}"></div></li></ul></div>'), a.put("partials/popovers/team_icons.html", '<div id="team-icons" ng-controller="TeamIconsController" class="popover-content"><ul id="icons"><li ng-repeat="icon in teamIconOptions"><i ng-click="selectTeamIcon($event, $index)" class="teamicons small {{icon.id}}"></i></li></ul></div>'), a.put("partials/popovers/teams_nav.html", '<div id="team-nav"><div class="popover-footer"><a ng-click="createTeam($event)" class="button small block ga ga-click-teams_popover-create_team">Create a Team</a></div><div shift-disable-bg-scroll="teamsNavPopoverScroll" class="popover-content scrollable"><ul class="team-list-wrap"><li><a ng-click="context.goToRoot()"><div class="avatar small left"><img ng-src="{{context.currentUser.image.icon}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text ga ga-click-teams_popover-inbox">Your Inbox</div></div></div></a></li></ul><div ng-show="pinnedTeamMemberships.length &gt; 0" class="popover-section-header">Pinned Teams</div><ul ng-show="pinnedTeamMemberships.length &gt; 0" class="team-list-wrap"><li ng-repeat="membership in pinnedTeamMemberships | orderBy: \'team.name\'"><button ng-class="{\'is-pinned\':membership.isFavorite}" ng-click="toggleFavorite(membership)" class="button gray small pin-button popover-clickable"><i class="donkicons pin"></i></button><a ng-click="context.goToTeam(membership.team)" class="ga ga-click-teams_popover-pinned_team"><i class="teamicons small left {{membership.team.color}} {{membership.team.icon}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{membership.team.name}} &nbsp;<span ng-show="membership.team.unreadCount" class="unread-alert">({{membership.team.unreadCount}})</span></div></div></div></a></li></ul><div ng-show="pinnedTeamMemberships.length &lt;= 0" class="popover-section-header">All Teams</div><div ng-show="pinnedTeamMemberships.length &gt; 0" class="popover-section-header">Other Teams</div><p ng-show="pinnedTeamMemberships.length == 0 &amp;&amp; unPinnedTeamMemberships.length == 0" class="placeholder">You have no teams.</p><ul class="team-list-wrap"><li ng-repeat="membership in unPinnedTeamMemberships | orderBy: \'team.name\'"><button ng-class="{\'is-pinned\':membership.isFavorite}" ng-click="toggleFavorite(membership)" mac-tooltip="Pin to Top" class="button gray small pin-button popover-clickable"><i class="donkicons pin"></i></button><a ng-click="context.goToTeam(membership.team)" class="ga ga-click-teams_popover-unpinned_team"><i class="teamicons small left {{membership.team.color}} {{membership.team.icon}}"></i><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{membership.team.name}} &nbsp;<span ng-show="membership.team.unreadCount" class="unread-alert">({{membership.team.unreadCount}})</span></div></div></div></a></li></ul></div></div>'), a.put("partials/popovers/unread_message.html", '<div><div class="popover-footer"><a ng-click="viewAllMessages()" class="button small block ga ga-click-unread_popover-view_all">View All Messages</a></div><div id="unread-message-notifications"><div class="popover-content"><p ng-show="getUnreadMessages().length == 0" class="placeholder">You have no unread messages</p><ul shift-disable-bg-scroll-name="unreadMessagePopoverContentScroll" shift-disable-bg-scroll="shift-disable-bg-scroll" class="message-preview-list"><li ng-repeat="message in getUnreadMessages() | orderBy: \'-updatedAt\' | limitTo: 5"><a mac-modal="single-message-modal" mac-modal-content="message" class="ga ga-click-unread_popover-view_message"><div class="avatar left"><img ng-src="{{authorImagePath(message)}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text author-wrap"><div class="name">{{message.authorName}}</div></div><div shift-render-text="message" shift-disable-render-link="shift-disable-render-link" class="text message-text"></div><div ng-show="message.files.length &gt; 0" class="attachment">{{message.files[0].filename}}</div><div ng-show="message.link" class="url">{{message.link.url}}</div><div ng-show="message.video.url" class="url">{{message.video.url}}</div><div ng-show="image.sizes.icon" class="photo"><img ng-src="{{image.sizes.icon}}"/></div><div ng-show="message.imageLink" class="photo"><img ng-src="{{message.imageLink.url}}"/></div></div></div></a></li></ul></div></div></div>'), a.put("partials/popovers/user_list.html", '<div id="user-list"><div ng-show="isLoading" class="popover-spinner-wrap"><mac-spinner ng-show="isLoading" class="spinner"></mac-spinner></div><div shift-disable-bg-scroll-name="userListPopoverContentScroll" shift-disable-bg-scroll="shift-disable-bg-scroll" class="popover-content scrollable"><ul class="user-list-wrap"><li ng-repeat="user in users | orderBy:\'user.displayName\'"><a ng-click="context.goToUser(user)"><div class="avatar small left"><img ng-src="{{user.image.icon}}"/></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">{{user.displayName}}</div></div></div></a></li></ul></div></div>'), a.put("partials/popovers/user_nav.html", '<div id="user-nav"><div class="popover-content user-nav-wrap"><ul class="popover-section"><li><a ng-click="context.goToUserSettings()" class="list-item ga ga-click-usernav_popover-manage_account">Manage Account</a></li><li><a ng-click="context.goToCurrentUser(\'address-book\')" class="list-item ga ga-click-usernav_popover-manage_contacts">Manage Contacts</a></li></ul><ul ng-show="context.currentUser.developer" class="popover-section"><li><a href="https://developers.shift.com" target="_blank" class="list-item ga ga-click-usernav_popover-developer_center">Developer Center</a></li></ul><ul class="popover-section"><li><a href="https://support.shift.com" target="_blank" class="list-item ga ga-click-usernav_popover-give_feedback">Give Feedback</a></li><li><a ng-click="context.logout()" class="list-item ga ga-click-usernav_popover-logout">Log Out</a></li></ul></div></div>'), a.put("partials/single_message.html", '<div id="single-message" class="permalink-page"><div class="container medium"><div ng-show="shouldShowAlertBar()" class="well notice"><span class="contact-alert-message">{{message.author.displayName}} is not in your address book.</span><div ng-class="{\'loading\': blockingContact}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to block this sender?" shift-confirm-on="blockAuthor()" shift-confirm-text="Block" ng-disabled="blockingContact" ng-class="{\'disabled\': blockingContact}" class="button block-contact-user">Block</button></div><div ng-class="{\'loading\': addingContact}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="addAuthorToContacts()" ng-class="{\'disabled\': addingContact }" ng-disabled="addingContact" class="button green add-contact-user">Add</button></div></div><div class="single-message"><div ng-show="message" ng-controller="MessageController" class="message"><a ng-show="message.authorType != \'application\'" ng-click="context.goToUser(message.author)" ng-class="{\'online\': authorIsOnline(message)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" class="message-avatar avatar large left"><img ng-src="{{message.author.image.default}}"/></a><a ng-click="context.goToUser(message.author)" ng-show="message.authorType == \'application\'" class="message-avatar avatar large left"><img ng-src="{{message.author.images[0].sizes.large}}"/></a><div class="content-wrap"><a ng-class="{\'visible\': messageIsUnread()}" ng-click="markMessage(\'read\', $event)" class="unread"></a><div class="message-header"><a shift-popover="message-actions" shift-popover-content="message" shift-popover-exclude="message-actions" shift-popover-child-popover="shift-popover-child-popover" class="message-settings gray right show-popover"><i class="donkicons drop-down gray"></i></a><div class="author"><i mac-tooltip="Private Message" ng-show="shouldShowMessageLock()" class="donkicons lock gold left"></i><a shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" ng-click="context.goToUser(message.author)" ng-bind-html-unsafe="message.authorName | highlight : searchedQuery" class="name left ga ga-click-message-author_name"></a><div class="string left">&nbsp;to&nbsp;</div><div ng-repeat="user in getAddressedUsers() | limitTo: getUserLimit()"><div ng-show="$last &amp;&amp; getAddressedUsers().length &lt; 5 &amp;&amp; getAddressedUsers().length != 1" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length == 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToUser(user)" class="name left ga ga-click-message-recipient_name">{{user.name}}</a><a ng-show="getAddressedUsers().length &gt; 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToObject(user)" class="name left ga ga-click-message-recipient_name">{{user.firstName}}</a><div ng-show="showComma($index)" class="string left">,&nbsp;</div></div><div ng-show="getAddressedUsers().length &gt;= 5" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length &gt;= 5" ng-click="showAddressedUsers($event)" class="name left ga ga-click-message-more_recipients">{{"Other" | pluralize: getHiddenUsers()}}</a><a ng-show="message.toWho.teams.length &amp;&amp; getAddressedUsers().length == 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name left"><span>{{message.toWho.teams[0].name}}</span></a><a ng-show="getAddressedUsers().length &gt; 0" shift-popover="add-message-users" shift-popover-content="message" class="add-contact left ga ga-click-message-add_user"></a></div></div><div ng-class="{\'truncate\': shouldTruncateMessage()}" class="message-content"><p shift-render-text="message" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text"></p><div ng-show="message.attachments.length &gt; 0"><div class="attachments"><ul ng-class="{\'small\': !messageImagesExpanded}" ng-click="toggleMessageImagesExpanded()" class="attachment image-attachment ga ga-click-message-attachment_image"><li ng-repeat="image in message.images"><img ng-src="{{image.sizes.original}}"/></li><li ng-repeat="imageLink in message.imageLinks"><img ng-src="{{imageLink.url}}"/></li></ul><a ng-repeat="link in message.links" ng-href="{{link._url || link.url}}" target="_blank" class="attachment link-attachment ga ga-click-message-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link._url || link.url}}</small></div></a><a ng-repeat="file in message.files" ng-href="{{file.url}}" target="_blank" ng-click="markMessage(\'read\');$event.stopPropagation()" class="attachment file-attachment ga ga-click-message-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in message.videos" ng-href="{{video.url}}" target="_blank" class="attachment video-attachment ga ga-click-message-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div><div ng-show="fromApplication(message) &amp;&amp; message.mentions.length &gt; 0" class="attachments"><a ng-click="goToObject()" class="attachment link-attachment ga ga-click-message-attachment_app_object"><div class="link-image"><img ng-src="{{getAppObjAttachmentImage().medium}}" ng-click="goToObject()"/></div><div class="link-wrap"><div class="v-aligner"></div><div class="link-details"><div class="link-title">{{getAppObjAttachmentText()}}</div></div></div></a></div></div><a ng-click="expandMessage($event)" ng-hide="isExpanded || !shouldTruncateMessage()" class="show-more"><div class="message-text left">{{getShowMoreMessage()}}</div><div class="attachment-group"><div ng-show="message.images.length &gt; 0" ng-repeat="image in message.images" class="image"><img ng-src="{{image.sizes.icon}}"/></div><i ng-show="message.links.length &gt; 0" class="donkicons link gray"></i><div ng-show="message.imageLinks.length &gt; 0" ng-repeat="imageLink in message.imageLinks" class="image"><img ng-src="{{imageLink.url}}"/></div><i ng-repeat="ext in getFileExtensions()" class="donkicons file {{ext}}"></i><div ng-repeat="video in message.videos" ng-show="message.videos.length &gt; 0" class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div></div></a><div class="message-meta"><a ng-show="message.toWho.teams.length" class="team-context left"><i class="teamicons tiny right {{message.toWho.teams[0].color}} {{message.toWho.teams[0].icon}}"></i></a><a ng-show="message.toWho.teams.length &gt; 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name">{{message.toWho.teams[0].name}}</a><span ng-show="message.toWho.teams.length">&nbsp;&middot;&nbsp;</span><a href="#/messages/{{message.id}}" class="timestamp"><shift-timestamp shift-time="message.createdAt"></shift-timestamp></a></div><div class="message-footer"><div class="click-actions-wrap"><a shift-popover="user-list-popover" shift-popover-content="message" shift-popover-child-popover="shift-popover-child-popover" ng-show="message.numHighFives &gt; 0" class="left high-fivers-link">({{message.numHighFives}})</a><a mac-tooltip="{{message.userHighFived | boolean:\'Un-High Five\':\'High Five\'}}" ng-class="{\'active\': message.userHighFived}" ng-click="setHighFive($event, message)" class="high-five-wrap left"><i class="donkicons high-five gray"></i></a><a mac-tooltip="Follow Up" ng-click="setFollowUp($event)" ng-class="{\'active\': isFollowed()}" class="follow-up-wrap left"><i class="donkicons check gray"></i></a></div><div class="reply-actions-wrap"><a ng-click="toggleReplies()" ng-class="{\'unread-link\': message.hasUnreadReplies, \'active\': repliesAreExpanded}" class="replies-link">replies&nbsp;<span ng-show="message.numReplies &gt; 0">({{message.numReplies}})</span></a><a ng-click="toggleSidebars()" ng-class="{\'unread-link\': message.hasUnreadSidebars, \'active\': sidebarsAreExpanded}" class="sidebars-link">sidebars&nbsp;<span ng-show="message.sidebars.length">({{message.sidebars.length}})</span></a></div></div></div><div ng-switch="footerSection"><div ng-switch-when="replies" class="replies-wrap visible"><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><div ng-switch-when="sidebars" class="sidebars-wrap visible"><div ng-repeat="sidebar in message.sidebars | orderBy: \'-dateCreated\'" ng-controller="SidebarController" class="sidebar"><div class="sidebar-header"><div class="sidebar-header-content visible"><div ng-show="context.currentUser.id == sidebar.creator.id" shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this sidebar?" shift-confirm-on="deleteSidebar(message, sidebar)" shift-confirm-text="Delete" class="sidebar-delete-wrap"><button class="sidebar-delete-button button small right">Delete</button></div><ul class="sidebar-members"><li ng-repeat="member in sidebar.members" class="member left"><a ng-click="context.goToUser(member)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="member" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><form ng-controller="SidebarFormController" name="sidebarForm" class="sidebar"><div class="sidebar-header"><div ng-class="{\'visible\': !sidebarFormIsVisible, \'hide\': !sidebarButtonIsActive}" class="sidebar-create-wrap center"><button ng-click="toggleSidebarForm()" class="create-sidebar-button button small">Start New Sidebar</button></div><div ng-class="{\'visible\': sidebarFormIsVisible}" class="sidebar-header-content"><div class="sidebar-add-member-wrap"><div ng-class="{\'loading\': loadingUsers}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="showAddSidebarMembers($event)" class="add-member-button button small right">Add Member</button></div><small ng-hide="sidebarMembers.length &gt; 0" class="help-text right">Start a sidebar by adding a team member.</small></div><ul class="sidebar-members"><li class="member left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="avatar small"><img ng-src="{{context.currentUser.image.icon}}"/></a></li><li ng-repeat="member in sidebarMembers" class="member left"><a href="#" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><ul ng-show="sidebarMembers.length &gt; 0" class="replies"><li class="reply"><a class="avatar small online left"><img ng-class="{\'online\': context.currentUser.online}" ng-src="{{context.currentUser.image.icon}}"/></a><div class="reply-content-wrap"><div ng-class="{\'active\':focused}" ng-click="focused = true" class="composer-wrap"><div class="composer"><shift-message-input shift-message-input-type="textarea" shift-message-input-name="sidebarText" shift-message-input-placeholder="Privately reply on this sidebar" shift-message-input-ng-model="messageText" shift-message-input-obj-type="sidebar" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="sidebarAttachments" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div ng-class="{\'visible\': messageText.length &gt; 0}" class="composer-footer"><span ng-class="{\'loading\': isSubmittingSidebar}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="submitSidebar(message)" ng-disabled="messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0}" class="button primary">Create Sidebar</button></span></div><div class="drop-overlay"></div></div></div></li></ul></form></div></div></div></div><div ng-show="messageWasDeleted" class="no-message"><div class="section-wrap"><h1 class="center">The message no longer exists.</h1></div><div class="center"><a ng-click="context.goToRoot()">View your inbox</a></div></div></div></div>'), a.put("partials/stream.html", '<div id="stream"><div shift-infinite-scroll="fetchMoreMessages()" shift-infinite-scroll-document="shift-infinite-scroll-document" class="content"><div ng-controller="FilterBarController" class="section-wrap large"><div id="filter-bar"><div class="controls"><div ng-class="{\'filtering\':messageText}" class="filter-wrap right"><a ng-click="exitFromSearch()" class="close"></a><shift-message-input shift-message-input-on-submit="searchMessages(text)" shift-message-input-name="searchField" shift-message-input-placeholder="Search Messages" shift-message-input-type="input" shift-message-input-obj-type="search" shift-message-input-ng-model="messageText" shift-message-input-mentions="searchUsers" shift-disable-attachment="shift-disable-attachment" class="ga ga-click-filterbar-search"></shift-message-input></div></div><ul ng-hide="context.selectedObjectType == \'User\' &amp;&amp; context.selectedObject.id != context.currentUser.id" class="nav-pills"><li ng-class="{\'active\':activeFilter == \'\' || activeFilter == \'inbox\'}" class="all"><a ng-click="filterMessages(\'\')" class="ga ga-click-filterbar-inbox">{{context.selectedUser == context.currentUser | boolean: \'Inbox\' : \'All\'}}</a></li><li ng-show="context.selectedObjectType == \'User\'" ng-class="{\'active\':activeFilter == \'direct\'}" class="direct"><a ng-click="filterMessages(\'direct\')" class="ga ga-click-filterbar-direct">Direct<!--static for now, make it live--><span ng-show="context.selectedObject.unreadCounts.tags._direct" class="alert">({{context.selectedObject.unreadCounts.tags._direct || 0}})</span></a></li><li ng-class="{\'active\':activeFilter == \'unread\'}" class="unread"><a ng-click="filterMessages(\'unread\')" class="ga ga-click-filterbar-unread">Unread<span ng-show="context.selectedObject.unreadCount" class="unread-notification">({{context.selectedObject.unreadCount}})</span></a></li><li ng-class="{\'active\':activeFilter == \'sent\'}" class="sent"><a ng-click="filterMessages(\'sent\')" class="ga ga-click-filterbar-sent">Sent</a></li><li ng-class="{\'active\':activeFilter == \'other\'}" class="other"><a ng-click="filterMessages(\'other\')" ng-show="context.selectedObject.id == context.currentUser.id" class="ga ga-click-filterbar-other">Other</a></li></ul></div></div><div ng-cloak="ng-cloak" ng-show="searchedQuery &amp;&amp; !isLoading" class="well large bold">{{"message" | pluralize: totalMessages}} found for&nbsp;<span class="search-highlight">{{searchedQuery}}</span></div><div ng-show="context.selectedObjectType == \'Team\' &amp;&amp; selectedFilter == \'inbox\'" class="section-wrap large to-team"><div ng-controller="ComposerController" name="composerForm" class="composer-wrapper"><a ng-hide="source == \'popover\'" ng-click="context.goToUser(context.currentUser)" class="avatar large left"><img ng-src="{{context.currentUser.image.default}}"/></a><div ng-class="{\'has-team\':addressingTeam || source == \'stream\', \'active\':focused || source == \'modal\'}" ng-click="focused = true" class="composer-wrap"><div class="composer"><div class="recipients"><div ng-hide="addressingTeam" class="contact-recipient-wrap"><shift-tag-input shift-tags-model="addressedUsers" shift-tags-on-keydown="onKeydown($event, query)" shift-tags-on-blur="addEmailUser(query)" shift-suggestions-model="getSuggestedUsers()" shift-query-model="addressedUserQuery.name" placeholder="Add contact or team" shift-tags-disable-team="addressingUsers"></shift-tag-input></div><div ng-show="addressingTeam" class="contact-recipient-wrap"><div class="typeahead-input-wrap tokenizing"><div ng-click="addressedUsers.splice(0,1)" class="token team button small"><i class="teamicons left tiny {{addressedUsers[0].color}} {{addressedUsers[0].icon}}"></i><div class="name">{{addressedUsers[0].name}}</div></div></div></div><div ng-show="addressingTeam || source == \'stream\'" ng-class="{\'active\': !showToPlaceholder}" class="team-recipient-wrap"><div class="to-placeholder">All members or&nbsp;<a ng-click="showOptionalTagInput()" class="limit-visibility">limit visibility</a></div><div ng-class="{\'active\': !showToPlaceholder}" class="tokenizing"><shift-tag-input shift-tags-model="optionalAddressedUsers" shift-tags-on-keydown="optionalOnKeydown()" shift-tags-on-blur="onTagInputBlur($event)" shift-suggestions-model="optionalUsers" shift-query-model="addressedUserQuery.name" placeholder="Add Member"></shift-tag-input></div></div></div><shift-message-input ng-submit="submitComposer()" shift-message-input-name="composerText" shift-message-input-placeholder="Send a new message" shift-message-input-ng-model="messageText" shift-message-input-ng-disabled="isSubmittingReply" shift-message-input-obj-type="message" shift-message-input-is-global="source == \'modal\'" shift-message-input-attachments="composerAttachments" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-mentions="mentionedUsers" shift-message-input-required="shift-message-input-required" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div ng-class="{\'visible\':(messageText||composerAttachments.length)}" class="composer-footer"><span ng-disabled="isSubmittingMessage || pendingAttachmentCount &gt; 0" ng-click="submitComposer()" ng-class="{\'loading\': isSubmittingMessage}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><span ng-class="{\'active\':isSubmittingMessage}" class="button primary">Send Message</span></span></div><div class="drop-overlay"></div></div></div></div><a ng-show="incomingMessages.length &gt; 0" ng-click="displayIncomingMessages()" class="new-messages-bar">{{"New Update" | pluralize: incomingMessages.length}}\n</a><div id="unread-messages" ng-show="selectedFilter == \'unread\' &amp;&amp; context.selectedObject.unreadCount &gt; 0" class="well"><div class="well-col">You have {{context.selectedObject.unreadCount}} unread {{"message" | pluralize: context.selectedObject.unreadCount : false}}</div><div class="well-col has-button"><div ng-class="{\'loading\': markLoading}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><a ng-click="markAllMessagesRead()" class="button small">Mark All Messages Read</a></div></div></div><div id="messages"><div ng-repeat="message in messages" ng-click="markMessageAsRead(message)" ng-controller="MessageController" class="message"><a ng-show="message.authorType != \'application\'" ng-click="context.goToUser(message.author)" ng-class="{\'online\': authorIsOnline(message)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" class="message-avatar avatar large left"><img ng-src="{{message.author.image.default}}"/></a><a ng-click="context.goToUser(message.author)" ng-show="message.authorType == \'application\'" class="message-avatar avatar large left"><img ng-src="{{message.author.images[0].sizes.large}}"/></a><div class="content-wrap"><a ng-class="{\'visible\': messageIsUnread()}" ng-click="markMessage(\'read\', $event)" class="unread"></a><div class="message-header"><a shift-popover="message-actions" shift-popover-content="message" shift-popover-exclude="message-actions" shift-popover-child-popover="shift-popover-child-popover" class="message-settings gray right show-popover"><i class="donkicons drop-down gray"></i></a><div class="author"><i mac-tooltip="Private Message" ng-show="shouldShowMessageLock()" class="donkicons lock gold left"></i><a shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="message.author" ng-click="context.goToUser(message.author)" ng-bind-html-unsafe="message.authorName | highlight : searchedQuery" class="name left ga ga-click-message-author_name"></a><div class="string left">&nbsp;to&nbsp;</div><div ng-repeat="user in getAddressedUsers() | limitTo: getUserLimit()"><div ng-show="$last &amp;&amp; getAddressedUsers().length &lt; 5 &amp;&amp; getAddressedUsers().length != 1" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length == 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToUser(user)" class="name left ga ga-click-message-recipient_name">{{user.name}}</a><a ng-show="getAddressedUsers().length &gt; 1" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="user" ng-click="context.goToObject(user)" class="name left ga ga-click-message-recipient_name">{{user.firstName}}</a><div ng-show="showComma($index)" class="string left">,&nbsp;</div></div><div ng-show="getAddressedUsers().length &gt;= 5" class="string left">&nbsp;and&nbsp;</div><a ng-show="getAddressedUsers().length &gt;= 5" ng-click="showAddressedUsers($event)" class="name left ga ga-click-message-more_recipients">{{"Other" | pluralize: getHiddenUsers()}}</a><a ng-show="message.toWho.teams.length &amp;&amp; getAddressedUsers().length == 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name left"><span>{{message.toWho.teams[0].name}}</span></a><a ng-show="getAddressedUsers().length &gt; 0" shift-popover="add-message-users" shift-popover-content="message" class="add-contact left ga ga-click-message-add_user"></a></div></div><div ng-class="{\'truncate\': shouldTruncateMessage()}" class="message-content"><p shift-render-text="message" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text"></p><div ng-show="message.attachments.length &gt; 0"><div class="attachments"><ul ng-class="{\'small\': !messageImagesExpanded}" ng-click="toggleMessageImagesExpanded()" class="attachment image-attachment ga ga-click-message-attachment_image"><li ng-repeat="image in message.images"><img ng-src="{{image.sizes.original}}"/></li><li ng-repeat="imageLink in message.imageLinks"><img ng-src="{{imageLink.url}}"/></li></ul><a ng-repeat="link in message.links" ng-href="{{link._url || link.url}}" target="_blank" class="attachment link-attachment ga ga-click-message-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link._url || link.url}}</small></div></a><a ng-repeat="file in message.files" ng-href="{{file.url}}" target="_blank" ng-click="markMessage(\'read\');$event.stopPropagation()" class="attachment file-attachment ga ga-click-message-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in message.videos" ng-href="{{video.url}}" target="_blank" class="attachment video-attachment ga ga-click-message-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div><div ng-show="fromApplication(message) &amp;&amp; message.mentions.length &gt; 0" class="attachments"><a ng-click="goToObject()" class="attachment link-attachment ga ga-click-message-attachment_app_object"><div class="link-image"><img ng-src="{{getAppObjAttachmentImage().medium}}" ng-click="goToObject()"/></div><div class="link-wrap"><div class="v-aligner"></div><div class="link-details"><div class="link-title">{{getAppObjAttachmentText()}}</div></div></div></a></div></div><a ng-click="expandMessage($event)" ng-hide="isExpanded || !shouldTruncateMessage()" class="show-more"><div class="message-text left">{{getShowMoreMessage()}}</div><div class="attachment-group"><div ng-show="message.images.length &gt; 0" ng-repeat="image in message.images" class="image"><img ng-src="{{image.sizes.icon}}"/></div><i ng-show="message.links.length &gt; 0" class="donkicons link gray"></i><div ng-show="message.imageLinks.length &gt; 0" ng-repeat="imageLink in message.imageLinks" class="image"><img ng-src="{{imageLink.url}}"/></div><i ng-repeat="ext in getFileExtensions()" class="donkicons file {{ext}}"></i><div ng-repeat="video in message.videos" ng-show="message.videos.length &gt; 0" class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div></div></a><div class="message-meta"><a ng-show="message.toWho.teams.length" class="team-context left"><i class="teamicons tiny right {{message.toWho.teams[0].color}} {{message.toWho.teams[0].icon}}"></i></a><a ng-show="message.toWho.teams.length &gt; 0" ng-click="context.goToObject(message.toWho.teams[0])" class="name">{{message.toWho.teams[0].name}}</a><span ng-show="message.toWho.teams.length">&nbsp;&middot;&nbsp;</span><a href="#/messages/{{message.id}}" class="timestamp"><shift-timestamp shift-time="message.createdAt"></shift-timestamp></a></div><div class="message-footer"><div class="click-actions-wrap"><a shift-popover="user-list-popover" shift-popover-content="message" shift-popover-child-popover="shift-popover-child-popover" ng-show="message.numHighFives &gt; 0" class="left high-fivers-link">({{message.numHighFives}})</a><a mac-tooltip="{{message.userHighFived | boolean:\'Un-High Five\':\'High Five\'}}" ng-class="{\'active\': message.userHighFived}" ng-click="setHighFive($event, message)" class="high-five-wrap left"><i class="donkicons high-five gray"></i></a><a mac-tooltip="Follow Up" ng-click="setFollowUp($event)" ng-class="{\'active\': isFollowed()}" class="follow-up-wrap left"><i class="donkicons check gray"></i></a></div><div class="reply-actions-wrap"><a ng-click="toggleReplies()" ng-class="{\'unread-link\': message.hasUnreadReplies, \'active\': repliesAreExpanded}" class="replies-link">replies&nbsp;<span ng-show="message.numReplies &gt; 0">({{message.numReplies}})</span></a><a ng-click="toggleSidebars()" ng-class="{\'unread-link\': message.hasUnreadSidebars, \'active\': sidebarsAreExpanded}" class="sidebars-link">sidebars&nbsp;<span ng-show="message.sidebars.length">({{message.sidebars.length}})</span></a></div></div></div><div ng-switch="footerSection"><div ng-switch-when="replies" class="replies-wrap visible"><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><div ng-switch-when="sidebars" class="sidebars-wrap visible"><div ng-repeat="sidebar in message.sidebars | orderBy: \'-dateCreated\'" ng-controller="SidebarController" class="sidebar"><div class="sidebar-header"><div class="sidebar-header-content visible"><div ng-show="context.currentUser.id == sidebar.creator.id" shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this sidebar?" shift-confirm-on="deleteSidebar(message, sidebar)" shift-confirm-text="Delete" class="sidebar-delete-wrap"><button class="sidebar-delete-button button small right">Delete</button></div><ul class="sidebar-members"><li ng-repeat="member in sidebar.members" class="member left"><a ng-click="context.goToUser(member)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="member" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><div ng-show="!sidebar"><a ng-hide="allRepliesShown || replyCount &lt;= maxVisibleReplyCount" ng-click="showAllReplies()" class="show-all-replies ga ga-click-message-reply_show_all">Show {{"previous reply" | pluralize: replyCount - maxVisibleReplyCount}}</a><a ng-show="getNewReplyCount() &gt; 0" ng-click="displayUpdates()" class="show-all-replies ga ga-click-message-reply_new_replies">{{"New Reply" | pluralize: getNewReplyCount()}}</a></div><ul class="replies"><li ng-controller="ReplyController" ng-repeat="reply in thread | orderBy: \'createdAt\'" ng-switch="reply.constructor.typeName" class="reply"><div ng-switch-when="Reply" class="reply-item"><a ng-click="context.goToUser(reply.author)" ng-class="{\'online\': authorIsOnline(reply)}" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" class="avatar small left ga ga-click-message-reply_author_avatar"><img ng-src="{{reply.author.image.icon}}"/></a><div class="reply-content-wrap"><div class="message-header"><div class="author"><i mac-tooltip="Private Message" ng-show="sidebar != null" class="donkicons lock gold left"></i><a ng-click="context.goToUser(reply.author)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.author" ng-bind-html-unsafe="reply.author.displayName | highlight : searchedQuery" class="name left ga ga-click-message-reply_author_name"></a></div></div><div class="message-content"><div ng-show="reply.text.length &gt; 0"><p shift-render-text="reply" shift-render-text-highlight="searchedQuery" shift-render-text-url="shift-render-text-url" class="message-text shift-render-text"></p></div><div ng-show="reply.attachments.length &gt; 0"><div class="attachments"><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment small ga ga-click-reply-attachment_image"><img ng-src="{{image.sizes.original}}" ng-repeat="image in reply.images"/></a><a ng-class="{\'small\': !replyImagesExpanded}" ng-click="toggleReplyImagesExpanded()" class="attachment image-attachment ga ga-click-reply-attachment_image_link"><div class="link-image"><img ng-repeat="imageLink in reply.imageLinks" ng-src="{{imageLink.url}}"/></div></a><a ng-repeat="link in reply.links" ng-href="{{link.url}}" target="_blank" class="link-attachment ga ga-click-reply-attachment_link_preview"><div ng-show="link.images.length &gt; 0" class="link-image"><img ng-src="{{link.images[0]}}"/></div><div class="link-details"><div class="link-title">{{link.title || showDomain(link.url)}}</div><small class="link-address">  {{link.url}}</small></div></a><a ng-repeat="file in reply.files" ng-href="{{file.url}}" target="_blank" class="file-attachment ga ga-click-reply-attachment_file"><i class="donkicons file {{getFileExtension(file.filename)}}"></i><div class="filename">{{file.filename}}</div></a><a ng-repeat="video in reply.videos" ng-href="{{video.url}}" target="_blank" class="video-attachment ga ga-click-reply-attachment_video_preview"><div class="link-image"><img ng-src="{{video.images[0]}}"/><div class="play-overlay"></div></div><div class="link-details"><div class="link-title">{{video.title}}</div><small class="link-address">{{video.url}}</small></div></a></div></div></div><div class="message-meta"><span class="timestamp"><shift-timestamp shift-time="reply.createdAt"></shift-timestamp></span><span>&nbsp;&middot;&nbsp;</span><a ng-click="setHighFive($event, reply);markMessage(\'read\', $event);" ng-class="{\'active\': reply.userHighFived}" class="ga ga-click-message-reply_highfive">high-five</a><span>&nbsp;</span><a shift-popover="user-list-popover" shift-popover-content="reply" shift-popover-child-popover="shift-popover-child-popover" ng-show="reply.numHighFives &gt; 0" class="high-fivers-link ga ga-click-message-reply_show_highfivers">({{reply.numHighFives}})</a><span ng-show="reply.author.id == context.currentUser.id"><span>&nbsp;&middot;&nbsp;</span><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Are you sure you want to delete this reply?" shift-confirm-on="deleteReply(message, sidebar, reply)" shift-confirm-text="Delete" class="delete-reply ga ga-click-message-reply_delete">delete</a></span></div></div></div><div ng-switch-when="MessageEvent" class="message-event"><a ng-click="context.goToUser(reply.actor)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.actor">{{reply.actor.name}}</a>&nbsp;added&nbsp;<a ng-click="context.goToUser(reply.userAdded)" shift-popover="hover-card-popover" shift-popover-trigger="hover" shift-popover-content="reply.userAdded">{{reply.userAdded.name}}</a></div><li class="reply"><div class="avatar small left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="ga ga-click-message-reply_author_avatar"><img ng-src="{{context.currentUser.image.icon}}"/></a></div><div class="reply-content-wrap"><form name="replyForm" ng-controller="ReplyFormController" ng-class="{\'active\': focused || messageText}" ng-click="focused = true" class="reply-form composer-wrap"><div class="composer"><shift-message-input link-data="linkData" shift-message-input-type="textarea" shift-message-input-name="replyText" shift-message-input-placeholder="replyPlaceholder" shift-message-input-ng-model="messageText" shift-message-input-obj-type="replyObject" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="replyAttachments" shift-message-input-focus-on-event="repliesExpanded" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div class="composer-footer visible"><span ng-class="{\'loading\':isSubmittingReply}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="createReply(message, sidebar)" ng-disabled="messageText.length == 0 &amp;&amp; replyAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; replyAttachments.length == 0}" class="button primary right">Send Reply</button></span></div><div class="drop-overlay"></div></form></div></li></li></ul></div><form ng-controller="SidebarFormController" name="sidebarForm" class="sidebar"><div class="sidebar-header"><div ng-class="{\'visible\': !sidebarFormIsVisible, \'hide\': !sidebarButtonIsActive}" class="sidebar-create-wrap center"><button ng-click="toggleSidebarForm()" class="create-sidebar-button button small">Start New Sidebar</button></div><div ng-class="{\'visible\': sidebarFormIsVisible}" class="sidebar-header-content"><div class="sidebar-add-member-wrap"><div ng-class="{\'loading\': loadingUsers}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><button ng-click="showAddSidebarMembers($event)" class="add-member-button button small right">Add Member</button></div><small ng-hide="sidebarMembers.length &gt; 0" class="help-text right">Start a sidebar by adding a team member.</small></div><ul class="sidebar-members"><li class="member left"><a ng-click="context.goToUser(context.currentUser)" ng-class="{\'online\': context.currentUser.online}" class="avatar small"><img ng-src="{{context.currentUser.image.icon}}"/></a></li><li ng-repeat="member in sidebarMembers" class="member left"><a href="#" ng-class="{\'online\': member.online}" class="avatar small"><img ng-src="{{member.image.icon}}"/></a></li></ul></div></div><ul ng-show="sidebarMembers.length &gt; 0" class="replies"><li class="reply"><a class="avatar small online left"><img ng-class="{\'online\': context.currentUser.online}" ng-src="{{context.currentUser.image.icon}}"/></a><div class="reply-content-wrap"><div ng-class="{\'active\':focused}" ng-click="focused = true" class="composer-wrap"><div class="composer"><shift-message-input shift-message-input-type="textarea" shift-message-input-name="sidebarText" shift-message-input-placeholder="Privately reply on this sidebar" shift-message-input-ng-model="messageText" shift-message-input-obj-type="sidebar" shift-suggestion-limit="4" shift-message-input-attachment-count="pendingAttachmentCount" shift-message-input-attachments="sidebarAttachments" shift-message-input-autogrow="shift-message-input-autogrow" shift-message-input-confirm-on-leave="shift-message-input-confirm-on-leave"></shift-message-input></div><div ng-class="{\'visible\': messageText.length &gt; 0}" class="composer-footer"><span ng-class="{\'loading\': isSubmittingSidebar}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner block"></mac-spinner></div><button ng-click="submitSidebar(message)" ng-disabled="messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0" ng-class="{\'disabled\': messageText.length == 0 &amp;&amp; sidebarAttachments.length == 0}" class="button primary">Create Sidebar</button></span></div><div class="drop-overlay"></div></div></div></li></ul></form></div></div></div><div ng-show="isLoading || (messageLoadingExhausted &amp;&amp; messages.length &gt; 0)" class="more-messages-message"><div ng-show="isLoading" class="spinner-block-wrap"><mac-spinner ng-show="isLoading" class="spinner large block"></mac-spinner></div><div ng-show="messageLoadingExhausted &amp;&amp; messages.length &gt; 0" class="placeholder large center">End of Messages</div></div><div ng-show="messages.length == 0 &amp;&amp; !isLoading" class="placeholder large center">No Messages</div></div></div></div>'), a.put("partials/team_form.html", '<div id="edit-team"><h1>Team Settings</h1><div class="permalink-section-wrap"><div class="settings-well-group"><div class="well"><div ng-class="{\'on\': getTeamMute()}" ng-click="toggleTeamMute()" class="switch-wrap right"><a class="switch-plate"><i class="donkicons check"></i><div class="switch"></div></a></div><div class="settings-icon left"><i class="donkicons inbox white"></i></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">Skip Inbox</div><div class="text">Prevent all messages from hitting your inbox or notifications.</div></div></div></div><div class="well"><div ng-class="{\'on\': getTeamFavorite()}" ng-click="toggleTeamFavorite()" class="switch-wrap right"><a class="switch-plate"><i class="donkicons check"></i><div class="switch"></div></a></div><div class="settings-icon left"><i class="donkicons pin white"></i></div><div class="details-wrap"><div class="v-aligner"></div><div class="details"><div class="text">Pin Team</div><div class="text">Adds this team to "Pinned Teams" in your team navigation.</div></div></div></div></div><div ng-show="context.currentUser.isAdminOfTeam()"><h2>Team Name &amp; Design</h2><div class="edit-team-form-wrapper"><i class="teamicons large left {{selectedColor}} {{selectedIcon}}"></i><div class="create-team-form"><input ng-model="teamName" type="text" placeholder="Team name" class="text-input"/><a shift-popover="team-colors-popover" shift-popover-exclude="team-icons-popover" shift-popover-allow-scroll="shift-popover-allow-scroll" class="button small show-popover">Change Color</a><a shift-popover="team-icons-popover" shift-popover-exclude="team-colors-popover" class="button small show-popover"> Change Icon</a></div><div ng-class="{\'loading\': teamLoading}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><a ng-show="canSave" ng-click="updateTeam()" class="button green right">Save Changes</a></div></div></div><h2 ng-hide="context.selectedTeam.members.length &lt; 2" class="no-border">Leave Team</h2><div ng-hide="context.selectedTeam.members.length &lt; 2" class="well error"><div class="well-col">Leaving this team will not delete your messages or replies. You must be re-invited to access this team or it’s apps after leaving.</div><div class="well-col has-button"><a ng-click="checkLeave()" class="button red">Leave This Team</a></div></div><h2 class="no-border hide">Delete Team</h2><div class="well error hide"><div class="well-col">Deleting this team is permanent. You will loose all of your team members, messages, files, and apps.</div><div class="well-col has-button"><a shift-confirm-dialog="shift-confirm-dialog" shift-confirm-message="Deleting this team is permanent. You will loose all of your team members, messages, files, and apps. THIS CANNOT BE UNDONE." shift-confirm-on="deleteTeam()" class="button red show-confirm">Delete Team</a></div></div></div></div>'), a.put("partials/teams_page.html", '<div id="teams-page"><div class="content"><div class="section-wrap large"><a shift-popover="create-team-popover" class="button small right">Create Team</a><div class="content-title">{{"Team" | pluralize: getTeams().length}}</div></div><ul class="teams-list"><li ng-repeat="team in getTeams() | filter:query | orderBy: \'name\'"><div class="team-card-wrap"><a ng-click="context.goToTeam(team)"><i class="teamicons large left {{team.color}} {{team.icon}}"></i></a><div class="details-wrap large"><div class="v-aligner"></div><div class="details"><a ng-click="context.goToTeam(team)" class="text">{{team.name}}</a><div class="text">{{"Member" | pluralize: team.numMembers}}</div></div><a shift-popover="edit-team-popover" shift-popover-content="team" class="dropdown-wrap"><i class="donkicons drop-down gray"></i></a></div></div></li></ul><div ng-show="getTeams().length == 0" class="no-teams-message">No Teams</div></div></div>'), a.put("partials/user_settings.html", '<div id="user-settings"><div class="container small"><div class="user-settings clearfix"><div class="block-wrap"><div class="permalink-header-wrap"><h1 class="center">Account Settings</h1><h2 class="center">Manage your account, connections, and notifications.</h2></div><div class="permalink-section-wrap"><h2>General</h2><label class="input-label photo-label">Photo</label><div class="input-wrap has-label"><div class="avatar large left"><img ng-src="{{currentUser.image.default}}"/></div><div class="details-wrap large"><div class="v-aligner"></div><div class="details"><span ng-class="{loading: saveStatus.user_avatar == \'loading\'}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><div ng-class="{\'disabled\': saveStatus.user_avatar == \'loading\'}" ng-disabled="saveStatus.user_avater == \'loading\'" class="button">Change Photo<input mac-upload="mac-upload" type="file" name="file" mac-upload-route="avatarRoute" mac-upload-success="avatarUploadSuccess($data, $status)" mac-upload-error="avatarUploadError($data, $status)" mac-upload-submit="avatarUploadSubmit($event, $data)" mac-upload-drop-zone=".input-wrap" class="avatar-attachment-input"/></div><small>Photo must be under 1MB and at least 200px wide</small></span></div></div></div><form name="userForm"><label class="input-label">First and Last Name</label><div class="input-wrap has-label"><div class="pair-input-wrap"><input type="text" name="firstName" ng-model="userAttributes.firstName" placeholder="First Name" ng-class="{error: isInvalid(userForm.firstName)}" required="required" class="text-input"/></div><div class="pair-input-wrap"><input type="text" name="lastName" ng-model="userAttributes.lastName" placeholder="Last Name" ng-class="{error: isInvalid(userForm.lastName)}" required="required" class="text-input"/></div></div><label class="input-label">Job Title</label><div class="input-wrap has-label"><input type="text" placeholder="Job Title" ng-model="userAttributes.title" class="text-input"/></div><label class="input-label">Email</label><div ng-class="{error: emailIsInvalid}" class="input-wrap has-label"><input type="email" placeholder="Your Email" ng-model="userAttributes.primaryEmail" mac-blur="validateEmail(userAttributes.primaryEmail)" ng-class="{error: emailIsInvalid}" readonly="readonly" required="required" class="text-input"/></div></form></div><div class="permalink-section-wrap"><h2>Connections</h2><div class="section-title">Connecting your accounts helps you find contacts and sign in with one click. We will never post anything without your permission.</div><ul class="networks"><li><a ng-class="{\'is-connected\': userAttributes.hasFacebook, unclickable: userAttributes.hasFacebook, hoverable: !userAttributes.hasFacebook}" ng-click="connectSocial(\'facebook\')" class="connect-button button small"><span class="contact-text"><i class="donkicons check white text-after"></i>Connected</span><span class="add-text">Connect</span><span class="cancel-text">Cancel</span><span class="remove-text">Disconnect</span></a><div class="network"><div class="icon fb"></div><div class="name">Facebook</div></div></li><li><a ng-class="{\'is-connected\': userAttributes.hasGoogle, unclickable: userAttributes.hasGoogle, hoverable: !userAttributes.hasGoogle}" ng-click="connectSocial(\'google\')" class="connect-button button small"><span class="contact-text"><i class="donkicons check white text-after"></i>Connected</span><span class="add-text">Connect</span><span class="cancel-text">Cancel</span><span class="remove-text">Disconnect</span></a><div class="network"><div class="icon google"></div><div class="name">Google</div></div></li></ul></div><div class="permalink-section-wrap"><h2>Notifications</h2><div class="section-title">Email me when:</div><div class="checkbox-fieldset"><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_team_invite" ng-checked="notifications.email_on_team_invite"/>I am invited to a team</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_team_removed" ng-checked="notifications.email_on_team_removed"/>I am removed from a team</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_direct_message" ng-checked="notifications.email_on_direct_message"/>anyone sends me a direct message</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_reply_to_your_direct_message" ng-checked="notifications.email_on_reply_to_your_direct_message"/>anyone replies to one of my direct messages</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_sidebar_message" ng-checked="notifications.email_on_sidebar_message"/>anyone sends me a sidebar message</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="notifications.email_on_at_mention" ng-checked="notifications.email_on_at_mention"/>anyone @mentions me in a message</label></div></div><div class="checkbox-fieldset"><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="email_on_team_message" ng-checked="email_on_team_message"/>a new message is posted in one of my teams</label></div><div class="input-wrap"><label class="checkbox-wrap"><input type="checkbox" ng-model="email_on_shift_update" ng-checked="email_on_shift_update"/>SHIFT has an important update</label></div></div></div><div class="permalink-section-wrap"><h2>Change Your Password</h2><label class="input-label">Current Password</label><div class="input-wrap has-label"><input type="password" ng-model="oldPassword" placeholder="Current Password" class="text-input"/></div><label class="input-label">New Password</label><div class="input-wrap has-label"><div class="pair-input-wrap"><input type="password" ng-class="{error: !passwordIsValid}" ng-model="confirmPassword" placeholder="New Password" class="text-input"/></div><div class="pair-input-wrap"><input type="password" ng-class="{error: !passwordIsValid}" ng-model="userAttributes.password" placeholder="Confirm New Password" name="confirmPassword" mac-blur="checkPasswordMatch()" class="text-input"/></div></div><div ng-show="passwordError" class="well error">{{passwordError}}</div></div><div ng-class="{loading: isSavingForm}" class="submit-button-wrap"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><a ng-click="saveUserInfo()" ng-disabled="isSavingForm" ng-class="{disabled: isSavingForm}" class="button big block green">Save Changes</a></div></div></div></div></div>'), a.put("partials/users.html", '<div id="users-page"><div class="content"><div class="section-wrap large"><a ng-show="context.currentUser.isAdminOfTeam()" shift-popover="invite-to-team-popover" class="button small right">Invite Members</a><div ng-class="{\'loading\':isLeavingTeam}" class="submit-button-wrap right"><div class="submit-spinner-wrap"><mac-spinner class="spinner"></mac-spinner></div><a ng-click="checkLeaveTeam()" class="button small">Leave This Team</a></div><div class="content-title">{{"Member" | pluralize: getUsers().length}}</div></div><ul class="members-list"><li ng-repeat="user in getUsers() | orderBy: \'name\'"><a ng-click="context.goToUser(user)" class="avatar large left"><img ng-src="{{user.image.default}}"/></a><div class="details-wrap large"><div class="v-aligner"></div><div class="details"><a ng-click="context.goToUser(user)" class="text name">{{user.name}}</a><div class="text">{{user.title}}</div><div ng-show="user.pending == true" class="pending">Pending</div><div ng-show="user.isAdminOfTeam() || getPendingRole(user)" class="role">Admin</div></div><a ng-hide="user.id == context.currentUser.id" shift-popover="member-settings" shift-popover-content="user" class="dropdown-wrap"><i class="donkicons drop-down gray"></i></a></div></li></ul><div ng-show="getUsers().length == 0" class="no-users-message">{{getNoUsersMessage()}}</div></div></div>')
    }
]);