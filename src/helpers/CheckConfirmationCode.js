import React, { useState } from 'react';
import SummaryApi from '../common';

const CheckConfirmationCode = ({ onSuccess, onClose }) => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            const response = await fetch(SummaryApi.checkPasswordImportOrder.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ confirmationCode })
            });

            const result = await response.json();
            if (result.success) {
                onSuccess();
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error checking confirmation code:', error);
            setError('Đã xảy ra lỗi');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Xác nhận đoạn mã</h2>
                <p className="mb-4">Vui lòng nhập đoạn mã xác nhận.</p>
                <input
                    type="text"
                    className="border p-2 w-full mb-4"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Nhập đoạn mã"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded mr-2">
                        Hủy
                    </button>
                    <button onClick={handleConfirm} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckConfirmationCode;
