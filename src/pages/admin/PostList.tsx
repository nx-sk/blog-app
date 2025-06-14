import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Text,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchPostsStart, deletePostStart, setFilters } from '../../store/slices/postsSlice'
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import Loading from '../../components/common/Loading'

const PostList: React.FC = () => {
  const dispatch = useDispatch()
  const { posts, loading, filters } = useSelector((state: RootState) => state.posts)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deletePostId, setDeletePostId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState(filters.search)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const toast = useToast()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    dispatch(fetchPostsStart())
  }, [dispatch, filters])

  const handleDelete = (postId: number) => {
    setDeletePostId(postId)
    onOpen()
  }

  const confirmDelete = () => {
    if (deletePostId) {
      dispatch(deletePostStart(deletePostId))
      toast({
        title: '記事を削除しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    setDeletePostId(null)
    onClose()
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    dispatch(setFilters({ search: value, page: 1 }))
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    // 実際のフィルタリングロジックはここに実装
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filteredPosts = posts.filter(post => {
    if (statusFilter && post.status !== statusFilter) {
      return false
    }
    return true
  })

  if (loading) {
    return <Loading />
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">
          記事管理
        </Heading>
        <Button
          as={RouterLink}
          to="/admin/posts/new"
          colorScheme="brand"
          leftIcon={<AddIcon />}
        >
          新規記事作成
        </Button>
      </HStack>

      {/* フィルター */}
      <HStack spacing={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </InputGroup>
        
        <Select
          placeholder="ステータス"
          maxW="150px"
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <option value="published">公開</option>
          <option value="draft">下書き</option>
        </Select>
      </HStack>

      {/* テーブル */}
      {filteredPosts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">記事がありません</Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>タイトル</Th>
                <Th>ステータス</Th>
                <Th>作成日</Th>
                <Th>更新日</Th>
                <Th>操作</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPosts.map((post) => (
                <Tr key={post.id}>
                  <Td>
                    <Box>
                      <Text fontWeight="bold" noOfLines={1}>
                        {post.title}
                      </Text>
                      {post.excerpt && (
                        <Text fontSize="sm" color="gray.500" noOfLines={1}>
                          {post.excerpt}
                        </Text>
                      )}
                    </Box>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={post.status === 'published' ? 'green' : 'yellow'}
                    >
                      {post.status === 'published' ? '公開' : '下書き'}
                    </Badge>
                  </Td>
                  <Td>{formatDate(post.created_at)}</Td>
                  <Td>{formatDate(post.updated_at)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        as={RouterLink}
                        to={`/admin/posts/${post.id}/edit`}
                        aria-label="編集"
                        icon={<EditIcon />}
                        size="sm"
                        variant="outline"
                      />
                      <IconButton
                        aria-label="削除"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={() => handleDelete(post.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              記事を削除
            </AlertDialogHeader>

            <AlertDialogBody>
              この記事を削除してもよろしいですか？この操作は元に戻せません。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default PostList