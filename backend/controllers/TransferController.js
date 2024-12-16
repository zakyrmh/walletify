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
    const { description, amount, datetime, senderWalletId, receiverWalletId } =
      req.body;

    if (!description) {
      return res.status(400).json({
        message: "Description is required.",
      });
    }
    if (!amount) {
      return res.status(400).json({
        message: "Amount is required.",
      });
    }
    if (!datetime) {
      return res.status(400).json({
        message: "Datetime is required.",
      });
    }
    if (!senderWalletId) {
      return res.status(400).json({
        message: "Sender wallet is required.",
      });
    }
    if (!receiverWalletId) {
      return res.status(400).json({
        message: "Receiver wallet is required.",
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
      datetime,
      senderWalletId,
      receiverWalletId,
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

const updateTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, datetime, senderWalletId, receiverWalletId } =
      req.body;

    // Menemukan transfer berdasarkan ID
    const initialTransfer = await Transfer.findById(id);
    if (!initialTransfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Validasi input
    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }
    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }
    if (!datetime) {
      return res.status(400).json({ message: "Datetime is required." });
    }
    if (!senderWalletId) {
      return res.status(400).json({ message: "Sender wallet is required." });
    }
    if (!receiverWalletId) {
      return res.status(400).json({ message: "Receiver wallet is required." });
    }

    // Mencari wallet pengirim lama
    const oldSenderWallet = await Wallet.findById(
      initialTransfer.senderWalletId
    );
    if (!oldSenderWallet) {
      return res.status(404).json({ message: "Old sender wallet not found." });
    }

    // Mencari wallet penerima lama
    const oldReceiverWallet = await Wallet.findById(
      initialTransfer.receiverWalletId
    );
    if (!oldReceiverWallet) {
      return res
        .status(404)
        .json({ message: "Old receiver wallet not found." });
    }

    // Mengembalikan saldo wallet pengirim lama
    oldSenderWallet.balance += Number(initialTransfer.amount);
    await oldSenderWallet.save();

    // Mengurangi saldo wallet penerima lama
    oldReceiverWallet.balance -= Number(initialTransfer.amount);
    await oldReceiverWallet.save();

    // Mencari wallet pengirim baru
    const newSenderWallet = await Wallet.findById(senderWalletId);
    if (!newSenderWallet) {
      return res.status(404).json({ message: "New sender wallet not found." });
    }

    // Mencari wallet penerima baru
    const newReceiverWallet = await Wallet.findById(receiverWalletId);
    if (!newReceiverWallet) {
      return res
        .status(404)
        .json({ message: "New receiver wallet not found." });
    }

    // Mengurangi saldo wallet pengirim baru
    if (newSenderWallet.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in sender wallet." });
    }
    newSenderWallet.balance -= Number(amount);
    await newSenderWallet.save();

    // Menambah saldo wallet penerima baru
    newReceiverWallet.balance += Number(amount);
    await newReceiverWallet.save();

    // Mengupdate transfer
    const updatedTransfer = await Transfer.findByIdAndUpdate(
      id,
      {
        description,
        amount,
        datetime,
        senderWalletId,
        receiverWalletId,
      },
      { new: true }
    );

    res.status(200).json(updatedTransfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    senderWallet.balance += Number(transfer.amount);
    await senderWallet.save();

    receiverWallet.balance -= Number(transfer.amount);
    if (receiverWallet.balance < 0) {
      return res.status(400).json({ message: "Insufficient balance." });
    }
    await receiverWallet.save();

    await Transfer.findByIdAndDelete(id);

    res.status(200).json({ message: "Transfer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
};
