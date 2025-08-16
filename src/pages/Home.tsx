import { useEffect, useState, useMemo, useCallback } from 'react'
import { Box, Text, Button, HStack } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchPostsStart } from '../store/slices/postsSlice'
import FullPostCard from '../components/post/FullPostCard'
import ProfileSidebar from '../components/profile/ProfileSidebar'
import Loading from '../components/common/Loading'
import '../styles/crystalGlass.css'

const Home = () => {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector((state: RootState) => state.posts)

  useEffect(() => {
    dispatch(fetchPostsStart())
  }, [dispatch])

  const PAGE_SIZE = 3
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      const ad = new Date(a.published_at || a.created_at).getTime()
      const bd = new Date(b.published_at || b.created_at).getTime()
      return bd - ad
    })
  }, [posts])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)), [sorted.length])
  const pagePosts = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE),
    [sorted, page]
  )

  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const next = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Box className="crystal-glass crystal-glass--elevated" maxW="400px" mx="auto">
          <Text color="red.500" fontSize="sm">
            エラーが発生しました: {error}
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      display="grid"
      gap={3}
      gridTemplateColumns={{ base: '1fr', md: '310px minmax(0, 850px)' }}
      justifyContent={{ md: 'center' }}
      alignItems="start"
    >
      <Box
        display={{ base: 'none', md: 'block' }}
        position="sticky"
        top={{ base: 0, md: '88px' }}
        h="fit-content"
      >
        <ProfileSidebar />
      </Box>
      <Box w="full">
        <Box display="grid" gridTemplateColumns="1fr" gap={6}>
          {pagePosts.map((post) => (
            <FullPostCard key={post.id} post={post} />
          ))}
        </Box>

        <HStack justify="space-between" mt={4}>
          <Button size="sm" onClick={prev} isDisabled={page === 1} variant="outline">前へ</Button>
          <Text fontSize="sm" color="gray.600">{page} / {totalPages}</Text>
          <Button size="sm" onClick={next} isDisabled={page === totalPages} variant="outline">次へ</Button>
        </HStack>
      </Box>
    </Box>
  )
}

export default Home
