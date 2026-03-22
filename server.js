// Load env variables
require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ✅ Get MongoDB URL from .env
const url = process.env.MONGO_URI;

// Create client
const client = new MongoClient(url);

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log("MongoDB Atlas Connected ✅");

    // Database & collection
    const db = client.db("portfolioDB");
    const collection = db.collection("contacts");

    // POST API (save form data)
    app.post("/contact", async (req, res) => {
      try {
        const { name, email, message } = req.body;

        await collection.insertOne({
          name,
          email,
          message,
          createdAt: new Date()
        });

        res.json({ message: "Message saved successfully!" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error saving message" });
      }
    });

    // GET API (test route)
    app.get("/", (req, res) => {
      res.send("Backend running with MongoDB Atlas 🚀");
    });

    // Start server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (err) {
    console.error("Connection Error ❌:", err);
  }
}

// Run server
startServer();