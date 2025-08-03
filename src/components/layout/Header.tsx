import React from 'react'
import {
  Box,
  Text,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../store'
import { loginStart, logout } from '../../store/slices/authSlice'
import '../../styles/crystalGlass.css'

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  
  // Move all hooks to the top level
  const menuBgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)')
  const textColor = useColorModeValue('gray.900', 'white')
  const menuTextColor = useColorModeValue('gray.600', 'gray.400')

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

  return (
    <>
      {/* Main Navigation */}
      <nav className="crystal-nav">
        <Text
          as={Link}
          to="/"
          fontSize="md"
          fontWeight="600"
          color={textColor}
          textDecoration="none"
          mr={4}
          _hover={{ textDecoration: 'none' }}
          letterSpacing="-0.02em"
        >
          Blog
        </Text>

        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`crystal-nav__item ${location.pathname === item.href ? 'crystal-nav__item--active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* Additional Controls */}
      <Box 
        position="fixed" 
        top="20px" 
        right="20px" 
        zIndex="1001"
        display="flex"
        gap={2}
        alignItems="center"
      >
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          borderRadius="8px"
          className="crystal-button crystal-button--ghost"
          bg="transparent"
          _hover={{
            bg: "var(--crystal-white-5)",
          }}
        />

        {isAuthenticated && user ? (
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                opacity: 0.8
              }}
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
                _hover={{
                  bg: "var(--crystal-white-5)",
                }}
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
                _hover={{
                  bg: "var(--crystal-white-5)",
                }}
                borderRadius="6px"
                mx="4px"
                fontSize="sm"
              >
                新規記事
              </MenuItem>
              <Box 
                h="1px" 
                bg="var(--crystal-edge)" 
                my={1} 
                mx={2}
              />
              <MenuItem 
                onClick={handleLogout}
                bg="transparent"
                _hover={{
                  bg: "var(--crystal-white-5)",
                }}
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
          >
            ログイン
          </button>
        )}
      </Box>
    </>
  )
}

export default Header