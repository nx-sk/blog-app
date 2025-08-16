import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from './store'
import theme from './styles/theme'
import Layout from './components/layout/Layout'
import GeometricBackground from './components/background/GeometricBackground'
import './styles/glassmorphism.css'
import PrivateRoute from './components/common/PrivateRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import { supabase } from './services/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from './store/slices/authSlice'
import { setIsAdmin } from './store/slices/adminModeSlice'
import { fetchSettingsStart } from './store/slices/settingsSlice'
import Loading from './components/common/Loading'

// Route-level code splitting
const Home = lazy(() => import('./pages/Home'))
const PostPage = lazy(() => import('./pages/PostPage'))
const Login = lazy(() => import('./pages/Login'))
const TestAuth = lazy(() => import('./pages/TestAuth'))
const Introduction = lazy(() => import('./pages/Introduction'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const PostList = lazy(() => import('./pages/admin/PostList'))
const PostEditor = lazy(() => import('./pages/admin/PostEditor'))

const AppContent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load site settings on app start
    dispatch(fetchSettingsStart())

    // 管理者メールアドレスのリストを取得
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(',').map(email => email.trim().toLowerCase()) || []
    if (import.meta.env.DEV) {
      console.log('Admin emails:', adminEmails)
    }

    // 初回ロード時のユーザー状態確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (import.meta.env.DEV) {
        console.log('Initial session:', session)
      }
      dispatch(setUser(session?.user || null))
      // 管理者判定
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase()
        const isAdmin = adminEmails.includes(userEmail)
        if (import.meta.env.DEV) {
          console.log('User email:', userEmail, 'Is admin:', isAdmin)
        }
        dispatch(setIsAdmin(isAdmin))
      }
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (import.meta.env.DEV) {
        console.log('Auth state changed:', _event, session)
      }
      dispatch(setUser(session?.user || null))
      // 管理者判定
      if (session?.user?.email) {
        const userEmail = session.user.email.toLowerCase()
        const isAdmin = adminEmails.includes(userEmail)
        if (import.meta.env.DEV) {
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
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/new" element={<PostPage />} />
              <Route path="/posts/:slug" element={<PostPage />} />
              {false && <Route path="/introduction" element={<Introduction />} />}
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
          </Suspense>
        </ErrorBoundary>
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
