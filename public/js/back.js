//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
var $projects = $('#projects');
var $experience = $('#experience');
var $body = $('body');
var $main = $('#main');
var $about = $('#about');
var $intro = $('#intro');
var $outro = $('#outro');
var $skills = $('#skills');
var teaserTitleVisibilityLimit = 200;
var gearsAnimationStartModifier = 50;
var desktopMinimumBreakpoint = 1245;
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

    if ( $window.width() >= desktopMinimumBreakpoint ) {
        onScrollStickyHeader({
            $element: $projects,
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
    }
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

    // TODO solve race condition between mobile and notebook images
    $slide.find('.projects-item-img-full').one('load', function() {
        var $parentDeviceTypeClass;

        if ($slide.parents('.projects-item-notebook').length) {
            $parentDeviceTypeClass = '.projects-item-notebook';
        } else if ($slide.parents('.projects-item-mobile').length) {
            $parentDeviceTypeClass = '.projects-item-mobile';
        }

        if (!$slide.data('tse-initialised')) {
            $slide.data('tse-initialised', true);
            if ($tseContent.outerHeight() > $slide.outerHeight()) {
                $slide.TrackpadScrollEmulator({ autoHide: false });

                // TODO refactor this, it's ugly
                if (($parentDeviceTypeClass === '.projects-item-notebook' && $body.data('notebook-scroll-teaser-needed')) ||
                    ($parentDeviceTypeClass === '.projects-item-mobile' && $body.data('mobile-scroll-teaser-needed'))
                ) {
                    $slide.find('.tse-content').append('' +
                        '<div class="carousel-item-scroll-teaser">' +
                        '<div class="carousel-item-scroll-teaser-icon">' +
                        '<img class="carousel-item-scroll-teaser-image" src="/img/desktop-scroll.svg"/>' +
                        '<img class="carousel-item-scroll-teaser-image-mobile" src="/img/mobile-scroll.svg"/>' +
                        '<div class="carousel-item-scroll-teaser-text">scroll down to see more</div>' +
                        '</div>' +
                        '</div>'
                    );
                    $slide.addClass('scroll-teaser-enabled');
                    $modal.find('.tse-scrollable.active .tse-scroll-content').one('scroll', function() {
                        var $this = $(this);
                        var $parentDeviceType;
                        var $parentDeviceTypeClass;

                        // TODO refactor this, it's ugly
                        if ($this.parents('.projects-item-notebook').length) {
                            $parentDeviceTypeClass = '.projects-item-notebook';
                            $body.data('notebook-scroll-teaser-needed', false);
                        } else if ($this.parents('.projects-item-mobile').length) {
                            $parentDeviceTypeClass = '.projects-item-mobile';
                            $body.data('mobile-scroll-teaser-needed', false);
                        }

                        $parentDeviceType = $('.modal').find($parentDeviceTypeClass + ' .carousel-item');
                        $parentDeviceType.find('.carousel-item-scroll-teaser').remove();
                        $parentDeviceType.removeClass('scroll-teaser-enabled');
                    });
                }
            } else {
                $slide.find('.carousel-item-scroll-teaser').remove();
            }
        }
    }).each(function() {
        if (this.complete) {
            $(this).load();
        }
    });
}

function closeModal() {
    var $modal = $(this).closest('.modal');
    var $video = $modal.find('video');

    $body.removeClass('about-model-open');
    if ($video.length) {
        $video[0].pause();
    }
    $modal.modal('hide');
}

function initModal($modal, $mainCarousel, $secondaryCarousel) {
    initCarousel($modal, $mainCarousel, $secondaryCarousel);
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
    if ((scrollPosition + windowHeight - gearsAnimationStartModifier) < startPointSkills ||
        scrollPosition > (endPointSkills  - gearsAnimationStartModifier)) {
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

    startPointPortfolio = $projects.offset().top;
    endPointPortfolio = startPointPortfolio + $projects.outerHeight() - $window.height();
    startPointExperience = $experience.offset().top;
    endPointExperience = startPointExperience + $experience.outerHeight() - $window.height();
    startPointAbout = $about.offset().top;
    endPointAbout = startPointAbout + $about.outerHeight() - $window.height();
    startPointSkills = $skills.offset().top;
    endPointSkills = startPointSkills + $skills.outerHeight();

    //$main.css('background-color', 'hsla(0,10%,10%,0)');
    $window.on('scroll', onScroll);
    onScroll();
 
    $('.modal').one('shown.bs.modal', function() {
            var $this = $(this);

            if ($this.find('.modal-content').length) {
                $this.find('.modal-content').load($this.data('modal-src'), function() {
                    $this.find('.modal-content').append('<button class="modal-close-button">X</button>');
                    $this.find('.modal-close-button').click(closeModal);
                    initModal($this, $this.find('.main-carousel'), $this.find('.secondary-carousel'));
                })
            } else if ($this.find('.about-item-modal-content').length) {
                $this.find('.about-item-modal-content').load($this.data('modal-src'), function() {
                    initModal($this, $this.find('.main-carousel'), $this.find('.secondary-carousel'));
                })
            }
        });

    $body.data('notebook-scroll-teaser-needed', true);
    $body.data('mobile-scroll-teaser-needed', true);

    $('.projects-item-img-preview')
        .click(function() {
            $(this).closest('.js-projects-item').find('.modal').modal();
        })
        .on('mouseover', function (){
            $(this).closest('.js-projects-item').addClass('child-hovered');
        })
        .on('mouseout', function (){
            $(this).closest('.js-projects-item').removeClass('child-hovered');
        });

    $('.interest-modal-link')
        .click(function() {
            $body.addClass('about-model-open');
            $($(this).data('target-modal')).modal();
        });

    initCarousel($('#references'), $('#references-main-carousel'));
});