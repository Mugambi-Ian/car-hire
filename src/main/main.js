import React, { Component } from "react";
import Toast, { toast } from "../assets/widgets/toast/toast";
import MainApp from "./main-app/main-app";
import Splash from "./main-splash/main-splash";
import "./main.css";
export default class App extends Component {
  state = {
    activeSplash: true,
    toast: toast,
  };
  showTimedToast(message) {
    const toast = {
      showToast: true,
      toastMessage: message,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  showUnTimedToast() {
    const toast = {
      showToast: true,
      toastTimed: false,
    };
    this.setState({ toast: toast });
  }
  closeToast() {
    const toast = {
      showToast: false,
      toastMessage: this.state.toast.toastMessage,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  render() {
    return (
      <div className="main-body">
        {this.state.activeSplash === true ? (
          <Splash
            closeSplash={() => {
              this.setState({ activeSplash: false });
            }}
          />
        ) : (
          <MainApp
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
          />
        )}
        {this.state.toast.showToast ? (
          <Toast
            timed={this.state.toast.toastTimed}
            message={this.state.toast.toastMessage}
            closeToast={this.closeToast.bind(this)}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
