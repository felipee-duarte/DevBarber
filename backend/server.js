

// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());



// ====== Autenticação Google ======
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// carrega o token salvo
const TOKEN_PATH = path.join(__dirname, "token.json");
if (fs.existsSync(TOKEN_PATH)) {
  const token = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
}

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// ====== Rota de teste ======
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// ====== Rota para receber o agendamento ======
app.post("/agendar", async (req, res) => {
  try {
    const { name, phone, service, date, time } = req.body;

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

    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("✅ Agendamento criado com sucesso!");
    res.json({ message: "Agendamento criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ message: "Erro ao criar agendamento" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
