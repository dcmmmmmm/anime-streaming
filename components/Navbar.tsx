"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { FaChevronDown } from "react-icons/fa";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SearchBar from './SearchBar';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <span className={`relative transition duration-300 group ${isActive ? 'text-[#ff025b]' : 'hover:text-[#ff025b]'}`}>
        {children}
        <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff025b] transform origin-left transition-transform duration-300 
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}>
        </span>
      </span>
    </Link>
  );
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname()

  return (
    <header className="">
      {/* Top bar */}
      <div className="bg-[#303953] text-white py-2 px-4 mx-auto flex items-center justify-center">
        {/* Search box */}
        <div className="flex items-center space-x-2">
          <SearchBar className="w-64" />
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-[#0e0011] text-white">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          {/* Logo */}
          <div className="text-3xl font-bold uppercase tracking-wider">
            <span className="text-[#ff025b]">Anime</span> Heaven
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/">Trang chủ</NavLink>
            <NavLink href="/genres">Thể loại</NavLink>
            <NavLink href="/anime">Animes</NavLink>
            <NavLink href="/contact">Liên hệ</NavLink>
          </nav>

          {/* Nút hamburger cho mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Nút Sign Up hiển thị trên desktop */}
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <Image
                  width={50} height={50}
                  src={session?.user.image ? session?.user.image : "https://randomuser.me/api/portraits/lego/8.jpg"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <FaChevronDown className="ml-2" />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                  <div className="flex flex-col">
                    {/* Name, role user */}
                    <p className="text-center px-4 py-2">{session.user.name}</p>
                    <Separator />
                    {session.user?.role === "ADMIN" && (
                      <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                        Dashboard
                      </Link>
                    )}
                    <Separator />
                    <Link href="/favorite" className="block px-4 py-2 hover:bg-gray-200">
                      Danh sách yêu thích
                    </Link>
                    <Link href="/watch-later" className="block px-4 py-2 hover:bg-gray-200">
                      Xem sau
                    </Link>
                    <Separator className="" />
                    <Button
                      onClick={() => signOut()}
                      className="block rounded-none hover:bg-gray-200"
                    >
                      Đăng Xuất
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <Link href="/login">
                <button className="bg-[#ff025b] text-white px-4 py-2 rounded hover:bg-[#d8064b] transition">
                  Đăng nhập
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e0011] px-4 pt-2 pb-4">
            <nav className="flex flex-col space-y-2">
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/genres', label: 'Thể loại' },
                { href: '/anime', label: 'Animes' },
                { href: '/contact', label: 'Liên hệ' },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <span className={`block transition ${
                      isActive 
                        ? 'text-[#ff025b]' 
                        : 'hover:text-[#ff025b]'
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <Image
                      width={50} height={50}
                      src={session?.user.image ? session?.user.image : "https://randomuser.me/api/portraits/lego/8.jpg"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <FaChevronDown className="ml-2" />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute  mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                      <div className="flex flex-col">
                        {/* Name, role user */}
                        <p className="px-4 py-2">John Doe</p>
                        {session.user.role === "ADMIN" && (
                          <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                            Dashboard
                          </Link>
                        )}
                        <Separator />
                        <Link href="/favorite" className="block px-4 py-2 hover:bg-gray-200">
                          Danh sách yêu thích
                        </Link>
                        <Link href="/watch-later" className="block px-4 py-2 hover:bg-gray-200">
                          Xem sau
                        </Link>
                        <Separator className="" />
                        <Button
                          onClick={() => signOut()}
                          className="block rounded-none hover:bg-gray-200"
                        >
                          Đăng Xuất
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="">
                  <Link href="/login">
                    <Button className="w-full mt-2 bg-[#ff025b] text-white px-4 py-2 rounded hover:bg-[#d8064b] transition">
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}