import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AppShell,
  Title,
  Image,
  SimpleGrid,
  Text,
  Group,
  ThemeIcon,
  useComputedColorScheme,
  Container,
  UnstyledButton,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconUsers,
  IconReportAnalytics,
  IconSettings,
  IconChevronRight,
  IconSun,
  IconMoon,
  IconPackage,
} from "@tabler/icons-react";
import logo from "../assets/logo.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

const navLinks = [
  {
    label: "Customer List",
    description: "View and manage your customers",
    icon: IconUsers,
    color: "blue",
    path: "/customers",
  },
  {
    label: "Products",
    description: "View and manage your products",
    icon: IconPackage,
    color: "green",
    path: "/products",
  },
  {
    label: "Reports",
    description: "Generate and view sales reports",
    icon: IconReportAnalytics,
    color: "teal",
    path: "/reports",
  },
  {
    label: "Settings",
    description: "Configure application settings",
    icon: IconSettings,
    color: "violet",
    path: "/settings",
  },
];

function Index() {
  const computedColorScheme = useComputedColorScheme("light");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const items = navLinks.map((item) => (
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
    <AppShell padding="md" header={{ height: 70 }}>
      <AppShell.Header
        p="md"
        style={(theme) => ({
          background:
            computedColorScheme === "dark"
              ? theme.colors.dark[5]
              : `linear-gradient(45deg, ${theme.colors.primaryColor[4]}, ${theme.colors.primaryColor[6]})`,
          boxShadow: theme.shadows.sm,
        })}
      >
        <Group h="100%" px={20} justify="space-between">
          <UnstyledButton component={Link} to="/login" display="inline-block">
            <Group>
              <Image
                src={logo}
                alt="Candy Cloud Delights Logo"
                w={40}
                h={40}
                radius="sm"
              />
              <Title order={3} c="white">
                Candy Cloud
              </Title>
            </Group>
          </UnstyledButton>
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
            computedColorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
      >
        <Container size="lg" py="xl">
          <Title order={2} ta="center" mb="lg" fw={600} c="primaryColor.7">
            Main Menu
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
            {items.map((item) => item)}
          </SimpleGrid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
