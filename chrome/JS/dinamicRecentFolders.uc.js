// ==UserScript==
// @name           Bookmarks: Teste
// @version        1.0
// @long-description
// @description
/*
	Teste
*/
// @include        chrome://browser/content/browser.xhtml
// ==/UserScript==


// const oldNewFolder = gEditItemOverlay.newFolder;
// gEditItemOverlay.newFolder = async () => {
// 	oldNewFolder();
// 	alert("Ah!");
// 	console.log("DONE????");
// };
// console.log(gEditItemOverlay);

(function() {
	return;
	
	PlacesUIUtils.oldShowBookmarkDialog = PlacesUIUtils.showBookmarkDialog;
	PlacesUIUtils.showBookmarkDialog = async (aInfo, aParentWindow = null) => {
		console.log("HA!");
		PlacesUIUtils.oldShowBookmarkDialog(aInfo, aParentWindow);
		setTimeout(() => {
			const bookmarkPropertiesDialog = document.getElementById("bookmarkproperties");
			if(bookmarkPropertiesDialog) {
				let scriptElem = document.createElement("script");
				scriptElem.innerHTML = ```
					const oldNewFolder = gEditItemOverlay.newFolder;
					gEditItemOverlay.newFolder = async () => {
						oldNewFolder();
						alert("Ah!");
						console.log("DONE????");
					};
					console.log(gEditItemOverlay);
				```;
				bookmarkPropertiesDialog.appendChild(scriptElem);
			}
			console.log("HUM");
			console.log(bookmarkPropertiesDialog);
		}, 8000);
		console.log("HO!");
	};

	// const tabContainer = document.getElementById("placesContext_new:folder");

})();