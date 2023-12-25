const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MongoDB connection URL
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/AI?retryWrites=true&w=majority';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err);
});

// Token expiration time (3 days in seconds)
const maxAge = 3 * 24 * 60 * 60;

// Function to create a JSON Web Token
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

// Function to handle errors during authentication and registration
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
  
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }
  
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  
  return errors;
};

// Controller function for user login
const login_post = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password)
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    console.log(req.cookies);
    
    res.cookie('jwt', token, { httpOnly: false , maxAge: maxAge * 1000 });
    
    res.status(200).json({ user: user._id, admin: user.admin });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

// Controller function for user registration
const signup_post = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const user = await User.create({ email, password, nickname, admin: false });
    const token = createToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: false,
      maxAge: maxAge * 1000
    });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};


// Controller function for user logout
const logout_post = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json(req.cookies.jwt);
  console.log('RIP Cookie');
}

// Controller function to get all users
const users_get = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
}

// Controller function to get a specific user by ID
const userGetOne = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Invalid user ID' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller function to delete a user by ID
const users_delete = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Not a Valid Doc Id' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

// Controller function to change user password
const changePassword = async (req, res) => {
  const userId = req.query.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await User.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get authentication status (cookies)
const auth_status = async (req, res) => {
  res.json(req.cookies);
}

// Controller function to change user password
const changeCategory = async (req, res) => {
  const { category, userId } = req.query;

  try {
    // Assuming User is your Mongoose model
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { [category]: 1 } }, // Incrementing the specified category field by 1
      { new: true } // To return the updated user data
    );

    res.status(200).json(user); // Responding with the updated user data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to change user password
const changeCategory2 = async (req, res) => {
  const { category, userId } = req.query;

  try {
    // Assuming User is your Mongoose model
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { [category]: -1 } }, // Incrementing the specified category field by 1
      { new: true } // To return the updated user data
    );

    res.status(200).json(user); // Responding with the updated user data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller function to update user admin status by ID
const admin_user = async (req, res) => {
  const changeTo = req.query.changeTo;

  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { admin: changeTo } }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
const voted_user = async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $inc: { timesVoted: 1 } }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const posted_user = async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $inc: { timesPosted: 1 } }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};


// Exporting the controller functions
module.exports = {
  admin_user,
  users_delete,
  users_get,
  userGetOne,
  login_post,
  logout_post,
  signup_post,
  auth_status,
  voted_user,
  posted_user,
  changePassword,
  changeCategory,
  changeCategory2
};