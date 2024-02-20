const router = require("express").Router();

const{
    getAllUsers,
    getUserById,
    register,
    deleteUser,
    updateUser,
    loginUser,
    forgot,
    reset,
    saveNewPass
} = require("../users/usersControllers")

// Middleware ---------------------------------------------
const {validatorCreateUser, validatorResetPassword} = require("../validator/user")
const fileUpload = require("../util/handlerStorage")

router.get("/", getAllUsers);

router.get("/:id", getUserById)

router.post("/", fileUpload.single("file") , validatorCreateUser  ,register);

router.delete("/:id", deleteUser)

router.patch("/:id",  fileUpload.single("file") ,updateUser)

router.post("/login", loginUser)

// Forgot PASSWORD -----------------------------------------
router.post("/forgot-password", forgot)

// GET de LINk ---------------------------------------------
router.get("/reset/:token", reset)
router.post("/reset/:token", validatorResetPassword, saveNewPass)

// Exporto los routers en forma genérica -------------------
module.exports = router

