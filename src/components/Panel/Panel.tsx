import { Box, type BoxProps } from '@chakra-ui/react'

interface IPanelProps extends BoxProps {
  children: JSX.Element
  padding?: number
}

export function Panel({ padding = 2, width = '300px', children, ...props }: IPanelProps) {
  return (
    <Box
      alignContent="left"
      backgroundColor="gray.50"
      borderRadius="lg"
      boxShadow="base"
      marginX="auto"
      padding={padding}
      width={width}
      {...props}
    >
      {children}
    </Box>
  )
}
