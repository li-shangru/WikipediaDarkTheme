// ==UserScript==
// @name         Wikipedia Dark Theme
// @author       Shangru Li
// @version      1.14
// @match        *://*.wikipedia.org/*
// @namespace    https://github.com/MaxsLi/WikipediaDarkTheme
// @icon         https://www.wikipedia.org/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
//###############---localizations---##################
// @name:en             Wikipedia Dark Theme
// @description:en      Script gives Wikipedia pages a dark color theme
// @name:ja             Wikipediaダークテーマ
// @description:ja      Wikipediaのサイトのバックグラウンドを黒に変更するスクリプトです
// @name:zh-CN          维基百科黑色主题
// @description:zh-CN   给予维基百科网页一个黑色主题
// @name:zh-TW          维基百科黑色主题
// @description:zh-TW   給予維基百科網頁壹個黑色主題
// ==/UserScript==

'use strict';

//##################---default_values---#####################################
const default_contrastValue = 8;
const default_foregroundColor = "rgb(238, 255, 255)";
const default_backgroundColor = "rgb(35, 35, 35)";
const default_backgroundColorRGB = splitToRGB(default_backgroundColor);
//##################---one_could_alter_if_desired---#########################

// list of tags of the wikipedia logos and symbols to be excluded from setting backgroundColor to white
const exclude_src_tag = [
    "protection-shackle", "green_check", "symbol_support_vote",
    "edit-clear", "information_icon", "increase2", "decrease_positive",
    "steady2", "decrease2", "increase_negative", "red_question_mark",
    "blue_check", "x_mark", "yes_check", "twemoji", "walnut", "cscr-featured",
    "sound-openclipart", "folder_hexagonal_icon", "symbol_book_class2",
    "question_book-new", "wiktionary-logo", "commons-logo", "wikinews-logo",
    "wikiquote-logo", "wikivoyage-logo", "sound-icon", "wikibooks-logo",
    "wikiversity-logo", "ambox", "system-search", "split-arrows", "wikiversity_logo",
    "wikisource-logo", "wikimedia_community_logo", "wikidata-logo", "mediawiki-logo",
    "wikispecies-logo", "nuvola_apps", "white_flag_icon",
    "wiki_letter_w_cropped", "edit-copy_purple-wikiq", "acap", "portal-puzzle",
    "star_of_life", "disambig-dark", "gnome", "office-book", "audio-input-microphone",
    "hsutvald2", "hspolitic", "hsdagensdatum", "hsvissteduatt", "pl_wiki_aktualnosci_ikona",
    "hsbild", "wiki_aktualnosci_ikona", "hs_vdq", "hssamarbete", "hswpedia", "w-circle",
    "red_pencil_icon", "merge-arrow", "generic_with_pencil", "hsaktuell", "hsearth",
    "wikimedia-logo-circle", "wiktionary_ko_without_text", "mediawiki-notext",
    "wiktprintable_without_text", "dialog-information", "applications-office",
    "celestia", "antistub", "wiki_letter", "kit_body_basketball", "ui_icon_edit-ltr-progressive",
    "merge-split-transwiki", "mergefrom", "px-steady", "px-decrease", "px-increase",
    "question_book", "padlock-silver", "incubator-logo", "px-chinese_conversion",
    "px-applications-graphics", "px-pody_candidate", "px-potd-logo", "px-pd-icon",
    "px-dialog-warning", "px-checked_copyright_icon", "px-valued_image_seal",
    "px-cscr-former", "px-red_x", "px-crystal_clear_app_kedit", "px-people_icon"
];

// list of tags of images to have color inverted, both lists are subjected to amend
const invert_src_tag = [
    "loudspeaker", "signature", "signatur", "chinese_characters", "/media/math/render/",
    "translation_to_english_arrow", "disambig_gray", "wikimedia-logo_black", "blue_pencil",
    "latin_alphabet_", "_cursiva", "unbalanced_scales", "question%2c_web_fundamentals"
];

const locale = window.location.href.substring(0, window.location.href.indexOf(".wikipedia")).slice(-2);

// The main controller function is called at every `onreadystatechange`
// Document state will go from `loading` --> `interactive` --> `complete`
// Metadata Block `@run-at document-start` will ensure the script start executing when `loading`
(document.onreadystatechange = function () {
    if (!GM_getValue("scriptEnabled")) {
        addToggleScriptElement();
        return false;
    } else if ('loading' === document.readyState) {
        setPageVisibility("hidden");
    } else if ('interactive' === document.readyState) {
        setPage();
    } else if ('complete' === document.readyState) {
        setPageVisibility("visible");
        addToggleScriptElement();
        if (locale === "zh") {
            invertChineseConversionBox();
        }
    }
})();

//##################___Functions___#########################################

function setPageVisibility(visibility) {
    let entirePage = document.getElementsByTagName('html')[0];
    entirePage.style.backgroundColor = default_backgroundColor;
    entirePage.style.visibility = visibility;
}

function setPage() {
    // General idea is to put all elements on a wikipedia page to an array `allElements`
    // traverse through this array and reverse the color of each element accordingly
    // running time o(n), where n is the number of elements on a page
    let allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
        let currentElement = allElements[i];
        try {
            if (!isSpecialElement(currentElement)) {
                changeForegroundColor(currentElement);
                changeBackgroundColor(currentElement);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

function isSpecialElement(e) {
    if (elementIsImage(e)) {
        changeImageIfOnLists(e);
        return true;
    } else if (elementIsWikiLogo(e)) {
        invertImage(e, 90);
        return true;
    } else if (elementIsKeyboardKey(e)) {
        e.style.foregroundColor = default_backgroundColor;
        return true;
    } else if (elementIsLegendOrPieCharts(e)) {
        return true;
    } else {
        return false;
    }
}

function elementIsImage(e) {
    return e.nodeName.toLowerCase() === 'img';
}

function changeImageIfOnLists(img) {
    if (!imageInExcludeList(img)) {
        img.style.backgroundColor = "rgb(255, 255, 255)";
    }
    if (imageInInvertList(img)) {
        invertImage(img, 86);
    }
}

function imageInExcludeList(img) {
    for (let i = 0; i < exclude_src_tag.length; i++) {
        if (img.src.toLowerCase().includes(exclude_src_tag[i])) {
            return true;
        }
    }
    return false;
}

function imageInInvertList(img) {
    for (let i = 0; i < invert_src_tag.length; i++) {
        if (img.src.toLowerCase().includes(invert_src_tag[i])) {
            return true;
        }
    }
    return false;
}

function invertImage(img, percent) {
    img.style.filter = "invert(" + percent + "%)";
}

function elementIsWikiLogo(e) {
    return e.className.toLowerCase().includes("mw-wiki-logo");
}

function elementIsKeyboardKey(e) {
    return e.className.toLowerCase().includes('keyboard-key');
}

function elementIsLegendOrPieCharts(e) {
    if (e.className.toLowerCase().includes('legend') ||
        e.style.borderColor.toLowerCase().includes('transparent') ||
        (
            // Pie chart template
            (
                e.style.border.toLowerCase().includes("1px solid rgb(0, 0, 0)") ||
                e.style.border.toLowerCase().includes("1px solid black")
            ) &&
            e.style.height === "200px" &&
            e.style.height === "200px" &&
            e.style.borderRadius === "100px"
        ) ||
        (
            e.nodeName === "SPAN" && e.textContent.replace(/\s/g, '').length === 0
        )
    ) {
        return true;
    } else {
        return false;
    }
}

function changeForegroundColor(e) {
    let foregroundColor = window.getComputedStyle(e, null).getPropertyValue("color");
    if (colorIsRGB(foregroundColor)) {
        foregroundColor = splitToRGB(foregroundColor);
        foregroundColor = inverseRBGColor(foregroundColor);
        foregroundColor = increaseRGBToMatchContrastValue(foregroundColor, default_backgroundColorRGB, default_contrastValue, 30);
        e.style.color = RGBArrayToString(foregroundColor);
    } else {
        e.style.color = default_foregroundColor;
    }
}

function changeBackgroundColor(e) {
    const elementComputedStyle = window.getComputedStyle(e, null);
    let backgroundColor = elementComputedStyle.getPropertyValue("background-color");
    if (colorIsRGB(backgroundColor)) {
        backgroundColor = splitToRGB(backgroundColor);
        backgroundColor = inverseRBGColor(backgroundColor);
        if (RGBTooDark(backgroundColor)) {
            backgroundColor = addValueToRGB(backgroundColor, 30);
        }
        backgroundColor = decreaseRGBToMatchContrastValue(backgroundColor, default_backgroundColorRGB, default_contrastValue, -30);
        e.style.backgroundColor = RGBArrayToString(backgroundColor);
    } else {
        e.style.backgroundColor = default_backgroundColor;
    }
    const backgroundImage = elementComputedStyle.getPropertyValue("background-image");
    if (backgroundImageToRemove(backgroundImage)) {
        e.style.background = default_backgroundColor;
    }
}

function backgroundImageToRemove(backgroundImage) {
    // This will remove the white banner on Chinese Wikipedia main page
    return backgroundImage && backgroundImage.includes("Zhwp_blue_banner.png");
}

function colorIsRGB(c) {
    return c.match(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);
}

function splitToRGB(c) {
    const rgb = colorIsRGB(c);
    return [rgb[1], rgb[2], rgb[3]];
}

function inverseRBGColor(c) {
    let r, g, b;
    r = 255 - Number(c[0]);
    g = 255 - Number(c[1]);
    b = 255 - Number(c[2]);
    return [r, g, b];
}

function increaseRGBToMatchContrastValue(colorToChange, colorToMatch, contrastValue, changePerLoop) {
    let result = colorToChange;
    while (contrast(result, colorToMatch) < contrastValue) {
        result = addValueToRGB(result, changePerLoop);
    }
    return result;
}

function decreaseRGBToMatchContrastValue(colorToChange, colorToMatch, contrastValue, changePerLoop) {
    let result = colorToChange;
    while (contrast(result, colorToMatch) > contrastValue) {
        result = addValueToRGB(result, changePerLoop);
    }
    return result;
}

function contrast(rgb1, rgb2) {
    return (luminance(rgb1) + 0.05) / (luminance(rgb2) + 0.05);
}

function luminance(rgb) {
    let result = rgb.map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return result[0] * 0.2126 + result[1] * 0.7152 + result[2] * 0.0722;
}

function addValueToRGB(rgb, value) {
    return [Number(rgb[0]) + Number(value), Number(rgb[1]) + Number(value), Number(rgb[2]) + Number(value)];
}

function RGBTooDark(rgb) {
    if (Number(rgb[0]) < Number(default_backgroundColorRGB[0]) - 10 && Number(rgb[1]) < Number(default_backgroundColorRGB[1]) - 10 &&
        Number(rgb[2]) < Number(default_backgroundColorRGB[2]) - 10) {
        return true;
    }
}

function RGBArrayToString(rgb) {
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
}

function invertChineseConversionBox() {
    let sheet = window.document.styleSheets[0];
    sheet.insertRule('.vectorTabs li { background-image: none; }', sheet.cssRules.length);
    sheet.insertRule('.vectorTabs li a span { background: ' + default_backgroundColor + ' !important; }', sheet.cssRules.length);
    sheet.insertRule('.vectorTabs li a span { color: ' + default_foregroundColor + ' !important; }', sheet.cssRules.length);
}

//##################___Toggle_Link___#######################################

function addToggleScriptElement() {
    const loginLinkElement = document.getElementById("pt-login");
    const logoutLinkElement = document.getElementById("pt-logout");
    // Two cases: user logged-in or not logged-in
    // Get the parent of either element that is defined
    const parentList = (loginLinkElement) ? (loginLinkElement.parentElement) : (logoutLinkElement.parentElement);
    let toggleScriptList = document.createElement('li');
    let toggleScriptElement = document.createElement('a');
    toggleScriptElement.id = "toggleScriptElement";
    toggleScriptElement.style.fontWeight = 'bold';
    toggleScriptElement.onclick = function () {
        // `GM_setValue()` and `GM_getValue()` are from Tampermonkey API
        GM_setValue("scriptEnabled", !GM_getValue("scriptEnabled"));
        location.reload();
        return false;
    };
    toggleScriptList.appendChild(toggleScriptElement);
    parentList.appendChild(toggleScriptList);
    updateToggleScriptElement();
}

function updateToggleScriptElement() {
    switch (locale) {
        case "zh":
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptElement("关闭黑色主题", "单击来关闭维基百科黑色主题。", "white");
            } else {
                setToggleScriptElement("打开黑色主题", "单击来打开维基百科黑色主题。", "black");
            }
            break;
        case "ja":
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptElement("ダークテーマを解除する", "ここをクリックしてダークテーマから切り替わる。", "white");
            } else {
                setToggleScriptElement("ダークテーマを設定する", "ここをクリックしてダークテーマに切り替わる。", "black");
            }
            break;
        default:
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptElement("Disable Dark Theme", "Click to disable Wikipedia Dark Theme.", "white");
            } else {
                setToggleScriptElement("Enable Dark Theme", "Click to enable Wikipedia Dark Theme.", "black");
            }
    }
}

function setToggleScriptElement(text, title, color) {
    const toggleScriptElement = document.getElementById("toggleScriptElement");
    toggleScriptElement.text = text;
    toggleScriptElement.title = title;
    toggleScriptElement.style.color = color;
}
