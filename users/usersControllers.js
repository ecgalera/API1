const notNumber = require("../util/notNumber");
require("dotenv").config();
const { tokenSign, tokenVerify } = require("../util/handlerJWT");
const { matchedData } = require("express-validator");
const nodemailer = require("nodemailer");

const {
  allUsers,
  usersById,
  newUser,
  userDelete,
  userUpdate,
  userLogin,
} = require("../users/usersModels");

const { hashPassword, checkPassword } = require("../util/handlerPassword");

// getAllUsers --------------------------

const getAllUsers = async (req, res, next) => {
  const dbResponse = await allUsers();
  if (dbResponse instanceof Error) return next(error);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

// userById ------------------------

const getUserById = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const dbResponse = await usersById(+req.params.id);
  if (dbResponse instanceof Error) return next(error);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

// register --------------------

const register = async (req, res, next) => {
  const cleanBody = matchedData(req);

  const image = `${process.env.public_url}/${req.file.filename}`;
  const password = await hashPassword(cleanBody.password);

  const dbResponse = await newUser({ ...cleanBody, password, image });

  if (dbResponse instanceof Error) return next(dbResponse);

  const user = {
    id: cleanBody.id,
    name: cleanBody.name,
    email: cleanBody.email,
  };

  const tokenData = {
    token: await tokenSign(user),
    user: user,
  };
  res.status(200).json({
    message: `User create ${cleanBody.name} !!!`,
    token_info: tokenData,
  });
  next(dbResponse);
};

// deleteUser ----------------------

const deleteUser = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const dbResponse = await userDelete(+req.params.id);
  if (dbResponse instanceof Error) next(dbResponse);
  dbResponse.affectedRows ? res.status(200).end() : next();
};

// updateUser -------------------------

const updateUser = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const image = `${process.env.public_url}/${req.file.filename}`;
  const password = await hashPassword(req.body.password);
  const dbResponse = await userUpdate(+req.params.id, {
    ...req.body,
    password,
    image,
  });
  if (dbResponse instanceof Error) next(dbResponse);
  dbResponse.affectedRows ? res.status(200).json(req.body) : next();
};

// login --------------------------------

const loginUser = async (req, res, next) => {
  const dbResponse = await userLogin(req.body.email);

  if (!dbResponse.length) return next();

  const passwordMatch = await checkPassword(
    req.body.password,
    dbResponse[0].password
  );

  if (passwordMatch) {
    const user = {
      id: dbResponse[0].id,
      name: dbResponse[0].name,
      email: dbResponse[0].email,
    };

    const tokenData = {
      token: await tokenSign(user),
      user: user,
    };
    console.log(user.id);
    res
      .status(200)
      .json({ message: `User ${user.name} authorized`, jwt: tokenData });
  } else {
    let error = new Error("Unauthorized");
    error.status = 401;
    next();
  }
};

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fbb491f55e5afb",
    pass: "7f87026381af37",
  },
});

// FORGOT PASSWORD ------------------------

const public_url = process.env.public_url;

const forgot = async (req, res, next) => {
  const dbResponse = await userLogin(req.body.email);
  console.log(dbResponse);
  if (!dbResponse.length) return next();

  const user = {
    id: dbResponse[0].id,
    name: dbResponse[0].name,
    email: dbResponse[0].email,
  };

  const token = await tokenSign(user, "15m");
  const link = `${public_url}/user/reset/${token}`;

  let mailDetails = {
    form: "tech.support@splinter.com",
    to: user.email,
    subject: `<h2>"Password Recovery with link"</h2>`,
    html: `<p>To reset your password, please click on the link and follow instructions
      <a href="${link}">Click recover your password</a></p>`,
  };

  transport.sendMail(mailDetails, (error, data) => {
    if (error) {
      error.message = "Internal Server Error";
      return next(error);
    } else {
      res.status(200).json({
        message: `Hi ${user.name} we ve send email with instructions to ${user.email} Hurry up...`,
      });
    }
  });
};

//FORM -> reset password
const reset = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) {
    res.status(403).json({ message: "Token expired" });
  } else {
    res.render("reset", { tokenStatus, token });
  }
};

//Saves the new password
const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) return res.send(tokenStatus);
  const newPassword = await hashPassword(req.body.password_1);
  dbResponse = await changePasswordById(tokenStatus.id, newPassword);
  dbResponse instanceof Error
    ? next(dbResponse)
    : res
        .status(200)
        .json({ message: `Password changed for user ${tokenStatus.name}` });
};

module.exports = {
  getAllUsers,
  getUserById,
  register,
  deleteUser,
  updateUser,
  loginUser,
  forgot,
  reset,
  saveNewPass
};
