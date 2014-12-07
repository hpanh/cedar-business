//This file is about common functions that can be call from everywhere in the site
//It contains common functions such as trigger share buttons
//Require jquery in order to run


//Share facebook button
//Require a button with class 'js-fb-share' and fblogin.js file under body tag
//Example: template/badge/view.html
$('.js-fb-share').click(function() {
    $('.share-fb').click(function() {
        FB.ui({
            method: 'share',
            href: 'document.URL'
        }, function(response) {
            //TODO: Handle response
        });
    });
});