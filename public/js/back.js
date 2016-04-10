//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
//var $html = $('html');
//var $introCode = $('#intro-code');
//var typeInterval;
//var currentOpenTags = 0;
//var currentTag;
//var $skills = $('#skills');
//var $intro = $('#outro').find('');
var $aboutVideo = $('#outro-video');
var $portfolio = $('#portfolio');
var $experience = $('#experience');
var $main = $('#main');
var $about = $('#about');
var $intro = $('#intro');
var $outro = $('#outro');
var $skills = $('#skills');
var teaserTitleVisibilityLimit = 200;
var cogwheelsTopBottomMargin = 170;
var startPointPortfolio;
var endPointPortfolio;
var startPointExperience;
var endPointExperience;
var startPointAbout;
var endPointAbout;
var endPointSkills;
var startPointSkills;
var currentScroll = $('#bk-modal').scrollTop();


//
//var code = '<article id="intro"><header class="article-header"><div class="article-title-wrapper"><figure class="article-title-img-wrapper"><img class="article-title-img" src="/img/head.png"></figure><h1>Pavel Maximov</h1><h2>Front-end Developer</h2><h3>London, UK</h3></div><nav class="article-nav"></nav></header><div class="article-body"><video id="intro-video" height="100%" width="100%" autoplay loop><source src="/video/intro.mp4" type="video/mp4"></video><div id="intro-code"></div></div></article>';
//var printedChar = 0;
//
//
//function printChar() {
//    var nextChar = code[printedChar],
//        target;
//
//    if (nextChar !== undefined) {
//        if(nextChar === '<') {
//            currentTag = code.substring((printedChar + 1), code.substring((printedChar + 1)).indexOf(' ') + 1);
//            console.log(currentTag);
//
//            if (code[(printedChar + 1)] === '/') {
//                currentOpenTags -= 1;
//            } else {
//                currentOpenTags += 1;
//            }
//            $introCode.append('<div style="padding-left:' + (currentOpenTags * 20) + 'px"></div>');
//        }
//        target = $introCode.children().last();
//        target.html(target.html() + code[printedChar]);
//        printedChar += 1;
//    } else {
//        clearInterval(typeInterval);
//    }
//}

//
//function onScrollIntro () {
//    var scrollTop = $window.scrollTop();
//    var windowHeight = $window.height();
//
//    if (scrollTop < windowHeight) {
//        $intro.css('opacity', (1 - ((100 * (scrollTop / windowHeight)) / 100) * 0.5));
//    }
//}
//
//


//
//function calculateDistance(elem, mouseX, mouseY) {
//    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
//}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function scrollToElement(selector){
    $htmlBody.animate({scrollTop: $(selector).offset().top}, 1500);
}

function onScrollAbout (scrollTop, windowHeight) {
    if (scrollTop > (windowHeight * 12)) {
        $aboutVideo.css('z-index', '-1');
    } else {
        $aboutVideo.css('z-index', '-2');
    }
}

function onScrollPortfolio (scrollTop) {
    if (scrollTop < startPoint) {
        $portfolio.removeClass('scrolled-this');
        $portfolio.removeClass('scrolling-this');
    } else if (scrollTop < endPoint) {
        $portfolio.addClass('scrolling-this');
        $portfolio.removeClass('scrolled-this');
    } else {
        $portfolio.removeClass('scrolling-this');
        $portfolio.addClass('scrolled-this');
    }
}

function onScrollStickyHeader (options) {
    if (options.scrollTop < options.startPoint) {
        options.$element.removeClass('scrolled-this');
        options.$element.removeClass('scrolling-this');
    } else if (options.scrollTop < options.endPoint) {
        options.$element.addClass('scrolling-this');
        options.$element.removeClass('scrolled-this');
    } else {
        options.$element.removeClass('scrolling-this');
        options.$element.addClass('scrolled-this');
    }
}

function onScrollMainContainer (scrollTop, windowHeight, scrollPoints) {
    var newAlphaValue;

    if (scrollTop < scrollPoints.skills) {
        newAlphaValue = scrollTop / windowHeight;
        newAlphaValue = newAlphaValue > .85 ? .85 : newAlphaValue;
        $main.css('background-color', 'hsla(0,10%,100%,' + newAlphaValue + ')');
    } else if (scrollTop < scrollPoints.outro) {
        $main.css('background-color', 'hsla(0,10%,100%,0.85)');
    } else {
        newAlphaValue = 1 - (scrollTop - scrollPoints.outro) / windowHeight;
        newAlphaValue = newAlphaValue > .85 ? .85 : newAlphaValue;
        $main.css('background-color', 'hsla(0,10%,100%,' + newAlphaValue + ')');
    }
}

function onScroll(event) {
    var scrollTop = $window.scrollTop();
    var windowHeight = $window.height();
    var scrollPoints = {
        skills: windowHeight,
        outro: $outro.offset().top - windowHeight
    };

    onScrollAbout(scrollTop, windowHeight);
    onScrollStickyHeader({
        $element: $portfolio,
        startPoint: startPointPortfolio,
        endPoint: endPointPortfolio,
        scrollTop: scrollTop
    });
    onScrollStickyHeader({
        $element: $experience,
        startPoint: startPointExperience,
        endPoint: endPointExperience,
        scrollTop: scrollTop
    });
    onScrollStickyHeader({
        $element: $about,
        startPoint: startPointAbout,
        endPoint: endPointAbout,
        scrollTop: scrollTop
    });
    onScrollMainContainer(scrollTop, windowHeight, scrollPoints);
    setCogwheelsAnimation(scrollTop, windowHeight);
    setTeaserTitleVisibility(scrollTop);
}


function portfolioItemsScroll () {
    var $this = $(this);
    var newScroll = $this.scrollTop();
    console.log('currentScroll ' + currentScroll + ' newScroll ' + newScroll);
    // $this.scrollTop($this.scrollTop() + (newScroll - currentScroll));
    // currentScroll = newScroll;
}

function checkCarouselItem ($mainCarousel, $controlsContainer) {
    if($mainCarousel.find('.carousel-inner .carousel-item:first').hasClass('active')) {
        $controlsContainer.find('.left.carousel-control').hide();
        $controlsContainer.find('.right.carousel-control').show();
    } else if($mainCarousel.find('.carousel-inner .carousel-item:last').hasClass('active')) {
        $controlsContainer.find('.right.carousel-control').hide();
        $controlsContainer.find('.left.carousel-control').show();
    } else {
        $controlsContainer.find('.carousel-control').show();
    }
}

function initCarousel($controlsContainer, $mainCarousel, $secondaryCarousel) {
    $mainCarousel.carousel({
        interval: false,
        wrap: false
    });
    checkCarouselItem($mainCarousel, $controlsContainer);

    if ($secondaryCarousel) {
        $secondaryCarousel.carousel({
            interval: false,
            wrap: false
        });

        $mainCarousel.on('slide.bs.carousel', function (e) {
            $secondaryCarousel.carousel($(e.relatedTarget).index());
        })
    }

    $mainCarousel.on('slid.bs.carousel', function () {
        checkCarouselItem($mainCarousel, $controlsContainer);
    });

}

function initModal($modal, $mainCarousel, $secondaryCarousel) {
    initCarousel($modal, $mainCarousel, $secondaryCarousel);

    $modal.find('.portfolio-item-modal-close').click(function() {
        $modal.modal('hide');
    });

    $modal.find('.tse-scrollable').TrackpadScrollEmulator();
}

function setCogwheelsAnimation(scrollPosition, windowHeight) {
    if ((scrollPosition + windowHeight - cogwheelsTopBottomMargin) < startPointSkills ||
        scrollPosition > (endPointSkills  - cogwheelsTopBottomMargin)) {
        if ($skills.hasClass('cogwheel-rotating')) {
            $skills.removeClass('cogwheel-rotating');
        }

        return;
    }

    $skills.addClass('cogwheel-rotating');
}

function setTeaserTitleVisibility(scrollPosition) {
    if (scrollPosition > teaserTitleVisibilityLimit) {
        if ($intro.hasClass('teaser-title-visible')) {
            $intro.removeClass('teaser-title-visible');
        }
    }
}

$document.ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('[data-offcanvas="content"]').toggleClass('offcanvas-active');
    });

    $.each($('.cogwheel'), function (number, element) {
        //$(element).css('animation',  'rotating ' + getRandomArbitrary(20, 60) + 's linear infinite');
    });

    startPointPortfolio = $portfolio.offset().top;
    endPointPortfolio = startPointPortfolio + $portfolio.outerHeight() - $window.height();
    startPointExperience = $experience.offset().top;
    endPointExperience = startPointExperience + $experience.outerHeight() - $window.height();
    startPointAbout = $about.offset().top;
    endPointAbout = startPointAbout + $about.outerHeight() - ($window.height() / 2);
    startPointSkills = $skills.offset().top;
    endPointSkills = startPointSkills + $skills.outerHeight();

    //$main.css('background-color', 'hsla(0,10%,10%,0)');
    $window.on('scroll', onScroll);
    onScroll();

    $('.portfolio-item-bk .portfolio-item-img-preview').click(function() {
        $('#bk-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);
                
                initModal($this, $this.find('#bk-main-carousel'), $this.find('#bk-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-vendomo .portfolio-item-img-preview').click(function() {
        $('#vendomo-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#vendomo-main-carousel'), $this.find('#vendomo-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-vendomo-crm .portfolio-item-img-preview').click(function() {
        $('#vendomo-crm-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#vendomo-crm-main-carousel'), $this.find('#vendomo-crm-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-foodora .portfolio-item-img-preview').click(function() {
        $('#foodora-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#foodora-main-carousel'), $this.find('#foodora-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-timvision .portfolio-item-img-preview').click(function() {
        $('#timvision-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#timvision-main-carousel'), $this.find('#timvision-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-cubomusica .portfolio-item-img-preview').click(function() {
        $('#cubomusica-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#cubomusica-main-carousel'), $this.find('#cubomusica-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-unicri .portfolio-item-img-preview').click(function() {
        $('#unicri-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#unicri-main-carousel'), $this.find('#unicri-secondary-carousel'));
            })
            .modal();
    });

    $('.portfolio-item-others .portfolio-item-img-preview').click(function() {
        $('#others-modal')
            .on('shown.bs.modal', function () {
                var $this = $(this);

                initModal($this, $this.find('#others-main-carousel'), $this.find('#others-secondary-carousel'));
            })
            .modal();
    });

    initCarousel($('#references'), $('#references-main-carousel'));
});