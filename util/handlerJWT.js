const jwt = require("jsonwebtoken")

const jwt_secret = process.env.jwt_secret;

// Genero el token ---------------------------

const tokenSign = async(user)=>{
    return jwt.sign(user, jwt_secret, {expiresIn: "1h"})
}

// Verifico el token ------------------------

const tokenVerify = async(token)=>{
    try {
        return jwt.verify(token, jwt_secret)
    } catch (error) {
        return error
    }
}

module.exports = {
    tokenSign,
    tokenVerify
}