import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import SupplierItem from '../components/SupplierItem';
import UploadSupplier from '../components/UploadSupplier';

const AllSupplier = () => {
    const [openUploadSupplier, setOpenUploadSupplier] = useState(false);
    const [allSupplier, setAllSupplier] = useState([]);

    const fetchAllSupplier = async () => {
        try {
            const response = await fetch(SummaryApi.allSupplier.url, {
                method: SummaryApi.allSupplier.method,
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const dataResponse = await response.json();

            if (dataResponse.success) {
                setAllSupplier(dataResponse.data || []);
            } else {
                console.error("Failed to fetch suppliers:", dataResponse.message);
            }
            console.log("ProductSUpplier: ", dataResponse.data.productsSupplier);
        } 
        catch (error) {
            console.error("Error while fetching suppliers:", error);
        }
    }

    useEffect(() => {
        fetchAllSupplier();
    }, []);

    return (
        <div>
            <div className='bg-white py-2 px-4 flex justify-between items-center'>
                <h2 className='font-bold text-lg'>Tất cả nhà cung cấp</h2>
                <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={() => setOpenUploadSupplier(true)}>
                    Cập nhật nhà cung cấp
                </button>
            </div>

            {/* All supplier */}
            {allSupplier.map((supplier, index) => (
                <SupplierItem data={supplier} key={index + "allSupplier"} fetchData={fetchAllSupplier} />
            ))}


            {/* Upload supplier */}
            {openUploadSupplier && (
                <UploadSupplier onClose={() => setOpenUploadSupplier(false)} fetchData={fetchAllSupplier}/>
            )}
        </div>
    )
}

export default AllSupplier;
