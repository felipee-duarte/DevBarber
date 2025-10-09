// backend/server.js
const fs = require("fs");
const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = "token.json";

// Carrega credenciais
const credentials = require("./credentials.json");
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// ====== ROTA 1 - AUTENTICAR ======
app.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// ====== ROTA 2 - CALLBACK DO GOOGLE ======
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  res.send("✅ Token salvo com sucesso! Pode fechar essa aba.");
});

// ====== ROTA 3 - AGENDAR ======
app.post("/agendar", async (req, res) => {
  try {
    console.log("📩 Requisição recebida:", req.body);

    const { name, phone, service, date, time } = req.body;

    // Carrega token salvo
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary: `${service} - ${name}`,
      description: `Telefone: ${phone}`,
      start: {
        dateTime: new Date(`${date}T${time}:00-03:00`),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(
          new Date(`${date}T${time}:00-03:00`).getTime() + 30 * 60000
        ),
        timeZone: "America/Sao_Paulo",
      },
    };

    console.log("📅 Enviando evento:", event);

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("✅ Evento criado:", response.data.htmlLink);
    res.json({ message: "Agendamento criado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao criar agendamento:", err);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});


/*// ====== ROTA PARA GERAR NOVO TOKEN ======
app.get("/gerar-token", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.send(`Autorize o app clicando neste link: <a href="${authUrl}">${authUrl}</a>`);
});
*/


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
