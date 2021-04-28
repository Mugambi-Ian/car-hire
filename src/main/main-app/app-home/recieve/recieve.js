import React, { Component } from "react";
import Loader from "../../../../assets/widgets/loader/loader";
import { formatDate, _database } from "../../../../config";
import Complete from "./complete/complete";

export default class Recieve extends Component {
  state = {
    loading: true,
    hired: [],
  };
  async componentDidMount() {
    this.db = _database.ref();
    await this.db.on("value", (x) => {
      const aps = [];
      x.child("hire-out").forEach((i) => {
        const {
          totalCost,
          customerId,
          vehicleId,
          startDate,
          endDate,
          recieptId,
          c = {},
          v = {},
        } = i.val();
        const r = {
          totalCost,
          customerId,
          vehicleId,
          startDate,
          endDate,
          recieptId,
          c,
          v,
        };
        r.c = x.child("customers/data/" + r.customerId).val();
        r.v = x.child("vehicles/data/" + r.vehicleId).val();
        aps.push(r);
      });
      this.setState({
        loading: false,
        currentHires: aps,
      });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }

  currentHires(d, i) {
    return (
      <div className="customer-item" key={i}>
        <img
          src={
            d.c.customerDp
              ? d.c.customerDp
              : require("../../../../assets/drawables/ic-wheel.png").default
          }
          alt=""
          draggable={false}
          className="customer-image unselectable"
        />
        <p className="customer-name unselectable">{d.c.customerName}</p>
        <p className="customer-desc unselectable">
          Vehicle Name: {d.v.vehicleName}
        </p>
        <p className="customer-desc unselectable">
          Vehicle Type: {d.v.vehicleType}
        </p>
        <p className="customer-desc unselectable">
          Start Date: {formatDate(d.startDate)}
        </p>
        <p className="customer-desc unselectable">
          End Date: {formatDate(d.endDate)}
        </p>
        <p className="customer-desc unselectable">
          Number Plate: {d.v.numberPlate}
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
              this.setState({ recieve: d });
            }, 200);
          }}
        >
          <img
            src={require("../../../../assets/drawables/ic-hire.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Recieve</p>
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
            Recieve Vehicle
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
            this.state.currentHires.map((d, i) => {
              return this.currentHires(d, i);
            })
          )}
        </div>
        {this.state.recieve ? (
          <Complete
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            customer={this.state.recieve.c}
            vehicle={this.state.recieve.v}
            recieve={this.state.recieve}
            close={() => {
              this.setState({ recieve: undefined });
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
