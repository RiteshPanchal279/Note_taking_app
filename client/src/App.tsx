import {  createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Signin from "./components/Signin";
import Home from "./components/Home";
import Signup from "./components/Signup";

function App() {
  

  const appRouter = createBrowserRouter([
    
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
