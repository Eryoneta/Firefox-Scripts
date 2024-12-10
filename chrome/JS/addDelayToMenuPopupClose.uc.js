// ==UserScript==
// @name           Popup Menus: Delayed closure
// @include        chrome://browser/content/browser.xhtml
// @long-description
// @description
/*
	- Adds a delay before closing popup menus, when dragging a bookmark
		- By default, all menus simply closes if the bookmark is dragged anywhere outside. That's really annoying!
		- By having a delay, you have a small forgiving time to drag the bookmark inside the menu without it closing on your face
*/

// WIP
// @version        0.0.0
// @ignorecache

// ==/UserScript==

(function() {
	// TODO: ...Recriar tudo...? Todo o esquema de popupOpen e popupHide...?
	return;
	
	// VARS
	let didDragOnMenu = false;
	let didDragOnPopup = false;
	let openTimer;
	let closeTimer;
	let closeDelay = 1000;
	// EVENTS
	let onPopupShowing = () => {};
	let onThisPopupHiding = () => {};
	let onDragOverMenu = () => {};
	let onDragOverThisPopup = () => {};
	// STATES
	const states = {
		"DEFAULT": () => {
			console.log("DEFAULT");
			if(openTimer) clearTimeout(openTimer);
			if(closeTimer) clearTimeout(closeTimer);
			onPopupShowing = (event) => {
				console.log("DEFAULT: onPopupShowing");
				states.loadState("POPUP_OPEN", event.target);
			};
		},
		"POPUP_OPEN": (popupElem) => {
			console.log("POPUP_OPEN");
			if(openTimer) clearTimeout(openTimer);
			if(closeTimer) clearTimeout(closeTimer);
			onDragOverMenu = () => { // Se arrastando um item
				console.log("POPUP_OPEN: onDragOverMenu");
				states.loadState("DRAGGING_OVER", popupElem);
			};
			onThisPopupHiding = () => {
				console.log("POPUP_OPEN: onThisPopupHiding");
				states.loadState("DEFAULT", popupElem);
			};
		},
		"DRAGGING_OVER": (popupElem) => {
			console.log("DRAGGING_OVER");
			let ignore = false;
			if(openTimer) clearTimeout(openTimer);
			if(closeTimer) clearTimeout(closeTimer);
			onDragOverThisPopup = () => {
				console.log("DRAGGING_OVER: onDragOverThisPopup");
				states.loadState("DEFAULT", popupElem);
			};
			onPopupShowing = (event) => {
				if(ignore) return;
				console.log("DRAGGING_OVER: onPopupShowing");
				let newPopupElem = event.target;
				// Impede de abrir
				event.preventDefault();
				event.stopPropagation();
				// Delay
				if(openTimer) clearTimeout(openTimer); // Abre apenas o último
				if(closeTimer) clearTimeout(closeTimer);
				openTimer = setTimeout(() => {
					ignore = true;
					popupElem.hidePopup();
					newPopupElem.openPopup();
					states.loadState("POPUP_OPEN", popupElem, newPopupElem);
				}, closeDelay);
			};
			onThisPopupHiding = (event) => {
				if(ignore) return;
				console.log("DRAGGING_OVER: onThisPopupHiding");
				// Impede de fechar
				event.preventDefault();
				event.stopPropagation();
				// Delay
				closeTimer = setTimeout(() => {
					ignore = true;
					popupElem.hidePopup();
					states.loadState("DEFAULT", popupElem);
				}, closeDelay);
			};
		},
		loadState: (newState, popupElem = null, newPopupElem = null) => {
			if(!newPopupElem) newPopupElem = popupElem;
			document.getElementById("PlacesToolbar").removeEventListener("popupshowing", onPopupShowing, false);
			if(popupElem) {
				let popupParent = popupElem?.parentElement;
				popupElem.removeEventListener("popuphiding", onThisPopupHiding, false);
				popupParent.removeEventListener("dragover", onDragOverMenu, false);
				popupElem.removeEventListener("dragover", onDragOverThisPopup, false);
			}
			onPopupShowing = () => {};
			onThisPopupHiding = () => {};
			onDragOverMenu = () => {};
			onDragOverThisPopup = () => {};
			states[newState](newPopupElem);
			document.getElementById("PlacesToolbar").addEventListener("popupshowing", onPopupShowing, false);
			if(newPopupElem) {
				let newPopupParent = newPopupElem?.parentElement;
				newPopupElem.addEventListener("popuphiding", onThisPopupHiding, false);
				newPopupParent.addEventListener("dragover", onDragOverMenu, false);
				newPopupElem.addEventListener("dragover", onDragOverThisPopup, false);
			}
		},
		loadListeners: () => {

		}
	};
	// RUN
	states.loadListeners();
	states.loadState("DEFAULT");
})();