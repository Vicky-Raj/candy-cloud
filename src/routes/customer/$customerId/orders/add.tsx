import {
  createFileRoute,
  useNavigate,
  useLoaderData,
} from "@tanstack/react-router";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {
  Title,
  Paper,
  TextInput,
  Textarea,
  Select,
  Group,
  Button,
  Box,
  Container,
  Autocomplete,
  Card,
  ActionIcon,
  NumberInput,
  Divider,
  rem,
  Text,
  Image,
  Accordion,
  Select as MantineSelect,
  Flex,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import type { Customer } from "../../../../data/customers";
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconX,
  IconShoppingCartPlus,
  IconPlus,
  IconMinus,
  IconPencil,
} from "@tabler/icons-react";
import { dummyProducts, type Product } from "../../../../data/products";
import { useState, useMemo, useEffect } from "react";

// Helper component for displaying fields in read-only mode
interface DisplayFieldProps {
  label: string;
  value: string | number | null | undefined;
  isTextarea?: boolean;
}
function DisplayField({ label, value, isTextarea }: DisplayFieldProps) {
  return (
    <Box mb="md">
      <Text size="sm" fw={500} c="dimmed">
        {label}
      </Text>
      {isTextarea ? (
        <Paper p="xs" withBorder shadow="0">
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {value || "-"}
          </Text>
        </Paper>
      ) : (
        <Text size="sm">{value || "-"}</Text>
      )}
    </Box>
  );
}

// Define the schema for an individual order item
const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(), // Store name for display convenience
  image: z.string(), // Added image URL
  unitPrice: z.number(), // Store unitPrice for potential calculations
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
});

// Define the schema for form validation using Zod
const addOrderSchema = z
  .object({
    orderId: z.string().min(1, { message: "Order ID is required" }),
    orderDate: z.date({ required_error: "Order date is required" }),
    deliveryDate: z.date().nullable().optional(),
    paymentType: z.string().min(1, { message: "Payment type is required" }),
    comments: z.string().optional(),
    orderItems: z
      .array(orderItemSchema)
      .min(1, { message: "At least one product must be added to the order" }),
  })
  .refine(
    (data) => {
      if (
        data.deliveryDate &&
        data.orderDate &&
        data.deliveryDate < data.orderDate
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Delivery date cannot be before order date",
      path: ["deliveryDate"], // Path to the field to attach the error message
    }
  );

interface OrderItemValue {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

interface AddOrderFormValues {
  orderId: string;
  orderDate: Date | null;
  deliveryDate?: Date | null;
  paymentType: string;
  comments?: string;
  orderItems: OrderItemValue[];
}

// Props for the page component
interface CustomerAddOrderPageProps {
  addMode: boolean;
  orderData?: AddOrderFormValues;
}

// Exporting for use in other files
export type { AddOrderFormValues, OrderItemValue };

export const Route = createFileRoute("/customer/$customerId/orders/add")({
  component: () => <CustomerAddOrderPage addMode={true} />, // Explicitly pass addMode for this route
});

export function CustomerAddOrderPage({
  addMode = true,
  orderData,
}: CustomerAddOrderPageProps) {
  // Default addMode to true for standalone usage
  const navigate = useNavigate();
  const parentCustomerData = useLoaderData({
    from: "/customer/$customerId",
  }) as Customer | undefined;
  const customerName = parentCustomerData?.name || "Customer";
  const customerId = parentCustomerData?.id;
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [productSearchValue, setProductSearchValue] = useState("");
  const [isEditing, setIsEditing] = useState(false); // For toggling edit state in view mode

  const effectiveAddMode = addMode;
  const readOnlyMode = !effectiveAddMode && !isEditing;

  const form = useForm<AddOrderFormValues>({
    initialValues:
      !effectiveAddMode && orderData
        ? orderData
        : {
            orderId: "",
            orderDate: null,
            deliveryDate: null,
            paymentType: "",
            comments: "",
            orderItems: [],
          },
    validate: zodResolver(addOrderSchema),
  });

  // Effect to reset form if orderData changes (e.g. navigating between different order details)
  useEffect(() => {
    if (!effectiveAddMode && orderData) {
      form.setValues(orderData);
      form.resetDirty(orderData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveAddMode, orderData, form.setValues, form.resetDirty]); // form.setValues and resetDirty are stable

  const pageTitle = effectiveAddMode
    ? `Add New Order for ${customerName}`
    : isEditing
      ? `Edit Order ${orderData?.orderId || ""} for ${customerName}`
      : `Order Details: ${orderData?.orderId || ""} for ${customerName}`;

  const filteredProducts = useMemo(() => {
    if (!productSearchValue.trim()) return [];
    return dummyProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(productSearchValue.toLowerCase()) ||
          p.description.toLowerCase().includes(productSearchValue.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 search results
  }, [productSearchValue]);

  const addProductToOrder = (product: Product) => {
    const currentItems = form.values.orderItems;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.productId === product.id
    );
    if (existingItemIndex === -1) {
      form.insertListItem("orderItems", {
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice: product.price,
        quantity: 1,
      });
    } else {
      // Product already in cart, user can adjust quantity in the accordion
      form.setFieldValue(
        `orderItems.${existingItemIndex}.quantity`,
        currentItems[existingItemIndex].quantity + 1
      );
    }
    setProductSearchValue(""); // Clear search input
  };

  const handleSubmit = (values: AddOrderFormValues) => {
    console.log("Form submitted with values:", values);
    // Here you would typically handle the API call to save the order
    // For now, let's navigate back to the orders page for this customer
    if (customerId) {
      navigate({ to: `/customer/${customerId}/orders/` });
    }
  };

  return (
    <Container p={0} pb="xl">
      <Title order={2} mb="md" ta="center">
        {pageTitle}
      </Title>
      <Paper withBorder shadow="md" p="sm" radius="md">
        {!effectiveAddMode && !isEditing && (
          <Group justify="flex-end" mb="xs">
            <ActionIcon
              variant="outline"
              color="blue"
              onClick={() => setIsEditing(true)}
              title="Edit Order"
            >
              <IconPencil size={18} />
            </ActionIcon>
          </Group>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {readOnlyMode ? (
            <DisplayField label="Order ID" value={form.values.orderId} />
          ) : (
            <TextInput
              label="Order ID"
              placeholder="Enter order ID (e.g., ORD123)"
              required
              mb="md"
              {...form.getInputProps("orderId")}
              readOnly={readOnlyMode}
            />
          )}

          {readOnlyMode ? (
            <DisplayField
              label="Order Date"
              value={
                form.values.orderDate
                  ? new Date(form.values.orderDate).toLocaleDateString()
                  : "N/A"
              }
            />
          ) : (
            <DatePickerInput
              label="Order Date"
              placeholder="Select order date"
              required
              mb="md"
              valueFormat="DD/MM/YYYY"
              popoverProps={{ withinPortal: true }}
              {...form.getInputProps("orderDate")}
              readOnly={readOnlyMode}
            />
          )}

          {readOnlyMode ? (
            <DisplayField
              label="Delivery Date"
              value={
                form.values.deliveryDate
                  ? new Date(form.values.deliveryDate).toLocaleDateString()
                  : "N/A"
              }
            />
          ) : (
            <DatePickerInput
              label="Delivery Date (Optional)"
              placeholder="Select delivery date"
              mb="md"
              valueFormat="DD/MM/YYYY"
              popoverProps={{ withinPortal: true }}
              minDate={form.values.orderDate || undefined}
              clearable
              {...form.getInputProps("deliveryDate")}
              readOnly={readOnlyMode}
            />
          )}

          {readOnlyMode ? (
            <DisplayField
              label="Payment Type"
              value={form.values.paymentType || "N/A"}
            />
          ) : (
            <Select
              label="Payment Type"
              placeholder="Select payment type"
              required
              mb="md"
              data={[
                { value: "Card", label: "Card" },
                { value: "Cash", label: "Cash" },
                { value: "Online", label: "Online" },
                { value: "Pending", label: "Pending Confirmation" },
              ]}
              {...form.getInputProps("paymentType")}
              readOnly={readOnlyMode}
            />
          )}

          {readOnlyMode ? (
            <DisplayField
              label="Comments"
              value={form.values.comments || "N/A"}
              isTextarea={true}
            />
          ) : (
            <Textarea
              label="Comments (Optional)"
              placeholder="Enter any comments for the order"
              mb="xl"
              minRows={3}
              autosize
              {...form.getInputProps("comments")}
              readOnly={readOnlyMode}
            />
          )}

          <Divider my="lg" label="Order Items" labelPosition="center" />

          {/* Product Search Area - only show if adding or editing */}
          {(effectiveAddMode || isEditing) && (
            <Box
              style={{ position: "relative", marginBottom: theme.spacing.md }}
            >
              <TextInput
                label="Search Products to Add"
                placeholder="Type product name or description..."
                value={productSearchValue}
                onChange={(event) =>
                  setProductSearchValue(event.currentTarget.value)
                }
              />
              {/* Conditional rendering for search results (if shown) */}
              {productSearchValue && (
                <Box
                  style={{
                    position: "absolute",
                    top: `calc(100% + ${theme.spacing.xs})`,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: rem(320),
                    overflowY: "auto",
                    borderRadius: theme.radius.sm,
                  }}
                >
                  {filteredProducts.length > 0 ? (
                    <Paper shadow="sm" p="xs" withBorder>
                      {filteredProducts.map((product) => (
                        <UnstyledButton
                          key={product.id}
                          onClick={() => addProductToOrder(product)}
                          style={{ display: "block", width: "100%" }}
                          mb="xs"
                        >
                          <Box
                            p="xs"
                            style={(theme) => ({
                              border: `1px solid ${colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                              borderRadius: theme.radius.sm,
                              backgroundColor:
                                colorScheme === "dark"
                                  ? theme.colors.dark[6]
                                  : theme.white,
                              transition: "background-color 100ms ease",
                              "&:hover": {
                                backgroundColor:
                                  colorScheme === "dark"
                                    ? theme.colors.dark[5]
                                    : theme.colors.gray[0],
                              },
                            })}
                          >
                            <Group wrap="nowrap" gap="md" align="stretch">
                              <Box
                                style={{
                                  flexShrink: 0,
                                  width: rem(50),
                                  height: rem(50),
                                }}
                              >
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={50}
                                  height={50}
                                  fit="cover"
                                  radius="sm"
                                />
                              </Box>
                              <Flex
                                direction="column"
                                justify="space-between"
                                style={{ flexGrow: 1, overflow: "hidden" }}
                              >
                                <Title order={6} fw={500} lineClamp={2}>
                                  {product.name}
                                </Title>
                                <Text size="xs" c="dimmed" mt="auto">
                                  £{product.price.toFixed(2)}
                                </Text>
                              </Flex>
                            </Group>
                          </Box>
                        </UnstyledButton>
                      ))}
                    </Paper>
                  ) : (
                    <Paper shadow="sm" p="md" withBorder>
                      <Text size="sm" c="dimmed" ta="center">
                        No products found matching "{productSearchValue}".
                      </Text>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Selected Order Items Accordion */}
          {form.values.orderItems.length === 0 &&
            !productSearchValue &&
            (effectiveAddMode || isEditing) && (
              <Text c="dimmed" ta="center" my="md">
                Search and select products to add them to the order.
              </Text>
            )}

          {form.values.orderItems.length > 0 && (
            <Accordion
              variant="default" // Can be default or contained
              defaultValue="order-items-panel" // Keep it open by default initially
              mt="md"
              mb="md"
              p={0}
              styles={{
                content: {
                  padding: 0,
                },
              }}
            >
              <Accordion.Item value="order-items-panel">
                <Accordion.Control>
                  <Text fw={500}>
                    View/Edit Added Products ({form.values.orderItems.length}{" "}
                    item{form.values.orderItems.length !== 1 ? "s" : ""})
                  </Text>
                </Accordion.Control>
                <Accordion.Panel p={0}>
                  {form.values.orderItems.map(
                    (item: OrderItemValue, index: number) => (
                      <Group
                        key={item.productId}
                        wrap="nowrap"
                        align="center"
                        mb="xs"
                        p="xs"
                        style={(theme) => ({
                          border: `1px solid ${colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                          borderRadius: theme.radius.sm,
                          backgroundColor:
                            colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : theme.white,
                        })}
                      >
                        <Box style={{ flexShrink: 0, width: 60, height: 60 }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fit="contain"
                            radius="sm"
                          />
                        </Box>
                        <Flex
                          direction="column"
                          justify="space-between"
                          style={{ flexGrow: 1, overflow: "hidden" }}
                        >
                          <Text truncate="end" fw={500} size="sm" lineClamp={1}>
                            {item.name}
                          </Text>
                          <Text size="xs" c="dimmed" mt="auto">
                            £{item.unitPrice.toFixed(2)} each
                          </Text>
                        </Flex>

                        {/* Right: Quantity Adjustment & Total Price for item */}
                        <Flex
                          direction="column"
                          align="flex-end"
                          justify="center"
                          style={{ flexShrink: 0 }}
                        >
                          <Group gap={3} wrap="nowrap" align="center">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="red"
                              onClick={() => {
                                const currentQuantity =
                                  form.values.orderItems[index].quantity;
                                if (currentQuantity > 1) {
                                  form.setFieldValue(
                                    `orderItems.${index}.quantity`,
                                    currentQuantity - 1
                                  );
                                } else {
                                  form.removeListItem("orderItems", index);
                                }
                              }}
                              aria-label="Decrease quantity"
                              disabled={readOnlyMode}
                            >
                              <IconMinus size={14} />
                            </ActionIcon>
                            <Text w={rem(24)} ta="center" size="sm" fw={500}>
                              {item.quantity}
                            </Text>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="green"
                              onClick={() =>
                                form.setFieldValue(
                                  `orderItems.${index}.quantity`,
                                  form.values.orderItems[index].quantity + 1
                                )
                              }
                              aria-label="Increase quantity"
                              disabled={readOnlyMode}
                            >
                              <IconPlus size={14} />
                            </ActionIcon>
                          </Group>
                          <Text size="xs" c="dimmed" mt={rem(4)}>
                            Total: £
                            {(item.unitPrice * item.quantity).toFixed(2)}
                          </Text>
                        </Flex>
                      </Group>
                    )
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}

          {/* Order Summary Section */}
          {form.values.orderItems.length > 0 && (
            <Paper withBorder radius="md" p="md" mt="lg">
              <Title order={4} mb="sm">
                Order Summary
              </Title>
              {(() => {
                const subTotal = form.values.orderItems.reduce(
                  (acc, item) => acc + item.unitPrice * item.quantity,
                  0
                );
                const dummyDiscountAmount = 5.0; // Fixed dummy discount
                const dummyVatRate = 20; // Fixed dummy VAT rate

                const priceAfterDiscount = Math.max(
                  0,
                  subTotal - dummyDiscountAmount
                );
                const vatAmount = priceAfterDiscount * (dummyVatRate / 100);
                const grandTotal = priceAfterDiscount + vatAmount;

                return (
                  <>
                    <Flex justify="space-between" align="center" mb="xs">
                      <Text>Subtotal:</Text>
                      <Text fw={500}>£{subTotal.toFixed(2)}</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" mb="xs">
                      <Text>Discount:</Text>
                      <Text fw={500}>- £{dummyDiscountAmount.toFixed(2)}</Text>
                    </Flex>

                    {subTotal < dummyDiscountAmount && (
                      <Text c="dimmed" size="xs" mb="xs" ta="right">
                        (Discount adjusted to subtotal)
                      </Text>
                    )}

                    <Flex justify="space-between" align="center" mb="xs">
                      <Text>Price After Discount:</Text>
                      <Text fw={500}>£{priceAfterDiscount.toFixed(2)}</Text>
                    </Flex>

                    <Flex justify="space-between" align="center" mb="xs">
                      <Text>VAT ({dummyVatRate}%):</Text>
                      <Text fw={500}>£{vatAmount.toFixed(2)}</Text>
                    </Flex>

                    <Divider my="sm" />

                    <Flex justify="space-between" align="center" mt="sm">
                      <Text fw={700} size="lg">
                        Grand Total:
                      </Text>
                      <Text
                        fw={700}
                        size="lg"
                        c={
                          colorScheme === "dark"
                            ? theme.colors.green[4]
                            : theme.colors.green[7]
                        }
                      >
                        £{grandTotal.toFixed(2)}
                      </Text>
                    </Flex>
                  </>
                );
              })()}
            </Paper>
          )}

          {form.values.orderItems.length > 0 && <Divider my="lg" />}

          <Group justify="flex-end" mt="xl">
            <Button
              variant="default"
              onClick={() => {
                if (!effectiveAddMode && isEditing) {
                  setIsEditing(false); // Cancel edit, go back to view mode
                  // Optionally reset form to original orderData if changes were made
                  if (orderData) form.resetDirty(orderData);
                } else {
                  navigate({
                    to: customerId
                      ? `/customer/${customerId}/orders/`
                      : "/customers",
                  });
                }
              }}
              leftSection={<IconArrowLeft size={14} />}
            >
              {!effectiveAddMode && isEditing ? "Cancel Edit" : "Cancel"}
            </Button>
            {(effectiveAddMode || isEditing) && (
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={14} />}
                disabled={readOnlyMode || (!form.isValid() && form.isDirty())} // Also disable if in pure readOnlyMode
              >
                {effectiveAddMode ? "Save Order" : "Update Order"}
              </Button>
            )}
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
