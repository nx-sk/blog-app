import React, { useEffect } from 'react'
import { Box, VStack, Text, Button, Heading, Code } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const TestAuth: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // 認証コールバックのハンドリング
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event)
      console.log('Session:', session)
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully!')
      }
    })

    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/test-auth`,
        },
      })

      if (error) {
        console.error('Login error:', error)
        alert(`Error: ${error.message}`)
      } else {
        console.log('Login initiated:', data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
    } else {
      console.log('Logged out successfully')
    }
  }

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Session check error:', error)
    } else {
      console.log('Current session:', session)
      alert(session ? `Logged in as: ${session.user.email}` : 'Not logged in')
    }
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="start">
        <Heading>Google認証テスト</Heading>
        
        <Text>このページでGoogle認証の動作を確認できます。</Text>
        
        <Code p={2}>
          Console (F12) でログを確認してください
        </Code>

        <VStack spacing={4}>
          <Button colorScheme="red" onClick={handleGoogleLogin}>
            Googleでログイン
          </Button>
          
          <Button colorScheme="gray" onClick={checkSession}>
            セッション確認
          </Button>
          
          <Button variant="outline" onClick={handleLogout}>
            ログアウト
          </Button>
          
          <Button onClick={() => navigate('/login')}>
            通常のログインページへ
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}

export default TestAuth