import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';

const CategoryProduct = () => {
    // State
    const [data, setData] = useState([]); // Dữ liệu sản phẩm
    const navigate = useNavigate(); // Hook để điều hướng đến URL khác
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const location = useLocation(); // Hook để lấy thông tin về địa chỉ URL hiện tại
    const urlSearch = new URLSearchParams(location.search); // Lấy query string từ URL
    const urlCategoryListinArray = urlSearch.getAll("category"); // Lấy danh sách các danh mục từ query string

    // Tạo object để theo dõi danh sách danh mục đã được chọn từ URL
    const urlCategoryListObject = {};
      urlCategoryListinArray.forEach(el => { 
        urlCategoryListObject[el] = true;
    });

    // State lưu trữ danh sách các danh mục được chọn
    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);

    // State lưu trữ danh sách các danh mục sẽ được gửi đến API để lọc dữ liệu
    const [filterCategoryList, setFilterCategoryList] = useState([]);

    // State lưu trữ lựa chọn sắp xếp (tăng dần hoặc giảm dần)
    const [sortBy, setSortBy] = useState("");

    // Hàm gửi yêu cầu API để lấy dữ liệu sản phẩm dựa trên danh sách các danh mục đã chọn
    const fetchData = async () => {
      setLoading(true); // Đánh dấu đang tải dữ liệu
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          category: filterCategoryList
        })
      });
      setLoading(false); // Đánh dấu đã tải xong dữ liệu
      const dataResponse = await response.json();
      setData(dataResponse?.data || []); // Cập nhật dữ liệu sản phẩm
    };

    // Xử lý sự kiện khi người dùng chọn hoặc hủy chọn một danh mục
    const handleSelectCategory = (e) => {
      const { name, value, checked } = e.target;
      setSelectCategory((prev) => {
        return {
          ...prev,
          [value]: checked
        };
      });
    };

    // Sử dụng useEffect để gọi hàm fetchData khi danh sách danh mục thay đổi
    useEffect(() => {
      fetchData();
    }, [filterCategoryList]);

    // Sử dụng useEffect để cập nhật URL khi danh mục được chọn thay đổi
    useEffect(() => {
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      }).filter(el => el);

      setFilterCategoryList(arrayOfCategory);

      const urlFormat = arrayOfCategory.map((el, index) => {
        if ((arrayOfCategory.length - 1) === index) {
          return `category=${el}`;
        }
        return `category=${el}&&`;
      });

      navigate("/product-category?" + urlFormat.join(""));
    }, [selectCategory]);

    // Xử lý sự kiện khi người dùng thay đổi cách sắp xếp dữ liệu
    const handleOnChangeSortBy = (e) => {
      const { value } = e.target;
      setSortBy(value);
      if (value === 'asc') {
        setData(prev => prev.sort((a, b) => a.sellingPrice - b.sellingPrice));
      }
      if (value === 'dsc') {
        setData(prev => prev.sort((a, b) => b.sellingPrice - a.sellingPrice));
      }
    };

    // JSX để render giao diện
    return (
      <div className='container mx-auto p-4'>
        <div className='hidden lg:grid grid-cols-[200px,1fr]'>
          <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sắp xếp theo</h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                  <label>Giá từ Thấp - Cao</label>
                </div>
                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                  <label>Giá từ Cao - Thấp</label>
                </div>
              </form>
            </div>
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
              <form className='text-sm flex flex-col gap-2 py-2'>
                {productCategory.map((categoryName, index) => {
                  return (
                    <div className='flex items-center gap-3' key={index}>
                      <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                      <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                    </div>
                  );
                })}
              </form>
            </div>
          </div>
          <div className='px-4'>
            <p className='font-medium text-slate-800 text-lg my-2'>Kết quả tìm kiếm : {data.length}</p>
            <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
              {data.length !== 0 && !loading && (
                <VerticalCard data={data} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default CategoryProduct;
