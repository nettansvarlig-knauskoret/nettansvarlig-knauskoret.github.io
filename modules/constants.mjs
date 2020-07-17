if (localStorage.getItem("CLIENT_ID") === null) {
    localStorage.setItem("CLIENT_ID", prompt("Vennligst skriv inn CLIENT_ID:").trim());
}

if (localStorage.getItem("API_KEY") === null) {
    localStorage.setItem("API_KEY", prompt("Vennligst skriv inn API_KEY:").trim());
}

const CLIENT_ID = localStorage.getItem("CLIENT_ID");
const API_KEY = localStorage.getItem("API_KEY");
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file"; 

const QUOTEJSONID = "1Oiiun0z7W0YCY7P0dpfAIAaTSomyaGwL";  
const PRJCTFLDRID = "1afKJpLhZLM2RSpqLx8Lft4Z6Lo4vByGF"; 

export {CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES, QUOTEJSONID, PRJCTFLDRID};