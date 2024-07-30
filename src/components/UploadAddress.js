import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const UploadAddress = ({ onClose, fetchData, user }) => {
  const [data, setData] = useState({
    user: user._id,
    recipientName: '', 
    address: '',
    phoneNumber: ''
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.uploadAddress.url, {
        method: SummaryApi.uploadAddress.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        fetchData();
        toast.success(responseData?.message);
        onClose(); // Đóng form thêm địa chỉ
      } else {
        toast.error(responseData?.message);
      }
    } catch (error) {
      console.error('Error uploading address:', error);
      toast.error('Đã xảy ra lỗi khi thêm địa chỉ, vui lòng thử lại sau.');
    }
  };
  

  return (
    <div className="fixed w-full h-full bg-gray-900 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-xl">Thêm địa chỉ</h2>
          <div className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer" onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
              Tên người nhận:
            </label>
            <input
              type="text"
              id="recipientName"
              placeholder="Nhập tên người nhận"
              name="recipientName"
              value={data.recipientName}
              onChange={handleOnChange}
              className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Địa chỉ:
            </label>
            <input
              type="text"
              id="address"
              placeholder="Nhập địa chỉ"
              name="address"
              value={data.address}
              onChange={handleOnChange}
              className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Số điện thoại:
            </label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handleOnChange}
              className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm địa chỉ
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAddress;
