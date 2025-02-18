const mongoose = require("mongoose");

const foodListingSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodType: { type: String, required: true },
    quantity: { type: String, required: true },
    location: { type: String, required: true },
    expiry: { type: Date, required: true },
    price: { type: Number, required: true },
    condition: { type: String, enum: ["fresh", "expiring", "frozen"], required: true },
    status: { type: String, enum: ["available", "claimed"], default: "available" },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    photo: { type: String }, // Store the image URL
    createdAt: { type: Date, default: Date.now }
});

const FoodListing = mongoose.model("FoodListing", foodListingSchema);
module.exports = FoodListing;