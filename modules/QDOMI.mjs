//QDOMI står for Quote DOM Interface

import {getJsonContent, deleteJsonQuote} from "./QGDI.mjs"; // * krever "as QGDI", som igjen gjør at Quote blir QGDI.Quote, som er ekkelt
import {alertError} from "./auth.mjs";

function displayQuote(quoteContainer, quote, quoteIndex, fileId, accessToken) {
	let quoteDiv = document.createElement('div');
	quoteDiv.classList.add("quote");

	//Deklarere elementene
	let quoteTextSpan = document.createElement('span');
	let quoteDeleteSpan = document.createElement('span'); 
	let quoteeMetaSpan = document.createElement('span'); //Én span for både metainfo og quotee
	let quoteDateSpan = document.createElement('span');

	//Gir dem klasser så de kan styles
	quoteTextSpan.classList.add("quoteText");
	quoteDeleteSpan.classList.add("quoteDeleteSpan");
	quoteeMetaSpan.classList.add("quoteeMeta");
	quoteDateSpan.classList.add("quoteDate");

	//Gi dem innhold
	quoteTextSpan.textContent = `\"${quote.quoteText}\"`; 

	quoteDeleteSpan.classList.add("fas");
	quoteDeleteSpan.classList.add("fa-trash");
	quoteDeleteSpan.onclick = async function() {
		if (confirm("Er du sikker på at du vil slette dette sitatet?")) {
			await deleteJsonQuote(quoteIndex, fileId, accessToken)
			.catch(err => {
				console.error(err);
				alertError(err, "deleteJsonQuote in quoteDeleteSpan.onclick");
			}); 
			console.log("Reloading page."); 
			location.reload(); 
		}
	} 

	let quoteeMeta = "";
	if (quote.quotee === "") {quoteeMeta += "- Anonym";}
	else {quoteeMeta += "- " + quote.quotee}
	if (quote.metaInfo !== "") {quoteeMeta += ", " + quote.metaInfo;}
	quoteeMetaSpan.textContent = quoteeMeta;

	let quoteDate = "";
	if (quote.dd === "") {quoteDate += "xx";}
	else {quoteDate += quote.dd;} 
	quoteDate += ".";
	if (quote.mm === "") {quoteDate += "xx";}
	else {quoteDate += quote.mm;} 
	quoteDate += ".";
	if (quote.yyyy === "") {quoteDate += "xxxx";}
	else {quoteDate += quote.yyyy;} 
	quoteDateSpan.textContent = quoteDate;

	//Feste dem til quoteDiven
	quoteDiv.appendChild(quoteTextSpan);
	quoteDiv.appendChild(quoteDeleteSpan);
	quoteDiv.appendChild(quoteeMetaSpan);
	quoteDiv.appendChild(quoteDateSpan);

	//Feste quoteDiven til containeren
	quoteContainer.appendChild(quoteDiv);
}

function displayJsonQuotes(quoteContainer, fileId, accessToken) { 
	return getJsonContent(fileId, accessToken)
	.then(quoteArray => {
		quoteContainer.innerHTML = ""; //Fjerne eventuelle quotes fra før
		quoteContainer.classList.remove("loading"); 
		if (quoteArray.length > 0) {
			for (let i = quoteArray.length-1; i >= 0; --i) { //Viser nyeste quotes først
				displayQuote(quoteContainer, quoteArray[i], i, fileId, accessToken);
			};
		}
		else {
			quoteContainer.innerHTML = "Ingen sitater enda :(";
		}
	});
}

export {displayJsonQuotes};
