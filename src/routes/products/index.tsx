import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import "@mantine/core/styles.css";
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
  TextInput,
  rem,
  useMantineTheme,
  Flex, // Keep Flex for price display
  Box, // Added Box import
  Affix, // Import Affix
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconHome,
  IconPackage, // For products page title
  IconSearch,
  IconCurrencyPound, // For price display
  IconPlus, // Import IconPlus
} from "@tabler/icons-react";
import React, { useState, useMemo } from "react";
import { type Product, dummyProducts } from "../../data/products";

// Product Card Component
interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card
      shadow="sm"
      padding="sm" // Reduced padding for a smaller feel
      radius="md"
      style={{
        border: `0.5px solid ${
          isDark ? theme.colors.primaryColor[9] : theme.colors.primaryColor[3]
        }`,
        height: "100%", // Allow grid to manage height, or set a fixed one if preferred
      }}
    >
      <Group wrap="nowrap" gap="md" align="center">
        <Box style={{ flexShrink: 0, width: 60, height: 60 }}>
          <Image
            src={product.image}
            alt={product.name}
            fit="cover"
            radius="sm"
          />
        </Box>
        <Flex
          direction="column"
          justify="space-between"
          style={{ flexGrow: 1, overflow: "hidden" }} // Ensure it takes remaining space and handles overflow
        >
          <Title order={5} fw={500} lineClamp={2}>
            {" "}
            {/* Slightly smaller title, allow wrapping */}
            {product.name}
          </Title>
          <Text
            fz="md"
            fw={600}
            c={isDark ? theme.colors.primaryColor[3] : theme.primaryColor}
            mt="xs"
          >
            <IconCurrencyPound
              size="0.9rem"
              style={{ verticalAlign: "middle", marginRight: rem(2) }}
            />
            {product.price.toFixed(2)}
          </Text>
        </Flex>
      </Group>
    </Card>
  );
}

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
});

export function ProductsPage() {
  // Exported for clarity, though createFileRoute handles it
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme("light");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useMantineTheme(); // Get theme for FAB color

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return dummyProducts;
    }
    return dummyProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            <IconPackage
              size="1.8rem"
              color="white"
              style={{ marginRight: "var(--mantine-spacing-xs)" }}
            />
            <Title order={3} c="white">
              Products
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
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
      >
        <Container size="lg" py="md">
          <TextInput
            placeholder="Search by product name or description..."
            mb="sm" // Increased margin bottom for spacing
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
          {filteredProducts.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xs">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/products/$productId/details"
                  params={{ productId: product.id }}
                  style={{ textDecoration: "none" }} // Remove default link underline
                >
                  <ProductCard product={product} />
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <Text ta="center" c="dimmed" mt="xl">
              No products found matching your search.
            </Text>
          )}
        </Container>
      </AppShell.Main>
      <Affix position={{ bottom: 40, right: 35 }}>
        <Box
          style={{
            borderRadius: "9999px",
            boxShadow: theme.shadows.md,
          }}
        >
          <ActionIcon
            component={Link}
            to="/products/add" // Link to the add product page
            variant="filled"
            style={{ width: rem(56), height: rem(56) }}
            radius="xl"
            aria-label="Add new product"
            color={theme.primaryColor}
          >
            <IconPlus style={{ width: rem(28), height: rem(28) }} />
          </ActionIcon>
        </Box>
      </Affix>
    </AppShell>
  );
}
