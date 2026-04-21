import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Simple store for connected users' cursor/hand positions
  const users: Record<string, { x: number, y: number, z: number, color: string }> = {};

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Assign a random color to the user
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    
    socket.on("cursor:move", (data) => {
      users[socket.id] = { ...data, color };
      socket.broadcast.emit("users:update", users);
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
      socket.broadcast.emit("users:update", users);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
