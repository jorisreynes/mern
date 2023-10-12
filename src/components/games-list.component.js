import React, { Component } from "react";
import axios from "axios";

export default class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://127.0.0.1:5000/games/")
      .then((response) => {
        this.setState({ games: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div class="main">
        <p>You are on the Games List component</p>
      </div>
    );
  }
}
