//
var $target;
var $body;
var $html;
var baseFontSize;
var $window;
var minDistance;
var maxWidth;
var maxHeight;
var minWidth;
var minHeight;
var naturalBackgroundSize;
var tabletBreakpoint = 768;


function getNewSize (options) {
    var windowWidth = options.$window.outerWidth(),
        windowHeight = options.$window.outerHeight(),
        targetWidth = options.$target.outerWidth(),
        targetHeight = options.$target.outerHeight(),
        verticalDifference = (windowHeight + options.minDistance - targetHeight) / 2,
        horizontalDifference = (windowWidth + options.minDistance - targetWidth) / 2,
        widthToHeightRatio = options.maxWidth / options.maxHeight,
        heightToWidthRatio = options.maxHeight / options.maxWidth,
        isVerticalEdgeCloser = verticalDifference < horizontalDifference,
        newWidth,
        newHeight,
        isChanged = false,
        returnedValues = {};

    //TODO check if you can return only width
    // resizing window in and close enough to target
    if (verticalDifference < options.minDistance || horizontalDifference < options.minDistance) {
        isChanged = true;
        if (isVerticalEdgeCloser) {
            newHeight = windowHeight - options.minDistance;
            newWidth = newHeight * widthToHeightRatio;
        } else {
            newWidth = windowWidth - options.minDistance;
            newHeight = newWidth  * heightToWidthRatio;
        }

    // resizing window out and not resized target back full size yet
    } else if (targetWidth < options.maxWidth || targetHeight < options.maxHeight) {
        isChanged = true;
        if (isVerticalEdgeCloser) {
            newHeight = windowHeight - options.minDistance;
            newWidth = newHeight * widthToHeightRatio;

        } else {
            newWidth = windowWidth - options.minDistance;
            newHeight = newWidth  * heightToWidthRatio;
        }
    }

    if (isChanged) {
        newWidth = newWidth > options.minWidth ? newWidth : options.minWidth;
        newWidth = newWidth < options.maxWidth ? newWidth : options.maxWidth;

        newHeight = newHeight > options.minHeight ? newHeight : options.minHeight;
        newHeight = newHeight < options.maxHeight ? newHeight : options.maxHeight;

        returnedValues.newWidth = Math.floor(newWidth);
        returnedValues.newHeight = Math.floor(newHeight);

        return returnedValues;

    }

    return null;
}


function resizer () {
    if ($window.outerWidth() < tabletBreakpoint) {
        reseResizing();

        return;
    }

    var newSize = getNewSize({
        $target: $target,
        $window: $window,
        minDistance: minDistance,
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
}

function backResizer (newSize) {
    var newBackgroundSize = Math.floor(newSize.newWidth * 1.9);

    newBackgroundSize = newBackgroundSize < naturalBackgroundSize ? newBackgroundSize : naturalBackgroundSize;
    $body.css('background-size', newBackgroundSize + 'px');
}

function fontResizer (newSize) {
    var proportion = Math.round((newSize.newWidth / maxWidth) * 100) / 100;

    $html.css('font-size', (baseFontSize * proportion) + 'px');
}

function reseResizing () {
    $html.css('font-size', '');
    $body.css('background-size', '');
    $target.css('width', '');
    $target.css('height', '');
}

$(document).ready(function () {
    $window = $(window);
    $target = $('#main');
    $body = $('body');
    $html = $('html');
    baseFontSize = parseInt($html.css('font-size'));
    minDistance = 20;
    maxWidth = 1200;
    maxHeight = 850;
    minWidth = 768;
    minHeight = Math.ceil(minWidth * 0.7);
    naturalBackgroundSize = 2222;

    $window.on('resize', resizer);
    resizer();
});

