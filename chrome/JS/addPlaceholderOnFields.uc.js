// ==UserScript==
// @name           (Browser|Places)/Edit-Bookmark: Fields Placeholder
// @version        1.0.0
// @include        chrome://browser/content/browser.xhtml
// @include        chrome://browser/content/places/places.xhtml
// @include        chrome://browser/content/places/bookmarkProperties.xhtml
// @long-description
/*
	- Adds a text inside the text fields of "Name", "Location", "Keyword", and "Tags"
		- It can't be easily done with CSS as it requires to add a element property
	- It's useful if the labels are removed with CSS
*/
// ==/UserScript==

(function() {
	// Vars
	const NAME_FIELD_TEXT = "Nome";
	const LOCATION_FIELD_TEXT = "Endereço";
	const KEYWORD_FIELD_TEXT = "Palavra-chave para abrir favoritos da barra de endereços";
	const TAG_FIELD_TEXT = "Etiquetas, separadas por vírgula";

	// Name
	let nameFieldElem = document.getElementById("editBMPanel_namePicker");
	if(nameFieldElem) nameFieldElem.setAttribute("placeholder", NAME_FIELD_TEXT);

	// Location
	let locationFieldElem = document.getElementById("editBMPanel_locationField");
	if(locationFieldElem) locationFieldElem.setAttribute("placeholder", LOCATION_FIELD_TEXT);

	// Keywords
	let keywordsFieldElem = document.getElementById("editBMPanel_keywordField");
	if(keywordsFieldElem) keywordsFieldElem.setAttribute("placeholder", KEYWORD_FIELD_TEXT);

	// Tags
	let tagsFieldElem = document.getElementById("editBMPanel_tagsField");
	if(tagsFieldElem) tagsFieldElem.setAttribute("placeholder", TAG_FIELD_TEXT);

})();