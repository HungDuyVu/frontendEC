import React, { useEffect, useState } from 'react'
import UploadInventory from '../components/UploadInventory';
import SummaryApi from '../common';
import WarehouseItem from '../components/WarehouseItem';

const AllWarehouse = () => {
  
  const [openUploadWarehouse, setOpenUploadWarehouse] = useState(false);
  const [allWarehouse, setAllWarehouse] = useState([])

  const fetchAllWarehouse = async () => {
    const response = await fetch(SummaryApi.allWarehouse.url, {
      method: SummaryApi.allWarehouse.method,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    })
    const dataResponse = await response.json()

    setAllWarehouse(dataResponse?.data || [])
    
  }

  useEffect (() => {
    fetchAllWarehouse();
  })

  return (
    <div>
       <div className='bg-white py-2 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>Kho hàng</h2>
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={() => setOpenUploadWarehouse(true)}>
              Cập nhật kho hàng
            </button>
        </div>
        {/* ALL Warehouse */}
        <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            allWarehouse.map((warehouse,index)=>{
              return(
                <WarehouseItem data={warehouse} key={index+"allWarehouse"} fetchdata={fetchAllWarehouse}/>
                
              )
            })
          }
        </div>

        {/* Upload Inventory */}
        {
          openUploadWarehouse && (
            <UploadInventory 
              onClose={() => setOpenUploadWarehouse(false)} 
              fetchData={fetchAllWarehouse}
            />
          )
        }
    </div>
  )
}

export default AllWarehouse