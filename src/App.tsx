import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from './store'
import theme from './styles/theme'
import Layout from './components/layout/Layout'
import GeometricBackground from './components/background/GeometricBackground'
import './styles/glassmorphism.css'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import Login from './pages/Login'
import TestAuth from './pages/TestAuth'
import Introduction from './pages/Introduction'
import Dashboard from './pages/admin/Dashboard'
import PostList from './pages/admin/PostList'
import PostEditor from './pages/admin/PostEditor'
import PrivateRoute from './components/common/PrivateRoute'
import { supabase } from './services/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from './store/slices/authSlice'
import { setIsAdmin } from './store/slices/adminModeSlice'

const AppContent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // 管理者メールアドレスのリストを取得
    const adminEmails = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin emails:', adminEmails)
    }

    // 初回ロード時のユーザー状態確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Initial session:', session)
      }
      dispatch(setUser(session?.user || null))
      // 管理者判定
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase()
        const isAdmin = adminEmails.includes(userEmail)
        if (process.env.NODE_ENV === 'development') {
          console.log('User email:', userEmail, 'Is admin:', isAdmin)
        }
        dispatch(setIsAdmin(isAdmin))
      }
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', _event, session)
      }
      dispatch(setUser(session?.user || null))
      // 管理者判定
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase()
        const isAdmin = adminEmails.includes(userEmail)
        if (process.env.NODE_ENV === 'development') {
          console.log('User email:', userEmail, 'Is admin:', isAdmin)
        }
        dispatch(setIsAdmin(isAdmin))
      } else {
        dispatch(setIsAdmin(false))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <Router>
      <GeometricBackground />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/new" element={<PostPage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test-auth" element={<TestAuth />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <PrivateRoute>
                <PostList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <PrivateRoute>
                <PostEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts/:id/edit"
            element={
              <PrivateRoute>
                <PostEditor />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AppContent />
      </ChakraProvider>
    </Provider>
  )
}

export default App
