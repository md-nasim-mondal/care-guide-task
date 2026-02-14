import { useNavigate, useRouteError } from "react-router";

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center p-8 bg-white rounded-lg shadow-md max-w-md'>
        <h1 className='text-4xl font-bold text-red-600 mb-4'>Oops!</h1>
        <p className='text-xl text-gray-700 mb-4'>
          Sorry, an unexpected error has occurred.
        </p>
        <p className='text-gray-500 mb-6'>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(error as any)?.statusText ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.message ||
            "Unknown Error"}
        </p>
        <button
          onClick={() => navigate("/")}
          className='px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition'>
          Go to Home
        </button>
      </div>
    </div>
  );
};
