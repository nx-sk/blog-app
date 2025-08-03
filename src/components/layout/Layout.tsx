import React from 'react'
import { Box } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'
import Container from './Container'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container flex={1} pt={{ base: 36, md: 40 }} pb={8}>
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default Layout