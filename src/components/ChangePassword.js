import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../common';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra tính hợp lệ của dữ liệu đầu vào
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error("Please provide current password, new password, and confirm new password");
      }
      if (newPassword !== confirmNewPassword) {
        throw new Error("New password and confirm new password do not match");
      }

      // Gọi API để thực hiện yêu cầu đổi mật khẩu
      const response = await fetch(SummaryApi.changePassword.url, {
        method: SummaryApi.changePassword.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });
      const data = await response.json();

      // Xử lý kết quả từ API
      if (data.success) {
        // Đổi mật khẩu thành công, đóng modal
        toast.success(data.message)
        navigate("/user-info")
        onClose();
      } else {
        // Hiển thị thông báo lỗi
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block mb-2">Mật khẩu cũ</label>
            <div className="bg-slate-100 p-2 flex items-center">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full h-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-xl ml-2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2">Mật khẩu mói</label>
            <div className="bg-slate-100 p-2 flex items-center">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-xl ml-2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="block mb-2">Nhập lại mật khẩu mới</label>
            <div className="bg-slate-100 p-2 flex items-center">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full h-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-xl ml-2"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              >
                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 mr-2 rounded-full"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
