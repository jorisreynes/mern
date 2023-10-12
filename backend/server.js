// Importe le module Express qui facilite la création d'applications web
const express = require("express");

// Importe le module CORS pour gérer les autorisations d'accès à la ressource
const cors = require("cors");

// Importe le module Mongoose qui simplifie les interactions avec MongoDB
const mongoose = require("mongoose");

// Charge les variables d'environnement depuis un fichier .env
require("dotenv").config();

// Crée une instance d'application Express
const app = express();

// Récupère le numéro de port à partir des variables d'environnement ou utilise le port 5000 par défaut
const port = process.env.PORT || 5000;

// Utilise le middleware CORS pour gérer les autorisations d'accès à la ressource
app.use(cors());

// Utilise le middleware pour traiter le corps des requêtes au format JSON
app.use(express.json());

// Récupère l'URI de la base de données MongoDB à partir des variables d'environnement
const uri = process.env.ATLAS_URI;

// Connecte l'application à la base de données MongoDB en utilisant Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
//mongoose.connect(uri);

// Récupère la connexion à la base de données
const connection = mongoose.connection;

// Écoute l'événement "open" qui est émis lorsque la connexion à la base de données est établie
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const gamesRouter = require("./routes/games");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");

app.use("/games", gamesRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);

// Écoute le port spécifié ou le port 5000 par défaut et affiche un message dans la console
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
