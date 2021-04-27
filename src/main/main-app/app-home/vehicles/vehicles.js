import React, { Component } from "react";
import Loader from "../../../../assets/widgets/loader/loader";
import Switch from "react-switch";
import { _database, _storage, validField } from "../../../../config";
import { dateToday } from "../../../../config/date-handler";
import { ImageUploader } from "../customers/customers";

var src = undefined;
export default class Vehicles extends Component {
  state = {
    activeVehicles: [],
    deactivatedVehicles: [],
    editing: undefined,
    loading: true,
    currentList: "active",
  };
  async componentDidMount() {
    this.db = _database.ref("vehicles");
    await this.db.on("value", (x) => {
      const aps = [];
      if (x.hasChild("active")) {
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
      }
      const dps = [];
      if (x.hasChild("deactivated")) {
        x.child("deactivated").forEach((i) => {
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
          dps.push({
            vehicleId,
            vehicleName,
            createdOn,
            ratePerDay,
            defaultCharge,
            vehicleType,
            numberPlate,

            vehicleDp,
          });
        });
      }
      this.setState({
        loading: false,
        activeVehicles: aps,
        deactivatedVehicles: dps,
      });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }
  deactivatedVehicle_(d, i) {
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
        <p className="customer-desc unselectable">Added On: {d.createdOn}</p>
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
            const a = this.state.deactivatedVehicles;
            a.splice(i, 1);
            const _d = this.state.activeVehicles;
            _d.push(d);
            this.setState({
              activeVehicles: _d,
              deactivatedVehicles: a,
            });
            await _database
              .ref("vehicles/deactivated/" + d.vehicleId)
              .set(null)
              .then(async () => {
                await _database
                  .ref("vehicles/active/" + d.vehicleId)
                  .set(d.vehicleId)
                  .then(() => {
                    this.props.showTimedToast(
                      d.vehicleName + " has been enabled"
                    );
                  });
              });
          }}
          style={{ backgroundColor: "red" }}
        >
          <img
            src={require("../../../../assets/drawables/ic-power.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Enable</p>
        </div>
      </div>
    );
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
        <p className="customer-desc unselectable">Added On: {d.createdOn}</p>
        <p className="customer-desc unselectable">
          Vehicle Type: {d.vehicleType}
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
              src = d.vehicleDp;
              this.setState({ editing: d.vehicleId });
            }, 200);
          }}
        >
          <img
            src={require("../../../../assets/drawables/ic-edit.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Edit</p>
        </div>
        <div
          className="customer-btn"
          onClick={async () => {
            const a = this.state.activeVehicles;
            a.splice(i, 1);
            const _d = this.state.deactivatedVehicles;
            _d.push(d);
            this.setState({
              activeVehicles: a,
              deactivatedVehicles: _d,
            });
            this.props.showTimedToast(d.vehicleName + " has been disabled");
            await _database
              .ref("vehicles/active/" + d.vehicleId)
              .set(null)
              .then(async () => {
                await _database
                  .ref("vehicles/deactivated/" + d.vehicleId)
                  .set(d.vehicleId);
              });
          }}
        >
          <img
            src={require("../../../../assets/drawables/ic-power.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Disable</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="customers-body">
        <div style={{ display: "flex", marginTop: "30px" }}>
          <Switch
            onChange={(x) => {
              if (x === true) {
                this.setState({ currentList: "active" });
              } else {
                this.setState({ currentList: "deactivated" });
              }
            }}
            checked={this.state.currentList === "active" ? true : false}
          />
          <p
            className=" title unselectable"
            style={{ margin: 0, marginLeft: "10px" }}
          >
            {this.state.currentList === "active"
              ? "Vehicles"
              : "Deactivated Vehicles"}
          </p>
        </div>
        {this.state.loading === true ? (
          <Loader />
        ) : this.state.currentList === "active" ? (
          <div className="customers-list">
            {this.state.searching ? (
              this.state.searchResult ? (
                this.state.searchResult.map((d, i) => {
                  return this.activeVehicles_(d, i);
                })
              ) : (
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
              )
            ) : (
              this.state.activeVehicles.map((d, i) => {
                return this.activeVehicles_(d, i);
              })
            )}
          </div>
        ) : (
          <div className="customers-list">
            {this.state.searching ? (
              this.state.searchResult ? (
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
                this.state.searchResult.map((d, i) => {
                  return this.deactivatedVehicle_(d, i);
                })
              )
            ) : (
              this.state.deactivatedVehicles.map((d, i) => {
                return this.deactivatedVehicle_(d, i);
              })
            )}
          </div>
        )}
        <div
          className="new-customer-btn"
          onClick={async () => {
            await setTimeout(() => {
              src = undefined;
              this.setState({ editing: "new" });
            }, 200);
          }}
        >
          <img
            className="unselectable"
            draggable={false}
            alt=""
            src={require("../../../../assets/drawables/ic-add.png").default}
          />
          <p className="unselectable">New Vehicle</p>
        </div>
        {this.state.editing ? (
          <EditVehicle
            vehicleId={this.state.editing}
            close={() => {
              this.setState({ editing: undefined });
            }}
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

class EditVehicle extends Component {
  state = {
    loading: true,
    vehicle: {
      vehicleId: undefined,
      vehicleName: "",
      createdOn: "",
      ratePerDay: 0,
      phoneNumber: "",
      defaultCharge: 2.5,
      numberPlate: "",
      vehicleDp: "",
      vehicleType: "",
    },
    uploadPic: undefined,
  };
  async componentDidMount() {
    var p = this.state.vehicle;
    p.vehicleId = this.props.vehicleId;
    if (p.vehicleId === "new") {
      const k = (await _database.ref("vehicles").push()).key;
      p.vehicleId = k;
      p.createdOn = dateToday();
    }
    await _database.ref("vehicles/data/" + p.vehicleId).on("value", (ds) => {
      if (ds.hasChild("vehicleId")) {
        const {
          vehicleId,
          vehicleName,
          ratePerDay,
          defaultCharge,
          vehicleType,
          numberPlate,
          createdOn,
          vehicleDp,
        } = ds.val();
        const p = {
          vehicleId,
          vehicleName,
          createdOn,
          vehicleDp,
          ratePerDay,
          defaultCharge,
          vehicleType,
          numberPlate,
        };
        this.setState({ vehicle: p, loading: false });
      } else {
        this.setState({ vehicle: p, loading: false });
      }
    });
  }
  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.vehicle.vehicleId + new Date().getTime();
    const uploadTask = _storage
      .ref("vehicles/")
      .child(id + ".jpeg")
      .put(this.state.vehicle.vehicleDp);
    console.log(this.state.vehicle);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(() => {
                  var url = "" + downloadURL;
                  const p = this.state.vehicle;
                  p.vehicleDp = url;
                  this.setState({ vehicle: p, uploadPic: undefined });
                  this.saveVehicle();
                }, 1000);
              }.bind(this)
            )
            .catch(async (e) => {
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }
  async saveVehicle() {
    const {
      createdOn,
      vehicleDp,
      vehicleId,
      vehicleName,
      ratePerDay,
      defaultCharge,
      vehicleType,
      numberPlate,
    } = this.state.vehicle;
    if (
      validField([vehicleName, vehicleType, numberPlate]) &&
      parseFloat(ratePerDay) > 0 &&
      parseFloat(defaultCharge) > 0
    ) {
      await _database
        .ref("vehicles/data/" + vehicleId)
        .once("value", async (x) => {
          await x.ref.child("vehicleId").set(vehicleId);
          await x.ref.child("vehicleDp").set(vehicleDp);
          await x.ref.child("vehicleName").set(vehicleName);
          await x.ref
            .child("ratePerDay")
            .set(parseFloat(ratePerDay).toFixed(2));
          await x.ref
            .child("defaultCharge")
            .set(parseFloat(defaultCharge).toFixed(2));
          await x.ref.child("numberPlate").set(numberPlate);
          await x.ref.child("vehicleType").set(vehicleType);
          await x.ref.child("createdOn").set(createdOn);
        });
      await _database.ref("vehicles/active/" + vehicleId).set(vehicleId);
      this.props.showTimedToast("Save Successfull");
      this.setState({ close: true });
      await setTimeout(() => {
        this.props.close();
      }, 400);
      this.setState({ loading: false });
    } else {
      this.props.showTimedToast("All fields are required");
    }
  }
  render() {
    return (
      <div className={this.state.close ? "edit-body close" : "edit-body"}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {this.state.loading === true ? (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "100px",
                display: "flex",
                width: "100px",
                height: "100px",
                alignSelf: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="content-panel">
          {this.state.vehicle.vehicleId ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginTop: "20px",
                marginRight: "10px",
                marginLeft: "10px",
                animation:
                  "fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
              }}
            >
              <p className="customer-title unselectable">New vehicle</p>
              <ImageUploader
                src_={src}
                src_f={() => {
                  src = undefined;
                }}
                src={() => {
                  return this.state.vehicle.vehicleDp === ""
                    ? require("../../../../assets/drawables/ic-wheel.png")
                        .default
                    : this.state.vehicle.vehicleDp;
                }}
                hideField={() => {
                  this.setState({ hideField: true });
                }}
                showField={() => {
                  this.setState({ hideField: undefined });
                }}
                updateValue={(x) => {
                  fetch(x)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const p = this.state.vehicle;
                      p.vehicleDp = blob;
                      this.setState({ vehicle: p, uploadPic: true });
                    });
                }}
              />
              {this.state.hideField ? (
                ""
              ) : (
                <div className="field">
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Model Name</p>
                    <input
                      value={this.state.vehicle.vehicleName}
                      onChange={(e) => {
                        const p = this.state.vehicle;
                        p.vehicleName = e.target.value;
                        this.setState({ vehicle: p });
                      }}
                      name="vehicleName"
                      placeholder="Model Name"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Vehicle Type</p>
                    <input
                      value={this.state.vehicle.vehicleType}
                      onChange={(e) => {
                        const p = this.state.vehicle;
                        p.vehicleType = e.target.value;
                        this.setState({ vehicle: p });
                      }}
                      name="vehicleName"
                      placeholder="Vehicle Type"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Number Plate</p>
                    <input
                      value={this.state.vehicle.numberPlate}
                      onChange={(e) => {
                        const p = this.state.vehicle;
                        p.numberPlate = e.target.value;
                        this.setState({ vehicle: p });
                      }}
                      name="vehicleName"
                      placeholder="Number Plate"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Rate Per Day</p>
                    <p
                      className="field-title unselectable"
                      style={{
                        width: "min-content",
                        marginRight: "20px",
                        marginLeft: 0,
                      }}
                    >
                      £
                    </p>
                    <input
                      value={this.state.vehicle.ratePerDay}
                      onChange={(e) => {
                        const p = this.state.vehicle;
                        p.ratePerDay = e.target.value;
                        this.setState({ vehicle: p });
                      }}
                      placeholder="Rate Per Day"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Default Rate</p>
                    <input
                      value={this.state.vehicle.defaultCharge}
                      onChange={(e) => {
                        const p = this.state.vehicle;
                        p.defaultCharge = e.target.value;
                        this.setState({ vehicle: p });
                      }}
                      placeholder="Default Rate"
                    />
                    <p
                      className="field-title unselectable"
                      style={{
                        width: "min-content",
                        marginRight: "20px",
                        marginLeft: 0,
                      }}
                    >
                      %
                    </p>
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  width: "280px",
                  alignSelf: "center",
                  maxHeight: "40px",
                }}
              >
                <div
                  className="customer-btn"
                  style={{ flex: 1 }}
                  onClick={async () => {
                    await setTimeout(async () => {
                      if (this.state.uploadPic) {
                        await this.uploadDp();
                      } else {
                        await this.saveVehicle();
                      }
                    }, 100);
                  }}
                >
                  <img
                    src={
                      require("../../../../assets/drawables/ic-save.png")
                        .default
                    }
                    alt=""
                    draggable={false}
                    className="unselectable"
                  />
                  <p className="unselectable">Save</p>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={require("../../../../assets/drawables/logo.png").default}
              alt=""
              className="unselectable"
              style={{
                alignSelf: "center",
                width: "200px",
                objectFit: "contain",
              }}
            />
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
            src={require("../../../../assets/drawables/ic-exit.png").default}
          />
          <p className="unselectable">Close</p>
        </div>
      </div>
    );
  }
}
