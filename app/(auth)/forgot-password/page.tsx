"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  // Quản lý State
  const [email, setEmail] = useState('');

  //  Logic quên mật khẩu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('Password reset link sent to your email.');
      } else {
        toast.error('Failed to send password reset link.');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
      {/* Web title */}
      <div>
        <h1 className="text-3xl font-bold tracking-widest mb-4 text-center w-full md:w-auto">
          <span className="text-[#ff025b]">Anime</span> Heaven
        </h1>
        <p className="text-5xl font-semibold text-center mb-4 text-[#ff025b]" >
          Quên Mật Khẩu
        </p>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-2xl shadow-[#ff025b]">
        <h2 className="text-3xl font-bold text-center" >Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
              
            />
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[#ff025b] rounded-md hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-[#ff025b]"
            
          >
            Gửi Email
          </Button>
          <div className="flex justify-center items-center space-x-2">
            <span className="">Bạn vẫn nhớ mật khẩu?</span>
            <Link href="/login" className="text-[#ff025b] hover:underline" >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;