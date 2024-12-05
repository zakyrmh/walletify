const Transfer = require("../models/Transfer");
const Wallet = require("../models/Wallet");

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransfer = async (req, res) => {
  try {
    const { description, amount, date, senderWalletId, receiverWalletId } =
      req.body;

    if (!description || !amount || !senderWalletId || !receiverWalletId) {
      return res.status(400).json({
        message:
          "Description, amount, senderWalletId, and receiverWalletId are required.",
      });
    }

    const senderWallet = await Wallet.findById(senderWalletId);
    const receiverWallet = await Wallet.findById(receiverWalletId);
    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: "Invalid wallet." });
    }

    const transfer = new Transfer({
      description,
      amount,
      senderWalletId,
      receiverWalletId,
      date,
    });
    await transfer.save();

    senderWallet.balance = Number(senderWallet.balance) - Number(amount);
    await senderWallet.save();

    receiverWallet.balance = Number(receiverWallet.balance) + Number(amount);
    await receiverWallet.save();

    res.status(201).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found." });
    }

    const senderWallet = await Wallet.findById(transfer.senderWalletId);
    const receiverWallet = await Wallet.findById(transfer.receiverWalletId);

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: "Invalid wallet." });
    }

    // Tambah saldo pengirim
    senderWallet.balance += Number(transfer.amount);
    await senderWallet.save();

    // Kurangi saldo penerima
    receiverWallet.balance -= Number(transfer.amount);
    if (receiverWallet.balance < 0) {
      return res.status(400).json({ message: "Insufficient balance." });
    }
    await receiverWallet.save();

    // Hapus transfer
    await Transfer.findByIdAndDelete(id);

    res.status(200).json({ message: "Transfer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransfers, getTransfer, createTransfer, deleteTransfer };
