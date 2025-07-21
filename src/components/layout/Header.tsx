import React from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { loginStart, logout } from '../../store/slices/authSlice'

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleLogin = () => {
    dispatch(loginStart())
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Box
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        <Text
          as={Link}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color="brand.500"
          _hover={{ textDecoration: 'none' }}
        >
          Personal Blog
        </Text>

        <Spacer />

        <Flex align="center" gap={4}>
          <Text
            as={Link}
            to="/introduction"
            fontSize="md"
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: 'brand.500', textDecoration: 'none' }}
          >
            自己紹介
          </Text>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />

          {isAuthenticated && user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                leftIcon={<Avatar size="sm" src={user.user_metadata.avatar_url} />}
              >
                {user.user_metadata.name}
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/admin">
                  管理画面
                </MenuItem>
                <MenuItem as={Link} to="/admin/posts/new">
                  新規記事
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  ログアウト
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button size="sm" onClick={handleLogin}>
              ログイン
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header