// ==UserScript==
// @name         Wikipedia Dark Theme
// @namespace    https://github.com/MaxsLi/WikipediaDarkTheme
// @version      0.83
// @icon         https://www.wikipedia.org/favicon.ico
// @description  Pure Dark theme for Wikipedia pages
// @author       Shangru Li
// @match        *://*.wikipedia.org/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

// The main function is called at every `onreadystatechange`
// Document state will go from `loading` --> `interactive` --> `complete`
// Metadata Block `@run-at document-start` will ensure the script start executing when `loading`
(document.onreadystatechange = function () {

    //##################---default_values---#####################################
    var default_contrastValue = 8;
    var default_foregroundColor = "rgb(238, 255, 255)";
    var default_backgroundColor = "rgb(35, 35, 35)";
    //##################---one_could_alter_if_desired---#########################

    // Check each document state and take action accordingly
    if ('loading' == document.readyState) {
        // if document is loading we first hide the whole page
        setPageVisibility("hidden");
    } else if ('interactive' == document.readyState) {
        // when document has finished loading and the document has been parsed, we can start changing the styles
        setPage();
    } else if ('complete' == document.readyState) {
        // after the document is finished we can set the whole page back to `visible`
        setPageVisibility("visible")
    }

    // function to change the all the elements on a page to desired color
    function setPage() {
        'use strict';
        // General idea is to put all elements on a wikipedia page to an array `allElements`
        // traverse through this array and reverse the color of each element accordingly
        // running time o(n), where n is the number of elements on a page
        var allElements = document.getElementsByTagName('*');
        for (var i = 0; i < allElements.length; i++) {
            var currentElement = allElements[i];
            // exception handler
            try {
                // check for legends and pie charts
                if (currentElement.className.toLowerCase().includes('legend') ||
                        currentElement.style.borderColor.toLowerCase().includes('transparent') ||
                        currentElement.className.toLowerCase().includes('border')) {
                    continue;
                }
                // check for wiki logo
                else if (currentElement.className.toLowerCase().includes("mw-wiki-logo")) {
                    invertImage(currentElement, 90);
                    continue;
                }
                // check for math functions and expressions
                else if (currentElement.className.toLowerCase().includes('mwe-math')) {
                    // invert the math expression images by setting a invert filter to 86% to match the background color
                    invertImage(currentElement, 86);
                    continue;
                }
                // check for keyboard-key
                else if (currentElement.className.toLowerCase().includes('keyboard-key')) {
                    currentElement.style.background = default_backgroundColor;
                    continue;
                }
                else if (currentElement.nodeName.toLowerCase() == 'img') {
                    // check for signatures
                    if (currentElement.src.toLowerCase().includes('signature')) {
                        invertImage(currentElement, 100);
                    } else if (!check_exclude(currentElement)) {
                        currentElement.style.backgroundColor = "rgb(255, 255, 255)";
                    }
                    continue;
                }
                // get the foreground color of the `currentElement`, using `getComputedStyle` will return the actual showing
                // color of the given element in `rgb` format. However, this method seems to need the document first be loaded
                // after returning the computed style. Hence, to get around, we hide the entire page while waiting the document
                // to load, then un-hide after finished.
                var foregroundColor = window.getComputedStyle(currentElement, null).getPropertyValue("color");
                var backgroundColor = window.getComputedStyle(currentElement, null).getPropertyValue("background-color");
                // temporary helper variables
                var r, g, b;
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
                    // make sure the contrast is high enough to ensure a decent viewing experience.
                    while (contrast([r, g, b], [default_backgroundColor_array[1], default_backgroundColor_array[2], default_backgroundColor_array[3]])
                            < default_contrastValue) {
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
                    // if the background is too bright, we decrease the brightness of `backgroundColor`
                    while (contrast([r, g, b], [default_backgroundColor_array[1], default_backgroundColor_array[2], default_backgroundColor_array[3]])
                            > default_contrastValue) {
                        r = r - 30;
                        g = g - 30;
                        b = b - 30;
                    }
                    // set color
                    currentElement.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                } else{
                    // set default color
                    currentElement.style.backgroundColor = default_backgroundColor;
                }
            } catch (e){
                // print any exception messages
                console.log(e);
            }
        }
    }

    // helper function to set the visibility of a html page
    function setPageVisibility(visibility) {
        // get the entire html page
        var EntirePage = document.getElementsByTagName('html')[0];
        // set the page's background color to `default_backgroundColor`
        EntirePage.style.backgroundColor = default_backgroundColor;
        EntirePage.style.visibility = visibility;
    }

    // helper function to calculate the luminance of given `r`, `g`, `b` value
    function luminance(r, g, b) {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    // helper function to calculate the contrast of two given color `rgb1` and `rgb2`
    function contrast(rgb1, rgb2) {
        return (luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) / (luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
    }

    // helper function to check given source link has contain any substring specified in the list
    function check_exclude(element) {
        // list of tags of the wikipedia logos and symbols to be excluded
        // list are subject to amend
        var exclude_src_tag = [
            "protection-shackle", "Green_check", "Symbol_support_vote",
            "Edit-clear", "Information_icon", "Increase2", "Decrease_Positive",
            "Steady2", "Decrease2", "Increase_Negative", "red_question_mark",
            "Blue_check", "X_mark", "Yes_check", "Twemoji", "Walnut", "Cscr-featured",
            "sound-openclipart", "Folder_Hexagonal_Icon", "Symbol_book_class2",
            "Question_book-new", "Wiktionary-logo", "Commons-logo", "Wikinews-logo",
            "Wikiquote-logo", "Wikivoyage-Logo", "Sound-icon", "Wikibooks-logo",
            "Wikiversity-logo", "Ambox_contradict", "Ambox_question", "System-search",
            "Split-arrows", "Wikiversity_logo", "Wikisource-logo", "Wikimedia_Community_Logo",
            "Wikidata-logo", "Mediawiki-logo", "Wikispecies-logo"
        ];
        // loop over the list
        for (var i = 0; i < exclude_src_tag.length; i++) {
            if (element.src.includes(exclude_src_tag[i])) {
                return true;
            }
        }
    }

    // helper function to invert a image to desired percentage
    function invertImage(img, percent) {
        img.style.filter = "invert(" + percent + "%)";
    }
})();
