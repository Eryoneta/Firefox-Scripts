// ==UserScript==
// @name           Menu-Popups: Show Scrollbar
// @version        1.0.0
// @include        chrome://browser/content/browser.xhtml
// @long-description
// @description
/*
	- Based on https://github.com/Merci-chao/userChrome.js/blob/main/showScrollbarInMenus.uc.js
	- Adds a scrollbar into popup menus
	- Good to tell the actual size of the thing without having to scroll to the end
*/
// ==/UserScript==

(function() {

	// Adds a scrollbar when a popup is loaded
	document.addEventListener("popupshowing", ({target}) => { // When a popup shows
		if(!target.matches("menupopup")) return; // Ignores non-popup-menus
		let box = target.shadowRoot.querySelector(".menupopup-arrowscrollbox");
		if(box && !box.dataset["noarrow"]) {
			let innerbox = box.shadowRoot.querySelector("scrollbox");
			innerbox.style.setProperty("overflow-y", "auto", "important"); // Shows scrollbar
			innerbox.style.setProperty("scrollbar-color", "currentColor", "transparent"); // Thumb and buttons visible and track transparent
			innerbox.style.setProperty("scrollbar-width", "thin"); // Thin width
			innerbox.style.setProperty("scrollbar-gutter", "auto"); // Adds extra-width to show the scrollbar only when needed
		}
	}, true);

})();
