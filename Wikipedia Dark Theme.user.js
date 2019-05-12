// ==UserScript==
// @name         Wikipedia Dark Theme
// @namespace    https://github.com/MaxsLi/WikipediaDarkTheme
// @version      0.86
// @icon         https://www.wikipedia.org/favicon.ico
// @description  Pure Dark theme for Wikipedia pages
// @author       Shangru Li
// @match        *://*.wikipedia.org/*
// @grant        none
// @run-at       document-start
// @name:zh-CN          维基百科纯黑主题
// @description:zh-cn   给予维基百科网页一个黑色主题
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

    //##################---controller---#########################################

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

    //##################---main function---######################################

    // function to change the all the elements on a page to desired color
    function setPage() {
        'use strict';
        // General idea is to put all elements on a wikipedia page to an array `allElements`
        // traverse through this array and reverse the color of each element accordingly
        // running time o(n), where n is the number of elements on a page

        // get all elements in the document, use to be `getElementsByTagName('*')`
        // However `querySelectorAll()` seems to be faster
        var allElements = document.querySelectorAll('*');
        // loop over all elements on the page
        for (var i = 0; i < allElements.length; i++) {
            var currentElement = allElements[i];
            // exception handler
            try {
                // check for images
                if (currentElement.nodeName.toLowerCase() == 'img') {
                    // check current image
                    checkImage(currentElement);
                    continue;
                }
                // check for wiki logo
                else if (currentElement.className.toLowerCase().includes("mw-wiki-logo")) {
                    invertImage(currentElement, 90);
                    continue;
                }
                // check for keyboard-key
                else if (currentElement.className.toLowerCase().includes('keyboard-key')) {
                    currentElement.style.foregroundColor = default_backgroundColor;
                    continue;
                }
                // check for legends and pie charts
                else if (currentElement.className.toLowerCase().includes('legend') ||
                    currentElement.className.toLowerCase().includes('border') ||
                    currentElement.style.borderColor.toLowerCase().includes('transparent')) {
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
                    while (contrast([r, g, b], [default_backgroundColor_array[1], default_backgroundColor_array[2], default_backgroundColor_array[3]]) <
                        default_contrastValue) {
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
                    while (contrast([r, g, b], [default_backgroundColor_array[1], default_backgroundColor_array[2], default_backgroundColor_array[3]]) >
                        default_contrastValue) {
                        r = r - 30;
                        g = g - 30;
                        b = b - 30;
                    }
                    // set color
                    currentElement.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                } else {
                    // set default color
                    currentElement.style.backgroundColor = default_backgroundColor;
                }
            } catch (e) {
                // print any exception messages
                console.log(e);
            }
        }
    }

    //##################---helper functions---###################################

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
    function checkImage(element) {
        // list of tags of the wikipedia logos and symbols to be excluded from setting backgroundColor to white
        // list is subject to amend
        var exclude_src_tag = [
            "protection-shackle", "green_check", "symbol_support_vote",
            "edit-clear", "information_icon", "increase2", "decrease_positive",
            "steady2", "decrease2", "increase_negative", "red_question_mark",
            "blue_check", "x_mark", "yes_check", "twemoji", "walnut", "cscr-featured",
            "sound-openclipart", "folder_hexagonal_icon", "symbol_book_class2",
            "question_book-new", "wiktionary-logo", "commons-logo", "wikinews-logo",
            "wikiquote-logo", "wikivoyage-logo", "sound-icon", "wikibooks-logo",
            "wikiversity-logo", "ambox", "system-search", "split-arrows", "wikiversity_logo",
            "wikisource-logo", "wikimedia_community_logo", "wikidata-logo", "mediawiki-logo",
            "wikispecies-logo", "blue_pencil", "nuvola_apps", "white_flag_icon",
            "wiki_letter_w_cropped", "edit-copy_purple-wikiq", "acap", "portal-puzzle",
            "star_of_life", "disambig-dark", "gnome", "office-book"
        ];
        // list of tags of images to have color inverted
        var invert_src_tag = [
            "loudspeaker", "signature", "signatur", "chinese_characters", "/media/math/render/"
        ];
        // loop over the `exclude_src_tag` list to set background color
        for (var i = 0; i < exclude_src_tag.length; i++) {
            if (element.src.toLowerCase().includes(exclude_src_tag[i])) {
                // element is in the list, stop looping
                break;
            }
        }
        // i equals list's length implies the element is not in the list
        if (i == exclude_src_tag.length) {
            // if element is not in the list, set the background color to white
            element.style.backgroundColor = "rgb(255, 255, 255)";
        }

        // loop over the `invert_src_tag` list to invert image color
        for (var j = 0; j < invert_src_tag.length; j++) {
            if (element.src.toLowerCase().includes(invert_src_tag[j])) {
                // invert image if element is in the list
                // invert 86 per cent in order to match the background color
                invertImage(element, 86);
                break;
            }
        }
    }

    // helper function to invert a image to desired percentage
    function invertImage(img, percent) {
        // invert images by adding a filter tag
        img.style.filter = "invert(" + percent + "%)";
    }
})();