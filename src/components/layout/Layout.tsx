import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" flex={1} pt={24} pb={8} px={{ base: 4, md: 8 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default Layout