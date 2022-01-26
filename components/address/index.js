import { useState } from "react";
import { GET_LOCATION, GET_PROPERTY_DETAIL, GET_PROPERTIES_FOR_RENT, GET_SOLD_PROPERTIES } from "../../utils/APIs";
import { ADD_PLACES_RENTS_TO_DB, ADD_PROPERTY_DETAIL_TO_DB, ADD_SOLD_PLACES_TO_DB } from "../../utils/helpers";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState("");

  const handleAddressChange = async (address) => {
    setIsLoading(true);
    const { data } = await GET_LOCATION(address);
    if (data?.length > 0) {
      setAddresses(data.filter((addr) => addr.mpr_id));
    } else {
      setAddresses([]);
    }
    setIsLoading(false);
  };

  const AddAddress = async (address) => {
    // Hide the address
    setIsLoading(true);

    // Property detail
    setUpdate("Getting property detail...");
    const { data } = await GET_PROPERTY_DETAIL(address.mpr_id);
    setUpdate("Adding property details to database");
    ADD_PROPERTY_DETAIL_TO_DB(data.property_detail);

    // Properties for rent
    setUpdate("Getting properties for rent...");
    const { data: forRent } = await GET_PROPERTIES_FOR_RENT(data.property_detail);
    setUpdate("Adding properties for rent to database");
    ADD_PLACES_RENTS_TO_DB(forRent);

    // Properties already sold
    setUpdate("Getting sold properties...");
    const { data: sold } = await GET_SOLD_PROPERTIES(data.property_detail);
    setUpdate("Adding sold properties to database");
    ADD_SOLD_PLACES_TO_DB(sold);
    setUpdate("Success!");
  };

  return (
    <div className='max-w-sm'>
      <input value='14739 Rimgate Dr Whittier CA 90604' onChange={(e) => handleAddressChange(e.target.value)} className='w-full py-3 px-6 border border-gray-300 text-gray-600 bg-white rounded-md' placeholder='Enter an address' />
      {isLoading ? (
        <div className='mb-4 mt-6 flex items-center w-full justify-between'>
          <p>{update ? update : "Loading suggestions"}</p>
          {update !== "Success!" && (
            <svg
              className='ml-2 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              width='28px'
              height='28px'
              viewBox='0 0 100 100'
              preserveAspectRatio='xMidYMid'>
              <circle cx={50} cy={50} fill='none' stroke='#0099e5' strokeWidth={10} r={26} strokeDasharray='122.52211349000194 42.840704496667314' transform='matrix(1,0,0,1,0,0)' style={{ transform: "matrix(1, 0, 0, 1, 0, 0)", animationPlayState: "paused" }} />
            </svg>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};
export default Address;
