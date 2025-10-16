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

// ====== Função para validar horário ======
function horarioValido(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}:00-03:00`);
    const dia = date.getDay(); // 0=domingo ... 6=sábado
    const hora = date.getHours();

    if (dia === 0) return false; // domingo fechado
    if (dia >= 1 && dia <= 5) {
        // segunda a sexta: 9h às 18h
        return hora >= 9 && hora < 18;
    }
    if (dia === 6) {
        // sábado: 9h às 13h
        return hora >= 9 && hora < 13;
    }
    return false;
}

// ====== Rota para receber o agendamento ======
app.post("/agendar", async (req, res) => {
    try {
        const { name, phone, service, date, time } = req.body;

        // 1️⃣ Verifica se está dentro do horário permitido
        if (!horarioValido(date, time)) {
            return res.status(400).json({
                message: "❌ Horário fora do expediente. Escolha outro horário.",
            });
        }

        // 2️⃣ Converte hora início e fim
        const startDateTime = new Date(`${date}T${time}:00-03:00`);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        // 3️⃣ Verifica se já existe evento no mesmo horário
        const events = await calendar.events.list({
            calendarId:
                "e81a1b9bbefb973b52b367be4f0398de584b43766ac42371f8685ecbc9e48aba@group.calendar.google.com",
            timeMin: startDateTime.toISOString(),
            timeMax: endDateTime.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        if (events.data.items.length > 0) {
            return res.status(400).json({
                message: "⚠️ Este horário já está ocupado. Escolha outro.",
            });
        }

        // 4️⃣ Cria o evento
        const event = {
            summary: `${service} - ${name}`,
            description: `Telefone: ${phone}`,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: "America/Sao_Paulo",
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: "America/Sao_Paulo",
            },
        };

        await calendar.events.insert({
            calendarId:
                "e81a1b9bbefb973b52b367be4f0398de584b43766ac42371f8685ecbc9e48aba@group.calendar.google.com",
            resource: event,
        });

        console.log("✅ Agendamento criado com sucesso!");
        res.json({ message: "Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao criar evento:", error.message || error);
        res.status(500).json({
            message:
                "Erro ao criar agendamento. Verifique logs do servidor para o erro da API.",
        });
    }
});

app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
