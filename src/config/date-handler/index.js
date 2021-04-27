export function dateToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  return dd + "." + mm + "." + yyyy;
}
function generateUID() {
  return (
    ("000000" + (Math.random() * 46656).toString(36)).slice(-6) + ""
  ).toUpperCase();
}
export function idDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const hr = today.getHours() > 9 ? today.getHours() : "0" + today.getHours();
  const min =
    today.getMinutes() > 9 ? today.getMinutes() : "0" + today.getMinutes();
  const sec =
    today.getSeconds() > 9 ? today.getSeconds() : "0" + today.getSeconds();
  const dT = today.getHours() < 12 ? "-am" : "-pm";
  return (
    yyyy +
    "-" +
    mm +
    "-" +
    dd +
    "/" +
    hr +
    "-" +
    min +
    "-" +
    sec +
    dT +
    "_" +
    generateUID()
  );
}
export function currentTime() {
  var today = new Date();
  const hr = today.getHours() > 9 ? today.getHours() : "0" + today.getHours();
  const min =
    today.getMinutes() > 9 ? today.getMinutes() : "0" + today.getMinutes();
  const dT = today.getHours() < 12 ? " am" : " pm";
  return hr + ":" + min + dT;
}
