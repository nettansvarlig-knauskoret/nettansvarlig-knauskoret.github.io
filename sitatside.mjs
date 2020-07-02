import {handleAuth, handleSignOut, alertError} from "./modules/auth.mjs";
import {QUOTEJSONID, PRJCTFLDRID} from "./modules/constants.mjs";

import * as QDOMI from "./modules/QDOMI.mjs";
import * as QGDI from "./modules/QGDI.mjs";
import { Quote } from "./modules/quote.mjs";

let accessToken; //Brukes av appendJsonQuote under, må være global
const quoteContainer = document.querySelector("#quoteContainer"); //Brukes av onAccept, er tydeligere å ha den her oppe

function onAccept() {
	accessToken = gapi.auth.getToken().access_token; 
	//QGDI.makeJsonQuoteFile(PRJCTFLDRID, "sitater.json", accessToken).then(console.log);
	QDOMI.displayJsonQuotes(quoteContainer, QUOTEJSONID, accessToken)
	.catch(err => {
		console.error(err);
		alertError(err, "displayJsonQuotes in sitatside.html onAccept");
	});
}

function onDenial() {
	console.log("Permission rejected; redirecting to index.html.");
	location.replace("index.html");
}

window.onload = function() {
	handleAuth(onAccept, onDenial);
}; 

//---------------------------------------------------------

const signOutSpan = document.querySelector("#signOutSpan");
const toTopSpan = document.querySelector("#toTopSpan");
const toBottomSpan = document.querySelector("#toBottomSpan");

const details = document.querySelector("details");
const summary = document.querySelector("summary");

const quoteForm = document.querySelector("#quoteForm");
const quoteTextInput = document.querySelector("#quoteTextInput");
const metaInfoInput = document.querySelector("#metaInfoInput");
const quoteeInput = document.querySelector("#quoteeInput");
const ddmmyyyyInput = document.querySelector("#ddmmyyyyInput");

signOutSpan.onclick = handleSignOut; 

//Få details-elementet til å lukkes når man klikker utenfor.
//Merk at dette er helt separat fra åpningen og lukkingen som skjer når man trykker på "Send sitat"! Den er innebygd i details-elementet.
summary.onclick = function() {
	let wasClosed = !details.open; //summary.onclick kjøres før details.open endrer seg.
	let removeListeners = function() {
		document.removeEventListener("click", closeFormAndRemoveListeners); 
		summary.removeEventListener("click", removeListeners);
		details.removeEventListener("click", function(e) { e.stopPropagation(); });
	};
	let closeFormAndRemoveListeners = function() {
		details.open = false;
		removeListeners();
	};

	if (wasClosed) {
		document.addEventListener("click", closeFormAndRemoveListeners);
		summary.addEventListener("click", removeListeners);
		details.addEventListener("click", function(e) { e.stopPropagation(); });
	}
}

//Kunne valgt å gjøre navigeringsknappene synlige/usynlige basert på plassering: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
toTopSpan.onclick = function() {
	scrollTo(0, -document.body.scrollHeight);
}
toBottomSpan.onclick = function() {
	scrollTo(0, document.body.scrollHeight);
}

quoteForm.onsubmit = async function(e) {
	e.preventDefault();
	let quoteText = quoteTextInput.value;
	let metaInfo = metaInfoInput.value;
	let quotee = quoteeInput.value;
	let yyyymmdd = ddmmyyyyInput.value.split("-");

	//Stoppe "undefined":
	let dd = yyyymmdd[2] ? yyyymmdd[2] : "";
	let mm = yyyymmdd[1] ? yyyymmdd[1] : "";
	let yyyy = yyyymmdd[0] ? yyyymmdd[0] : "";

	let newQuote = new Quote(quoteText, metaInfo, quotee, dd, mm, yyyy);
	if (newQuote.isValid()) {
		await QGDI.appendJsonQuote(newQuote, QUOTEJSONID, accessToken)
		.catch(err => {
			console.error(err);
			alertError(err, "appendJsonQuote in quoteForm.onsubmit");
		}); 
		quoteForm.reset();
		setTimeout(location.reload.bind(location), 3000); //Må bruke "bind" pga "this" skal peke på det rette i reload-funksjonen
		console.log("Page reload scheduled in 3 seconds."); 
	}
	else {
		alert("Ugyldig sitat, prøv på nytt.")
	}
}