import {handleAuth, handleSignIn} from "./modules/auth.mjs";

function onAccept() { 
	console.log("Redirecting to sitatside.html.")
	location.replace("sitatside.html");
}

function onDenial() {
	
}

window.onload = function() {
	handleAuth(onAccept, onDenial);
}; 

//---------------------------------------------

const signInSpan = document.querySelector("#signInSpan");

signInSpan.onclick = handleSignIn;