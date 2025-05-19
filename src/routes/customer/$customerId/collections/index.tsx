import {
  createFileRoute,
  useParams,
  useLoaderData,
} from "@tanstack/react-router";
import "@mantine/core/styles.css";
import {
  Title,
  Paper,
  Table,
  TextInput,
  Select,
  Group,
  Button,
  Pagination,
  Box,
  Text,
  Flex,
  ActionIcon,
  ScrollArea,
  NumberInput,
  Popover,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import type { Customer } from "../../../../data/customers";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
  type Column,
  type CellContext,
  type FilterFn,
  type RowData,
  flexRender,
} from "@tanstack/react-table";
import {
  IconArrowUp,
  IconArrowDown,
  IconGripVertical,
  IconFilter,
  IconCurrencyPound, // For amount collected
} from "@tabler/icons-react";
import type { CollectionItem } from "../../../../data/collections"; // Adjusted import
import { dummyCollections } from "../../../../data/collections"; // Adjusted import

// Helper function to parse DD/MM/YYYY strings
function parseDdMmYyyy(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month, day);
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        return date;
      }
    }
  }
  return null;
}

const columnHelper = createColumnHelper<CollectionItem>();

// FilterComponent adapted for CollectionItem
function CollectionFilterComponent({
  column,
}: {
  column: Column<CollectionItem, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();
  const filterVariant = column.columnDef.meta?.filterVariant;

  if (filterVariant === "number-range") {
    // Used for Amount Collected
    const [popoverOpened, setPopoverOpened] = useState(false);
    const initialMin = (
      columnFilterValue as [number | undefined, number | undefined]
    )?.[0];
    const initialMax = (
      columnFilterValue as [number | undefined, number | undefined]
    )?.[1];
    const [localMin, setLocalMin] = useState<number | undefined>(initialMin);
    const [localMax, setLocalMax] = useState<number | undefined>(initialMax);
    const inputMinProp = column.columnDef.meta?.rangeMin;
    const inputMaxProp = column.columnDef.meta?.rangeMax;
    const inputStepProp = column.columnDef.meta?.rangeStep ?? 0.01; // Default for currency

    useMemo(() => {
      if (!popoverOpened) {
        setLocalMin(
          (columnFilterValue as [number | undefined, number | undefined])?.[0]
        );
        setLocalMax(
          (columnFilterValue as [number | undefined, number | undefined])?.[1]
        );
      }
    }, [columnFilterValue, popoverOpened]);

    return (
      <Popover
        opened={popoverOpened}
        onClose={() => setPopoverOpened(false)}
        position="bottom-start"
        withArrow
        shadow="md"
        trapFocus
        onOpen={() => {
          setLocalMin(
            (columnFilterValue as [number | undefined, number | undefined])?.[0]
          );
          setLocalMax(
            (columnFilterValue as [number | undefined, number | undefined])?.[1]
          );
        }}
      >
        <Popover.Target>
          <ActionIcon
            variant={
              popoverOpened
                ? "filled"
                : column.getIsFiltered()
                  ? "light"
                  : "default"
            }
            onClick={() => setPopoverOpened((o) => !o)}
            size="input-xs"
            title={`Filter ${column.columnDef.header}`}
            style={{ lineHeight: 1 }}
          >
            <IconFilter size="1rem" />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p="sm" style={{ minWidth: 230 }}>
          <Box>
            <Group grow align="flex-start" gap="xs">
              <NumberInput
                label="Min Amount"
                placeholder={
                  inputMinProp !== undefined
                    ? `Min: ${inputMinProp}`
                    : "Minimum"
                }
                value={localMin === undefined ? "" : localMin}
                onChange={(value) =>
                  setLocalMin(value === "" ? undefined : Number(value))
                }
                min={inputMinProp}
                max={localMax ?? inputMaxProp}
                step={inputStepProp}
                size="xs"
                variant="filled"
                style={{ flex: 1 }}
              />
              <NumberInput
                label="Max Amount"
                placeholder={
                  inputMaxProp !== undefined
                    ? `Max: ${inputMaxProp}`
                    : "Maximum"
                }
                value={localMax === undefined ? "" : localMax}
                onChange={(value) =>
                  setLocalMax(value === "" ? undefined : Number(value))
                }
                min={localMin ?? inputMinProp}
                max={inputMaxProp}
                step={inputStepProp}
                size="xs"
                variant="filled"
                style={{ flex: 1 }}
              />
            </Group>
            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                size="xs"
                onClick={() => {
                  setLocalMin(undefined);
                  setLocalMax(undefined);
                  column.setFilterValue([undefined, undefined]);
                  setPopoverOpened(false);
                }}
              >
                Clear
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  column.setFilterValue([localMin, localMax]);
                  setPopoverOpened(false);
                }}
              >
                Done
              </Button>
            </Group>
          </Box>
        </Popover.Dropdown>
      </Popover>
    );
  }

  if (filterVariant === "date-range") {
    const dateRangeValue = (columnFilterValue as [
      Date | null,
      Date | null,
    ]) || [null, null];
    return (
      <DatePickerInput
        type="range"
        size="xs"
        placeholder="Pick dates range"
        value={dateRangeValue}
        onChange={(value) => column.setFilterValue(value)}
        clearable
        popoverProps={{ withinPortal: true }}
        style={{ minWidth: 220 }}
      />
    );
  }

  if (column.id === "status") {
    return (
      <Select
        size="xs"
        placeholder="Filter by Status"
        data={["Pending", "Collected", "Failed", "Processing"].map((s) => ({
          label: s,
          value: s,
        }))}
        value={(columnFilterValue as string) || null}
        onChange={(value) => column.setFilterValue(value)}
        clearable
      />
    );
  }
  if (column.id === "paymentMethod") {
    return (
      <Select
        size="xs"
        placeholder="Filter by Method"
        data={["Card", "Cash", "Transfer", "Online"].map((s) => ({
          label: s,
          value: s,
        }))}
        value={(columnFilterValue as string) || null}
        onChange={(value) => column.setFilterValue(value)}
        clearable
      />
    );
  }

  return (
    <TextInput
      size="xs"
      placeholder={`Search ${column.columnDef.header}...`}
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      variant="filled"
    />
  );
}

export const Route = createFileRoute("/customer/$customerId/collections/")({
  component: CustomerCollectionPage,
});

function CustomerCollectionPage() {
  const parentCustomerData = useLoaderData({
    from: "/customer/$customerId",
  }) as Customer | undefined;
  const customerName = parentCustomerData?.name || "Customer";

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("collectionId", {
        header: "Collection ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("orderId", {
        header: "Order ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("collectionDate", {
        header: "Collection Date",
        cell: (info) => {
          const date = parseDdMmYyyy(info.getValue());
          return date ? date.toLocaleDateString("en-GB") : "Invalid Date";
        },
        meta: { filterVariant: "date-range" },
        filterFn: "inDateRange",
      }),
      columnHelper.accessor("amountCollected", {
        header: "Amount",
        cell: (info) => (
          <Flex align="center" gap="xs">
            <IconCurrencyPound size="0.9rem" />
            {info.getValue().toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Flex>
        ),
        meta: {
          filterVariant: "number-range",
          rangeMin: 0,
          rangeMax: 500,
          rangeStep: 0.01,
        }, // Example range
        filterFn: "inNumberRange",
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Payment Method",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          let color = "gray";
          if (status === "Collected") color = "green";
          else if (status === "Processing") color = "blue";
          else if (status === "Pending") color = "orange";
          else if (status === "Failed") color = "red";
          return (
            <Box
              style={{
                backgroundColor: `var(--mantine-color-${color}-1)`,
                borderLeft: `3px solid var(--mantine-color-${color}-6)`,
                padding: "6px 10px",
                borderRadius: "4px",
                color: `var(--mantine-color-${color}-9)`,
                fontWeight: 500,
              }}
            >
              {status}
            </Box>
          );
        },
      }),
    ],
    []
  );

  const inDateRange: FilterFn<CollectionItem> = (
    row,
    columnId,
    filterValue
  ) => {
    const rowValue = row.getValue(columnId) as string;
    if (!rowValue) return false;
    const date = parseDdMmYyyy(rowValue);
    if (!date) return false;
    date.setHours(0, 0, 0, 0);
    const [start, end] = filterValue as [Date | null, Date | null];
    if (start && date < new Date(new Date(start).setHours(0, 0, 0, 0)))
      return false;
    if (end && date > new Date(new Date(end).setHours(23, 59, 59, 999)))
      return false;
    return true;
  };

  const inNumberRange: FilterFn<CollectionItem> = (
    row,
    columnId,
    filterValue
  ) => {
    const rowValue = row.getValue(columnId);
    if (typeof rowValue !== "number") return false;
    const [min, max] = filterValue as [number | undefined, number | undefined];
    if (min !== undefined && rowValue < min) return false;
    if (max !== undefined && rowValue > max) return false;
    return true;
  };

  const customerCollections = dummyCollections; // Filter by customerId if added to CollectionItem later

  const table = useReactTable({
    data: customerCollections,
    columns,
    state: { columnFilters, sorting, pagination },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: { inDateRange, inNumberRange },
    defaultColumn: { minSize: 50, size: 160, maxSize: 500 },
  });

  return (
    <>
      <Title order={3} mb="lg">
        Collections for {customerName}
      </Title>

      {table.getState().columnFilters.length > 0 && (
        <Group justify="flex-end">
          <Button
            style={{ marginLeft: "auto" }}
            variant="filled"
            size="xs"
            onClick={() => table.resetColumnFilters()}
            mb="md"
            leftSection={<IconFilter size={14} />}
          >
            Reset All Filters
          </Button>
        </Group>
      )}

      <Paper radius="md" shadow="md" p="xs" withBorder>
        <ScrollArea>
          <Table
            highlightOnHover
            withColumnBorders
            verticalSpacing="md"
            miw={700}
          >
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <Box>
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Text
                              fw={500}
                              lineClamp={1}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Text>
                            {header.column.getCanSort() && (
                              <ActionIcon
                                variant="subtle"
                                size="xs"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {{
                                  asc: <IconArrowUp size={14} />,
                                  desc: <IconArrowDown size={14} />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <IconGripVertical size={14} />
                                )}
                              </ActionIcon>
                            )}
                          </Group>
                          {header.column.getCanFilter() ? (
                            <Box mt={4}>
                              <CollectionFilterComponent
                                column={header.column}
                              />
                            </Box>
                          ) : null}
                        </Box>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={table.getAllColumns().length}>
                    <Text ta="center" p="md">
                      No collections found.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
      <Group justify="space-between" mt="md">
        <Text size="sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </Text>
        <Pagination
          total={table.getPageCount() || 1}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(page) => table.setPageIndex(page - 1)}
          size="sm"
        />
        <Select
          size="xs"
          data={["5", "10", "20"].map((val) => ({
            label: `${val} rows`,
            value: val,
          }))}
          value={table.getState().pagination.pageSize.toString()}
          onChange={(value) => {
            if (value) table.setPageSize(Number(value));
          }}
        />
      </Group>
    </>
  );
}
