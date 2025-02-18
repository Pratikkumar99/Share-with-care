const express = require("express");
const app = express();
const db = require("./db"); // Ensure this properly connects to MongoDB
const cors = require("cors"); // Import CORS
const PORT = process.env.PORT || 4000;

// ✅ Use built-in JSON parser instead of bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data

// ✅ Enable CORS to allow frontend requests
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});


const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

// Attach socket.io to app
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Import  routes
const userRoutes = require("./routes/user");
const foodRoutes = require("./routes/food"); 

// & use routes
app.use("/food", foodRoutes);
app.use("/user", userRoutes);

const path = require("path");

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ... (other routes and middleware)
// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});




