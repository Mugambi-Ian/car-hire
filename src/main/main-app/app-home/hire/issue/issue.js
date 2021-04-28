import React, { Component } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "./issue.css";
import { getAge, getDate, getDays, _database } from "../../../../../config";

export default class Issue extends Component {
  state = { startDate: new Date(), endDate: new Date(), currentCustomer: null };
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
    return getAge(this.state.currentCustomer.dateOfBirth);
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
  render() {
    return (
      <div className={this.state.close ? "issue-body close" : "issue-body"}>
        <div className="customer-container">
          <p
            className="title unselectable"
            style={{
              margin: 0,
              marginLeft: "10px",
              marginBottom: "20px",
            }}
          >
            Select Customer Account
          </p>
          <Autocomplete
            id="combo-box-demo"
            options={this.props.customers}
            getOptionLabel={(option) => option.customerName}
            style={{ width: 300, alignSelf: "center" }}
            clearOnEscape
            onChange={(e, values) => {
              this.setState({
                currentCustomer: values,
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="customerName" variant="outlined" />
            )}
          />
          {this.state.currentCustomer ? (
            <div
              style={{
                display: "flex",
                alignSelf: "center",
                marginTop: "auto",
                marginBottom: "auto",
                animation:
                  "fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
              }}
            >
              <img
                className="dp unselectable"
                alt=""
                src={this.state.currentCustomer.customerDp}
              />
              <div
                style={{
                  margin: "10px",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <p className="customer-desc unselectable">
                  Id Number: {this.state.currentCustomer.idNumber}
                </p>
                <p className="customer-desc unselectable">
                  Phone Number: {this.state.currentCustomer.phoneNumber}
                </p>
                <p className="customer-desc unselectable">
                  Email : {this.state.currentCustomer.email}
                </p>
                <p className="customer-desc unselectable">
                  Age : {this.getAge()}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
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
          {this.state.currentCustomer ? (
            <>
              <div style={{ display: "flex" }}>
                <DateRange
                  ranges={[
                    {
                      startDate: this.state.startDate,
                      endDate: this.state.endDate,
                      key: "selection",
                    },
                  ]}
                  onChange={(e) => {
                    console.log(e);
                    this.setState({
                      startDate: e.selection.startDate,
                      endDate: e.selection.endDate,
                    });
                  }}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  moveRangeOnFirstSelection={false}
                />
                <div className="footer">
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
                  <p className="price unselectable">
                    To Pay: £ {this.getToPay()}
                  </p>
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
                      const ch = {
                        totalCost: this.getToPay(),
                        customerId: this.state.currentCustomer.customerId,
                        vehicleId: this.props.vehicle.vehicleId,
                        startDate: getDate(this.state.startDate),
                        endDate: getDate(this.state.endDate),
                        recieptId: "",
                      };
                      ch.recieptId = (
                        await _database.ref("hire-out").push()
                      ).key;
                      await _database.ref("hire-out/" + ch.recieptId).set(ch);
                      await _database
                        .ref("customers/active/" + ch.customerId)
                        .set(null);
                      await _database
                        .ref("vehicles/active/  " + ch.vehicleId)
                        .set(null);
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
            </>
          ) : (
            ""
          )}
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
