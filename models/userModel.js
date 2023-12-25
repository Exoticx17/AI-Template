const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  nickname: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false, 
  },
  physics: {
    type: Number,
    default: 0, 
  },
  biology: {
    type: Number,
    default: 0, 
  },
  chemistry: {
    type: Number,
    default: 0, 
  },
  nike: {
    type: Number,
    default: 0, 
  },
  adidas: {
    type: Number,
    default: 0, 
  },
  converse: {
    type: Number,
    default: 0, // Set default value directly in the schema
  },
  favoriteCategory:{
    type: String,
    default: ""
  }

});

// Fire a function before a document is saved to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) { // Only hash the password if it's modified
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Static method to log in a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  console.log(user.password)
  console.log(password)
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error('Incorrect password');
  } else {
    throw new Error('Incorrect email');
  }
};

userSchema.statics.updatePassword = async function (userId, currentPassword, newPassword) {
  try {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt); // Hash the new password

    await this.updateOne({ _id: userId }, { $set: { password: hashedNewPassword } }); // Update hashed password directly in the database

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;