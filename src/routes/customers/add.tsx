import {
  createFileRoute,
  useNavigate,
  Link,
  useParams, // For edit mode context
} from "@tanstack/react-router";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Group,
  Button,
  NumberInput,
  Textarea,
  SimpleGrid,
  Stack,
  AppShell,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
  Box,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconUsers,
} from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { type Customer, dummyCustomers } from "../../data/customers"; // Assuming dummyCustomers can be mutated or we have an addCustomer function
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useEffect } from "react"; // For form reset on data change in edit mode

// Define the schema for form validation using Zod
const customerFormSchema = z.object({
  code: z.string().min(1, { message: "Customer code is required" }), // Or auto-generate
  name: z.string().min(1, { message: "Customer name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postCode: z.string().min(1, { message: "Postcode is required" }),
  mobile: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^(\+44|0)7\d{9}$/, { message: "Invalid UK mobile number format" }), // Example: UK mobile regex
  phone: z.string().optional(),
  contact: z.string().optional(),
  creditTerms: z.string().min(1, { message: "Credit terms are required" }),
  creditLimit: z
    .number()
    .min(0, { message: "Credit limit must be non-negative" }),
  deliveryBetween: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Props for the component to distinguish add vs edit mode
interface CustomerFormPageProps {
  editMode?: boolean;
  customerData?: Customer;
  onCancel?: () => void;
}

// This is the route for /customers/add
export const Route = createFileRoute("/customers/add")({
  component: () => <CustomerFormPage editMode={false} />, // Explicitly set editMode for this route
});

export function CustomerFormPage({
  editMode = false,
  customerData,
  onCancel,
}: CustomerFormPageProps) {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const form = useForm<CustomerFormValues>({
    initialValues:
      editMode && customerData
        ? {
            code: customerData.code,
            name: customerData.name,
            address: customerData.address,
            city: customerData.city,
            postCode: customerData.postCode,
            mobile: customerData.mobile,
            phone: customerData.phone || "",
            contact: customerData.contact || "",
            creditTerms: customerData.creditTerms,
            creditLimit: customerData.creditLimit,
            deliveryBetween: customerData.deliveryBetween || "",
          }
        : {
            code: "", // Consider auto-generating suggestion or making it editable
            name: "",
            address: "",
            city: "",
            postCode: "",
            mobile: "",
            phone: "",
            contact: "",
            creditTerms: "30 Days", // Default value
            creditLimit: 1000, // Default value
            deliveryBetween: "9am - 5pm", // Default value
          },
    validate: zodResolver(customerFormSchema),
  });

  // Effect to reset form if customerData changes (e.g. if used in a context where it could)
  useEffect(() => {
    if (editMode && customerData) {
      form.setValues({
        code: customerData.code,
        name: customerData.name,
        address: customerData.address,
        city: customerData.city,
        postCode: customerData.postCode,
        mobile: customerData.mobile,
        phone: customerData.phone || "",
        contact: customerData.contact || "",
        creditTerms: customerData.creditTerms,
        creditLimit: customerData.creditLimit,
        deliveryBetween: customerData.deliveryBetween || "",
      });
      form.resetDirty(); // Reset dirty state after setting initial values for edit
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, customerData]); // form.setValues and form.resetDirty are stable

  const handleSubmit = (values: CustomerFormValues) => {
    if (editMode && customerData) {
      // Update existing customer
      const updatedCustomer: Customer = {
        ...customerData, // Keep existing ID
        ...values,
        phone: values.phone || "",
        contact: values.contact || "",
        deliveryBetween: values.deliveryBetween || "",
      };
      console.log("Updated Customer Data:", updatedCustomer);
      alert(`Customer ${updatedCustomer.name} would be updated (see console).`);
      // In a real app, update dummyCustomers array or API call
      // const index = dummyCustomers.findIndex(c => c.id === customerData.id);
      // if (index !== -1) dummyCustomers[index] = updatedCustomer;
      navigate({
        to: "/customer/$customerId/detail",
        params: { customerId: customerData.id },
      });
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: uuidv4(),
        ...values,
        phone: values.phone || "",
        contact: values.contact || "",
        deliveryBetween: values.deliveryBetween || "",
      };
      console.log("New Customer Data:", newCustomer);
      alert(`Customer ${newCustomer.name} would be added (see console).`);
      // dummyCustomers.push(newCustomer);
      navigate({ to: "/customers" });
    }
  };

  const pageTitle = editMode
    ? `Edit: ${customerData?.name || "Customer"}`
    : "Add New Customer";
  const backButtonLink =
    editMode && customerData
      ? `/customer/${customerData.id}/detail`
      : "/customers";

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate({ to: backButtonLink });
    }
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header
        p="sm"
        style={(theme) => ({
          background:
            computedColorScheme === "dark"
              ? theme.colors.dark[5]
              : `linear-gradient(45deg, ${theme.colors.primaryColor[4]}, ${theme.colors.primaryColor[6]})`,
          boxShadow: theme.shadows.sm,
          display: "flex",
          alignItems: "center",
        })}
      >
        <Group justify="space-between" style={{ flexGrow: 1 }}>
          <Group gap="xs">
            <ActionIcon
              onClick={handleCancel}
              variant="transparent"
              title={editMode ? "Back to Details" : "Back to Customers"}
              size="lg"
            >
              <IconArrowLeft size="1.5rem" color="white" />
            </ActionIcon>
          </Group>

          <Group align="center">
            <IconUsers
              size="1.8rem"
              color="white"
              style={{ marginRight: "var(--mantine-spacing-xs)" }}
            />
            <Title order={3} c="white">
              {pageTitle}
            </Title>
          </Group>

          <ActionIcon
            variant="transparent"
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            size="lg"
          >
            {computedColorScheme === "dark" ? (
              <IconSun size="1.2rem" color="white" />
            ) : (
              <IconMoon size="1.2rem" color="white" />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Main
        style={(theme) => ({
          padding: 0,
          backgroundColor:
            computedColorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
      >
        <Container
          size="md"
          py="xl"
          styles={{
            root: {
              padding: 0,
            },
          }}
        >
          <Paper withBorder shadow="md" p="lg" radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Stack>
                  <TextInput
                    label="Customer Name"
                    placeholder="Enter customer name"
                    required
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Customer Code"
                    placeholder="Enter unique customer code (e.g., CUST00X)"
                    required
                    {...form.getInputProps("code")}
                  />
                  <TextInput
                    label="Contact Person"
                    placeholder="Enter contact person's name"
                    {...form.getInputProps("contact")}
                  />
                </Stack>
                <Stack>
                  <TextInput
                    label="Mobile Number"
                    placeholder="Enter mobile number (e.g., 07xxxxxxxxx)"
                    required
                    {...form.getInputProps("mobile")}
                  />
                  <TextInput
                    label="Phone Number (Optional)"
                    placeholder="Enter landline number"
                    {...form.getInputProps("phone")}
                  />
                  <TextInput
                    label="Delivery Slot (Optional)"
                    placeholder="e.g., 9am - 1pm"
                    {...form.getInputProps("deliveryBetween")}
                  />
                </Stack>
              </SimpleGrid>

              <Title order={4} mt="xl" mb="md">
                Address
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <TextInput
                  label="Street Address"
                  placeholder="Enter street address"
                  required
                  {...form.getInputProps("address")}
                />
                <TextInput
                  label="City"
                  placeholder="Enter city"
                  required
                  {...form.getInputProps("city")}
                />
                <TextInput
                  label="Postcode"
                  placeholder="Enter postcode"
                  required
                  {...form.getInputProps("postCode")}
                />
              </SimpleGrid>

              <Title order={4} mt="xl" mb="md">
                Credit Information
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <TextInput
                  label="Credit Terms"
                  placeholder="e.g., 30 Days, COD"
                  required
                  {...form.getInputProps("creditTerms")}
                />
                <NumberInput
                  label="Credit Limit (£)"
                  placeholder="Enter credit limit"
                  required
                  min={0}
                  allowDecimal={false}
                  {...form.getInputProps("creditLimit")}
                />
              </SimpleGrid>

              <Group justify="flex-end" mt="xl">
                <Button
                  variant="default"
                  onClick={handleCancel}
                  leftSection={<IconArrowLeft size={14} />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconDeviceFloppy size={14} />}
                >
                  {editMode ? "Update Customer" : "Save Customer"}
                </Button>
              </Group>
            </form>
          </Paper>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
