var FormData = require("form-data");
const axios = require("axios");

async function getCategory(title) {
  console.log("start");
  var data = new FormData();
  data.append("expense", title);

  var config = {
    method: "post",
    url: "https://sh-cat.onrender.com/category",
    timeout: 20000, // only wait for 2s
    headers: {
      Accept: "application/json",
      ...data.getHeaders(),
    },
    data: data,
  };
  return axios(config);
}

exports.getCategory = getCategory;
