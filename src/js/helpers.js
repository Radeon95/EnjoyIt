import { async } from 'regenerator-runtime';
import { TIME_OUT_SEC } from './configs.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

/**
 * Performs an AJAX call to a specified URL. This function can handle both GET and POST requests.
 * For POST requests, it allows sending JSON data. The function also implements a timeout feature,
 * automatically rejecting the promise if the request takes longer than a specified time.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {Object} [uploadData=undefined] - The data to be uploaded in case of a POST request. If not provided, a GET request is made.
 * @returns {Promise<Object>} A promise that resolves to the JSON response of the AJAX call.
 * @throws {Error} Throws an error if the request fails or if the response status is not OK.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// API call for deleting the recipe
export const deleteJSON = async function (url) {
  try {
    await fetch(url, {
      method: 'DELETE',
    });
  } catch (err) {
    throw err;
  }
};
