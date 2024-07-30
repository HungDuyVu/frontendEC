import React, { useState } from 'react';
import SummaryApi from '../common';

const DeleteImportOrder = ({ data, onClose, fetchData }) => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleCheckCode = async () => {
        try {
            const checkResponse = await fetch(SummaryApi.checkPasswordImportOrder.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ confirmationCode })
            });

            const checkResult = await checkResponse.json();

            if (!checkResult.success) {
                return setError(checkResult.message);
            }

            setIsConfirmed(true);
            setError('');
            console.log('check data deleted:', data);
        } catch (error) {
            console.error('Error checking confirmation code:', error);
            setError('Đã xảy ra lỗi');
        }
    };

    const handleDelete = async () => {
        try {
            const deleteResponse = await fetch(SummaryApi.deleteImportOrder.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: data._id })
            });

            const deleteResult = await deleteResponse.json();
            if (deleteResult.success) {
                fetchData();
                onClose();
            } else {
                setError(deleteResult.message);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Đã xảy ra lỗi');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Xác nhận xóa đơn hàng</h2>
                {!isConfirmed ? (
                    <>
                        <p className="mb-4">Vui lòng nhập mã xác nhận để xóa đơn hàng này.</p>
                        <input
                            type="text"
                            className="border p-2 w-full mb-4"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            placeholder="Nhập mã xác nhận"
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="flex justify-end">
                            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded mr-2">
                                Hủy
                            </button>
                            <button onClick={handleCheckCode} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                                Xác nhận
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-4">Mã xác nhận đúng. Bạn có muốn xóa đơn hàng này?</p>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="flex justify-end">
                            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded mr-2">
                                Hủy
                            </button>
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                                Xóa
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteImportOrder;
