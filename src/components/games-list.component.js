import React, { Component } from "react";
import axios from "axios";

export default class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      mostFrequentUsername: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://127.0.0.1:5000/games/")
      .then((response) => {
        this.setState({ games: response.data });

        // Find the players's username
        this.findPlayerUsername(response.data);
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

  render() {
    const { games, mostFrequentUsername } = this.state;
    return (
      <div className="main">
        <p>Welcome {this.state.mostFrequentUsername}</p>
        <p>Number of your games in the database: {games.length}</p>
      </div>
    );
  }
}
