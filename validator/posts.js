const {check, validationResult} = require("express-validator");

const validatorCreatedPosts = [
    check("title")
        .exists()
        .trim()
        .notEmpty()
        .isLength({min:4, max:24}),
    check("body")
        .exists()
        .notEmpty(),
    (req, res, next) =>{
        try {
            validationResult(req).throw()
            return next()
        } catch (error) {
            res.status(400).send({error:error.array()})
        }
    }
]

module.exports = validatorCreatedPosts