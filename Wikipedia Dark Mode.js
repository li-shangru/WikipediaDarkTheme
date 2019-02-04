// ==UserScript==
// @name         Wikipedia Dark Mode
// @namespace    https://github.com/MaxsLi/WikiDarkMode/
// @version      0.4
// @icon         https://www.wikipedia.org/favicon.ico
// @description  Pure Dark theme for wikipedia.org
// @author       Shangru Li
// @match        *://*.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // General idea is to put all elements on a wikipedia page to an array `allElements`
    // traverse through this array and change the color of each element accordingly
    // Hyper-link set to white: rgb(255, 255, 255)
    // Normal text set to grey: rgb(155, 155, 155)
    // Background set to black: rgb(35, 35, 35)
    // images left untouched
    // running time o(n), n is number of elements on a page
    var allElements = document.getElementsByTagName("*");
    for(var i=0; i<allElements.length; i++) {
        // Check for images
        if (allElements[i].nodeName.toLowerCase() === 'img'){
            continue;
        }
        // Check for URLs
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(allElements[i])) {
            // Set all URL to white
            allElements[i].style.color = "rgb(255, 255, 255)";
        } else {
            // Exception handler
            try {
                // Set regular text to grey
                allElements[i].style.color = "rgb(155, 155, 155)";
                // Store current background color to array /backgroundColor/
                // Where backgroundColor[0] is the backgroundColor
                // backgroundColor[1] is backgroundColor's red value
                // backgroundColor[2] is backgroundColor's green value
                // backgroundColor[3] is backgroundColor's blue value
                var backgroundColor = allElements[i].style.background.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
                // check for null
                if (backgroundColor==null) {
                    allElements[i].style.background = "rgb(35, 35, 35)";
                } else {
                    // Set new backgroundColor value
                    var r = parseInt(backgroundColor[1]) - 200;
                    var g = parseInt(backgroundColor[2]) - 200;
                    var b = parseInt(backgroundColor[3]) - 200;
                    if (r <= 0 ) {
                        r = 20;
                    } else if (g <=0 ) {
                        g = 20;
                    } else if (b <=0 ) {
                        b = 20;
                    }
                    allElements[i].style.background = 'rgb(' + r + ',' + g + ',' + b + ')';;
                }
            } catch(e) {};
        }
    }
})();
