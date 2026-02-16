import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-100 via-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
        <div>
          <h1 className='text-center text-4xl font-extrabold text-indigo-600 tracking-tight'>
            NoteApp
          </h1>
          <h2 className='mt-4 text-center text-2xl font-bold tracking-tight text-gray-900'>
            Welcome Back
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Sign in to continue to your dashboard
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='email-address'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='relative block w-full rounded-lg border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 shadow-sm transition-all'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='relative block w-full rounded-lg border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 shadow-sm transition-all'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-lg bg-indigo-600 py-2.5 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-md transition-all hover:shadow-lg transform active:scale-[0.98]'>
              Sign in
            </button>
          </div>
          <div className='text-sm text-center'>
            <p className='text-gray-600'>
              Don't have an account?{" "}
              <Link
                to='/register'
                className='font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors'>
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
