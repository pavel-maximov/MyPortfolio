//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
var $html = $('html');
var $introCode = $('#intro-code');
var typeInterval;
var currentOpenTags = 0;
var currentTag;
var $skills = $('#skills');
var $intro = $('#outro').find('');
var $aboutVideo = $('#outro-video');
var $portfolio = $('#portfolio');


var startPoint;
var endPoint;


function reserResizing () {
    $html.css('font-size', '');
    $body.css('background-size', '');
    $target.css('width', '');
    $target.css('height', '');
}

function scrollToElement(selector){
    $htmlBody.animate({scrollTop: $(selector).offset().top},'fast');
}

var code = '<article id="intro"><header class="article-header"><div class="article-title-wrapper"><figure class="article-title-img-wrapper"><img class="article-title-img" src="/img/head.png"></figure><h1>Pavel Maximov</h1><h2>Front-end Developer</h2><h3>London, UK</h3></div><nav class="article-nav"></nav></header><div class="article-body"><video id="intro-video" height="100%" width="100%" autoplay loop><source src="/video/intro.mp4" type="video/mp4"></video><div id="intro-code"></div></div></article>';
var printedChar = 0;


function printChar() {
    var nextChar = code[printedChar],
        target;

    if (nextChar !== undefined) {
        if(nextChar === '<') {
            currentTag = code.substring((printedChar + 1), code.substring((printedChar + 1)).indexOf(' ') + 1);
            console.log(currentTag);

            if (code[(printedChar + 1)] === '/') {
                currentOpenTags -= 1;
            } else {
                currentOpenTags += 1;
            }
            $introCode.append('<div style="padding-left:' + (currentOpenTags * 20) + 'px"></div>');
        }
        target = $introCode.children().last();
        target.html(target.html() + code[printedChar]);
        printedChar += 1;
    } else {
        clearInterval(typeInterval);
    }
}


function onScrollIntro () {
    var scrollTop = $window.scrollTop();
    var windowHeight = $window.height();

    if (scrollTop < windowHeight) {
        $intro.css('opacity', (1 - ((100 * (scrollTop / windowHeight)) / 100) * 0.5));
    }
}

function onScrollAbout () {
    var scrollTop = $window.scrollTop();
    var windowHeight = $window.height();

    if (scrollTop > (windowHeight * 2)) {
        $aboutVideo.css('z-index', '-1');
    } else {
        $aboutVideo.css('z-index', '-2');
    }
}


function onScrollPortfolio () {
    var scrollTop = $window.scrollTop();

    if (scrollTop >= startPoint && scrollTop <= endPoint) {
        $portfolio.addClass('fixed-position');
    } else if (scrollTop < startPoint || scrollTop > endPoint) {
        $portfolio.removeClass('fixed-position');
    }
}



var mX, mY, distance,
    cogwheelsInitialSpeeds = {},
    $element  = $('#skills-cogwheels');


function calculateDistance(elem, mouseX, mouseY) {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


$document.ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('[data-offcanvas="content"]').toggleClass('offcanvas-active');
    });

    $.each($element.find('path'), function (number, element) {
        $(element).css('animation',  'rotating ' + getRandomArbitrary(4, 60) + 's linear infinite');
    });

    startPoint = $portfolio.offset().top;
    endPoint = startPoint + 50;
    $(window).on('scroll', onScrollAbout);
    $(window).on('scroll', function() {$portfolio.removeClass('fixed-position')});
    $portfolio.on('scroll', function() {$portfolio.addClass('fixed-position')});
    //onScrollAbout();
    //onScrollPortfolio();
    //
    //$('#skills').mousemove(function(e) {
    //    mX = e.pageX;
    //    mY = e.pageY;
    //    distance = calculateDistance($element, mX, mY);
    //});

    //typeInterval = setInterval(printChar, 40);
});

//
//!function (t) {
//    t.MDChapter = function (e, n) {
//        var o = (t.extend({}, t.fn.MDChapter.defaults, n), t(e)), i = t(".chapter__title", o), a = (t(".chapter__content", o), function () {
//            r()
//        }), r = function () {
//            t(window).on("scroll", c), t(window).on("resize", c), c(null)
//        }, c = function () {
//            var e = o.outerHeight(), n = o.offset().top, a = t(window).height(), r = t(window).scrollTop();
//            if (r >= n && n + e - a >= r)i.addClass("title--fixed").css({top: 0}); else {
//                var c = r - n;
//                c = Math.max(0, c), c = Math.min(e - a, c), i.removeClass("title--fixed").css({top: c})
//            }
//        };
//        a()
//    }, t.fn.MDChapter = function (e) {
//        return this.each(function () {
//            if (void 0 === t(this).data("MDChapter")) {
//                var n = new t.MDChapter(this, e);
//                t(this).data("MDChapter", n)
//            }
//        })
//    }, t.fn.MDChapter.defaults = {option1: 1e3, option2: 760}
//}(jQuery), function (t) {
//    t.MDProject = function (e, n) {
//        var o = (t.extend({}, t.fn.MDProject.defaults, n), t(e)), i = t(".project__header", o), a = t(".project__content", o), r = this, c = !1;
//        this.closeProject = function () {
//            r.collapse(), o.trigger("close", {$project: o}), c = !1
//        }, this.openProject = function (t) {
//            f(t)
//        };
//        var s = function () {
//            h()
//        }, h = function () {
//            t(window).on("scroll", l)
//        };
//        this.collapse = function (e) {
//            return "undefined" == typeof e && (e = !0), e ? (a.animate({height: 0}, 800), t(".header__image", i).animate({top: 0}, 800)) : (a.css({height: 0}), t(".header__image", i).css({top: 0})), i.css("height", t(window).height()), o.removeClass("open"), c = !1, 800
//        }, this.expand = function () {
//            return o.addClass("open"), a.css("height", "auto"), i.css("height", .54 * t(window).height()), window.viewportUnitsBuggyfill.refresh(), c = !0, 600
//        };
//        var f = function (e) {
//            o.trigger("loading"), t.ajax({url: e, success: u})
//        }, u = function (e) {
//            var n = t(textToHtml(e)), o = t(".project__content", n);
//            a.css("height", "0px").html(o.html()).waitForImages(d, function () {
//            })
//        }, d = function () {
//            o.trigger("loaded", {$project: o})
//        }, l = function () {
//            var e = (t(window).scrollTop() - o.offset().top) / i.height();
//            c && t(".header__image", i).css({top: .5 * Math.min(1, Math.max(0, e)) * i.height()})
//        };
//        s()
//    }, t.fn.MDProject = function (e) {
//        return this.each(function () {
//            if (void 0 === t(this).data("MDProject")) {
//                var n = new t.MDProject(this, e);
//                t(this).data("MDProject", n)
//            }
//        })
//    }, t.fn.MDProject.defaults = {option1: 1e3, option2: 760}
//}(jQuery);