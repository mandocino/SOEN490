// Import function from user Model
import {
  getUsers,
  getUserByID,
  getUserByEmail,
  login,
  signup,
  updateUserByEmail,
  updateUserByID,
  removeUserByEmail,
} from "../models/userModel.js";

// Get All Users
export const showUsers = (req, res) => {
  getUsers((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get User by ID
export const showUserByID = (req, res) => {
  getUserByID(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get User ID by email
export const showUserByEmail = (req, res) => {
  getUserByEmail(req.params.email, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Attempt to get user data by login credentials
export const loginController = (req, res) => {
  const data = req.body;
  login(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Create a new user with data
export const signupController = (req, res) => {
  const data = req.body;
  signup(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Modify User by email
export const modifyUserByEmail = (req, res) => {
  updateUserByEmail(req.body, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Modify User by ID
export const modifyUserByID = (req, res) => {
  updateUserByID(req.body, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Delete User by email
export const deleteUserByEmail = (req, res) => {
  removeUserByEmail(req.body.email, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
