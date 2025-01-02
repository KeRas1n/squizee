const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const gameController = require("./controllers/gameController");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Передача экземпляра `io` в контроллер
gameController(io);

server.listen(3001, () => {
    console.log("Server is running...🚀");
});
