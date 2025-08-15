import React from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'
import { FiPlus, FiEdit } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setEditingMode } from '../../store/slices/adminModeSlice'

const NewPostCard: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAdminMode } = useSelector((state: RootState) => state.adminMode)

  // 管理者でない場合は表示しない
  if (!isAdminMode) return null

  const handleClick = () => {
    // 編集モードを有効にして新規記事ページに移動
    dispatch(setEditingMode(true))
    navigate('/posts/new')
  }

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      bg="gradient-to-br"
      bgGradient="linear(135deg, purple.500, purple.600)"
      color="white"
      p={6}
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s"
      border="2px dashed"
      borderColor="purple.300"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
        bgGradient: 'linear(135deg, purple.600, purple.700)',
        borderColor: 'purple.400',
      }}
      _active={{
        transform: 'translateY(-2px)',
      }}
    >
      {/* グラデーション背景 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.2) 100%)"
        zIndex={1}
      />

      {/* メインコンテンツ */}
      <VStack spacing={4} zIndex={2}>
        <Box
          p={4}
          borderRadius="full"
          bg="whiteAlpha.200"
          backdropFilter="blur(10px)"
        >
          <FiPlus size={32} />
        </Box>
        
        <VStack spacing={2} textAlign="center">
          <Text fontSize="xl" fontWeight="bold">
            新規記事作成
          </Text>
          <Text fontSize="sm" opacity={0.9}>
            クリックして記事を作成
          </Text>
        </VStack>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
          fontSize="xs"
          opacity={0.8}
          bg="whiteAlpha.200"
          px={3}
          py={1}
          borderRadius="full"
        >
          <FiEdit size={12} />
          <Text>OnPage Editing</Text>
        </Box>
      </VStack>

      {/* 装飾的な要素 */}
      <Box
        position="absolute"
        top={-10}
        right={-10}
        width={20}
        height={20}
        borderRadius="full"
        bg="whiteAlpha.100"
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom={-5}
        left={-5}
        width={10}
        height={10}
        borderRadius="full"
        bg="whiteAlpha.100"
        zIndex={1}
      />
    </Box>
  )
}

export default NewPostCard