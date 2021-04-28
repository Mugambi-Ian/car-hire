import config from "./config";
import firebase from "firebase";
import moment from "moment";

firebase.initializeApp(config());
firebase.analytics();

export const _firebase = firebase;
export const _database = firebase.database();
export const _storage = firebase.storage();
export const _auth = firebase.auth();

firebase.analytics();

export const validField = (x) => {
  for (let i = 0; i < x.length; i++) {
    const e = x[i];
    if (e.length === 0) {
      return false;
    }
  }
  return true;
};

export const getDays = (date1, date2) => {
  var Difference_In_Time = date2.getTime() - date1.getTime();
  const r = Difference_In_Time / (1000 * 3600 * 24);
  return Math.ceil(r + 1);
};

export const getAge = (bDate) => {
  var day = moment(bDate, "DD-MM-YYYY");
  var days = getDays(day.toDate(), new Date());
  var months = Math.floor(days / 31);
  return Math.floor(months / 12);
};

export const getDate = (date) => {
  return (
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  );
};

export const formatDate = (date) => {
  date = date.split("-");
  return (
    (parseInt(date[0]) < 10 ? "0" + date[0] : date[0]) +
    "-" +
    (parseInt(date[1]) < 10 ? "0" + date[1] : date[1]) +
    "-" +
    date[2]
  );
};
