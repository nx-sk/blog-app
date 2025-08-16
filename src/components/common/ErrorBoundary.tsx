import React from 'react'
import { Box, Text } from '@chakra-ui/react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <Text fontWeight="bold" color="red.500">エラーが発生しました</Text>
          {import.meta.env.DEV && this.state.error && (
            <Text mt={2} fontSize="sm" color="gray.600">{this.state.error.message}</Text>
          )}
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

