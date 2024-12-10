// ==UserScript==
// @name           App-Menu: Toggle ExportHTML
// @version        1.0.0
// @include        chrome://browser/content/browser.xhtml
// @long-description
// @description
/*
	- Adds a button into the main menu. It allows to toggle the HTML export of bookmarks
		- It's necessary to have "browser.bookmarks.file" configured in "about:config"
		- The script merely toggles "browser.bookmarks.autoExportHTML"
	- It's useful if you need to restart the browser a bunch of times (To test scripts, for example)
		- Note: The option only takes effect after a restart! If the option is on, then the export will be executed on exit
*/
// ==/UserScript==

(function() {

	// Button label
	ON_LABEL = "Desativar Auto-ExportHTML";
	OFF_LABEL = "Ativar Auto-ExportHTML";
	function getLabel() {
		let autoExportHTML = Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
		if(autoExportHTML) {
			return ON_LABEL;
		} else return OFF_LABEL;
	}

	// Toggle button
	async function createButton() {
		const { mainView } = PanelUI;
		const doc = mainView.ownerDocument;
		const toggleAutoExportHTMLButton = doc.createXULElement("toolbarbutton");
		for (const [key, val] of Object.entries({
			id: "appMenu-toggle-exportHTML",
			class: "subviewbutton",
			label: getLabel(),
			oncommand: `
				// Toggles the option
				let autoExportHTML = !Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
				Services.prefs.setBoolPref("browser.bookmarks.autoExportHTML", autoExportHTML);
				// Updates button label
				const { mainView } = PanelUI;
				const doc = mainView.ownerDocument;
				const toggleAutoExportHTMLButton = doc.getElementById("appMenu-toggle-exportHTML");
				if(autoExportHTML) {
					toggleAutoExportHTMLButton.setAttribute("label", "Desativar Auto-ExportHTML");
				} else toggleAutoExportHTMLButton.setAttribute("label", "Ativar Auto-ExportHTML");
			`,
		})) {
			toggleAutoExportHTMLButton.setAttribute(key, val);
		}
		const settingsButton = (
			doc.getElementById("appMenu-settings-button") ??
			doc.getElementById("appMenu-preferences-button")
		);
		settingsButton.after(toggleAutoExportHTMLButton); // Adds the button after "Settings" or "Preferences"
	}

	// Adds the button into the menu
	function init() {
		PanelMultiView.getViewNode(document, "appMenu-multiView").addEventListener(
			"ViewShowing",
			createButton,
			{ once: true }
		);
	}

	// Run
	if(gBrowserInit.delayedStartupFinished) {
	  init();
	} else {
		let delayedListener = (subject, topic) => {
			if (topic == "browser-delayed-startup-finished" && subject == window) {
				Services.obs.removeObserver(delayedListener, topic);
				init();
			}
		};
		Services.obs.addObserver(
			delayedListener,
			"browser-delayed-startup-finished"
		);
	}

})();