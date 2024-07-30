import React, { useEffect, useState } from 'react';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import UpdateAddress from './UpdateAddress';
import DeleteAddress from './DeleteAddress';

const AddressItem = ({ data, fetchData }) => {
  const { recipientName, address, phoneNumber } = data;
  const [editAddress, setEditAddress] = useState(false);
  const [deleteAddress, setDeleteAddress] = useState(false);

  useEffect(() => {
    console.log('check data addressItem: ', data);
  }, [data]);

  return (
   <div className="mb-4 border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-lg text-gray-700 mb-2"><strong>Người nhận:</strong> {recipientName}</p>
      <p className="text-lg text-gray-700 mb-2"><strong>Địa chỉ:</strong> {address}</p>
      <p className="text-lg text-gray-700"><strong>Số điện thoại:</strong> {phoneNumber}</p>
      <div className='flex justify-end mt-4'>
        <button 
          onClick={() => setEditAddress(true)} 
          className='bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 mr-2'
          aria-label='Edit Address'
        > 
          <MdModeEditOutline />
        </button>
        <button 
          onClick={() => setDeleteAddress(true)} 
          className='bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600'
          aria-label='Delete Address'
        >
          <MdDelete />
        </button>
      </div>
      {editAddress && <UpdateAddress data={data} onClose={() => setEditAddress(false)} fetchData={fetchData} />}
      {deleteAddress && <DeleteAddress data={data} onClose={() => setDeleteAddress(false)} fetchData={fetchData} />}
    </div>
  );
};

export default AddressItem;
