'use client'

import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, Panel } from '@/components'
import type { Movie } from '@/types'
import { IconButton } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { Table as ChakraTable, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { matchSorter } from 'match-sorter'
import { useEffect, useState } from 'react'

interface ITableProps<Movie> {
  // biome-ignore lint/suspicious/noExplicitAny: unable to match types.
  columns: any[] | undefined
  data: Movie[]
}

const sortedIcons: Record<string, JSX.Element> = {
  asc: <ArrowUpIcon height="2" width="2" />,
  desc: <ArrowDownIcon height="2" width="2" />
}

export function Table({ columns = [], data }: ITableProps<Movie>) {
  const [tableData, setTableData] = useState(data)

  const [filter, setFilter] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!filter) {
      setTableData(data)
    } else {
      const filtered = matchSorter(data, filter, {
        keys: ['original_title', 'translated_title', 'year']
      })
      setTableData(filtered)
    }
  }, [data, filter])

  const handleFilterChange = (filter: string) => {
    if (filter === '') {
      setFilter(undefined)
    } else {
      setFilter(filter)
    }
  }

  const [sorting, setSorting] = useState<SortingState>([])

  const {
    getState,
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    nextPage,
    previousPage,
    getRowModel,
    getCenterTotalSize,
    getHeaderGroups
  } = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const renderPagination = () => {
    const page = getState().pagination.pageIndex + 1
    const total = getPageCount()

    return total > 0 ? `Página ${page} de ${total}` : ''
  }

  return (
    <Panel width="full" mb="10">
      <Stack>
        <HStack
          justifyContent="space-between"
          marginBottom={2}
          paddingX="1"
          paddingY="2"
          width="full"
          position="relative"
        >
          <Input
            maxWidth="250px"
            backgroundColor="white"
            colorScheme="blue"
            placeholder="Buscar"
            type="text"
            onChange={(input) => handleFilterChange(input.target.value)}
          />
        </HStack>
        <Flex overflowX="scroll">
          <Flex alignItems="center" flexDirection="column" style={{ minWidth: getCenterTotalSize(), width: '100%' }}>
            <ChakraTable>
              <Thead>
                {getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id} colSpan={header.colSpan} cursor="pointer" style={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : (
                          <HStack
                            alignItems="center"
                            justifyContent="center"
                            {...{
                              className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                              onClick: header.column.getToggleSortingHandler()
                            }}
                          >
                            <Text textAlign="center">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </Text>{' '}
                            <Text>{sortedIcons[(header.column.getIsSorted() as string) ?? null]}</Text>
                          </HStack>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {getRowModel().rows.map((row) => {
                  return (
                    <Tr key={row.id} _hover={{ background: 'gray.100' }}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td key={cell.id} color="gray.700" style={{ width: cell.column.getSize() }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Td>
                        )
                      })}
                    </Tr>
                  )
                })}
              </Tbody>
            </ChakraTable>
          </Flex>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between" marginTop={2} width="100%">
          <IconButton
            aria-label="next-page-table"
            icon={<ChevronLeftIcon height="4" width="4" />}
            isDisabled={!getCanPreviousPage()}
            paddingRight="0.5"
            rounded="full"
            onClick={() => previousPage()}
          />

          <Text color="gray.700">{renderPagination()}</Text>
          <IconButton
            aria-label="next-page-table"
            icon={<ChevronRightIcon height="4" width="4" />}
            isDisabled={!getCanNextPage()}
            paddingLeft="0.5"
            rounded="full"
            onClick={() => nextPage()}
          />
        </Flex>
      </Stack>
    </Panel>
  )
}
