import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import SummaryApi from '../common';
import UpdateWarehouse from './UpdateWarehouse';
import { MdModeEditOutline } from 'react-icons/md';

const WarehouseItem = ({ data, fetchData }) => {
  const {
    _id,
    warehouseName = '',
    warehousePhoneNumber = '',
    warehouseAddress = '',
    importOrder = [],
    products = [],
    suppliers = []
  } = data;

  const [productDetails, setProductDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProductList = async () => {
    try {
      const productListArray = await Promise.all(
        products.map(async (product) => {
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
            const importOrdersForProduct = importOrder.filter(order =>
              order.products.some(p => p.product === product.product)
            );

            const details = importOrdersForProduct.map(order => {
              const orderProduct = order.products.find(p => p.product === product.product);
              const supplier = suppliers.find(supplier => supplier._id === order.supplier);
              return {
                orderCode: order.orderCode,
                importDate: order.importDate,
                quantity: orderProduct.quantity,
                supplierName: supplier?.name
              };
            });

            return {
              ...data.data,
              totalQuantity: product.quantity,
              details
            };
          } else {
            console.error("Failed to fetch product:", data.message);
            return null;
          }
        })
      );
      setProductDetails(productListArray.filter(product => product !== null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div className="bg-gray-100 p-6 m-4 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-gray-800">Kho hàng {warehouseName}</h3>
        <button
          onClick={() => setIsEditing(true)}
          className='bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600'
          aria-label='Edit Warehouse'
        >
          <MdModeEditOutline />
        </button>
      </div>
      <div className="mb-2 text-gray-700">
        <strong className='text-lg'>Số điện thoại:</strong> <span>{warehousePhoneNumber}</span>
      </div>
      <div className="mb-2 text-gray-700">
        <strong className='text-lg'>Địa chỉ:</strong> <span>{warehouseAddress}</span>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold text-xl mb-4 text-gray-800">Danh sách sản phẩm:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Số lượng trong kho
                </th>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Ngày nhập
                </th>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Số lượng nhập
                </th>
                <th className="py-3 px-6 border-b border-gray-300 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Nhà cung cấp
                </th>
              </tr>
            </thead>
            <tbody>
              {productDetails.map((product, index) => (
                product.details.map((detail, detailIndex) => (
                  <tr key={`${index}-${detailIndex}`} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                    {detailIndex === 0 && (
                      <>
                        <td className="py-3 px-6 border-b border-gray-300" rowSpan={product.details.length}>{product.productName}</td>
                        <td className="py-3 px-6 border-b border-gray-300" rowSpan={product.details.length}>{product.totalQuantity}</td>
                      </>
                    )}
                    <td className="py-3 px-6 border-b border-gray-300">{detail.orderCode}</td>
                    <td className="py-3 px-6 border-b border-gray-300">{format(new Date(detail.importDate), 'dd/MM/yyyy')}</td>
                    <td className="py-3 px-6 border-b border-gray-300">{detail.quantity}</td>
                    <td className="py-3 px-6 border-b border-gray-300">{detail.supplierName}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditing && <UpdateWarehouse warehouseData={data} onClose={() => setIsEditing(false)} fetchData={fetchData} />}
    </div>
  );
};

export default WarehouseItem;
