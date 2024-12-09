// ==UserScript==
// @name           Tabs: MultiRowTabs
// @version        1.0
// @long-description
// @description
/*
	Baseado em: https://github.com/Izheil/Quantum-Nox-Firefox-Dark-Full-Theme/blob/master/Multirow%20and%20other%20functions/Multirow%20tabs/MultiRowTab-scrollable.uc.js
	Implementa abas em multilinhas! Abas podem ser livremente arrastadas e reordenadas!
	Ótimo para se ter várias abas abertas
*/
// @include        chrome://browser/content/browser.xhtml
// ==/UserScript==

(function() {
	// CSS
	loadCSS();
	// Vars
	const tabContainer = document.getElementById("tabbrowser-tabs");
	const browser = window._gBrowser;
	//
	// DragTab
	// Controla a aba
	let onDragOver = (event) => {
		return;
		// Impede outros eventos
		event.preventDefault();
		event.stopPropagation();
		// Drag
		let indicator = tabContainer._tabDropIndicator;
		let effects = getDropEffectForTabDrag(event);
		if(effects == "" || effects == "none") {
			indicator.hidden = true;
			return; // Não ocorre nada
		}
		let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
		if(
			(effects == "move" || effects == "copy") &&
			tabContainer == draggedTab.container &&
			!draggedTab._dragData.fromTabList
		) {
			indicator.hidden = true; // Não é link
			if(!tabContainer._isGroupTabsAnimationOver()) {
				return;
			}
			tabContainer._finishGroupSelectedTabs(draggedTab);
			if(effects == "move") {
				animateTabMove(tabContainer, event); // Anima as abas!
				return;
			}
		}
		tabContainer._finishAnimateTabMove();
	};
	tabContainer.addEventListener("dragover", onDragOver, true);
	//
	// DropTab
	// Posiciona a aba
	let onDrop = (event) => {
		//TODO: Quando a aba é solta
	};
	tabContainer.addEventListener("drop", onDrop, true);
	//
	// NewTabButton
	// Marca o botão-nova-aba para ser estilizado
	let onTabOperation = () => {
		setTimeout(() => {
			const tabsHeight = tabContainer.clientHeight;
			const tabHeight = tabContainer.getElementsByClassName("tabbrowser-tab")[0].clientHeight;
			let newTabButton = document.getElementById("tabs-newtab-button");
			if(tabsHeight > tabHeight) { // É multirow
				newTabButton.setAttribute("multirow", "");
			} else newTabButton.removeAttribute("multirow");
		}, 50); // Delay para esperar container atualizar tamanho
	}
	tabContainer.addEventListener("TabOpen", onTabOperation, false);
	tabContainer.addEventListener("TabClose", onTabOperation, false);
	
	// console.log(tabContainer);
	
	return;
	
	// MultiRowTab-DropNewTab
	// Controla o indicador de onde a nova aba é aberta
	tabContainer._getDropIndex = (event, isLink) => {
		let tabs = document.getElementsByClassName("tabbrowser-tab");
		let tab = tabContainer._getDragTargetTab(event, isLink);
		let leftToRight = (window.getComputedStyle(tabContainer).direction == "ltr");
		if(leftToRight) {
			for(let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
				let rect = tabs[i].getBoundingClientRect();
				if(event.clientX < rect.x + rect.width / 2 && event.clientY < rect.y + rect.height) {
					return i;
				}
			}
		} else {
			for(let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
				let rect = tabs[i].getBoundingClientRect();
				if(event.clientX > rect.x + rect.width / 2 && event.clientY < rect.y + rect.height) {
					return i;
				}
			}
		}
		return tabs.length;
	};
	tabContainer.addEventListener("TabOpen", scrollToView, false);
	tabContainer.addEventListener("TabSelect", scrollToView, false);
	document.addEventListener("SSTabRestoring", scrollToView, false);
	document.addEventListener("fullscreenchange", checkFullScreenScrolling, false);
	// NewTabButton
	// Marca o botão-nova-aba para ser estilizada
	let tabOpen = () => {
		const tabsHeight = tabContainer.clientHeight;
		const tabHeight = tabContainer.getElementsByClassName("tabbrowser-tab")[0].clientHeight;
		if(tabsHeight > tabHeight) { // É multirow
			let newTabButton = document.getElementById("tabs-newtab-button");
			newTabButton.setAttribute("multirow", "");
		}
	}
	tabContainer.addEventListener("TabOpen", tabOpen, false);
	// MultiRowTab-DragTab
	// Controla a aba quando arrastada
	let hasListeners = false;
	tabContainer.ondragstart = () => {
		const tabsHeight = tabContainer.clientHeight;
		const tabHeight = tabContainer.getElementsByClassName("tabbrowser-tab")[0].clientHeight;
		if(tabsHeight > tabHeight) { // É multirow
			browser.visibleTabs.forEach((t) => t.style.transform && "");
			let tab = tabContainer._getDragTargetTab(event, false);
			let selectedTabs = browser.selectedTabs;
			while(selectedTabs.length) {
				let t = selectedTabs.pop();
				if(t._tPos > tab._tPos) {
					browser.moveTabTo(t, tab._tPos + 1);
				} else if(t == tab) {
					selectedTabs.reverse();
				} else if (t._tPos < tab._tPos) {
					browser.moveTabTo(t, tab._tPos - 1);
				}
			}
			tabContainer._onDragOver = (event) => {
				event.preventDefault();
				event.stopPropagation();
				let ind = tabContainer._tabDropIndicator;
				let effects = getDropEffectForTabDrag(event);
				if(effects == "" || effects == "none") {
					ind.hidden = true;
					return;
				}

				let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
				if(
					(effects == "move" || effects == "copy") &&
					tabContainer == draggedTab.container &&
					!draggedTab._dragData.fromTabList
				) {
					ind.hidden = true;
					if(!tabContainer._isGroupTabsAnimationOver()) {
						return;
					}
					tabContainer._finishGroupSelectedTabs(draggedTab);
					if(effects == "move") {
						animateTabMove(tabContainer, event);
						return;
					}
				}
				tabContainer._finishAnimateTabMove();
				if(effects == "link") {
					let tab = tabContainer._getDragTargetTab(event, true);
					if(tab) {
						if(!tabContainer._dragTime) {
							tabContainer._dragTime = Date.now();
						}
						if(!tab.hasAttribute("pendingicon") && Date.now() >= this._dragTime + this._dragOverDelay) {
							tabContainer.selectedItem = tab;
						}
						ind.hidden = true;
						return;
					}
				}
				let newIndex = tabContainer._getDropIndex(event, effects == "link");
				if(newIndex == null) return;
				let tabs = document.getElementsByClassName("tabbrowser-tab");
				let leftToRight = (window.getComputedStyle(tabContainer).direction == "ltr");
				let rect = tabContainer.arrowScrollbox.getBoundingClientRect();
				let newMarginX, newMarginY;
				if(newIndex == tabs.length) {
					let tabRect = tabs[newIndex - 1].getBoundingClientRect();
					if(leftToRight) {
						newMarginX = tabRect.right - rect.left;
					} else {
						newMarginX = rect.right - tabRect.left;
					}
					newMarginY = tabRect.top + tabRect.height - rect.top - rect.height;
					if(CSS.supports("offset-anchor", "left bottom")) {
						newMarginY += rect.height / 2 - tabRect.height / 2;
					}
				} else if(newIndex != null || newIndex != 0) {
					let tabRect = tabs[newIndex].getBoundingClientRect();
					if(leftToRight) {
						newMarginX = tabRect.left - rect.left;
					} else {
						newMarginX = rect.right - tabRect.right;
					}
					newMarginY = tabRect.top + tabRect.height - rect.top - rect.height;
					if(CSS.supports("offset-anchor", "left bottom")) {
						newMarginY += rect.height / 2 - tabRect.height / 2;
					}
				}
				newMarginX += ind.clientWidth / 2;
				if(!leftToRight) {
					newMarginX *= -1;
				}
				ind.hidden = false;
				ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)";
				ind.style.marginInlineStart = (-ind.clientWidth) + "px";
			};
			tabContainer.onDrop = (event) => {
				let newIndex;
				let dataTransfer = event.dataTransfer;
				let dropEffect = dataTransfer.dropEffect;
				let draggedTab;
				let movingTabs;
				if(dataTransfer.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
					draggedTab = dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
					if(!draggedTab) {
						return;
					}
					movingTabs = draggedTab._dragData.movingTabs;
					draggedTab.container._finishGroupSelectedTabs(draggedTab);
				}
				if(draggedTab && dropEffect == "copy") {

				}
				else if(draggedTab && draggedTab.container == tabContainer) {
					newIndex = tabContainer._getDropIndex(event, false);
					let selectedTabs = browser.selectedTabs;
					if(newIndex > selectedTabs[selectedTabs.length - 1]._tPos + 1) {
						newIndex--;
					} else if (newIndex >= selectedTabs[0]._tPos) {
						newIndex = -1;
					} else {
						selectedTabs.reverse();
					}
					if (newIndex > -1) {
						selectedTabs.forEach(t => browser.moveTabTo(t, newIndex));
					}
				}
			};
			if(hasListeners == false) {
				tabContainer.addEventListener("dragover", tabContainer._onDragOver, true);
				tabContainer.addEventListener("drop", (event) => {
					tabContainer.onDrop(event);
				}, true);
				hasListeners = true;
			}
		}
	};
})();

function loadCSS() {
	let css =`
		/* Window: Multi-Row Tabs */
		/* Conveniente em pesquisas */
		/* Baseado em: https://github.com/MrOtherGuy/firefox-csshacks/tree/master/chrome/multi-row_tabs.css */
		:root {
			--multirow-n-rows: 3;           /* Rows antes de ter scroll */
			--multirow-tab-min-width: 32px; /* Tamanho mínimo das tabs */
		}
		#tabbrowser-tabs {
			min-height: unset !important;
			padding-inline-start: 0px !important;
		}
		@-moz-document url(chrome://browser/content/browser.xhtml) {
			#scrollbutton-up~spacer, #scrollbutton-up, #scrollbutton-down {
				display: var(--scrollbutton-display-model, initial);
			}
			scrollbox[part][orient = "horizontal"] {
				display: flex;
				flex-wrap: wrap;
				overflow-y: auto;
				max-height: calc((var(--tab-min-height) + 2 * var(--tab-block-margin, 0px)) * var(--multirow-n-rows));
				scrollbar-color: currentColor transparent;
				scrollbar-width: thin;
				scrollbar-gutter: auto;
				scroll-snap-type: y mandatory;
			}
			scrollbox[part][orient = "horizontal"] scrollbar[orient = "vertical"] {
				-moz-window-dragging: no-drag !important; /* Permite usar scrollbar sem arrastar a janela */
			}
		}
		.scrollbox-clip[orient = "horizontal"], #tabbrowser-arrowscrollbox {
			overflow: -moz-hidden-unscrollable;
			display: inline;
			--scrollbutton-display-model: none;
		}
		#tabbrowser-tabs .tabbrowser-tab {
			scroll-snap-align: start;
		}
		#tabbrowser-tabs .tabbrowser-tab[pinned] {
			position: static !important;
			margin-inline-start: 0px !important;
		}
		#tabbrowser-tabs .tabbrowser-tab[fadein]:not([pinned]) {
			min-width: var(--multirow-tab-min-width) !important; /* Tamanho mínimo das abas */
			flex-grow: 1 !important;
		}
		#tabbrowser-tabs .tabbrowser-tab > stack {
			width: 100%;
			height: 100%;
		}
		#tabs-newtab-button {   /* Alinha o botão-nova-aba com as abas */
			height: 32px !important;
			padding-top: 4px !important;
			margin-bottom: 5px !important;
		}
		#tabbrowser-tabs[hasadjacentnewtabbutton][overflow] > #tabbrowser-arrowscrollbox > #tabbrowser-arrowscrollbox-periphery > #tabs-newtab-button {
			display: flex !important;
		}
		
		/*
		#alltabs-button, 
		*/
		:root:not([customizing]) #TabsToolbar #new-tab-button, #tabbrowser-arrowscrollbox > spacer, .tabbrowser-tab::after {
			display: none !important;
		}
		
		#tabbrowser-tabs .tabbrowser-tab[fadein]:not([pinned]) {
			width: 220px !important; /* Tamanho normal das abas */
		}
		#tabbrowser-arrowscrollbox-periphery:has(#tabs-newtab-button[multirow]) { /* Custom prop(multirow)! */
			margin-left: auto !important;
		}
		#tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]) > #tabbrowser-arrowscrollbox > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
			margin-inline-start: 0px !important; /* Remove o espaço entre abas normais e abas fixas */
		}
	`;
	let sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
	let uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
}

// Anima as abas arrastadas
function animateTabMove(tabContainer, event) {
	// Vars
	let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
	let movingTabs = draggedTab._dragData.movingTabs;
	//
	// Anima a aba selecionada
	//   Atualiza propriedades(CSS)
	if(!tabContainer.hasAttribute("movingtab")) {
		tabContainer.toggleAttribute("movingtab", true);
		gNavToolbox.toggleAttribute("movingtab", true);
		if(!draggedTab.multiselected) {
			tabContainer.selectedItem = draggedTab;
		}
	}
	//   Cria vars para lembrar a última posição
	if(!("screenX" in draggedTab._dragData)) draggedTab._dragData.screenX = event.screenX;
	if(!("screenY" in draggedTab._dragData)) draggedTab._dragData.screenY = event.screenY;
	if(!("scrollX" in draggedTab._dragData)) draggedTab._dragData.scrollX = tabContainer.arrowScrollbox.scrollbox.scrollLeft;
	if(!("scrollY" in draggedTab._dragData)) draggedTab._dragData.scrollY = tabContainer.arrowScrollbox.scrollbox.scrollTop;
	if(!("animLastScreenX" in draggedTab._dragData)) draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;
	if(!("animLastScreenY" in draggedTab._dragData)) draggedTab._dragData.animLastScreenY = draggedTab._dragData.screenY;
	//   XY
	let screenX = event.screenX;
	let screenY = event.screenY;
	if(screenX == draggedTab._dragData.animLastScreenX && screenY == draggedTab._dragData.animLastScreenY) {
		return; // Se não moveu, não faz nada
	}
	//   Direção do arraste
	let movingToRight = (screenX > draggedTab._dragData.animLastScreenX);
	let movingToBottom = (screenY > draggedTab._dragData.animLastScreenY);
	draggedTab._dragData.animLastScreenX = screenX;
	draggedTab._dragData.animLastScreenY = screenY;
	//   Abas
	let tabs = tabContainer._getVisibleTabs();
	//   Direção da interface
	if (RTL_UI) {
		tabs.reverse();
		movingTabs = [...movingTabs].reverse();
	}
	//   Tamanho das abas selecionadas
	let tabWidth = draggedTab.getBoundingClientRect().width;
	let tabHeight = draggedTab.getBoundingClientRect().height;
	let shiftWidth = tabWidth * movingTabs.length;
	draggedTab._dragData.tabWidth = tabWidth;
	draggedTab._dragData.tabHeight= tabHeight;
	//   Drag: Abas
	let firstTab = tabs[0];
	let lastTab = tabs[tabs.length - 1];
	let firstMovingTabScreenX = movingTabs[0].screenX;
	let firstMovingTabScreenY = movingTabs[0].screenY;
	let lastMovingTabScreenX = movingTabs[movingTabs.length - 1].screenX;
	let lastMovingTabScreenY = movingTabs[movingTabs.length - 1].screenY;
	//   Drag: Posição
	let translateX = screenX - draggedTab._dragData.screenX;
	let translateY = screenY - draggedTab._dragData.screenY;
	translateX += tabContainer.arrowScrollbox.scrollbox.scrollLeft - draggedTab._dragData.scrollX;
	translateY += tabContainer.arrowScrollbox.scrollbox.scrollTop - draggedTab._dragData.scrollY;
	//   Drag: Limites para o arraste
	let upTab = findTabAtBound(tabs, "screenY", true);
	let leftTab = findTabAtBound(tabs, "screenX", true);
	let rightTab = findTabAtBound(tabs, "screenX", false);
	let bottomTab = findTabAtBound(tabs, "screenY", false);
//TODO: Otimizar!
	let upBound = upTab.screenY - firstMovingTabScreenY;
	let leftBound = leftTab.screenX - firstMovingTabScreenX;
	let rightBound = rightTab.screenX + rightTab.getBoundingClientRect().width - (lastMovingTabScreenX + tabWidth);
	let bottomBound = bottomTab.screenY + bottomTab.getBoundingClientRect().height - (lastMovingTabScreenY + tabHeight);
	translateX = Math.min(Math.max(translateX, leftBound), rightBound);
	translateY = Math.min(Math.max(translateY, upBound), bottomBound);
	//   Drag!
	for(let tab of movingTabs) {
		tab.style.transform = `translate(${translateX}px, ${translateY}px)`; // Move a aba com o cursor
	}
	draggedTab._dragData.translateX = translateX;
	draggedTab._dragData.translateY = translateY;
	function findTabAtBound(tabs = [], varToCompare, smallest = false, lowerIndex = 0, upperIndex = tabs.length - 1, lastIndex = -1) {
		if(!tabs) return -1;
		let midIndex = Math.round((lowerIndex + upperIndex) / 2);
		let isLastCheck = (midIndex == lowerIndex || midIndex == upperIndex);
		if(lastIndex == -1) lastIndex = midIndex;
		if(smallest) {
			if(tabs[midIndex][varToCompare] <= tabs[lastIndex][varToCompare]) {
				upperIndex = midIndex;
				lastIndex = midIndex;
			}
			if(tabs[midIndex][varToCompare] > tabs[lastIndex][varToCompare]) {
				lowerIndex = midIndex;
			}
		} else {
			if(tabs[midIndex][varToCompare] >= tabs[lastIndex][varToCompare]) {
				lowerIndex = midIndex;
				lastIndex = midIndex;
			}
			if(tabs[midIndex][varToCompare] < tabs[lastIndex][varToCompare]) {
				upperIndex = midIndex;
			}
		}
		if(isLastCheck) return tabs[lastIndex];
		return findTabAtBound(tabs, varToCompare, smallest, lowerIndex, upperIndex, lastIndex);
	}
	//
	// Anima as outras abas
	tabs = tabs.filter(tab => !movingTabs.includes(tab) || tab == draggedTab); // Desconsidera abas selecionadas
	let leftTabCenter = firstMovingTabScreenX + translateX + tabWidth / 2;
	let rightTabCenter = lastMovingTabScreenX + translateX + tabWidth / 2;
	let tabCenterX = (movingToRight ? rightTabCenter : leftTabCenter);
	let tabCenterY = firstMovingTabScreenY + translateY + tabHeight / 2;
	let newIndex = -1;
	let oldIndex = ("animDropIndex" in draggedTab._dragData ? draggedTab._dragData.animDropIndex : movingTabs[0]._tPos);
	//TODO: Animação das abas!
	let low = 0;
	let high = tabs.length - 1;
	while(low <= high) {
		let mid = Math.round((low + high) / 2);
		if(tabs[mid] == draggedTab && ++mid > high) {
			break;
		}
		screenX = tabs[mid].screenX + getTabShift(tabs[mid], oldIndex);
		screenY = tabs[mid].screenY + getTabShift(tabs[mid], oldIndex);
		if(screenX > tabCenterX) {
			high = mid - 1;
		} else if(screenX + tabs[mid].getBoundingClientRect().width < tabCenterX) {
			low = mid + 1;
		} else {
			newIndex = tabs[mid]._tPos;
			break;
		}
	}
	if(newIndex >= oldIndex) {
		newIndex++;
	}
	if(newIndex < 0 || newIndex == oldIndex) {
		return;
	}
	draggedTab._dragData.animDropIndex = newIndex;
	for(let tab of tabs) {
		if(tab != draggedTab) {
			let shift = getTabShift(tab, newIndex);
			tab.style.transform = (shift ? "translateX(" + shift + "px)" : "");
			// tab.style.transform = (shift ? `translate(${shift}px, ${0}px)` : ""); // Move a aba com o cursor
		}
	}
	function getTabShift(tab, dropIndex) {
		if(tab._tPos < draggedTab._tPos && tab._tPos >= dropIndex) {
			return (RTL_UI ? -shiftWidth : shiftWidth);
		}
		if(tab._tPos > draggedTab._tPos && tab._tPos < dropIndex) {
			return (RTL_UI ? shiftWidth : -shiftWidth);
		}
		return 0;
	}
}


function scrollToView() {
	let selTab = document.querySelectorAll(".tabbrowser-tab[selected='true']")[0];
	let wrongTab = document.querySelectorAll('.tabbrowser-tab[style^="margin-inline-start"]');
	let hiddenToolbox = document.querySelector('#navigator-toolbox[style^="margin-top"]');
	let fullScreen = document.querySelector('#main-window[sizemode="fullscreen"]');
	selTab.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
	if(wrongTab[0]) {
		for(let i = 0; i < wrongTab.length; i++) {
			wrongTab[i].removeAttribute("style");
		}
	}
	if(fullScreen && hiddenToolbox) {
		let toolboxHeight = hiddenToolbox.getBoundingClientRect().height;
		let tabsHeight = selTab.getBoundingClientRect().height;
		hiddenToolbox.style.marginTop = ((toolboxHeight + tabsHeight) * -1) + "px";
	}
}

function checkFullScreenScrolling() {
	if(!document.fullscreenElement) {
		let selTab = document.querySelector(".tabbrowser-tab[selected='true']");
		selTab.scrollIntoView();
	}
}

// Define o efeito que o item arrastado causa
function getDropEffectForTabDrag(event) {
	let dataTransfer = event.dataTransfer;
	let isMovingTabs = (dataTransfer.mozItemCount > 0);
	if(isMovingTabs) {
		for(let i = 0; i < dataTransfer.mozItemCount; i++) {
			let types = dataTransfer.mozTypesAt(0);
			if(types[0] != TAB_DROP_TYPE) {
				isMovingTabs = false; // Não são abas(Links)
				break;
			}
		}
	}
	if(isMovingTabs) {
		let sourceNode = dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
		if(
			sourceNode instanceof XULElement &&
			sourceNode.localName == "tab" &&
			sourceNode.ownerGlobal.isChromeWindow &&
			sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser" &&
			sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.container
		) {
			if(PrivateBrowsingUtils.isWindowPrivate(window) != PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal)) {
				return "none"; // Window e PrivateWindow não compartilham abas
			}
			if(window.gMultiProcessBrowser != sourceNode.ownerGlobal.gMultiProcessBrowser) {
				return "none";
			}
			return (dataTransfer.dropEffect == "copy" ? "copy" : "move");
		}
	}
	if(browserDragAndDrop.canDropLink(event)) {
		return "link";
	}
	return "none";
}