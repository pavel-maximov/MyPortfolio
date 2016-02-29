//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
var $html = $('html');

function reserResizing () {
    $html.css('font-size', '');
    $body.css('background-size', '');
    $target.css('width', '');
    $target.css('height', '');
}

function scrollToElement(selector){
    $htmlBody.animate({scrollTop: $(selector).offset().top},'fast');
}


$document.ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('[data-offcanvas="content"]').toggleClass('offcanvas-active');
    });
});

