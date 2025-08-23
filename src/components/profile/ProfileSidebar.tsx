import React from 'react'
import { Box, Heading, Text, HStack, Link, Avatar, Icon } from '@chakra-ui/react'
import { FiTwitter, FiGithub } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import InlineEditableField from '../editor/InlineEditableField'

const ProfileSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.settings.data)
  const links: { type: string; label: string; url: string }[] =
    (settings?.social_links as any) || [
      { type: 'x', label: 'X', url: 'https://x.com/nx_sk_' },
      { type: 'github', label: 'GitHub', url: 'https://github.com/nx-sk' },
    ]
  return (
    <Box w={{ base: '100%', md: '300px' }} flexShrink={0} className="crystal-glass crystal-glass--surface no-hover" p={4} borderRadius="md">
      <HStack spacing={3} mb={3}>
        <Avatar name="Author" size="md" />
        <Box>
          <Heading as="h3" size="sm">{settings?.sidebar_title || settings?.header_brand || 'Digital Atelier'}</Heading>
          <Text fontSize="xs" color="text.meta">Technology, Design & Creative Engineering</Text>
        </Box>
      </HStack>
      <Box color="#000">
        <InlineEditableField
          value={settings?.sidebar_description || 'フルスタックにものづくりを楽しむ個人ブログ。設計メモや実験的な実装の備忘録を中心に更新しています。'}
          onChange={(v) => dispatch({ type: 'settings/updateSettingsStart', payload: { sidebar_description: v } })}
          as="textarea"
          fontSize="sm"
          multiline
          tooltip="サイドバーの説明を編集"
        />
      </Box>
      <HStack spacing={3} mt={3}>
        {links.map((l) => (
          <Link
            key={l.type}
            href={l.url}
            isExternal
            color="link.default"
            aria-label={l.label}
          >
            <Icon
              as={l.type === 'github' ? FiGithub : FiTwitter}
              boxSize={5}
            />
          </Link>
        ))}
      </HStack>
    </Box>
  )
}

export default ProfileSidebar
