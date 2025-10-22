/*// server.js
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
const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

// ====== IDs ======
const CALENDAR_ID =
    "e81a1b9bbefb973b52b367be4f0398de584b43766ac42371f8685ecbc9e48aba@group.calendar.google.com";
const SPREADSHEET_ID = "10kdNuSRWYAYxyLlFsARp0gdLfL4RZcr8RNch_I32i4Y";
const SHEET_NAME = "Tabela DevBarber";

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

        // 💰 Define valores para cada serviço
        const valores = {
            "Corte": 40,
            "Barba": 30,
            "Corte + Barba": 60,
        };
        const valor = valores[service] || 0;

        // 1️⃣ Verifica se está dentro do horário permitido
        if (!horarioValido(date, time)) {
            return res.status(400).json({
                message: "❌ Horário fora do expediente. Escolha outro horário.",
            });
        }

        // 2️⃣ Converte hora início e fim
        const startDateTime = new Date(`${date}T${time}:00-03:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);

        // 3️⃣ Verifica se já existe evento no mesmo horário
        const events = await calendar.events.list({
            calendarId: CALENDAR_ID,
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

        // 4️⃣ Cria o evento na Agenda
        const event = {
            summary: `${service} - ${name}`,
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
            calendarId: CALENDAR_ID,
            resource: event,
        });

        // 5️⃣ Envia também para o Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, phone, service, date, time, valor]],
            },
        });

        console.log("✅ Agendamento criado e registrado na planilha!");
        res.json({ message: "Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao criar agendamento:", error);
        res.status(500).json({
            message:
                "Erro ao criar agendamento. Verifique logs do servidor para detalhes.",
        });
    }
});

app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));*/

/*// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// === Configuração de caminhos ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Credenciais Google (via variáveis de ambiente no Vercel) ===
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const token = JSON.parse(process.env.GOOGLE_TOKEN);

const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

oAuth2Client.setCredentials(token);

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

// === IDs da Agenda e Planilha (também no Vercel) ===
const CALENDAR_ID = process.env.CALENDAR_ID;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

// === Função para validar horário ===
function horarioValido(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}:00-03:00`);
    const dia = date.getDay();
    const hora = date.getHours();

    if (dia === 0) return false;
    if (dia >= 1 && dia <= 5) return hora >= 9 && hora < 18;
    if (dia === 6) return hora >= 9 && hora < 13;
    return false;
}

// === Rota para receber o agendamento ===
app.post("/agendar", async (req, res) => {
    try {
        const { name, phone, service, date, time } = req.body;

        const valores = {
            "Corte": 40,
            "Barba": 30,
            "Corte + Barba": 60,
        };
        const valor = valores[service] || 0;

        if (!horarioValido(date, time)) {
            return res.status(400).json({
                message: "❌ Horário fora do expediente. Escolha outro horário.",
            });
        }

        const startDateTime = new Date(`${date}T${time}:00-03:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);

        const events = await calendar.events.list({
            calendarId: CALENDAR_ID,
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

        const event = {
            summary: `${service} - ${name}`,
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
            calendarId: CALENDAR_ID,
            resource: event,
        });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, phone, service, date, time, valor]],
            },
        });

        res.json({ message: "✅ Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao criar agendamento:", error);
        res.status(500).json({
            message: "Erro ao criar agendamento. Verifique logs do servidor para detalhes.",
        });
    }
});

// 🚀 Exporta o app para o Vercel
export default app;*/

import express from "express";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";

// === CONFIGURAÇÕES GERAIS ===
const app = express();
app.use(express.json());

// === LIBERAÇÃO DO CORS ===
app.use(cors({
    origin: "*", // pode trocar pelo domínio do front depois
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// === CARREGANDO CREDENCIAIS E TOKEN ===
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const token = JSON.parse(fs.readFileSync("token.json"));

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);

// === CONFIG DO CALENDAR E SHEETS ===
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

// ID da planilha e do calendário (use variáveis de ambiente na Vercel)
const CALENDAR_ID = process.env.CALENDAR_ID;
const SHEET_ID = process.env.SHEET_ID;

// === ROTA PRINCIPAL PARA AGENDAMENTO ===
app.post("/agendar", async (req, res) => {
    try {
        const { nome, telefone, servico, data, horario } = req.body;

        // === 1️⃣ Adiciona o evento no Google Calendar ===
        const event = {
            summary: `Agendamento: ${servico}`,
            description: `Cliente: ${nome}\nTelefone: ${telefone}`,
            start: { dateTime: `${data}T${horario}:00-03:00` },
            end: { dateTime: `${data}T${horario}:00-03:00` },
        };

        await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
        });

        // === 2️⃣ Adiciona os dados na Planilha ===
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "A:E",
            valueInputOption: "RAW",
            requestBody: {
                values: [[nome, telefone, servico, data, horario]],
            },
        });

        res.status(200).json({ message: "Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("Erro ao agendar:", error);
        res.status(500).json({ error: "Erro ao agendar horário." });
    }
});

// === TESTE DE CONEXÃO ===
app.get("/", (req, res) => {
    res.send("🚀 API DevBarber rodando com sucesso!");
});

// === EXPORT PARA VERCEL ===
export default app;
