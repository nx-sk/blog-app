import React from 'react';
import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Tag,
  Link,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

const Introduction = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, #f5f7fa, #c3cfe2)',
    'linear(to-br, gray.900, gray.700)'
  );
  
  const cardBg = useColorModeValue(
    'rgba(255, 255, 255, 0.95)',
    'rgba(26, 32, 44, 0.95)'
  );
  
  const borderColor = useColorModeValue(
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  );

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      fontFamily="'Meiryo', 'メイリオ', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      py={16}
      px={4}
    >
      <Container maxW="1000px">
        <Box
          bg={cardBg}
          backdropFilter="blur(20px)"
          borderRadius="24px"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
          overflow="hidden"
          position="relative"
        >
          {/* Floating decoration */}
          <Box
            position="absolute"
            w="200px"
            h="200px"
            borderRadius="50%"
            bgGradient="linear(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
            top="-100px"
            right="-100px"
            zIndex={-1}
          />

          {/* Header Section */}
          <Box
            py={{ base: 12, md: 16 }}
            px={{ base: 6, md: 12 }}
            textAlign="center"
            bgGradient="linear(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(100, 181, 246, 0.05) 100%)"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              w: '60px',
              h: '1px',
              bgGradient: 'linear(to-r, transparent, brand.500, transparent)',
              transform: 'translateX(-50%)',
            }}
          >
            <Box
              w={{ base: "120px", md: "140px" }}
              h={{ base: "120px", md: "140px" }}
              borderRadius="50%"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              mx="auto"
              mb={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: "48px", md: "56px" }}
              color="white"
              fontWeight="300"
              position="relative"
              boxShadow="0 15px 35px rgba(102, 126, 234, 0.4)"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-3px',
                left: '-3px',
                right: '-3px',
                bottom: '-3px',
                borderRadius: '50%',
                bgGradient: 'linear(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                zIndex: -1,
              }}
            >
              山
            </Box>
            
            <Heading
              as="h1"
              fontSize={{ base: "2.25rem", md: "2.75rem" }}
              fontWeight="300"
              color="gray.800"
              mb={3}
              letterSpacing="-0.5px"
            >
              山田 太郎
            </Heading>
            
            <Text
              fontSize="xl"
              color="#667eea"
              fontWeight="400"
              mb={6}
              letterSpacing="0.5px"
            >
              フルスタック開発者
            </Text>
            
            <Text
              fontSize="lg"
              color="gray.600"
              maxW="500px"
              mx="auto"
              fontWeight="300"
              lineHeight="1.8"
            >
              美しいコードと優れたユーザー体験を通じて、
              テクノロジーの可能性を追求しています
            </Text>
          </Box>

          {/* Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={0}>
            {/* Left Content */}
            <Box
              p={{ base: 8, md: 12 }}
              borderRight={{ lg: "1px solid" }}
              borderRightColor={{ lg: "rgba(226, 232, 240, 0.5)" }}
            >
              <VStack align="stretch" spacing={10}>
                {/* Profile Section */}
                <Box>
                  <Heading
                    as="h2"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    mb={5}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    position="relative"
                    pl={5}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      w: '12px',
                      h: '1px',
                      bg: '#667eea',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    プロフィール
                  </Heading>
                  <VStack align="stretch" spacing={4}>
                    <Text color="gray.600" fontWeight="300" lineHeight="1.8">
                      Web開発の世界に魅力を感じ、フロントエンドからバックエンドまで
                      幅広い技術領域で活動しています。特にユーザー体験の向上と
                      コードの品質向上に情熱を注いでいます。
                    </Text>
                    <Text color="gray.600" fontWeight="300" lineHeight="1.8">
                      現在はSaaS企業でフルスタック開発者として働きながら、
                      個人プロジェクトにも積極的に取り組んでいます。
                    </Text>
                  </VStack>
                </Box>

                {/* Basic Info Section */}
                <Box>
                  <Heading
                    as="h2"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    mb={5}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    position="relative"
                    pl={5}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      w: '12px',
                      h: '1px',
                      bg: '#667eea',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    基本情報
                  </Heading>
                  <VStack align="stretch" spacing={3}>
                    {[
                      { icon: '📍', text: '東京都在住' },
                      { icon: '💼', text: '3年の開発経験' },
                      { icon: '🎓', text: '情報工学専攻' },
                      { icon: '🌐', text: '日本語・英語' },
                      { icon: '⚡', text: 'フルタイム対応可能' },
                    ].map((item, index) => (
                      <HStack key={index} fontSize="sm">
                        <Text w="20px" color="#667eea" fontSize="14px">
                          {item.icon}
                        </Text>
                        <Text color="gray.600">{item.text}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Skills Section */}
                <Box>
                  <Heading
                    as="h2"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    mb={5}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    position="relative"
                    pl={5}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      w: '12px',
                      h: '1px',
                      bg: '#667eea',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    技術スキル
                  </Heading>
                  <Text color="gray.600" fontWeight="300" lineHeight="1.8" mb={4}>
                    継続的に学習・習得している技術領域です。
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {[
                      'React', 'TypeScript', 'Node.js', 'Python', 'Supabase',
                      'AWS', 'Docker', 'Git', 'Chakra UI', 'Next.js'
                    ].map((skill) => (
                      <Tag
                        key={skill}
                        bg="rgba(102, 126, 234, 0.1)"
                        color="#667eea"
                        borderRadius="20px"
                        fontSize="sm"
                        fontWeight="400"
                        border="1px solid rgba(102, 126, 234, 0.2)"
                        _hover={{
                          bg: 'rgba(102, 126, 234, 0.15)',
                          transform: 'translateY(-1px)',
                        }}
                        transition="all 0.3s ease"
                      >
                        {skill}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              </VStack>
            </Box>

            {/* Right Content */}
            <Box p={{ base: 8, md: 12 }}>
              <VStack align="stretch" spacing={10}>
                {/* Experience Section */}
                <Box>
                  <Heading
                    as="h2"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    mb={5}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    position="relative"
                    pl={5}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      w: '12px',
                      h: '1px',
                      bg: '#667eea',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    経歴
                  </Heading>
                  <VStack align="stretch" spacing={6}>
                    {[
                      {
                        date: '2023年 - 現在',
                        title: 'SaaS企業 - フルスタック開発者',
                        description: 'React/TypeScript/Node.jsを用いたWebアプリケーション開発。チーム開発でのアジャイル開発経験、API設計・実装を担当。'
                      },
                      {
                        date: '2022年 - 2023年',
                        title: 'フリーランス - Web開発者',
                        description: '企業サイト制作、WordPress開発、フロントエンド実装を中心に活動。クライアントとの直接やり取りでコミュニケーション能力を向上。'
                      },
                      {
                        date: '2021年 - 2022年',
                        title: 'プログラミング学習期間',
                        description: '独学でHTML/CSS/JavaScriptから始まり、React、Node.jsまで習得。オンライン教材と実践プロジェクトで基礎を固める。'
                      }
                    ].map((exp, index) => (
                      <Box
                        key={index}
                        pb={index !== 2 ? 5 : 0}
                        borderBottom={index !== 2 ? "1px solid rgba(226, 232, 240, 0.3)" : "none"}
                      >
                        <Text
                          fontSize="sm"
                          color="#667eea"
                          fontWeight="500"
                          mb={1.5}
                          letterSpacing="0.5px"
                        >
                          {exp.date}
                        </Text>
                        <Text
                          fontSize="md"
                          fontWeight="500"
                          color="gray.800"
                          mb={2}
                        >
                          {exp.title}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          fontWeight="300"
                          lineHeight="1.7"
                        >
                          {exp.description}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                {/* Values Section */}
                <Box>
                  <Heading
                    as="h2"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    mb={5}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    position="relative"
                    pl={5}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      w: '12px',
                      h: '1px',
                      bg: '#667eea',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    価値観
                  </Heading>
                  <Text color="gray.600" fontWeight="300" lineHeight="1.8" mb={4}>
                    開発において大切にしている考え方です。
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {[
                      { icon: '🎯', title: 'ユーザーファースト' },
                      { icon: '📚', title: '継続的学習' },
                      { icon: '🤝', title: 'チームワーク' },
                      { icon: '✨', title: '品質重視' },
                    ].map((value, index) => (
                      <Box
                        key={index}
                        textAlign="center"
                        p={5}
                        bg="rgba(102, 126, 234, 0.05)"
                        borderRadius="12px"
                        border="1px solid rgba(102, 126, 234, 0.1)"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
                        }}
                        transition="all 0.3s ease"
                      >
                        <Text fontSize="2xl" mb={2}>{value.icon}</Text>
                        <Text fontSize="sm" fontWeight="500" color="gray.800">
                          {value.title}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Quote Section */}
          <Box
            py={10}
            px={{ base: 6, md: 12 }}
            textAlign="center"
            bg="rgba(102, 126, 234, 0.03)"
            borderTop="1px solid rgba(226, 232, 240, 0.5)"
            borderBottom="1px solid rgba(226, 232, 240, 0.5)"
          >
            <Text
              fontSize="xl"
              fontStyle="italic"
              color="gray.600"
              fontWeight="300"
              lineHeight="1.8"
              maxW="600px"
              mx="auto"
              position="relative"
              _before={{
                content: '"',
                fontSize: '2rem',
                color: '#667eea',
                fontFamily: 'serif',
                position: 'absolute',
                top: '-10px',
                left: { base: '10px', md: '-20px' },
              }}
              _after={{
                content: '"',
                fontSize: '2rem',
                color: '#667eea',
                fontFamily: 'serif',
                position: 'absolute',
                top: '-10px',
                right: { base: '10px', md: '-20px' },
              }}
            >
              技術は手段であり、目的はユーザーに価値を提供すること。
              美しいコードと優れた体験の両立を常に追求しています。
            </Text>
          </Box>

          {/* Footer Section */}
          <Box
            py={10}
            px={{ base: 6, md: 12 }}
            bg="rgba(102, 126, 234, 0.05)"
            textAlign="center"
            borderTop="1px solid rgba(226, 232, 240, 0.5)"
          >
            <Heading
              as="h2"
              fontSize="2xl"
              fontWeight="300"
              color="gray.800"
              mb={4}
              letterSpacing="-0.25px"
            >
              お気軽にご連絡ください
            </Heading>
            <Text
              color="gray.600"
              mb={8}
              fontWeight="300"
              maxW="400px"
              mx="auto"
            >
              新しいプロジェクトや技術的な挑戦について、
              いつでもお話しできることを楽しみにしています。
            </Text>
            <Flex
              justify="center"
              gap={6}
              wrap="wrap"
              direction={{ base: 'column', md: 'row' }}
              align="center"
            >
              {[
                { icon: '📧', text: 'Email', href: '#' },
                { icon: '🐙', text: 'GitHub', href: '#' },
                { icon: '🐦', text: 'Twitter', href: '#' },
                { icon: '💼', text: 'LinkedIn', href: '#' },
              ].map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={6}
                  py={3}
                  bg="rgba(102, 126, 234, 0.1)"
                  color="#667eea"
                  borderRadius="24px"
                  fontSize="sm"
                  fontWeight="400"
                  border="1px solid rgba(102, 126, 234, 0.2)"
                  _hover={{
                    bg: 'rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                    textDecoration: 'none',
                  }}
                  transition="all 0.3s ease"
                >
                  <Text>{contact.icon}</Text>
                  <Text>{contact.text}</Text>
                </Link>
              ))}
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Introduction;