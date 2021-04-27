import React, { Component } from "react";
import "./main-splash.css";
export default class Splash extends Component {
  state = {
    animIn: true,
  };

  async componentDidMount() {
    await setTimeout(async () => {
      this.setState({ animIn: false });
      await setTimeout(() => {
        this.props.closeSplash();
      }, 1400);
    }, 2500);
  }
  render() {
    return (
      <div className="splash-body">
        <img
          alt=""
          src={require("../../assets/drawables/logo.png").default}
          className={this.state.animIn === true ? "on-start" : "on-exit"}
        />
      </div>
    );
  }
}
