"use client"
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import Loading from '@/components/Loading';
import { getData } from '@/lib/getData';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DailyVisit {
  id: string;
  date: string;
  count: number;
}
interface Anime {
  id: string;
  imageUrl: string;
  title: string;
  views: number;
  totalEpisode: number;
  number: number[];
}

interface User {
  name: string;
  imageUrl?: string;
}

function AdminPage() {
  const {data: session} = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true)

  // State for fetched data
  const [users, setUsers] = useState<User[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [admins, setAdmins] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [visits, setVisits] = useState<DailyVisit[]>([]);

  // Fetching data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getData('users');
        const fetchedAnimes = await getData('animes');
        const fetchedAdmins = await getData('admins');
        const fetchedTotalViews = await getData('animes/total-views');
        
        setUsers(fetchedUsers);
        setAnimes(fetchedAnimes);
        setAdmins(fetchedAdmins);
        setTotalViews(fetchedTotalViews?.totalViews || 0);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    async function fetchVisits() {
      try {
        const res = await fetch("/api/daily-visit/");
        const data = await res.json();
        setVisits(data);
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVisits();
  }, []);

  // Calculate total
  const totalUser = users.length.toString().padStart(2, "0")
  const totalAnime = animes.length.toString().padStart(2, "0")
  const totalAdmin = admins.length.toString().padStart(2, "0")
  const totalVisits = visits.reduce((sum, visit) => sum + visit.count, 0);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: visits.map((v) => new Date(v.date).toLocaleDateString()),
    datasets: [
      {
        label: "Lượt truy cập",
        data: visits.map((v) => v.count),
        borderColor: "rgba(255, 99, 132, 1)", // Màu đường biểu đồ
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu nền
        borderWidth: 2, // Độ dày của đường
        pointRadius: 5, // Kích thước điểm
        pointBackgroundColor: "rgba(255, 99, 132, 1)", // Màu điểm
      },
    ],
  };
  // Tùy chọn cho biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'white', // Màu chữ của legend
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền tooltip
      titleColor: 'white', // Màu chữ tiêu đề tooltip
      bodyColor: 'white', // Màu chữ nội dung tooltip
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'white', // Màu chữ trục x
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Màu lưới trục x
      },
    },
    y: {
      ticks: {
        color: 'white', // Màu chữ trục y
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Màu lưới trục y
      },
    },
  },
};

  // loading
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }
  if(session?.user.role !=="ADMIN") {
    return(
      <div className="flex items-center justify-center h-screen bg-[#0e0011] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#ff025b]">Access Denied</h1>
          <p className="text-lg">
            You don&#39;t have permission to view this page.
            <Link href={"/"} className='mx-1 text-sky-500 hover:text-sky-600'>
              Go back to HomePage
            </Link>
          </p>
        </div>
      </div>
    )
  }
  // render
  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Dashboard Overview' />

        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
            {/* Total User Card, Total Anime Card, Total Admin Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">NGƯỜI DÙNG ĐÃ ĐĂNG KÍ</h2>
                <p className="text-3xl font-bold">{totalUser}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">SỐ LƯỢNG ADMIN</h2>
                <p className="text-3xl font-bold">{totalAdmin}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">TỔNG SỐ LƯỢNG ANIME</h2>
                <p className="text-3xl font-bold">{totalAnime}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">TỔNG LƯỢT XEM</h2>
                <p className="text-3xl font-bold">{totalViews}</p>
              </div>
            </div>
            {/* Recent Anime and Recent User */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl text-center font-bold uppercase py-2 ">Anime Mới Thêm</h2>
                <ul>
                  {
                    animes.slice(0, 5).map((anime, i) => (
                      <li className="flex items-center gap-2 mt-4" key={i}>
                        <Image src={anime.imageUrl} alt="anime" className="w-16 h-16 rounded-lg" width={100} height={100} />
                        <h3 className="font-semibold">{anime.title}</h3>
                      </li>
                    ))
                  }
                </ul>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl text-center font-bold uppercase py-2">Người Dùng mới đăng kí</h2>
                <ul>
                  {
                    users.slice(0, 5).map((user, i) => (
                      <li className="flex items-center gap-2 mt-4" key={i}>
                        <Image src={user.imageUrl ? user.imageUrl : "https://randomuser.me/api/portraits/lego/8.jpg" } alt="anime" className="w-12 h-12 rounded-lg" width={50} height={50} />
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Thống kê lượt truy cập</h1>
          <p className="mb-6">
            Tổng lượt truy cập: <span className="font-bold">{totalVisits.toLocaleString()}</span>
          </p>
          <div className="max-w-xl h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;