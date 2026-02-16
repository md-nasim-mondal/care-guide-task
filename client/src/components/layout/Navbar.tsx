import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsUserMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        setIsUserMenuOpen(false);
      }, 300);
    }
  };

  return (
    <nav className='bg-white shadow sticky top-0 z-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between items-center'>
          <div className='flex shrink-0 items-center'>
            <Link to='/' className='text-2xl font-bold text-indigo-600'>
              NoteApp
            </Link>
          </div>

          <div className='hidden lg:flex items-center'>
            {user ? (
              <div
                className='relative ml-3'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <button
                  type='button'
                  className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <span className='sr-only'>Open user menu</span>
                  <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold'>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div
                    onMouseEnter={handleMouseEnter}
                    className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='px-4 py-3 border-b'>
                      <p className='text-sm text-gray-900 font-semibold'>
                        {user?.name}
                      </p>
                      <p className='text-xs text-indigo-500 font-medium uppercase'>
                        {user?.role}
                      </p>
                    </div>
                    <Link
                      to={
                        user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
                          ? "/admin"
                          : "/dashboard"
                      }
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Logout
                    </button>
                  </div>
                )}
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

          <div className='lg:hidden flex items-center'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className='sr-only'>Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='lg:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t'>
            {user ? (
              <>
                <div className='px-4 py-3 border-b border-gray-200'>
                  <div className='flex items-center'>
                    <div className='shrink-0'>
                      <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold'>
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className='ml-3'>
                      <div className='text-base font-medium leading-none text-gray-800'>
                        {user?.name}
                      </div>
                      <div className='text-sm font-medium leading-none text-gray-500 mt-1'>
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to={
                    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
                      ? "/admin"
                      : "/dashboard"
                  }
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50'
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
