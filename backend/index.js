require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");
const { response } = require("express");

const app = express();
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const socketHandler = socketIO(server);

socketHandler.on("connection", (socket) => {
  socket.on("connect_error", () => {
    console.log("Connect Error");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  console.log("Client connected");
  socketHandler.emit("crypto", "Hello Users!");
});

const getPrices = () => {
  axios
    .get(process.env.LIST_URL)
    .then((response) => {
      const priceList = response.data.data.map((item) => {
        return {
          id: item.id,
          name: item.symbol,
          price: item.metrics.market_data.price_usd,
        };
      });
      socketHandler.emit("crypto", priceList);
    })
    .catch((err) => {
      console.log(err);
    });
};

setInterval(() => {
  getPrices();
}, 60000);

app.get("/cryptos/profile", (req, res) => {
  res.json({
    error: true,
    message: "No ID Provided",
  });
});

app.get("/cryptos/profile/:id", (req, res) => {
  const cryptoId = req.params.id;
  axios
    .get(`${process.env.BASE_URL}/${cryptoId}/profile`)
    .then((responseData) => {
      res.json(responseData.data.data);
    })
    .catch((err) => {
      res.json({
        error: true,
        message: "Error Fetching Prices Data from API",
        errorDetails: err,
      });
    });
});

app.get("/cryptos/market-data", (req, res) => {
  res.json({
    error: true,
    message: "No ID Provided",
  });
});

app.get("/cryptos/market-data/:id", (req, res) => {
  const cryptoId = req.params.id;
  axios
    .get(`${process.env.BASE_URL_MARKET}/${cryptoId}/metrics/market-data`)
    .then((responseData) => {
      res.json(responseData.data.data);
    })
    .catch((err) => {
      res.json({
        error: true,
        message: "Error Fetching Market Data from API",
        errorDetails: err,
      });
    });
});
