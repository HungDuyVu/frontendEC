import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import ImportOrderItem from '../components/ImportOrderItem';
import UploadImportOrder from '../components/UploadImportOrder';

const AllImportOrders = () => {
    const [openUploadImportOrder, setOpenUploadImportOrder] = useState(false);
    const [allImportOrders, setAllImportOrders] = useState([]);

    const fetchAllImportOrders = async () => {
        try {
            const response = await fetch(SummaryApi.allImportOrders.url, {
                method: SummaryApi.allImportOrders.method,
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const dataResponse = await response.json();

            if (dataResponse.success) {
                setAllImportOrders(dataResponse.data || []);
            } else {
                console.error("Failed to fetch import orders:", dataResponse.message);
            }
        } 
        catch (error) {
            console.error("Error while fetching import orders:", error);
        }
    }

    useEffect(() => {
        fetchAllImportOrders();
        console.log(allImportOrders);
    }, []);

    return (
        <div>
            <div className='bg-white py-2 px-4 flex justify-between items-center'>
                <h2 className='font-bold text-lg'>Tất cả đơn hàng nhập</h2>
                <button className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full' onClick={() => setOpenUploadImportOrder(true)}>
                    Tạo đơn hàng nhập mới
                </button>
            </div>

            {/* All import orders */}
            <div>
                {allImportOrders.length > 0 ? (
                    allImportOrders.map((importOrder, index) => (
                        <ImportOrderItem data={importOrder} key={importOrder._id} fetchData={fetchAllImportOrders} />
                    ))
                ) : (
                    <p>Không có đơn hàng nhập nào.</p>
                )}
            </div>

            {/* Upload import order */}
            {openUploadImportOrder && (
                <UploadImportOrder onClose={() => setOpenUploadImportOrder(false)} fetchData={fetchAllImportOrders} />
            )}
        </div>
    );
}

export default AllImportOrders;
