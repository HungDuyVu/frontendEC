import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import Payment from './Payment';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (responseData.success) {
      setData(responseData.data);
    }
  };

  const handleLoading = async () => {
    await fetchData();
    setLoading(false); // Move this here to set loading to false after data is fetched
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const toggleSelectProduct = (product) => {
    const isSelected = selectedProducts.find((item) => item._id === product._id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((item) => item._id !== product._id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const cartTotalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const cartTotalPrice = data.reduce((preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice, 0);
  const selectedTotalQty = selectedProducts.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const selectedTotalPrice = selectedProducts.reduce((preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice, 0);

  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {data.length === 0 && !loading && <p className='bg-white py-5 uppercase font-bold'>Chưa có sản phẩm nào trong giỏ hàng</p>}
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        {/***view product */}
        <div className='w-full max-w-3xl'>
          {loading ? (
            loadingCart?.map((el, index) => (
              <div key={el + 'Add To Cart Loading' + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
            ))
          ) : (
            data.map((product, index) => {
              const isSelected = !!selectedProducts.find((item) => item._id === product._id);
              return (
                <div
                  key={product?._id + 'Add To Cart Loading'}
                  className={`w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] transition-all duration-300 ${isSelected ? 'bg-blue-100 border-blue-600 transform scale-105 shadow-lg' : 'hover:brightness-105'}`}
                  onClick={() => toggleSelectProduct(product)}
                >
                  <div className='w-32 h-32 bg-slate-200'>
                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                  </div>
                  <div className='px-4 py-2 relative'>
                    <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={(e) => { e.stopPropagation(); deleteCartProduct(product?._id); }}>
                      <MdDelete />
                    </div>
                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                    <div className='flex items-center justify-between'>
                      <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                      <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                    </div>
                    <div className='flex items-center gap-3 mt-1'>
                      <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={(e) => { e.stopPropagation(); decreaseQty(product?._id, product?.quantity); }}>
                        -
                      </button>
                      <span>{product?.quantity}</span>
                      <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={(e) => { e.stopPropagation(); increaseQty(product?._id, product?.quantity); }}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/***summary */}
        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
          {loading ? (
            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
          ) : (
            <div className='h-36 bg-white'>
              <h2 className='text-white bg-red-600 px-4 py-1'>Giỏ hàng</h2>
              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Số lượng trong giỏ hàng</p>
                <p>{cartTotalQty}</p>
              </div>
              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Tổng tiền trong giỏ hàng</p>
                <p>{displayINRCurrency(cartTotalPrice)}</p>
              </div>
              <h2 className='text-white bg-blue-600 px-4 py-1 mt-4'>Thanh toán</h2>
              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Số lượng muốn thanh toán</p>
                <p>{selectedTotalQty}</p>
              </div>
              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Tổng tiền muốn thanh toán</p>
                <p>{displayINRCurrency(selectedTotalPrice)}</p>
              </div>
              <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={() => setOpenPayment(true)}>
                Thanh toán
              </button>
              {openPayment && <Payment selectedProducts={selectedProducts} onClose={() => setOpenPayment(false)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
