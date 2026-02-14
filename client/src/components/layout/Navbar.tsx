import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='bg-white shadow'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex shrink-0 items-center'>
              <Link to='/' className='text-xl font-bold text-indigo-600'>
                NoteApp
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            {user ? (
              <div className='flex gap-4 items-center'>
                <Link
                  to='/dashboard'
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'>
                  Dashboard
                </Link>
                {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                  <Link
                    to='/admin'
                    className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'>
                    Admin
                  </Link>
                ) : null}
                <span className='text-sm text-gray-500'>{user.name}</span>
                <button
                  onClick={handleLogout}
                  className='ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  Logout
                </button>
              </div>
            ) : (
              <div className='flex gap-4'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
