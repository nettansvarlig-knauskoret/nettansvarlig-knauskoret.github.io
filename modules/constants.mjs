if (localStorage.getItem("CLIENT_ID") === null) {
    localStorage.setItem("CLIENT_ID", prompt("Vennligst skriv inn CLIENT_ID:").trim());
}
if (localStorage.getItem("API_KEY") === null) {
    localStorage.setItem("API_KEY", prompt("Vennligst skriv inn API_KEY:").trim());
}
if (localStorage.getItem("PRJCTFLDRID") === null) {
    localStorage.setItem("PRJCTFLDRID", prompt("Vennligst skriv inn PRJCTFLDRID:").trim());
}
if (localStorage.getItem("QUOTEJSONID") === null) {
    alert("Fant ingen QUOTEJSONID. En ny fil vil bli forsøkt opprettet i PRJCTFLDRID.");
}


const CLIENT_ID = localStorage.getItem("CLIENT_ID");
const API_KEY = localStorage.getItem("API_KEY");
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file"; 

const QUOTEJSONID = localStorage.getItem("QUOTEJSONID"); 
const PRJCTFLDRID = localStorage.getItem("PRJCTFLDRID"); 

export {CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES, QUOTEJSONID, PRJCTFLDRID};