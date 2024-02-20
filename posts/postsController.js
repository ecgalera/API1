const { getAllPost, newPosts, getAllPostsWith } = require("./postsModel");
const {matchedData} = require("express-validator");

const addOnePosts = async (req, res, next) => {
  const cleanBody = matchedData(req);
  const dbResponse = await newPosts({ userid: req.user.id, ...cleanBody });
  dbResponse instanceof Error
    ? next(dbResponse)
    : res.status(201).json({ message: `Posts created by ${req.user.name}` });
};

// const listAllPosts = async (req, res, next) =>{
//     const dbResponse = await getAllPost();
//     if(dbResponse instanceof Error) return next(dbResponse);
//     dbResponse.length ? res.status(200).json(dbResponse) : next()
// }

const listAllPosts = async (req, res, next) => {
  let dbResponse = null;
  if (req.query.title) {
    dbResponse = await getAllPostsWith(req.query.title);
  } else {
    dbResponse = await getAllPost();
  }
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

module.exports = { addOnePosts, listAllPosts };
