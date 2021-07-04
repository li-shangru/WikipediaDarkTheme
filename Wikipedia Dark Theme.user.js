// ==UserScript==
// @name         Wikipedia Dark Theme
// @author       Shangru Li
// @version      1.41
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
const DEFAULT_LINK_COLOR = "rgb(249, 186, 82)";
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
    "kit_shorts", "kit_socks", "wikipedia-logo-v2", "phacility_phabricator_logo",
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
    "emblem-scales", "mediawiki-2020"
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
    "font_awesome_5_solid_university", "wikipedia_wordmark", "wikipedia-logo-textonly"
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
            initSettingElements();
            invertSpecialElements();
        }
    } else if ('complete' === document.readyState) {
        initSettingElements();
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
    document.querySelectorAll('*').forEach(function (element) {
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
    if (elementIsWikiLogo(e)) {
        invertImage(e, 90);
        return true;
    } else if (elementIsImage(e)) {
        changeImageIfOnLists(e);
        return true;
    } else if (elementIsHyperlink(e)) {
        e.style.color = GM_getValue("linkColor");
        changeBackgroundColor(e);
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

function elementIsHyperlink(e) {
    return e.tagName.toLowerCase() === 'a';
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
        foregroundColor = increaseRGBToMatchContrastValue(foregroundColor, DEFAULT_BACKGROUND_COLOR_RGB, GM_getValue("contrastValue"), 30);
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
        backgroundColor = decreaseRGBToMatchContrastValue(backgroundColor, DEFAULT_BACKGROUND_COLOR_RGB, GM_getValue("contrastValue"), -30);
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

function RGBToHex(r, g, b) {
    return "#" + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);
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

//############################################___Init_Elements___#######################################################

function initSettingElements() {
    initGMStorage();
    insertSettingsModalStyles();
    createSettingsModal();
    addButtonListeners();
    addSettingsButton();
    updateSettingsModal();
}

function initGMStorage(reset = false) {
    if (!GM_getValue("linkColor") || reset) {
        const split = splitToRGB(DEFAULT_LINK_COLOR);
        GM_setValue("linkColor", RGBToHex(split[0], split[1], split[2]));
    }
    if (!GM_getValue("contrastValue") || reset) {
        GM_setValue("contrastValue", DEFAULT_CONTRAST_VALUE);
    }
}

//############################################___Settings_Button___#####################################################

function addSettingsButton() {
    // Create a list that contains settings button
    let settingsButtonList = document.createElement("li");
    let settingsButton = document.createElement("a");
    settingsButton.id = "settingsButton";
    settingsButton.style.fontWeight = 'bold';
    settingsButton.onclick = function () {
        let settingsModal = document.getElementById("settingsModal")
        settingsModal.style.display = "block";
        return false;
    };
    settingsButtonList.appendChild(settingsButton);
    // Getting the login button and logout button
    const loginLinkElement = document.getElementById("pt-login");
    const logoutLinkElement = document.getElementById("pt-logout");
    // Two cases: user logged-in or not logged-in
    // Get the parent of either element that is defined
    let parentList = (loginLinkElement) ? (loginLinkElement.parentElement) : (logoutLinkElement.parentElement);
    // Adding toggle script button to after the login/logout button
    parentList.appendChild(settingsButtonList);
    setSettingsButton();
}

function setSettingsButton() {
    let settingsButton = document.getElementById("settingsButton");
    let text, title;
    switch (LOCALE) {
        case "zh":
            text = "设置";
            title = "设置维基百科黑色主题。";
            break;
        case "ja":
            text = "設定";
            title = "ウィキペディアダークテーマを設定します。";
            break;
        case "fr":
            text = "Les paramètres";
            title = "Modifiez les paramètres de Wikipédia Dark Theme.";
            break;
        default:
            text = "Settings";
            title = "Change settings for Wikipedia Dark Theme.";
    }
    settingsButton.text = text;
    settingsButton.title = title;
    settingsButton.style.color = GM_getValue("scriptEnabled") ? "white" : "black";
}

//############################################___Settings_Modal___######################################################

function createSettingsModal() {
    let settingsModal = `
        <div id="settingsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                  <h5>Wikipedia Dark Theme Settings</h5>
                  <span id="close" class="close">&times;</span>
                </div>
                <div class="modal-body">
                     <h6>Theme preferences</h6>
                     <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="darkTheme" value="dark">
                      <label class="form-check-label" for="darkTheme">Dark</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="lightTheme" value="light">
                      <label class="form-check-label" for="lightTheme">Light</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="theme" id="syncTheme" value="sync">
                      <label class="form-check-label" for="syncTheme">Sync with system</label>
                    </div>
                    <h6>Color preferences (in dark theme)</h6>
                    <div class="form-check-inline">
                        <label for="linkColor" id="linkColorLabel">Link color: </label>
                        <input type="color" id="linkColor" title="Choose your link color">
                    </div>
                    <div class="form-check-inline">
                        <label for="contrastValue">Contrast value:</label>
                        <input type="number" id="contrastValue" min="3" max="9" title="Enter a contrast value (between 3 and 9)">
                    </div>
                </div>
                <div class="modal-footer">
                   <button class="btn btn-outline-secondary" id="restoreButton">Restore defaults</button>
                   <button class="btn btn-outline-secondary close">Cancel</button>
                   <button class="btn btn-outline-primary" id="saveButton">Save changes</button>
                </div>
            </div>
        '</div>'
    `;
    document.body.insertAdjacentHTML('afterend', settingsModal)
}

function setSettings() {
    if (document.getElementById("syncTheme").checked) {
        GM_setValue("syncTheme", true);
    } else {
        GM_setValue("syncTheme", false);
    }
    if (document.getElementById("darkTheme").checked) {
        GM_setValue("scriptEnabled", true);
    } else {
        GM_setValue("scriptEnabled", false);
    }
    GM_setValue("linkColor", document.getElementById("linkColor").value);
    const contrastValue = document.getElementById("contrastValue").value;
    if (1 <= contrastValue <= 10) {
        GM_setValue("contrastValue", contrastValue);
    } else {
        GM_setValue("contrastValue", DEFAULT_CONTRAST_VALUE);
    }
}

function updateSettingsModal() {
    updateThemePreferences();
    updateColorPreferences();
}

function updateThemePreferences() {
    if (GM_getValue("syncTheme")) {
        const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (userPrefersDark) {
            GM_setValue("scriptEnabled", true);
        } else {
            GM_setValue("scriptEnabled", false);
        }
        document.getElementById("syncTheme").checked = "checked";
    } else {
        if (GM_getValue("scriptEnabled")) {
            document.getElementById("darkTheme").checked = "checked";
        } else {
            document.getElementById("lightTheme").checked = "checked";
        }
    }
}

function updateColorPreferences() {
    document.getElementById("linkColor").value = GM_getValue("linkColor");
    document.getElementById("contrastValue").value = GM_getValue("contrastValue");
}

function dismissSettingsModal() {
    const settingsModal = document.getElementById("settingsModal");
    settingsModal.style.display = "none";
    updateSettingsModal();
}

function addButtonListeners() {
    const closeButtons = document.getElementsByClassName("close");
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function () {
            dismissSettingsModal();
        }
    }
    window.onclick = function (event) {
        if (event.target === document.getElementById("settingsModal")) {
            dismissSettingsModal();
        }
    }
    const saveButton = document.getElementById("saveButton");
    saveButton.onclick = function () {
        setSettings();
        dismissSettingsModal();
        location.reload();
    }
    const restoreButton = document.getElementById("restoreButton");
    restoreButton.onclick = function () {
        initGMStorage(true);
        dismissSettingsModal();
        location.reload();
    }
}

function insertSettingsModalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
         .modal {
            font-family: var(--bs-font-sans-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            -webkit-text-size-adjust: 100%;
            display: none;
            position: fixed;
            z-index: 1060;
            padding-top: 100px;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            outline: 0;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 450px;
            pointer-events: auto;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.2);
            border-radius: .3rem;
            outline: 0;
            margin: auto;
            -webkit-animation-name: animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: animatetop;
            animation-duration: 0.4s
        }
        .modal-header {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1rem;
            border-bottom: 1px solid #dee2e6;
            border-top-left-radius: calc(.3rem - 1px);
            border-top-right-radius: calc(.3rem - 1px);
        }
        .modal-body {
            position: relative;
            flex: 1 1 auto;
            padding: 1rem;
        }
        .modal-footer {
            display: flex;
            flex-wrap: wrap;
            flex-shrink: 0;
            align-items: center;
            justify-content: flex-end;
            padding: .75rem;
            border-top: 1px solid #dee2e6;
            border-bottom-right-radius: calc(.3rem - 1px);
            border-bottom-left-radius: calc(.3rem - 1px);
        }
        .modal-footer > * {
            margin: .25rem;
        }
        @-webkit-keyframes animatetop {
          from {top:-300px; opacity:0} 
          to {top:0; opacity:1}
        }
        @keyframes animatetop {
          from {top:-300px; opacity:0}
          to {top:0; opacity:1}
        }
        #close {
          color: grey;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        #close:hover,
        #close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
        #restoreButton {
            margin-right: auto;
        }
        #linkColorLabel {
            margin: .4rem;
        }
        .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            margin-bottom: .5rem;
            font-weight: 500;
            line-height: 1.2;
        }
        .h5, h5 {
            font-size: 1.25rem;
        }
        .h6, h6 {
            font-size: 1rem;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            text-align: center;
            text-decoration: none;
            vertical-align: middle;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .btn-outline-primary {
            color: #007bff;
            background-color: transparent;
            background-image: none;
            border-color: #007bff;
        }
        .btn-outline-primary:hover {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-outline-secondary {
            color: #6c757d;
            background-color: transparent;
            background-image: none;
            border-color: #6c757d;
        }
        .btn-outline-secondary:hover {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
        .form-check-input:checked[type="radio"] {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e");
        }
        .form-check {
            display: block;
            min-height: 1.5rem;
            padding-left: 1.5em;
            margin-bottom: .125rem;
        }
        .form-check-inline {
            display: inline-block;
            margin-right: 1rem;
        }
        .form-check-input:checked {
            background-color: #0d6efd;
            border-color: #0d6efd;
        }
        .form-check-input[type="radio"] {
            border-radius: 50%;
        }
        .form-check .form-check-input {
            float: left;
            margin-left: -1.5em;
        }
        .form-check-input {
            width: 1em;
            height: 1em;
            margin-top: .25em;
            vertical-align: top;
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            border: 1px solid rgba(0,0,0,.25);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
        }
        #contrastValue {
            display: inline-block;
            width: 50px;
            padding: .375rem .75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .label {
            display: inline-block;
        }
    `
    document.head.appendChild(style);
}
