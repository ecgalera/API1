const express = require("express");
const server = express();
const userRouter = require("./users/usersRouters")
const postsRouter = require("./posts/postsRouter")
const cors = require("cors")
const hbs = require("express-handlebars")
const path = require("path")


const port = process.env.PORT || 3000;
require("./db/config")

server.listen(port, (err)=>{
    err
    ? console.log(`Error ${err}`)
    : console.log(`Servidor en http://localhost${port}`)
})

// Middleware ---------------------------
server.use(express.json())  // Lo uso para levantar información JSON en un post de un formulario
server.use(express.static("storage"))
server.use(express.urlencoded({ extended: true }))
server.use(cors())

/*Bootstrap files*/
server.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
server.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))

//Handlebars
server.set("view engine", "hbs");
server.set("views", "./views"); //path.join(__dirname, "views")
server.engine("hbs", hbs.engine({ extname: "hbs" }))

// Puerta de ingreso de los router: userRouter---------
server.use("/user", userRouter)
server.use("/posts", postsRouter)

// Manejo de Errores -----------------------------------------------

// 404 Todas las peticiones con 404 entran aca (CATCH ALL ROUTE)
server.use((req, res, next)=>{
   let error = new Error("Resource not found");
   error.status = 404;
   next(error)
});

// Error handler -------------------------------------------------
server.use((error, req,res, next)=>{
    if(!error.status){
        error.status = 500;
    }
    res.status(error.status).json({status: error.status, message: error.message})
});


