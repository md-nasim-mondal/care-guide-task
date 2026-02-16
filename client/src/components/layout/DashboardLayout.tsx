import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-30 px-4 flex items-center shadow-sm'>
        <button
          onClick={() => setSidebarOpen(true)}
          className='p-2 rounded-md hover:bg-gray-100 focus:outline-none'>
          <svg
            className='w-6 h-6 text-gray-700'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <span className='ml-4 font-bold text-lg text-gray-800'>NoteApp</span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className='flex-1 lg:ml-64 p-4 md:p-8 pt-20 md:pt-28 lg:pt-8 min-h-screen'>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
