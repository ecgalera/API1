const {tokenVerify} = require("../util/handlerJWT")

const isAuth = async (req, res, next) =>{
  
    try {

        if(!req.headers.authorization){
            let error = new Error("No token");
            error.status = 403;
            return next(error);
        }

        const token = req.headers.authorization.split(" ").pop()

        const validToken = await tokenVerify(token);  
        
        if(validToken instanceof Error){
            error.message = "token expired"
            error.status = 403
            return next(error)
        }
        req.user = validToken;
        console.log(req.user, "req.user")
        next()
    
    } catch (error) {
        error.status = 401
        error.message = "Internal Error";
        return next(error)
    }

       
}

module.exports = isAuth;


