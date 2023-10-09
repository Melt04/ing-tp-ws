const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const easymidi = require("easymidi");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Conexiones WebSocket
wss.on("connection", (ws) => {
  console.log("Cliente WebSocket conectado");
  // Manejo de mensajes desde el navegador
  ws.on("message", (message) => {
    console.log(`Mensaje recibido del navegador: ${message}`);

    // Analizar el mensaje JSON
    const data = JSON.parse(message);
    const { ccNumber, ccValue } = data;
  });
});

// Iniciar el servidor en el puerto 3001
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Node.js http://localhost:${PORT}`);
});
