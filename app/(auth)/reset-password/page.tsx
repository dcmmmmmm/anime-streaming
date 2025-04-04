'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Đặt lại mật khẩu không thành công');
      }
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
      <Toaster />
      {/* Web title */}
      <div>
        <div className="text-center text-3xl font-bold uppercase tracking-wider">
          <span className="text-[#ff025b]">Anime</span> Heaven
        </div>
        <p className="text-5xl font-semibold text-center mb-4 text-[#ff025b]" >
          Đặt lại mật khẩu
        </p>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-2xl shadow-[#ff025b]">
        <h2 className="text-3xl font-bold text-center" >Đặt mật khẩu mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
              
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
              
            />
            {passwordError && <p className="text-red-900 text-sm mt-1">{passwordError}</p>}
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[#ff025b] rounded-md hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-[#ff025b]"
            
          >
            Đặt lại mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
}