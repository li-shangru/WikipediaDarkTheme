// ==UserScript==
// @name         Wikipedia Dark Theme
// @author       Shangru Li
// @version      1.30
// @match        *://*.wikipedia.org/*
// @match        *://*.mediawiki.org/*
// @match        *://*.wikimedia.org/*
// @match        *://*.wikibooks.org/*
// @match        *://*.wikidata.org/*
// @match        *://*.wikinews.org/*
// @match        *://*.wikiquote.org/*
// @match        *://*.wikisource.org/*
// @match        *://*.wikiversity.org/*
// @match        *://*.wikivoyage.org/*
// @match        *://*.wiktionary.org/*
// @namespace    https://github.com/MaxsLi/WikipediaDarkTheme
// @icon         https://www.wikipedia.org/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
//######################___Localizations___#####################################
// @name                Wikipedia Dark Theme
// @description         Script gives Wikipedia pages a dark color theme
// @name:ja             Wikipediaダークテーマ
// @description:ja      Wikipediaのサイトのバックグラウンドを黒に変更するスクリプトです
// @name:zh-CN          维基百科黑色主题
// @description:zh-CN   给予维基百科网页一个黑色主题
// @name:zh-TW          维基百科黑色主题
// @description:zh-TW   給予維基百科網頁壹個黑色主題
// ==/UserScript==

'use strict';

//############################################___Default_Colors___######################################################
const DEFAULT_CONTRAST_VALUE = 8;
const DEFAULT_FOREGROUND_COLOR = "rgb(238, 255, 255)";
const DEFAULT_BACKGROUND_COLOR = "rgb(35, 35, 35)";
//############################################___One_Could_Alter_If_Desired___##########################################

//############################################___Global_Variables___####################################################

const LOCALE = window.location.href.substring(0, window.location.href.indexOf(".wiki")).slice(-2);

const DEFAULT_BACKGROUND_COLOR_RGB = splitToRGB(DEFAULT_BACKGROUND_COLOR);

// list of tags of the wikipedia logos and symbols to be excluded from setting backgroundColor to white
const EXCLUDE_SRC_TAG = [
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
    "celestia", "antistub", "wiki_letter", "kit_body", "ui_icon_edit-ltr-progressive",
    "merge-split-transwiki", "mergefrom", "px-steady", "px-decrease", "px-increase",
    "question_book", "padlock-silver", "incubator-logo", "px-chinese_conversion",
    "px-applications-graphics", "px-pody_candidate", "px-potd-logo", "px-pd-icon",
    "px-dialog-warning", "px-checked_copyright_icon", "px-valued_image_seal",
    "px-cscr-former", "px-red_x", "px-crystal_clear_app_kedit", "px-people_icon",
    "kit_shorts", "kit_socks", "wikipedia-logo", "phacility_phabricator_logo",
    "wikimedia_cloud_services_logo", "lingualibre-logo", "le_dico_des_ados_small_logo",
    "vikidia_v_vectorised", "sciences_humaines", "science-symbol", "history2",
    "vote3_final", "p_religion_world", "tecno-rueda", "notification-icon",
    "countries-vector", "p_history", "social_sciences", "p_culture", "p_religion_world",
    "p_sport", "p_train", "p_parthenon", "wiktionary_small", "wikimedia-logo",
    "crystal_clear_app_xmag", "1rightarrow", "emblem-qual", "hswikimedia", "hsutvald",
    "hstools", "hscontribs", "pl_wiki_czywiesz_ikona", "hs_geo", "p_wwii", "p_literature",
    "p_science", "p_globe", "p_vip", "p_mathematics", "p_chemistry", "p_medicine3",
    "p_technology", "datum17", "hs_liste", "hs_rtl_exclamation", "hsbook", "hshome",
    "hs_korganizer", "hseditor", "84_tematyczny_logo_propozycja", "hsbra",
    "pl_wiki_kalendarium_ikona", "pl_wiki_inm_ikona", "wiktionarypl_nodesc",
    "wikimedia_polska_logo", "icon_of_three_people_in_different_shades_of_grey",
    "wikimania", "hs_skand", "emblem-star-gray", "help-browser-red", "globe-with-clock",
    "records", "office-calendar", "preferences-desktop-locale", "system-users",
    "applications-system", "emblem-earth", "mail-closed", "tango-nosources",
    "emblem-scales"
];

// list of tags of images to have color inverted, both lists are subjected to amend
const INVERT_SRC_TAG = [
    "loudspeaker", "signature", "signatur", "chinese_characters", "/media/math/render/",
    "translation_to_english_arrow", "disambig_gray", "wikimedia-logo_black", "blue_pencil",
    "latin_alphabet_", "_cursiva", "unbalanced_scales", "question%2c_web_fundamentals",
    "wikipedia-tagline", "wikipedia-wordmark", "copyright/wikipedia", "ui_icon_ellipsis",
    "bluebg_rounded_croped", "blue-bg_rounded_cropped_right", "icon_facebook",
    "youtube_social_dark_circle", "instagram_circle", "icon_twitter",
    "%d8%a8%d8%a7%d9%84%d8%ad%d9%84%d9%8a%d8%a9", "font_awesome_5_solid_feather-alt",
    "font_awesome_5_solid_tree", "font_awesome_5_solid_globe", "font_awesome_5_solid_futbol",
    "font_awesome_5_solid_hourglass", "font_awesome_5_solid_users", "font_awesome_5_solid_palette",
    "font_awesome_5_solid_rocket", "font_awesome_5_solid_bong", "vlad1Trezub", "font_awesome_5_solid_flag",
    "font_awesome_5_solid_university", "wikipedia_wordmark"
];

//############################################___Controller___##########################################################

// The main control function is called at every `onreadystatechange`
// Document state will go from `loading` --> `interactive` --> `complete`
// Metadata Block `@run-at document-start` will ensure this script start executing when `loading`
(document.onreadystatechange = function () {
    if (GM_getValue("scriptEnabled")) {
        if ('loading' === document.readyState) {
            setPageVisibility("hidden");
        } else if ('interactive' === document.readyState) {
            applyDarkTheme();
        } else if ('complete' === document.readyState) {
            setPageVisibility("visible");
            addToggleScriptButton();
            invertSpecialElements();
        }
    } else if ('complete' === document.readyState) {
        addToggleScriptButton();
    }
})();

//############################################___Functions___###########################################################

function setPageVisibility(visibility) {
    let entirePage = document.getElementsByTagName('html')[0];
    entirePage.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    entirePage.style.visibility = visibility;
}

function applyDarkTheme() {
    // General idea is to put all elements on a wikipedia page to an array `allElements`
    // traverse through this array and reverse the color of each element accordingly
    // running time o(n), where n is the number of elements on a page
    document.querySelectorAll('*').forEach(function(element) {
    	try {
            if (!isSpecialElement(element)) {
                changeForegroundColor(element);
                changeBackgroundColor(element);
            }
        } catch (e) {
            console.log(e);
        }
    });
}

function isSpecialElement(e) {
    if (elementIsImage(e)) {
        changeImageIfOnLists(e);
        return true;
    } else if (elementIsWikiLogo(e)) {
        invertImage(e, 90);
        return true;
    } else if (elementIsKeyboardKey(e)) {
        e.style.foregroundColor = DEFAULT_BACKGROUND_COLOR;
        return true;
    } else if (elementIsFamilyTree(e)) {
        if (e.style.borderTop) {
            e.style.borderTopColor = "white";
        }
        if (e.style.borderBottom) {
            e.style.borderBottomColor = "white";
        }
        if (e.style.borderLeft) {
            e.style.borderLeftColor = "white";
        }
        if (e.style.borderRight) {
            e.style.borderRightColor = "white";
        }
        if (e.style.border) {
            e.style.borderColor = "white";
        }
        return true;
    } else return (elementIsLegendOrPieChart(e) || elementIsIndicationArrow(e));
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
    for (let i = 0; i < EXCLUDE_SRC_TAG.length; i++) {
        if (img.src.toLowerCase().includes(EXCLUDE_SRC_TAG[i])) {
            return true;
        }
    }
    return false;
}

function imageInInvertList(img) {
    for (let i = 0; i < INVERT_SRC_TAG.length; i++) {
        if (img.src.toLowerCase().includes(INVERT_SRC_TAG[i])) {
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

function elementIsLegendOrPieChart(e) {
    return e.className.toLowerCase().includes('legend') ||
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
        ) || e.innerHTML === "&nbsp;" || e.innerHTML === "​" || e.innerHTML === "■";
}

function elementIsFamilyTree(e) {
    return e.style.borderTop.toLowerCase().includes("1px solid black") ||
        e.style.borderTop.toLowerCase().includes("1px dashed black") ||
        e.style.borderTop.toLowerCase().includes("1px dotted black") ||
        e.style.borderBottom.toLowerCase().includes("1px solid black") ||
        e.style.borderBottom.toLowerCase().includes("1px dashed black") ||
        e.style.borderBottom.toLowerCase().includes("1px dotted black") ||
        e.style.borderLeft.toLowerCase().includes("1px solid black") ||
        e.style.borderLeft.toLowerCase().includes("1px dashed black") ||
        e.style.borderLeft.toLowerCase().includes("1px dotted black") ||
        e.style.borderRight.toLowerCase().includes("1px solid black") ||
        e.style.borderRight.toLowerCase().includes("1px dashed black") ||
        e.style.borderRight.toLowerCase().includes("1px dotted black") ||
        e.style.border.toLowerCase().includes("2px solid black");
}

function elementIsIndicationArrow(e) {
    return e.innerHTML === "▼" || e.innerHTML === "▲";
}

function changeForegroundColor(e) {
    let foregroundColor = window.getComputedStyle(e, null).getPropertyValue("color");
    if (colorIsRGB(foregroundColor)) {
        foregroundColor = splitToRGB(foregroundColor);
        foregroundColor = inverseRBGColor(foregroundColor);
        foregroundColor = increaseRGBToMatchContrastValue(foregroundColor, DEFAULT_BACKGROUND_COLOR_RGB, DEFAULT_CONTRAST_VALUE, 30);
        e.style.color = RGBArrayToString(foregroundColor);
    } else {
        e.style.color = DEFAULT_FOREGROUND_COLOR;
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
        backgroundColor = decreaseRGBToMatchContrastValue(backgroundColor, DEFAULT_BACKGROUND_COLOR_RGB, DEFAULT_CONTRAST_VALUE, -30);
        e.style.backgroundColor = RGBArrayToString(backgroundColor);
    } else if (backgroundColor !== "rgba(0, 0, 0, 0)" || elementToChangeBackground(e)) {
        e.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    }
    const backgroundImage = elementComputedStyle.getPropertyValue("background-image");
    if (backgroundImageToRemove(backgroundImage)) {
        e.style.background = DEFAULT_BACKGROUND_COLOR;
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
    if (Number(rgb[0]) < Number(DEFAULT_BACKGROUND_COLOR_RGB[0]) - 10 && Number(rgb[1]) < Number(DEFAULT_BACKGROUND_COLOR_RGB[1]) - 10 &&
        Number(rgb[2]) < Number(DEFAULT_BACKGROUND_COLOR_RGB[2]) - 10) {
        return true;
    }
}

function RGBArrayToString(rgb) {
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
}

function elementToChangeBackground(e) {
    return e.id.toLowerCase().includes("mw-head") || e.parentElement.id.includes("ca-");
}

function invertSpecialElements() {
    let sheet = window.document.styleSheets[0];
    if (LOCALE === "zh") {
        // Chinese conversion box
        sheet.insertRule('.vectorTabs li { background-image: none; }', sheet.cssRules.length);
        sheet.insertRule('.vectorTabs li a span { background: ' + DEFAULT_BACKGROUND_COLOR + ' !important; }', sheet.cssRules.length);
        sheet.insertRule('.vectorTabs li a span { color: ' + DEFAULT_FOREGROUND_COLOR + ' !important; }', sheet.cssRules.length);
        // Chinese main page
        sheet.insertRule('@media (min-width: 720px) { .mw-parser-output #mp-2012-column-right-block-b { background: ' + DEFAULT_BACKGROUND_COLOR + ' !important; } }', sheet.cssRules.length);
    } else if (LOCALE === "fr") {
        // French Main page and side bar
        sheet.insertRule('#accueil_2017_en-tete { background: ' + DEFAULT_BACKGROUND_COLOR + ' !important; }', sheet.cssRules.length);
        sheet.insertRule('#mw-panel { background: ' + DEFAULT_BACKGROUND_COLOR + ' !important; }', sheet.cssRules.length);
    } else if (LOCALE === "ja") {
        // Japanese main page headings
        sheet.insertRule('.mw-parser-output .mainpage-heading-title { background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }', sheet.cssRules.length);
    } else if (LOCALE === "es") {
        // Spanish main page headings
        sheet.insertRule('@media (min-width: 1000px) { .mw-parser-output .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; } }', sheet.cssRules.length);
    } else if (LOCALE === "pl") {
        // Polish main page headings
        sheet.insertRule('h2 { background-image: none !important; background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }', sheet.cssRules.length);
    } else if (LOCALE === "ru") {
        // Russian main page
        sheet.insertRule('@media (min-width: 1000px) { .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; } }', sheet.cssRules.length);
    } else if (LOCALE === "sv") {
        // Swedish main page headings
        sheet.insertRule('.mw-parser-output .frontPageBlock { background: none !important; }', sheet.cssRules.length);
        sheet.insertRule('.frontPageBlockTitle { background: linear-gradient(to right,rgb(74,51,25),rgba(173,171,170,0)) !important; }', sheet.cssRules.length);
    } else if (LOCALE === "uk") {
        // Ukrainian main page
        sheet.insertRule('.mw-parser-output #main-head { background: linear-gradient(rgb(30,30,30),' + DEFAULT_BACKGROUND_COLOR + ' ) !important; }', sheet.cssRules.length);
        sheet.insertRule('.mw-parser-output #main-bottom { background: linear-gradient(' + DEFAULT_BACKGROUND_COLOR + ', rgb(30,30,30)) !important; }', sheet.cssRules.length);
    } else if (LOCALE === "ko") {
        // Korean main page
        sheet.insertRule('.mw-parser-output .main-top-left { background-image: linear-gradient(to right, #070605 0%,#070605 70%, rgba(7,6,5,0)100%) !important; }', sheet.cssRules.length);
    }
}

//############################################___Toggle_Script_Button___################################################

function addToggleScriptButton() {
    // Create a list that contains toggle script button
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
    // Getting the login button and logout button
    const loginLinkElement = document.getElementById("pt-login");
    const logoutLinkElement = document.getElementById("pt-logout");
    // Two cases: user logged-in or not logged-in
    // Get the parent of either element that is defined
    let parentList = (loginLinkElement) ? (loginLinkElement.parentElement) : (logoutLinkElement.parentElement);
    // Adding toggle script button to after the login/logout button
    parentList.appendChild(toggleScriptList);
    updateToggleScriptButton();
}

function updateToggleScriptButton() {
    switch (LOCALE) {
        case "zh":
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptButton("关闭黑色主题", "单击来关闭维基百科黑色主题。", "white");
            } else {
                setToggleScriptButton("开启黑色主题", "单击来开启维基百科黑色主题。", "black");
            }
            break;
        case "ja":
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptButton("ダークテーマを解除する", "ここをクリックしてダークテーマから切り替わる。", "white");
            } else {
                setToggleScriptButton("ダークテーマを設定する", "ここをクリックしてダークテーマに切り替わる。", "black");
            }
            break;
        case "fr":
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptButton("Fermer le thème noir", "Cliquer pour fermer le thème noir.", "white");
            } else {
                setToggleScriptButton("Ouvrir le thème noir", "Cliquer pour ouvrir le thème noir.", "black");
            }
            break;
        default:
            if (GM_getValue("scriptEnabled")) {
                setToggleScriptButton("Disable Dark Theme", "Click to disable Wikipedia Dark Theme.", "white");
            } else {
                setToggleScriptButton("Enable Dark Theme", "Click to enable Wikipedia Dark Theme.", "black");
            }
    }
}

function setToggleScriptButton(text, title, color) {
    const toggleScriptElement = document.getElementById("toggleScriptElement");
    toggleScriptElement.text = text;
    toggleScriptElement.title = title;
    toggleScriptElement.style.color = color;
}