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
    // Transforme les données de jeu en JSON
    const gameInfo = gameData.split("\n").reduce((info, line) => {
      const [key, ...valueParts] = line.split(" ");
      const value = valueParts.join(" ");
      //info[key.slice(1, 0)] = value.slice(1, 0);
      info[key.slice(1)] = value.slice(1, -2);
      return info;
    }, {});

    console.log(gameInfo);

    // Enregistre le jeu dans la base de données
    try {
      const game = new Game({
        event: gameInfo.Event,
        site: gameInfo.Site,
        date: gameInfo.Date,
        white: gameInfo.White,
        black: gameInfo.Black,
        result: gameInfo.Result,
        whiteelo: parseInt(gameInfo.WhiteElo),
        blackelo: parseInt(gameInfo.BlackElo),
        timecontrol: gameInfo.TimeControl,
        endtime: gameInfo.EndTime,
        termination: gameInfo.Termination,
        moves: gameData, // Ajoute toutes les données du jeu
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
