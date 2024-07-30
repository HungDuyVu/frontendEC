import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import EditImportOrder from './EditImportOrder';
import DeleteImportOrder from './DeleteImportOrder';

const ImportOrderItem = ({ data, fetchData }) => {
    const { orderCode, importedBy, supplier, importDate, products = [] } = data;
    const [productDetails, setProductDetails] = useState([]);
    const [editOrder, setEditOrder] = useState(false);
    const [deleteOrder, setDeleteOrder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const productDetailsArray = await Promise.all(
                    products.map(async (product) => {
                        const response = await fetch(SummaryApi.getProductById.url, {
                            method: SummaryApi.getProductById.method,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ productId: product.product })
                        });
                        const data = await response.json();
                        if (data.success) {
                            return { ...data.data, quantity: product.quantity };
                        } else {
                            console.error("Failed to fetch product:", data.message);
                            return null;
                        }
                    })
                );
                setProductDetails(productDetailsArray.filter(product => product !== null));
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Failed to fetch product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        console.log('product list: ', productDetails);
    }, [products]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='bg-gray-100 p-6 m-4 shadow-md rounded-lg'>
            <h3 className='font-bold text-xl mb-4 text-gray-800'>Mã đơn hàng: {orderCode}</h3>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Người nhập hàng:</strong> <span>{importedBy}</span>
            </div>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Nhà cung cấp:</strong> <span>{supplier}</span>
            </div>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Ngày nhập hàng:</strong> <span>{new Date(importDate).toLocaleDateString()}</span>
            </div>
            <div className='mt-4'>
                <h4 className='font-semibold text-lg mb-2 text-gray-800'>Sản phẩm:</h4>
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white text-gray-800 rounded-lg shadow-sm'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='py-2 px-4 border-b border-gray-300 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider'>
                                    Tên sản phẩm
                                </th>
                                <th className='py-2 px-4 border-b border-gray-300 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider'>
                                    Số lượng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productDetails.map((product, index) => (
                                <tr key={index} className='hover:bg-gray-100 transition duration-150 ease-in-out'>
                                    <td className='py-2 px-4 border-b border-gray-300'>
                                        {product.productName}
                                    </td>
                                    <td className='py-2 px-4 border-b border-gray-300'>
                                        {product.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex justify-end mt-4'>
                <button 
                    onClick={() => setEditOrder(true)} 
                    className='bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 mr-2'
                    aria-label='Edit Order'
                >
                    <MdModeEditOutline />
                </button>
                <button 
                    onClick={() => setDeleteOrder(true)} 
                    className='bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600'
                    aria-label='Delete Order'
                >
                    <MdDelete />
                </button>
            </div>
            {editOrder && <EditImportOrder data={data} onClose={() => setEditOrder(false)} fetchData={fetchData} />}
            {deleteOrder && <DeleteImportOrder data={data} onClose={() => setDeleteOrder(false)} fetchData={fetchData} />}
        </div>
    );
};

export default ImportOrderItem;
