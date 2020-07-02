
function Quote(quoteText, metaInfo, quotee, dd, mm, yyyy) {
	this.quoteText = quoteText;
	this.metaInfo = metaInfo;
	this.quotee = quotee;
	this.dd = dd;
	this.mm = mm;
	this.yyyy = yyyy;
}

Quote.prototype.isValid = function() {
	let valid = true;
	for (let p in this) { //OBS!! this refererer til Quoten!
		if (this[p] !== undefined) {
			if (this.hasOwnProperty(p) &&
				(this[p].toString().includes("<") || this[p].toString().includes(">"))) { //Bunnsolid XSS-beskyttelse
				valid = false;
				break;
			}
		}
		//Implementer gjerne flere sjekker her med RegEx e.l. her for å hindre stygge quotes
	}
	return valid;
}

export {Quote};