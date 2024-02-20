const { check, validationResult } = require("express-validator");

const validatorCreateUser = [
  check("name")
    .exists().withMessage("El campo name debe existir")
    .notEmpty().withMessage("El campo name no debe estar vació")
    .trim()
    .isAlpha("es-ES", {ignore:" "})
    .isLength({min:2 , max:90}).withMessage("Debe tener un min: 2 y un max:90 caracteres"),
 check("email")
    .exists().withMessage("Email is required")
    .trim()
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(), 
 check("password")
    .exists().withMessage("Debe existir")
    .trim()
    .notEmpty().withMessage("No debe venir vacío"),
    (req, res, next)=>{
        try {
            validationResult(req).throw()
            return next()
        } catch (error) {
            res.status(400).json({error: error.array()})
        }
    }
];

const validatorResetPassword= [
    check("password_1")
        .exists()
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min:8 , max:20})
        .trim(),
    check("password_2")
        .custom(async(password_2, {req})=>{
            const password_1 = req.body.password_1
            if(password_1 !== password_2){
                throw new Error("Password must be identical")
            }
        }),
        (req, res, next) => {
            const token = req.params.token
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const arrWarnings = errors.array()
                console.log(arrWarnings)
                res.render("reset", { arrWarnings, token })
            } else {
                return next()
            }
        }
]

module.exports = {validatorCreateUser,validatorResetPassword }
