import { Box, BoxProps } from '@chakra-ui/react'

interface ContainerProps extends BoxProps {
  children: React.ReactNode
  size?: 'default' | 'full'
}

const Container = ({ 
  children, 
  size = 'default',
  ...props 
}: ContainerProps) => {
  const maxWidth = size === 'full' ? '100%' : '1280px'
  
  return (
    <Box 
      maxW={maxWidth}
      mx="auto" 
      px={{ base: 4, md: 8 }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default Container