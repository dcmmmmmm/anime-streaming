"use client";
import React, { useEffect, useState, } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Gerne from "@/components/Genre";


export default function Page() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="polka-dot text-white min-h-screen">
      <Navbar />

      {/* Container chính */}
      <Gerne/>
      
      <Footer />

      {/* CSS nền chấm bi (polka-dot) */}
      <style jsx>{`
        .polka-dot {
          background-color: #0e0011;
          background-image: radial-gradient(#29223a 1px, transparent 1px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
}
