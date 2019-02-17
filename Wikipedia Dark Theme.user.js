// ==UserScript==
// @name         Wikipedia Dark Theme
// @namespace    https://github.com/MaxsLi/WikiDarkMode
// @version      0.7
// @icon         https://www.wikipedia.org/favicon.ico
// @description  Pure Dark theme for wikipedia.org
// @author       Shangru Li
// @match        *://*.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // General idea is to put all elements on a wikipedia page to an array `allElements`
    // traverse through this array and reverse the color of each element accordingly
    // running time o(n), where n is the number of elements on a page <- improve needed
    var allElements = document.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
        var currentElement = allElements[i];
        // exception handler
        try {
            // check for images
            if (currentElement.nodeName.toLowerCase() === 'img') {
                // Set images background color to white for better visibility
                currentElement.style.background = "rgb(255, 255, 255)";
                // skip to check next element
                continue;
            }
            // check for legends and borders
            else if (currentElement.className.toLowerCase().includes('legend') || currentElement.style.borderColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/)) {
                continue;
            }
            // get the foreground color of the `currentElement`, using `getComputedStyle` will return thea actual showing
            // color of the given element.
            var foregroundColor = window.getComputedStyle(currentElement, null).getPropertyValue("color");
            var backgroundColor = window.getComputedStyle(currentElement, null).getPropertyValue("background-color");
            var r, g, b;
            var default_contrastValue = 8;
            var default_foregroundColor = "rgb(238, 255, 255)";
            var default_backgroundColor = "rgb(35, 35, 35)";
            // split the `default_backgroundColor` string to array of RGB values.
            var default_backgroundColor_array = default_backgroundColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);

            // check if the `foregroundColor` is of type RGB value.
            if (foregroundColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/)) {
                // split color to RGB values.
                foregroundColor = foregroundColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);
                // inverse color
                r = 255 - foregroundColor[1];
                g = 255 - foregroundColor[2];
                b = 255 - foregroundColor[3];
                // checking contrast between foregroundColor of `currentElement` and the `default_backgroundColor`
                // make sure the contrast is big enough to ensure a decent viewing experience.
                while (contrast([r, g, b], [default_backgroundColor_array[1], default_backgroundColor_array[2], default_backgroundColor_array[3]]) < default_contrastValue) {
                    // increase each value by 30 each loop, i.e., increase the brightness of the current color
                    r = r + 30;
                    g = g + 30;
                    b = b + 30;
                }
                // set color
                currentElement.style.color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            } else {
                // set default color
                currentElement.style.color = default_foregroundColor;
            }

            // check if the `backgroundColor` is of type RGB value.
            if (backgroundColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/)) {
                // split color to RGB values.
                backgroundColor = backgroundColor.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);
                // inverse color
                r = 255 - backgroundColor[1];
                g = 255 - backgroundColor[2];
                b = 255 - backgroundColor[3];
                // for the background color one would not check for contrast, instead we increase the brightness of `backgroundColor`
                // if it is too dark, providing a comforting reading experience.
                if (r < default_backgroundColor_array[1] - 10 && g < default_backgroundColor_array[2] - 10 && g < default_backgroundColor_array[3] - 10) {
                    r = r + 30;
                    g = g + 30;
                    b = b + 30;
                }
                // set color
                currentElement.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
             } else{
                // set default color
                currentElement.style.backgroundColor = default_backgroundColor;
            }
        } catch (e){
            console.log(e)
        }
    }

    // Helper function to calculate the contrast of two given color
    function luminance(r, g, b) {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function contrast(rgb1, rgb2) {
        return (luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) / (luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
    }
})();
