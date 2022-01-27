import { data } from "autoprefixer";
import { realEstateApiHost, xRapidAPIKey, realtyMoleApiHost, realEstateApiUrl, realtyMoleApiUrl, mashvisorApiHost, mashvisorApiUrl, zestimateApiHost, zestimateApiUrl, elevationAPIHost, elevationAPIUrl } from "../constants";

const axios = require("axios").default;
let realEstateAPIGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": realEstateApiHost,
    "x-rapidapi-key": xRapidAPIKey,
  },
};
let realtyMoleAPIGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": realtyMoleApiHost,
    "x-rapidapi-key": xRapidAPIKey,
  },
};
let mashvisorAPIGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": mashvisorApiHost,
    "x-rapidapi-key": xRapidAPIKey,
  },
};
let zillowAPIGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": zestimateApiHost,
    "x-rapidapi-key": xRapidAPIKey,
  },
};
let elevationAPIGetOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-host": elevationAPIHost,
    "x-rapidapi-key": xRapidAPIKey,
  },
};

export const GET_LOCATION = async (address) => {
  let options = { ...realEstateAPIGetOptions, url: `${realEstateApiUrl}/location/suggest`, params: { input: address } };
  let response = await axios.request(options);
  if (response.data) return response.data;
  return response;
};

export const GET_PROPERTY_DETAIL = async (propertyID) => {
  let options = { ...realEstateAPIGetOptions, url: `${realEstateApiUrl}/v2/property-detail`, params: { property_id: propertyID } };
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
  let options = { ...realEstateAPIGetOptions, url: `${realEstateApiUrl}/v2/for-rent`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting properties for rent";
  }
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
  let options = { ...realEstateAPIGetOptions, url: `${realEstateApiUrl}/sold-homes`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting sold properties";
  }
  return response;
};

export const GET_PROPERTY_SALE_PRICE = async (property) => {
  let payload = {
    compCount: 10,
    longitude: property.address.location.lon,
    latitude: property.address.location.lat,
    propertyType: "Single Family",
  };
  let options = { ...realtyMoleAPIGetOptions, url: `${realtyMoleApiUrl}/salePrice`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting property sale price";
  }
  return response;
};

export const GET_PROPERTY_RENTAL_PRICE = async (property) => {
  let payload = {
    compCount: 10,
    longitude: property.address.location.lon,
    latitude: property.address.location.lat,
    propertyType: "Single Family",
  };
  let options = { ...realtyMoleAPIGetOptions, url: `${realtyMoleApiUrl}/rentalPrice`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting property rental price";
  }
  return response;
};

export const GET_AIRBNB_PROPERTY_RENTAL_RATES = async (property) => {
  let payload = {
    state: property.address.state,
    zip_code: property.address.postal_code,
    source: "airbnb",
  };
  let options = { ...mashvisorAPIGetOptions, url: `${mashvisorApiUrl}/rental-rates`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting airbnb property rental rates";
  }
  if (response.status === "error") {
    delete response.data;
    response.error = e.message;
  }
  return response;
};

export const SEARCH_ZILLOW_ZIP_ID = async (address) => {
  let payload = {
    query: address,
  };
  let options = { ...zillowAPIGetOptions, url: `${zestimateApiUrl}/search`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error searching property zip id";
  }
  return response;
};

export const GET_PROPERTY_ZESTIMATE = async (zipID) => {
  let payload = {
    zpid: zipID,
  };
  let options = { ...zillowAPIGetOptions, url: `${zestimateApiUrl}/zestimate`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting property zestimate";
  }
  return response;
};

export const GET_PROPERTY_ELEVATION = async (property) => {
  let locations = `${property.address.location.lon},${property.address.location.lat}`;
  let payload = {
    locations,
    unit: "feet",
  };
  let options = { ...elevationAPIGetOptions, url: `${elevationAPIUrl}/elevation`, params: payload };
  let response = {};
  try {
    response = await axios.request(options);
  } catch (e) {
    response.error = "Error getting property elevation";
  }
  if (response.status === "error") {
    delete response.data;
    response.error = e.message;
  }
  return response;
};
