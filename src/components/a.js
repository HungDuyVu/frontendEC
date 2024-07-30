import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
// import EditWarehouse from './EditWarehouse'; // Assumed component for editing warehouse
// import DeleteWarehouse from './DeleteWarehouse'; // Assumed component for deleting warehouse

const WarehouseItem = ({ data, fetchData }) => {
    const { warehouseName, warehousePhoneNumber, warehouseAddress, products, suppliers, importOrder } = data;
    const [productDetails, setProductDetails] = useState([]);
    const [supplierDetails, setSupplierDetails] = useState([]);
    const [importOrderDetails, setImportOrderDetails] = useState([]);
    const [editWarehouse, setEditWarehouse] = useState(false);
    const [deleteWarehouse, setDeleteWarehouse] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const fetchedProducts = await Promise.all(
                    products.map(async (product) => {
                        console.log('Fetching product with ID:', product.product);
                        const response = await fetch(SummaryApi.getProductById.url, {
                            method: SummaryApi.getProductById.method,
                            headers: { 'Content-Type': 'application/json' },
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

                const fetchedSuppliers = await Promise.all(
                    suppliers.map(async (supplierId) => {
                        console.log('Fetching supplier with ID:', supplierId);
                        const response = await fetch(SummaryApi.getSupplierById.url, {
                            method: SummaryApi.getSupplierById.method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ supplierId })
                        });
                        const data = await response.json();
                        if (data.success) {
                            return data.data;
                        } else {
                            console.error("Failed to fetch supplier:", data.message);
                            return null;
                        }
                    })
                );

                const fetchedImportOrders = await Promise.all(
                    importOrder.map(async (orderId) => {
                        console.log('Fetching import order with ID:', orderId);
                        const response = await fetch(SummaryApi.getImportOrderById.url, {
                            method: SummaryApi.getImportOrderById.method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId })
                        });
                        const data = await response.json();
                        if (data.success) {
                            return data.data;
                        } else {
                            console.error("Failed to fetch import order:", data.message);
                            return null;
                        }
                    })
                );

                setProductDetails(fetchedProducts.filter(item => item !== null));
                setSupplierDetails(fetchedSuppliers.filter(item => item !== null));
                setImportOrderDetails(fetchedImportOrders.filter(item => item !== null));
            } catch (error) {
                console.error("Error fetching details:", error);
                setError("Failed to fetch details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [products, suppliers, importOrder]);

    useEffect(() => {
        console.log('Product Details:', productDetails);
        console.log('Supplier Details:', supplierDetails);
        console.log('Import Order Details:', importOrderDetails);
        console.log('Data Warehouse:', data);
    }, [productDetails, supplierDetails, importOrderDetails]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='bg-gray-100 p-6 m-4 shadow-md rounded-lg'>
            <h3 className='font-bold text-xl mb-4 text-gray-800'>{warehouseName}</h3>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Số điện thoại:</strong> <span>{warehousePhoneNumber}</span>
            </div>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Địa chỉ:</strong> <span>{warehouseAddress}</span>
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
            <div className='mt-4'>
                <h4 className='font-semibold text-lg mb-2 text-gray-800'>Nhà cung cấp:</h4>
                <ul className='list-disc list-inside'>
                    {supplierDetails.map((supplier, index) => (
                        <li key={index}>{supplier.name}</li>
                    ))}
                </ul>
            </div>
            <div className='mt-4'>
                <h4 className='font-semibold text-lg mb-2 text-gray-800'>Đơn hàng nhập:</h4>
                <ul className='list-disc list-inside'>
                    {importOrderDetails.map((order, index) => (
                        <li key={index}>{order.orderCode}</li>
                    ))}
                </ul>
            </div>
            {/* <div className='flex justify-end mt-4'>
                <button 
                    onClick={() => setEditWarehouse(true)} 
                    className='bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 mr-2'
                    aria-label='Edit Warehouse'
                >
                    <MdModeEditOutline />
                </button>
                <button 
                    onClick={() => setDeleteWarehouse(true)} 
                    className='bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600'
                    aria-label='Delete Warehouse'
                >
                    <MdDelete />
                </button>
            </div> */}
            {/* {editWarehouse && <EditWarehouse data={data} onClose={() => setEditWarehouse(false)} fetchData={fetchData} />}
            {deleteWarehouse && <DeleteWarehouse data={data} onClose={() => setDeleteWarehouse(false)} fetchData={fetchData} />} */}
        </div>
    );
};

export default WarehouseItem;
