import React from 'react'
import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  IconButton,
  Tooltip,
  useToast,
  Divider,
  Icon,
} from '@chakra-ui/react'
import {
  FiEdit3,
  FiEye,
  FiSave,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiPower,
  FiPlus,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../store'
import {
  toggleAdminMode,
  toggleEditingMode,
  markPostAsSaved,
} from '../../store/slices/adminModeSlice'
import { logout } from '../../store/slices/authSlice'
import { supabase } from '../../services/supabase'

const AdminModeBar: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const { isAdmin, isAdminMode, isEditingMode, currentEditingPost } = useSelector(
    (state: RootState) => state.adminMode
  )
  const { user } = useSelector((state: RootState) => state.auth)

  // デバッグ情報（開発時のみ）
  if (process.env.NODE_ENV === 'development') {
    console.log('AdminModeBar - isAdmin:', isAdmin, 'user:', user, 'isAdminMode:', isAdminMode)
  }

  // 管理者でない場合は表示しない
  if (!isAdmin) {
    return null
  }

  const handleToggleAdminMode = () => {
    dispatch(toggleAdminMode())
    if (isAdminMode) {
      toast({
        title: '管理モードを終了しました',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } else {
      toast({
        title: '管理モードを開始しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleToggleEditingMode = () => {
    dispatch(toggleEditingMode())
  }

  const handleSave = async () => {
    if (!currentEditingPost) return

    try {
      // ここで実際の保存処理を実装
      // 今は仮実装
      dispatch(markPostAsSaved())
      toast({
        title: '記事を保存しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: '保存に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDraftSave = async () => {
    if (!currentEditingPost) return

    try {
      // 下書き保存の処理
      const draftPost = {
        ...currentEditingPost,
        isDraft: true,
      }
      // 実際の保存処理はあとで実装
      dispatch(markPostAsSaved())
      toast({
        title: '下書きを保存しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: '下書き保存に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleNewPost = () => {
    navigate('/posts/new')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
    navigate('/')
    toast({
      title: 'ログアウトしました',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const isPostPage = location.pathname.startsWith('/posts/')
  const isNewPost = location.pathname === '/posts/new'

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={9999}
      className="glass-admin-bar"
      color="white"
      transition="all 0.3s"
    >
      <Flex
        h="60px"
        px={6}
        align="center"
        justify="space-between"
        maxW="1400px"
        mx="auto"
      >
        {/* 左側: 管理モード表示とトグル */}
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Icon as={FiSettings} />
            <Text fontWeight="bold">管理モード</Text>
          </HStack>
          <Tooltip label={isAdminMode ? '管理モードを終了' : '管理モードを開始'}>
            <IconButton
              aria-label="Toggle admin mode"
              icon={<Icon as={FiPower} />}
              size="sm"
              colorScheme={isAdminMode ? 'green' : 'gray'}
              variant={isAdminMode ? 'solid' : 'outline'}
              onClick={handleToggleAdminMode}
            />
          </Tooltip>
        </HStack>

        {/* 中央: 編集コントロール（管理モードONの時のみ表示） */}
        {isAdminMode && (
          <HStack spacing={4}>
            {!isPostPage && (
              <Button
                leftIcon={<Icon as={FiPlus} />}
                size="sm"
                colorScheme="green"
                variant="solid"
                onClick={handleNewPost}
              >
                新規記事作成
              </Button>
            )}

            {isPostPage && (
              <>
                <HStack spacing={2}>
                  <Tooltip label="編集モード">
                    <IconButton
                      aria-label="Edit mode"
                      icon={<Icon as={FiEdit3} />}
                      size="sm"
                      colorScheme={isEditingMode ? 'yellow' : 'gray'}
                      variant={isEditingMode ? 'solid' : 'outline'}
                      onClick={handleToggleEditingMode}
                    />
                  </Tooltip>
                  <Tooltip label="プレビューモード">
                    <IconButton
                      aria-label="Preview mode"
                      icon={<Icon as={FiEye} />}
                      size="sm"
                      colorScheme={!isEditingMode ? 'blue' : 'gray'}
                      variant={!isEditingMode ? 'solid' : 'outline'}
                      onClick={handleToggleEditingMode}
                    />
                  </Tooltip>
                </HStack>

                <Divider orientation="vertical" h="30px" />

                {currentEditingPost?.hasUnsavedChanges && (
                  <Text fontSize="sm" color="yellow.200">
                    ※ 未保存の変更があります
                  </Text>
                )}

                <HStack spacing={2}>
                  <Button
                    leftIcon={<Icon as={FiSave} />}
                    size="sm"
                    colorScheme="green"
                    onClick={handleSave}
                    isDisabled={!currentEditingPost?.hasUnsavedChanges}
                  >
                    保存
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiFileText} />}
                    size="sm"
                    variant="outline"
                    onClick={handleDraftSave}
                    isDisabled={!currentEditingPost?.hasUnsavedChanges}
                  >
                    下書き保存
                  </Button>
                </HStack>
              </>
            )}
          </HStack>
        )}

        {/* 右側: ユーザー情報とログアウト */}
        <HStack spacing={4}>
          <Text fontSize="sm">{user?.email}</Text>
          <Button
            leftIcon={<Icon as={FiLogOut} />}
            size="sm"
            variant="outline"
            onClick={handleLogout}
          >
            ログアウト
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

export default AdminModeBar
