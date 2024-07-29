const db = require('../models/index');
const { User } = db;

const registerUser = async(payload) => {
  try {
    const user = await User.create(payload);
    return user;
  } catch (error) {
    console.error('Error in Creating User: ' , error);
    throw error;
  }
};

module.exports = { registerUser };