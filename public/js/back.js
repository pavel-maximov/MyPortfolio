//
var $document = $(document);
var $window = $(window);
var $body = $('body');
var $html = $('html');
var $target = $('#main');
var $navTop = $('.nav-top');
var baseFontSize = parseInt($html.css('font-size'));
var maxWidth = 1200;
var maxHeight = 820;
var minWidth = 768;
var minHeight = 600;
var naturalBackgroundSize = 2129;
var backgroundToMainContainer = 1.6;
var tabletBreakpoint = 992;


function getNewSize (options) {
    var windowWidth = options.$window.outerWidth(),
        windowHeight = options.$window.outerHeight(),
        targetWidth = options.$target.outerWidth(),
        targetHeight = options.$target.outerHeight(),
        verticalDifference = (windowHeight - targetHeight) / 2,
        horizontalDifference = (windowWidth - targetWidth) / 2,
        widthToHeightRatio = options.maxWidth / options.maxHeight,
        heightToWidthRatio = options.maxHeight / options.maxWidth,
        isVerticalEdgeCloser = verticalDifference < horizontalDifference,
        isChanged = false,
        newWidth,
        newHeight;

    //TODO check if you can return only width
    // resizing window in and close enough to target
    if (verticalDifference < 0 || horizontalDifference < 0) {
        isChanged = true;
        if (isVerticalEdgeCloser) {
            newHeight = windowHeight;
            newHeight = newHeight > options.minHeight ? newHeight : options.minHeight;
            newWidth = newHeight * widthToHeightRatio;
        } else {
            newWidth = windowWidth;
            newWidth = newWidth > options.minWidth ? newWidth : options.minWidth;
            newHeight = newWidth  * heightToWidthRatio;
        }
    // resizing window out and not resized target back full size yet
    } else if (targetWidth < options.maxWidth || targetHeight < options.maxHeight) {
        isChanged = true;
        if (isVerticalEdgeCloser) {
            newHeight = windowHeight;
            newHeight = newHeight < options.maxHeight ? newHeight : options.maxHeight;
            newWidth = newHeight * widthToHeightRatio;
        } else {
            newWidth = windowWidth;
            newWidth = newWidth < options.maxWidth ? newWidth : options.maxWidth;
            newHeight = newWidth * heightToWidthRatio;
        }
    }
    if (isChanged) {
        return {
            newWidth: newWidth,
            newHeight: newHeight
        };
    }
}


function resizer () {
    var newSize;

    if ($window.outerWidth() > tabletBreakpoint) {
        newSize = getNewSize({
            $target: $target,
            $window: $window,
            minHeight: minHeight,
            minWidth: minWidth,
            maxWidth: maxWidth,
            maxHeight: maxHeight
        });
        if (newSize) {
            $target.outerWidth(newSize.newWidth);
            $target.outerHeight(newSize.newHeight);
            backResizer(newSize);
            fontResizer(newSize);
        }
    } else {
        reserResizing();
    }
}

function backResizer (newSize) {
    var newBackgroundSize = newSize.newWidth * backgroundToMainContainer;

    newBackgroundSize = newBackgroundSize < naturalBackgroundSize ? newBackgroundSize : naturalBackgroundSize;
    $body.css('background-size', newBackgroundSize + 'px');
}

function fontResizer (newSize) {
    var proportion = newSize.newWidth / maxWidth;

    $html.css('font-size', (baseFontSize * proportion) + 'px');
}

function reserResizing () {
    $html.css('font-size', '');
    $body.css('background-size', '');
    $target.css('width', '');
    $target.css('height', '');
}


$document.ready(function () {
    $window.on('resize', resizer);
    resizer();

    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});

$window.on('scroll', function () {
    $navTop.toggleClass('scrolling', $window.scrollTop() > 1);
});

//TODO add js-... notation to classes