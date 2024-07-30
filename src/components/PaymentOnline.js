import React from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import { CgClose } from 'react-icons/cg';
import qrCode from '../assest/QrThanhToan.jpg'; // Import ảnh QR từ thư mục assets

const PaymentOnline = ({ totalOrderAmount, onClose, paymentProducts, userAddress, orderId }) => {
  const handlePaymentOnline = async () => {
    try {
      const response = await fetch(SummaryApi.paymentOnline.url, {
        method: SummaryApi.paymentOnline.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          totalAmount: totalOrderAmount,
          paymentProducts: paymentProducts,
          userAddress: userAddress,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Thanh toán thành công!');
        onClose();
      } else {
        toast.error('Thanh toán thất bại: ' + result.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      // toast.error('Thanh toán thất bại: ' + error.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
      <div className='bg-white p-6 rounded w-full max-w-3xl h-full max-h-[85%] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Thanh toán Online</h2>
          <div className='w-fit text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>
        <div className='overflow-y-auto mb-4'>
          <form className='flex flex-col'>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Thông tin thanh toán</h4>
            <p className='text-lg text-gray-700 mb-2'><strong>Người nhận:</strong> {userAddress.recipientName}</p>
            <p className='text-lg text-gray-700 mb-2'><strong>Địa chỉ:</strong> {userAddress.address}</p>
            <p className='text-lg text-gray-700 mb-2'><strong>Số điện thoại:</strong> {userAddress.phoneNumber}</p>
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
                    <span className='mx-2'>{product.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Tổng cộng</h4>
            <div className='flex justify-between items-center p-4 border-t'>
              <p className='text-lg font-bold'>Tổng cộng thanh toán:</p>
              <p className='text-lg font-bold text-red-600'>{displayINRCurrency(totalOrderAmount)}</p>
            </div>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Mã QR</h4>
            <div className='flex justify-center'>
              <img src={qrCode} alt="QR Code" className='w-48 h-48' />
            </div>
            <h4 className='text-2xl font-bold text-gray-800 mb-4'>Thông tin thẻ</h4>
            <div className='bg-gray-100 p-4 rounded'>
              <p className='text-lg text-gray-700 mb-2'><strong>Ngân hàng:</strong> NCB</p>
              <p className='text-lg text-gray-700 mb-2'><strong>Số thẻ:</strong> 9704198526191432198</p>
              <p className='text-lg text-gray-700 mb-2'><strong>Tên chủ thẻ:</strong> NGUYEN VAN A</p>
            </div>
          </form>
        </div>
        <button
          type="button"
          className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 mt-4 self-end'
          onClick={handlePaymentOnline}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentOnline;
