import { useState } from "react";
import { GET_LOCATION, GET_PROPERTY_DETAIL, GET_PROPERTIES_FOR_RENT, GET_SOLD_PROPERTIES, GET_PROPERTY_SALE_PRICE, GET_PROPERTY_RENTAL_PRICE, GET_AIRBNB_PROPERTY_RENTAL_RATES } from "../../utils/APIs";
import { ADD_PLACES_FOR_RENT_TO_DB, ADD_PROPERTY_DETAIL_TO_DB, ADD_SOLD_PLACES_TO_DB, UPDATE_DB_PROPERTY } from "../../utils/helpers";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isInProgress, setIsInProgress] = useState(false);
  const [update, setUpdate] = useState("");
  const [errors, setErrors] = useState([]);

  const handleAddressChange = async (address) => {
    setIsInProgress(true);
    const { data } = await GET_LOCATION(address);
    if (data?.length > 0) {
      setAddresses(data.filter((addr) => addr.mpr_id));
    } else {
      setAddresses([]);
    }
    setIsInProgress(false);
  };

  const AddAddress = async (address) => {
    // Hide the address
    setIsInProgress(true);

    // Property detail
    setUpdate("Getting property detail");
    const { data } = await GET_PROPERTY_DETAIL(address.mpr_id);
    const property = data.property_detail;
    setUpdate("Adding property details to database");
    const dbProperty = await ADD_PROPERTY_DETAIL_TO_DB(property);
    const propertyID = dbProperty[0].id;

    // Properties for rent
    setUpdate("Getting properties for rent");
    const { data: propertiesForRent, error: propertiesForRentError } = await GET_PROPERTIES_FOR_RENT(property);
    propertiesForRentError && setErrors([...errors, soldPropertiesError]);
    propertiesForRent && setUpdate("Adding properties for rent to database");
    propertiesForRent && (await ADD_PLACES_FOR_RENT_TO_DB(propertiesForRent));

    // Properties already sold
    setUpdate("Getting sold properties");
    const { data: soldProperties, error: soldPropertiesError } = await GET_SOLD_PROPERTIES(property);
    soldPropertiesError && setErrors([...errors, soldPropertiesError]);
    soldProperties && setUpdate("Adding sold properties to database");
    soldProperties && (await ADD_SOLD_PLACES_TO_DB(soldProperties));

    //Property sale price
    setUpdate("Getting property sale price");
    const { data: salePrice, error: salePriceError } = await GET_PROPERTY_SALE_PRICE(property);
    salePriceError && setErrors([...errors, salePriceError]);
    salePrice && setUpdate("Updating property sale price");
    salePrice && (await UPDATE_DB_PROPERTY("realtyMoleSale", propertyID, salePrice));

    //Property rent price
    setUpdate("Getting property rent price");
    const { data: rentPrice, error: rentPriceError } = await GET_PROPERTY_RENTAL_PRICE(property);
    rentPriceError && setErrors([...errors, rentalRateError]);
    rentPrice && setUpdate("Updating property rent price");
    rentPrice && (await UPDATE_DB_PROPERTY("realtyMoleRental", propertyID, rentPrice));

    //Airbnb Property Rental Rates
    setUpdate("Getting Airbnb property rental rates");
    const { data: rentalRates, error: rentalRateError } = await GET_AIRBNB_PROPERTY_RENTAL_RATES(property);
    rentalRateError && setErrors([...errors, rentalRateError]);
    rentalRates && setUpdate("Updating Airbnb property rental rates");
    rentalRates && (await UPDATE_DB_PROPERTY("airbnbRentalRates", propertyID, rentalRates));

    // Final message
    setUpdate("Success!");
    setTimeout(() => {
      setIsInProgress(false);
      setErrors([]);
    }, 5000);
  };

  return (
    <div className='max-w-sm'>
      <input onChange={(e) => handleAddressChange(e.target.value)} className='w-full py-3 px-6 border border-gray-300 text-gray-600 bg-white rounded-md' placeholder='Enter an address' />
      {isInProgress ? (
        <>
          <div className='mb-4 mt-6 flex items-center w-full justify-between'>
            <p>{update ? update : "Loading suggestions"}</p>
            {update !== "Success!" && (
              <svg className='ml-2 animate-spin' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='28px' height='28px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>
                <circle cx={50} cy={50} fill='none' stroke='#0099e5' strokeWidth={10} r={26} strokeDasharray='122.52211349000194 42.840704496667314' transform='matrix(1,0,0,1,0,0)' style={{ transform: "matrix(1, 0, 0, 1, 0, 0)", animationPlayState: "paused" }} />
              </svg>
            )}
          </div>
          {errors.length > 0 && (
            <>
              {errors.map((error, idx) => (
                <div key={idx} className='mb-4 mt-6 flex items-center w-full justify-between'>
                  <p>{error}</p>
                  <svg height={16} style={{ overflow: "visible", enableBackground: "new 0 0 32 32" }} viewBox='0 0 32 32' width={16} xmlSpace='preserve' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
                    <g>
                      <g id='Block_8_'>
                        <path
                          d='M27.3,4.7c-6.2-6.2-16.4-6.2-22.6,0c-6.2,6.2-6.2,16.4,0,22.6       c6.2,6.2,16.4,6.2,22.6,0C33.6,21.1,33.6,10.9,27.3,4.7z M24.5,7.5c4.2,4.2,4.6,10.7,1.3,15.4L9.1,6.2       C13.7,2.9,20.3,3.3,24.5,7.5z M7.5,24.5C3.3,20.3,2.9,13.7,6.2,9.1l16.7,16.7C18.3,29.1,11.7,28.7,7.5,24.5z'
                          id='Block'
                          style={{ fill: "#FF3939" }}
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              ))}
            </>
          )}
        </>
      ) : (
        addresses.length > 0 && (
          // Addresses List
          <ul className='py-2 shadow-xl w-full bg-white mt-4 rounded-md'>
            {addresses.length === 0 && <p className='px-4 py-2 text-gray-600'>No addresses found</p>}
            {addresses.map((address, idx) => {
              return (
                <li onClick={() => AddAddress(address)} className='px-4 py-2 my-1 hover:bg-gray-100 cursor-pointer' key={idx}>
                  {address.full_address[0]}
                </li>
              );
            })}
          </ul>
        )
      )}
    </div>
  );
};
export default Address;
