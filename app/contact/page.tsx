"use client";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import React from "react";

export default function Contact() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen p-4">
      <Navbar/>
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-white">
          {/* Tiêu đề */}
          <div className="text-center mb-8">
            <h2 className="text-sm uppercase tracking-wider text-[#ff025b] mb-2">
              Liên hệ với chúng tôi
            </h2>
            <h3 className="text-3xl font-bold uppercase">
              Chúng tôi luôn sẵn lòng giúp đỡ bạn
            </h3>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Hàng chứa 3 ô: Name, Email, Subject */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <input
                type="text"
                placeholder="Name"
                className="bg-[#303953] w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff025b]"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-[#303953] w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff025b]"
              />
              <input
                type="text"
                placeholder="Subject"
                className="bg-[#303953] w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff025b]"
              />
            </div>

            {/* Ô Message */}
            <textarea
              placeholder="Message"
              rows={6}
              className="bg-[#303953] w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff025b]"
            />

            {/* Nút Send Message */}
            <button
              type="submit"
              className="bg-[#ff025b] text-white px-6 py-3 rounded font-semibold hover:bg-[#d8064b] transition"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
