import React from 'react'
import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import Header from './Header'
import Footer from './Footer'
import Container from './Container'
import AdminModeBar from '../admin/AdminModeBar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { isAdmin } = useSelector((state: RootState) => state.adminMode)

  return (
    <Box minH="100vh" display="flex" flexDirection="column" position="relative" zIndex={1}>
      {/* 管理者の場合、管理モードバーを表示 */}
      {isAdmin && <AdminModeBar />}
      
      {/* デバッグ情報の表示は廃止 */}
      
      <Header />
      <Container 
        flex={1} 
        pt={{ 
          base: isAdmin ? 44 : 36, 
          md: isAdmin ? 48 : 40 
        }} 
        pb={8}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default Layout
