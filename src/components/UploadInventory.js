import React, { useState } from 'react'
import SummaryApi from '../common';
import { CgClose } from 'react-icons/cg'

const UploadInventory = ({
    onClose, 
    fetchData
}) => {
  const [data, setData] = useState({
    warehouseName: "",
    warehousePhoneNumber: "",
    warehouseAddress: "",
    
  })
  const [allWarehouse, setAllWarehouse] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(SummaryApi.uploaWarehouse.url, {
      method: SummaryApi.uploaWarehouse.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const dataResponse = await response.json()
    if (dataResponse.success) {
      fetchData()
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-slate-200 bg-opacity-35'>
    <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl h-full max-h-[50%] overflow-hidden'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold text-lg'>Thêm kho</h2>
        <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
          <CgClose />
        </div>
      </div>
  
      <form className='grid gap-4 overflow-y-scroll' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <label htmlFor='warehouseName' className='font-medium'>Tên kho:</label>
          <input
            type='text'
            id='warehouseName'
            placeholder='Nhập tên kho'
            name='warehouseName'
            value={data.warehouseName}
            required 
            onChange={handleChange}
            className='p-3 bg-slate-100 border rounded mt-2'
          />
        </div>
  
        <div className='flex flex-col'>
          <label htmlFor='warehousePhoneNumber' className='font-medium'>Số điện thoại:</label>
          <input
            type='text'
            id='warehousePhoneNumber'
            placeholder='Nhập số điện thoại'
            name='warehousePhoneNumber'
            value={data.warehousePhoneNumber}
            required 
            onChange={handleChange}
            className='p-3 bg-slate-100 border rounded mt-2'
          />
        </div>
  
        <div className='flex flex-col'>
          <label htmlFor='warehouseAddress' className='font-medium'>Địa chỉ:</label>
          <input
            type='text'
            id='warehouseAddress'
            placeholder='Nhập địa chỉ kho'
            name='warehouseAddress'
            value={data.warehouseAddress}
            required 
            onChange={handleChange}
            className='p-3 bg-slate-100 border rounded mt-2'
          />
        </div>
  
        <button className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'>
          Thêm kho
        </button>
      </form>
    </div>
  </div>
  
  )
}

export default UploadInventory