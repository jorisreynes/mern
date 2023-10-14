const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Game = require("../models/game.model"); // Assure-toi que le chemin est correct

// Dossier de destination pour les fichiers téléchargés
const uploadDestination = path.join(__dirname, "../uploads/");

// Configurations pour multer
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    const fileName = "data.txt";

    // Supprimer le fichier existant s'il y en a un
    const existingFilePath = path.join(uploadDestination, fileName);
    if (fs.existsSync(existingFilePath)) {
      fs.unlinkSync(existingFilePath);
    }

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Multer est utilisé comme middleware pour gérer le fichier téléchargé
router.post("/upload", upload.single("file"), async (req, res) => {
  // Vérifiez si un fichier a été téléchargé
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Aucun fichier n'a été téléchargé." });
  }

  // Fichier téléchargé avec succès
  const uploadedFilePath = path.join(uploadDestination, req.file.filename);
  console.log("Fichier téléchargé :", uploadedFilePath);

  // Lire le fichier
  const fileContent = fs.readFileSync(uploadedFilePath, "utf8");

  // Diviser le fichier en parties
  const gamesData = fileContent.split("\n\n");

  // Parcourir chaque partie
  for (const gameData of gamesData) {
    // Transforme les données de jeu en objet
    const currentGame = {};
    const lines = gameData.split("\n");

    // Parcourir chaque ligne
    for (const line of lines) {
      if (line.startsWith("[")) {
        const key = line.slice(1, line.indexOf(" "));
        const value = line.slice(line.indexOf('"') + 1, line.lastIndexOf('"'));

        switch (key) {
          case "Event":
          case "Site":
          case "Date":
          case "Round":
          case "White":
          case "Black":
          case "Result":
          case "TimeControl":
          case "EndTime":
          case "Termination":
            currentGame[key] = value;
            break;
          case "WhiteElo":
          case "BlackElo":
            currentGame[key] = parseInt(value);
            break;
          default:
            break;
        }
      } else if (line.trim() !== "") {
        // Si la ligne n'est pas vide, ajoute-la aux mouvements
        currentGame.Moves = currentGame.Moves
          ? currentGame.Moves + line + " "
          : line + " ";

        // Regex to delete what is inside {}
        const cleanedString = currentGame.Moves.replace(/\{[^}]+\}/g, "");

        // Split the string into an array of moves
        const movesArray = cleanedString.split(" ");

        // Filter out moves containing "..."
        const filteredMovesList = movesArray.filter(
          (move) => !move.includes("...")
        );

        // Join the filtered moves into a string
        const filteredMoves = filteredMovesList.join(" ");

        // Replace double spaces with single space
        currentGame.Moves = filteredMoves.replace(/  /g, " ");
      }
    }

    // Ajoute le jeu à la base de données
    try {
      const game = new Game({
        event: currentGame.Event,
        site: currentGame.Site,
        date: currentGame.Date,
        white: currentGame.White,
        black: currentGame.Black,
        result: currentGame.Result,
        whiteelo: parseInt(currentGame.WhiteElo),
        blackelo: parseInt(currentGame.BlackElo),
        timecontrol: currentGame.TimeControl,
        endtime: currentGame.EndTime,
        termination: currentGame.Termination,
        moves: currentGame.Moves.trim(), // Supprime les espaces inutiles
      });

      await game.save();
      console.log("Jeu ajouté à la base de données.");
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du jeu à la base de données :",
        error.message
      );
    }
  }

  res.json({
    message: "Fichier téléchargé avec succès.",
    filePath: uploadedFilePath,
  });
});

module.exports = router;
