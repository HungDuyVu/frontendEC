import React, { useState } from 'react'
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import AdminDeleteProduct from './AdminDeleteProduct';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
  const [editProduct,setEditProduct] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(false)


  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={data?.productImage[0]}  className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

            <div>
                <p className='font-semibold'>
                  {
                    displayINRCurrency(data.sellingPrice)
                  }
                </p>

                <div className='flex justify-between'>
                  <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={() => setDeleteProduct(true)}>
                    <MdDelete/>  
                  </div>
                  <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                    <MdModeEditOutline/>
                  </div>
                </div>
               
            </div>
                  
       </div>
        {/* Edit product */}
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
        {/* Delete Product */}
        {
          deleteProduct && (
            <AdminDeleteProduct productData={data} onClose={() => setDeleteProduct(false)} fetchdata={fetchdata} />
          )
        }
    
    </div>
  )
}

export default AdminProductCard