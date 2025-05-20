import {
  createFileRoute,
  useParams,
  useLoaderData,
  useNavigate,
  // Link, // No longer directly used in this component's output
} from "@tanstack/react-router";
import {
  Text,
  Title,
  // useComputedColorScheme, // No longer directly used
  Paper,
  SimpleGrid,
  Group,
  Stack,
  Divider,
  ThemeIcon,
  rem,
  Anchor,
  Avatar,
  ActionIcon,
} from "@mantine/core";
import type { Customer } from "../../../data/customers";
import {
  IconUserCircle,
  IconHome,
  IconPhone,
  IconCreditCard,
  IconTruckDelivery,
  IconId,
  IconPencil,
} from "@tabler/icons-react";

// Path matches /customer/$customerId/detail
export const Route = createFileRoute("/customer/$customerId/detail")({
  component: CustomerDetailPage,
});

interface DetailItemProps {
  label: string;
  value: string | number | undefined;
  icon?: React.ReactNode;
}

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <Group wrap="nowrap" gap="xs" align="flex-start">
      {icon && (
        <ThemeIcon variant="light" size="sm" mt={rem(4)}>
          {icon}
        </ThemeIcon>
      )}
      <Stack gap={0}>
        <Text fz="xs" c="dimmed">
          {label}
        </Text>
        {label === "Mobile Number" || (label === "Phone Number" && value) ? (
          <Anchor href={`tel:${value}`} fz="sm" fw={500} underline="hover">
            {value}
          </Anchor>
        ) : (
          <Text fz="sm" fw={500}>
            {value || "N/A"}
          </Text>
        )}
      </Stack>
    </Group>
  );
}

function CustomerDetailPage() {
  // const { customerId: paramCustomerId } = useParams(); // Not strictly needed if parentCustomerData is guaranteed
  const customer = useLoaderData({
    from: "/customer/$customerId", // Adjusted to directly use the layout's loader data
  }) as Customer | undefined;
  const navigate = useNavigate(); // Import and use navigate for the edit button

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!customer) {
    return <Text>Customer data not found.</Text>; // Or a more sophisticated loading/error state
  }

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Stack align="center" mb="md">
        <Group justify="flex-end" style={{ width: "100%" }} mb="sm">
          <ActionIcon
            variant="outline"
            color="blue"
            title="Edit Customer"
            onClick={() =>
              navigate({
                to: "/customers/$customerId/edit",
                params: { customerId: customer.id },
              })
            }
          >
            <IconPencil size={18} />
          </ActionIcon>
        </Group>
        <Avatar size="xl" radius="xl" tt="uppercase">
          {getInitials(customer.name)}
        </Avatar>
      </Stack>
      <Title order={2} mb="xl" ta="center">
        Customer Details
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
        <Stack gap="lg">
          <Title order={4} c="dimmed">
            <Group gap="xs">
              <IconId size="1.2rem" /> General Information
            </Group>
          </Title>
          <DetailItem label="Customer Code" value={customer.code} />
          <DetailItem label="Full Name" value={customer.name} />
        </Stack>

        <Stack gap="lg">
          <Title order={4} c="dimmed">
            <Group gap="xs">
              <IconUserCircle size="1.2rem" /> Contact Details
            </Group>
          </Title>
          <DetailItem label="Contact Person" value={customer.contact} />
          <DetailItem label="Mobile Number" value={customer.mobile} />
          <DetailItem label="Phone Number" value={customer.phone} />
        </Stack>
      </SimpleGrid>

      <Divider my="xl" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
        <Stack gap="lg">
          <Title order={4} c="dimmed">
            <Group gap="xs">
              <IconHome size="1.2rem" /> Address
            </Group>
          </Title>
          <DetailItem label="Street Address" value={customer.address} />
          <DetailItem label="City" value={customer.city} />
          <DetailItem label="Post Code" value={customer.postCode} />
        </Stack>

        <Stack gap="lg">
          <Title order={4} c="dimmed">
            <Group gap="xs">
              <IconCreditCard size="1.2rem" /> Credit Information
            </Group>
          </Title>
          <DetailItem label="Credit Terms" value={customer.creditTerms} />
          <DetailItem
            label="Credit Limit"
            value={`£${customer.creditLimit.toLocaleString()}`}
          />
        </Stack>
      </SimpleGrid>

      <Divider my="xl" />

      <Stack gap="lg">
        <Title order={4} c="dimmed">
          <Group gap="xs">
            <IconTruckDelivery size="1.2rem" /> Delivery Information
          </Group>
        </Title>
        <DetailItem
          label="Preferred Delivery Slot"
          value={customer.deliveryBetween}
        />
      </Stack>
    </Paper>
  );
}
