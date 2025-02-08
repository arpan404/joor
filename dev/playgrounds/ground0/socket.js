const { io } = require("socket.io-client");

// Connect to the WebSocket server
const socket = io("http://localhost:3000");

// When connected
socket.on("connect", () => {
  console.log(`Connected to server with ID: ${socket.id}`);

  // Send a message to the server
  socket.emit("message", "Hello from client!");

  // Listen for responses
  socket.on("response", (data) => {
    console.log("Server says:", data);
  });

  // Send a new message every 3 seconds
  // setInterval(() => {
  //   socket.emit("message", "Ping from client!");
  // }, 1000);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});
