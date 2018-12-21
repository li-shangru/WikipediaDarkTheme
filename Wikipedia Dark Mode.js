// ==UserScript==
// @name         Wikipedia Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pure Dark theme for wikipedia.org
// @author       Shangru Li
// @match        *://*.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var allElements=document.getElementsByTagName("*");
    for(var i=0; i<allElements.length; i++) {
        if (allElements[i] == document.getElementsByClassName("mw-wiki-logo")[0]){
            continue;
        }
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(allElements[i])) {
            allElements[i].style.color = "rgb(255, 255, 255)";
        } else {
            allElements[i].style.color = "rgb(175, 175, 175)";
            var new_backgroundColor = getRGB(allElements[i].style.backgroundColor);
            if (new_backgroundColor==null) {
                allElements[i].style.background = "rgb(35, 35, 35)";
            } else {
                var r = parseInt(new_backgroundColor[1]) - 220;
                var g = parseInt(new_backgroundColor[2]) - 220;
                var b = parseInt(new_backgroundColor[3]) - 220;
                if (r <= 0 ) {
                    r = 10;
                } else if (g <=0 ) {
                    g = 10;
                } else if (b <=0 ) {
                    b = 10;
                }
                allElements[i].style.background = 'rgb(' + r + ',' + g + ',' + b + ')';;
            }
        }
    }
})();

function getRGB(str){
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match;
}

