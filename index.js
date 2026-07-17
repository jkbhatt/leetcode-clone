import dotenv from "dotenv";
dotenv.config();  // Load .env file FIRST before anything else!

import conncectDB from "./src/db/index.js";
import { app } from "./app.js";
import { connect } from "mongoose";
import connectDB from "./src/db/index.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
      // Only start server AFTER database is connected
      app.listen(PORT, () =>{
        console.log(`Server running on http://localhost: ${PORT}`);
      })
})

// Keep Render awake (free tier spins down after 15min)
const RENDER_URL = "https://leetcode-clone-3r98.onrender.com/api/v1/healthcheck";

setInterval(async () => {
  try {
    await fetch(RENDER_URL);
    console.log("Keep-alive ping sent");
  } catch (err) {
    console.log("Keep-alive failed:", err.message);
  }
}, 14 * 60 * 1000); // every 14 minutes


