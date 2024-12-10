// ==UserScript==
// @name           Edit Bookmark: Dinamic Recent Folders
// @include        chrome://browser/content/browser.xhtml
// @long-description
// @description
/*
	- By default, recent folders area added to the list exactly whe the edit bookmark popup is closed (And the folder is selected to be used)
		- That is... inconvenient. The list should be updated with the creation or modification of folders as well
*/

// WIP
// @version        0.0.0
// @ignorecache

// ==/UserScript==


// const oldNewFolder = gEditItemOverlay.newFolder;
// gEditItemOverlay.newFolder = async () => {
// 	oldNewFolder();
// 	alert("Ah!");
// 	console.log("DONE????");
// };
// console.log(gEditItemOverlay);

(function() {
	// TODO
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