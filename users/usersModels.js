const connection = require("../db/config");

// get all users ---------------------------

const allUsers = async () => {
  const query = "SELECT * FROM api";
  try {
    return await connection.query(query);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
};

// getUsersById ---------------------------

const usersById = async (id) => {
  const query = `SELECT * FROM api WHERE id=${id}`;
  try {
    return await connection.query(query);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
};

// newUser ---------------------------

const newUser = async (user) => {
  const query = "INSERT INTO api SET ?";
  try {
    return await connection.query(query, user);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
};

// userDelete ---------------------------

const userDelete = async (id) => {
  const query = `DELETE FROM api WHERE id=${id}`;
  try {
    return await connection.query(query);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
};

// userUpdate ---------------------------

const userUpdate = async (id, user) => {
  const query = `UPDATE api SET ? WHERE id=${id}`;
  try {
    return await connection.query(query, user);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
};

  
// userLogin ---------------------------

const userLogin = async(email) =>{
  const query = `SELECT * FROM api WHERE email = "${email}"`;
  try {
    return await connection.query(query);
  } catch (error) {
    // error.status = 500;
    error.message = error.code;
    return error;
  }
}

module.exports = {
  allUsers,
  usersById,
  newUser,
  userDelete,
  userUpdate,
  userLogin
};
