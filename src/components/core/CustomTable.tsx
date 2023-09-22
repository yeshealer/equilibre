import {
  ColumnDef,
  ColumnSort,
  OnChangeFn,
  TableMeta,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons';
import {
  Divider,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import EquilibreCard from './Card';

interface DataTableProps<T extends object> {
  tableId?: string;
  columns: ColumnDef<T>[];
  data: T[];
  globalFilter?: string;
  onChangeGlobalFilter: OnChangeFn<any>;
  sortingDefault?: ColumnSort[];
}

const CustomTable = <T extends object>({
  tableId,
  columns,
  data,
  globalFilter,
  onChangeGlobalFilter,
  sortingDefault,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState(
    sortingDefault ? sortingDefault : ([] as ColumnSort[])
  );
  const [tableData, setTableData] = useState([...data]);
  useEffect(() => {
    setTableData(data);
  }, [data]);
  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: onChangeGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
    },
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex: number, columnId: number, value: any) => {
        setTableData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <EquilibreCard>
      <TableContainer>
        <Table fontSize={'xs'} justifyContent={'space-around'}>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <Th
                      key={header.id}
                      fontFamily={'Arista'}
                      textAlign={
                        header.column.columnDef.id === 'FirstColumn' ||
                        (tableId != 'lock' &&
                          header.column.columnDef.id === 'SecondColumn')
                          ? 'left'
                          : header.column.columnDef.id === 'LockActions' ||
                            header.column.columnDef.id === 'bVaraActions'
                          ? 'center'
                          : 'right'
                      }
                      maxWidth={
                        header.column.columnDef.id === 'LockActions'
                          ? '300px'
                          : 'lg'
                      }
                      borderColor={'gray.600'}
                      onClick={header.column.getToggleSortingHandler()}
                      _hover={{ color: 'green.500' }}
                      color={
                        header.column.getIsSorted() ? 'green.500' : 'gray.400'
                      }
                      display={
                        header.column.columnDef.id === 'estimatedRewards'
                          ? 'flex'
                          : 'table-cell'
                      }
                      mb={
                        header.column.columnDef.id === 'estimatedRewards'
                          ? -1
                          : 0
                      }
                      justifyContent={'flex-end'}
                      cursor={'pointer'}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: <ArrowUpIcon ml={1} mb={1} />,
                        desc: <ArrowDownIcon ml={1} mb={1} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td
                    key={cell.id}
                    maxWidth={cell.id.includes('LockActions') ? '250px' : 'lg'}
                    textAlign={
                      cell.column.columnDef.id === 'FirstColumn' ||
                      cell.column.columnDef.id === 'SecondColumn'
                        ? 'left'
                        : 'right'
                    }
                    borderRight={
                      tableId === 'vote' &&
                      cell.column.columnDef.id === 'SecondColumn'
                        ? '1px solid'
                        : 'none'
                    }
                    borderLeft={
                      (tableId === 'lock' &&
                        cell.column.columnDef.id === 'LockActions') ||
                      (tableId === 'bVara' &&
                        cell.column.columnDef.id === 'bVaraActions')
                        ? '1px solid rgba(255, 255, 255, 0.5)'
                        : 'none'
                    }
                    borderColor={'gray.600'}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack mt={10} justifyContent={'end'} spacing={8}>
          <HStack>
            <Text fontSize={'xs'}>Rows per page: </Text>
            <Select
              size={'xs'}
              w={'15'}
              borderRadius={'lg'}
              onChange={e => {
                setPageSize(Number(e.target.value));
                table.setPageSize(Number(e.target.value));
              }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </HStack>
          <HStack>
            <Text fontSize={'xs'}>
              Page {page + 1} of {table.getPageCount()}
            </Text>
            <ArrowBackIcon
              onClick={() => {
                if (!table.getCanPreviousPage()) return;
                setPage(page - 1);
                table.previousPage();
              }}
            />
            <ArrowForwardIcon
              onClick={() => {
                if (!table.getCanNextPage()) return;
                setPage(page + 1);
                table.nextPage();
              }}
            />
          </HStack>
        </HStack>
      </TableContainer>
    </EquilibreCard>
  );
};

export default CustomTable;
