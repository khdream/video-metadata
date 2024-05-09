import { type HTMLChakraProps, chakra } from '@chakra-ui/react'

export function ArrowDownIcon(props: HTMLChakraProps<'svg'>) {
  return (
    <chakra.svg
      fill="currentColor"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      aria-labelledby="title"
    >
      <title>ArrowDownIcon</title>
      <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </chakra.svg>
  )
}
