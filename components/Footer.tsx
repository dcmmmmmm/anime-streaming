"use client";

import Link from "next/link";
import React from "react";
import { FaFacebook, FaDiscord, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-white">
      {/* Khu vực chính (Logo, cột Help, cột Links, ảnh nhân vật) */}
      <div className="bg-[#0e0011] py-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Cột 1: Logo & mô tả */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-3">
              <span className="text-[#ff025b]">Anime</span> Heaven
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Nơi cung cấp những bộ Anime mới nhất, chất lượng nhất và hoàn toàn miễn phí.
            </p>
            {/* facebook, discord, twitter link icons */}
            <div className="flex space-x-4 mt-4">
              <Link href="https://www.facebook.com/giontan.culac.50/?locale=vi_VN" className="hover:text-[#ff025b] transition">
                <FaFacebook />
              </Link>
              <Link href="https://discord.gg/Z7up8GUD" className="hover:text-[#ff025b] transition">
                <FaDiscord />
              </Link>
              <Link href="https://www.instagram.com/lunarflame102/" className="hover:text-[#ff025b] transition">
                <FaInstagram />
              </Link>
            </div>
          </div>

          {/* Cột 2: Help */}
          <div className="flex flex-col space-y-2">
            <h3 className="uppercase font-bold text-[#ff025b] mb-2">Trợ giúp</h3>
            <Link href="/contact" className="hover:text-[#ff025b] transition">
              Liên hệ
            </Link>
            <Link href="#" className="hover:text-[#ff025b] transition">
              FAQ
            </Link>
          </div>

          {/* Cột 3: Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="uppercase font-bold text-[#ff025b] mb-2">Các trang khác</h3>
            <Link href="/" className="hover:text-[#ff025b] transition">
              Trang chủ
            </Link>
            <Link href="/genre" className="hover:text-[#ff025b] transition">
              Thể loại
            </Link>
          </div>
        </div>
      </div>

      {/* Thanh dưới cùng (bản quyền) */}
      <div className="bg-[#29223a] py-3 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="mb-2 md:mb-0">
            Copyright © 2025. Design by
            <span className="font-semibold"> SoulKing@44</span>
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-[#ff025b] transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#ff025b] transition">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
