import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-bold mb-4 text-indigo-400'>NoteApp</h3>
            <p className='text-gray-400 text-sm'>
              Your personal space for thoughts, ideas, and reminders. Secure,
              simple, and accessible anywhere.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-4 text-indigo-400'>
              Quick Links
            </h3>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <Link to='/' className='hover:text-white transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/login'
                  className='hover:text-white transition-colors'>
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='hover:text-white transition-colors'>
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to='/dashboard'
                  className='hover:text-white transition-colors'>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-4 text-indigo-400'>Contact</h3>
            <p className='text-gray-400 text-sm mb-2'>
              Email: support@noteapp.com
            </p>
            <p className='text-gray-400 text-sm'>
              Follow us on social media for updates and tips.
            </p>
            <div className='flex gap-4 mt-4'>
              {/* Social Media Placeholders */}
              <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer'>
                <span className='text-xs'>FB</span>
              </div>
              <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer'>
                <span className='text-xs'>TW</span>
              </div>
              <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer'>
                <span className='text-xs'>IG</span>
              </div>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm'>
          &copy; {new Date().getFullYear()} NoteApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
