const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Send money from one account to another
const sendMoney = async (req, res) => {
  try {
    const { toAccountId, amount, message } = req.body;
    const fromAccount = await Account.findOne({ user: req.user.id });
    const toAccount = await Account.findById(toAccountId);

    if (!toAccount) return res.status(404).json({ msg: 'Receiver account not found' });
    if (fromAccount.balance < amount) return res.status(400).json({ msg: 'Insufficient funds' });

    // Debit amount from sender
    fromAccount.balance -= amount;
    await fromAccount.save();

    // Credit amount to receiver
    toAccount.balance += amount;
    await toAccount.save();

    // Record transaction
    const transaction = new Transaction({
      from: fromAccount._id,
      to: toAccount._id,
      amount,
      message
    });

    await transaction.save();

    // Send email and SMS notifications
    //sendNotification(fromAccount, toAccount, amount, message);

    res.json({ msg: 'Transaction successful', transaction });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get transaction history for the user
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      $or: [{ from: req.user.id }, { to: req.user.id }] 
    }).populate('from to');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Helper function to send email and SMS
const sendNotification = async (fromAccount, toAccount, amount, message) => {
  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    to: fromAccount.user.email,
    from: process.env.EMAIL_USER,
    subject: 'Money Sent',
    text: `You have sent ${amount} to ${toAccount.user.name}. Message: ${message}`
  };

  transporter.sendMail(mailOptions);

  // Send SMS (example using Twilio)
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  client.messages.create({
    body: `You have sent ${amount} to ${toAccount.user.name}. Message: ${message}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: fromAccount.mobile
  });
};

module.exports = {
  sendMoney,
  getMyTransactions
};
