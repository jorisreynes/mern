import React, { Component } from "react";
import axios from "axios";
import "./games-list.css";

export default class GamesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			games: [],
			mostFrequentUsername: "",
			gamesBullet: [],
			gamesBlitz: [],
			gamesRapid: [],
		};
	}

	componentDidMount() {
		axios
			.get("http://127.0.0.1:5000/games/")
			.then((response) => {
				this.setState({ games: response.data });

				// Find the players's username
				this.findPlayerUsername(response.data);

				// Separate games based on time control
				this.separateGamesByTimeControl(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	findPlayerUsername(gamesData) {
		// create an empty list
		let allUsernames = [];

		// For each game
		for (const gameData of gamesData) {
			// we put all usernames in the list
			allUsernames.push(gameData.white, gameData.black);
		}

		// We sort the list
		allUsernames.sort();

		// frequency count for each username
		const usernameFrequency = {};
		allUsernames.forEach((username) => {
			usernameFrequency[username] =
				(usernameFrequency[username] || 0) + 1;
		});

		// find the username that appears the most
		const mostFrequentUsername = Object.keys(usernameFrequency).reduce(
			(a, b) => (usernameFrequency[a] > usernameFrequency[b] ? a : b)
		);

		// we register the value of mostFrequentUsername
		this.setState({ mostFrequentUsername });
	}

	separateGamesByTimeControl(gamesData) {
		const gamesBullet = [];
		const gamesBlitz = [];
		const gamesRapid = [];

		// For each game
		for (const gameData of gamesData) {
			const timeControl = gameData.timecontrol;

			// Determine the time control and add the game to the corresponding array
			if (
				timeControl === "60" ||
				timeControl === "60+1" ||
				timeControl === "120+1"
			) {
				gamesBullet.push(gameData);
			} else if (
				timeControl === "180" ||
				timeControl === "180+2" ||
				timeControl === "300"
			) {
				gamesBlitz.push(gameData);
			} else if (
				timeControl === "600" ||
				timeControl === "900+10" ||
				timeControl === "1800"
			) {
				gamesRapid.push(gameData);
			}
		}

		// Set the state with the separated games
		this.setState({ gamesBullet, gamesBlitz, gamesRapid });

		// Calculate and set the results
		this.calculateResults(gamesBullet, "bulletResults");
		this.calculateResults(gamesBlitz, "blitzResults");
		this.calculateResults(gamesRapid, "rapidResults");
	}

	calculateResults(gamesArray, resultType) {
		let won = 0;
		let drawn = 0;
		let lost = 0;

		// For each game in the specified array
		for (const gameData of gamesArray) {
			// Determine the result based on termination
			if (gameData.termination.includes("gagné")) {
				won++;
			} else if (gameData.termination.includes("nulle")) {
				drawn++;
			} else {
				lost++;
			}
		}
		// Set the state with the calculated results
		this.setState({
			[resultType]: {
				won,
				drawn,
				lost,
			},
		});
	}

	render() {
		const {
			games,
			mostFrequentUsername,
			gamesBullet,
			gamesBlitz,
			gamesRapid,
		} = this.state;

		return (
			<div className="main">
				<div className="topResults">
					<h1>Welcome {mostFrequentUsername}</h1>
					<h2>
						Number of your games in the database: {games.length}
					</h2>
				</div>

				<div className="bulletResults">
					<p>Games Bullet (60, 60+1, 120+1): {gamesBullet.length}</p>
				</div>

				<div className="blitzResults">
					<p>Games Blitz (180): {gamesBlitz.length}</p>
				</div>

				<div className="rapidResults">
					<p>Games Rapid (600): {gamesRapid.length}</p>
				</div>
			</div>
		);
	}
}
