import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import PublicResumeImport from './pages/PublicResumeImport'
import AdminDashboard from './pages/AdminDashboard'
import TemplatesPage from './pages/TemplatesPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import AtsAnalyzer from './pages/AtsAnalyzer'
import AIResumeStudio from './pages/AIResumeStudio'
import ScrollToTop from './components/ScrollToTop'
import FloatingChatbot from './components/FloatingChatbot'
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
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='contact' element={<Contact />} />
        <Route path='login' element={<Login />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          <Route path='public/:resumeId/use' element={<PublicResumeImport />} />
          <Route path='ats-analyzer' element={<AtsAnalyzer />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='templates' element={<TemplatesPage />} />
        <Route path='ai-studio' element={<AIResumeStudio />} />
        <Route path='privacy' element={<PrivacyPolicy />} />
        <Route path='terms' element={<TermsConditions />} />

      </Routes>
      <FloatingChatbot />
    </>
  )
}

export default App