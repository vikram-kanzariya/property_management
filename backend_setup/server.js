const router = require("./routes/routes");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { initsocket } = require("./utils/socket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
  connectionStateRecovery: {},
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "Hello!, Node Connected " });
});

// io.on('connection' , (socket) => {
//   console.log("User Connected: " , socket.id)

//   socket.on('send_message' , (id) => {
//     io.emit('recieve_message' , id);
//   })
// })

initsocket(server)

// io.on("connection" , authenticateUser, sendMessage)

// io.on("connection", (socket) => {
//   console.log("A New User Connected: " , socket.id);

//   // socket.on("disconnect", () => {
//   //   console.log("user disconnected");
//   // });

//   // socket.on('chat-message', (msg) => {
//   //   io.emit('chat-message' , msg)
//   // });

//   // join the room named 'chat-room'
//   socket.join('chat-room');

//   // broadcast to all connected clients in the room
//   socket.on('chat-message' , (msg) => {
//     io.to('chat-room').emit('chat-message' , msg);
//   });

//   // Leave the room named 'chat-room'
//   // socket.leave('chat-room');

// });


server.listen(process.env.PORT, () => {
  console.log(`Working on PORT: ${process.env.PORT}`);
});

// module.exports = { io };
