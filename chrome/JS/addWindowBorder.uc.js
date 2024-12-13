// ==UserScript==
// @name           Browser: Adds a border
// @version        1.0.0
// @include        chrome://browser/content/browser.xhtml
// @long-description
/*
	- It adds a simple window border
*/
// ==/UserScript==

(function() {

	// Window
	const mainWindow = document.getElementById("main-window");
	
	// Border
	let border = document.createElement("div");
	border.id = "main-window-border";
	border.style.left = "0px";
	border.style.right = "0px";
	border.style.top = "0px";
	border.style.bottom = "0px";
	border.style.position = "absolute";
	border.style.zIndex = "1000"; // On top
	border.style.pointerEvents = "none"; // Non-clickable
	border.style.borderStyle = "solid";
	border.style.borderWidth = "1px";
	border.style.borderTopLeftRadius = "5px"; // Aparenty, Firefox "obeys" the radius set here...?
	border.style.borderTopRightRadius = "5px";
	mainWindow.appendChild(border);

})();
