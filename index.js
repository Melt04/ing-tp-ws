const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { YahooFinanceTicker } = require("./YahooFinanceTicker");
const wsArray = [];
const stream = new YahooFinanceTicker();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

// Ruta raíz
wss.on("connection", async (ws) => {
  wsArray.push(ws);
  console.log("conectado");
  ws.send(JSON.stringify({ type: "id", id: wsArray.length }));
  ws.on("message", (data) => {
    const idMessage = JSON.parse(data.toString()).id;
    const ticket = JSON.parse(data.toString()).ticket;
    const stream = new YahooFinanceTicker();
    stream.subscribe([ticket], (ticker) => {
      wsArray[idMessage - 1].send(JSON.stringify({ type: "ticket", ticker }));
    });
  });
});
app.get("/", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/index.html");
  } catch (e) {
    console.log(e);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Node.js http://localhost:${PORT}`);
});

///
///
