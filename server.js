// Load environment variables
require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

// 🔥 MANUAL CORS FIX (FINAL)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(express.json());

// MongoDB URL
const url = process.env.MONGO_URI;

// MongoDB client
const client = new MongoClient(url);

// Start server
async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB Atlas Connected ✅");

    const db = client.db("portfolioDB");
    const collection = db.collection("contacts");

    // ✅ POST route
    app.post("/contact", async (req, res) => {
      try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
          return res.status(400).json({ message: "All fields required" });
        }

        await collection.insertOne({
          name,
          email,
          message,
          createdAt: new Date()
        });

        res.status(200).json({ message: "Message saved successfully!" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error saving message" });
      }
    });

    // ✅ Test route
    app.get("/", (req, res) => {
      res.send("Backend running with MongoDB Atlas 🚀");
    });

    // PORT
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (err) {
    console.error("Connection Error ❌:", err);
  }
}

startServer();