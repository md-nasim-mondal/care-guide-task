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
    <nav className='bg-white shadow sticky top-0 z-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex shrink-0 items-center'>
              <Link to='/' className='text-2xl font-bold text-indigo-600'>
                NoteApp
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            {user ? (
              <div className='relative ml-3'>
                <div>
                  <button
                    type='button'
                    className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    id='user-menu-button'
                    aria-expanded='false'
                    aria-haspopup='true'
                    onClick={() =>
                      document
                        .getElementById("user-menu")
                        ?.classList.toggle("hidden")
                    }>
                    <span className='sr-only'>Open user menu</span>
                    {/* Placeholder for user image if available, else initials */}
                    <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold'>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                  </button>
                </div>

                <div
                  id='user-menu'
                  className='hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu-button'
                  tabIndex={-1}>
                  <div className='px-4 py-3 border-b'>
                    <p className='text-sm text-gray-900 font-semibold'>
                      {user.name}
                    </p>
                    <p className='text-xs text-indigo-500 font-medium uppercase'>
                      {user.role}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to={
                      user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                        ? "/admin"
                        : "/dashboard"
                    }
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                    tabIndex={-1}
                    id='user-menu-item-0'
                    onClick={() =>
                      document
                        .getElementById("user-menu")
                        ?.classList.add("hidden")
                    }>
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      document
                        .getElementById("user-menu")
                        ?.classList.add("hidden");
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    role='menuitem'
                    tabIndex={-1}
                    id='user-menu-item-2'>
                    Logout
                  </button>
                </div>
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
