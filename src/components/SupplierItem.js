import React, { useState } from 'react';
import ShowProductInSupplier from './ShowProductInSupplier';
import ShowImportOrderInSupplier from './ShowImportOrderInSupplier';
import UpdateSupplier from './UpdateSupplier';
import DeleteSupplier from './DeleteSupplier';
import { MdDelete, MdModeEditOutline } from "react-icons/md";

const SupplierItem = ({ data, fetchData }) => {
    const { name, email, phoneNumber, address, productsSupplied = [], orders = [] } = data;
    const [openListProduct, setOpenListProduct] = useState(false);
    const [openListImportOrder, setOpenListImportOrder] = useState(false);
    const [editSupplier, setEditSupplier] = useState(false);
    const [deleteSupplier, setDeleteSupplier] = useState(false);

    return (
        <div className='bg-gray-100 p-6 m-4 shadow-md rounded-lg'>
            <h3 className='font-bold text-xl mb-4 text-gray-800'>{name}</h3>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Email:</strong> <span>{email}</span>
            </div>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Số điện thoại:</strong> <span>{phoneNumber}</span>
            </div>
            <div className='mb-2 text-gray-700'>
                <strong className='text-lg'>Địa chỉ:</strong> <span>{address}</span>
            </div>
            <div className='mb-4'>
                <button
                    onClick={() => setOpenListProduct(true)}
                    className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'
                >
                    Danh sách sản phẩm
                </button>
                {openListProduct && (
                    <ShowProductInSupplier
                        listProductId={productsSupplied}
                        onClose={() => setOpenListProduct(false)}
                        data={data.name}
                    />
                )}
            </div>
            <div className='mb-4'>
                <button
                    onClick={() => setOpenListImportOrder(true)}
                    className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors'
                >
                    Danh sách đơn hàng
                </button>
                {openListImportOrder && (
                    <ShowImportOrderInSupplier
                        listImportOrderId={orders}
                        onClose={() => setOpenListImportOrder(false)}
                        data={data.name}
                    />
                )}
            </div>
            <div className='flex justify-end mt-4'>
                <button
                    onClick={() => setEditSupplier(true)}
                    className='bg-yellow-500 text-white py-1 px-3 rounded-full hover:bg-yellow-600 mr-2'
                    aria-label='Edit Supplier'
                >
                    <MdModeEditOutline />
                </button>
                <button
                    onClick={() => setDeleteSupplier(true)}
                    className='bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600'
                    aria-label='Delete Supplier'
                >
                    <MdDelete />
                </button>
            </div>
            {editSupplier && <UpdateSupplier supplierData={data} onClose={() => setEditSupplier(false)} fetchData={fetchData} />}
            {deleteSupplier && <DeleteSupplier supplierId={data._id} onClose={() => setDeleteSupplier(false)} fetchData={fetchData} />}
        </div>
    );
};

export default SupplierItem;
