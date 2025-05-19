import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  AppShell,
  Title,
  Image,
  Group,
  useComputedColorScheme,
  Container,
  ActionIcon,
  useMantineColorScheme,
  Text,
  SimpleGrid,
  Card,
  Avatar,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconArrowLeft,
  IconHome,
  IconUsers,
  IconSearch,
  IconChevronRight,
} from "@tabler/icons-react";
import React, { useState, useMemo } from "react";
import { type Customer, dummyCustomers } from "../../data/customers";

// Customer Card Component
interface CustomerCardProps {
  customer: Customer;
}

function CustomerCard({ customer }: CustomerCardProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      style={{
        border: `0.5px solid ${
          isDark ? theme.colors.primaryColor[9] : theme.colors.primaryColor[3]
        }`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <Group wrap="nowrap" justify="space-between" align="center">
        <Avatar color="primaryColor" radius="xl" size="md">
          {initials}
        </Avatar>
        <div
          style={{
            flexGrow: 1,
            minWidth: 0,
            overflow: "hidden",
            margin: `0 ${theme.spacing.xs}`,
          }}
        >
          <Text fz="lg" fw={500} truncate="end">
            {customer.name}
          </Text>
          <Text fz="sm" c="dimmed" truncate="end">
            {customer.address}, {customer.city}, {customer.postCode}
          </Text>
        </div>
        <IconChevronRight
          style={{ width: rem(24), height: rem(24), flexShrink: 0 }}
          color={isDark ? theme.colors.dark[2] : theme.colors.gray[6]}
        />
      </Group>
    </Card>
  );
}

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
});

function CustomersPage() {
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme("light");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return dummyCustomers;
    }
    return dummyCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.postCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <AppShell header={{ height: 70 }}>
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
              to="/"
              variant="transparent"
              title="Go to Home"
              size="lg"
            >
              <IconHome size="1.5rem" color="white" />
            </ActionIcon>
          </Group>

          <Group align="center">
            <IconUsers
              size="1.8rem"
              color="white"
              style={{ marginRight: "var(--mantine-spacing-xs)" }}
            />
            <Title order={3} c="white">
              Customers
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
          backgroundColor:
            useMantineColorScheme().colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
      >
        <Container size="lg" py="sm">
          <TextInput
            placeholder="Search by name, address, city, or postcode..."
            mb="md"
            size="md"
            radius="md"
            leftSection={
              <IconSearch
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            }
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
          {filteredCustomers.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {filteredCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  to="/customer/$customerId"
                  params={{ customerId: customer.id }}
                  style={{ textDecoration: "none" }}
                >
                  <CustomerCard customer={customer} />
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <Text ta="center" c="dimmed">
              No customers found matching your search.
            </Text>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
