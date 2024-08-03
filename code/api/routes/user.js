const express = require('express');
const { User } = require('../models/db');

const router = express.Router();

// 获取用户信息
router.get('/users', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 更新用户信息
router.put('/users', async (req, res) => {
  const { name, email, phone } = req.body;

  const user = await User.findByPk(req.params.id);
  if (user) {
    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
