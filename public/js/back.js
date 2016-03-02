//
var $document = $(document);
var $window = $(window);
var $htmlBody = $('html,body');
var $html = $('html');
var $introCode = $('#intro-code');
var typeInterval;
var currentOpenTags = 0;
var currentTag;

function reserResizing () {
    $html.css('font-size', '');
    $body.css('background-size', '');
    $target.css('width', '');
    $target.css('height', '');
}

function scrollToElement(selector){
    $htmlBody.animate({scrollTop: $(selector).offset().top},'fast');
}

var code = '<article id="intro"><header class="article-header"><div class="article-title-wrapper"><figure class="article-title-img-wrapper">    </figure><h1>Pavel Maximov</h1><h1>Front-end Developer</h1><h2>London, UK</h2></div> </header></article>';
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


$document.ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('[data-offcanvas="content"]').toggleClass('offcanvas-active');
    });

    typeInterval = setInterval(printChar, 10);
});

