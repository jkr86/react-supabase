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
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}/location/suggest`, params: { input: address } };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};

export const GET_PROPERTY_DETAIL = async (propertyID) => {
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}/v2/property-detail`, params: { property_id: propertyID } };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};

export const GET_PROPERTIES_FOR_RENT = async (property) => {
  let payload = {
    city: property.address.city,
    state_code: property.address.state_code,
    location: property.address.postal_code,
    sort: "recently_added_update",
    property_type: "single_family",
  };
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}/v2/for-rent`, params: payload };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};

export const GET_SOLD_PROPERTIES = async (property) => {
  let payload = {
    city: property.address.city,
    state_code: property.address.state_code,
    location: property.address.postal_code,
    sort: "sold_date",
    property_type: "single_family",
    max_sold_days: 365,
    beds_min: property.prop_common.bed,
    baths_min: property.prop_common.bath,
  };
  let options = { ...defaultGetOptions, url: `${xRapidApiUrl}/sold-homes`, params: payload };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};
