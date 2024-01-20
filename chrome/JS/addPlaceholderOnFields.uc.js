// ==UserScript==
// @name           Edit-Bookmark: Fields Placeholder
// @version        1.0
// @long-description
// @description
/*
	Adiciona texto nos campos de Name, Location, Keyword, e Tags
	Ajuda a entender o que os campos são(Sem as labels)
*/
// @include        *
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
	// Location
	let tagsFieldElem = document.getElementById("editBMPanel_tagsField");
	if(tagsFieldElem) tagsFieldElem.setAttribute("placeholder", "Etiquetas, separadas por vírgula");
})();