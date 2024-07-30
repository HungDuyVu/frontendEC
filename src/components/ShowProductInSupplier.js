import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { utils, writeFile } from 'xlsx';


const ShowProductInSupplier = ({ listProductId, onClose, data }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const productDetailsArray = await Promise.all(
                    listProductId.map(async (productId) => {
                        const response = await fetch(SummaryApi.getProductById.url, {
                            method: SummaryApi.getProductById.method,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ productId })
                        });
                        const data = await response.json();
                        if (data.success) {
                            console.log('Fetched product data:', data.data); // Log data for debugging
                            return data.data;
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
    }, [listProductId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const exportToExcel = () => {
        const fileName = `Nhà cung cấp ${data}.xlsx`; 
        const workbook = utils.book_new();
        const worksheet = utils.aoa_to_sheet([
            ["Tên sản phẩm", "Thương hiệu", "Danh mục", "Hình ảnh", "Mô tả", "Giá bán", "Giá khuyến mãi", "Kích thước (DxRxC)", "Trọng lượng"],
            ...productDetails.map(product => [
                product.productName,
                product.brandName,
                product.category,
                product.productImage.join(", "), // Nối các URL của hình ảnh thành một chuỗi
                product.description,
                product.price,
                product.sellingPrice,
                `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} cm`,
                `${product.weight} kg`
            ])
        ]);
        utils.book_append_sheet(workbook, worksheet, 'Product Details');
        writeFile(workbook, `${fileName}`);
    };

  

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-7xl h-5/6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Danh sách sản phẩm của nhà phân phối {data}</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Đóng
                    </button>
                    <button onClick={exportToExcel}>Xuất Excel</button>

                </div>
                <div className="flex-grow overflow-auto">
                    <table className="min-w-full bg-white table-auto mt-4">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Tên sản phẩm</th>
                                <th className="py-2 px-4 border">Thương hiệu</th>
                                <th className="py-2 px-4 border">Danh mục</th>
                                <th className="py-2 px-4 border">Hình ảnh</th>
                                <th className="py-2 px-4 border">Mô tả</th>
                                <th className="py-2 px-4 border">Giá bán</th>
                                <th className="py-2 px-4 border">Giá khuyến mãi</th>
                                <th className="py-2 px-4 border">Kích thước (DxRxC)</th>
                                <th className="py-2 px-4 border">Trọng lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productDetails.map((product) => (
                                <tr key={product._id}>
                                    <td className="border px-4 py-2">{product.productName}</td>
                                    <td className="border px-4 py-2">{product.brandName}</td>
                                    <td className="border px-4 py-2">{product.category}</td>
                                    <td className="border px-4 py-2">
                                        {product.productImage.map((image, index) => (
                                            <img key={index} src={image} alt={product.productName} className="w-20 h-20 object-cover" />
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2">{product.description}</td>
                                    <td className="border px-4 py-2">{product.price}</td>
                                    <td className="border px-4 py-2">{product.sellingPrice}</td>
                                    <td className="border px-4 py-2">
                                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                                    </td>
                                    <td className="border px-4 py-2">{product.weight} kg</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowProductInSupplier;
