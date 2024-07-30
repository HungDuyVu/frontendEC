import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
    dimensions: productData?.dimensions || {
        length: "",
        width: "",
        height: ""
    },
    weight: productData?.weight || "",
    suppliers: productData?.suppliers || []
  });
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierList, setShowSupplierList] = useState(false);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const fetchSuppliers = async () => {
    const response = await fetch(SummaryApi.allSupplier.url);
    const dataResponse = await response.json();
    if (dataResponse && dataResponse.data) {
      setSuppliers(dataResponse.data);
    } else {
      toast.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value
      }
    }));
  };

  const handleSupplierChange = (supplierId) => {
    if (data.suppliers.includes(supplierId)) {
      setData((prev) => ({
        ...prev,
        suppliers: prev.suppliers.filter(id => id !== supplierId)
      }));
    } else {
      setData((prev) => ({
        ...prev,
        suppliers: [...prev.suppliers, supplierId]
      }));
    }
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    } else {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Sửa sản phẩm</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          <label htmlFor='productName'>Tên sản phẩm :</label>
          <input
            type='text'
            id='productName'
            placeholder='enter product name'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='brandName' className='mt-3'>Tên hãng :</label>
          <input
            type='text'
            id='brandName'
            placeholder='enter brand name'
            value={data.brandName}
            name='brandName'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='category' className='mt-3'>Danh mục :</label>
          <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
            <option value={""}>Select Category</option>
            {
              productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>{el.label}</option>
              ))
            }
          </select>

          <label htmlFor='suppliers' className='mt-3'>Nhà cung cấp</label>
          <div className='bg-slate-100 border rounded p-2'>
            {data.suppliers.map(supplierId => {
              const supplier = suppliers.find(s => s._id === supplierId);
              return (
                <div key={supplierId} className='flex items-center bg-gray-200 p-2 rounded mr-2 mb-2'>
                  <span>{supplier?.name}</span>
                  <CgClose className='ml-2 cursor-pointer' onClick={() => handleSupplierChange(supplierId)} />
                </div>
              );
            })}
            <button
              type='button'
              onClick={() => setShowSupplierList(!showSupplierList)}
              className='bg-blue-500 text-white p-2 rounded mt-2'
            >
              {showSupplierList ? 'Đóng danh sách' : 'Thêm nhà cung cấp'}
            </button>
            {showSupplierList && (
              <div className='mt-2'>
                {suppliers.map(supplier => (
                  <div
                    key={supplier._id}
                    className={`p-2 cursor-pointer ${data.suppliers.includes(supplier._id) ? 'bg-green-200' : 'bg-gray-200'} mb-2 rounded`}
                    onClick={() => handleSupplierChange(supplier._id)}
                  >
                    {supplier.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <label htmlFor='productImage' className='mt-3'>Ảnh sản phẩm :</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'><FaCloudUploadAlt /></span>
                <p className='text-sm'>Cập nhật ảnh</p>
                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>
          <div>
            {
              data?.productImage[0] ? (
                <div className='flex items-center gap-2'>
                  {
                    data.productImage.map((el, index) => (
                      <div className='relative group' key={index}>
                        <img
                          src={el}
                          alt={el}
                          width={80}
                          height={80}
                          className='bg-slate-100 border cursor-pointer'
                          onClick={() => {
                            setOpenFullScreenImage(true);
                            setFullScreenImage(el);
                          }} />

                        <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                          <MdDelete />
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className='text-red-600 text-xs'>*Hãy cập nhật ảnh</p>
              )
            }
          </div>

          <label htmlFor='price' className='mt-3'>Giá :</label>
          <input
            type='number'
            id='price'
            placeholder='enter price'
            value={data.price}
            name='price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='sellingPrice' className='mt-3'>Giá bán :</label>
          <input
            type='number'
            id='sellingPrice'
            placeholder='enter selling price'
            value={data.sellingPrice}
            name='sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label htmlFor='description' className='mt-3'>Mô tả :</label>
          <textarea
            rows={3}
            id='description'
            placeholder='enter description'
            value={data.description}
            name='description'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded resize-none overflow-hidden'
            style={{ minHeight: '200px', height: 'auto', overflowY: 'visible' }}
            required
          ></textarea>

          <label htmlFor='dimensions' className='mt-3'>Kích thước:</label>
          <div className='flex flex-wrap justify-between gap-3'>
            <input
              type='number'
              placeholder='length'
              value={data.dimensions.length}
              name='length'
              onChange={handleDimensionChange}
              className='p-2 bg-slate-100 border rounded w-32'
              required
            />
            <input
              type='number'
              placeholder='width'
              value={data.dimensions.width}
              name='width'
              onChange={handleDimensionChange}
              className='p-2 bg-slate-100 border rounded w-32'
              required
            />
            <input
              type='number'
              placeholder='height'
              value={data.dimensions.height}
              name='height'
              onChange={handleDimensionChange}
              className='p-2 bg-slate-100 border rounded w-32'
              required
            />
          </div>

          <label htmlFor='weight' className='mt-3'>Cân nặng:</label>
          <input
            type='number'
            placeholder='weight'
            value={data.weight}
            name='weight'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded w-32'
            required
          />

          <button className='bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-medium text-lg drop-shadow w-full py-1 rounded-full my-2'>
            Cập nhật
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage image={fullScreenImage} setOpenFullScreenImage={setOpenFullScreenImage} />
      )}
    </div>
  );
};

export default AdminEditProduct;
