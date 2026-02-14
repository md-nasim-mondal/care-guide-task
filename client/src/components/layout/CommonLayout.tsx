import React from "react";
import Navbar from "./Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <main className='py-10'>{children}</main>
    </div>
  );
};

export default CommonLayout;
