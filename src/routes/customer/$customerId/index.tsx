import {
  createFileRoute,
  Link,
  useParams,
  useLoaderData,
} from "@tanstack/react-router";
import {
  Title,
  SimpleGrid,
  Text,
  Group,
  ThemeIcon,
  useComputedColorScheme,
  UnstyledButton,
} from "@mantine/core";
import {
  IconReceipt2,
  IconCashBanknote,
  IconTruckReturn,
  IconFileInfo,
  IconUserCircle,
  IconChevronRight,
} from "@tabler/icons-react";
import type { Customer } from "../../../data/customers"; // For typing parentData

// This index route will match /customer/$customerId/
export const Route = createFileRoute("/customer/$customerId/")({
  component: CustomerIdIndexPage,
});

function CustomerIdIndexPage() {
  const { customerId: paramCustomerId } = useParams({
    from: "/customer/$customerId/",
  });
  // Assuming the parent route is '/customer/$customerId'
  // and it has loaded the customer data.
  const parentCustomerData = useLoaderData({
    from: "/customer/$customerId",
  }) as Customer | undefined;

  const customerName = parentCustomerData?.name || "Customer";
  const customerActualId = parentCustomerData?.id || paramCustomerId;
  const computedColorScheme = useComputedColorScheme("light");

  const customerNavLinks = [
    {
      label: "Orders",
      description: "View and manage customer orders",
      icon: IconReceipt2,
      color: "blue",
      path: `/customer/${customerActualId}/orders`,
    },
    {
      label: "Collections",
      description: "Record and track collections",
      icon: IconCashBanknote,
      color: "green",
      path: `/customer/${customerActualId}/collections`,
    },
    {
      label: "Returns",
      description: "Process customer returns",
      icon: IconTruckReturn,
      color: "orange",
      path: `/customer/${customerActualId}/returns`,
    },
    {
      label: "Statement",
      description: "View customer account statement",
      icon: IconFileInfo,
      color: "grape",
      path: `/customer/${customerActualId}/statement`,
    },
    {
      label: "Customer Details",
      description: "View and edit customer information",
      icon: IconUserCircle,
      color: "teal",
      path: `/customer/${customerActualId}/detail`,
    },
  ];

  const items = customerNavLinks.map((item) => (
    <UnstyledButton
      key={item.label}
      component={Link}
      to={item.path}
      style={(theme) => ({
        display: "block",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        border: `1px solid ${
          computedColorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[3]
        }`,
        color:
          computedColorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor:
          computedColorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        boxShadow: theme.shadows.sm,
        transition:
          "box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
        "&:hover": {
          backgroundColor:
            computedColorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          boxShadow: theme.shadows.md,
        },
        "&:active": {
          transform: "scale(0.98)",
          boxShadow: theme.shadows.xs,
        },
      })}
    >
      <Group>
        <ThemeIcon color={item.color} variant="light" size="lg">
          <item.icon size="1.5rem" />
        </ThemeIcon>
        <div>
          <Text size="lg" fw={500}>
            {item.label}
          </Text>
          <Text size="sm" c="dimmed">
            {item.description}
          </Text>
        </div>
        <IconChevronRight size="1rem" style={{ marginLeft: "auto" }} />
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <Title order={2} ta="center" mb="lg" fw={600} c="primaryColor.7">
        Customer Menu
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
        {items}
      </SimpleGrid>
    </>
  );
}
