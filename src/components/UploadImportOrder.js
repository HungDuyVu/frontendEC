import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SummaryApi from '../common';

const UploadImportOrder = ({ onClose, fetchData }) => {
    const [data, setData] = useState({
        orderCode: "",
        importedBy: "",
        supplier: "",
        importDate: "",
        products: [],
        warehouse: "",
    });
    const [allSuppliers, setAllSuppliers] = useState([]);
    const [productsBySupplier, setProductsBySupplier] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([])

    useEffect(() => {
        const fetchAllSuppliers = async () => {
            try {
                const response = await fetch(SummaryApi.allSupplier.url, {
                    method: SummaryApi.allSupplier.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const dataResponse = await response.json();
                setAllSuppliers(dataResponse?.data || []);
            } catch (error) {
                console.error("Error while fetching suppliers:", error);
            }
        };

        const fetchWarehouses = async () => {
            try {
                const response = await fetch(SummaryApi.allWarehouse.url, {
                    method: SummaryApi.allWarehouse.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const dataResponse = await response.json();
                setWarehouses(dataResponse?.data || []);
                console.log('wareHouse: ', dataResponse.data);
            } catch (error) {
                console.error("Error while fetching warehouses:", error);
            }
        };

        fetchAllSuppliers();
        fetchWarehouses();
    }, []);

    const fetchProductsBySupplier = async (supplierId) => {
        try {
            const response = await fetch(SummaryApi.getProductsBySupplier.url, {
                method: SummaryApi.getProductsBySupplier.method,
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ supplierId })
            });
            const dataResponse = await response.json();
            setProductsBySupplier(dataResponse?.data || []);
        } catch (error) {
            console.error("Error while fetching products:", error);
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === 'supplier') {
            fetchProductsBySupplier(value);
            setSelectedProducts([]);
        }
    };
    const handleQuantityChange = (productId, quantity) => {
        setData(prevData => ({
            ...prevData,
            products: prevData.products.map(p => {
                if (p.product === productId) {
                    return { ...p, quantity: parseInt(quantity) };
                }
                return p;
            })
        }));
    };
    
    const handleProductClick = (productId) => {
        setSelectedProducts(prev => {
            const isSelected = prev.includes(productId);
            let newSelectedProducts;
            if (isSelected) {
                newSelectedProducts = prev.filter(id => id !== productId);
            } else {
                newSelectedProducts = [...prev, productId];
            }
            setData(prevData => ({
                ...prevData,
                products: isSelected ? prevData.products.filter(p => p.product !== productId) : [...prevData.products, { product: productId, quantity: 1 }]
            }));
            return newSelectedProducts;
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Data being sent:", data); // Thêm dòng này để kiểm tra dữ liệu gửi đi
        try {
            const response = await fetch(SummaryApi.uploadImportOrder.url, {
                method: SummaryApi.uploadImportOrder.method,
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData.message);
                onClose();
                fetchData();
            } else {
                toast.error(responseData.message);
            }
            console.log(responseData);
        } catch (error) {
            toast.error("Error while submitting import order");
        }
    };
    
    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='bg-white p-6 rounded w-full max-w-2xl h-auto max-h-[90%] overflow-hidden flex flex-col'
            >
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Thêm đơn hàng nhập</h2>
                    <div className='w-fit text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>
                <form className='flex flex-col overflow-y-auto' onSubmit={handleSubmit}>
                    <label htmlFor='orderCode' className='font-medium'>Mã đơn hàng:</label>
                    <input
                        type='text'
                        id='orderCode'
                        placeholder='Nhập mã đơn hàng'
                        name='orderCode'
                        value={data.orderCode}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded mb-4'
                        required
                    />
                    <label htmlFor='importedBy' className='font-medium'>Người nhập hàng:</label>
                    <input
                        type='text'
                        id='importedBy'
                        placeholder='Nhập tên người nhập hàng'
                        name='importedBy'
                        value={data.importedBy}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded mb-4'
                        required
                    />
                    <label htmlFor='supplier' className='font-medium'>Nhà cung cấp:</label>
                    <select
                        id='supplier'
                        name='supplier'
                        value={data.supplier}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded mb-4'
                        required
                    >
                        <option value="">Chọn nhà cung cấp</option>
                        {allSuppliers.map(supplier => (
                            <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                        ))}
                    </select>
                    <label htmlFor='importDate' className='font-medium'>Ngày nhập hàng:</label>
                    <input
                        type='date'
                        id='importDate'
                        name='importDate'
                        value={data.importDate}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded mb-4'
                        required
                    />
                   <label htmlFor='products' className='font-medium'>Sản phẩm:</label>
                    <div className='relative mb-4'>
                        <div className='flex flex-col p-2 bg-slate-100 border rounded max-h-48 overflow-y-auto'>
                            {productsBySupplier.length > 0 ? (
                                productsBySupplier.map(product => (
                                    <motion.div
                                        key={product._id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`cursor-pointer flex justify-between items-center p-2 ${selectedProducts.includes(product._id) ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}
                                        onClick={() => handleProductClick(product._id)}
                                    >
                                        <span>{product.productName}</span>
                                        <input
                                            type='number'
                                            min='1'
                                            value={data.products.find(p => p.product === product._id)?.quantity || ''}
                                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan sang phần tử cha
                                            className='p-1 border rounded w-16 text-left cursor-pointer' // Thêm CSS để chỉ ra rằng ô số lượng có thể được nhấp vào
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <p className='p-2 text-gray-500'>Không có sản phẩm nào để hiển thị</p>
                            )}
                        </div>
                    </div>
                    <label htmlFor='warehouse' className='font-medium'>Kho hàng:</label>
                    <select
                        id='warehouse'
                        name='warehouse'
                        value={data.warehouse}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded mb-4'
                        required
                    >
                        <option value="">Chọn kho hàng</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse._id} value={warehouse._id}>{warehouse.warehouseName}
                            </option>
                        ))}
                    </select>
                    <div className='mt-auto'>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded' 
                            type='submit'
                        >
                            Thêm đơn hàng nhập
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadImportOrder;
