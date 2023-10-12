import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: "",
      site: "",
      date: new Date(),
      white: "",
      black: "",
      result: "",
      whiteelo: 0,
      blackelo: 0,
      timecontrol: "",
      endtime: "",
      termination: "",
      moves: "",
      users: [],
    };
  }

  //   onChangeUsername(e) {
  //     this.setState({
  //         username: e.target.value
  //     })
  //   }

  render() {
    return (
      <div className="main">
        <p>You are on the Login component</p>
      </div>
    );
  }
}
