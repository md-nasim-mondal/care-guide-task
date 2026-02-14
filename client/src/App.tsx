import { Outlet } from "react-router";
// import CommonLayout from "./components/layout/CommonLayout";
import { Toaster } from "react-hot-toast";
import CommonLayout from "./components/layout/CommonLayout";

function App() {
  return (
    <>
      <Toaster position='top-right' />
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
}

export default App;