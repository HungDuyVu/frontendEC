import React, { useState, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const UpdateWarehouse = ({ warehouseData, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    ...warehouseData,
    warehouseName: warehouseData?.warehouseName || '',
    warehousePhoneNumber: warehouseData?.warehousePhoneNumber || '',
    warehouseAddress: warehouseData?.warehouseAddress || '',
    products: warehouseData?.products || []
  });
  const [productDetails, setProductDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const productListArray = await Promise.all(
        warehouseData.products.map(async (product) => {
          const response = await fetch(SummaryApi.getProductById.url, {
            method: SummaryApi.getProductById.method,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.product })
          });
          const data = await response.json();
          if (data.success) {
            return {
              ...data.data,
              quantity: product.quantity
            };
          } else {
            console.error("Failed to fetch product:", data.message);
            return null;
          }
        })
      );
      setProductDetails(productListArray.filter(product => product !== null));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('warehouse data: ', warehouseData);
    fetchProductDetails();
  }, [warehouseData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index][name] = value;
      return {
        ...prev,
        products: updatedProducts
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(SummaryApi.updateWarehouse.url, {
        method: SummaryApi.updateWarehouse.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: warehouseData._id,
          warehouseName: formData.warehouseName,
          warehousePhoneNumber: formData.warehousePhoneNumber,
          warehouseAddress: formData.warehouseAddress,
          products: formData.products
        })
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        fetchData();
        onClose();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error('Error updating warehouse:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật kho hàng, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productDetails.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-xl">Cập nhật kho hàng</h2>
          <button
            aria-label="Close update warehouse form"
            className="text-2xl hover:text-red-600"
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="warehouseName" className="block text-sm font-medium text-gray-700">
                Tên kho hàng:
              </label>
              <input
                type="text"
                id="warehouseName"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleOnChange}
                className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                aria-required="true"
                aria-label="Warehouse Name"
              />
            </div>

            <div>
              <label htmlFor="warehousePhoneNumber" className="block text-sm font-medium text-gray-700">
                Số điện thoại:
              </label>
              <input
                type="text"
                id="warehousePhoneNumber"
                name="warehousePhoneNumber"
                value={formData.warehousePhoneNumber}
                onChange={handleOnChange}
                className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                aria-required="true"
                aria-label="Warehouse Phone Number"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="warehouseAddress" className="block text-sm font-medium text-gray-700">
                Địa chỉ:
              </label>
              <input
                type="text"
                id="warehouseAddress"
                name="warehouseAddress"
                value={formData.warehouseAddress}
                onChange={handleOnChange}
                className="mt-1 p-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                aria-required="true"
                aria-label="Warehouse Address"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Danh sách sản phẩm</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                      Tên sản phẩm
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng trong kho
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-4 py-2 whitespace-normal break-words">{product.productName}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          name="quantity"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(indexOfFirstProduct + index, e)}
                          className="p-2 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                          aria-required="true"
                          aria-label={`Product quantity for ${product.productName}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {productDetails.length > productsPerPage && (
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Trang trước
              </button>
              <span>
                Trang {currentPage} / {Math.ceil(productDetails.length / productsPerPage)}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(productDetails.length / productsPerPage)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Trang sau
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateWarehouse;
