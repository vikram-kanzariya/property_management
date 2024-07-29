const socketio = require('socket.io');

let io;
function initsocket(server) {
  io = socketio(server, {
    cors: {
      // origin: "http://localhost:8080",
      origin:"*",
      credentials: true,
      methods:['GET' , 'POST'],
    },
    connectionStateRecovery: {},
  });

  io.on("connection", (socekt) => {
    // console.log("User connected")
  });
}

function getIO() {
  if (!io) {
    return console.error("New Error Occured");
  }
  return io;
}

module.exports = {
  initsocket,
  getIO,
};
