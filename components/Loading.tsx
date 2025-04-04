"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0011]">
      <div className="w-16 h-16 border-4 border-[#29223a] border-t-[#ff025b] rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
