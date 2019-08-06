const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const posts = require("./routes/api/Posts");

const app = express();

//Bodyparser Middleware
app.use(bodyParser.json());

// Configuracion DB (Link a md atlas en nube)
const db = require("./config/keys").mongoURI;

// Conectar a Mongo
mongoose.set('useFindAndModify', false);

mongoose
  .connect(db,{ useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Usar Rutas (despues de /api/posts/ uso ese Backend)
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

// Inicio servidor local
app.listen(port, () => console.log(`Server Started on port ${port}`));
