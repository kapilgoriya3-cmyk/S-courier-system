
// Import required packages
const billRoutes = require("./routes/billRoutes.js");

const express = require("express");     // Express framework → used to create backend server & APIs
const mongoose = require("mongoose");   // Mongoose → helps connect Node.js to MongoDB database
const cors = require("cors");     
const Courier = require("./models/Courier");


      // CORS → allows frontend (React) to communicate with backend
require("dotenv").config();             // dotenv → loads environment variables from .env file

// Create Express application

const app = express();                  // Initialize Express app (your server)

// ===================== MIDDLEWARE =====================

// Enable CORS
// Without this, browser blocks requests from React frontend

app.use(cors());
app.use("/api/bill", billRoutes);
// Enable JSON parsing
// Allows server to read data sent in JSON format from frontend

app.use(express.json());


// ===================== TEST ROUTE =====================

// Simple route to check if server is running

// Save courier entry
app.post("/api/courier", async (req, res) => {
  try {
    const newCourier = new Courier(req.body);
    await newCourier.save();
    res.status(201).json({ message: "Entry saved successfully ✅" });
  } catch (error) {
  console.log(error); // shows real error in terminal
  res.status(500).json({ error: error.message });
  }
});



// Get all courier entries
app.get("/api/courier", async (req, res) => {
  try {
    const data = await Courier.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data ❌" });
  }
});
// Get entries by client and month
app.get("/api/courier/filter", async (req, res) => {
  try {
    const { clientName, month, year } = req.query;

    // Start & end of selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const data = await Courier.find({
      clientName: clientName,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Filter failed ❌" });
  }
});


app.get("/", (req, res) => {
  res.send("Courier System Backend Running 🚀");
});


// Delete entry
app.delete("/api/courier/:id", async (req, res) => {
  try {
    await Courier.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed ❌" });
  }
});

// Update entry
app.put("/api/courier/:id", async (req, res) => {
  try {
    const updated = await Courier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed ❌" });
  }
});

      //  billing route is now in separate file: routes/billRoutes.js

app.get("/api/bill", async (req, res) => {
  try {
    const { clientName, month, year, fuel = 0, gst = 0, extra = 0 } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await Courier.find({
      clientName,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalShipments = entries.length;

    const totalCharges = entries.reduce(
      (sum, item) => sum + (item.charge || 0),
      0
    );

    const fuelAmount = (totalCharges * fuel) / 100;
    const subtotal = totalCharges + fuelAmount;

    const gstAmount = (subtotal * gst) / 100;

    const grandTotal = subtotal + gstAmount + Number(extra);

    res.json({
      clientName,
      month,
      year,
      totalShipments,
      totalCharges,
      fuelAmount,
      gstAmount,
      extra: Number(extra),
      grandTotal
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Billing failed ❌" });
  }
});





// ===================== DATABASE CONNECTION =====================

// Connect to MongoDB using connection string stored in .env file

mongoose.connect(process.env.MONGO_URI)
  // Runs if connection is successful
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  // Runs if connection fails
  .catch((error) => {
    console.log("MongoDB Connection Error ❌", error);
  });

// ===================== SERVER START =====================

// Define port number
// Use environment PORT if available, otherwise default to 5000

const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

