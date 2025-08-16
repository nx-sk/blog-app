import React from 'react'
import { Box, Heading, Text, HStack, Link, Avatar } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import InlineEditableField from '../editor/InlineEditableField'

const ProfileSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.settings.data)
  return (
    <Box w={{ base: '100%', md: '250px' }} flexShrink={0} className="crystal-glass crystal-glass--surface" p={4} borderRadius="md">
      <HStack spacing={3} mb={3}>
        <Avatar name="Author" size="md" />
        <Box>
          <Heading as="h3" size="sm">{settings?.sidebar_title || settings?.header_brand || 'Digital Atelier'}</Heading>
          <Text fontSize="xs" color="text.meta">Technology, Design & Creative Engineering</Text>
        </Box>
      </HStack>
      <InlineEditableField
        value={settings?.sidebar_description || 'フルスタックにものづくりを楽しむ個人ブログ。設計メモや実験的な実装の備忘録を中心に更新しています。'}
        onChange={(v) => dispatch({ type: 'settings/updateSettingsStart', payload: { sidebar_description: v } })}
        as="textarea"
        fontSize="sm"
        multiline
        tooltip="サイドバーの説明を編集"
      />
      <HStack spacing={3} mt={3}>
        <Link href="/" fontSize="xs" color="link.default">Twitter</Link>
        <Link href="/" fontSize="xs" color="link.default">GitHub</Link>
      </HStack>
    </Box>
  )
}

export default ProfileSidebar
