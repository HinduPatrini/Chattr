 import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import socketHandler from "./src/socket/socketHandler.js";
import { seedDemoUser } from "./src/utils/seeder.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === "development" && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      if (origin === process.env.CLIENT_URL) return callback(null, true);
      return callback(new Error(`Socket CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDemoUser();
  server.listen(PORT, () => {
    console.log(`Chattr server running on port ${PORT}`);
  });
});

export default app;

