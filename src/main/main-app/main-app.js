import React, { Component } from "react";
import "./main-app.css";
import Loader from "../../assets/widgets/loader/loader";
import { _database } from "../../config";
import Home from "./app-home/app-home";
export default class MainApp extends Component {
  constructor() {
    super();
    this.state = {
      auth: false,
      inputPin: "",
      userPin: "",
      showError: null,
      displayPin: "",
    };
  }
  async componentDidMount() {
    await _database.ref("pin").once("value", (x) => {
      this.setState({ loading: false, userPin: "" + x.val() });
    });
  }
  async addValue(x) {
    if (this.state.inputPin.length === 0) {
      this.setState({
        inputPin: `${x}`,
        displayPin: this.state.displayPin + "*",
      });
    } else {
      this.setState({
        inputPin: this.state.inputPin + `${x}`,
        displayPin: this.state.displayPin + "*",
      });
    }
    await setTimeout(async () => {
      console.log(this.state.inputPin);
      if (this.state.inputPin.length >= 4) {
        await this.validatePin();
      }
    }, 500);
  }
  async validatePin() {
    if (this.state.inputPin.replace("x", "") === this.state.userPin) {
      this.props.showTimedToast("Authentication Success");
      this.setState({
        inputPin: "",
        displayPin: "",
      });
      await setTimeout(() => {
        this.setState({ auth: true });
      }, 500);
    } else {
      this.props.showTimedToast("Invalid Entry");
      this.setState({
        inputPin: "",
        displayPin: "",
      });
    }
  }
  render() {
    return this.state.auth === false ? (
      <div className="admin-body">
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              <img
                src={require("../../assets/drawables/icon.png").default}
                alt=""
                className="logo unselectable"
              />
              <p className="title unselectable">Authenticate</p>
              <p className="sub-title unselectable">Enter pin to sign in</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "10px",
              }}
            >
              <div className="pin-pad">
                <div className="pad">
                  <div className="circle">
                    <h3> {this.state.displayPin} </h3>
                  </div>
                </div>
              </div>
              <div className="input-pad">
                <div className="pad">
                  <div className="line">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("1");
                      }}
                    >
                      1
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("2");
                      }}
                    >
                      2
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("3");
                      }}
                    >
                      3
                    </p>
                  </div>
                  <div className="line">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("4");
                      }}
                    >
                      4
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("5");
                      }}
                    >
                      5
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("6");
                      }}
                    >
                      6
                    </p>
                  </div>
                  <div className="line">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("7");
                      }}
                    >
                      7
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("8");
                      }}
                    >
                      8
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("9");
                      }}
                    >
                      9
                    </p>
                  </div>
                  <div className="line">
                    <p
                      className="unselectable"
                      onClick={() => {
                        this.setState({ inputPin: "", displayPin: "" });
                      }}
                    >
                      Clear
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await this.addValue("0");
                      }}
                    >
                      0
                    </p>
                    <p
                      className="unselectable"
                      onClick={async () => {
                        const disp = this.state.displayPin;
                        const pin = this.state.inputPin;
                        await this.setState({
                          displayPin: disp.substring(0, disp.length - 1),
                          inputPin: pin.substring(0, pin.length - 1),
                        });
                      }}
                    >
                      Del
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </>
        )}
      </div>
    ) : (
      <Home
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
      />
    );
  }
}
