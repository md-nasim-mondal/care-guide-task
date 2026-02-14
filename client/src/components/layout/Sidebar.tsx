import { Link, useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get("view");

  const adminLinks = [
    { name: "Dashboard", path: "/admin", view: null },
    { name: "Users Management", path: "/admin?view=users", view: "users" },
    { name: "Notes Management", path: "/admin?view=notes", view: "notes" },
  ];

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", view: null },
    { name: "My Notes", path: "/dashboard?view=notes", view: "notes" },
    // { name: "Create Note", path: "/dashboard?action=create" }, // Can be a modal trigger or separate page
  ];

  const links =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? adminLinks
      : userLinks;

  return (
    <div className='w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto'>
      <div className='h-16 flex items-center justify-center border-b border-gray-700'>
        <Link to='/' className='text-2xl font-bold text-white'>
          NoteApp
        </Link>
      </div>
      <nav className='flex-1 px-2 py-4 space-y-2'>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`block px-4 py-2 rounded-md hover:bg-gray-700 transition ${
              currentView === link.view && link.view !== null
                ? "bg-gray-700"
                : ""
            }`}>
            {link.name}
          </Link>
        ))}
      </nav>
      <div className='p-4 border-t border-gray-700'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm'>
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className='text-sm font-medium'>{user?.name}</p>
            <p className='text-xs text-gray-400 capitalize'>{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
