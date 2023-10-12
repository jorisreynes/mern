const router = require("express").Router();
const Game = require("../models/game.model");

// Route pour récupérer tous les jeux
router.route("/").get((req, res) => {
  Game.find()
    .then((games) => res.json(games))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route pour ajouter un nouveau jeu
router.route("/add").post((req, res) => {
  // Extraction des données du corps de la requête
  const {
    event,
    site,
    date,
    white,
    black,
    result,
    whiteelo,
    blackelo,
    timecontrol,
    endtime,
    termination,
    moves,
  } = req.body;

  // Création d'une nouvelle instance de Game avec les données extraites
  const newGame = new Game({
    event,
    site,
    date,
    white,
    black,
    result,
    whiteelo,
    blackelo,
    timecontrol,
    endtime,
    termination,
    moves,
  });

  // Sauvegarde du nouveau jeu
  newGame
    .save()
    .then(() => res.json("Game added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/upload").post((req, res) => {
  console.log(`OKKKKK`);
});

module.exports = router;
