import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setlLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'
import { CheckCircle, Info, XCircle } from 'lucide-react'

const App = () => {

  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem('token')

    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: token }
        })

        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
        dispatch(setlLoading(false))
      } else {
        dispatch(setlLoading(false))
      }
    } catch (error) {
      dispatch(setlLoading(false))
      console.log(error.message);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false} // newest toast on top
        toastOptions={{
          duration: 3000,   // auto dismiss after 3s
          style: {
            padding: "12px 20px",
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />

      </Routes>
    </>
  )
}

export default App