const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { YahooFinanceTicker } = require("./YahooFinanceTicker");

const stream = new YahooFinanceTicker();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

// Ruta raíz
app.get("/", async (req, res) => {
  try {
    const data = await stream.subscribe(["GME"], (ticker) => {
      console.log("subs");
      console.log(ticker);
    });
    console.log(data);
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
