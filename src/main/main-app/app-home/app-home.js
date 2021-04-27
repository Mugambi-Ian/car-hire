import React, { Component } from "react";
import Customers from "./customers/customers";
import Vehicles from "./vehicles/vehicles";
import "./app-home.css";
import Hire from "./hire/hire";

export default class Home extends Component {
  state = {
    activeScreen: "vehicles",
  };
  render() {
    return (
      <div className="main-app">
        <div className="nav-bar">
          <div
            className={
              this.state.activeScreen !== "vehicles"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "vehicles") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "vehicles",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-wheel.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Vehicles</p>
          </div>
          <div
            className={
              this.state.activeScreen !== "Customers"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "Customers") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "Customers",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-customer.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Customers</p>
          </div>

          <div
            style={{
              height: "1px",
              marginLeft: "30px",
              marginRight: "30px",
              backgroundColor: "#000",
              marginTop: "10px",
            }}
          />
          <div
            className={
              this.state.activeScreen !== "hire"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "hire") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "hire",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-hire.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Hire Out</p>
          </div>
          <div
            className={
              this.state.activeScreen !== "reciepts"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "reciepts") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "reciepts",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-receipt.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Reciepts</p>
          </div>
          <div
            style={{
              height: "1px",
              marginLeft: "30px",
              marginRight: "30px",
              backgroundColor: "#000",
              marginTop: "10px",
            }}
          />
          <div className="nav-item" onClick={async () => {}}>
            <img
              src={require("../../../assets/drawables/ic-exit.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Exit</p>
          </div>
          <img
            className="icon unselectable"
            draggable={false}
            alt="logo"
            src={require("../../../assets/drawables/icon.png").default}
          />
          <img
            className="logo unselectable"
            draggable={false}
            alt="logo"
            src={require("../../../assets/drawables/logo.png").default}
          />
        </div>
        <div className="app-content">
          {this.state.activeScreen === "vehicles" ? (
            <Vehicles
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
            />
          ) : this.state.activeScreen === "Customers" ? (
            <Customers
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
            />
          ) : this.state.activeScreen === "hire" ? (
            <Hire
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
            />
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>
      </div>
    );
  }
}
