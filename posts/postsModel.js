const connections = require("../db/config");

const getAllPost = async () => {
  const query = "SELECT * FROM  posts";
  try {
    return await connections.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const getAllPostsWith = async (string) => {
  const query = `SELECT * FROM posts WHERE title LIKE '%${string}%'`;
  try {
    return await connections.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const newPosts = async (posts) => {
  const query = `INSERT INTO posts SET ?`;
  try {
    return await connections.query(query, posts);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

module.exports = { getAllPost, newPosts, getAllPostsWith };
