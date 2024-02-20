const router = require("express").Router();
const validatorCreatedPosts = require("../validator/posts");
const isAuth = require("../middleware/isAuth")

const {addOnePosts, listAllPosts} = require("../posts/postsController")

router.post("/", isAuth ,validatorCreatedPosts,  addOnePosts);

router.get("/", listAllPosts )

module.exports = router;
