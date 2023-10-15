const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Game = require("../models/game.model");
const logger = require("../logger");

// Upload folder
const uploadDestination = path.join(__dirname, "../uploads/");

// --------------------------------------------------------------------------------------------------

// Multer configuration - Multer is used as Middleware to handle the uploaded file
const storage = multer.diskStorage({
	destination: uploadDestination,
	filename: function (req, file, cb) {
		const fileName = "data.txt";

		// Delete the file if it already exists
		const existingFilePath = path.join(uploadDestination, fileName);
		if (fs.existsSync(existingFilePath)) {
			fs.unlinkSync(existingFilePath);
		}

		cb(null, fileName);
	},
});

const upload = multer({ storage: storage });

// --------------------------------------------------------------------------------------------------

// POST route - when the frontend upload the file
router.post("/upload", upload.single("file"), async (req, res) => {
	// we check if the file has been downloaded
	if (!req.file) {
		return res
			.status(400)
			.json({ message: "Aucun fichier n'a été téléchargé." });
	}

	const uploadedFilePath = path.join(uploadDestination, req.file.filename);
	console.log("Fichier téléchargé :", uploadedFilePath);

	// We read the file
	const fileContent = fs.readFileSync(uploadedFilePath, "utf8");

	// We call the main function
	mainFunction(fileContent);

	res.json({
		message: "Fichier téléchargé avec succès.",
		filePath: uploadedFilePath,
	});
});

// --------------------------------------------------------------------------------------------------

const mainFunction = (fileContent) => {
	// We split the file in parts. filter(Boolean) is used to delete the empty elements in the array created by split("\r\n")
	const gamesData = fileContent.split("\r\n").filter(Boolean);

	// Initialize an array to store all usernames from all games
	let allUsernames = [];

	// For each game
	for (const gameData of gamesData) {
		const currentGame = transformGameData(gameData);
		saveGameToDatabase(currentGame);

		// Add usernames to the array
		allUsernames = allUsernames.concat([
			currentGame.White,
			currentGame.Black,
		]);
	}

	// Analyze the frequency of usernames outside the loop
	findPlayertUsername(allUsernames);
};

// --------------------------------------------------------------------------------------------------

// We transform the data game into an object
const transformGameData = (gameData) => {
	const currentGame = {};
	const lines = gameData.split("\n");

	for (const line of lines) {
		if (line.startsWith("[")) {
			const key = line.slice(1, line.indexOf(" "));
			const value = line.slice(
				line.indexOf('"') + 1,
				line.lastIndexOf('"')
			);

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
			currentGame.Moves = formatMoves(currentGame.Moves, line);
		}
	}

	// Ajouter le champ dateandendtime
	currentGame.dateandendtime = currentGame.Date + " " + currentGame.EndTime;

	return currentGame;
};

// --------------------------------------------------------------------------------------------------

// Analyze the frequency of usernames
const findPlayertUsername = (usernames) => {
	// Filtrer les pseudos vides ou non définis
	const validUsernames = usernames.filter((username) => username);

	// Initialiser un objet pour compter la fréquence des pseudos
	const usernameFrequency = {};

	// Compter la fréquence de chaque pseudo
	validUsernames.forEach((username) => {
		usernameFrequency[username] = (usernameFrequency[username] || 0) + 1;
	});

	// Trier la liste des pseudos par fréquence décroissante
	const sortedUsernames = Object.keys(usernameFrequency).sort(
		(a, b) => usernameFrequency[b] - usernameFrequency[a]
	);

	// Obtenir le pseudo le plus fréquent
	const mostFrequentUsername = sortedUsernames[0];

	// Afficher le pseudo le plus fréquent dans la console
	console.log("Pseudo le plus fréquent :", mostFrequentUsername);
};

// --------------------------------------------------------------------------------------------------

const formatMoves = (currentMoves, line) => {
	currentMoves = currentMoves ? currentMoves + line + " " : line + " ";

	// Regex to delete what is inside {}
	const cleanedString = currentMoves.replace(/\{[^}]+\}/g, "");

	// Split the string into an array of moves
	const movesArray = cleanedString.split(" ");

	// Filter out moves containing "..."
	const filteredMovesList = movesArray.filter(
		(move) => !move.includes("...")
	);

	// Join the filtered moves into a string
	const filteredMoves = filteredMovesList.join(" ");

	// Replace double spaces with single space
	return filteredMoves.replace(/  /g, " ");
};

// --------------------------------------------------------------------------------------------------

const saveGameToDatabase = async (currentGame) => {
	// We add the dame to the database
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
			moves: currentGame.Moves,
			dateandendtime: currentGame.dateandendtime,
		});

		await game.save();
		console.log("Jeu ajouté à la base de données");
	} catch (error) {
		console.error(
			"Erreur lors de l'ajout du jeu à la base de données :",
			error.message
		);
		logger.info(
			"Erreur lors de l'ajout du jeu à la base de données :" +
				error.message +
				" /n currentGame: " +
				currentGame
		);
	}
};

// --------------------------------------------------------------------------------------------------

module.exports = router;
