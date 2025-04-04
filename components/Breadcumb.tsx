"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Tạo breadcrumb từng bước, ví dụ: [ { name: "Home", href: "/" }, { name: "Dashboard", href: "/dashboard" }, ... ]
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Chuyển ký tự đầu thành chữ hoa
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, href };
  });

  return (
    <nav className="flex p-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-blue-600">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.293 14.707a1 1 0 001.414 0L13 10.414a1 1 0 000-1.414L8.707 5.293a1 1 0 10-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z" />
              </svg>
              <Link href={crumb.href} 
                    className={`text-sm font-medium  hover:text-red-600 ${crumb.href === pathname ? 'text-[#ff025b]' : 'text-white' }`}>
                {crumb.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
