//QGDI står for Quote Google Drive Interface

//Faktisk ikke nødvendig å importere noe fra quote.mjs

//Mye inspirasjon herfra: https://tanaikech.github.io/2018/08/13/upload-files-to-google-drive-using-javascript/
//Alle funksjonene i denne modulen her lager HTTP-requests fra bunn av, istedenfor å bruke methodsene fra APIen. Se derfor på "HTTP"-eksempelene på hjelpesiden, f.eks. https://developers.google.com/drive/api/v3/manage-uploads#http_1 
//Hvorfor? Fordi jeg aldri helt forsto hvordan man skulle ha f.eks. query parameters med methodsene i Drive-APIen (gapi.client.drive.files.create, f.eks.).
//Hvis jeg skulle startet på nytt og brukt APIen "skikkelig" hadde jeg startet her: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
//Uansett metode går APIen ut på å sende HTTP-requests med en OAuth-accesstoken.

function getJsonContent(fileId, accessToken) { 
	let url = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media&supportsAllDrives=true"; //Queryen gjør at den skjønner at man ber om innholdet. Merk at å lese innhold krever mer enn meta-read-rettighter i SCOPES.
	console.log("Sending JSON read request.");
	
	return fetch(url, { 
		'headers': {'Authorization': "Bearer " + accessToken}
	})
	.then(response => {
		if (response.ok) {
			console.log("JSON read successful.");
			return response.json();
		}
		else {
			throw "JSON read unsuccessful."; 
		}
	}); 
}

function makeJsonQuoteFile(parentId, fileName, accessToken) { 
	let url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&keepRevisionForever=true&supportsAllDrives=true"; //Kan spesifisere fields som URL-parameter
	console.log("Sending JSON creation request.");

	let file = new Blob([JSON.stringify([])], {'type': "application/json"}); //Skal ha en tom quoteArray til å begynne med
	let metadata = {
		'name': fileName,
		'mimeType': "application/json",
		'parents': [parentId],
	}

	//FormData gjør at bodyen har rett format.
	let form = new FormData();
	form.append("metadata", new Blob([JSON.stringify(metadata)], {type: "application/json"})); //Metadataen må være først.
	form.append("file", file); 

	return fetch(url, { //Returnerer et Promise som resolver med ID-en til filen
		'method': "POST", 
		'headers': { 
			'Authorization': "Bearer " + accessToken
		},
		'body': form  
	})
	.then(response => {
		if (response.ok) {
			console.log("JSON created.")
			return response.json(); //ID-en til filen 
		}
		else {
			throw "JSON creation unsuccessful."; //Return og throw i callbacken til "then" "promisifiseres", så du slipper reject og resolve. 
		}
	})
	.then(val => val.id);
}

function appendJsonQuote(newQuote, fileId, accessToken) { 
	let url = "https://www.googleapis.com/upload/drive/v3/files/" + fileId + "?uploadType=media&supportsAllDrives=true"; //Kan spesifisere fields som URL-parameter
	console.log("Sending append request.");

	return getJsonContent(fileId, accessToken)
	.then(async function(quoteArray) {

		quoteArray.push(newQuote);
		let requestBody = JSON.stringify(quoteArray);

		await fetch(url, {
			'method': "PATCH",
			'headers': { 
				'Authorization': "Bearer " + accessToken
				},
			'body': requestBody //Det viser seg at FormData ikke var nødvendig, i motsetning til i makeJsonQuoteFile, som trengte metadata i requesten.
		})
		.then(response => {
			if (response.ok) {
				console.log("Append successful.");
			}
			else {
				throw "Append unsuccessful.";
			}
		});
	}); 
}

function deleteJsonQuote(quoteIndex, fileId, accessToken) {
	let url = "https://www.googleapis.com/upload/drive/v3/files/" + fileId + "?uploadType=media&supportsAllDrives=true"; //Kan spesifisere fields som URL-parameter
	console.log("Sending delete request.");

	return getJsonContent(fileId, accessToken)
	.then(async function(quoteArray) {

		let requestBody;
		if (quoteIndex > -1 && quoteIndex < quoteArray.length) {
			quoteArray.splice(quoteIndex, 1);
			requestBody = JSON.stringify(quoteArray);
		}
		else {
			throw "Invalid index; delete unsuccessful."
		}

		await fetch(url, {
			'method': "PATCH",
			'headers': { 
				'Authorization': "Bearer " + accessToken
			},
			'body': requestBody //Også her er FormData unødvendig
		})
		.then(response => {
			if (response.ok) {
				console.log("Delete successful."); //NB! Kjøres også når ikke-eksisterende index slettes, som er tullete.
			}
			else {
				throw "Delete unsuccessful.";
			}
		});
	}); //Vil tro at et rejected promise fra den innerste fetchen vil bubble ut og få den ytre "then"-en til å rejecte også
}

export {makeJsonQuoteFile, getJsonContent, appendJsonQuote, deleteJsonQuote};
