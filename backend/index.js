const PORT = 3000;

const express = require("express");
const socketIO = require("socket.io");

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
