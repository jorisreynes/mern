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

// Route pour récupérer un jeu par son ID
router.route("/:id").get((req, res) => {
  Game.findById(req.params.id)
    .then((game) => res.json(game))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route pour supprimer un jeu par son ID
router.route("/:id").delete((req, res) => {
  Game.findByIdAndDelete(req.params.id)
    .then(() => res.json("Game deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route pour mettre à jour un jeu par son ID
router.route("/update/:id").post((req, res) => {
  Game.findById(req.params.id)
    .then((game) => {
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

      // Mise à jour des propriétés du jeu avec les nouvelles données
      game.event = event;
      game.site = site;
      game.date = date;
      game.white = white;
      game.black = black;
      game.result = result;
      game.whiteelo = whiteelo;
      game.blackelo = blackelo;
      game.timecontrol = timecontrol;
      game.endtime = endtime;
      game.termination = termination;
      game.moves = moves;

      // Sauvegarde du jeu mis à jour
      game
        .save()
        .then(() => res.json("Game updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
