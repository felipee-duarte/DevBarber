// testToken.cjs
const { google } = require("googleapis");
const fs = require("fs");

// Lê os arquivos de credenciais e token
const credentials = require("./credentials.json");
const token = require("./token.json");

// ⚠️ Aqui está a linha corrigida
const { client_secret, client_id, redirect_uris } = credentials.web;

// Cria o cliente OAuth2
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Define as credenciais do token
oAuth2Client.setCredentials(token);

// Testa se o token ainda é válido
oAuth2Client.getAccessToken()
    .then(r => console.log("✅ Token ainda é válido:", r.token))
    .catch(e => console.error("❌ Token inválido:", e.message));
