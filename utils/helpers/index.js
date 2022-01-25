import { supabase } from "../supabaseClient";
export const ADD_PROPERTY_DETAIL = async (property_detail) => {
  console.log("property details", property_detail);
  const row = {
    id: property_detail.id,
    addressLine1: "",
    addressLine2: "",
    city: property_detail.address.city,
    zipCode: "",
    state: property_detail.address.state,
    photos: property_detail.photos,
    line: "",
    streetNumber: property_detail.address.street_number,
    streetSuffix: property_detail.address.street_suffix,
    timeZone: property_detail.address.time_zone,
    county: property_detail.address.county,
    streetName: property_detail.address.street_name,
    country: property_detail.address.country,
    description: property_detail.description,
    created_at: "",
    floodEnvironmentalRisk: property_detail.flood.environmental_risk,
    longitude: property_detail.address.location.lon,
    latitude: property_detail.address.location.lat,
    floodFactor: property_detail.flood.flood_factor_score,
    floodSeverity: property_detail.flood.severity,
    noiseText: property_detail.noise.score_text,
    noiseTraffic: property_detail.noise.traffic_text,
    noiseLocal: property_detail.noise.local_text,
    noiseScore: property_detail.noise.score,
    noiseAir: property_detail.noise.airport_text,
    propertyType: "",
    rentalEstHigh: "",
    rentalEstDate: "",
    rentalEstLow: "",
    rentalEst: "",
    stories: property_detail.public_records[0].stories,
    bathsFull: property_detail.public_records[0].baths_full,
    bathsTotal: property_detail.public_records[0].baths,
    yearBuilt: property_detail.public_records[0].year_built,
    lastSoldPrice: "",
    saleStatus: "",
    lotSqft: property_detail.public_records[0].lot_width,
    Sqft: property_detail.public_records[0].sqft,
    bedroomsTotal: property_detail.public_records[0].beds,
    garage: property_detail.public_records[0].garage,
    neighbor: "",
    propertyHistoryEvent: "",
    propertyHistoryDate: "",
    propertyHistorySqft: "",
    propertyHistoryPrice: "",
    propertyHistoryPreviousPrice: "",
    schoolName: "",
    schoolParentRating: "",
    schoolRating: "",
    avmValue: property_detail.avm.value,
    avmValueHigh: property_detail.avm.value_high,
    avmValueLow: property_detail.avm.value_low,
    zestimate: "",
    realityMoleHigh: "",
    realityMoleLow: "",
    realityMoleAvg: "",
    realityMoleRentAvg: "",
    realityMoleRentLow: "",
    realityMoleRentHigh: "",
    airbnbStudioValue: "",
    airbnbOneRoomValue: "",
    airbnbTwoRoomValue: "",
    airbnbThreeRoomValue: "",
    airbnbFourRoomValue: "",
    airBnbCount: "",
    MashvisorStudioValue: "",
    MashvisorOneRoomValue: "",
    MashvisorTwoRoomValue: "",
    MashvisorThreeRoomValue: "",
    MashvisorFourRoomValue: "",
    MashvisorCount: "",
    mprID: "",
    elevation: "",
  };
  console.log("payload", row);
  // const { data, error } = await supabase.from("places").insert([{ name: "The Shire", country_id: 554 }]);
  // if (error) console.log("error mf is here", error);
  // console.log("data mf is here", data);
};