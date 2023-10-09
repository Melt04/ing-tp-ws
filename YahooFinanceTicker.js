const ws = require("websocket");
const events = require("events");
const protobuf = require("protobufjs");
const path = require("path");

class YahooFinanceTicker {
  constructor() {
    this.client = null;
    this.connection = null;
    this.protoTicker = null;

    this.callbackFn = null;
  }

  initClient = () => {
    return new Promise((resolve) => {
      this.client = new ws.client();
      this.client.connect("wss://streamer.finance.yahoo.com/");
      this.client.on("connect", (connection) => {
        console.log("Yahoo Finance WS Connected");
        this.connection = connection;
        connection.on("message", this.handleConnectionMessage);
        resolve(true);
      });

      this.client.on("connectFailed", function (error) {
        console.log("Connect Error: " + error.toString());
      });
    });
  };

  handleConnectionMessage = (message) => {
    console.log("Stream Message Received");
    console.log(message);
    if (message.type === "utf8") {
      const ticker = this.protoTicker.decode(
        Buffer.from(message.utf8Data, "base64")
      );
      if (!!this.callbackFn) {
        this.callbackFn(ticker);
      }
    }
  };

  loadProto = async () => {
    const root = await protobuf.load(
      path.join(__dirname, "proto/", "YahooFinanceTicker.proto")
    );
    this.protoTicker = root.lookupType("yticker");
  };

  subscribe = async (symbols, callback) => {
    if (!this.protoTicker) {
      await this.loadProto();
    }

    if (!this.client || !this.connection) {
      await this.initClient();
    }
    this.connection.sendUTF(
      JSON.stringify({
        subscribe: symbols,
      })
    );

    if (!!callback) {
      this.callbackFn = callback;
    }
  };

  unsubscribe = () => {
    if (this.connection && this.connection.connected) {
      this.connection.close();
    }
  };
}

module.exports = { YahooFinanceTicker };
