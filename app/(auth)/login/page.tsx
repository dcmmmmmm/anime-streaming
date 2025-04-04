"use client"
import { signIn, useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Loading from "@/components/Loading";

const LoginPage: React.FC = () => {
  const {data: session, status} = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Theo dõi session và chuyển hướng
  React.useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("SignIn response:", res);
  
      if (res?.error) {
        setLoading(false);
        toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin");
      } else {
        toast.success('Đăng nhập thành công');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
      {/* Web title */}
      <div>
        <h1 className="text-3xl font-bold tracking-widest mb-4 text-center w-full md:w-auto">
          <span className="text-[#ff025b]">Anime</span> Heaven
        </h1>
        <p className="text-5xl font-semibold text-center mb-4 text-[#ff025b]" >
          Chào mừng trở lại
        </p>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-2xl shadow-[#ff025b]">
        <h2 className="text-3xl font-bold text-center" >Đăng nhập</h2>
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
              
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox h-4 w-4 text-[#ff025b] transition duration-150 ease-in-out"
              />
              <span className="ml-2" >Nhớ mật khẩu</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#ff025b] hover:underline" >
              Quên mật khẩu?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[#ff025b] rounded-md hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-[#ff025b]"
            
          >
            {loading ? 'Loading...' : 'Đăng nhập'}
          </button>
          {/* Don't have an account, register one */}
          <div className="flex justify-center items-center space-x-2">
            <span className="">Bạn chưa có tài khoản?</span>
            <Link href="/register" className="text-[#ff025b] hover:underline" >
              Đăng kí ngay
            </Link>
          </div>
          {/* Or separate line */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 h-0.5 bg-gray-400"></div>
            <span className="text-gray-400">Hoặc</span>
            <div className="flex-1 h-0.5 bg-gray-400"></div>
          </div>
          {/* OAuth Buttons */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <Button onClick={() => signIn("google", {callbackUrl: "/"})} className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
              <FaGoogle className="mr-2" /> Đăng nhập với Google
            </Button>
            <Button onClick={() => signIn("github", {callbackUrl: "/"})} className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-slate-900 rounded-md hover:bg-slate-950 focus:outline-none focus:ring focus:ring-blue-300">
              <FaGithub className="mr-2" /> Đăng nhập với Github
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;