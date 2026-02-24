import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'

const Layout = () => {

  const { user, loading } = useSelector(state => state.auth)
  const location = useLocation();
  const isBuilder = location.pathname.includes('/builder/');

  if (loading) {
    return <Loader />
  }

  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <>
        {!isBuilder && <Navbar />}
        <main className={!isBuilder ? 'pt-0' : ''}>
          <Outlet />
        </main>
      </>

    </div>
  )
}

export default Layout