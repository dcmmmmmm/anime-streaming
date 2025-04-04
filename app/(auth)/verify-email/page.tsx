'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState("Verifying your email...");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`/api/users/verify-email?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setMessage(data.message);
            toast.success(data.message);
          } else if (data.error) {
            setMessage(data.error);
            toast.error(data.error);
          }
          if (data.success) {
            toast.success('Xác thực thành công...');
            setTimeout(() => {
              router.push('/login');
            }, 3000); // Redirect after 3 seconds
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Lỗi xác thực", error);
          setMessage("Lỗi xác thực");
          toast.error("Lỗi xác thực");
        });
    } else {
      setMessage("No token provided.");
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
      <Toaster />
      {/* Web title */}
      <div>
        <div className="text-center text-3xl font-bold uppercase tracking-wider">
          <span className="text-[#ff025b]">Anime</span> Heaven
        </div>
        <p className="text-5xl font-semibold text-center mb-4 text-[#ff025b]">
          Xác thực email
        </p>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-2xl shadow-[#ff025b]">
        <h2 className="text-3xl font-bold text-center">
          <p>{message}</p>
        </h2>
        {!loading && (
          <div className="flex justify-center items-center space-x-2">
            <span className="">Đi đến trang</span>
            <Link href="/login" className="text-[#ff025b] hover:underline">
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}