const fs = require("fs");
const { google } = require("googleapis");

const credentials = require("./credentials.json");
const { client_secret, client_id, redirect_uris } = credentials.web;

// Cria o cliente OAuth
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Caminho para salvar o token
const TOKEN_PATH = "./token.json";

// Função para gerar novo token
function getAccessToken() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar"],
    });
    console.log("👉 Autorize este app visitando o link:\n", authUrl);

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question("\nCole aqui o código de autenticação: ", (code) => {
        readline.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("❌ Erro ao obter o token:", err);
            oAuth2Client.setCredentials(token);
            // Salva o novo token
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log("✅ Token armazenado em", TOKEN_PATH);
        });
    });
}

// Se o token ainda não existir, gera um novo
if (!fs.existsSync(TOKEN_PATH)) {
    getAccessToken();
} else {
    console.log("✅ Token já existe. Nenhuma ação necessária.");
}
