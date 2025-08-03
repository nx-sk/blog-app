import React from 'react'
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'
import { useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { loginStart } from '../store/slices/authSlice'
import Loading from '../components/common/Loading'

const Login = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleGoogleLogin = () => {
    dispatch(loginStart())
  }

  if (loading) {
    return <Loading message="ログイン処理中..." />
  }

  return (
    <Box
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card bg={cardBg} maxW="400px" w="100%">
        <CardBody>
          <VStack spacing={6}>
            <VStack spacing={2}>
              <Heading as="h1" size="lg" textAlign="center">
                管理者ログイン
              </Heading>
              <Text color={textColor} textAlign="center">
                ブログの管理にはGoogleアカウントでのログインが必要です
              </Text>
            </VStack>

            {error && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}

            <Button
              colorScheme="red"
              size="lg"
              w="100%"
              leftIcon={<Icon as={FaGoogle as any} />}
              onClick={handleGoogleLogin}
              isLoading={loading}
              loadingText="ログイン中..."
            >
              Googleでログイン
            </Button>

            <Text fontSize="xs" color={textColor} textAlign="center">
              管理者のみがログインできます
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Login