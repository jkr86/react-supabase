import { supabase } from "../supabaseClient";

export const ADD_PROPERTY_DETAIL_TO_DB = async (property) => {
  const row = {
    mprID: property.mpr_id,
    city: property.address.city,
    zipCode: property.address.postal_code,
    state: property.address.state,
    photos: property.photos,
    line: property.address.line,
    streetNumber: property.address.street_number,
    streetSuffix: property.address.street_suffix,
    timeZone: property.address.time_zone,
    county: property.address.county,
    streetName: property.address.street_name,
    country: property.address.country,
    description: property.description,
    floodEnvironmentalRisk: property.flood.environmental_risk,
    longitude: property.address.location.lon,
    latitude: property.address.location.lat,
    floodFactor: property.flood.flood_factor_score,
    floodSeverity: property.flood.severity,
    noiseText: property.noise.score_text,
    noiseTraffic: property.noise.traffic_text,
    noiseLocal: property.noise.local_text,
    noiseScore: property.noise.score,
    noiseAir: property.noise.airport_text,
    propertyType: property.prop_common.type,
    rentalEstHigh: property.rental_avm.estimate_high,
    rentalEstDate: property.rental_avm.date,
    rentalEstLow: property.rental_avm.estimate_low,
    rentalEst: property.rental_avm.estimate,
    stories: property.stories,
    bathsFull: property.prop_common.baths_full,
    bathsTotal: property.prop_common.bath,
    yearBuilt: property.prop_common.year_built,
    lastSoldPrice: property.prop_common.last_sold_price,
    saleStatus: property.prop_common.status,
    lotSqft: property.prop_common.lot_sqft,
    Sqft: property.prop_common.sqft,
    bedroomsTotal: property.prop_common.bed,
    garage: property.public_records[0].garage,
    neighbor: property.neighborhood,
    propertyHistoryEvent: property.property_history.map(({ event_name }) => event_name),
    propertyHistoryDate: property.property_history.map(({ date }) => date),
    propertyHistorySqft: property.property_history.map(({ sqft }) => sqft),
    propertyHistoryPrice: property.property_history.map(({ price }) => price),
    propertyHistoryPreviousPrice: property.property_history.map(({ previous_event_price }) => previous_event_price),
    schoolName: property.schools.filter((school) => school.relevance === "assigned").map(({ name }) => name),
    schoolParentRating: property.schools.filter((school) => school.relevance === "assigned").map(({ ratings }) => ratings.parent_rating),
    schoolRating: property.schools.filter((school) => school.relevance === "assigned").map(({ ratings }) => ratings.great_schools_rating),
    avmValue: property.avm.value,
    avmValueHigh: property.avm.value_high,
    avmValueLow: property.avm.value_low,
  };

  const { error, data } = await supabase.from("places").insert([row]);
  if (error) console.error("error adding place to db", error);
  return data;
};

export const ADD_PLACES_FOR_RENT_TO_DB = async (property) => {
  let properties = property.data.home_search.results;
  let rows = [];
  properties.map((property) => {
    rows.push({
      photoURL: property.primary_photo.href,
      address: property.location.address.line,
      sqft: property.description.sqft,
      communityName: property.community,
      postalCode: property.location.address.postal_code,
      price: property.list_price,
      longitude: property.location.address.coordinate.lon,
      latitude: property.location.address.coordinate.lat,
      bathsFull: property.location.baths_full,
      fullAddress: property.location.address.line,
      bathsTotal: property.description.baths,
      beds: property.description.beds,
      city: property.location.address.city,
      stateCode: property.location.address.state_code,
    });
  });
  const { error } = await supabase.from("places_rents").insert(rows);
  if (error) console.error("error adding places rent to db", error);
};

export const ADD_SOLD_PLACES_TO_DB = async (property) => {
  let properties = property.data.results;
  let rows = [];
  properties.map((property) => {
    rows.push({
      listDate: property.list_date,
      yearBuilt: property.description.year_built,
      soldDate: property.description.sold_date,
      soldPrice: property.description.sold_price,
      bathsFull: property.description.baths_full,
      lotSqft: property.description.lot_sqft,
      Sqft: property.description.sqft,
      bathsTotal: property.description.baths,
      garage: property.description.garage,
      stories: property.description.stories,
      beds: property.description.beds,
      listPrice: property.list_price,
      property: property.property_id,
      photosHref: property.photos?.map(({ href }) => href),
      zipCode: property.location.address.postal_code,
      longitude: property.location.address.coordinate.lon,
      latitude: property.location.address.coordinate.lat,
      city: property.location.address.city,
      line: property.location.address.line,
      state: property.location.address.state,
      stateCode: property.location.address.state_code,
      streetViewURL: property.location.street_view_url,
      county: property.location.county.name,
    });
  });
  const { error } = await supabase.from("places_comps").insert(rows);
  if (error) console.error("error adding sold places to db", error);
};

export const UPDATE_DB_PROPERTY = async (type, propertyID, property) => {
  switch (type) {
    case "realtyMoleSale":
      let salePayload = { realtyMoleAvg: property.price, realtyMoleLow: property.priceRangeLow, realtyMoleHigh: property.priceRangeHigh };
      const { saleError } = await supabase.from("places").update(salePayload).match({ id: propertyID });
      if (saleError) console.error("error updating  property sale values", saleError);
      break;
    case "realtyMoleRental":
      let rentalPayload = { realtyMoleRentAvg: property.rent, realtyMoleRentLow: property.rentRangeLow, realtyMoleRentHigh: property.rentRangeLow };
      const { rentalError } = await supabase.from("places").update(rentalPayload).match({ id: propertyID });
      if (rentalError) console.error("error updating property property rental values", rentalError);
      break;
    case "airbnbRentalRates":
      let rentalRatePayload = {
        airbnbStudioValue: property.count.studio_value,
        airbnbOneRoomValue: property.count.one_room_value,
        airbnbTwoRoomValue: property.content.two_room_value,
        airbnbThreeRoomValue: property.content.three_room_value,
        airbnbFourRoomValue: property.content.four_room_value,
        airbnbCount: property.sample_count,
      };
      const { rentalRateError } = await supabase.from("places").update(rentalRatePayload).match({ id: propertyID });
      if (rentalRateError) console.error("error updating property airbnb rental rate values", rentalError);
      break;
    case "zestimate":
      const { zestimateError } = await supabase.from("places").update({ zestimate: property.zestimate }).match({ id: propertyID });
      if (zestimateError) console.error("error updating property zestimate values", zestimateError);
      break;
    case "elevation":
      const { elevationError } = await supabase.from("places").update({ elevation: property.elevation }).match({ id: propertyID });
      if (elevationError) console.error("error updating property elevation", zestimateError);
      break;
    default:
      break;
  }
};
