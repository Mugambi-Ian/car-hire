import React, { Component } from "react";
import Loader from "../../../../assets/widgets/loader/loader";
import { _database } from "../../../../config";
import Issue from "./issue/issue";

export default class Hire extends Component {
  state = {
    loading: true,
  };
  async componentDidMount() {
    this.db = _database.ref("vehicles");
    await this.db.on("value", (x) => {
      const aps = [];
      x.child("active").forEach((i) => {
        const {
          vehicleId,
          vehicleName,
          createdOn,
          vehicleDp,
          ratePerDay,
          defaultCharge,
          vehicleType,
          numberPlate,
        } = x.child("data/" + i.val()).val();
        aps.push({
          vehicleId,
          vehicleName,
          createdOn,
          vehicleDp,
          ratePerDay,
          defaultCharge,
          vehicleType,
          numberPlate,
        });
      });
      this.setState({
        loading: false,
        activeVehicles: aps,
      });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }

  activeVehicles_(d, i) {
    return (
      <div className="customer-item" key={i}>
        <img
          src={
            d.vehicleDp
              ? d.vehicleDp
              : require("../../../../assets/drawables/ic-wheel.png").default
          }
          alt=""
          draggable={false}
          className="customer-image unselectable"
        />
        <p className="customer-name unselectable">{d.vehicleName}</p>
        <p className="customer-desc unselectable">
          Vehicle Type: {d.vehicleType}
        </p>
        <p className="customer-desc unselectable">
          Rate Per Day: £ {d.ratePerDay}
        </p>
        <p className="customer-desc unselectable">
          Default Rate: {d.defaultCharge} %
        </p>
        <p className="customer-desc unselectable">
          Number Plate: {d.numberPlate}
        </p>
        <div
          style={{
            height: "1px",
            backgroundColor: "#000",
            margin: "10px",
          }}
        />
        <div
          className="customer-btn"
          onClick={async () => {
            await setTimeout(() => {
              this.setState({ hireOut: d.vehicleId });
            }, 200);
          }}
        >
          <img
            src={require("../../../../assets/drawables/ic-order.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Issue</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="customers-body">
        <div style={{ display: "flex", marginTop: "30px" }}>
          <p
            className=" title unselectable"
            style={{ margin: 0, marginLeft: "10px" }}
          >
            Rent Car
          </p>
        </div>
        <div className="customers-list">
          {this.state.loading === true ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                width: "95vw",
                height: "70vh",
              }}
            >
              <Loader />
            </div>
          ) : (
            this.state.activeVehicles.map((d, i) => {
              return this.activeVehicles_(d, i);
            })
          )}
        </div>
        {this.state.hireOut ? (
          <Issue
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
