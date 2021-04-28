import React, { Component } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { Calendar } from "react-date-range";
import {
  formatDate,
  getAge,
  getDate,
  getDays,
  _database,
} from "../../../../../config";
import moment from "moment";

export default class Complete extends Component {
  state = {
    startDate: moment(this.props.recieve.startDate, "DD-MM-YYYY").toDate(),
    endDate: new Date(),
  };
  getCost() {
    return parseFloat(
      this.props.vehicle.ratePerDay *
        getDays(this.state.startDate, this.state.endDate)
    ).toFixed(2);
  }
  getDiscount(cost) {
    const a = this.getAge();
    let c = "",
      v = 0;
    if (a < 25) {
      v = 0.09 * cost;
      c = "Insurance Charge: £ ";
    } else if (a > 50) {
      v = 0.09 * cost;
      c = "Discount: £ ";
    } else {
      v = 0;
      c = "Discount: £ ";
    }
    v = parseFloat(v).toFixed(2);
    return c + v;
  }
  getAge() {
    return getAge(this.props.customer.dateOfBirth);
  }
  getToPay() {
    const a = this.getAge();
    let cost = this.getCost();
    if (a < 25) {
      return parseFloat(1.09 * cost).toFixed(2);
    } else if (a > 50) {
      return parseFloat(0.91 * cost).toFixed(2);
    } else {
      return parseFloat(cost).toFixed(2);
    }
  }
  getStartDate() {
    return this.state.startDate;
  }
  render() {
    return (
      <div className={this.state.close ? "issue-body close" : "issue-body"}>
        <div className="rental-details">
          <p
            className="title unselectable"
            style={{
              margin: 0,
              marginLeft: "30px",
              alignSelf: "flex-start",
              marginBottom: "20px",
            }}
          >
            Duration of Hire
          </p>
          <div style={{ display: "flex" }}>
            <Calendar
              onChange={(e) => {
                console.log(e);
                this.setState({
                  endDate: e,
                });
              }}
              endDate={this.state.endDate}
              minDate={this.getStartDate()}
              moveRangeOnFirstSelection={false}
            />
            <div className="footer">
              <p className="cost unselectable">
                Date Collected: {formatDate(this.props.recieve.startDate)}
              </p>
              <p className="cost unselectable">
                Number Of Days:{" "}
                {getDays(this.state.startDate, this.state.endDate)}
              </p>
              <p className="cost unselectable">
                Total Cost: £ {this.getCost()}
              </p>
              <p className="cost unselectable">
                {this.getDiscount(this.getCost())}
              </p>
              <p className="price unselectable">To Pay: £ {this.getToPay()}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "280px",
              alignSelf: "center",
              maxHeight: "40px",
              marginTop: "30px",
            }}
          >
            <div
              className="customer-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await setTimeout(async () => {
                  const ch = this.props.recieve;
                  ch.endDate = getDate(this.state.endDate);
                  ch.totalCost = this.getToPay();
                  ch.c = null;
                  ch.v = null;
                  await _database.ref("reciepts/" + ch.recieptId + "/").set(ch);
                  await _database.ref("hire-out/" + ch.recieptId).set(null);
                  await _database
                    .ref("customers/active/" + ch.customerId)
                    .set(ch.customerId);
                  await _database
                    .ref("vehicles/active/  " + ch.vehicleId)
                    .set(ch.vehicleId);
                  this.props.showTimedToast("Successfull");
                  this.setState({ close: true });
                  await setTimeout(() => {
                    this.props.close();
                  }, 400);
                }, 100);
              }}
            >
              <img
                src={
                  require("../../../../../assets/drawables/ic-wheel.png")
                    .default
                }
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Process</p>
            </div>
          </div>
        </div>
        <div
          className="close-editing-btn"
          onClick={async () => {
            this.setState({ close: true });
            await setTimeout(() => {
              this.props.close();
            }, 400);
          }}
        >
          <img
            className="unselectable"
            draggable={false}
            alt=""
            src={require("../../../../../assets/drawables/ic-exit.png").default}
          />
          <p className="unselectable">Close</p>
        </div>
      </div>
    );
  }
}
