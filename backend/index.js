require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");

const server = express().listen(PORT, () => {
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

// setInterval(() => {
//   getPrices();
// }, 5000);
