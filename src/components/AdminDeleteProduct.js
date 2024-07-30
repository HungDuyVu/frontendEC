import React from 'react';
import { CgClose } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminDeleteProduct = ({ 
  productData, 
  onClose, 
  fetchdata 
}) => {

  const handleDelete = async (id) => {
    const response = await fetch(SummaryApi.deleteProduct.url,{
      method : SummaryApi.deleteProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(
        {
          _id: id,
        }
      )
    })


    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
      fetchdata();
      onClose();
    } 
    else {
      toast.error(responseData.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-md h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Xóa sản phẩm</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='p-4 overflow-y-scroll h-full'>
          <h3 className='text-xl font-bold mb-4'>Tên sản phẩm: {productData.productName}</h3>
          <p className='mb-2'>Hãng: {productData.brandName}</p>
          <p className='mb-2'>Danh mục: {productData.category}</p>
          <p className='mb-2'>Giá: {displayINRCurrency(productData.price)}</p>
          <p className='mb-2'>Giá bán: {displayINRCurrency(productData.sellingPrice)}</p>
          <p className='mb-4'>Mô tả: {productData.description}</p>

          <div className='flex justify-center mb-4'>
            {productData.productImage.map((el, index) => (
              <img key={index} src={el} alt={`product ${index}`} className='h-24 w-24 object-cover mx-2' />
            ))}
          </div>

          <div className='flex justify-between mt-4'>
            <button type='button' className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400' onClick={onClose}>Hủy</button>
            <button type='button' className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center' onClick={() => handleDelete(productData?._id)}>
              <MdDelete className='mr-2' /> Xóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDeleteProduct;
