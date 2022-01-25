import { xRapidApiHost, xRapidApiKey, xRapidApiUrl } from "../constants";

const axios = require("axios").default;
let defaultGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": xRapidApiHost,
    "x-rapidapi-key": xRapidApiKey,
  },
};

export const GET_LOCATION = async (address) => {
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}location/suggest`, params: { input: address } };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};

export const GET_PROPERTY_DETAIL = async (propertyID) => {
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}v2/property-detail`, params: { property_id: propertyID } };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};