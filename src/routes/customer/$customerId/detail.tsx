import {
  createFileRoute,
  useLoaderData,
  notFound,
  Link,
} from "@tanstack/react-router";
import {
  Text,
  Title,
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
  AppShell,
  useMantineColorScheme,
  useComputedColorScheme,
  Button,
} from "@mantine/core";
import {
  IconUserCircle,
  IconHome,
  IconPhone,
  IconCreditCard,
  IconTruckDelivery,
  IconId,
  IconPencil,
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import type { Customer } from "../../../data/customers";
import { dummyCustomers } from "../../../data/customers";
import { CustomerFormPage } from "../../customers/add";

export const Route = createFileRoute("/customer/$customerId/detail")({
  loader: async ({ params }) => {
    const customer = dummyCustomers.find((c) => c.id === params.customerId);
    if (!customer) throw notFound();
    return customer;
  },
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
  const customer = Route.useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const pageTitle = isEditing ? `Edit: ${customer.name}` : "Customer Details";

  if (isEditing) {
    // The CustomerFormPage includes its own AppShell, so we render it directly
    return (
      <CustomerFormPage
        editMode={true}
        customerData={customer}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // The detail view with its own AppShell
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
              component={Link}
              to="/customers"
              variant="transparent"
              title="Back to Customers"
              size="lg"
            >
              <IconArrowLeft size="1.5rem" color="white" />
            </ActionIcon>
          </Group>
          <Group align="center">
            <IconUser
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
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack align="center" mb="md">
            <Group justify="flex-end" style={{ width: "100%" }} mb="sm">
              <Button
                leftSection={<IconPencil size={14} />}
                onClick={() => setIsEditing(true)}
              >
                Edit Customer
              </Button>
            </Group>
            <Avatar size="xl" radius="xl" tt="uppercase">
              {getInitials(customer.name)}
            </Avatar>
          </Stack>
          <Title order={2} mb="xl" ta="center">
            {customer.name}
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
      </AppShell.Main>
    </AppShell>
  );
}
