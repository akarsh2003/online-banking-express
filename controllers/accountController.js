const Account = require('../models/Account');
const User = require('../models/User');

// Create a new bank account
const createAccount = async (req, res) => {
  try {
    const { mobile } = req.body;
    const userId = req.user.id;

    const existingAccount = await Account.findOne({ user: userId });
    if (existingAccount) return res.status(400).json({ msg: 'Account already exists' });

    const account = new Account({
      user: userId,
      mobile,
      balance: 1000
    });

    await account.save();
    res.status(201).json({ msg: 'Account created successfully, waiting for ', account });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get the current user's account(s)
const getMyAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Get all accounts
const getAllUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate('user');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Approve an account
const approveAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Account.findById(accountId);

    if (!account) return res.status(404).json({ msg: 'Account not found' });

    account.approved = true;
    await account.save();
    res.json({ msg: 'Account approved successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createAccount,
  getMyAccounts,
  getAllUserAccounts,
  approveAccount
};
