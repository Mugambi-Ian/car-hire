import React, { Component } from "react";
import Loader from "../../../../assets/widgets/loader/loader";
import Slider from "@material-ui/core/Slider";
import Switch from "react-switch";

import Cropper from "react-easy-crop";
import "./customers.css";
import getCroppedImg from "../../../../config/create-image";
import { _database, _storage, validField } from "../../../../config";
import { dateToday } from "../../../../config/date-handler";

var src = undefined;
export default class Customers extends Component {
  state = {
    activeCustomers: [],
    deactivatedCustomers: [],
    editing: undefined,
    loading: true,
    currentList: "active",
  };
  async componentDidMount() {
    this.db = _database.ref("customers");
    await this.db.on("value", (x) => {
      const aps = [];
      if (x.hasChild("active")) {
        x.child("active").forEach((i) => {
          const {
            customerId,
            customerName,
            createdOn,
            customerDp,
            idNumber,
            email,
            dateOfBirth,
            phoneNumber,
          } = x.child("data/" + i.val()).val();
          aps.push({
            customerId,
            customerName,
            createdOn,
            customerDp,
            idNumber,
            email,
            dateOfBirth,
            phoneNumber,
          });
        });
      }
      const dps = [];
      if (x.hasChild("deactivated")) {
        x.child("deactivated").forEach((i) => {
          const {
            customerId,
            customerName,
            createdOn,
            customerDp,
            idNumber,
            email,
            dateOfBirth,
            phoneNumber,
          } = x.child("data/" + i.val()).val();
          dps.push({
            customerId,
            customerName,
            createdOn,
            idNumber,
            email,
            dateOfBirth,
            phoneNumber,
            customerDp,
          });
        });
      }
      this.setState({
        loading: false,
        activeCustomers: aps,
        deactivatedCustomers: dps,
      });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }
  deactivatedCustomer_(d, i) {
    return (
      <div className="customer-item" key={i}>
        <img
          src={
            d.customerDp
              ? d.customerDp
              : require("../../../../assets/drawables/ic-customer.png").default
          }
          alt=""
          draggable={false}
          className="customer-image unselectable"
        />
        <p className="customer-name unselectable">{d.customerName}</p>
        <p className="customer-desc unselectable">Added On: {d.createdOn}</p>

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
            const a = this.state.deactivatedCustomers;
            a.splice(i, 1);
            const _d = this.state.activeCustomers;
            _d.push(d);
            this.setState({
              activeCustomers: _d,
              deactivatedCustomers: a,
            });
            await _database
              .ref("customers/deactivated/" + d.customerId)
              .set(null)
              .then(async () => {
                await _database
                  .ref("customers/active/" + d.customerId)
                  .set(d.customerId)
                  .then(() => {
                    this.props.showTimedToast(
                      d.customerName + " has been enabled"
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
  activeCustomers_(d, i) {
    return (
      <div className="customer-item" key={i}>
        <img
          src={
            d.customerDp
              ? d.customerDp
              : require("../../../../assets/drawables/ic-customer.png").default
          }
          alt=""
          draggable={false}
          className="customer-image unselectable"
        />
        <p className="customer-name unselectable">{d.customerName}</p>
        <p className="customer-desc unselectable">Added On: {d.createdOn}</p>
        <p className="customer-desc unselectable">
          Phone Number: {d.phoneNumber}
        </p>
        <p className="customer-desc unselectable">Email: {d.email}</p>
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
              src = d.customerDp;
              this.setState({ editing: d.customerId });
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
            const a = this.state.activeCustomers;
            a.splice(i, 1);
            const _d = this.state.deactivatedCustomers;
            _d.push(d);
            this.setState({
              activeCustomers: a,
              deactivatedCustomers: _d,
            });
            this.props.showTimedToast(d.customerName + " has been disabled");
            await _database
              .ref("customers/active/" + d.customerId)
              .set(null)
              .then(async () => {
                await _database
                  .ref("customers/deactivated/" + d.customerId)
                  .set(d.customerId);
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
              ? "Customers"
              : "Deactivated Customers"}
          </p>
        </div>
        {this.state.loading === true ? (
          <Loader />
        ) : this.state.currentList === "active" ? (
          <div className="customers-list">
            {this.state.searching ? (
              this.state.searchResult ? (
                this.state.searchResult.map((d, i) => {
                  return this.activeCustomers_(d, i);
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
              this.state.activeCustomers.map((d, i) => {
                return this.activeCustomers_(d, i);
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
                  return this.deactivatedCustomer_(d, i);
                })
              )
            ) : (
              this.state.deactivatedCustomers.map((d, i) => {
                return this.deactivatedCustomer_(d, i);
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
          <p className="unselectable">New Customer</p>
        </div>
        {this.state.editing ? (
          <EditCustomer
            customerId={this.state.editing}
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

class EditCustomer extends Component {
  state = {
    loading: true,
    customer: {
      customerId: undefined,
      customerName: "",
      createdOn: "",
      idNumber: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
    },
    uploadPic: undefined,
  };
  async componentDidMount() {
    var p = this.state.customer;
    p.customerId = this.props.customerId;
    if (p.customerId === "new") {
      const k = (await _database.ref("customers").push()).key;
      p.customerId = k;
      p.createdOn = dateToday();
    }
    await _database.ref("customers/data/" + p.customerId).on("value", (ds) => {
      if (ds.hasChild("customerId")) {
        const {
          customerId,
          customerName,
          idNumber,
          email,
          dateOfBirth,
          phoneNumber,
          createdOn,
          customerDp,
        } = ds.val();
        const p = {
          customerId,
          customerName,
          createdOn,
          customerDp,
          idNumber,
          email,
          dateOfBirth,
          phoneNumber,
        };
        this.setState({ customer: p, loading: false });
      } else {
        this.setState({ customer: p, loading: false });
      }
    });
  }
  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.customer.customerId + new Date().getTime();
    const uploadTask = _storage
      .ref("customers/")
      .child(id + ".jpeg")
      .put(this.state.customer.customerDp);
    console.log(this.state.customer);
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
                  const p = this.state.customer;
                  p.customerDp = url;
                  this.setState({ customer: p, uploadPic: undefined });
                  this.saveCustomer();
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
  async saveCustomer() {
    const {
      createdOn,
      customerDp,
      customerId,
      customerName,
      idNumber,
      email,
      dateOfBirth,
      phoneNumber,
    } = this.state.customer;
    if (validField([customerName, idNumber, email, dateOfBirth, phoneNumber])) {
      await _database
        .ref("customers/data/" + customerId)
        .once("value", async (x) => {
          await x.ref.child("customerId").set(customerId);
          await x.ref.child("customerDp").set(customerDp);
          await x.ref.child("customerName").set(customerName);
          await x.ref.child("idNumber").set(idNumber);
          await x.ref.child("phoneNumber").set(phoneNumber);
          await x.ref.child("email").set(email);
          await x.ref.child("dateOfBirth").set(dateOfBirth);
          await x.ref.child("createdOn").set(createdOn);
        });
      await _database.ref("customers/active/" + customerId).set(customerId);
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
          {this.state.customer.customerId ? (
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
              <p className="customer-title unselectable">New customer</p>
              <ImageUploader
                src_={src}
                src_f={() => {
                  src = undefined;
                }}
                src={() => {
                  return this.state.customer.customerDp === ""
                    ? require("../../../../assets/drawables/ic-customer.png")
                        .default
                    : this.state.customer.customerDp;
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
                      const p = this.state.customer;
                      p.customerDp = blob;
                      this.setState({ customer: p, uploadPic: true });
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
                    <p className="field-title">Customer Name</p>
                    <input
                      value={this.state.customer.customerName}
                      onChange={(e) => {
                        const p = this.state.customer;
                        p.customerName = e.target.value;
                        this.setState({ customer: p });
                      }}
                      name="customerName"
                      placeholder="Customer Name"
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
                    <p className="field-title">Id Number</p>
                    <input
                      value={this.state.customer.idNumber}
                      onChange={(e) => {
                        const p = this.state.customer;
                        p.idNumber = e.target.value;
                        this.setState({ customer: p });
                      }}
                      placeholder="Id Number"
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
                    <p className="field-title">Email Address</p>
                    <input
                      value={this.state.customer.email}
                      onChange={(e) => {
                        const p = this.state.customer;
                        p.email = e.target.value;
                        this.setState({ customer: p });
                      }}
                      placeholder="johndoe@find.io"
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
                    <p className="field-title">Date of Birth</p>
                    <input
                      value={this.state.customer.dateOfBirth}
                      onChange={(e) => {
                        const p = this.state.customer;
                        p.dateOfBirth = e.target.value;
                        this.setState({ customer: p });
                      }}
                      placeholder="DD-MM-YYYY"
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
                    <p className="field-title">Phone Number</p>
                    <input
                      value={this.state.customer.phoneNumber}
                      onChange={(e) => {
                        const p = this.state.customer;
                        p.phoneNumber = e.target.value;
                        this.setState({ customer: p });
                      }}
                      placeholder="Phone Number"
                    />
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
                        await this.saveCustomer();
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

export const ImageUploader = (props) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [updated, setUpdated] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [cropped, setCropped] = React.useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const aspect = 1 / 1;

  function onCropChange(crop) {
    setCrop(crop);
  }

  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function onZoomChange(zoom) {
    setZoom(zoom);
  }
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        props.src_f();
        current.src = e.target.result;
        setUpdated(true);
        setImage(e.target.result);
        setCropped(false);
        props.hideField();
      };
      reader.readAsDataURL(file);
    }
  };
  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      props.updateValue(croppedImage);
      setImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image, props]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none",
        }}
      />
      {updated === false && props.src_ === undefined ? (
        <div className="upload-img">
          <p className="unselectable">Click to upload Image</p>
          <img
            ref={uploadedImage}
            onClick={() => imageUploader.current.click()}
            alt="customer-Logo"
            src={require("../../../../assets/drawables/ic-camera.png").default}
          />
        </div>
      ) : cropped === false && props.src_ === undefined ? (
        <div className="crop-image-body">
          <div className="crop-container">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div className="controls">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => onZoomChange(zoom)}
              classes={{ container: "slider" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "10vh",
              width: "280px",
              alignSelf: "center",
              maxHeight: "40px",
            }}
          >
            <div
              className="customer-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await setTimeout(() => {
                  setCropped(false);
                  setImage(undefined);
                  setUpdated(false);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-exit.png").default
                }
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Cancel</p>
            </div>
            <div
              className="customer-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await showCroppedImage();
                await setTimeout(() => {
                  setCropped(true);
                  setUpdated(true);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-crop.png").default
                }
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Crop</p>
            </div>
          </div>
        </div>
      ) : (
        <img
          ref={uploadedImage}
          alt=""
          className="img-upload unselectable"
          draggable={false}
          src={image !== undefined ? image : props.src()}
          onClick={async () => {
            await setTimeout(() => {
              imageUploader.current.click();
            }, 100);
          }}
        />
      )}
    </div>
  );
};
