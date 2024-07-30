import React, { useState } from 'react';
import SummaryApi from '../common';
import { CgClose } from "react-icons/cg";
import { toast } from 'react-toastify';

const UploadSupplier = ({ 
    onClose, 
    fetchData 
}) => {
    const [data, setData] = useState({
        name : "",
        email : "",
        phoneNumber : "",
        address : ""
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(SummaryApi.uploadSupplier.url, {
                method: SummaryApi.uploadSupplier.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData.message);
                onClose();
                fetchData();
            } 
        } 
        catch (error) {
            // toast.error(error.message);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-6 rounded w-full max-w-2xl h-auto max-h-[90%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Thêm nhà cung cấp</h2>
                    <div className='w-fit text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>
                <form className='grid gap-4 overflow-y-auto' onSubmit={handleSubmit}>
                    <label htmlFor='name' className='font-medium'>Tên nhà cung cấp:</label>
                    <input
                        type='text'
                        id='name'
                        placeholder='Nhập tên nhà cung cấp'
                        name='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='email' className='font-medium'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Nhập email'
                        value={data.email}
                        name='email'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='phoneNumber' className='font-medium'>Số điện thoại:</label>
                    <input
                        type='text'
                        id='phoneNumber'
                        placeholder='Nhập số điện thoại'
                        value={data.phoneNumber}
                        name='phoneNumber'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='address' className='font-medium'>Địa chỉ:</label>
                    <input
                        type='text'
                        id='address'
                        placeholder='Nhập địa chỉ'
                        value={data.address}
                        name='address'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <button className='px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded' type='submit'>Thêm nhà cung cấp</button>
                </form>
            </div>
        </div>
    );
};

export default UploadSupplier;
