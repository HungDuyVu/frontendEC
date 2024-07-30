import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { utils, writeFile } from 'xlsx';

const ShowImportOrderInSupplier = ({ listImportOrderId, onClose, data }) => {
    const [importOrderDetails, setImportOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImportOrderDetails = async () => {
            setLoading(true);
            try {
                const importOrderDetailsArray = await Promise.all(
                    listImportOrderId.map(async (orderId) => {
                        const response = await fetch(SummaryApi.getImportOrderById.url, {
                            method: SummaryApi.getImportOrderById.method,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ orderId })
                        });
                        const data = await response.json();
                        if (data.success) {
                            const productsWithDetails = await Promise.all(
                                data.data.products.map(async (product) => {
                                    const productResponse = await fetch(SummaryApi.getProductById.url, {
                                        method: SummaryApi.getProductById.method,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ productId: product.product })
                                    });
                                    const productData = await productResponse.json();
                                    if (productData.success) {
                                        return { ...productData.data, quantity: product.quantity };
                                    } else {
                                        console.error("Failed to fetch product:", productData.message);
                                        return null;
                                    }
                                })
                            );
                            return { ...data.data, products: productsWithDetails.filter(product => product !== null) };
                        } else {
                            console.error("Failed to fetch import order:", data.message);
                            return null;
                        }
                    })
                );
                setImportOrderDetails(importOrderDetailsArray.filter(order => order !== null));
            } catch (error) {
                console.error("Error fetching import order details:", error);
                setError("Failed to fetch import order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchImportOrderDetails();
    }, [listImportOrderId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const exportToExcel = () => {
        const fileName = `Danh_sach_don_hang_nhap_cua${data}.xlsx`; 
        const workbook = utils.book_new();
        const worksheetData = [
            ["Mã đơn hàng", "Người nhập", "Nhà cung cấp", "Ngày nhập", "Tên sản phẩm", "Số lượng"]
        ];

        importOrderDetails.forEach(order => {
            order.products.forEach(product => {
                worksheetData.push([
                    order.orderCode,
                    order.importedBy,
                    order.supplier.name, // Assuming you have populated supplier name in the backend
                    new Date(order.importDate).toLocaleDateString(),
                    product.productName, // Assuming you have populated product details in the backend
                    product.quantity
                ]);
            });
        });

        const worksheet = utils.aoa_to_sheet(worksheetData);
        utils.book_append_sheet(workbook, worksheet, 'Import Orders');
        writeFile(workbook, fileName);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-7xl h-5/6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Danh sách đơn hàng nhập của nhà cung cấp {data}</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Đóng
                    </button>
                    <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Xuất Excel
                    </button>
                </div>
                <div className="flex-grow overflow-auto">
                    <table className="min-w-full bg-white table-auto mt-4">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Mã đơn hàng</th>
                                <th className="py-2 px-4 border">Người nhập</th>
                                <th className="py-2 px-4 border">Nhà cung cấp</th>
                                <th className="py-2 px-4 border">Ngày nhập</th>
                                <th className="py-2 px-4 border">Tên sản phẩm</th>
                                <th className="py-2 px-4 border">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importOrderDetails.map((order) => (
                                <React.Fragment key={order._id}>
                                    <tr>
                                        <td className="border px-4 py-2" rowSpan={order.products.length}>
                                            {order.orderCode}
                                        </td>
                                        <td className="border px-4 py-2" rowSpan={order.products.length}>
                                            {order.importedBy}
                                        </td>
                                        <td className="border px-4 py-2" rowSpan={order.products.length}>
                                            {order.supplier.name}
                                        </td>
                                        <td className="border px-4 py-2" rowSpan={order.products.length}>
                                            {new Date(order.importDate).toLocaleDateString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {order.products[0].productName}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {order.products[0].quantity}
                                        </td>
                                    </tr>
                                    {order.products.slice(1).map((product, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">
                                                {product.productName}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {product.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowImportOrderInSupplier;
