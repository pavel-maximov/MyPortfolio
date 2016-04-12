//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
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

function scrollToElement(selector){
    $htmlBody.animate({scrollTop: $(selector).offset().top}, 2000);
}

function onScrollAbout (scrollTop, windowHeight) {
    if (scrollTop > (windowHeight * 12)) {
        $aboutVideo.css('z-index', '-1');
    } else {
        $aboutVideo.css('z-index', '-2');
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

function onScroll() {
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

function initCarousel($controlsContainer, $mainCarousel, $secondaryCarousel) {
    $mainCarousel.carousel({
        interval: false
    });

    if ($secondaryCarousel) {
        $secondaryCarousel.carousel({
            interval: false
        });

        $mainCarousel.on('slide.bs.carousel', function (e) {
            $secondaryCarousel.carousel($(e.relatedTarget).index());
        })
    }

}

function initSlide($slide, $modal) {
    var $tseContent = $slide.find('.tse-content');

    if (!$slide.data('tse-initialised')) {
        $slide.data('tse-initialised', true);
        if ($tseContent.outerHeight() > $slide.outerHeight()) {
            $slide.TrackpadScrollEmulator({ autoHide: false });

            if ($modal.data('scroll-teaser-needed')) {
                $slide.find('.tse-scroll-content').one('scroll', function() {
                    $modal.find('.carousel-item-scroll-teaser').remove();
                });
                $slide.find('.tse-content').append('' +
                    '<div class="carousel-item-scroll-teaser">' +
                    '<img class="carousel-item-scroll-teaser-image" src="/img/mouse-touch.svg">' +
                    '<div class="carousel-item-scroll-teaser-text">scroll down</div>' +
                    '<div class="carousel-item-scroll-teaser-arrow"><</div>' +
                    '</div>'
                );
                $modal.addClass('scroll-teaser-enabled');
                $modal.find('.tse-scrollable.active .tse-scroll-content').one('scroll', function() {
                    $modal.find('.carousel-item-scroll-teaser').remove();
                    $modal.data('scroll-teaser-needed', false);
                    $modal.removeClass('scroll-teaser-enabled');
                    $('.modal').data('scroll-teaser-needed', false);
                });
            }
        } else {
            $slide.find('.carousel-item-scroll-teaser').remove();
        }
    }
}

function initModal($modal, $mainCarousel, $secondaryCarousel) {
    initCarousel($modal, $mainCarousel, $secondaryCarousel);

    $modal.find('.portfolio-item-modal-close').click(function() {
        $modal.modal('hide');
    });

    $modal.find('.carousel').on('slid.bs.carousel', function() {
        initSlide($(this).find('.tse-scrollable.active'), $modal);
        $modal.find('.carousel-label').removeClass('active');
        $modal.find('.carousel-label:eq(' + $modal.find('.carousel-item.active').index() + ')').addClass('active');
    });

    $.each($modal.find('.tse-scrollable.active'), function(index, element) {
        initSlide($(element), $modal);
    });

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

    $('.modal').data('scroll-teaser-needed', true);
    $('.modal').one('shown.bs.modal', function() {
        var $this = $(this);

        initModal($this, $this.find('.main-carousel'), $this.find('.secondary-carousel'));
    });
    
    $('.portfolio-item-img-preview')
        .click(function() {
            $(this).closest('.js-portfolio-item').find('.modal').modal();
        })
        .on('mouseover', function (){
            $(this).closest('.js-portfolio-item').addClass('child-hovered');
        })
        .on('mouseout', function (){
            $(this).closest('.js-portfolio-item').removeClass('child-hovered');
        });

    initCarousel($('#references'), $('#references-main-carousel'));
});