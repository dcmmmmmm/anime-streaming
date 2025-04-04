"use client"
import Breadcrumb from '@/components/Breadcumb';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import WatchLaterList from '@/components/WatchLaterList';
import React from 'react';

export default function WatchLaterPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  // Giả sử bạn gọi API và sau đó setIsLoading(false)
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen p-4">
      {/* Navbar */}
      <Navbar/>
      {/* Breadcrumb */}
      <Breadcrumb/>
      {/* Watch-later list */}
      <WatchLaterList />
      {/* Footer */}
      <Footer/>
      
    </div>
  );
}