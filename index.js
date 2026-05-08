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