const express = require("express");
const router = express.Router();
const FoodListing = require("../models/FoodListing");
const { jwtAuthMiddleware } = require("../jwt");


// Add a new food listing (Provider)
router.post("/add", jwtAuthMiddleware, async (req, res) => {
    try {
      const { foodType, quantity, location, expiry, price, condition, photo } = req.body;
  
      const newListing = new FoodListing({
        providerId: req.user.userId,
        foodType,
        quantity,
        location,
        expiry,
        price,
        condition,
        photo, // Include the photo URL
        status: "available"
      });
  
      await newListing.save();
      res.status(201).json(newListing);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all listings for the logged-in provider
router.get("/provider", jwtAuthMiddleware, async (req, res) => {
  try {
    const listings = await FoodListing.find({ providerId: req.user.userId });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all available listings (NGO)
router.get("/available", jwtAuthMiddleware, async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: "available" })
      .populate("providerId", "name email mobile");
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Claim a listing (NGO)
router.post("/claim/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.status === "claimed") {
      return res.status(400).json({ message: "Listing already claimed" });
    }

    listing.status = "claimed";
    listing.claimedBy = req.user.userId;
    await listing.save();

    res.status(200).json({ message: "Listing claimed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a listing (Provider)
// routes/food.js
router.delete("/delete/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const listing = await FoodListing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
  
      // Check if the logged-in user is the owner of the listing
      if (listing.providerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Delete the listing
      await FoodListing.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
});

//new
// Get all available listings (NGO)
router.get("/available", jwtAuthMiddleware, async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: "available" })
      .populate("providerId", "name email mobile");
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Claim a listing (NGO)
router.post("/claim/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.status === "claimed") {
      return res.status(400).json({ message: "Listing already claimed" });
    }

    listing.status = "claimed";
    listing.claimedBy = req.user.userId;
    await listing.save();

    res.status(200).json({ message: "Listing claimed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// routes/food.js
router.get("/claim-history", jwtAuthMiddleware, async (req, res) => {
    try {
      const claims = await FoodListing.find({ claimedBy: req.user.userId })
        .populate("providerId", "name email mobile");
      res.status(200).json(claims);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  const multer = require("multer");
  const path = require("path");
  
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  });
  
  const upload = multer({ storage });
  
  // Upload image endpoint
  router.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ photoUrl: `/backend/uploads/${req.file.filename}` });
  });
module.exports = router;