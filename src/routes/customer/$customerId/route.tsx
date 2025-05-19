import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
  notFound,
  useMatchRoute,
} from "@tanstack/react-router";
import {
  AppShell,
  Title,
  Group,
  useComputedColorScheme,
  ActionIcon,
  useMantineColorScheme,
  Container,
  Breadcrumbs,
  Anchor,
  Text,
  Avatar,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconHome,
  IconUsers,
  IconArrowLeft,
} from "@tabler/icons-react";
import { type Customer, dummyCustomers } from "../../../data/customers";

// This layout route will match /customer and its children
export const Route = createFileRoute("/customer/$customerId")({
  loader: async ({ params }) => {
    const customer = dummyCustomers.find((c) => c.id === params.customerId);
    if (!customer) {
      throw notFound(); // Make sure notFound is imported from @tanstack/react-router
    }
    return customer;
  },
  component: CustomerIdLayout,
});

function CustomerIdLayout() {
  const router = useRouter();
  const customer = Route.useLoaderData();
  const computedColorScheme = useComputedColorScheme("light");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const matchRoute = useMatchRoute();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const customerId = customer.id;
  let currentPageTitle: string | null = null;
  let currentPageHref: string | null = null;

  // Use useMatchRoute for a more direct way to get params from the current match
  const orderDetailsMatchParams = useMatchRoute()({
    to: "/customer/$customerId/orders/$orderId/details",
    // We are checking if the CURRENT route matches this, so params should be available if it does
  });

  if (orderDetailsMatchParams) {
    const { customerId: matchedCustId, orderId: matchedOrderId } =
      orderDetailsMatchParams as { customerId: string; orderId: string };
    currentPageTitle = `Order ${matchedOrderId}`;
    currentPageHref = `/customer/${matchedCustId}/orders/${matchedOrderId}/details`;
  } else if (
    matchRoute({
      to: "/customer/$customerId/orders/add",
      params: { customerId }, // customerId is known here
    })
  ) {
    currentPageTitle = "Add Order";
    currentPageHref = `/customer/${customerId}/orders/add`;
  } else if (
    matchRoute({
      to: "/customer/$customerId/collections",
      params: { customerId },
    })
  ) {
    currentPageTitle = "Collections";
    currentPageHref = `/customer/${customerId}/collections`;
  } else if (
    matchRoute({ to: "/customer/$customerId/detail", params: { customerId } })
  ) {
    currentPageTitle = "Details";
    currentPageHref = `/customer/${customerId}/detail`;
  } else if (
    matchRoute({ to: "/customer/$customerId/orders", params: { customerId } })
  ) {
    currentPageTitle = "Orders";
    currentPageHref = `/customer/${customerId}/orders`;
  } else if (
    matchRoute({ to: "/customer/$customerId/returns", params: { customerId } })
  ) {
    currentPageTitle = "Returns";
    currentPageHref = `/customer/${customerId}/returns`;
  } else if (
    matchRoute({
      to: "/customer/$customerId/statement",
      params: { customerId },
    })
  ) {
    currentPageTitle = "Statement";
    currentPageHref = `/customer/${customerId}/statement`;
  } else {
    // This is the customer index page (Menu) - path WITH trailing slash for index route
    currentPageTitle = "Menu";
    currentPageHref = `/customer/${customerId}/`;
  }

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Customers", href: "/customers" },
    { title: customer.name, href: `/customer/${customerId}/` }, // Links to customer menu (index)
  ];

  // If we are on a specific sub-page (and that page isn't the "Menu" itself),
  // add its title to the breadcrumbs.
  if (orderDetailsMatchParams) {
    // Special handling for order details to insert "Orders" link
    const { customerId: matchedCustId, orderId: matchedOrderId } =
      orderDetailsMatchParams as { customerId: string; orderId: string };
    breadcrumbItems.push({
      title: "Orders",
      href: `/customer/${matchedCustId}/orders/`,
    });
    breadcrumbItems.push({
      title: `Order ${matchedOrderId}`,
      href: `/customer/${matchedCustId}/orders/${matchedOrderId}/details`,
    });
  } else if (currentPageTitle && currentPageHref) {
    // For all other pages, add the single current page title
    breadcrumbItems.push({ title: currentPageTitle, href: currentPageHref });
  }
  // If currentPageTitle is "Menu", we don't add it again, as customer.name already serves as its breadcrumb.

  const finalBreadcrumbElements = breadcrumbItems.map((item, index, arr) => (
    <Anchor
      component={Link}
      to={item.href}
      key={index}
      onClick={(e: React.MouseEvent) => {
        if (index === arr.length - 1) {
          e.preventDefault();
        }
      }}
      style={{
        color:
          index === arr.length - 1
            ? computedColorScheme === "dark"
              ? "var(--mantine-color-text)"
              : "var(--mantine-color-black)"
            : computedColorScheme === "dark"
              ? "var(--mantine-color-dimmed)"
              : "var(--mantine-color-primary-7)",
        cursor: index === arr.length - 1 ? "default" : "pointer",
      }}
    >
      <Text component="span" style={{ whiteSpace: "break-spaces" }}>
        {item.title}
      </Text>
    </Anchor>
  ));

  return (
    <AppShell
      padding="md"
      header={{ height: 70 }}
      styles={(theme) => ({
        main: {
          backgroundColor:
            computedColorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        },
      })}
    >
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
        <Group style={{ width: "100%", alignItems: "center" }} wrap="nowrap">
          <Group gap="xs">
            <ActionIcon
              component={Link}
              to="/"
              variant="transparent"
              title="Home"
              size="lg"
            >
              <IconHome size="1.5rem" color="white" />
            </ActionIcon>
          </Group>

          <Group
            align="center"
            justify="center"
            gap="xs"
            wrap="nowrap"
            style={{
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <Avatar color="white" radius="xl" tt="uppercase">
              {getInitials(customer.name)}
            </Avatar>
            <Title
              order={3}
              c="white"
              style={{
                fontSize: "clamp(1.2rem, 2vw, 1.75rem)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {customer.name}
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
      <AppShell.Main>
        <Container size="lg" px={0}>
          <Breadcrumbs mb="md">{finalBreadcrumbElements}</Breadcrumbs>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
