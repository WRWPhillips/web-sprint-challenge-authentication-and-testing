const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { BCRYPT_ROUNDS, JWT_SECRET } = require('../../config');

const User = require('../../users/users-model');
const { 
  checkUsernameFree,
  checkUsernameExists 
} = require('./auth-middleware');

router.post('/register', checkUsernameFree, (req, res, next) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)

  User.add({ username, password: hash})
  .then(newUser => {
    res.status(201).json(newUser);
  })
  .catch(next);
});

router.post('/login', checkUsernameExists, (req, res) => {
  let { username, password } = req.body;

  User.findBy({ username })
  .then(([user]) => {
    if(user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({
        message: `welcome, ${user.username}`,
        token
      })
    }
  })
  .catch(next);
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' })
}

module.exports = router;
