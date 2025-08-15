import React from 'react'
import {
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../store'
import { loginStart, logout } from '../../store/slices/authSlice'
import Container from './Container'
import '../../styles/crystalGlass.css'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  
  // Move all hooks to the top level
  const menuBgColor = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(10, 12, 16, 0.85)')
  const textColor = useColorModeValue('gray.900', 'white')
  const menuTextColor = useColorModeValue('gray.600', 'gray.300')

  const handleLogin = () => {
    dispatch(loginStart())
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/introduction' },
    ...(isAuthenticated ? [{ label: 'Admin', href: '/admin' }] : [])
  ]

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    target.style.setProperty('--mx', `${x}px`)
    target.style.setProperty('--my', `${y}px`)
  }

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      className="glass-header"
      py={4}
    >
      <Container>
        <Box 
          px={{ base: 4, md: 6 }}
          py={2}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            gap={6}
          >
            {/* Brand & Title Section */}
            <Box flex="1" minW="300px">
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <Text
                  as={Link}
                  to="/"
                  fontSize="2xl"
                  fontWeight="700"
                  color={textColor}
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                  letterSpacing="-0.03em"
                  lineHeight="1"
                >
                  Digital Atelier
                </Text>
                <Box
                  w="1px"
                  h="20px"
                  bg="var(--crystal-edge)"
                  opacity="0.6"
                />
                <Text
                  fontSize="sm"
                  color={menuTextColor}
                  fontWeight="500"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  Blog
                </Text>
              </Box>
              <Text
                fontSize="sm"
                color={menuTextColor}
                lineHeight="1.5"
                opacity="0.9"
              >
                Technology, Design & Creative Engineering
              </Text>
            </Box>

            {/* Navigation Section */}
            <Box display="flex" alignItems="center" gap={4}>
              <Box display={{ base: 'none', md: 'flex' }} alignItems="center" gap={2}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`crystal-button ${location.pathname === item.href ? 'crystal-button--primary' : 'crystal-button--ghost'}`}
                    onMouseMove={handleButtonMouseMove}
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 16px',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Box>

              {/* Control Buttons */}
              <Box display="flex" alignItems="center" gap={2}>

                {isAuthenticated && user ? (
                  <Menu>
                    <MenuButton
                      as={Box}
                      cursor="pointer"
                      transition="all 0.3s ease"
                      _hover={{ opacity: 0.8 }}
                    >
                      <Avatar 
                        size="sm" 
                        src={user.user_metadata?.avatar_url} 
                        border="1px solid"
                        borderColor="var(--crystal-edge)"
                      />
                    </MenuButton>
                    <MenuList
                      bg={menuBgColor}
                      backdropFilter="blur(16px)"
                      border="1px solid"
                      borderColor="var(--crystal-edge)"
                      borderRadius="12px"
                      boxShadow="var(--crystal-shadow-float)"
                      minW="180px"
                      py={1}
                    >
                      <MenuItem 
                        as={Link} 
                        to="/admin"
                        bg="transparent"
                        _hover={{ bg: "var(--crystal-white-5)" }}
                        borderRadius="6px"
                        mx="4px"
                        fontSize="sm"
                      >
                        管理画面
                      </MenuItem>
                      <MenuItem 
                        as={Link} 
                        to="/admin/posts/new"
                        bg="transparent"
                        _hover={{ bg: "var(--crystal-white-5)" }}
                        borderRadius="6px"
                        mx="4px"
                        fontSize="sm"
                      >
                        新規記事
                      </MenuItem>
                      <Box h="1px" bg="var(--crystal-edge)" my={1} mx={2} />
                      <MenuItem 
                        onClick={handleLogout}
                        bg="transparent"
                        _hover={{ bg: "var(--crystal-white-5)" }}
                        borderRadius="6px"
                        mx="4px"
                        color={menuTextColor}
                        fontSize="sm"
                      >
                        ログアウト
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="crystal-button crystal-button--primary"
                    onMouseMove={handleButtonMouseMove}
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 16px',
                    }}
                  >
                    ログイン
                  </button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Header
