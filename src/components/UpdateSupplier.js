import React, { useState, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const UpdateSupplier = ({ supplierData, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    ...supplierData,
    name: supplierData?.name || '',
    email: supplierData?.email || '',
    phoneNumber: supplierData?.phoneNumber || '',
    address: supplierData?.address || '',
    productsSupplied: supplierData?.productsSupplied || []
  });

  useEffect(() => {
    console.log('Edit supplier data: ', supplierData);
  }, [supplierData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.updateSupplier.url, {
        method: SummaryApi.updateSupplier.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: supplierData._id,
          updateData: formData
        })
      });

      const responseData = await response.json();
      console.log('Server response:', responseData); // Thêm dòng này để kiểm tra phản hồi từ server

      if (responseData.success) {
        toast.success(responseData.message);
        fetchData(); // Fetch updated data
        onClose(); // Close modal or update view
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật nhà cung cấp, vui lòng thử lại sau.');
    }
    console.log('Check data update supplier:', formData);
  };

  return (
    <div className="fixed w-full h-full bg-gray-900 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-xl">Cập nhật nhà cung cấp</h2>
          <div className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer" onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên nhà cung cấp:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nhập tên nhà cung cấp"
              name="name"
              value={formData.name}
              onChange={handleOnChange}
              className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              name="email"
              value={formData.email}
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
              value={formData.phoneNumber}
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
              value={formData.address}
              onChange={handleOnChange}
              className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cập nhật nhà cung cấp
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSupplier;
