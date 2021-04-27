import React, { Component } from "react";
import "./issue.css";

export default class Issue extends Component {
  render() {
    return (
      <div className="issue-body">
        <div className="customer-container"></div>
        <div className="rental-details"></div>
      </div>
    );
  }
}
