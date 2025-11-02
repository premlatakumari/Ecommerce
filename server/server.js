import { config as configDotenv } from "dotenv";
configDotenv();

import { app } from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDb();

app.get("/", (req, res) => {
  res.send("Server is Running");
});
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});