import React, { useEffect } from 'react'
import {
  Box,
  Heading,
  Grid,
  Card,
  CardBody,
  Text,
  Button,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchPostsStart } from '../../store/slices/postsSlice'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import '../../styles/crystalGlass.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { posts, loading } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)

  const cardBg = 'transparent'

  useEffect(() => {
    dispatch(fetchPostsStart())
  }, [dispatch])

  const publishedPosts = posts.filter(post => post.status === 'published')
  const draftPosts = posts.filter(post => post.status === 'draft')

  return (
    <Box w={{ base: '100%', xl: '1000px' }} mr="auto">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          {/* 見出しは省略してアクションのみ配置 */}
          <Box />
          <Button
            as={RouterLink}
            to="/admin/posts/new"
            colorScheme="brand"
            leftIcon={<AddIcon />}
          >
            新規記事作成
          </Button>
        </HStack>

        {/* 統計情報 */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <Card bg={cardBg} className="crystal-glass crystal-glass--elevated">
            <CardBody>
              <Stat>
                <StatLabel>総記事数</StatLabel>
                <StatNumber>{posts.length}</StatNumber>
                <StatHelpText>すべての記事</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} className="crystal-glass crystal-glass--elevated">
            <CardBody>
              <Stat>
                <StatLabel>公開記事</StatLabel>
                <StatNumber>{publishedPosts.length}</StatNumber>
                <StatHelpText>公開中の記事</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} className="crystal-glass crystal-glass--elevated">
            <CardBody>
              <Stat>
                <StatLabel>下書き</StatLabel>
                <StatNumber>{draftPosts.length}</StatNumber>
                <StatHelpText>下書き状態の記事</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* 最近の記事 */}
        <Card bg={cardBg} className="crystal-glass crystal-glass--elevated">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center">
                <Heading as="h2" size="md">
                  最近の記事
                </Heading>
                <Button
                  as={RouterLink}
                  to="/admin/posts"
                  variant="outline"
                  size="sm"
                >
                  すべて見る
                </Button>
              </HStack>

              {loading ? (
                <Text>読み込み中...</Text>
              ) : posts.length === 0 ? (
                <Text color="gray.500">記事がありません</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {posts.slice(0, 5).map((post) => (
                    <HStack
                      key={post.id}
                      justify="space-between"
                      p={3}
                      borderRadius="md"
                      className="crystal-glass crystal-glass--surface"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" noOfLines={1}>
                          {post.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {post.status === 'published' ? '公開' : '下書き'} •{' '}
                          {new Date(post.created_at).toLocaleDateString('ja-JP')}
                        </Text>
                      </VStack>
                      <Button
                        as={RouterLink}
                        to={`/admin/posts/${post.id}/edit`}
                        size="sm"
                        variant="outline"
                        leftIcon={<EditIcon />}
                      >
                        編集
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}

export default Dashboard
