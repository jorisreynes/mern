const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Dossier de destination pour les fichiers téléchargés
const uploadDestination = path.join(__dirname, "../uploads/");

// Configurations pour multer
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    // Nom de fichier unique basé sur le timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Multer est utilisé comme middleware pour gérer le fichier téléchargé
router.post("/upload", upload.single("file"), (req, res) => {
  // Vérifiez si un fichier a été téléchargé
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Aucun fichier n'a été téléchargé." });
  }

  // Fichier téléchargé avec succès
  const uploadedFilePath = path.join(uploadDestination, req.file.filename);
  console.log("Fichier téléchargé :", uploadedFilePath);

  res.json({
    message: "Fichier téléchargé avec succès.",
    filePath: uploadedFilePath,
  });
});

module.exports = router;
