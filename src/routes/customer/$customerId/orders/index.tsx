import {
  createFileRoute,
  useLoaderData,
  useNavigate,
  Link,
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
  ThemeIcon,
  ActionIcon,
  ScrollArea,
  NumberInput,
  Popover,
  RangeSlider,
  Affix,
  useMantineTheme,
  rem,
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
  type Table as TanstackTable,
  type CellContext,
  type FilterFn,
  type RowData,
  flexRender,
} from "@tanstack/react-table";
import {
  IconArrowUp,
  IconArrowDown,
  IconCurrencyPound,
  IconGripVertical,
  IconSearch,
  IconFilter,
  IconPlus,
} from "@tabler/icons-react";

// Define the Order type
export interface Order {
  orderId: string;
  orderDate: string; // Keep as ISO string for now, easier for basic text sort/filter
  deliveryDate?: string; // Added optional delivery date
  productName: string;
  quantity: number;
  unitPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

// Helper function to parse DD/MM/YYYY strings
function parseDdMmYyyy(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month, day);
      // Validate if the constructor created the date we expected (e.g. not 32/01/2023 -> 01/02/2023)
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        return date;
      }
    }
  }
  return null; // Return null if parsing fails
}

// Dummy data for orders (can be expanded)
const dummyOrders: Order[] = [
  {
    orderId: "ORD001",
    orderDate: "15/01/2023",
    deliveryDate: "18/01/2023", // Added delivery date
    productName: "Vanilla Swirls",
    quantity: 2,
    unitPrice: 15.99,
    status: "Delivered",
  },
  {
    orderId: "ORD002",
    orderDate: "20/02/2023",
    deliveryDate: "23/02/2023", // Added delivery date
    productName: "Chocolate Dreams",
    quantity: 1,
    unitPrice: 22.5,
    status: "Shipped",
  },
  {
    orderId: "ORD003",
    orderDate: "10/03/2023",
    deliveryDate: undefined, // Example: Not yet delivered
    productName: "Strawberry Clouds",
    quantity: 5,
    unitPrice: 12.0,
    status: "Pending",
  },
  {
    orderId: "ORD004",
    orderDate: "12/03/2023",
    deliveryDate: "12/03/2023", // Example: Same day delivery
    productName: "Minty Fresh",
    quantity: 3,
    unitPrice: 10.75,
    status: "Delivered",
  },
  {
    orderId: "ORD005",
    orderDate: "01/04/2023",
    deliveryDate: undefined, // Cancelled, so no delivery date
    productName: "Caramel Crunch",
    quantity: 2,
    unitPrice: 18.0,
    status: "Cancelled",
  },
];

const columnHelper = createColumnHelper<Order>();

// Path matches /customer/$customerId/order
export const Route = createFileRoute("/customer/$customerId/orders/")({
  component: CustomerOrderPage,
});

function FilterComponent({ column }: { column: Column<Order, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const filterVariant = column.columnDef.meta?.filterVariant;

  if (filterVariant === "number-range") {
    const [popoverOpened, setPopoverOpened] = useState(false);
    // Initialize local state from the current column filter value
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
    const inputStepProp = column.columnDef.meta?.rangeStep ?? 1;

    // Effect to reset local state if columnFilterValue changes externally (e.g., global clear)
    // and popover is closed.
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
        onClose={() => setPopoverOpened(false)} // Just close, don't apply changes on clicking away
        position="bottom-start"
        withArrow
        shadow="md"
        trapFocus // Keep focus within popover
        onOpen={() => {
          // When opening, ensure local state is synced with the current actual filter values
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
                ? "filled" // Darker variant when popover is open
                : column.getIsFiltered()
                  ? "light" // Highlight if filtered and popover is closed
                  : "default" // Default if no filter and popover is closed
            }
            onClick={() => setPopoverOpened((o) => !o)}
            size="input-xs"
            title="Set number range"
            style={{ lineHeight: 1 }}
          >
            <IconFilter size="1rem" />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p="sm" style={{ minWidth: 230 }}>
          {" "}
          {/* Adjusted minWidth slightly */}
          <Box>
            <Group grow align="flex-start" gap="xs">
              {" "}
              {/* Changed to flex-start for label alignment */}
              <NumberInput
                label="Min"
                placeholder={
                  inputMinProp !== undefined
                    ? `Min: ${inputMinProp}`
                    : "Minimum"
                }
                value={localMin === undefined ? "" : localMin} // Handle undefined for empty input
                onChange={(value) =>
                  setLocalMin(value === "" ? undefined : Number(value))
                }
                min={inputMinProp}
                max={localMax ?? inputMaxProp} // Dynamic max for min input
                step={inputStepProp}
                size="xs"
                variant="filled"
                style={{ flex: 1 }} // Ensure inputs take available space
              />
              <NumberInput
                label="Max"
                placeholder={
                  inputMaxProp !== undefined
                    ? `Max: ${inputMaxProp}`
                    : "Maximum"
                }
                value={localMax === undefined ? "" : localMax} // Handle undefined for empty input
                onChange={(value) =>
                  setLocalMax(value === "" ? undefined : Number(value))
                }
                min={localMin ?? inputMinProp} // Dynamic min for max input
                max={inputMaxProp}
                step={inputStepProp}
                size="xs"
                variant="filled"
                style={{ flex: 1 }} // Ensure inputs take available space
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
                  // Ensure min is not greater than max if both are defined
                  let finalMin = localMin;
                  let finalMax = localMax;
                  if (
                    finalMin !== undefined &&
                    finalMax !== undefined &&
                    finalMin > finalMax
                  ) {
                    // Option 1: Swap them (could be confusing)
                    // [finalMin, finalMax] = [finalMax, finalMin];
                    // Option 2: Set one to undefined or adjust (here, we just proceed, NumberInput validation might handle it)
                    // For simplicity, we'll let the direct values pass through.
                    // More complex validation could be added here.
                  }
                  column.setFilterValue([finalMin, finalMax]);
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
        placeholder={`Filter by ${column.columnDef.header}`}
        data={["Pending", "Shipped", "Delivered", "Cancelled"].map((s) => ({
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

function CustomerOrderPage() {
  const parentCustomerData = useLoaderData({
    from: "/customer/$customerId",
  }) as Customer | undefined;
  const customerName = parentCustomerData?.name || "Customer";
  const customerId = parentCustomerData?.id;
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5, // Default page size
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("orderId", {
        header: "Order ID",
        cell: (info: CellContext<Order, string>) => info.getValue(),
      }),
      columnHelper.accessor("orderDate", {
        header: "Order Date",
        cell: (info: CellContext<Order, string>) => {
          const date = parseDdMmYyyy(info.getValue());
          return date ? date.toLocaleDateString("en-GB") : "Invalid Date";
        },
        meta: { filterVariant: "date-range" },
        filterFn: "inDateRange",
      }),
      columnHelper.accessor("deliveryDate", {
        header: "Delivery Date",
        cell: (info: CellContext<Order, string | undefined>) => {
          const dateValue = info.getValue();
          if (!dateValue) return "N/A"; // Or an empty string
          const date = parseDdMmYyyy(dateValue);
          return date ? date.toLocaleDateString("en-GB") : "Invalid Date";
        },
        meta: { filterVariant: "date-range" },
        filterFn: "inDateRange", // Can reuse the same filter logic
      }),
      columnHelper.accessor((row: Order) => row.quantity * row.unitPrice, {
        id: "invoicePrice",
        header: "Invoice Price",
        cell: (info: CellContext<Order, number>) => (
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
          rangeMax: 1000,
          rangeStep: 0.01,
        },
        filterFn: "inNumberRange",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info: CellContext<Order, Order["status"]>) => {
          const status = info.getValue();
          let color = "gray";
          if (status === "Delivered") color = "green";
          else if (status === "Shipped") color = "blue";
          else if (status === "Pending") color = "orange";
          else if (status === "Cancelled") color = "red";
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

  const inDateRange: FilterFn<Order> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId) as string;
    if (!rowValue) return false;
    const date = parseDdMmYyyy(rowValue); // Use the new parser

    if (!date) return false; // If parsing failed, treat as not matching
    date.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

    const [start, end] = filterValue as [Date | null, Date | null];

    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      if (date < startDate) return false;
    }
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      if (date > endDate) return false;
    }
    return true;
  };

  const inNumberRange: FilterFn<Order> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);

    if (typeof rowValue !== "number") {
      // For columns using this filter, we expect a number.
      // If it's not, it doesn't match.
      return false;
    }

    const [min, max] = filterValue as [number | undefined, number | undefined];

    if (min !== undefined && rowValue < min) {
      return false;
    }
    if (max !== undefined && rowValue > max) {
      return false;
    }
    return true;
  };

  const table = useReactTable({
    data: dummyOrders,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      inDateRange,
      inNumberRange,
    },
    defaultColumn: {
      minSize: 40,
      size: 180,
      maxSize: 800,
    },
  });

  return (
    <>
      <Title order={3} mb="lg">
        Orders for {customerName}
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
        <ScrollArea style={{ padding: 0 }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="md">
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
                              <FilterComponent column={header.column} />
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
                <Table.Tr
                  key={row.id}
                  onClick={() => {
                    if (customerId) {
                      navigate({
                        to: `/customer/$customerId/orders/$orderId/details`,
                        params: {
                          customerId: customerId,
                          orderId: row.original.orderId,
                        },
                      });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
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
                      No orders found.
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
          {table.getPageCount()}
        </Text>
        <Pagination
          total={table.getPageCount()}
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
          onChange={(value) => table.setPageSize(Number(value))}
        />
      </Group>

      {customerId && (
        <Affix position={{ bottom: 70, right: 20 }}>
          <Box
            style={{
              borderRadius: "9999px",
              boxShadow: theme.shadows.md,
            }}
          >
            <ActionIcon
              component={Link}
              to={`/customer/${customerId}/orders/add`}
              variant="filled"
              style={{ width: rem(56), height: rem(56) }}
              radius="xl"
              aria-label="Add new order"
              color={theme.primaryColor}
            >
              <IconPlus style={{ width: rem(28), height: rem(28) }} />
            </ActionIcon>
          </Box>
        </Affix>
      )}
    </>
  );
}
