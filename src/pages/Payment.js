import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CgClose } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import PaymentOnline from '../components/PaymentOnline'

const Payment = ({ selectedProducts, onClose }) => {
  const [data, setData] = useState({
    paymentMethod: 'Thanh toán khi nhận hàng',
    totalProductAmount: 0,
    shippingFee: 0,
    totalOrderAmount: 0,
    userAddress: null,
  });

  const user = useSelector((state) => state?.user?.user);
  const addressListId = user?.addresses || [];
  const [userAddress, setUserAddress] = useState([]);
  const [paymentProducts, setPaymentProducts] = useState(selectedProducts);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showPaymentOnline, setShowPaymentOnline] = useState(false); 
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const addressArray = await Promise.all(
          addressListId.map(async (addressId) => {
            const response = await fetch(SummaryApi.getAddressById.url, {
              method: SummaryApi.getAddressById.method,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ addressId }),
            });
            const data = await response.json();
            if (data.success) {
              return data.data;
            } else {
              console.error('Failed to fetch address:', data.message);
              return null;
            }
          })
        );
        setUserAddress(addressArray.filter((address) => address !== null));
      } catch (error) {
        console.error('Error fetching address details:', error);
      }
    };

    fetchUserAddress();
  }, [addressListId]);

  useEffect(() => {
    const totalProductAmount = paymentProducts.reduce((acc, product) => acc + product.quantity * product.productId.sellingPrice, 0);
    setData((prevData) => ({
      ...prevData,
      totalProductAmount,
      totalOrderAmount: totalProductAmount + prevData.shippingFee,
    }));
  }, [paymentProducts]);

  const handleAddressSelect = (address) => {
    setData((prevData) => ({
      ...prevData,
      userAddress: address,
    }));
    setShowAddressList(false);
  };

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      paymentMethod: value,
    }));
  };

  const handleIncreaseQuantity = (index) => {
    const newPaymentProducts = [...paymentProducts];
    newPaymentProducts[index].quantity += 1;
    setPaymentProducts(newPaymentProducts);
  };

  const handleDecreaseQuantity = (index) => {
    if (paymentProducts[index].quantity > 1) {
      const newPaymentProducts = [...paymentProducts];
      newPaymentProducts[index].quantity -= 1;
      setPaymentProducts(newPaymentProducts);
    }
  };

  const handleRemoveProduct = (index) => {
    const newPaymentProducts = paymentProducts.filter((_, i) => i !== index);
    setPaymentProducts(newPaymentProducts);
  };

  const handlePayment = async () => {
    if (!data.userAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (data.paymentMethod === 'Thanh toán Online') {
      setShowPaymentOnline(true); // Hiển thị PaymentOnline khi chọn thanh toán online
    } else {
      try {
        const response = await fetch(SummaryApi.createOrder.url, {
          method: SummaryApi.createOrder.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user._id,
            products: paymentProducts.map((product) => ({
              product: product.productId,
              quantity: product.quantity,
            })),
            totalProductAmount: data.totalProductAmount,
            paymentMethod: data.paymentMethod,
            shippingFee: data.shippingFee,
            userAddress: data.userAddress,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setOrderId(result.order._id);
          toast.success('Đặt hàng thành công!');
          onClose();
          console.log('Order created successfully:', result);
        } else {
          toast.error('Đặt hàng thất bại: ' + result.message);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Đặt hàng thất bại: ' + error.message);
      }
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
      <div className='bg-white p-6 rounded w-full max-w-3xl h-full max-h-[85%] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Đơn hàng</h2>
          <div className='w-fit text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>
        <div className='overflow-y-auto mb-4'>
          <form className='flex flex-col'>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Địa chỉ</h4>
            <div className='mb-4 p-4 border rounded cursor-pointer' onClick={() => setShowAddressList(!showAddressList)}>
              {data.userAddress ? (
                <>
                  <p className='text-lg text-gray-700 mb-2'><strong>Người nhận:</strong> {data.userAddress.recipientName}</p>
                  <p className='text-lg text-gray-700 mb-2'><strong>Địa chỉ:</strong> {data.userAddress.address}</p>
                  <p className='text-lg text-gray-700'><strong>Số điện thoại:</strong> {data.userAddress.phoneNumber}</p>
                </>
              ) : (
                <p className='text-lg text-gray-600'>Chưa có địa chỉ</p>
              )}
            </div>
            {showAddressList && (
              <div className='overflow-y-auto max-h-40 mb-4'>
                {userAddress.length > 0 ? (
                  userAddress.map((address) => (
                    <div key={address._id} className='mb-4 p-4 border rounded cursor-pointer' onClick={() => handleAddressSelect(address)}>
                      <p className='text-lg text-gray-700 mb-2'><strong>Người nhận:</strong> {address.recipientName}</p>
                      <p className='text-lg text-gray-700 mb-2'><strong>Địa chỉ:</strong> {address.address}</p>
                      <p className='text-lg text-gray-700'><strong>Số điện thoại:</strong> {address.phoneNumber}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-lg text-gray-600'>Chưa có địa chỉ</p>
                )}
              </div>
            )}
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Sản phẩm</h4>
            <div className='overflow-y-auto max-h-96 mb-4'>
              {paymentProducts.map((product, index) => (
                <div key={product._id} className='flex justify-between items-center p-4 border-b'>
                  <div className='flex items-center'>
                    <img src={product.productId.productImage[0]} className='w-16 h-16 object-cover mr-4' />
                    <div>
                      <h2 className='text-lg font-bold'>{product.productId.productName}</h2>
                      <p className='text-gray-600'>{product.productId.category}</p>
                      <p className='text-red-600'>{displayINRCurrency(product.productId.sellingPrice)}</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <button
                      type="button"
                      className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecreaseQuantity(index);
                      }}
                    >
                      -
                    </button>
                    <span className='mx-2'>{product.quantity}</span>
                    <button
                      type="button"
                      className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncreaseQuantity(index);
                      }}
                    >
                      +
                    </button>
                    <div
                      className='ml-4 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProduct(index);
                      }}
                    >
                      <MdDelete />
                      </div>
                  </div>
                </div>
              ))}
            </div>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Phương thức thanh toán</h4>
            <select className='p-2 bg-slate-100 border rounded mb-4' value={data.paymentMethod} onChange={handlePaymentMethodChange}>
              <option value='Thanh toán khi nhận hàng'>Thanh toán khi nhận hàng</option>
              <option value='Thanh toán Online'>Thanh toán Online</option>
            </select>
            <div className='flex justify-between items-center p-4 border-t'>
              <p className='text-lg font-bold'>Tổng cộng:</p>
              <p className='text-lg font-bold text-red-600'>{displayINRCurrency(data.totalOrderAmount)}</p>
            </div>
          </form>
        </div>
        <button
          type="button"
          className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 mt-4 self-end'
          onClick={handlePayment}
        >
          Xác nhận
        </button>
      </div>

      {/* Render PaymentOnline component if payment method is 'Thanh toán Online' */}
      {showPaymentOnline && (
        <PaymentOnline
          totalOrderAmount={data.totalOrderAmount}
          onClose={() => setShowPaymentOnline(false)}
          paymentProducts={paymentProducts}
          userAddress={data.userAddress}
          orderId={orderId}
        />
      )}

    </div>
  );
};

export default Payment;

