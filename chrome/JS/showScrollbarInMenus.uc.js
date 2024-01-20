// ==UserScript==
// @name           Menus: Show Scrollbar
// @version        1.0
// @description    Baseado em: https://github.com/Merci-chao/userChrome.js/blob/main/showScrollbarInMenus.uc.js
// @include        chrome://browser/content/browser.xhtml
// ==/UserScript==

(function() {
	addEventListener("popupshowing", ({target}) => {
		if(!target.matches("menupopup")) return;
		let box = target.shadowRoot.querySelector(".menupopup-arrowscrollbox");
		if(box && !box.dataset["noarrow"]) {
			let innerbox = box.shadowRoot.querySelector("scrollbox");
			innerbox.style.setProperty("overflow-y", "auto", "important");
			innerbox.style.setProperty("scrollbar-color", "currentColor", "transparent");
			innerbox.style.setProperty("scrollbar-width", "thin");
			innerbox.style.setProperty("scrollbar-gutter", "auto");
		}
	}, true);
})();
