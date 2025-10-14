import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Transactions from "./components/Section/Transactions";
import { Toaster } from "@/components/ui/sonner"
import Statistics from "./components/Section/Statistics";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element:<Home/>,
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path:'/transactions',
    element:<Transactions/>
  },
  {
  path: "/statistics",
  element: <Statistics />
}
])
function App() {
  return (
    <div>
      <RouterProvider router={appRouter}/>
      <Toaster/>
    </div>
  )
}

export default App