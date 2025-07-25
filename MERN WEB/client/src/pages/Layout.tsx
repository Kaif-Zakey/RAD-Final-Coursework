import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"
import {useAuth} from "../context/useAuth.ts";

const Layout = () => {
    const {isAuthenticating} = useAuth()

    if(isAuthenticating) return <div>Loading...</div>

  return (
    <div className='h-screen'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Navbar />
      </div>
      <main className='pt-16 h-full overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
