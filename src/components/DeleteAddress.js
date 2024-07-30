import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const DeleteAddress = ({ data, onClose, fetchData }) => {
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('check delete address: ', data);
    })

    const handleDelete = async () => {
        try {
            const deleteResponse = await fetch(SummaryApi.deleteAddress.url, {
                method: SummaryApi.deleteAddress.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: data._id })
            });

            const deleteResult = await deleteResponse.json();
            if (deleteResult.success) {
                fetchData();
                onClose();
            } else {
                setError(deleteResult.message);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            setError('Đã xảy ra lỗi');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Xác nhận xóa địa chỉ</h2>
                <p className="mb-4">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded mr-2">
                        Hủy
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAddress;
