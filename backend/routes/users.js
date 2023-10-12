// Importation du module de routage d'Express
const router = require("express").Router();

// Importation du modèle User défini dans le fichier user.model.js
let User = require("../models/user.model");

// Route GET pour récupérer tous les utilisateurs
router.route("/").get((req, res) => {
  // Utilisation de la méthode find() de Mongoose pour récupérer tous les utilisateurs
  User.find()
    .then((users) => res.json(users)) // Envoie les utilisateurs au format JSON en cas de succès
    .catch((err) => res.status(400).json("Error: " + err)); // Envoie une réponse d'erreur en cas d'échec
});

// Route POST pour ajouter un nouvel utilisateur
router.route("/add").post((req, res) => {
  // Extraction du nom d'utilisateur du corps de la requête
  const username = req.body.username;

  // Création d'une nouvelle instance de User avec le nom d'utilisateur extrait
  const newUser = new User({ username });

  // Utilisation de la méthode save() pour enregistrer le nouvel utilisateur dans la base de données
  newUser
    .save()
    .then(() => res.json("User added!")) // Envoie une réponse JSON en cas de succès
    .catch((err) => res.status(400).json("Error: " + err)); // Envoie une réponse d'erreur en cas d'échec
});

// Exportation du routeur pour une utilisation dans d'autres parties de l'application
module.exports = router;
