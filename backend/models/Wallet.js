const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Wallet", walletSchema);
