import { Link, useSearchParams, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = searchParams.get("view");

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isAdminView = location.pathname.startsWith("/admin");

  const adminLinks = [
    { name: "Dashboard", path: "/admin", view: null },
    { name: "Users Management", path: "/admin?view=users", view: "users" },
    { name: "Notes Management", path: "/admin?view=notes", view: "notes" },
  ];

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", view: null },
    { name: "My Notes", path: "/dashboard?view=notes", view: "notes" },
  ];

  const links = !isAdmin ? userLinks : isAdminView ? adminLinks : userLinks;

  const handleToggle = () => {
    if (isAdminView) {
      navigate("/dashboard");
    } else {
      navigate("/admin");
    }
    onClose(); // Close sidebar on mobile after toggling view
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}>
        <div className='h-16 flex items-center justify-center border-b border-gray-700 bg-gray-900'>
          <Link to='/' className='text-2xl font-bold text-white tracking-wide'>
            NoteApp
          </Link>
          <button
            onClick={onClose}
            className='md:hidden absolute right-4 text-gray-400 hover:text-white'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <nav className='flex-1 px-3 py-6 space-y-2'>
          {isAdmin && (
            <div className='mb-6 px-2'>
              <div className='flex items-center justify-between bg-gray-700 p-1 rounded-lg'>
                <button
                  onClick={() => !isAdminView && handleToggle()}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    isAdminView
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  Admin
                </button>
                <button
                  onClick={() => isAdminView && handleToggle()}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    !isAdminView
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  User
                </button>
              </div>
              <p className='text-xs text-center text-gray-500 mt-2'>
                Switch View Mode
              </p>
            </div>
          )}

          <div className='space-y-1'>
            <p className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
              Menu
            </p>
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  (currentView === link.view && link.view !== null) ||
                  (link.view === null &&
                    !currentView &&
                    location.pathname === link.path.split("?")[0])
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}>
                <span className='font-medium'>{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className='p-4 border-t border-gray-700 bg-gray-900'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-gray-600'>
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className='overflow-hidden'>
              <p className='text-sm font-semibold truncate text-white'>
                {user?.name}
              </p>
              <p className='text-xs text-gray-400 capitalize truncate'>
                {user?.role?.replace("_", " ").toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className='w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
