import React from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CgClose } from 'react-icons/cg';
import SummaryApi from '../common';

const DeleteSupplier = ({ supplierId, onClose, fetchData }) => {
  const handleDeleteSupplier = async () => {
    try {
      const response = await fetch(SummaryApi.deleteSupplier.url, {
        method: SummaryApi.deleteSupplier.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: supplierId })
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);
        onClose(); // Đóng modal hoặc cập nhật giao diện phù hợp
        fetchData(); // Cập nhật dữ liệu sau khi xóa
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Đã xảy ra lỗi khi xóa nhà cung cấp, vui lòng thử lại sau.');
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='bg-white p-6 rounded w-full max-w-md h-auto overflow-hidden flex flex-col'
      >
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Xóa nhà cung cấp</h2>
          <div className='w-fit text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>
        <p className='mb-4'>Bạn có chắc chắn muốn xóa nhà cung cấp này?</p>
        <div className='flex justify-end'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteSupplier}
            className='px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded'
          >
            Xóa
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteSupplier;
