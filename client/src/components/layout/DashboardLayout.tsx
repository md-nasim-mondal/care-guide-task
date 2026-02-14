import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='flex-1 ml-64 p-8 bg-gray-100 min-h-screen'>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
