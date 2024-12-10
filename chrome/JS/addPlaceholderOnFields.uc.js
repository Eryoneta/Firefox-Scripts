// ==UserScript==
// @name           Edit-Bookmark: Fields Placeholder
// @version        1.0.0
// @include        *
// @long-description
// @description
/*
	- Adds a text inside the text fields of "Name", "Location", "Keyword", and "Tags"
	- It's useful if the labels are removed with CSS
*/
// ==/UserScript==

(function() {

	// Name
	let nameFieldElem = document.getElementById("editBMPanel_namePicker");
	if(nameFieldElem) nameFieldElem.setAttribute("placeholder", "Nome");

	// Location
	let locationFieldElem = document.getElementById("editBMPanel_locationField");
	if(locationFieldElem) locationFieldElem.setAttribute("placeholder", "Endereço");

	// Keywords
	let keywordsFieldElem = document.getElementById("editBMPanel_keywordField");
	if(keywordsFieldElem) {
		keywordsFieldElem.setAttribute("placeholder", "Palavra-chave para abrir favoritos da barra de endereços");
		keywordsFieldElem.setAttribute("style", "margin-top: 10px !important"); // Apenas style funciona
	}

	// Tags
	let tagsFieldElem = document.getElementById("editBMPanel_tagsField");
	if(tagsFieldElem) tagsFieldElem.setAttribute("placeholder", "Etiquetas, separadas por vírgula");

})();