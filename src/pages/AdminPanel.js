import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaUsers, FaBox, FaBuilding, FaWarehouse } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-[calc(100vh-120px)] md:flex hidden'>
            <aside className='bg-white min-h-full w-full max-w-60 shadow z-10'>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {
                            user?.profilePic ? (
                                <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                            ) : (
                                <FaUserCircle size={40} />
                            )
                        }
                    </div>
                    <p className='capitalize text-lg font-semibold text-blue-600'>{user?.name}</p>
                    <p className='text-sm text-blue-600'>{user?.role}</p>
                </div>

                {/* Navigation */}
                <nav className='fixed left-0 bg-white p-4 w-60 border-r border-gray-200 h-full overflow-y-auto'>
                    <Link to={"all-users"} className='flex items-center px-4 py-3 hover:bg-gray-200 rounded-md'>
                        <FaUsers className='mr-3 text-blue-600' size={20} />
                        <span className='text-base font-medium text-blue-600'>Tất cả người dùng</span>
                    </Link>
                    <Link to={"all-products"} className='flex items-center px-4 py-3 hover:bg-gray-200 rounded-md'>
                        <FaBox className='mr-3 text-blue-600' size={20} />
                        <span className='text-base font-medium text-blue-600'>Tất cả sản phẩm</span>
                    </Link>
                    <Link to={"all-supplier"} className='flex items-center px-4 py-3 hover:bg-gray-200 rounded-md'>
                        <FaBuilding className='mr-3 text-blue-600' size={20} />
                        <span className='text-base font-medium text-blue-600'>Nhà cung cấp</span>
                    </Link>
                    <Link to={"all-importOrder"} className='flex items-center px-4 py-3 hover:bg-gray-200 rounded-md'>
                        <FaBox className='mr-3 text-blue-600' size={20} />
                        <span className='text-base font-medium text-blue-600'>Nhập hàng</span>
                    </Link>
                    <Link to={"all-warehouse"} className='flex items-center px-4 py-3 hover:bg-gray-200 rounded-md'>
                        <FaWarehouse className='mr-3 text-blue-600' size={20} />
                        <span className='text-base font-medium text-blue-600'>Kho hàng</span>
                    </Link>
                </nav>
            </aside>

            <main className='ml-20 w-full h-full p-2'>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
