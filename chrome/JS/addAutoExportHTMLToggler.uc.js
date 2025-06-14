// ==UserScript==
// @name           Browser/Main-Menu: Toggle ExportHTML
// @version        1.0.1
// @include        chrome://browser/content/browser.xhtml
// @long-description
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
		const autoExportHTML = Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
		if(autoExportHTML) {
			return ON_LABEL;
		} else return OFF_LABEL;
	}

	// Button action
	function doAction() {
		// Toggles the option
		const autoExportHTML = Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
		Services.prefs.setBoolPref("browser.bookmarks.autoExportHTML", !autoExportHTML);
		// Updates button label
		const doc = PanelUI.mainView.ownerDocument;
		const toggleAutoExportHTMLButton = doc.getElementById("appMenu-toggle-autoExportHTML");
		toggleAutoExportHTMLButton.setAttribute("label", getLabel());
	}

	// Toggle button
	async function buildButton() {
		const doc = PanelUI.mainView.ownerDocument;
		const toggleAutoExportHTMLButton = doc.createXULElement("toolbarbutton");
		toggleAutoExportHTMLButton.setAttribute("id", "appMenu-toggle-autoExportHTML");
		toggleAutoExportHTMLButton.setAttribute("class", "subviewbutton");
		toggleAutoExportHTMLButton.setAttribute("label", getLabel());
		toggleAutoExportHTMLButton.addEventListener("command", doAction);
		// Note: For security, it cannot be a inline "oncommand"
		const settingsButton = (
			doc.getElementById("appMenu-settings-button") ?? doc.getElementById("appMenu-preferences-button")
		);
		settingsButton.after(toggleAutoExportHTMLButton); // Adds the button after "Settings" or "Preferences"
	}

	// Adds the button into the menu
	function initButton() {
		PanelMultiView.getViewNode(document, "appMenu-multiView").addEventListener(
			"ViewShowing",
			buildButton,
			{ once: true }
		);
	}

	// Run
	if(gBrowserInit.delayedStartupFinished) {
	  initButton();
	} else {
		let delayedListener = (subject, topic) => {
			if (topic == "browser-delayed-startup-finished" && subject == window) {
				Services.obs.removeObserver(delayedListener, topic);
				initButton();
			}
		};
		Services.obs.addObserver(
			delayedListener,
			"browser-delayed-startup-finished"
		);
	}

})();
