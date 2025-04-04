"use client"
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaTimes, FaUserEdit, FaDna, FaHome } from 'react-icons/fa';
import { Button } from '../ui/button';
import { MdDashboard } from "react-icons/md";
import { RiMovieFill, RiMovie2AiFill } from "react-icons/ri";
import { usePathname, useRouter } from 'next/navigation';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const navlink = [
    { title: 'Profile', icon: <FaUserEdit />, href: '/dashboard/profile' },
    { title: 'Dashboard', icon: <MdDashboard />, href: '/dashboard' },
    { title: 'Người dùng', icon: <FaUser />, href: '/dashboard/user' },
    { title: 'Anime', icon: <RiMovie2AiFill />, href: '/dashboard/anime' },
    { title: 'Thể loại', icon: <FaDna />, href: '/dashboard/genre' },
    { title: "Thể loại Anime", icon: <FaDna/>, href: '/dashboard/anime-genre'},
    { title: 'Tập Phim', icon: <RiMovieFill />, href: '/dashboard/episode' },
  ];
  const {data: session} = useSession()
  const pathname = usePathname();
  const router = useRouter()
  return (
    <div className={`z-10 shadow-2xl fixed inset-y-0 left-0 w-64 bg-[#303953] text-white flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="p-5 font-bold text-center bg-gray-900 flex justify-between items-center">
        <div className="px-6 text-lg font-bold uppercase flex items-center justify-center gap-2">
            <span className="text-[#ff025b]">Anime</span> Heaven
          </div>
        <button onClick={() => setSidebarOpen(false)} className="text-gray-200 focus:outline-none md:hidden">
          <FaTimes className="text-2xl" />
        </button>
      </div>
      {/* Avatar User */}
      <div className="p-4 flex flex-col items-center justify-center">
        {session?.user?.image ? (
          <Image src={session.user.image} alt="avatar" className="w-16 h-16 rounded-full" width={50} height={50} />
        ) : (
          <Image src="https://randomuser.me/api/portraits/lego/8.jpg" alt="avatar" className="w-16 h-16 rounded-full" width={50} height={50} />
        )}
        <div className="flex flex-col items-center justify-center py-2">
          <p className="text-2xl font-bold ">{session?.user?.name}</p>
          <p className="text-sm text-gray-400">{session?.user?.email}</p>
        </div>
      </div>
      {/* Seporator */}
      <div className="border-t border-gray-700 my-4"></div>
      <nav className="flex-1 p-4 ">
        {/* Dropdown User settings */}
        {/* const isActive = pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith(`/dashboard/${item.href.split('/')[2]} ; */}
        <ul>
        {navlink.map((item, index) => {
          // Active nếu pathname chính xác bằng item.href hoặc bắt đầu bằng item.href + "/"
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/") && pathname.startsWith(`/dashboard/${item.href.split('/')[2]}`) ;

          return (
            <li key={index} className="mb-4">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded gap-2 transition duration-300 ${
                  isActive ? "bg-[#ff025b] text-white" : "hover:bg-gray-700"
                }`}
              >
                {item.icon} {item.title}
              </Link>
            </li>
          );
        })}
        </ul>
        {/* Seporator */}
        <div className="border-t border-gray-700 my-4"></div>
        {/* Logout */}
        <div className="flex items-center p-2 hover:bg-gray-700 rounded gap-2 transition duration-300">
          <Button onClick={()=> router.push('/')} className='w-full'>
            <FaHome /> Home
          </Button>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-700 rounded gap-2 transition duration-300">
          <Button onClick={() => signOut()} className='w-full'>
            <FaSignOutAlt /> Logout
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;