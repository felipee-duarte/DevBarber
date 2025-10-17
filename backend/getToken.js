// getToken.js
import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Escopo necessário para acessar Calendar e Planilhas
const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets"
];

const TOKEN_PATH = path.join(__dirname, "token.json");

// Se já existir token, pula o processo
if (fs.existsSync(TOKEN_PATH)) {
    console.log("✅ Token já existe! Pode rodar o server.js normalmente.");
    process.exit(0);
}

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
});

console.log("👉 Autorize este app visitando este link:\n", authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("\nCole aqui o código que você recebeu: ", async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log("✅ Token salvo com sucesso em", TOKEN_PATH);
        rl.close();
    } catch (error) {
        console.error("❌ Erro ao obter token:", error);
        rl.close();
    }
});
