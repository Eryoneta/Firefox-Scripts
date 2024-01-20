// ==UserScript==
// @name           App-Menu: Toggle ExporHTML
// @version        1.0
// @long-description
// @description
/*
	Adiciona botão para configurar export de HTML de favoritos
	Bom para não exportar desnecessariamente, com cada reinicio
*/
// ==/UserScript==

(function() {
	function getLabel() {
		let autoExportHTML = Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
		if(autoExportHTML) {
			return "Desativar Auto-ExportHTML";
		} else return "Ativar Auto-ExportHTML";
	}
	async function createButton() {
		const { mainView } = PanelUI;
		const doc = mainView.ownerDocument;
		const toggleAutoExportHTMLButton = doc.createXULElement("toolbarbutton");
		for (const [key, val] of Object.entries({
			id: "appMenu-toggle-exportHTML",
			class: "subviewbutton",
			label: getLabel(),
			oncommand: `
				let autoExportHTML = !Services.prefs.getBoolPref("browser.bookmarks.autoExportHTML");
				Services.prefs.setBoolPref("browser.bookmarks.autoExportHTML", autoExportHTML);
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
		const settingsButton =
			doc.getElementById("appMenu-settings-button") ??
			doc.getElementById("appMenu-preferences-button");
		settingsButton.after(toggleAutoExportHTMLButton);
	}
	function init() {
		PanelMultiView.getViewNode(document, "appMenu-multiView").addEventListener(
			"ViewShowing",
			createButton,
			{ once: true }
		);
	}
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