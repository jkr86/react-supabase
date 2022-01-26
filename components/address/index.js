import { useState } from "react";
import { GET_FOR_RENT, GET_LOCATION, GET_PROPERTY_DETAIL } from "../../utils/APIs";
import { ADD_PLACES_RENTS, ADD_PROPERTY_DETAIL } from "../../utils/helpers";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = async (address) => {
    setIsLoading(true);
    const { data } = await GET_LOCATION(address);
    if (data) {
      setAddresses(data.filter((addr) => addr.mpr_id));
    } else {
      setAddresses([]);
    }
    setIsLoading(false);
  };

  const AddAddress = async (address) => {
    const { data } = await GET_PROPERTY_DETAIL(address.mpr_id);
    ADD_PROPERTY_DETAIL(data.property_detail);
    const { data: forRent } = await GET_FOR_RENT(data.property_detail);
    ADD_PLACES_RENTS(forRent);
  };

  return (
    <div className='max-w-sm'>
      <input onChange={(e) => handleAddressChange(e.target.value)} className='w-full py-3 px-6 border border-gray-300 text-gray-600 bg-white rounded-md' placeholder='Enter an address' />
      {isLoading ? (
        <p className='px-4 py-2 my-1 hover:bg-gray-100 cursor-pointer mt-6'>Loading...</p>
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
