import React, { Component } from "react";
import axios from "axios";

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
      usernameFrequency[username] = (usernameFrequency[username] || 0) + 1;
    });

    // find the username that appears the most
    const mostFrequentUsername = Object.keys(usernameFrequency).reduce((a, b) =>
      usernameFrequency[a] > usernameFrequency[b] ? a : b
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
      if (timeControl.includes("60") || timeControl.includes("120")) {
        gamesBullet.push(gameData);
      } else if (timeControl.includes("180")) {
        gamesBlitz.push(gameData);
      } else if (timeControl.includes("600")) {
        gamesRapid.push(gameData);
      }
    }

    // Set the state with the separated games
    this.setState({ gamesBullet, gamesBlitz, gamesRapid });
  }

  render() {
    const { mostFrequentUsername, gamesBullet, gamesBlitz, gamesRapid } =
      this.state;

    return (
      <div className="main">
        <p>Welcome {mostFrequentUsername}</p>
        <p>
          Number of your games in the database:{" "}
          {gamesBullet.length + gamesBlitz.length + gamesRapid.length}
        </p>

        {/* Display the count for each time control */}
        <p>Games Bullet (60, 60+1, 120+1): {gamesBullet.length}</p>
        <p>Games Blitz (180): {gamesBlitz.length}</p>
        <p>Games Rapid (600): {gamesRapid.length}</p>
      </div>
    );
  }
}
