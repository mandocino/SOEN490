// import connection
import { userDBModel } from "../config/db.js";
import bcrypt from "bcrypt";

// Get All Users
export const getUsers = (result) => {
  console.log("Get users called: ");
  userDBModel.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};

// Get User by ID
export const getUserByID = (ID, result) => {
  userDBModel.find({ _id: ID }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};

// Get User ID by email
export const getUserByEmail = (email, result) => {
  userDBModel.find({ email: email }, "_id", (err, data) => {
    if (err) {
      console.log(err);
    } 
    if (!data) {
      // Handle case where user is not found
      const error = new Error('User not found');
      error.status = 404;
      return result(error);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};

// Attempt to get user data by login credentials
export const login = (data, result) => {
  // Get hashed password for corresponding email
  userDBModel.find({ email: data.email }, "_id password", (err, retData) => {
    if (err) {
      console.log(err);
    } else if (!retData || retData.length === 0) {
      // Handle case where user is not found
      const error = new Error('User not found');
      error.status = 404;
      return result(error);
    } else {
      // Compare given password with hashed
      bcrypt.compare(data.password, retData[0].password, function(err, compareResult) {
        if (compareResult) {
          // If matches, get rest of user data and return it
          userDBModel.find(
              { email: data.email },
              "_id first_name duration_priority email frequency_priority last_name walk_priority lastPrefChangeTime",
              (err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                    console.log(data);
                  }
                  result(null, data);
                }
              }
          );
        }else{
          console.log(err);
        }
      });
    }
  });
};

// Creates a new user using given data
export const signup = (data, result) => {
  console.log("signup called");
  // Hash password
  bcrypt.hash(data.password, 10, function(err, hash) {
    data.password = hash;
    userDBModel.create(data, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
        result(null, data);
      }
    });
  });
};

// Update a user's data by ID
export const updateUserByID = (data, result) => {
  userDBModel.findOneAndUpdate({ _id: data._id }, data, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};

// Update a user's data by email
export const updateUserByEmail = (data, result) => {
  userDBModel.findOneAndUpdate({ email: data.email }, data, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};

// Remove a user by email
export const removeUserByEmail = (email, result) => {
  userDBModel.findOneAndDelete({ email: email }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
        console.log(data);
      }
      result(null, data);
    }
  });
};
