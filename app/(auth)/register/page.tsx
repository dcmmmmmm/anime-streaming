"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { UploadDropzone } from '@/utils/uploadthing';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('')
  const [role, setRole] = useState('USER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Giả sử bạn gọi API và sau đó setIsLoading(false)
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setConfirmPasswordError('Mật khẩu không khớp.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Đăng kí thành công! Vui lòng kiểm tra email của bạn để xác minh tài khoản.");
        router.push("/verify-email");
      } else {
        toast.error(data.error || 'Đăng kí thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8;

    if (!hasLetter || !hasNumber || !isValidLength) {
      setPasswordError('Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số và có ít nhất 8 ký tự.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
          {/* Web title */}
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4 text-center w-full md:w-auto">
              <span className="text-[#ff025b]">Anime</span> Heaven
            </h1>
            <p className="text-5xl font-semibold text-center mb-4 text-[#ff025b]">
              Tham gia cùng chúng tôi
            </p>
          </div>
          <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <h2 className="text-3xl font-bold text-center">Đăng kí</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Role */}
              <div className="hidden">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  type='hidden'
                  onChange={(e) => setRole(e.target.value)} 
                  value={role}
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              {/* Email */}
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
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                    className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && <p className="text-red-900 text-sm mt-1">{passwordError}</p>}
              </div>
              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError('');
                    }}
                    required
                    className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-red-900 text-sm mt-1">{confirmPasswordError}</p>}
              </div>
              {/* Upload Image Button */}
              <div className="grid grid-cols-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-500 tracking-wide">
                    Dán ảnh
                  </label>
                  {imageUrl && (
                    <Button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="py-1 px-3 focus:outline-none hover:bg-gray-200"
                    >
                      + Chỉnh sửa
                    </Button>
                  )}
                </div>
                {imageUrl ? (
                  <div className="col-span-6 sm:col-span-4 shadow">
                    <Image
                      src={imageUrl}
                      alt="animeImage"
                      width="1000"
                      height="100"
                      className="object-cover w-full h-[250px]"
                      />
                  </div>
                  ) : (
                    <UploadDropzone
                      endpoint={"imageUploader"}
                      onClientUploadComplete={(url: any) => {
                        console.log("files", url);
                        setImageUrl(url?.[0].url);
                        toast.success("Tải ảnh thành công");
                      }}
                      onUploadError={(error) => {
                        console.log(error)
                        toast.error(`Tải ảnh thất bại`);
                      }}
                    />
                )}
              </div>
              {/* Submit Button */}
              <Button
                disabled={loading}
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-[#ff025b] rounded-md hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-[#ff025b]"
              >
                {loading ? 'Đảng tải...' : 'Đăng kí'}
              </Button>
              {/* Already have an account, login */}
              <div className="flex justify-center items-center space-x-2">
                <span className="">Bạn đã có sẵn tài khoản?</span>
                <Link href="/login" className="text-[#ff025b] hover:underline">
                  Đăng nhập
                </Link>
              </div>
              {/* Become one of admins sign up here */}
              <div className="flex justify-center items-center space-x-2">
                <span className="">Bạn muốn trở thành hội viên?</span>
                <Link href="/admin-register" className="text-[#ff025b] hover:underline">
                  Đăng kí tại đây
                </Link>
              </div>
            </form>
          </div>
    </div>
  );
};

export default RegisterPage;