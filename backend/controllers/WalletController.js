const Wallet = require("../models/Wallet");

const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWallet = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required." });
    }

    const wallet = new Wallet({ name, type });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;

    if (!name || !type || !balance) {
      return res
        .status(400)
        .json({ message: "Name, type, and balance are required." });
    }

    const wallet = await Wallet.findByIdAndUpdate(
      id,
      { name, type, balance },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;
    await Wallet.findByIdAndDelete(id);
    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
};
