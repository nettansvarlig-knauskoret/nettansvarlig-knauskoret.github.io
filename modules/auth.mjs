import {CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES} from "./constants.mjs";

//Dette er en abstraksjon av alt som har med autentisering å gjøre.
//Det er en komprimering av det som skjer her: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
//Og her: https://developers.google.com/drive/api/v3/quickstart/js

//onSignInUpdate er en callback-funksjon som bestemmer lastingen av siden etter autentisering.
//Tanken er at man gir to prosedyrer basert på resultatet av autentiseringen.
//All kode er synlig, så de to forskjellige sidelastingsprosedyrene er kun for å gi bedre brukeropplevelse, IKKE sikkerhet!

function handleAuth(onAccept, onDenial) {

    let onSignInUpdate = function(isSignedIn) { 
        if (isSignedIn) {
            onAccept();
        } else {
            onDenial();
        }
    }

    gapi.load('client:auth2', function() { //Denne anonyme funksjonen er callback funksjon som kalles når lastingen av client og auth2-modulene er ferdig.
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        })
        .then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(onSignInUpdate);
            onSignInUpdate(gapi.auth2.getAuthInstance().isSignedIn.get()); //Sjekk på om man allerede er innlogget
        })
        .catch(function(err) {
            console.error(err);
            // console.log("Resetting localStorage instances for CLIENT_ID and API_KEY."); //Sannsynligvis derfor det blir feil, men er er det nok rom for en smartere sjekk/løsning.
            // localStorage.removeItem("CLIENT_ID"); 
            // localStorage.removeItem("API_KEY");
            // console.log("Redirecting to index.html.");
            // location.replace("index.html");
        });
    });
}
  
function handleSignIn() {
    console.log("Signing in.");
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignOut() {
    console.log("Signing out.");
    gapi.auth2.getAuthInstance().signOut();
}

export {handleAuth, handleSignIn, handleSignOut};