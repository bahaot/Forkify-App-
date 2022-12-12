import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";
/*
--- many real world applications have 2 special modules are completly independent from the rest of the architecture 
1) module for the project configuration
2) module for some general helper functions that are gonna be useful across the entire project 


--- this one is helper module: 
- the goal of this module is to contain a couple of functions that we will reuse over and over in our project 

*/

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}; // it will return a new promise which will reject after a certain number of seconds

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST", // to send data to the API
          headers: {
            "Content-Type": "application/json", // we tell the api that the data we are send is gonna be in the json format
          }, // some snipper of text which are like information about the request itself
          body: JSON.stringify(uploadData), // the data we want to send, the body should be in json
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await response.json(); // convert the response to json

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // we will handle the error within loadRecipe function
    throw err;
  }
};

/*
export const getJson = async function (url) {
  try {
    const response = await Promise.race([AJAX(url), timeout(TIMEOUT_SEC)]); // the first one win the race will be called
    // this fetch will return a promise and because we are in an async function we can await for the promise

    const data = await response.json(); // convert the response to json

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // we will handle the error within loadRecipe function
    throw err;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const response = await Promise.race([
      AJAX(url, uploadData),
      timeout(TIMEOUT_SEC),
    ]); // the first one win the race will be called
    // this fetch will return a promise and because we are in an async function we can await for the promise

    const data = await response.json(); // convert the response to json

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // we will handle the error within loadRecipe function
    throw err;
  }
};
*/
