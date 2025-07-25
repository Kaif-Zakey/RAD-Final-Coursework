import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import Dashboard from "./pages/Dashboard"
import ReaderManagement from "./pages/ReaderManagent"
import BookManagement from "./pages/BookMangement"
import LendingManagement from "./pages/LendingManage"
import OverdueManagement from "./pages/OverDueManage"
import CategoryManagement from "./pages/CategoryManage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {path: "/dashboard/readers", element: <ReaderManagement /> },
          {path: "/dashboard/books", element: <BookManagement/>},
          {path: "/dashboard/lendings", element: <LendingManagement/>},
          {path: "/dashboard/overdues", element: <OverdueManagement/>},
          {path: "/dashboard/categories", element: <CategoryManagement/>},

          
        ],
      },
    ],
  },
])

export default router
